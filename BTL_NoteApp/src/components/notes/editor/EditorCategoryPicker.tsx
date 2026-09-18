import React from 'react';
import { View, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { NoteCategory } from '@/types/note';

interface EditorCategoryPickerProps {
  categories: NoteCategory[];
  selectedCategory: NoteCategory;
  onSelectCategory: (cat: NoteCategory) => void;
}

export const EditorCategoryPicker: React.FC<EditorCategoryPickerProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>Danh mục</ThemedText>
      <View style={styles.categoryWrap}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => onSelectCategory(cat)}
              style={[
                styles.categoryBtn,
                {
                  backgroundColor: isSelected
                    ? '#2563EB'
                    : isDark
                      ? '#2A303F'
                      : '#F1F5F9',
                },
              ]}>
              <ThemedText
                style={[
                  styles.categoryBtnText,
                  {
                    color: isSelected ? '#FFFFFF' : isDark ? '#E2E8F0' : '#475569',
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}>
                {cat}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    opacity: 0.8,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  categoryBtnText: {
    fontSize: 12.5,
  },
});
