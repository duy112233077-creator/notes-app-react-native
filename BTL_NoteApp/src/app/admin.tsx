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
import { AuthService, AdminService } from '@/services/authService';
import { User } from '@/types/note';

// ===== TYPES =====
interface UserRecord {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  isAdmin: boolean;
  isVip: boolean;
  storageLimitMb: number;
  stats: {
    totalNotes: number;
    activeNotes: number;
    deletedNotes: number;
    notesWithReminder: number;
    completedNotes: number;
    estimatedKb: number;
  };
}

interface SystemStats {
  totalUsers: number;
  vipUsers: number;
  totalNotes: number;
  trashNotes: number;
  totalLogs: number;
}

const VIP_STORAGE_PRESETS = [
  { label: 'Cơ bản (5 MB)', value: 5, color: '#64748B' },
  { label: 'VIP Silver (50 MB)', value: 50, color: '#94A3B8' },
  { label: 'VIP Gold (200 MB)', value: 200, color: '#F59E0B' },
  { label: 'VIP Platinum (1 GB)', value: 1024, color: '#8B5CF6' },
  { label: 'VIP Diamond (5 GB)', value: 5120, color: '#06B6D4' },
  { label: 'Không giới hạn (999 GB)', value: 999999, color: '#EF4444' },
];

function getStorageLabel(limitMb: number) {
  if (limitMb >= 999999) return '∞ Không giới hạn';
  if (limitMb >= 1024) return `${(limitMb / 1024).toFixed(0)} GB`;
  return `${limitMb} MB`;
}

function getVipTier(limitMb: number, isVip: boolean) {
  if (!isVip) return { label: 'Cơ bản', color: '#64748B', icon: 'person' as const };
  if (limitMb >= 999999) return { label: 'VIP Diamond 💎', color: '#06B6D4', icon: 'diamond' as const };
  if (limitMb >= 1024) return { label: 'VIP Platinum ✨', color: '#8B5CF6', icon: 'star' as const };
  if (limitMb >= 200) return { label: 'VIP Gold 🥇', color: '#F59E0B', icon: 'trophy' as const };
  if (limitMb >= 50) return { label: 'VIP Silver 🥈', color: '#94A3B8', icon: 'ribbon' as const };
  return { label: 'VIP', color: '#10B981', icon: 'checkmark-circle' as const };
}

// ===== VIP UPGRADE MODAL =====
function VipModal({
  visible,
  user,
  isDark,
  onClose,
  onSave,
}: {
  visible: boolean;
  user: UserRecord | null;
  isDark: boolean;
  onClose: () => void;
  onSave: (userId: string, isVip: boolean, storageLimitMb: number) => void;
}) {
  const colors = Colors[isDark ? 'dark' : 'light'];
  const [selectedPreset, setSelectedPreset] = useState(5);
  const [isVip, setIsVip] = useState(false);

  React.useEffect(() => {
    if (visible && user) {
      setIsVip(user.isVip);
      const preset = VIP_STORAGE_PRESETS.find((p) => p.value === user.storageLimitMb);
      setSelectedPreset(preset ? preset.value : user.storageLimitMb);
    }
  }, [visible, user]);

  if (!user) return null;

  const currentTier = getVipTier(selectedPreset, isVip);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={vipStyles.overlay}>
        <View style={[vipStyles.card, { backgroundColor: isDark ? '#1E222A' : '#FFFFFF' }]}>
          {/* Header */}
          <View style={vipStyles.header}>
            <View style={[vipStyles.headerBadge, { backgroundColor: currentTier.color }]}>
              <Ionicons name="shield" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={vipStyles.headerTitle}>Nâng cấp tài khoản</ThemedText>
              <ThemedText style={[vipStyles.headerSub, { color: colors.textSecondary }]} numberOfLines={1}>
                {user.name} — {user.email}
              </ThemedText>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={vipStyles.divider} />

          {/* Toggle VIP */}
          <View style={vipStyles.toggleRow}>
            <View>
              <ThemedText style={vipStyles.toggleLabel}>Kích hoạt VIP</ThemedText>
              <ThemedText style={[vipStyles.toggleSub, { color: colors.textSecondary }]}>
                Mở khóa dung lượng mở rộng
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={() => setIsVip((v) => !v)}
              style={[
                vipStyles.toggle,
                { backgroundColor: isVip ? '#10B981' : (isDark ? '#374151' : '#E5E7EB') },
              ]}>
              <View style={[vipStyles.toggleDot, { transform: [{ translateX: isVip ? 20 : 2 }] }]} />
            </TouchableOpacity>
          </View>

          {/* Storage tier picker */}
          <ThemedText style={[vipStyles.sectionLabel, { color: colors.textSecondary }]}>
            Chọn gói dung lượng:
          </ThemedText>
          <View style={vipStyles.presetGrid}>
            {VIP_STORAGE_PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.value;
              return (
                <TouchableOpacity
                  key={preset.value}
                  onPress={() => { setSelectedPreset(preset.value); if (!isVip && preset.value > 5) setIsVip(true); }}
                  style={[
                    vipStyles.presetBtn,
                    {
                      backgroundColor: isSelected ? preset.color + '25' : isDark ? '#1A1D25' : '#F8FAFC',
                      borderColor: isSelected ? preset.color : isDark ? '#2E3440' : '#E2E8F0',
                    },
                  ]}>
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={16}
                    color={isSelected ? preset.color : colors.textSecondary}
                  />
                  <View>
                    <ThemedText style={[vipStyles.presetLabel, { color: isSelected ? preset.color : colors.text, fontWeight: isSelected ? '700' : '500' }]}>
                      {preset.label}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Preview */}
          <View style={[vipStyles.previewBox, { backgroundColor: currentTier.color + '15', borderColor: currentTier.color + '40' }]}>
            <Ionicons name={currentTier.icon} size={18} color={currentTier.color} />
            <ThemedText style={[vipStyles.previewText, { color: currentTier.color }]}>
              {currentTier.label} · Dung lượng: {getStorageLabel(selectedPreset)}
            </ThemedText>
          </View>

          {/* Buttons */}
          <View style={vipStyles.btnRow}>
            <TouchableOpacity style={vipStyles.cancelBtn} onPress={onClose}>
              <ThemedText style={{ color: colors.textSecondary, fontWeight: '600', fontSize: 14 }}>Hủy</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[vipStyles.saveBtn, { backgroundColor: currentTier.color }]}
              onPress={() => { onSave(user.id, isVip, selectedPreset); onClose(); }}>
              <Ionicons name="save" size={16} color="#FFFFFF" />
              <ThemedText style={vipStyles.saveBtnText}>Lưu thay đổi</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const vipStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  card: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerBadge: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  headerSub: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(150,150,150,0.15)' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleLabel: { fontSize: 15, fontWeight: '700' },
  toggleSub: { fontSize: 12, marginTop: 2 },
  toggle: { width: 46, height: 26, borderRadius: 13, justifyContent: 'center' },
  toggleDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFFFFF', position: 'absolute' },
  sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  presetGrid: { gap: 8 },
  presetBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11, borderRadius: 12, borderWidth: 1 },
  presetLabel: { fontSize: 13 },
  previewBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  previewText: { fontSize: 14, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 13, borderRadius: 14, backgroundColor: 'rgba(100,116,139,0.1)', alignItems: 'center' },
  saveBtn: { flex: 2, flexDirection: 'row', gap: 8, paddingVertical: 13, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});

// ===== MAIN ADMIN SCREEN =====
export default function AdminDashboardScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];
  const safeAreaInsets = useSafeAreaInsets();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVip, setFilterVip] = useState<'all' | 'vip' | 'normal'>('all');
  const [vipModalUser, setVipModalUser] = useState<UserRecord | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const session = await AuthService.getStoredSession();
      setCurrentUser(session?.user ?? null);

      if (!session?.user?.isAdmin) {
        setIsOffline(false);
        setLoading(false);
        return;
      }

      const [userList, stats] = await Promise.all([
        AdminService.getAllUsers(),
        AdminService.getSystemStats(),
      ]);
      setUsers(userList);
      setSystemStats(stats);
      setIsOffline(false);
    } catch (err: any) {
      setIsOffline(true);
      setToast({ message: 'Không kết nối được server', type: 'error', subMessage: err.message });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleSaveVip = async (userId: string, isVip: boolean, storageLimitMb: number) => {
    try {
      await AdminService.setVip(userId, isVip, storageLimitMb);
      await loadData();
      const tier = getVipTier(storageLimitMb, isVip);
      setToast({ message: `✅ Đã cập nhật: ${tier.label}`, type: 'success', subMessage: `Dung lượng: ${getStorageLabel(storageLimitMb)}` });
    } catch (err: any) {
      setToast({ message: '❌ Lỗi cập nhật VIP', type: 'error', subMessage: err.message });
    }
  };

  const handleToggleAdmin = async (user: UserRecord) => {
    const newVal = !user.isAdmin;
    const msg = newVal ? `Cấp quyền Admin cho "${user.name}"?` : `Thu hồi quyền Admin của "${user.name}"?`;
    const doIt = async () => {
      try {
        await AdminService.setAdmin(user.id, newVal);
        await loadData();
        setToast({ message: newVal ? '✅ Đã cấp quyền Admin' : '✅ Đã thu hồi quyền Admin', type: 'success' });
      } catch (err: any) {
        setToast({ message: '❌ Lỗi', type: 'error', subMessage: err.message });
      }
    };
    if (Platform.OS === 'web') {
      if (window.confirm(msg)) await doIt();
    } else {
      Alert.alert('Xác nhận', msg, [{ text: 'Hủy', style: 'cancel' }, { text: 'Đồng ý', onPress: doIt }]);
    }
  };

  const handleDeleteUser = async (user: UserRecord) => {
    const msg = `Xóa tài khoản "${user.name}" và toàn bộ ${user.stats.totalNotes} ghi chú?`;
    const doIt = async () => {
      try {
        await AdminService.deleteUser(user.id);
        await loadData();
        setToast({ message: `✅ Đã xóa tài khoản "${user.name}"`, type: 'success' });
      } catch (err: any) {
        setToast({ message: '❌ Lỗi xóa tài khoản', type: 'error', subMessage: err.message });
      }
    };
    if (Platform.OS === 'web') {
      if (window.confirm(`⚠️ ${msg}\nThao tác này không thể hoàn tác!`)) await doIt();
    } else {
      Alert.alert('⚠️ Xóa tài khoản', msg, [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa vĩnh viễn', style: 'destructive', onPress: doIt },
      ]);
    }
  };

  const filteredUsers = useMemo(() => {
    let list = users;
    if (filterVip === 'vip') list = list.filter((u) => u.isVip);
    if (filterVip === 'normal') list = list.filter((u) => !u.isVip);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return list;
  }, [users, filterVip, searchQuery]);

  // ---- NOT ADMIN ----
  if (!currentUser?.isAdmin) {
    return (
      <ThemedView style={styles.screen}>
        <View style={[styles.accessDenied, { paddingTop: safeAreaInsets.top + 40 }]}>
          <View style={styles.deniedBadge}>
            <Ionicons name="shield-half" size={44} color="#EF4444" />
          </View>
          <ThemedText style={styles.deniedTitle}>Khu Vực Hạn Chế</ThemedText>
          <ThemedText style={[styles.deniedDesc, { color: colors.textSecondary }]}>
            Trang này chỉ dành cho Quản Trị Viên hệ thống.
          </ThemedText>
          <View style={[styles.credBox, { backgroundColor: isDark ? '#1A1D25' : '#F8FAFC', borderColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
            <ThemedText style={[styles.credTitle, { color: colors.textSecondary }]}>🔑 Tài khoản Admin mặc định:</ThemedText>
            <ThemedText style={styles.credEmail}>📧 admin@noteapp.com</ThemedText>
            <ThemedText style={styles.credPwd}>🔒 Admin@123456</ThemedText>
          </View>
          {!currentUser && (
            <ThemedText style={[styles.deniedDesc, { color: '#F59E0B' }]}>
              ⚠️ Bạn chưa đăng nhập. Hãy đăng nhập bằng tài khoản admin ở tab Thống kê.
            </ThemedText>
          )}
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: Math.max(safeAreaInsets.top, Spacing.four), paddingBottom: safeAreaInsets.bottom + 100 },
        ]}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.adminBadge}>
                <Ionicons name="shield-checkmark" size={22} color="#FFFFFF" />
              </View>
              <View>
                <ThemedText style={styles.headerTitle}>Trang Quản Trị</ThemedText>
                <ThemedText style={[styles.headerSub, { color: colors.textSecondary }]}>
                  {users.length} tài khoản · {systemStats?.totalNotes ?? '—'} ghi chú
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity
              onPress={loadData}
              style={[styles.refreshBtn, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF', borderColor: isDark ? '#334155' : '#BFDBFE' }]}>
              <Ionicons name="refresh" size={16} color="#2563EB" />
              <ThemedText style={{ fontSize: 12, color: '#2563EB', fontWeight: '700' }}>Làm mới</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Offline warning */}
          {isOffline && (
            <View style={[styles.offlineBar, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
              <Ionicons name="warning" size={16} color="#D97706" />
              <ThemedText style={{ color: '#92400E', fontSize: 13 }}>Server offline — dữ liệu có thể không cập nhật</ThemedText>
            </View>
          )}

          {/* System Stats Cards */}
          {systemStats && (
            <View style={styles.statsGrid}>
              {[
                { icon: 'people', color: '#2563EB', label: 'Tổng TK', value: String(systemStats.totalUsers) },
                { icon: 'diamond', color: '#F59E0B', label: 'TK VIP', value: String(systemStats.vipUsers) },
                { icon: 'documents', color: '#10B981', label: 'Ghi chú', value: String(systemStats.totalNotes) },
                { icon: 'trash', color: '#EF4444', label: 'Thùng rác', value: String(systemStats.trashNotes) },
                { icon: 'time', color: '#8B5CF6', label: 'Nhật ký', value: String(systemStats.totalLogs) },
                { icon: 'server', color: '#0891B2', label: 'Normal TK', value: String(systemStats.totalUsers - systemStats.vipUsers) },
              ].map((s) => (
                <ThemedView
                  key={s.label}
                  style={[styles.statCard, { backgroundColor: isDark ? '#1E222A' : '#F8FAFC', borderColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
                  <View style={[styles.statIconBg, { backgroundColor: s.color + '20' }]}>
                    <Ionicons name={s.icon as any} size={20} color={s.color} />
                  </View>
                  <ThemedText style={[styles.statValue, { color: s.color }]}>{s.value}</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</ThemedText>
                </ThemedView>
              ))}
            </View>
          )}

          {/* Search + Filter */}
          <View style={styles.controlRow}>
            <View style={[styles.searchBox, { backgroundColor: isDark ? '#1E222A' : '#F1F5F9', borderColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
              <Ionicons name="search" size={16} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Tìm tên hoặc email..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            <View style={[styles.filterRow, { backgroundColor: isDark ? '#1A1E27' : '#F1F5F9' }]}>
              {(['all', 'vip', 'normal'] as const).map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFilterVip(f)}
                  style={[styles.filterBtn, filterVip === f && { backgroundColor: '#2563EB' }]}>
                  <ThemedText style={[styles.filterBtnText, { color: filterVip === f ? '#FFF' : colors.textSecondary }]}>
                    {f === 'all' ? 'Tất cả' : f === 'vip' ? 'VIP' : 'Thường'}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* User List */}
          <ThemedText style={styles.sectionTitle}>
            👥 DANH SÁCH TÀI KHOẢN ({filteredUsers.length})
          </ThemedText>

          {loading ? (
            <ThemedView style={[styles.emptyBox, { backgroundColor: isDark ? '#1E222A' : '#F8FAFC', borderColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
              <Ionicons name="hourglass" size={36} color={colors.textSecondary} />
              <ThemedText style={[{ color: colors.textSecondary, fontSize: 15, fontWeight: '600' }]}>Đang tải dữ liệu...</ThemedText>
            </ThemedView>
          ) : filteredUsers.length === 0 ? (
            <ThemedView style={[styles.emptyBox, { backgroundColor: isDark ? '#1E222A' : '#F8FAFC', borderColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
              <Ionicons name="people-outline" size={40} color={colors.textSecondary} />
              <ThemedText style={[{ color: colors.textSecondary, fontSize: 15, fontWeight: '600' }]}>Không tìm thấy tài khoản nào</ThemedText>
            </ThemedView>
          ) : (
            <View style={styles.userList}>
              {filteredUsers.map((user) => {
                const tier = getVipTier(user.storageLimitMb, user.isVip);
                const usedPercent = Math.min(100, (user.stats.estimatedKb / (user.storageLimitMb * 1024)) * 100);
                const usedKb = user.stats.estimatedKb;
                const usedDisplay = usedKb >= 1024 ? `${(usedKb / 1024).toFixed(1)} MB` : `${usedKb} KB`;

                return (
                  <ThemedView
                    key={user.id}
                    style={[
                      styles.userCard,
                      {
                        backgroundColor: isDark ? '#1E222A' : '#FFFFFF',
                        borderColor: user.isVip ? tier.color + '40' : isDark ? '#2E3440' : '#E2E8F0',
                        borderLeftColor: user.isAdmin ? '#EF4444' : user.isVip ? tier.color : isDark ? '#2E3440' : '#E2E8F0',
                        borderLeftWidth: 4,
                      },
                    ]}>
                    {/* User Info Row */}
                    <View style={styles.userInfoRow}>
                      <View style={[styles.userAvatar, { backgroundColor: user.isAdmin ? '#EF444420' : tier.color + '20' }]}>
                        <ThemedText style={[styles.userAvatarText, { color: user.isAdmin ? '#EF4444' : tier.color }]}>
                          {user.name.charAt(0).toUpperCase()}
                        </ThemedText>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.userNameRow}>
                          <ThemedText style={styles.userName} numberOfLines={1}>{user.name}</ThemedText>
                          {user.isAdmin && (
                            <View style={styles.adminPill}>
                              <Ionicons name="shield-checkmark" size={11} color="#EF4444" />
                              <ThemedText style={styles.adminPillText}>Admin</ThemedText>
                            </View>
                          )}
                          {user.isVip && (
                            <View style={[styles.vipPill, { backgroundColor: tier.color + '20', borderColor: tier.color + '40' }]}>
                              <Ionicons name={tier.icon} size={11} color={tier.color} />
                              <ThemedText style={[styles.vipPillText, { color: tier.color }]}>{tier.label.split(' ')[0]}</ThemedText>
                            </View>
                          )}
                        </View>
                        <ThemedText style={[styles.userEmail, { color: colors.textSecondary }]} numberOfLines={1}>
                          {user.email}
                        </ThemedText>
                        <ThemedText style={[styles.userJoinDate, { color: colors.textSecondary }]}>
                          Ngày tạo: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}
                        </ThemedText>
                      </View>
                    </View>

                    {/* Stats Row */}
                    <View style={[styles.statsRow, { backgroundColor: isDark ? '#14171E' : '#F8FAFC' }]}>
                      {[
                        { icon: 'document-text', color: '#2563EB', label: 'Ghi chú', value: user.stats.activeNotes },
                        { icon: 'calendar', color: '#7C3AED', label: 'Lịch hẹn', value: user.stats.notesWithReminder },
                        { icon: 'checkmark-circle', color: '#16A34A', label: 'Đã xong', value: user.stats.completedNotes },
                        { icon: 'trash', color: '#EF4444', label: 'Thùng rác', value: user.stats.deletedNotes },
                      ].map((s) => (
                        <View key={s.label} style={styles.miniStat}>
                          <Ionicons name={s.icon as any} size={14} color={s.color} />
                          <ThemedText style={[styles.miniStatValue, { color: s.color }]}>{s.value}</ThemedText>
                          <ThemedText style={[styles.miniStatLabel, { color: colors.textSecondary }]}>{s.label}</ThemedText>
                        </View>
                      ))}
                    </View>

                    {/* Storage bar */}
                    <View style={styles.storageSection}>
                      <View style={styles.storageTopRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Ionicons name="server-outline" size={14} color={tier.color} />
                          <ThemedText style={[styles.storageTitle, { color: tier.color }]}>
                            {getStorageLabel(user.storageLimitMb)} · {tier.label}
                          </ThemedText>
                        </View>
                        <ThemedText style={[styles.storageUsed, { color: colors.textSecondary }]}>
                          {usedDisplay} / {getStorageLabel(user.storageLimitMb)}
                        </ThemedText>
                      </View>
                      <View style={[styles.storageBarBg, { backgroundColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
                        <View
                          style={[
                            styles.storageBarFill,
                            {
                              width: `${usedPercent}%` as any,
                              backgroundColor: usedPercent > 90 ? '#EF4444' : usedPercent > 70 ? '#F59E0B' : '#10B981',
                            },
                          ]}
                        />
                      </View>
                      <ThemedText style={[styles.storagePercent, { color: colors.textSecondary }]}>
                        {usedPercent.toFixed(1)}% đã sử dụng
                      </ThemedText>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionRow}>
                      {/* Nâng cấp VIP */}
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: tier.color + '15', borderColor: tier.color + '30' }]}
                        onPress={() => setVipModalUser(user)}>
                        <Ionicons name="diamond-outline" size={14} color={tier.color} />
                        <ThemedText style={[styles.actionBtnText, { color: tier.color }]}>
                          {user.isVip ? 'Chỉnh VIP' : 'Nâng VIP'}
                        </ThemedText>
                      </TouchableOpacity>

                      {/* Toggle Admin (không áp dụng cho admin gốc) */}
                      {user.id !== 'admin-root-001' && (
                        <TouchableOpacity
                          style={[
                            styles.actionBtn,
                            {
                              backgroundColor: user.isAdmin ? '#EF444415' : '#2563EB15',
                              borderColor: user.isAdmin ? '#EF444430' : '#2563EB30',
                            },
                          ]}
                          onPress={() => handleToggleAdmin(user)}>
                          <Ionicons
                            name={user.isAdmin ? 'shield-half-outline' : 'shield-outline'}
                            size={14}
                            color={user.isAdmin ? '#EF4444' : '#2563EB'}
                          />
                          <ThemedText style={[styles.actionBtnText, { color: user.isAdmin ? '#EF4444' : '#2563EB' }]}>
                            {user.isAdmin ? 'Thu hồi Admin' : 'Cấp Admin'}
                          </ThemedText>
                        </TouchableOpacity>
                      )}

                      {/* Xóa user */}
                      {user.id !== 'admin-root-001' && user.id !== currentUser?.id && (
                        <TouchableOpacity
                          style={[styles.actionBtn, { backgroundColor: '#EF444415', borderColor: '#EF444430' }]}
                          onPress={() => handleDeleteUser(user)}>
                          <Ionicons name="trash-outline" size={14} color="#EF4444" />
                          <ThemedText style={[styles.actionBtnText, { color: '#EF4444' }]}>Xóa</ThemedText>
                        </TouchableOpacity>
                      )}
                    </View>
                  </ThemedView>
                );
              })}
            </View>
          )}

          {/* Admin credentials reminder */}
          <ThemedView style={[styles.credCard, { backgroundColor: isDark ? '#1A1E3A' : '#EFF6FF', borderColor: isDark ? '#1E3A7F' : '#BFDBFE' }]}>
            <Ionicons name="key" size={16} color="#2563EB" />
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.credCardTitle, { color: '#1D4ED8' }]}>Tài khoản Admin mặc định</ThemedText>
              <ThemedText style={[styles.credCardSub, { color: '#3B82F6' }]}>
                📧 admin@noteapp.com  🔒 Admin@123456
              </ThemedText>
            </View>
          </ThemedView>
        </View>
      </ScrollView>

      <VipModal
        visible={!!vipModalUser}
        user={vipModalUser}
        isDark={isDark}
        onClose={() => setVipModalUser(null)}
        onSave={handleSaveVip}
      />
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollView: { flex: 1 },
  contentContainer: { alignItems: 'center', paddingHorizontal: Spacing.three },
  container: { width: '100%', maxWidth: 820 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.four, gap: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  adminBadge: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  headerSub: { fontSize: 13, marginTop: 2 },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  offlineBar: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 14 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { width: '30.5%', borderRadius: 16, borderWidth: 1, padding: 12, alignItems: 'center', gap: 4 },
  statIconBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  controlRow: { gap: 10, marginBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14 },
  filterRow: { flexDirection: 'row', borderRadius: 12, padding: 3, gap: 3 },
  filterBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  filterBtnText: { fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 0.8, opacity: 0.7, marginBottom: 12 },
  emptyBox: { alignItems: 'center', padding: 40, borderRadius: 16, borderWidth: 1, gap: 10 },
  userList: { gap: 14, marginBottom: 16 },
  userCard: { borderRadius: 18, borderWidth: 1, padding: 16, gap: 12 },
  userInfoRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  userAvatar: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  userAvatarText: { fontSize: 20, fontWeight: '800' },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  userName: { fontSize: 16, fontWeight: '700' },
  adminPill: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10, backgroundColor: '#EF444420' },
  adminPillText: { fontSize: 10, color: '#EF4444', fontWeight: '700' },
  vipPill: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10, borderWidth: 1 },
  vipPillText: { fontSize: 10, fontWeight: '700' },
  userEmail: { fontSize: 13, marginTop: 2 },
  userJoinDate: { fontSize: 11, marginTop: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, borderRadius: 12 },
  miniStat: { alignItems: 'center', gap: 2 },
  miniStatValue: { fontSize: 16, fontWeight: '800' },
  miniStatLabel: { fontSize: 10, fontWeight: '600' },
  storageSection: { gap: 6 },
  storageTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  storageTitle: { fontSize: 13, fontWeight: '700' },
  storageUsed: { fontSize: 12 },
  storageBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  storageBarFill: { height: '100%', borderRadius: 4 },
  storagePercent: { fontSize: 11 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  actionBtnText: { fontSize: 12, fontWeight: '700' },
  credCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, marginTop: 8 },
  credCardTitle: { fontSize: 13, fontWeight: '700' },
  credCardSub: { fontSize: 12, marginTop: 2 },
  // Access denied styles
  accessDenied: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 16 },
  deniedBadge: { width: 90, height: 90, borderRadius: 28, backgroundColor: '#EF444415', justifyContent: 'center', alignItems: 'center' },
  deniedTitle: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  deniedDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  credBox: { padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 6, marginTop: 8 },
  credTitle: { fontSize: 13, fontWeight: '600' },
  credEmail: { fontSize: 15, fontWeight: '700', color: '#2563EB' },
  credPwd: { fontSize: 15, fontWeight: '700', color: '#7C3AED' },
});
