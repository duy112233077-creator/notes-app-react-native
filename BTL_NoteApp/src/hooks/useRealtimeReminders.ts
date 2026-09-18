import { useState, useEffect } from 'react';
import { Note } from '@/types/note';
import { NotificationService } from '@/services/notificationService';

export function useRealtimeReminders(notes: Note[]) {
  const [reminderAlertNote, setReminderAlertNote] = useState<Note | null>(null);
  const [notifiedReminderIds] = useState(() => new Set<string>());

  useEffect(() => {
    const checkReminders = () => {
      if (notes.length === 0) return;
      const nowMs = Date.now();
      for (const n of notes) {
        if (n.reminderAt && !notifiedReminderIds.has(n.id)) {
          const remTime = new Date(n.reminderAt).getTime();
          if (!isNaN(remTime) && remTime <= nowMs) {
            notifiedReminderIds.add(n.id);
            setReminderAlertNote(n);
            NotificationService.triggerInstantNotification(
              `⏰ Nhắc nhở ghi chú: ${n.title}`,
              n.content || 'Đã đến giờ hẹn ghi chú của bạn!'
            );
            break;
          }
        }
      }
    };
    checkReminders();
    const interval = setInterval(checkReminders, 4000);
    return () => clearInterval(interval);
  }, [notes, notifiedReminderIds]);

  return {
    reminderAlertNote,
    setReminderAlertNote,
  };
}
