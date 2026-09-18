import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

interface EmptyStateProps {
  isSearch: boolean;
  onAction: () => void;
}

export function EmptyState({ isSearch, onAction }: EmptyStateProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: isDark ? '#1F2430' : '#F1F5F9' },
        ]}>
        <Ionicons
          name={isSearch ? 'search-outline' : 'document-text-outline'}
          size={42}
          color={isDark ? '#94A3B8' : '#64748B'}
        />
      </View>

      <ThemedText style={styles.title}>
        {isSearch ? 'Không tìm thấy ghi chú' : 'Chưa có ghi chú nào'}
      </ThemedText>

      <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
        {isSearch
          ? 'Hãy thử tìm với từ khóa khác hoặc chọn lại danh mục lọc.'
          : 'Bắt đầu ngày mới bằng cách ghi lại ý tưởng, kế hoạch hay bài học của bạn!'}
      </ThemedText>

      <Pressable
        onPress={onAction}
        style={({ pressed }) => [
          styles.actionBtn,
          { backgroundColor: '#2563EB' },
          pressed && { opacity: 0.85 },
        ]}>
        <Ionicons
          name={isSearch ? 'refresh-outline' : 'add-outline'}
          size={18}
          color="#FFFFFF"
          style={{ marginRight: 6 }}
        />
        <ThemedText style={styles.actionBtnText}>
          {isSearch ? 'Xóa bộ lọc tìm kiếm' : 'Tạo ghi chú đầu tiên'}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 20,
    marginBottom: Spacing.four,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
