import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return true;
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

  async scheduleNoteReminder(noteId: string, title: string, body: string, triggerDate: Date): Promise<string | null> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission && Platform.OS !== 'web') {
      console.warn('Chưa có quyền thông báo.');
    }

    try {
      const now = new Date();
      if (triggerDate <= now) {
        throw new Error('Thời gian nhắc nhở phải ở tương lai.');
      }

      await this.cancelNoteReminder(noteId);

      const secondsFromNow = Math.max(1, Math.floor((triggerDate.getTime() - now.getTime()) / 1000));

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ Nhắc nhở: ${title}`,
          body: body || 'Đã đến thời gian nhắc nhở ghi chú của bạn!',
          data: { noteId },
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
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
    } catch (err) {
      // Ignored
    }
  },
};
