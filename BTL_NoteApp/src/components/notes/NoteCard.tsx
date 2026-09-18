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
  onRequestUnlock?: (note: Note, action: 'edit' | 'delete') => void;
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

export function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onRequestUnlock,
}: NoteCardProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const colorConfig =
    NOTE_COLORS.find((c) => c.id === note.colorId) || NOTE_COLORS[0];

  const bgColor = isDark ? colorConfig.bgDark : colorConfig.bgLight;
  const borderColor = isDark ? colorConfig.borderDark : colorConfig.borderLight;

  const handleCardPress = () => {
    if (note.isLocked && onRequestUnlock) {
      onRequestUnlock(note, 'edit');
    } else {
      onEdit(note);
    }
  };

  const handleDelete = () => {
    if (note.isLocked && onRequestUnlock) {
      onRequestUnlock(note, 'delete');
      return;
    }

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
      onPress={handleCardPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
        },
        pressed && styles.pressed,
      ]}>
      {/* Header card: Danh mục & Huy hiệu Khóa & Ghim */}
      <View style={styles.cardHeader}>
        <View style={styles.headerBadges}>
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

          {note.isLocked && (
            <View
              style={[
                styles.lockBadge,
                { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.25)' : '#DBEAFE' },
              ]}>
              <Ionicons name="lock-closed" size={11} color="#3B82F6" />
              <ThemedText style={styles.lockBadgeText}>ĐÃ KHÓA</ThemedText>
            </View>
          )}
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

      {/* Trích dẫn nội dung hoặc thông báo đã khóa */}
      {note.isLocked ? (
        <View
          style={[
            styles.lockedBox,
            {
              backgroundColor: isDark ? '#1F2937' : '#F1F5F9',
              borderColor: isDark ? '#374151' : '#E2E8F0',
            },
          ]}>
          <Ionicons name="lock-closed" size={16} color="#3B82F6" />
          <ThemedText
            style={[
              styles.lockedText,
              { color: isDark ? '#93C5FD' : '#2563EB' },
            ]}>
            Nội dung đã được khóa. Bấm để mở.
          </ThemedText>
        </View>
      ) : (
        <ThemedText
          numberOfLines={4}
          style={[
            styles.content,
            { color: isDark ? '#CBD5E1' : '#475569' },
          ]}>
          {note.content || '(Chưa có nội dung)'}
        </ThemedText>
      )}

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
              handleCardPress();
            }}
            hitSlop={8}
            style={styles.actionBtn}>
            <Ionicons
              name={note.isLocked ? 'key-outline' : 'pencil-outline'}
              size={17}
              color={note.isLocked ? '#3B82F6' : colors.textSecondary}
            />
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
  headerBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  lockBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3B82F6',
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
  lockedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  lockedText: {
    fontSize: 13,
    fontWeight: '600',
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
