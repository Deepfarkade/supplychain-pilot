/**
 * Notification Service - Centralized notification management
 */

import { apiClient } from './api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationCreate {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  userId?: string;
  metadata?: Record<string, unknown>;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: Array<(notifications: Notification[]) => void> = [];

  constructor() {
    this.loadNotifications();
    this.initializeDefaultNotifications();
  }

  /**
   * Get all notifications
   */
  async getNotifications(): Promise<Notification[]> {
    try {
      // In production, this would fetch from your backend
      const response = await apiClient.get<Notification[]>('/notifications');
      this.notifications = response;
      this.notifyListeners();
      return response;
    } catch (error) {
      // Fallback to local storage for now
      return this.getLocalNotifications();
    }
  }

  /**
   * Get unread notifications count
   */
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  /**
   * Create a new notification
   */
  async createNotification(notification: NotificationCreate): Promise<Notification> {
    try {
      // In production, this would send to your backend
      const response = await apiClient.post<Notification>('/notifications', notification);
      this.notifications.unshift(response);
      this.saveLocalNotifications();
      this.notifyListeners();
      return response;
    } catch (error) {
      // Fallback to local creation
      return this.createLocalNotification(notification);
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      // Fallback to local update
      console.warn('Failed to mark notification as read on server, updating locally');
    }

    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveLocalNotifications();
      this.notifyListeners();
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.put('/notifications/read-all');
    } catch (error) {
      console.warn('Failed to mark all notifications as read on server, updating locally');
    }

    this.notifications.forEach(n => n.read = true);
    this.saveLocalNotifications();
    this.notifyListeners();
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.warn('Failed to delete notification on server, updating locally');
    }

    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveLocalNotifications();
    this.notifyListeners();
  }

  /**
   * Subscribe to notification updates
   */
  subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.listeners.push(callback);
    
    // Immediately call with current notifications
    callback(this.notifications);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Send notification via API (for external systems)
   */
  async sendNotification(notification: NotificationCreate): Promise<boolean> {
    try {
      await apiClient.post('/notifications/send', notification);
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  // Private methods for local storage fallback
  private loadNotifications(): void {
    try {
      const stored = localStorage.getItem('app_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })).filter((n: Notification) => 
          n.timestamp instanceof Date && !isNaN(n.timestamp.getTime())
        );
      }
    } catch (error) {
      console.warn('Failed to load notifications from storage:', error);
      this.notifications = [];
    }
  }

  private saveLocalNotifications(): void {
    try {
      localStorage.setItem('app_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.warn('Failed to save notifications to storage:', error);
    }
  }

  private getLocalNotifications(): Notification[] {
    return [...this.notifications];
  }

  private createLocalNotification(notification: NotificationCreate): Notification {
    const now = new Date();
    const newNotification: Notification = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...notification,
      timestamp: now,
      read: false
    };

    this.notifications.unshift(newNotification);
    this.saveLocalNotifications();
    this.notifyListeners();
    
    return newNotification;
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback([...this.notifications]));
  }

  /**
   * Initialize default notifications for demo
   */
  private initializeDefaultNotifications(): void {
    if (this.notifications.length === 0) {
      const defaultNotifications: NotificationCreate[] = [
        {
          title: 'Welcome to SupplyChain AI Studio',
          message: 'Your AI-powered supply chain management platform is ready to use.',
          type: 'success'
        },
        {
          title: 'System Update Available',
          message: 'A new version with enhanced AI capabilities is available for download.',
          type: 'info'
        },
        {
          title: 'Inventory Alert',
          message: 'Low stock detected for 5 items in your inventory. Review recommended.',
          type: 'warning'
        }
      ];

      defaultNotifications.forEach(notification => {
        this.createLocalNotification(notification);
      });
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Convenience function for quick notifications
export const showNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  return notificationService.createNotification({ title, message, type });
};