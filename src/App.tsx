/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, DailyMenu, Order, OrderElection, AppView } from './types';
import { AuthScreen } from './components/AuthScreen';
import { HeaderBar } from './components/HeaderBar';
import { HomeScreen } from './components/HomeScreen';
import { OrderSelectionScreen } from './components/OrderSelectionScreen';
import { OrderSummaryScreen } from './components/OrderSummaryScreen';
import { FirestoreService } from './services/firestoreService';
import { DEFAULT_USER_PROFILE, INITIAL_MENUS } from './data/mockMenus';
import { auth, signOut, onAuthStateChanged } from './firebase';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('auth');
  const [menus, setMenus] = useState<DailyMenu[]>(INITIAL_MENUS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);
  const [justConfirmedOrder, setJustConfirmedOrder] = useState<boolean>(false);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('10:14');

  // Format real-time or simulated clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const potentialDni = fbUser.email ? fbUser.email.split('@')[0] : '';
        const cleanDni = /^[a-zA-Z0-9]{8,10}$/.test(potentialDni) ? potentialDni.toUpperCase() : '45892147';
        const profile = await FirestoreService.getUserProfileByDni(cleanDni, fbUser.uid);
        setUser(profile);
        setCurrentView('home');
      }
    });

    // Check cached session
    const cachedUser = localStorage.getItem('nova_user_cache');
    if (cachedUser && !user) {
      try {
        const parsed = JSON.parse(cachedUser);
        setUser(parsed);
        setCurrentView('home');
      } catch (e) {
        console.error('Session cache error:', e);
      }
    }

    return () => unsubscribe();
  }, []);

  // Load menus & orders from Firestore whenever user is logged in
  useEffect(() => {
    if (!user) return;
    const currentUser = user;

    let isMounted = true;
    let unsubscribeOrders: (() => void) | undefined;

    async function loadData() {
      try {
        // Load menus from Firestore for the configured range
        const fetchedMenus = await FirestoreService.initializeMenus();
        if (isMounted) {
          setMenus(fetchedMenus);
        }

        // Initial fetch of user orders from Firestore matching DNI
        const userOrders = await FirestoreService.getUserOrders(currentUser.email, currentUser.uid, currentUser.dni);
        if (isMounted) {
          setOrders(userOrders);
          if (userOrders.length > 0) {
            setActiveOrder(userOrders[0]);
          } else {
            setActiveOrder(null);
          }
          setIsFirestoreConnected(FirestoreService.getIsConnected());
        }

        // Real-time synchronization of orders with Firestore matching DNI
        unsubscribeOrders = FirestoreService.subscribeUserOrders(
          currentUser.email,
          currentUser.uid,
          (syncedOrders) => {
            if (!isMounted) return;
            setOrders(syncedOrders);
            if (syncedOrders.length > 0) {
              setActiveOrder((prev) => {
                if (prev) {
                  const matching = syncedOrders.find((o) => o.id === prev.id);
                  return matching || syncedOrders[0];
                }
                return syncedOrders[0];
              });
            } else {
              setActiveOrder(null);
            }
            setIsFirestoreConnected(FirestoreService.getIsConnected());
          },
          currentUser.dni
        );
      } catch (err) {
        console.error('Error loading Firestore data:', err);
      }
    }

    loadData();

    return () => {
      isMounted = false;
      if (unsubscribeOrders) {
        unsubscribeOrders();
      }
    };
  }, [user]);

  // Login handler
  const handleLoginSuccess = async (loggedUser: UserProfile) => {
    setUser(loggedUser);
    localStorage.setItem('nova_user_cache', JSON.stringify(loggedUser));
    setCurrentView('home');
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    localStorage.removeItem('nova_user_cache');
    setUser(null);
    setCurrentView('auth');
    setActiveOrder(null);
  };

  // Submit Order handler (creates or updates order in Firestore)
  const handleSubmitOrder = async (elections: OrderElection[], observations: string) => {
    if (!user) return;
    setIsSaving(true);

    try {
      // Generate unique or retain existing order code
      const orderCode = activeOrder && activeOrder.status !== 'cancelled'
        ? activeOrder.orderCode 
        : `PED-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderId = activeOrder?.id || orderCode;

      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
      const timeFormatted = `${hours}:${minutes} ${ampm}`;

      const electionsWithStatus: OrderElection[] = elections.map((el) => ({
        ...el,
        status: 'pending' as const,
      }));

      const newOrder: Order = {
        id: orderId,
        orderCode,
        userId: user.uid,
        userEmail: user.email,
        userName: user.name,
        userDni: user.dni,
        userDepartment: user.department,
        userCompany: user.company,
        elections: electionsWithStatus,
        observations: observations.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        timeFormatted,
      };

      // Save to Firestore
      await FirestoreService.saveOrder(newOrder);

      // Update state
      setOrders((prev) => {
        const index = prev.findIndex((o) => o.id === newOrder.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = newOrder;
          return updated;
        }
        return [newOrder, ...prev];
      });

      setActiveOrder(newOrder);
      setJustConfirmedOrder(false);
      setCurrentView('ticket');
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel order in Firestore
  const handleCancelOrder = async (orderId: string) => {
    await FirestoreService.cancelOrder(orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    setActiveOrder(null);
    setJustConfirmedOrder(false);
    setCurrentView('home');
  };

  // Confirm order action in ticket
  const handleConfirmOrder = async () => {
    if (!activeOrder) return;
    try {
      const confirmedOrder: Order = {
        ...activeOrder,
        status: 'confirmed',
        elections: activeOrder.elections.map((el) => ({
          ...el,
          status: 'confirmed' as const,
        })),
      };
      await FirestoreService.saveOrder(confirmedOrder);
      setActiveOrder(confirmedOrder);
      setOrders((prev) => prev.map((o) => (o.id === confirmedOrder.id ? confirmedOrder : o)));
      setJustConfirmedOrder(true);
      setCurrentView('home');
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f1f3f5] font-sans flex flex-col justify-between selection:bg-red-600 selection:text-white">
      {/* If not logged in, show AuthScreen directly */}
      {!user || currentView === 'auth' ? (
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Mobile App Header Bar */}
          <HeaderBar
            currentView={currentView}
            onNavigateHome={() => setCurrentView('home')}
            onLogout={handleLogout}
            timeString={currentTimeStr}
          />

          {/* Screen Content Switching */}
          <main className="flex-1">
            {currentView === 'home' && (
              <HomeScreen
                user={user}
                orders={orders}
                onGoToOrder={() => setCurrentView('order')}
                onGoToViewOrder={() => {
                  if (orders.length > 0) {
                    setActiveOrder(orders[0]);
                    setCurrentView('ticket');
                  } else {
                    setCurrentView('order');
                  }
                }}
                isFirestoreConnected={isFirestoreConnected}
                justConfirmedOrder={justConfirmedOrder}
              />
            )}

            {currentView === 'order' && (
              <OrderSelectionScreen
                user={user}
                menus={menus}
                existingOrder={activeOrder}
                orders={orders}
                onSubmitOrder={handleSubmitOrder}
                onCancel={() => setCurrentView('home')}
                isSaving={isSaving}
              />
            )}

            {currentView === 'ticket' && activeOrder && (
              <OrderSummaryScreen
                order={activeOrder}
                user={user}
                onModifyOrder={() => {
                  if (activeOrder.status === 'confirmed') {
                    alert('Este pedido se encuentra en estado "CONFIRMAR PEDIDO" y está bloqueado. Las modificaciones deben gestionarse directamente con Recursos Humanos (RRHH).');
                    return;
                  }
                  setCurrentView('order');
                }}
                onCancelOrder={handleCancelOrder}
                onConfirmOrder={handleConfirmOrder}
                onReturnToHome={() => setCurrentView('home')}
                showSuccessToast={justConfirmedOrder}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
