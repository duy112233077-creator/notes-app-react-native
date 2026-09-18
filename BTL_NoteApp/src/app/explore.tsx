import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
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
import { Note, NoteCategory } from '@/types/note';

const CATEGORIES: { name: NoteCategory; icon: any; color: string }[] = [
  { name: 'Công việc', icon: 'briefcase', color: '#3B82F6' },
  { name: 'Học tập', icon: 'school', color: '#10B981' },
  { name: 'Cá nhân', icon: 'person', color: '#EC4899' },
  { name: 'Ý tưởng', icon: 'bulb', color: '#F59E0B' },
  { name: 'Khác', icon: 'folder', color: '#8B5CF6' },
];

export default function StatisticsScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];
  const safeAreaInsets = useSafeAreaInsets();

  const [notes, setNotes] = useState<Note[]>([]);
  const [toast, setToast] = useState<ToastConfig | null>(null);

  const loadData = async () => {
    const data = await NoteStorage.getNotes();
    setNotes(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const totalNotes = notes.length;
  const pinnedCount = notes.filter((n) => n.isPinned).length;
  const lockedCount = notes.filter((n) => n.isLocked).length;

  // Khôi phục ghi chú mẫu AN TOÀN — chỉ tác động bộ nhớ máy cục bộ, bảo vệ MySQL
  const handleResetSampleNotes = async () => {
    const action = async () => {
      const fresh = await NoteStorage.resetLocalSampleNotes();
      setNotes(fresh);
      setToast({
        message: 'Đã khôi phục ghi chú mẫu thành công',
        type: 'success',
        subMessage: 'Dữ liệu chỉ được đặt lại trên thiết bị này, CSDL MySQL được giữ an toàn.',
      });
    };

    if (Platform.OS === 'web') {
      if (
        window.confirm(
          'Khôi phục danh sách ghi chú mẫu trên máy này?\n(Lưu ý: Hành động này chỉ làm mới dữ liệu bộ nhớ máy, không làm mất dữ liệu trên máy chủ MySQL).'
        )
      ) {
        await action();
      }
    } else {
      Alert.alert(
        'Khôi phục dữ liệu mẫu',
        'Hành động này sẽ tải lại danh sách mẫu trên thiết bị này. Dữ liệu trên MySQL không bị ảnh hưởng.',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Đồng ý', onPress: action },
        ]
      );
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
            <ThemedText style={styles.headerTitle}>Thống Kê & Danh Mục</ThemedText>
            <ThemedText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Tổng quan tình trạng ghi chú và phân bổ danh mục của bạn
            </ThemedText>
          </View>

          {/* Hộp chỉ số tổng quát: 3 Thẻ thống kê */}
          <View style={styles.statCardsRow}>
            {/* Tổng số ghi chú */}
            <ThemedView
              style={[
                styles.statCard,
                {
                  backgroundColor: isDark ? '#1C2230' : '#EFF6FF',
                  borderColor: isDark ? '#2B3850' : '#BFDBFE',
                },
              ]}>
              <Ionicons name="documents" size={24} color="#3B82F6" />
              <ThemedText style={[styles.statValue, { color: '#3B82F6' }]}>
                {totalNotes}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                Tổng ghi chú
              </ThemedText>
            </ThemedView>

            {/* Đã ghim */}
            <ThemedView
              style={[
                styles.statCard,
                {
                  backgroundColor: isDark ? '#2D2817' : '#FEFCE8',
                  borderColor: isDark ? '#54461B' : '#FEF08A',
                },
              ]}>
              <Ionicons name="pin" size={24} color="#EAB308" />
              <ThemedText style={[styles.statValue, { color: '#CA8A04' }]}>
                {pinnedCount}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                Đã ghim
              </ThemedText>
            </ThemedView>

            {/* Đã khóa bảo mật */}
            <ThemedView
              style={[
                styles.statCard,
                {
                  backgroundColor: isDark ? '#2A1B28' : '#FDF2F8',
                  borderColor: isDark ? '#4A2A46' : '#FBCFE8',
                },
              ]}>
              <Ionicons name="lock-closed" size={24} color="#EC4899" />
              <ThemedText style={[styles.statValue, { color: '#DB2777' }]}>
                {lockedCount}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                Đã khóa PIN
              </ThemedText>
            </ThemedView>
          </View>

          {/* Phân bố theo danh mục */}
          <View style={styles.sectionWrapper}>
            <ThemedText style={styles.sectionTitle}>PHÂN BỐ THEO DANH MỤC</ThemedText>
            <View style={styles.categoriesList}>
              {CATEGORIES.map((cat) => {
                const count = notes.filter((n) => n.category === cat.name).length;
                const percent = totalNotes > 0 ? Math.round((count / totalNotes) * 100) : 0;
                return (
                  <ThemedView
                    key={cat.name}
                    style={[
                      styles.categoryRow,
                      {
                        backgroundColor: isDark ? '#1E222A' : '#F8FAFC',
                        borderColor: isDark ? '#2E3440' : '#E2E8F0',
                      },
                    ]}>
                    <View style={styles.catLeft}>
                      <View
                        style={[styles.catIconWrap, { backgroundColor: `${cat.color}20` }]}>
                        <Ionicons name={cat.icon} size={18} color={cat.color} />
                      </View>
                      <View>
                        <ThemedText style={styles.catName}>{cat.name}</ThemedText>
                        <ThemedText
                          style={[styles.catPercent, { color: colors.textSecondary }]}>
                          {percent}% tổng số ghi chú
                        </ThemedText>
                      </View>
                    </View>

                    <View style={[styles.catCountBadge, { backgroundColor: `${cat.color}25` }]}>
                      <ThemedText style={[styles.catCountText, { color: cat.color }]}>
                        {count}
                      </ThemedText>
                    </View>
                  </ThemedView>
                );
              })}
            </View>
          </View>

          {/* Hướng dẫn sử dụng nhanh */}
          <View style={styles.sectionWrapper}>
            <ThemedText style={styles.sectionTitle}>MẸO SỬ DỤNG NHANH</ThemedText>
            <ThemedView
              style={[
                styles.tipsCard,
                {
                  backgroundColor: isDark ? '#1E222A' : '#F8FAFC',
                  borderColor: isDark ? '#2E3440' : '#E2E8F0',
                },
              ]}>
              <View style={styles.tipItem}>
                <Ionicons name="shield-checkmark" size={18} color="#EC4899" style={{ marginTop: 2 }} />
                <ThemedText style={[styles.tipText, { color: colors.textSecondary }]}>
                  <ThemedText style={[styles.tipBold, { color: '#EC4899' }]}>Khóa bảo mật: </ThemedText>
                  Bật biểu tượng ổ khóa khi tạo ghi chú để yêu cầu nhập mã PIN (mặc định: 1234) khi xem.
                </ThemedText>
              </View>

              <View style={styles.tipItem}>
                <Ionicons name="sparkles" size={18} color="#EAB308" style={{ marginTop: 2 }} />
                <ThemedText style={[styles.tipText, { color: colors.textSecondary }]}>
                  <ThemedText style={styles.tipBold}>Đổi màu sắc thẻ: </ThemedText>
                  Gán màu vàng, xanh, hồng để nhận diện nhanh các nội dung khẩn cấp hoặc đặc biệt.
                </ThemedText>
              </View>

              <View style={styles.tipItem}>
                <Ionicons name="pin" size={18} color="#3B82F6" style={{ marginTop: 2 }} />
                <ThemedText style={[styles.tipText, { color: colors.textSecondary }]}>
                  <ThemedText style={styles.tipBold}>Ghim lên đầu: </ThemedText>
                  Bấm biểu tượng chiếc ghim để giữ ghi chú quan trọng luôn hiển thị ở trên cùng.
                </ThemedText>
              </View>
            </ThemedView>
          </View>

          {/* Khôi phục dữ liệu mẫu */}
          <View style={styles.resetWrapper}>
            <Pressable
              onPress={handleResetSampleNotes}
              style={({ pressed }) => [
                styles.resetBtn,
                {
                  backgroundColor: isDark ? '#262A34' : '#F1F5F9',
                  borderColor: isDark ? '#333B4D' : '#E2E8F0',
                },
                pressed && { opacity: 0.8 },
              ]}>
              <Ionicons name="refresh-outline" size={16} color={colors.textSecondary} />
              <ThemedText style={[styles.resetBtnText, { color: colors.textSecondary }]}>
                Khôi phục ghi chú mẫu trên máy này
              </ThemedText>
            </Pressable>
            <ThemedText style={[styles.resetHintText, { color: colors.textSecondary }]}>
              🛡️ Chỉ làm mới bộ nhớ thiết bị, không xóa dữ liệu người dùng trên MySQL
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Toast thông báo */}
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
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
  statCardsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.five,
  },
  statCard: {
    flex: 1,
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
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    color: '#2563EB',
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
});
