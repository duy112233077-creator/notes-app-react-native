import { useState, useEffect } from 'react';
import { Note } from '@/types/note';
import { NotificationService } from '@/services/notificationService';

export function useRealtimeReminders(notes: Note[]) {
  const [reminderAlertNote, setReminderAlertNote] = useState<Note | null>(null);
  const [notifiedReminderIds] = useState(() => new Set<string>());
  const [notifiedAdvanceIds] = useState(() => new Set<string>());

  useEffect(() => {
    const checkReminders = () => {
      if (notes.length === 0) return;
      const nowMs = Date.now();
      for (const n of notes) {
        if (!n.reminderAt || n.isCompleted) continue;

        const remTime = new Date(n.reminderAt).getTime();
        if (isNaN(remTime)) continue;

        // Kiểm tra thông báo trước (advance reminder)
        const advanceMin = n.advanceReminderMinutes ?? 0;
        if (advanceMin > 0) {
          const advanceKey = `advance-${n.id}-${n.reminderAt}`;
          if (!notifiedAdvanceIds.has(advanceKey)) {
            const advanceTime = remTime - advanceMin * 60 * 1000;
            // Gửi khi đến ngưỡng advance (trong cửa sổ -30s -> +30s)
            if (nowMs >= advanceTime - 30000 && nowMs <= advanceTime + 30000) {
              notifiedAdvanceIds.add(advanceKey);
              NotificationService.triggerInstantNotification(
                `🔔 Sắp đến giờ: ${n.title}`,
                `Còn ${advanceMin} phút nữa đến lịch hẹn của bạn!`
              );
            }
          }
        }

        // Kiểm tra thông báo chính
        if (!notifiedReminderIds.has(n.id)) {
          if (remTime <= nowMs && remTime >= nowMs - 120000) { // trong 2 phút sau
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
    const interval = setInterval(checkReminders, 15000); // check mỗi 15s
    return () => clearInterval(interval);
  }, [notes, notifiedReminderIds, notifiedAdvanceIds]);

  return {
    reminderAlertNote,
    setReminderAlertNote,
  };
}
