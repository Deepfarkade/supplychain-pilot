// Notification API Service
// This provides a simple way to add notifications from anywhere in the app

export interface NotificationRequest {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

class NotificationAPI {
  /**
   * Add a notification to the system
   * @param message - The notification message
   * @param type - The type of notification (default: 'info')
   */
  addNotification(message: string, type: NotificationRequest['type'] = 'info') {
    // Dispatch custom event that the NotificationContext listens for
    const event = new CustomEvent('addNotification', {
      detail: { message, type }
    });
    window.dispatchEvent(event);
  }

  /**
   * Add a success notification
   */
  success(message: string) {
    this.addNotification(message, 'success');
  }

  /**
   * Add an error notification
   */
  error(message: string) {
    this.addNotification(message, 'error');
  }

  /**
   * Add a warning notification
   */
  warning(message: string) {
    this.addNotification(message, 'warning');
  }

  /**
   * Add an info notification
   */
  info(message: string) {
    this.addNotification(message, 'info');
  }

  /**
   * Simulate API endpoint for adding notifications
   * In a real app, this would make HTTP requests to your backend
   */
  async sendNotificationFromServer(notificationRequest: NotificationRequest): Promise<void> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Simulate server-side notification processing
      console.log('Notification sent from server:', notificationRequest);
      
      // Add the notification to the client
      this.addNotification(notificationRequest.message, notificationRequest.type);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const notificationAPI = new NotificationAPI();

// Export the class for testing/custom instances
export { NotificationAPI };