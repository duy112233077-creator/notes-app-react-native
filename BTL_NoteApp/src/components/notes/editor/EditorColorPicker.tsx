import React from 'react';
import { View, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { NOTE_COLORS } from '@/types/note';

interface EditorColorPickerProps {
  selectedColorId: string;
  onSelectColor: (id: string) => void;
}

export const EditorColorPicker: React.FC<EditorColorPickerProps> = ({
  selectedColorId,
  onSelectColor,
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>Màu sắc thẻ</ThemedText>
      <View style={styles.colorsWrap}>
        {NOTE_COLORS.map((c) => {
          const isSelected = selectedColorId === c.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => onSelectColor(c.id)}
              style={[
                styles.colorCircle,
                {
                  backgroundColor: isDark ? c.bgDark : c.bgLight,
                  borderColor: isSelected
                    ? '#2563EB'
                    : isDark
                      ? c.borderDark
                      : c.borderLight,
                  borderWidth: isSelected ? 2.5 : 1.5,
                },
              ]}>
              {isSelected && (
                <Ionicons
                  name="checkmark"
                  size={15}
                  color={isDark ? '#FFFFFF' : '#0F172A'}
                />
              )}
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
  colorsWrap: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
