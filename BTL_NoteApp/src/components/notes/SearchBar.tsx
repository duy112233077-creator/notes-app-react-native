import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { NoteCategory } from '@/types/note';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORIES: ('Tất cả' | NoteCategory)[] = [
  'Tất cả',
  'Công việc',
  'Học tập',
  'Cá nhân',
  'Ý tưởng',
  'Khác',
];

export function SearchBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: SearchBarProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  return (
    <View style={styles.container}>
      {/* Ô tìm kiếm */}
      <ThemedView
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? '#1C1F26' : '#F1F5F9',
            borderColor: isDark ? '#2E3440' : '#E2E8F0',
          },
        ]}>
        <Ionicons
          name="search-outline"
          size={18}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Tìm kiếm tiêu đề, nội dung ghi chú..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => onSearchChange('')} hitSlop={8} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </ThemedView>

      {/* Danh sách danh mục lọc */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => onCategoryChange(cat)}
              style={({ pressed }) => [
                styles.categoryChip,
                {
                  backgroundColor: isSelected
                    ? '#2563EB'
                    : isDark
                      ? '#222733'
                      : '#FFFFFF',
                  borderColor: isSelected
                    ? '#2563EB'
                    : isDark
                      ? '#333B4D'
                      : '#E2E8F0',
                },
                pressed && { opacity: 0.8 },
              ]}>
              <ThemedText
                style={[
                  styles.chipText,
                  {
                    color: isSelected
                      ? '#FFFFFF'
                      : isDark
                        ? '#CBD5E1'
                        : '#475569',
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}>
                {cat}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    height: 46,
  },
  searchIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    outlineStyle: 'none',
  } as any,
  clearBtn: {
    padding: 2,
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
});
