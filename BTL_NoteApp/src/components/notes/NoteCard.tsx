import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
  Alert,
  Platform,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { NOTE_COLORS, Note } from '@/types/note';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    const time = d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const date = d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return `${time} • ${date}`;
  } catch {
    return isoString;
  }
}

export function NoteCard({ note, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const colorConfig =
    NOTE_COLORS.find((c) => c.id === note.colorId) || NOTE_COLORS[0];

  const bgColor = isDark ? colorConfig.bgDark : colorConfig.bgLight;
  const borderColor = isDark ? colorConfig.borderDark : colorConfig.borderLight;

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        `Bạn có chắc chắn muốn xóa ghi chú "${note.title || 'không tên'}" không?`
      );
      if (confirmed) {
        onDelete(note.id);
      }
    } else {
      Alert.alert(
        'Xác nhận xóa',
        `Bạn có chắc chắn muốn xóa ghi chú "${note.title || 'không tên'}" không?`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Xóa',
            style: 'destructive',
            onPress: () => onDelete(note.id),
          },
        ]
      );
    }
  };

  return (
    <Pressable
      onPress={() => onEdit(note)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
        },
        pressed && styles.pressed,
      ]}>
      {/* Header card: Danh mục & Ghim */}
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: isDark ? '#2E3440' : '#E2E8F0' },
          ]}>
          <ThemedText
            style={[
              styles.categoryText,
              { color: isDark ? '#E2E8F0' : '#334155' },
            ]}>
            {note.category}
          </ThemedText>
        </View>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onTogglePin(note.id);
          }}
          hitSlop={8}
          style={styles.pinBtn}>
          <Ionicons
            name={note.isPinned ? 'pin' : 'pin-outline'}
            size={18}
            color={note.isPinned ? '#EAB308' : colors.textSecondary}
          />
        </Pressable>
      </View>

      {/* Tiêu đề */}
      <ThemedText
        type="default"
        numberOfLines={2}
        style={[
          styles.title,
          { color: isDark ? '#F1F5F9' : '#0F172A' },
        ]}>
        {note.title || 'Ghi chú không tên'}
      </ThemedText>

      {/* Trích dẫn nội dung */}
      <ThemedText
        numberOfLines={4}
        style={[
          styles.content,
          { color: isDark ? '#CBD5E1' : '#475569' },
        ]}>
        {note.content || '(Chưa có nội dung)'}
      </ThemedText>

      {/* Footer: Thời gian và thao tác */}
      <View style={styles.cardFooter}>
        <ThemedText
          style={[
            styles.dateText,
            { color: isDark ? '#94A3B8' : '#64748B' },
          ]}>
          {formatDate(note.updatedAt || note.createdAt)}
        </ThemedText>

        <View style={styles.actions}>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            hitSlop={8}
            style={styles.actionBtn}>
            <Ionicons name="pencil-outline" size={17} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            hitSlop={8}
            style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={17} color="#EF4444" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.four,
    borderWidth: 1.5,
    marginBottom: Spacing.three,
    // Hiệu ứng bóng nhẹ
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      } as any,
      default: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
    }),
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pinBtn: {
    padding: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.three,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
    paddingTop: Spacing.two,
  },
  dateText: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  actionBtn: {
    padding: 5,
    borderRadius: 6,
  },
});
