import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import { Note } from '@/types/note';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const notifiedReminderIds = new Set<string>();

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (window.Notification.permission === 'default') {
          await window.Notification.requestPermission();
        }
        return window.Notification.permission === 'granted';
      }
      return true;
    }
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      return finalStatus === 'granted';
    } catch {
      return false;
    }
  },

  async scheduleNoteReminder(noteId: string, title: string, body: string, triggerDate: Date, collaborators?: string[]): Promise<string | null> {
    await this.requestPermissions();

    try {
      const now = new Date();
      if (triggerDate <= now) {
        throw new Error('Thời gian nhắc nhở phải ở tương lai.');
      }

      await this.cancelNoteReminder(noteId);

      const secondsFromNow = Math.max(1, Math.floor((triggerDate.getTime() - now.getTime()) / 1000));
      const sharedInfo = collaborators && collaborators.length > 0 ? ` (Đã thông báo cho ${collaborators.length} người cộng tác)` : '';

      if (Platform.OS === 'web') {
        setTimeout(() => {
          this.triggerInstantNotification(`⏰ Nhắc nhở ghi chú: ${title}`, (body || 'Đã đến thời gian nhắc nhở!') + sharedInfo);
        }, secondsFromNow * 1000);
        return `web-timer-${noteId}`;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ Nhắc nhở: ${title}`,
          body: (body || 'Đã đến thời gian nhắc nhở ghi chú của bạn!') + sharedInfo,
          data: { noteId, collaborators },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsFromNow,
        },
      });

      return notificationId;
    } catch (err: any) {
      console.error('Lỗi lên lịch thông báo:', err);
      return null;
    }
  },

  async cancelNoteReminder(notificationId: string): Promise<void> {
    try {
      if (notificationId && Platform.OS !== 'web') {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
    } catch (err) {
      // Ignored
    }
  },

  triggerInstantNotification(title: string, body: string) {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
      try {
        new window.Notification(title, { body, icon: '/favicon.ico' });
      } catch (e) {
        alert(`${title}\n${body}`);
      }
    } else {
      Alert.alert(title, body);
    }
  },

  // Kiểm tra thời gian nhắc nhở của tất cả ghi chú theo thời gian thực (Real-time Foreground Check)
  checkAndNotifyDueReminders(notes: Note[], onTriggerAlert?: (note: Note) => void) {
    const now = new Date();
    notes.forEach((note) => {
      if (!note.reminderAt) return;
      const reminderTime = new Date(note.reminderAt);
      const diffMs = reminderTime.getTime() - now.getTime();

      // Nếu đã đến giờ (trong khoảng 0 -> -60s) và chưa thông báo lần nào trong phiên này
      if (diffMs <= 0 && diffMs >= -60000) {
        const uniqueKey = `${note.id}-${note.reminderAt}`;
        if (!notifiedReminderIds.has(uniqueKey)) {
          notifiedReminderIds.add(uniqueKey);

          const sharedText = note.collaborators && note.collaborators.length > 0
            ? `\n👥 Đã thông báo cho tất cả người dùng dùng chung (${note.collaborators.join(', ')})`
            : '';

          this.triggerInstantNotification(
            `⏰ ĐẾN GIỜ HẸN: ${note.title}`,
            `Nội dung: ${note.content ? note.content.slice(0, 100) : 'Chưa có nội dung'}${sharedText}`
          );

          if (onTriggerAlert) {
            onTriggerAlert(note);
          }
        }
      }
    });
  },
};

