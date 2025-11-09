import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './config';

/**
 * Request notification permission and get FCM token
 */
export const requestNotificationPermission = async () => {
  try {
    if (!messaging) {
      console.log('Messaging not supported in this browser');
      return null;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      });
      
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('Notification permission denied.');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

/**
 * Listen for foreground messages
 */
export const onMessageListener = () => {
  return new Promise((resolve) => {
    if (!messaging) {
      resolve(null);
      return;
    }

    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      resolve(payload);
    });
  });
};

/**
 * Save FCM token to user profile
 */
export const saveFCMToken = async (userId, token) => {
  try {
    const { updateUserProfile } = await import('./auth');
    await updateUserProfile(userId, { fcmToken: token });
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};
