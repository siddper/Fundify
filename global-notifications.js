// Global Notification System for Fundify
// This file should be included on all pages to handle reminder notifications

const API_BASE = 'http://127.0.0.1:8000';

// Get user email from localStorage
function getUserEmail() {
  return localStorage.getItem('fundify_user_email');
}

// Check if notifications are disabled for the user
async function fetchNotificationsSetting() {
  try {
    const userEmail = getUserEmail();
    if (!userEmail) return false; // Default to enabled if no user email
    
    const res = await fetch(`${API_BASE}/user-info?email=${encodeURIComponent(userEmail)}`);
    const data = await res.json();
    if (data.success && data.user && data.user.disable_reminder_notifications) {
      return true; // notifications are disabled
    } else {
      return false; // notifications are enabled
    }
  } catch { 
    return false; // default to enabled if error
  }
}

// Fetch reminders from the API
async function fetchReminders() {
  try {
    const userEmail = getUserEmail();
    if (!userEmail) return [];
    
    const res = await fetch(`${API_BASE}/reminders?email=${encodeURIComponent(userEmail)}`);
    const data = await res.json();
    return data.success ? data.reminders : [];
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return [];
  }
}

// Helper to check if two date+time strings match current time (to the minute)
function isReminderDue(reminder) {
  const now = new Date();
  const [mm, dd, yyyy] = reminder.date.split('/').map(Number);
  const timeMatch = reminder.time.match(/(\d{1,2}):(\d{2}) (AM|PM)/);
  if (!timeMatch) {
    console.log('Time format not recognized:', reminder.time);
    return false;
  }
  let [_, h, m, ampm] = timeMatch;
  h = Number(h);
  m = Number(m);
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  const reminderDate = new Date(yyyy, mm - 1, dd, h, m);
  // Only compare up to the minute
  reminderDate.setSeconds(0, 0);
  now.setSeconds(0, 0);
  
  return reminderDate <= now;
}

// Track notified reminders to avoid duplicate notifications
function getNotifiedKeys() {
  try {
    return JSON.parse(localStorage.getItem('fundify_reminders_notified') || '[]');
  } catch { return []; }
}

function setNotifiedKeys(keys) {
  localStorage.setItem('fundify_reminders_notified', JSON.stringify(keys));
}

function makeReminderKey(reminder) {
  return `${reminder.id}|${reminder.date}|${reminder.time}`;
}

// Main function to check for notifications
async function checkRemindersForNotification() {
  // Check if user is logged in
  const userEmail = getUserEmail();
  if (!userEmail) {
    return; // No user logged in, skip notification check
  }

  const notificationsDisabled = await fetchNotificationsSetting();
  if (notificationsDisabled) {
    console.log('Reminder notifications are disabled by user setting.');
    return;
  }

  if (!('Notification' in window) || Notification.permission !== 'granted') {
    console.log('Notifications not available or permission not granted');
    return;
  }

  const reminders = await fetchReminders();
  let notifiedKeys = getNotifiedKeys();

  // Clean up old keys (keep only today and future)
  const today = new Date();
  today.setHours(0,0,0,0);
  notifiedKeys = notifiedKeys.filter(key => {
    // Handle both old format (just ID) and new format (id|date|time)
    if (typeof key === 'number' || !key.includes('|')) {
      // Old format - remove it
      return false;
    }
    
    try {
      const parts = key.split('|');
      if (parts.length < 2) return false; // Invalid format
      
      const date = parts[1];
      const [mm, dd, yyyy] = date.split('/').map(Number);
      const keyDate = new Date(yyyy, mm - 1, dd);
      keyDate.setHours(0,0,0,0);
      return keyDate >= today;
    } catch (e) {
      console.log('Error parsing notification key:', key, e);
      return false; // Remove invalid keys
    }
  });

  reminders.forEach((reminder) => {
    const isDue = isReminderDue(reminder);
    const key = makeReminderKey(reminder);
    const alreadyNotified = notifiedKeys.includes(key);
    
    if (!alreadyNotified && isDue) {
      console.log('Sending notification for reminder:', reminder);
      new Notification('Fundify Reminder', {
        body: `${reminder.description}\n$${parseFloat(reminder.amount).toFixed(2)} at ${reminder.time} on ${reminder.date}`,
        icon: 'fundifyIcon.png',
        tag: `reminder-${reminder.id}`, // Prevent duplicate notifications
        requireInteraction: false
      });
      notifiedKeys.push(key);
    }
  });
  
  setNotifiedKeys(notifiedKeys);
}

// Initialize the notification system
function initGlobalNotifications() {
  // Request notification permission on page load
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  // Start checking for notifications every 3 seconds
  setInterval(checkRemindersForNotification, 3000);
  
  // Also check immediately when the page loads
  checkRemindersForNotification();
  
  console.log('Global notification system initialized - checking every 3 seconds');
}

// Start the notification system when the DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobalNotifications);
} else {
  // DOM is already loaded
  initGlobalNotifications();
} 