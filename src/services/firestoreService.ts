import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query,
  where,
  deleteDoc, 
  updateDoc,
  onSnapshot,
  handleFirestoreError,
  OperationType
} from '../firebase';
import { DailyMenu, Order, UserProfile } from '../types';
import { INITIAL_MENUS, DEFAULT_USER_PROFILE } from '../data/mockMenus';
import { generateMonthMenus, generateDateRangeMenus } from '../utils/calendarUtils';

const ORDERS_COLLECTION = 'orders';
const MENUS_COLLECTION = 'menus';
const USERS_COLLECTION = 'users';

// Storage keys for backup cache
const CACHE_ORDERS_KEY = 'nova_orders_cache';
const CACHE_USER_KEY = 'nova_user_cache';

export class FirestoreService {
  private static isConnectedToFirestore = true;

  // Check connectivity status
  static getIsConnected(): boolean {
    return this.isConnectedToFirestore;
  }

  // Initialize and load menus from Firestore for the configured range (31-08-2026 to 30-09-2026)
  static async initializeMenus(): Promise<DailyMenu[]> {
    try {
      const rangeMenus = generateDateRangeMenus('2026-08-31', '2026-09-30');
      const menusCol = collection(db, MENUS_COLLECTION);
      const snapshot = await getDocs(menusCol);

      const existingMap: Record<string, DailyMenu> = {};
      if (!snapshot.empty) {
        snapshot.forEach((docSnap) => {
          const m = docSnap.data() as DailyMenu;
          existingMap[m.date] = m;
        });
      }

      // Ensure every working day in the range is seeded into Firestore
      const finalMenus: DailyMenu[] = [];
      for (const menu of rangeMenus) {
        if (existingMap[menu.date]) {
          finalMenus.push(existingMap[menu.date]);
        } else {
          // Seed missing working day into Firestore
          try {
            await setDoc(doc(db, MENUS_COLLECTION, menu.id), menu);
          } catch (e) {
            console.warn('Could not seed menu to Firestore:', menu.date, e);
          }
          finalMenus.push(menu);
        }
      }

      finalMenus.sort((a, b) => a.date.localeCompare(b.date));
      this.isConnectedToFirestore = true;
      return finalMenus;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, MENUS_COLLECTION);
      this.isConnectedToFirestore = false;
      return generateDateRangeMenus('2026-08-31', '2026-09-30');
    }
  }

  // Convert DNI or C.E. to Firebase Auth formatted email
  static dniToEmail(dni: string): string {
    const cleanDni = dni.replace(/[^a-zA-Z0-9]/g, '').trim().toLowerCase();
    return `${cleanDni}@nova.pe`;
  }

  // Get User Profile by DNI / C.E. or UID
  static async getUserProfileByDni(dni: string, uid?: string): Promise<UserProfile> {
    const cleanDni = dni.replace(/[^a-zA-Z0-9]/g, '').trim().toUpperCase();
    try {
      // 1. Direct document check by UID
      if (uid) {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const profile = snap.data() as UserProfile;
          localStorage.setItem(CACHE_USER_KEY, JSON.stringify(profile));
          this.isConnectedToFirestore = true;
          return profile;
        }
      }

      // 2. Direct document check by ID 'usr-' + DNI
      const dniDocRef = doc(db, USERS_COLLECTION, `usr-${cleanDni}`);
      const dniSnap = await getDoc(dniDocRef);
      if (dniSnap.exists()) {
        const profile = dniSnap.data() as UserProfile;
        localStorage.setItem(CACHE_USER_KEY, JSON.stringify(profile));
        this.isConnectedToFirestore = true;
        return profile;
      }

      // 3. Query users collection by 'dni' field
      if (cleanDni) {
        const usersCol = collection(db, USERS_COLLECTION);
        const q = query(usersCol, where('dni', '==', cleanDni));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          const profile = querySnap.docs[0].data() as UserProfile;
          localStorage.setItem(CACHE_USER_KEY, JSON.stringify(profile));
          this.isConnectedToFirestore = true;
          return profile;
        }
      }

      // 4. Default demo user profile for DNI 45892147
      if (cleanDni === '45892147') {
        const defaultProfile: UserProfile = {
          ...DEFAULT_USER_PROFILE,
          uid: uid || `usr-${cleanDni}`,
        };
        await setDoc(doc(db, USERS_COLLECTION, defaultProfile.uid), defaultProfile, { merge: true });
        localStorage.setItem(CACHE_USER_KEY, JSON.stringify(defaultProfile));
        return defaultProfile;
      }

      // 5. Create new registered employee profile
      const targetUid = uid || `usr-${cleanDni || 'default'}`;
      const newProfile: UserProfile = {
        uid: targetUid,
        email: `${cleanDni.toLowerCase()}@nova.pe`,
        name: `Empleado Doc. ${cleanDni}`,
        dni: cleanDni,
        department: 'Producción Metalmecánica',
        company: 'Planta Nova',
        verified: true,
      };

      await setDoc(doc(db, USERS_COLLECTION, targetUid), newProfile, { merge: true });
      localStorage.setItem(CACHE_USER_KEY, JSON.stringify(newProfile));
      this.isConnectedToFirestore = true;
      return newProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, USERS_COLLECTION);
      const cached = localStorage.getItem(CACHE_USER_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // ignore
        }
      }
      return {
        ...DEFAULT_USER_PROFILE,
        dni: cleanDni || DEFAULT_USER_PROFILE.dni,
        uid: uid || `usr-${cleanDni || '45892147'}`,
      };
    }
  }

  // Save or update user profile in Firestore
  static async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, profile.uid);
      await setDoc(userRef, profile, { merge: true });
      localStorage.setItem(CACHE_USER_KEY, JSON.stringify(profile));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, USERS_COLLECTION);
    }
  }

  // Get User Profile or create default
  static async getUserProfile(uid: string, email: string): Promise<UserProfile> {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const profile = snap.data() as UserProfile;
        localStorage.setItem(CACHE_USER_KEY, JSON.stringify(profile));
        this.isConnectedToFirestore = true;
        return profile;
      }

      // If user profile doesn't exist yet in Firestore
      const isSoporte = email.toLowerCase().includes('soporte_tecnico') || email.toLowerCase().includes('carlos');
      const newProfile: UserProfile = isSoporte ? DEFAULT_USER_PROFILE : {
        uid,
        email,
        name: email.split('@')[0].replace(/[._-]/g, ' ').toUpperCase(),
        dni: '4' + Math.floor(1000000 + Math.random() * 9000000),
        department: 'Producción Metalmecánica',
        company: 'Planta Nova',
        verified: true,
      };

      await setDoc(userRef, newProfile);
      localStorage.setItem(CACHE_USER_KEY, JSON.stringify(newProfile));
      this.isConnectedToFirestore = true;
      return newProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, USERS_COLLECTION);
      const cached = localStorage.getItem(CACHE_USER_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // fallback
        }
      }
      return DEFAULT_USER_PROFILE;
    }
  }

  // Save new Order in Firestore
  static async saveOrder(order: Order): Promise<boolean> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, order.id);
      await setDoc(orderRef, order, { merge: true });
      
      // Update cache
      this.updateLocalOrdersCache(order);
      this.isConnectedToFirestore = true;
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, ORDERS_COLLECTION);
      this.updateLocalOrdersCache(order);
      return true;
    }
  }

  // Real-time listener for user orders in Firestore (matches by DNI, Email, or UID)
  static subscribeUserOrders(
    userEmail: string, 
    userId: string | undefined, 
    onUpdate: (orders: Order[]) => void,
    userDni?: string
  ): () => void {
    try {
      const ordersCol = collection(db, ORDERS_COLLECTION);
      const unsubscribe = onSnapshot(ordersCol, (snapshot) => {
        const orders: Order[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Order;
          const matchDni = userDni && data.userDni && data.userDni === userDni;
          const matchEmail = data.userEmail && userEmail && data.userEmail.toLowerCase() === userEmail.toLowerCase();
          const matchUid = userId && data.userId === userId;

          if (matchDni || matchEmail || matchUid) {
            orders.push(data);
          }
        });

        // Sort by creation date descending
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        localStorage.setItem(CACHE_ORDERS_KEY, JSON.stringify(orders));
        this.isConnectedToFirestore = true;
        onUpdate(orders);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
        // Fallback to local cache if offline
        const cached = localStorage.getItem(CACHE_ORDERS_KEY);
        if (cached) {
          try {
            onUpdate(JSON.parse(cached));
          } catch {
            // ignore
          }
        }
      });

      return unsubscribe;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
      return () => {};
    }
  }

  // Get orders for a specific user (matches by DNI, Email, or UID)
  static async getUserOrders(userEmail: string, userId?: string, userDni?: string): Promise<Order[]> {
    try {
      const ordersCol = collection(db, ORDERS_COLLECTION);
      const snapshot = await getDocs(ordersCol);
      
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Order;
        const matchDni = userDni && data.userDni && data.userDni === userDni;
        const matchEmail = data.userEmail && userEmail && data.userEmail.toLowerCase() === userEmail.toLowerCase();
        const matchUid = userId && data.userId === userId;

        if (matchDni || matchEmail || matchUid) {
          orders.push(data);
        }
      });

      // Sort by creation date descending
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Save to local cache
      localStorage.setItem(CACHE_ORDERS_KEY, JSON.stringify(orders));
      this.isConnectedToFirestore = true;
      return orders;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
      const cached = localStorage.getItem(CACHE_ORDERS_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          return [];
        }
      }
      return [];
    }
  }

  // Cancel order in Firestore
  static async cancelOrder(orderId: string): Promise<boolean> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      await deleteDoc(orderRef);
      
      // Remove from cache
      const cached = localStorage.getItem(CACHE_ORDERS_KEY);
      if (cached) {
        const orders: Order[] = JSON.parse(cached);
        const filtered = orders.filter((o) => o.id !== orderId);
        localStorage.setItem(CACHE_ORDERS_KEY, JSON.stringify(filtered));
      }
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, ORDERS_COLLECTION);
      const cached = localStorage.getItem(CACHE_ORDERS_KEY);
      if (cached) {
        const orders: Order[] = JSON.parse(cached);
        const filtered = orders.filter((o) => o.id !== orderId);
        localStorage.setItem(CACHE_ORDERS_KEY, JSON.stringify(filtered));
      }
      return true;
    }
  }

  // Update order status or elections in Firestore
  static async updateOrder(order: Order): Promise<boolean> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, order.id);
      await updateDoc(orderRef, { ...order });
      this.updateLocalOrdersCache(order);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, ORDERS_COLLECTION);
      this.updateLocalOrdersCache(order);
      return true;
    }
  }

  private static updateLocalOrdersCache(order: Order) {
    const cached = localStorage.getItem(CACHE_ORDERS_KEY);
    let orders: Order[] = [];
    if (cached) {
      try {
        orders = JSON.parse(cached);
      } catch {
        orders = [];
      }
    }
    const index = orders.findIndex((o) => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
    } else {
      orders.unshift(order);
    }
    localStorage.setItem(CACHE_ORDERS_KEY, JSON.stringify(orders));
  }
}
