import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string, type?: Notification['type']) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'Welcome to SupplyChain AI Studio! Your account has been successfully activated.',
      type: 'success',
      timestamp: new Date(Date.now() - 30000),
      read: false
    },
    {
      id: '2', 
      message: 'New supply chain optimization features are now available in the App Store.',
      type: 'info',
      timestamp: new Date(Date.now() - 300000),
      read: false
    },
    {
      id: '3',
      message: 'Scheduled maintenance will occur this weekend from 2-4 AM EST.',
      type: 'warning',
      timestamp: new Date(Date.now() - 600000),
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Simulate API call for adding notifications
  useEffect(() => {
    const handleAddNotification = (event: CustomEvent) => {
      const { message, type } = event.detail;
      addNotification(message, type);
    };

    window.addEventListener('addNotification', handleAddNotification as EventListener);
    return () => window.removeEventListener('addNotification', handleAddNotification as EventListener);
  }, []);

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};