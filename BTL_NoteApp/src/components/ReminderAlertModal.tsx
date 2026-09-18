import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { Note } from '@/types/note';

interface ReminderAlertModalProps {
  visible: boolean;
  note: Note | null;
  onClose: () => void;
  onOpenNote: (note: Note) => void;
}

export const ReminderAlertModal: React.FC<ReminderAlertModalProps> = ({
  visible,
  note,
  onClose,
  onOpenNote,
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  // Play audio chime beep on web when modal opens
  useEffect(() => {
    if (visible && Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const playBeep = (freq: number, startTime: number, duration: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.3, ctx.currentTime + startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + startTime);
            osc.stop(ctx.currentTime + startTime + duration);
          };
          // 3-tone notification chime (C5 -> E5 -> G5)
          playBeep(523.25, 0, 0.2);
          playBeep(659.25, 0.2, 0.2);
          playBeep(783.99, 0.4, 0.4);
        }
      } catch (e) {
        console.warn('Cannot play audio chime:', e);
      }
    }
  }, [visible]);

  if (!note) return null;

  const sharedCount = note.collaborators?.length || 0;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: isDark ? '#1E222A' : '#FFFFFF',
              borderColor: isDark ? '#3B82F6' : '#2563EB',
            },
          ]}>
          {/* Header icon badge */}
          <View style={styles.bellBadgeWrap}>
            <View style={styles.bellBadge}>
              <Ionicons name="notifications" size={32} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.alertLabel}>⏰ ĐÃ ĐẾN GIỜ NHẮC NHỞ!</Text>

          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {note.title || '(Ghi chú không có tiêu đề)'}
          </Text>

          {!!note.content && (
            <Text style={[styles.contentPreview, { color: colors.textSecondary }]} numberOfLines={3}>
              {note.content}
            </Text>
          )}

          {sharedCount > 0 && (
            <View style={styles.sharedBadge}>
              <Ionicons name="people" size={14} color="#2563EB" />
              <Text style={styles.sharedBadgeText}>
                Đã đồng bộ thông báo tới {sharedCount} thành viên được chia sẻ
              </Text>
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Đóng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => {
                onOpenNote(note);
                onClose();
              }}>
              <Ionicons name="document-text" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.openBtnText}>Xem Ghi Chú</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    borderWidth: 2,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  bellBadgeWrap: {
    marginTop: -44,
    marginBottom: 12,
  },
  bellBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  alertLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  contentPreview: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  sharedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 18,
  },
  sharedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  closeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
  openBtn: {
    flex: 1.5,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  openBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
