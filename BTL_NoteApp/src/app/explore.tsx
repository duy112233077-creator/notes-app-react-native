import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ToastConfig, ToastNotification } from '@/components/ui/ToastNotification';
import { Colors, Spacing } from '@/constants/theme';
import { NoteStorage } from '@/services/storage';
import { AuthService } from '@/services/authService';
import { Note, ActivityLog, User, DEFAULT_CATEGORIES } from '@/types/note';

const CAT_COLORS: Record<string, string> = {
  'Công việc': '#3B82F6',
  'Học tập': '#10B981',
  'Cá nhân': '#EC4899',
  'Ý tưởng': '#F59E0B',
  'Khác': '#8B5CF6',
};
const CAT_ICONS: Record<string, any> = {
  'Công việc': 'briefcase',
  'Học tập': 'school',
  'Cá nhân': 'person',
  'Ý tưởng': 'bulb',
  'Khác': 'folder',
};

function actionLabel(action: string) {
  if (action === 'CREATE' || action === 'TẠO') return { text: 'Đã thêm', color: '#10B981', icon: 'add-circle' as const };
  if (action === 'UPDATE' || action === 'SỬA') return { text: 'Đã sửa', color: '#F59E0B', icon: 'create' as const };
  if (action === 'DELETE' || action === 'XÓA') return { text: 'Đã xóa', color: '#EF4444', icon: 'trash' as const };
  if (action === 'CHIA SẺ') return { text: 'Chia sẻ', color: '#3B82F6', icon: 'share-social' as const };
  if (action === 'KHÔI PHỤC') return { text: 'Khôi phục', color: '#8B5CF6', icon: 'refresh-circle' as const };
  return { text: action, color: '#64748B', icon: 'ellipsis-horizontal' as const };
}

export default function StatisticsScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];
  const safeAreaInsets = useSafeAreaInsets();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([...DEFAULT_CATEGORIES]);
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'backup'>('stats');
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategoryOutside = async () => {
    const clean = newCatName.trim();
    if (!clean) return;
    const updated = await NoteStorage.addCustomCategory(clean);
    const merged = [...DEFAULT_CATEGORIES];
    updated.forEach((c) => { if (!merged.includes(c)) merged.push(c); });
    setAllCategories(merged);
    setNewCatName('');
    setToast({ message: `✅ Đã thêm danh mục "${clean}" thành công!`, type: 'success' });
  };

  const loadData = async () => {
    const session = await AuthService.getStoredSession();
    const user = session ? session.user : null;
    setCurrentUser(user);

    let data = await NoteStorage.getNotes();
    if (user) {
      data = data.filter((n) => !n.userId || n.userId === user.id);
    }
    setNotes(data);

    // Load activity logs filtered by account
    try {
      let logs = await NoteStorage.getActivityLogs();
      if (user) {
        logs = logs.filter(
          (l) => l.userId === user.id || l.userEmail === user.email || l.userName === user.name
        );
      }
      setActivityLogs(logs);
    } catch { /* ignore */ }

    // Load custom categories
    const customs = await NoteStorage.getCustomCategories();
    const merged = [...DEFAULT_CATEGORIES];
    customs.forEach((c) => { if (!merged.includes(c)) merged.push(c); });
    setAllCategories(merged);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const totalNotes = notes.length;
  const pinnedCount = notes.filter((n) => n.isPinned).length;
  const lockedCount = notes.filter((n) => n.isLocked).length;
  const attachCount = notes.filter((n) => (n.attachments?.length ?? 0) > 0).length;

  // Khôi phục ghi chú mẫu
  const handleResetSampleNotes = async () => {
    const action = async () => {
      const fresh = await NoteStorage.resetLocalSampleNotes();
      setNotes(fresh);
      setToast({
        message: 'Đã khôi phục ghi chú mẫu',
        type: 'success',
        subMessage: 'Dữ liệu bộ nhớ thiết bị, CSDL MySQL giữ nguyên.',
      });
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Khôi phục danh sách ghi chú mẫu trên máy này?')) await action();
    } else {
      Alert.alert('Khôi phục dữ liệu mẫu', 'Hành động này tải lại danh sách mẫu trên thiết bị này.', [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đồng ý', onPress: action },
      ]);
    }
  };

  // Backup ghi chú ra JSON
  const handleBackupNotes = async () => {
    try {
      const result = await NoteStorage.backupNotes();
      if (result.success) {
        setToast({ message: '✅ Sao lưu thành công', type: 'success', subMessage: result.message });
      } else {
        setToast({ message: '❌ Sao lưu thất bại', type: 'error', subMessage: result.message });
      }
    } catch (err: any) {
      setToast({ message: 'Lỗi', type: 'error', subMessage: err.message });
    }
  };

  // Restore từ backup
  const handleRestoreNotes = async () => {
    const doRestore = async () => {
      try {
        const result = await NoteStorage.restoreNotes();
        if (result.success) {
          await loadData();
          setToast({ message: `✅ Đã khôi phục ${result.notesImported} ghi chú`, type: 'success', subMessage: result.message });
        } else {
          setToast({ message: '❌ Không khôi phục được', type: 'error', subMessage: result.message });
        }
      } catch (err: any) {
        setToast({ message: 'Lỗi', type: 'error', subMessage: err.message });
      }
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Khôi phục ghi chú từ tệp sao lưu? Dữ liệu hiện tại sẽ bị thay thế.')) await doRestore();
    } else {
      Alert.alert('Khôi phục từ backup', 'Dữ liệu hiện tại sẽ bị thay thế bởi dữ liệu sao lưu.', [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Khôi phục', onPress: doRestore, style: 'destructive' },
      ]);
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: Math.max(safeAreaInsets.top, Spacing.four),
            paddingBottom: safeAreaInsets.bottom + 90,
          },
        ]}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>Thống Kê & Lịch Sử</ThemedText>
            <ThemedText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Tổng quan ghi chú, nhật ký hoạt động và sao lưu dữ liệu
            </ThemedText>
          </View>

          {/* Tab Navigation */}
          <View style={[styles.tabRow, { backgroundColor: isDark ? '#1A1E27' : '#F1F5F9' }]}>
            {(['stats', 'history', 'backup'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive, activeTab === tab && { backgroundColor: isDark ? '#2563EB' : '#2563EB' }]}
                onPress={() => setActiveTab(tab)}>
                <Ionicons
                  name={tab === 'stats' ? 'bar-chart' : tab === 'history' ? 'time' : 'cloud-upload'}
                  size={15}
                  color={activeTab === tab ? '#FFFFFF' : colors.textSecondary}
                />
                <ThemedText style={[styles.tabText, { color: activeTab === tab ? '#FFFFFF' : colors.textSecondary, fontWeight: activeTab === tab ? '700' : '500' }]}>
                  {tab === 'stats' ? 'Thống kê' : tab === 'history' ? 'Lịch sử' : 'Sao lưu'}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {/* ===== STATS TAB ===== */}
          {activeTab === 'stats' && (
            <>
              {/* Stat Cards */}
              <View style={styles.statCardsGrid}>
                <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#1C2230' : '#EFF6FF', borderColor: isDark ? '#2B3850' : '#BFDBFE' }]}>
                  <Ionicons name="documents" size={24} color="#3B82F6" />
                  <ThemedText style={[styles.statValue, { color: '#3B82F6' }]}>{totalNotes}</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Tổng ghi chú</ThemedText>
                </ThemedView>

                <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#2D2817' : '#FEFCE8', borderColor: isDark ? '#54461B' : '#FEF08A' }]}>
                  <Ionicons name="pin" size={24} color="#EAB308" />
                  <ThemedText style={[styles.statValue, { color: '#CA8A04' }]}>{pinnedCount}</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Đã ghim</ThemedText>
                </ThemedView>

                <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#2A1B28' : '#FDF2F8', borderColor: isDark ? '#4A2A46' : '#FBCFE8' }]}>
                  <Ionicons name="lock-closed" size={24} color="#EC4899" />
                  <ThemedText style={[styles.statValue, { color: '#DB2777' }]}>{lockedCount}</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Đã khóa PIN</ThemedText>
                </ThemedView>

                <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#1A2A2D' : '#ECFEFF', borderColor: isDark ? '#1E4A52' : '#A5F3FC' }]}>
                  <Ionicons name="attach" size={24} color="#0891B2" />
                  <ThemedText style={[styles.statValue, { color: '#0891B2' }]}>{attachCount}</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Có đính kèm</ThemedText>
                </ThemedView>
              </View>

              {/* Category distribution */}
              <View style={styles.sectionWrapper}>
                <ThemedText style={styles.sectionTitle}>PHÂN BỐ THEO DANH MỤC</ThemedText>
                <View style={styles.categoriesList}>
                  {allCategories.map((catName) => {
                    const count = notes.filter((n) => n.category === catName).length;
                    const percent = totalNotes > 0 ? Math.round((count / totalNotes) * 100) : 0;
                    const color = CAT_COLORS[catName] ?? '#64748B';
                    const icon = CAT_ICONS[catName] ?? 'folder';
                    return (
                      <ThemedView
                        key={catName}
                        style={[styles.categoryRow, { backgroundColor: isDark ? '#1E222A' : '#F8FAFC', borderColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
                        <View style={styles.catLeft}>
                          <View style={[styles.catIconWrap, { backgroundColor: `${color}20` }]}>
                            <Ionicons name={icon} size={18} color={color} />
                          </View>
                          <View>
                            <ThemedText style={styles.catName}>{catName}</ThemedText>
                            <ThemedText style={[styles.catPercent, { color: colors.textSecondary }]}>{percent}% tổng số ghi chú</ThemedText>
                          </View>
                        </View>
                        {/* Progress bar */}
                        <View style={styles.catRight}>
                          <View style={[styles.progressBar, { backgroundColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
                            <View style={[styles.progressFill, { width: `${percent}%` as any, backgroundColor: color }]} />
                          </View>
                          <View style={[styles.catCountBadge, { backgroundColor: `${color}25` }]}>
                            <ThemedText style={[styles.catCountText, { color }]}>{count}</ThemedText>
                          </View>
                        </View>
                      </ThemedView>
                    );
                  })}
                </View>

                {/* Thêm danh mục mới outside */}
                <ThemedView
                  style={[
                    styles.addCategoryCard,
                    {
                      backgroundColor: isDark ? '#1E222A' : '#F8FAFC',
                      borderColor: isDark ? '#2E3440' : '#E2E8F0',
                    },
                  ]}>
                  <ThemedText style={styles.addCategoryCardTitle}>➕ THÊM DANH MỤC MỚI</ThemedText>
                  <View style={styles.addCategoryCardRow}>
                    <TextInput
                      style={[
                        styles.addCategoryCardInput,
                        {
                          color: colors.text,
                          backgroundColor: isDark ? '#14171E' : '#FFFFFF',
                          borderColor: isDark ? '#2B3245' : '#CBD5E1',
                        },
                      ]}
                      placeholder="Nhập tên danh mục mới..."
                      placeholderTextColor={colors.textSecondary}
                      value={newCatName}
                      onChangeText={setNewCatName}
                      onSubmitEditing={handleAddCategoryOutside}
                    />
                    <TouchableOpacity style={styles.addCategoryCardBtn} onPress={handleAddCategoryOutside}>
                      <Ionicons name="add-circle" size={18} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <ThemedText style={styles.addCategoryCardBtnText}>Thêm</ThemedText>
                    </TouchableOpacity>
                  </View>
                </ThemedView>
              </View>

              {/* Tips */}
              <View style={styles.sectionWrapper}>
                <ThemedText style={styles.sectionTitle}>MẸO SỬ DỤNG NHANH</ThemedText>
                <ThemedView style={[styles.tipsCard, { backgroundColor: isDark ? '#1E222A' : '#F8FAFC', borderColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
                  {[
                    { icon: 'shield-checkmark', color: '#EC4899', bold: 'Khóa bảo mật: ', text: 'Bật ổ khóa khi tạo ghi chú để yêu cầu mã PIN.' },
                    { icon: 'mic', color: '#0891B2', bold: 'Ghi âm giọng nói: ', text: 'Nhấn nút micro để chuyển giọng nói thành văn bản tự động.' },
                    { icon: 'expand', color: '#7C3AED', bold: 'Toàn màn hình: ', text: 'Nhấn nút mở rộng để soạn thảo ở chế độ toàn màn hình.' },
                    { icon: 'alarm', color: '#D97706', bold: 'Nhắc nhở thông minh: ', text: 'Khi đến giờ hẹn, thông báo sẽ gửi tới tất cả người được chia sẻ ghi chú.' },
                    { icon: 'cloud-upload', color: '#10B981', bold: 'Sao lưu dữ liệu: ', text: 'Dùng tab Sao lưu để xuất/nhập dữ liệu phòng khi xóa nhầm.' },
                  ].map((tip) => (
                    <View key={tip.bold} style={styles.tipItem}>
                      <Ionicons name={tip.icon as any} size={18} color={tip.color} style={{ marginTop: 2 }} />
                      <ThemedText style={[styles.tipText, { color: colors.textSecondary }]}>
                        <ThemedText style={[styles.tipBold, { color: tip.color }]}>{tip.bold}</ThemedText>
                        {tip.text}
                      </ThemedText>
                    </View>
                  ))}
                </ThemedView>
              </View>

              {/* Reset */}
              <View style={styles.resetWrapper}>
                <Pressable
                  onPress={handleResetSampleNotes}
                  style={({ pressed }) => [styles.resetBtn, { backgroundColor: isDark ? '#262A34' : '#F1F5F9', borderColor: isDark ? '#333B4D' : '#E2E8F0' }, pressed && { opacity: 0.8 }]}>
                  <Ionicons name="refresh-outline" size={16} color={colors.textSecondary} />
                  <ThemedText style={[styles.resetBtnText, { color: colors.textSecondary }]}>Khôi phục ghi chú mẫu trên máy này</ThemedText>
                </Pressable>
                <ThemedText style={[styles.resetHintText, { color: colors.textSecondary }]}>
                  🛡️ Chỉ làm mới bộ nhớ thiết bị, không xóa dữ liệu MySQL
                </ThemedText>
              </View>
            </>
          )}

          {/* ===== HISTORY TAB ===== */}
          {activeTab === 'history' && (
            <View style={styles.sectionWrapper}>
              <ThemedText style={styles.sectionTitle}>NHẬT KÝ HOẠT ĐỘNG ({activityLogs.length})</ThemedText>
              {activityLogs.length === 0 ? (
                <ThemedView style={[styles.emptyBox, { backgroundColor: isDark ? '#1E222A' : '#F8FAFC', borderColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
                  <Ionicons name="time-outline" size={40} color={colors.textSecondary} />
                  <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>Chưa có lịch sử hoạt động nào.</ThemedText>
                  <ThemedText style={[styles.emptySubText, { color: colors.textSecondary }]}>Hãy thêm, sửa hoặc xóa ghi chú để lịch sử được ghi lại ở đây.</ThemedText>
                </ThemedView>
              ) : (
                <View style={styles.logList}>
                  {[...activityLogs].reverse().map((log) => {
                    const { text, color, icon } = actionLabel(log.action);
                    const timeStr = new Date(log.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
                    return (
                      <ThemedView key={log.id} style={[styles.logItem, { backgroundColor: isDark ? '#1E222A' : '#F8FAFC', borderColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
                        <View style={[styles.logIconWrap, { backgroundColor: `${color}18` }]}>
                          <Ionicons name={icon} size={18} color={color} />
                        </View>
                        <View style={styles.logContent}>
                          <View style={styles.logTop}>
                            <ThemedText style={[styles.logAction, { color }]}>{text}</ThemedText>
                            <ThemedText style={[styles.logTime, { color: colors.textSecondary }]}>{timeStr}</ThemedText>
                          </View>
                          <ThemedText style={styles.logTitle} numberOfLines={1}>{log.noteTitle || '(Không có tiêu đề)'}</ThemedText>
                          {log.userId && (
                            <ThemedText style={[styles.logUser, { color: colors.textSecondary }]}>👤 {log.userId}</ThemedText>
                          )}
                          {log.details && (
                            <ThemedText style={[styles.logDetails, { color: colors.textSecondary }]} numberOfLines={2}>{log.details}</ThemedText>
                          )}
                        </View>
                      </ThemedView>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* ===== BACKUP TAB ===== */}
          {activeTab === 'backup' && (
            <View style={styles.sectionWrapper}>
              <ThemedText style={styles.sectionTitle}>SAO LƯU & KHÔI PHỤC DỮ LIỆU</ThemedText>

              <ThemedView style={[styles.backupCard, { backgroundColor: isDark ? '#1A2438' : '#EFF6FF', borderColor: isDark ? '#1E3A5F' : '#BFDBFE' }]}>
                <Ionicons name="cloud-upload-outline" size={32} color="#3B82F6" style={{ marginBottom: 8 }} />
                <ThemedText style={[styles.backupTitle, { color: '#1D4ED8' }]}>Sao lưu ghi chú</ThemedText>
                <ThemedText style={[styles.backupDesc, { color: colors.textSecondary }]}>
                  Xuất toàn bộ {totalNotes} ghi chú thành tệp JSON để lưu trữ an toàn. Bạn có thể khôi phục lại bất cứ lúc nào nếu xóa nhầm.
                </ThemedText>
                <TouchableOpacity style={[styles.backupBtn, { backgroundColor: '#2563EB' }]} onPress={handleBackupNotes}>
                  <Ionicons name="download-outline" size={18} color="#FFFFFF" />
                  <ThemedText style={styles.backupBtnText}>Tạo bản sao lưu</ThemedText>
                </TouchableOpacity>
              </ThemedView>

              <ThemedView style={[styles.backupCard, { backgroundColor: isDark ? '#1A2A1A' : '#F0FDF4', borderColor: isDark ? '#1A3D1A' : '#BBF7D0' }]}>
                <Ionicons name="cloud-download-outline" size={32} color="#16A34A" style={{ marginBottom: 8 }} />
                <ThemedText style={[styles.backupTitle, { color: '#15803D' }]}>Khôi phục dữ liệu</ThemedText>
                <ThemedText style={[styles.backupDesc, { color: colors.textSecondary }]}>
                  Nhập lại ghi chú từ tệp sao lưu đã có. Dữ liệu hiện tại sẽ được hợp nhất hoặc thay thế tùy theo tệp sao lưu.
                </ThemedText>
                <TouchableOpacity style={[styles.backupBtn, { backgroundColor: '#16A34A' }]} onPress={handleRestoreNotes}>
                  <Ionicons name="folder-open-outline" size={18} color="#FFFFFF" />
                  <ThemedText style={styles.backupBtnText}>Khôi phục từ tệp backup</ThemedText>
                </TouchableOpacity>
              </ThemedView>

              <ThemedView style={[styles.warningBox, { backgroundColor: isDark ? '#2A1B0A' : '#FFFBEB', borderColor: isDark ? '#5A3A0A' : '#FDE68A' }]}>
                <Ionicons name="warning-outline" size={18} color="#D97706" />
                <ThemedText style={[styles.warningText, { color: isDark ? '#FCD34D' : '#92400E' }]}>
                  <ThemedText style={{ fontWeight: '700' }}>Lưu ý: </ThemedText>
                  Chức năng sao lưu lưu dữ liệu vào bộ nhớ thiết bị. CSDL MySQL trên server không bị ảnh hưởng.
                </ThemedText>
              </ThemedView>

              <View style={styles.resetWrapper}>
                <Pressable
                  onPress={handleResetSampleNotes}
                  style={({ pressed }) => [styles.resetBtn, { backgroundColor: isDark ? '#262A34' : '#F1F5F9', borderColor: isDark ? '#333B4D' : '#E2E8F0' }, pressed && { opacity: 0.8 }]}>
                  <Ionicons name="refresh-outline" size={16} color={colors.textSecondary} />
                  <ThemedText style={[styles.resetBtnText, { color: colors.textSecondary }]}>Khôi phục ghi chú mẫu trên máy này</ThemedText>
                </Pressable>
                <ThemedText style={[styles.resetHintText, { color: colors.textSecondary }]}>
                  🛡️ Chỉ làm mới bộ nhớ thiết bị, không xóa dữ liệu MySQL
                </ThemedText>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

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
    marginBottom: Spacing.four,
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  tabRow: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: Spacing.four,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tabBtnActive: {},
  tabText: {
    fontSize: 12,
  },
  statCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.five,
  },
  statCard: {
    width: '47%',
    padding: Spacing.three,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionWrapper: {
    marginBottom: Spacing.five,
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    opacity: 0.7,
  },
  categoriesList: {
    gap: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  catRight: {
    alignItems: 'flex-end',
    gap: 4,
    minWidth: 80,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    width: 70,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  catIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catName: {
    fontSize: 15,
    fontWeight: '700',
  },
  catPercent: {
    fontSize: 12,
  },
  catCountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  catCountText: {
    fontSize: 14,
    fontWeight: '800',
  },
  tipsCard: {
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
    gap: Spacing.three,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: '700',
  },
  resetWrapper: {
    alignItems: 'center',
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
    gap: 6,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.four,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  resetHintText: {
    fontSize: 11.5,
  },
  // Log styles
  logList: {
    gap: 10,
  },
  logItem: {
    flexDirection: 'row',
    gap: 12,
    padding: Spacing.three,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  logIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  logContent: {
    flex: 1,
    gap: 2,
  },
  logTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logAction: {
    fontSize: 12,
    fontWeight: '700',
  },
  logTime: {
    fontSize: 11,
  },
  logTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  logUser: {
    fontSize: 12,
  },
  logDetails: {
    fontSize: 12,
    lineHeight: 17,
  },
  emptyBox: {
    alignItems: 'center',
    padding: Spacing.five,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  // Backup styles
  backupCard: {
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 14,
  },
  backupTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  backupDesc: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 14,
  },
  backupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backupBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  warningBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  addCategoryCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  addCategoryCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 8,
  },
  addCategoryCardRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addCategoryCardInput: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  addCategoryCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 10,
  },
  addCategoryCardBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
