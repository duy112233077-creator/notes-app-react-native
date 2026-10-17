import React, { useCallback, useState, useMemo } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ToastConfig, ToastNotification } from '@/components/ui/ToastNotification';
import { Colors, Spacing } from '@/constants/theme';
import { NoteStorage } from '@/services/storage';
import { AuthService } from '@/services/authService';
import { Note, User } from '@/types/note';
import { AuthModal } from '@/components/AuthModal';
import { EditProfileModal } from '@/components/EditProfileModal';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';

// ===== TYPES =====
type ActiveTab = 'upcoming' | 'completed' | 'advance' | 'admin';

const ADVANCE_OPTIONS = [
  { label: 'Không nhắc trước', value: 0 },
  { label: '5 phút trước', value: 5 },
  { label: '10 phút trước', value: 10 },
  { label: '15 phút trước', value: 15 },
  { label: '30 phút trước', value: 30 },
  { label: '1 giờ trước', value: 60 },
  { label: '2 giờ trước', value: 120 },
  { label: '1 ngày trước', value: 1440 },
];

// ===== RATING STARS =====
function StarRating({
  rating,
  onRate,
  size = 28,
  readonly = false,
}: {
  rating: number;
  onRate?: (r: number) => void;
  size?: number;
  readonly?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => !readonly && onRate && onRate(star)}
          disabled={readonly}
          activeOpacity={0.7}>
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={star <= rating ? '#F59E0B' : '#CBD5E1'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ===== COMPLETE + RATE MODAL =====
function CompleteRateModal({
  visible,
  note,
  isDark,
  onClose,
  onSave,
}: {
  visible: boolean;
  note: Note | null;
  isDark: boolean;
  onClose: () => void;
  onSave: (noteId: string, rating: number, ratingNote: string) => void;
}) {
  const colors = Colors[isDark ? 'dark' : 'light'];
  const [rating, setRating] = useState(5);
  const [ratingNote, setRatingNote] = useState('');

  React.useEffect(() => {
    if (visible && note) {
      setRating(note.rating || 5);
      setRatingNote(note.ratingNote || '');
    }
  }, [visible, note]);

  if (!note) return null;

  const ratingLabels = ['', 'Rất tệ 😞', 'Tệ 😕', 'Bình thường 😐', 'Tốt 😊', 'Xuất sắc 🌟'];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={crStyles.overlay}>
        <View style={[crStyles.card, { backgroundColor: isDark ? '#1E222A' : '#FFFFFF' }]}>
          <View style={crStyles.headerRow}>
            <View style={crStyles.completeBadge}>
              <Ionicons name="checkmark-circle" size={28} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={crStyles.cardTitle}>Hoàn Thành Lịch Hẹn</ThemedText>
              <ThemedText style={[crStyles.cardSub, { color: colors.textSecondary }]} numberOfLines={1}>
                {note.title}
              </ThemedText>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={crStyles.divider} />

          <ThemedText style={[crStyles.label, { color: colors.textSecondary }]}>Đánh giá chất lượng công việc</ThemedText>
          <View style={crStyles.starRow}>
            <StarRating rating={rating} onRate={setRating} />
          </View>
          <ThemedText style={[crStyles.ratingLabel, { color: '#F59E0B' }]}>{ratingLabels[rating]}</ThemedText>

          <ThemedText style={[crStyles.label, { color: colors.textSecondary, marginTop: 12 }]}>Ghi chú đánh giá (tuỳ chọn)</ThemedText>
          <TextInput
            style={[
              crStyles.ratingInput,
              {
                color: colors.text,
                backgroundColor: isDark ? '#14171E' : '#F8FAFC',
                borderColor: isDark ? '#2B3245' : '#E2E8F0',
              },
            ]}
            placeholder="Nhập ghi chú về lịch hẹn này..."
            placeholderTextColor={colors.textSecondary}
            value={ratingNote}
            onChangeText={setRatingNote}
            multiline
            numberOfLines={3}
          />

          <View style={crStyles.btnRow}>
            <TouchableOpacity style={crStyles.cancelBtn} onPress={onClose}>
              <ThemedText style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary }}>Hủy</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={crStyles.saveBtn}
              onPress={() => {
                onSave(note.id, rating, ratingNote);
                onClose();
              }}>
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <ThemedText style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Xác nhận hoàn thành</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const crStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completeBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  cardSub: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(150,150,150,0.15)',
    marginVertical: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  starRow: {
    alignItems: 'center',
    marginVertical: 8,
  },
  ratingLabel: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  ratingInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: 'rgba(100,116,139,0.1)',
    alignItems: 'center',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ===== ADVANCE REMINDER SETTING MODAL =====
function AdvanceSettingModal({
  visible,
  note,
  isDark,
  onClose,
  onSave,
}: {
  visible: boolean;
  note: Note | null;
  isDark: boolean;
  onClose: () => void;
  onSave: (noteId: string, minutes: number) => void;
}) {
  const colors = Colors[isDark ? 'dark' : 'light'];
  const [selected, setSelected] = useState(0);

  React.useEffect(() => {
    if (visible && note) {
      setSelected(note.advanceReminderMinutes ?? 0);
    }
  }, [visible, note]);

  if (!note) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={crStyles.overlay}>
        <View style={[crStyles.card, { backgroundColor: isDark ? '#1E222A' : '#FFFFFF' }]}>
          <View style={crStyles.headerRow}>
            <View style={[crStyles.completeBadge, { backgroundColor: '#7C3AED' }]}>
              <Ionicons name="notifications" size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={crStyles.cardTitle}>Thông Báo Trước</ThemedText>
              <ThemedText style={[crStyles.cardSub, { color: colors.textSecondary }]} numberOfLines={1}>
                {note.title}
              </ThemedText>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={crStyles.divider} />
          <ThemedText style={[crStyles.label, { color: colors.textSecondary }]}>Nhắc nhở trước bao lâu?</ThemedText>
          <View style={{ gap: 8, marginTop: 6 }}>
            {ADVANCE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  advStyles.optionRow,
                  {
                    backgroundColor:
                      selected === opt.value
                        ? isDark ? '#312E81' : '#EDE9FE'
                        : isDark ? '#1A1D25' : '#F8FAFC',
                    borderColor:
                      selected === opt.value ? '#7C3AED' : isDark ? '#2E3440' : '#E2E8F0',
                  },
                ]}
                onPress={() => setSelected(opt.value)}>
                <Ionicons
                  name={selected === opt.value ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={selected === opt.value ? '#7C3AED' : colors.textSecondary}
                />
                <ThemedText
                  style={[
                    advStyles.optionText,
                    { color: selected === opt.value ? '#7C3AED' : colors.text, fontWeight: selected === opt.value ? '700' : '500' },
                  ]}>
                  {opt.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[crStyles.btnRow, { marginTop: 16 }]}>
            <TouchableOpacity style={crStyles.cancelBtn} onPress={onClose}>
              <ThemedText style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary }}>Hủy</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[crStyles.saveBtn, { backgroundColor: '#7C3AED' }]}
              onPress={() => {
                onSave(note.id, selected);
                onClose();
              }}>
              <Ionicons name="save" size={18} color="#FFFFFF" />
              <ThemedText style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Lưu cài đặt</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const advStyles = StyleSheet.create({
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
  },
});

// ===== MAIN SCREEN =====
export default function ScheduleAdminScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];
  const safeAreaInsets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<ActiveTab>('upcoming');
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toast, setToast] = useState<ToastConfig | null>(null);

  // Modals
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [completeModalNote, setCompleteModalNote] = useState<Note | null>(null);
  const [advanceModalNote, setAdvanceModalNote] = useState<Note | null>(null);

  const loadData = async () => {
    const session = await AuthService.getStoredSession();
    setCurrentUser(session?.user ?? null);
    let data = await NoteStorage.getNotes();
    if (session?.user) {
      data = data.filter((n) => !n.userId || n.userId === session.user.id);
    }
    setNotes(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const now = new Date();

  // Lịch sắp tới: có reminderAt, chưa hoàn thành, chưa quá hạn hoặc quá hạn <2h
  const upcomingNotes = useMemo(
    () =>
      notes
        .filter((n) => {
          if (!n.reminderAt || n.isCompleted) return false;
          const t = new Date(n.reminderAt);
          return t.getTime() > now.getTime() - 2 * 3600 * 1000; // bao gồm lịch vừa qua < 2h
        })
        .sort((a, b) => new Date(a.reminderAt!).getTime() - new Date(b.reminderAt!).getTime()),
    [notes]
  );

  // Lịch đã hoàn thành
  const completedNotes = useMemo(
    () =>
      notes
        .filter((n) => n.isCompleted)
        .sort((a, b) => new Date(b.completedAt || b.updatedAt || 0).getTime() - new Date(a.completedAt || a.updatedAt || 0).getTime()),
    [notes]
  );

  // Lịch có thông báo trước
  const advanceNotes = useMemo(
    () => notes.filter((n) => n.reminderAt && !n.isCompleted && !n.isDeleted),
    [notes]
  );

  // Storage stats
  const storageStats = useMemo(() => {
    const totalNotes = notes.length;
    const withAttachments = notes.filter((n) => (n.attachments?.length ?? 0) > 0).length;
    const withReminder = notes.filter((n) => n.reminderAt).length;
    const completedCount = notes.filter((n) => n.isCompleted).length;
    const allDataStr = JSON.stringify(notes);
    const sizeKB = Math.round(new TextEncoder().encode(allDataStr).length / 1024);

    const avgRating =
      completedNotes.length > 0
        ? (completedNotes.filter((n) => n.rating).reduce((acc, n) => acc + (n.rating ?? 0), 0) / completedNotes.filter((n) => n.rating).length).toFixed(1)
        : '—';

    return { totalNotes, withAttachments, withReminder, completedCount, sizeKB, avgRating };
  }, [notes, completedNotes]);

  // Hoàn thành lịch
  const handleCompleteNote = async (noteId: string, rating: number, ratingNote: string) => {
    const target = notes.find((n) => n.id === noteId);
    if (!target) return;
    const updated: Note = {
      ...target,
      isCompleted: true,
      completedAt: new Date().toISOString(),
      rating,
      ratingNote,
      updatedAt: new Date().toISOString(),
    };
    await NoteStorage.saveSingleNote(updated);
    await loadData();
    setToast({ message: '✅ Đã hoàn thành lịch hẹn!', type: 'success', subMessage: `"${target.title}" - ${rating}⭐` });
  };

  // Huỷ hoàn thành
  const handleUncomplete = async (noteId: string) => {
    const target = notes.find((n) => n.id === noteId);
    if (!target) return;
    const doIt = async () => {
      const updated: Note = {
        ...target,
        isCompleted: false,
        completedAt: undefined,
        rating: undefined,
        ratingNote: undefined,
        updatedAt: new Date().toISOString(),
      };
      await NoteStorage.saveSingleNote(updated);
      await loadData();
      setToast({ message: 'Đã khôi phục về lịch chưa hoàn thành', type: 'info' });
    };
    if (Platform.OS === 'web') {
      if (window.confirm(`Huỷ hoàn thành lịch "${target.title}"?`)) await doIt();
    } else {
      Alert.alert('Huỷ hoàn thành', `Đặt lại lịch "${target.title}" về chưa hoàn thành?`, [
        { text: 'Giữ nguyên', style: 'cancel' },
        { text: 'Huỷ hoàn thành', onPress: doIt },
      ]);
    }
  };

  // Lưu cài đặt thông báo trước
  const handleSaveAdvance = async (noteId: string, minutes: number) => {
    const target = notes.find((n) => n.id === noteId);
    if (!target) return;
    const updated: Note = {
      ...target,
      advanceReminderMinutes: minutes,
      updatedAt: new Date().toISOString(),
    };
    await NoteStorage.saveSingleNote(updated);
    await loadData();
    const label = ADVANCE_OPTIONS.find((o) => o.value === minutes)?.label ?? `${minutes} phút`;
    setToast({ message: '🔔 Đã cài đặt thông báo trước', type: 'success', subMessage: label });
  };

  const TAB_CONFIG: { key: ActiveTab; icon: any; label: string; color: string }[] = [
    { key: 'upcoming', icon: 'calendar', label: 'Sắp tới', color: '#2563EB' },
    { key: 'completed', icon: 'checkmark-circle', label: 'Đã xong', color: '#16A34A' },
    { key: 'advance', icon: 'notifications', label: 'Nhắc sớm', color: '#7C3AED' },
    { key: 'admin', icon: 'person-circle', label: 'Tài khoản', color: '#EA580C' },
  ];

  function formatRelativeTime(iso: string) {
    const t = new Date(iso);
    const diffMs = t.getTime() - now.getTime();
    const diffMin = Math.round(diffMs / 60000);
    if (diffMs < 0) {
      const pastMin = Math.abs(diffMin);
      if (pastMin < 60) return `${pastMin} phút trước`;
      if (pastMin < 1440) return `${Math.floor(pastMin / 60)} giờ trước`;
      return `${Math.floor(pastMin / 1440)} ngày trước`;
    }
    if (diffMin < 60) return `Còn ${diffMin} phút`;
    if (diffMin < 1440) return `Còn ${Math.floor(diffMin / 60)} giờ ${diffMin % 60} phút`;
    return `Còn ${Math.floor(diffMin / 1440)} ngày`;
  }

  function urgencyColor(iso: string) {
    const diffMs = new Date(iso).getTime() - now.getTime();
    if (diffMs < 0) return '#EF4444';         // quá hạn
    if (diffMs < 3600000) return '#F59E0B';   // < 1 giờ
    if (diffMs < 86400000) return '#3B82F6';  // < 1 ngày
    return '#10B981';                          // > 1 ngày
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: Math.max(safeAreaInsets.top, Spacing.four),
            paddingBottom: safeAreaInsets.bottom + 100,
          },
        ]}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerBadge}>
                <Ionicons name="calendar" size={20} color="#FFFFFF" />
              </View>
              <View>
                <ThemedText style={styles.headerTitle}>Quản Lý Lịch Hẹn</ThemedText>
                <ThemedText style={[styles.headerSub, { color: colors.textSecondary }]}>
                  {upcomingNotes.length} sắp tới · {completedNotes.length} đã xong
                </ThemedText>
              </View>
            </View>
            {currentUser ? (
              <TouchableOpacity
                onPress={() => setEditProfileModalVisible(true)}
                style={[styles.userChip, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF', borderColor: 'rgba(37,99,235,0.3)' }]}>
                <View style={styles.userAvatar}>
                  <ThemedText style={styles.userAvatarText}>{currentUser.name.charAt(0).toUpperCase()}</ThemedText>
                </View>
                <ThemedText style={[styles.userChipText, { color: '#2563EB' }]} numberOfLines={1}>
                  {currentUser.name}
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setAuthModalVisible(true)}
                style={[styles.loginBtn, { backgroundColor: '#2563EB' }]}>
                <Ionicons name="log-in-outline" size={16} color="#FFFFFF" />
                <ThemedText style={styles.loginBtnText}>Đăng nhập</ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {/* Tabs */}
          <View style={[styles.tabsGrid, { backgroundColor: isDark ? '#1A1E27' : '#F1F5F9' }]}>
            {TAB_CONFIG.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabBtn, isActive && { backgroundColor: tab.color }]}
                  onPress={() => setActiveTab(tab.key)}>
                  <Ionicons name={tab.icon} size={16} color={isActive ? '#FFFFFF' : colors.textSecondary} />
                  <ThemedText style={[styles.tabLabel, { color: isActive ? '#FFFFFF' : colors.textSecondary, fontWeight: isActive ? '700' : '500' }]}>
                    {tab.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ========== UPCOMING TAB ========== */}
          {activeTab === 'upcoming' && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                📅 LỊCH HẸN SẮP TỚI ({upcomingNotes.length})
              </ThemedText>
              {upcomingNotes.length === 0 ? (
                <ThemedView style={[styles.emptyBox, { backgroundColor: isDark ? '#1E222A' : '#F8FAFC', borderColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
                  <Ionicons name="calendar-outline" size={44} color={colors.textSecondary} />
                  <ThemedText style={[styles.emptyTitle, { color: colors.textSecondary }]}>Không có lịch hẹn sắp tới</ThemedText>
                  <ThemedText style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                    Thêm nhắc nhở vào ghi chú để theo dõi lịch hẹn ở đây.
                  </ThemedText>
                </ThemedView>
              ) : (
                <View style={styles.cardList}>
                  {upcomingNotes.map((note) => {
                    const relTime = formatRelativeTime(note.reminderAt!);
                    const uc = urgencyColor(note.reminderAt!);
                    const isPast = new Date(note.reminderAt!).getTime() < now.getTime();
                    const advLabel = ADVANCE_OPTIONS.find((o) => o.value === (note.advanceReminderMinutes ?? 0))?.label ?? 'Không nhắc trước';

                    return (
                      <ThemedView
                        key={note.id}
                        style={[
                          styles.scheduleCard,
                          {
                            backgroundColor: isDark ? '#1E222A' : '#FFFFFF',
                            borderColor: uc + '40',
                            borderLeftColor: uc,
                            borderLeftWidth: 4,
                          },
                        ]}>
                        {/* Top row */}
                        <View style={styles.cardTopRow}>
                          <View style={[styles.urgencyBadge, { backgroundColor: uc + '20' }]}>
                            <Ionicons name={isPast ? 'alert-circle' : 'time'} size={14} color={uc} />
                            <ThemedText style={[styles.urgencyText, { color: uc }]}>{relTime}</ThemedText>
                          </View>
                          {note.advanceReminderMinutes && note.advanceReminderMinutes > 0 ? (
                            <View style={[styles.advBadge, { backgroundColor: '#7C3AED20' }]}>
                              <Ionicons name="notifications" size={12} color="#7C3AED" />
                              <ThemedText style={[styles.advBadgeText, { color: '#7C3AED' }]}>{advLabel}</ThemedText>
                            </View>
                          ) : null}
                        </View>

                        <ThemedText style={styles.cardTitle}>{note.title}</ThemedText>
                        {!!note.content && (
                          <ThemedText style={[styles.cardContent, { color: colors.textSecondary }]} numberOfLines={2}>
                            {note.content}
                          </ThemedText>
                        )}
                        <ThemedText style={[styles.cardDate, { color: colors.textSecondary }]}>
                          🗓 {new Date(note.reminderAt!).toLocaleString('vi-VN', {
                            weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </ThemedText>

                        {/* Actions */}
                        <View style={styles.cardActions}>
                          <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: '#7C3AED15', borderColor: '#7C3AED30' }]}
                            onPress={() => setAdvanceModalNote(note)}>
                            <Ionicons name="notifications-outline" size={15} color="#7C3AED" />
                            <ThemedText style={[styles.actionBtnText, { color: '#7C3AED' }]}>Nhắc trước</ThemedText>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: '#16A34A15', borderColor: '#16A34A30', flex: 1.2 }]}
                            onPress={() => setCompleteModalNote(note)}>
                            <Ionicons name="checkmark-circle-outline" size={15} color="#16A34A" />
                            <ThemedText style={[styles.actionBtnText, { color: '#16A34A' }]}>Đánh dấu hoàn thành</ThemedText>
                          </TouchableOpacity>
                        </View>
                      </ThemedView>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* ========== COMPLETED TAB ========== */}
          {activeTab === 'completed' && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>✅ LỊCH ĐÃ HOÀN THÀNH ({completedNotes.length})</ThemedText>

              {/* Avg rating summary */}
              {completedNotes.length > 0 && (
                <ThemedView style={[styles.avgCard, { backgroundColor: isDark ? '#14291D' : '#F0FDF4', borderColor: isDark ? '#166534' : '#BBF7D0' }]}>
                  <View style={styles.avgLeft}>
                    <Ionicons name="star" size={24} color="#F59E0B" />
                    <View>
                      <ThemedText style={styles.avgTitle}>Đánh giá trung bình</ThemedText>
                      <ThemedText style={[styles.avgSub, { color: colors.textSecondary }]}>{completedNotes.filter(n=>n.rating).length} lịch có đánh giá</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.avgValue}>{storageStats.avgRating} ⭐</ThemedText>
                </ThemedView>
              )}

              {completedNotes.length === 0 ? (
                <ThemedView style={[styles.emptyBox, { backgroundColor: isDark ? '#1E222A' : '#F8FAFC', borderColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
                  <Ionicons name="checkmark-done-circle-outline" size={44} color={colors.textSecondary} />
                  <ThemedText style={[styles.emptyTitle, { color: colors.textSecondary }]}>Chưa hoàn thành lịch nào</ThemedText>
                  <ThemedText style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                    Đánh dấu lịch sắp tới là "hoàn thành" để chúng xuất hiện ở đây.
                  </ThemedText>
                </ThemedView>
              ) : (
                <View style={styles.cardList}>
                  {completedNotes.map((note) => (
                    <ThemedView
                      key={note.id}
                      style={[
                        styles.scheduleCard,
                        {
                          backgroundColor: isDark ? '#14291D' : '#F0FDF4',
                          borderColor: '#16A34A30',
                          borderLeftColor: '#16A34A',
                          borderLeftWidth: 4,
                        },
                      ]}>
                      <View style={styles.cardTopRow}>
                        <View style={[styles.urgencyBadge, { backgroundColor: '#16A34A15' }]}>
                          <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                          <ThemedText style={[styles.urgencyText, { color: '#16A34A' }]}>Đã hoàn thành</ThemedText>
                        </View>
                        {note.completedAt && (
                          <ThemedText style={[styles.cardDate, { color: colors.textSecondary, fontSize: 11 }]}>
                            {new Date(note.completedAt).toLocaleDateString('vi-VN')}
                          </ThemedText>
                        )}
                      </View>

                      <ThemedText style={styles.cardTitle}>{note.title}</ThemedText>
                      {!!note.content && (
                        <ThemedText style={[styles.cardContent, { color: colors.textSecondary }]} numberOfLines={2}>
                          {note.content}
                        </ThemedText>
                      )}

                      {/* Rating */}
                      {note.rating ? (
                        <View style={styles.ratingRow}>
                          <StarRating rating={note.rating} readonly size={20} />
                          <ThemedText style={[styles.ratingText, { color: '#F59E0B' }]}>{note.rating}.0/5</ThemedText>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => setCompleteModalNote(note)}
                          style={[styles.rateNowBtn, { borderColor: '#F59E0B40', backgroundColor: '#F59E0B10' }]}>
                          <Ionicons name="star-outline" size={14} color="#F59E0B" />
                          <ThemedText style={[styles.rateNowText, { color: '#F59E0B' }]}>Chưa có đánh giá — Nhấn để đánh giá</ThemedText>
                        </TouchableOpacity>
                      )}

                      {note.ratingNote ? (
                        <ThemedText style={[styles.ratingNoteText, { color: colors.textSecondary }]}>💬 {note.ratingNote}</ThemedText>
                      ) : null}

                      <TouchableOpacity
                        onPress={() => handleUncomplete(note.id)}
                        style={[styles.uncompleteBtn, { borderColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
                        <Ionicons name="refresh-outline" size={13} color={colors.textSecondary} />
                        <ThemedText style={[styles.uncompleteBtnText, { color: colors.textSecondary }]}>Đặt lại chưa hoàn thành</ThemedText>
                      </TouchableOpacity>
                    </ThemedView>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* ========== ADVANCE TAB ========== */}
          {activeTab === 'advance' && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>🔔 CÀI ĐẶT THÔNG BÁO TRƯỚC</ThemedText>
              <ThemedView style={[styles.infoBox, { backgroundColor: isDark ? '#1E1A3A' : '#F5F3FF', borderColor: isDark ? '#4C1D95' : '#DDD6FE' }]}>
                <Ionicons name="information-circle" size={18} color="#7C3AED" />
                <ThemedText style={[styles.infoText, { color: isDark ? '#C4B5FD' : '#5B21B6' }]}>
                  Chọn từng lịch hẹn bên dưới để cài đặt thông báo sớm hơn giờ hẹn chính. Cần đặt lịch hẹn trước khi cài đặt.
                </ThemedText>
              </ThemedView>

              {advanceNotes.length === 0 ? (
                <ThemedView style={[styles.emptyBox, { backgroundColor: isDark ? '#1E222A' : '#F8FAFC', borderColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
                  <Ionicons name="notifications-off-outline" size={44} color={colors.textSecondary} />
                  <ThemedText style={[styles.emptyTitle, { color: colors.textSecondary }]}>Không có lịch hẹn nào</ThemedText>
                  <ThemedText style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                    Tạo lịch hẹn trong ghi chú để cài đặt thông báo trước ở đây.
                  </ThemedText>
                </ThemedView>
              ) : (
                <View style={styles.cardList}>
                  {advanceNotes.map((note) => {
                    const advMin = note.advanceReminderMinutes ?? 0;
                    const advLabel = ADVANCE_OPTIONS.find((o) => o.value === advMin)?.label ?? 'Không nhắc trước';
                    const reminderStr = note.reminderAt
                      ? new Date(note.reminderAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
                      : '—';

                    return (
                      <ThemedView
                        key={note.id}
                        style={[
                          styles.advCard,
                          {
                            backgroundColor: isDark ? '#1E222A' : '#FFFFFF',
                            borderColor: isDark ? '#2E3440' : '#E2E8F0',
                          },
                        ]}>
                        <View style={styles.advCardLeft}>
                          <View style={[styles.advIconBg, { backgroundColor: advMin > 0 ? '#7C3AED20' : isDark ? '#2E3440' : '#F1F5F9' }]}>
                            <Ionicons name={advMin > 0 ? 'notifications' : 'notifications-off-outline'} size={20} color={advMin > 0 ? '#7C3AED' : colors.textSecondary} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <ThemedText style={styles.advCardTitle} numberOfLines={1}>{note.title}</ThemedText>
                            <ThemedText style={[styles.advCardSub, { color: colors.textSecondary }]}>🕐 Lịch hẹn: {reminderStr}</ThemedText>
                            <ThemedText style={[styles.advCardSub, { color: advMin > 0 ? '#7C3AED' : colors.textSecondary }]}>
                              🔔 {advLabel}
                            </ThemedText>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={[styles.advEditBtn, { backgroundColor: '#7C3AED' }]}
                          onPress={() => setAdvanceModalNote(note)}>
                          <Ionicons name="settings-outline" size={14} color="#FFFFFF" />
                          <ThemedText style={styles.advEditBtnText}>Chỉnh</ThemedText>
                        </TouchableOpacity>
                      </ThemedView>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* ========== ADMIN TAB ========== */}
          {activeTab === 'admin' && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>👤 TRANG QUẢN TRỊ</ThemedText>

              {/* Account card */}
              <ThemedView style={[styles.adminCard, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF', borderColor: isDark ? '#1E3A5F' : '#BFDBFE' }]}>
                <View style={styles.adminCardHeader}>
                  <View style={styles.adminAvatar}>
                    {currentUser ? (
                      <ThemedText style={styles.adminAvatarText}>{currentUser.name.charAt(0).toUpperCase()}</ThemedText>
                    ) : (
                      <Ionicons name="person" size={26} color="#FFFFFF" />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.adminName}>{currentUser?.name ?? 'Chưa đăng nhập'}</ThemedText>
                    <ThemedText style={[styles.adminEmail, { color: colors.textSecondary }]}>{currentUser?.email ?? '—'}</ThemedText>
                    {currentUser && (
                      <View style={styles.verifiedBadge}>
                        <Ionicons name="shield-checkmark" size={12} color="#16A34A" />
                        <ThemedText style={styles.verifiedText}>Đã xác thực MySQL</ThemedText>
                      </View>
                    )}
                  </View>
                </View>

                {!currentUser ? (
                  <TouchableOpacity style={[styles.adminBtn, { backgroundColor: '#2563EB' }]} onPress={() => setAuthModalVisible(true)}>
                    <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
                    <ThemedText style={styles.adminBtnText}>Đăng nhập / Đăng ký</ThemedText>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.adminBtnRow}>
                    <TouchableOpacity style={[styles.adminBtnSmall, { backgroundColor: '#2563EB' }]} onPress={() => setEditProfileModalVisible(true)}>
                      <Ionicons name="create-outline" size={15} color="#FFFFFF" />
                      <ThemedText style={styles.adminBtnSmallText}>Chỉnh sửa</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.adminBtnSmall, { backgroundColor: '#D97706' }]} onPress={() => setChangePasswordModalVisible(true)}>
                      <Ionicons name="key-outline" size={15} color="#FFFFFF" />
                      <ThemedText style={styles.adminBtnSmallText}>Đổi mật khẩu</ThemedText>
                    </TouchableOpacity>
                  </View>
                )}
              </ThemedView>

              {/* Storage stats */}
              <ThemedText style={[styles.sectionTitle, { marginTop: 8 }]}>📊 DUNG LƯỢNG & THỐNG KÊ</ThemedText>
              <View style={styles.statsGrid}>
                {[
                  { icon: 'documents', color: '#3B82F6', label: 'Tổng ghi chú', value: String(storageStats.totalNotes) },
                  { icon: 'attach', color: '#0891B2', label: 'Có đính kèm', value: String(storageStats.withAttachments) },
                  { icon: 'calendar', color: '#7C3AED', label: 'Có lịch hẹn', value: String(storageStats.withReminder) },
                  { icon: 'checkmark-circle', color: '#16A34A', label: 'Đã hoàn thành', value: String(storageStats.completedCount) },
                  { icon: 'server', color: '#EA580C', label: 'Dung lượng', value: storageStats.sizeKB < 1024 ? `${storageStats.sizeKB} KB` : `${(storageStats.sizeKB / 1024).toFixed(1)} MB` },
                  { icon: 'star', color: '#F59E0B', label: 'Rating TB', value: `${storageStats.avgRating}⭐` },
                ].map((stat) => (
                  <ThemedView
                    key={stat.label}
                    style={[
                      styles.statCard,
                      {
                        backgroundColor: isDark ? '#1E222A' : '#F8FAFC',
                        borderColor: isDark ? '#2E3440' : '#E2E8F0',
                      },
                    ]}>
                    <View style={[styles.statIconBg, { backgroundColor: stat.color + '20' }]}>
                      <Ionicons name={stat.icon as any} size={22} color={stat.color} />
                    </View>
                    <ThemedText style={[styles.statValue, { color: stat.color }]}>{stat.value}</ThemedText>
                    <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</ThemedText>
                  </ThemedView>
                ))}
              </View>

              {/* Storage bar */}
              <ThemedView style={[styles.storageBar, { backgroundColor: isDark ? '#1E222A' : '#F8FAFC', borderColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
                <View style={styles.storageBarTop}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="server-outline" size={18} color="#EA580C" />
                    <ThemedText style={styles.storageBarTitle}>Dung lượng sử dụng</ThemedText>
                  </View>
                  <ThemedText style={[styles.storageBarValue, { color: '#EA580C' }]}>
                    {storageStats.sizeKB} KB / 5 MB
                  </ThemedText>
                </View>
                <View style={[styles.storageBarBg, { backgroundColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
                  <View
                    style={[
                      styles.storageBarFill,
                      {
                        width: `${Math.min(100, (storageStats.sizeKB / 5120) * 100)}%` as any,
                        backgroundColor: storageStats.sizeKB > 4096 ? '#EF4444' : storageStats.sizeKB > 2048 ? '#F59E0B' : '#16A34A',
                      },
                    ]}
                  />
                </View>
                <ThemedText style={[styles.storageBarSub, { color: colors.textSecondary }]}>
                  {((storageStats.sizeKB / 5120) * 100).toFixed(1)}% đã sử dụng (LocalStorage / AsyncStorage)
                </ThemedText>
              </ThemedView>

              {/* Join date */}
              {currentUser?.createdAt && (
                <ThemedView style={[styles.infoBox, { backgroundColor: isDark ? '#1E222A' : '#F8FAFC', borderColor: isDark ? '#2E3440' : '#E2E8F0', marginTop: 0 }]}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                    Ngày tạo tài khoản: {new Date(currentUser.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </ThemedText>
                </ThemedView>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <CompleteRateModal
        visible={!!completeModalNote}
        note={completeModalNote}
        isDark={isDark}
        onClose={() => setCompleteModalNote(null)}
        onSave={handleCompleteNote}
      />
      <AdvanceSettingModal
        visible={!!advanceModalNote}
        note={advanceModalNote}
        isDark={isDark}
        onClose={() => setAdvanceModalNote(null)}
        onSave={handleSaveAdvance}
      />
      <AuthModal
        visible={authModalVisible}
        currentUser={currentUser}
        onClose={() => setAuthModalVisible(false)}
        onLoginSuccess={async (session) => {
          setCurrentUser(session.user);
          await loadData();
          setToast({ message: `Xin chào ${session.user.name}!`, type: 'success' });
        }}
        onLogout={async () => {
          await AuthService.clearSession();
          setCurrentUser(null);
          await loadData();
          setToast({ message: 'Đã đăng xuất', type: 'info' });
        }}
      />
      <EditProfileModal
        visible={editProfileModalVisible}
        currentUser={currentUser}
        onClose={() => setEditProfileModalVisible(false)}
        onProfileUpdated={async (updatedSession) => {
          setCurrentUser(updatedSession.user);
          await loadData();
          setToast({ message: 'Đã cập nhật thông tin!', type: 'success' });
        }}
      />
      <ChangePasswordModal
        visible={changePasswordModalVisible}
        onClose={() => setChangePasswordModalVisible(false)}
        onSuccess={(msg) => setToast({ message: msg, type: 'success' })}
      />
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollView: { flex: 1 },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  container: {
    width: '100%',
    maxWidth: 780,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.four,
    gap: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 13,
    marginTop: 2,
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: 150,
  },
  userAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  userChipText: { fontSize: 13, fontWeight: '600', flexShrink: 1 },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  loginBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  tabsGrid: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: Spacing.four,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabLabel: { fontSize: 11 },
  section: { marginBottom: Spacing.five },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    opacity: 0.7,
    marginBottom: 12,
  },
  emptyBox: {
    alignItems: 'center',
    padding: Spacing.five,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  emptyTitle: { fontSize: 15, fontWeight: '600' },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  cardList: { gap: 12 },
  scheduleCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  urgencyText: { fontSize: 12, fontWeight: '700' },
  advBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  advBadgeText: { fontSize: 11, fontWeight: '600' },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardContent: { fontSize: 13, lineHeight: 18 },
  cardDate: { fontSize: 12 },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionBtnText: { fontSize: 12, fontWeight: '700' },
  // Completed
  avgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  avgLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avgTitle: { fontSize: 14, fontWeight: '700' },
  avgSub: { fontSize: 12, marginTop: 2 },
  avgValue: { fontSize: 22, fontWeight: '800', color: '#F59E0B' },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  ratingText: { fontSize: 14, fontWeight: '700' },
  rateNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  rateNowText: { fontSize: 12, fontWeight: '600' },
  ratingNoteText: { fontSize: 13, lineHeight: 18, fontStyle: 'italic' },
  uncompleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  uncompleteBtnText: { fontSize: 11, fontWeight: '500' },
  // Advance
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  infoText: { flex: 1, fontSize: 13, lineHeight: 18 },
  advCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  advCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  advIconBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  advCardTitle: { fontSize: 14, fontWeight: '700' },
  advCardSub: { fontSize: 12, marginTop: 2 },
  advEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  advEditBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  // Admin
  adminCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 14,
    marginBottom: 16,
  },
  adminCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  adminAvatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminAvatarText: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  adminName: { fontSize: 18, fontWeight: '800' },
  adminEmail: { fontSize: 13, marginTop: 2 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  verifiedText: { fontSize: 11, color: '#16A34A', fontWeight: '600' },
  adminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  adminBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  adminBtnRow: { flexDirection: 'row', gap: 10 },
  adminBtnSmall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
  },
  adminBtnSmallText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    width: '30.5%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  storageBar: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    marginBottom: 12,
  },
  storageBarTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storageBarTitle: { fontSize: 14, fontWeight: '700' },
  storageBarValue: { fontSize: 14, fontWeight: '800' },
  storageBarBg: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  storageBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  storageBarSub: { fontSize: 12 },
});
