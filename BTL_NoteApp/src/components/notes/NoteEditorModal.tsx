import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PinModal } from '@/components/notes/PinModal';
import { Colors, Spacing } from '@/constants/theme';
import { NOTE_COLORS, Note, NoteCategory } from '@/types/note';
import { NoteStorage } from '@/services/storage';

interface NoteEditorModalProps {
  visible: boolean;
  noteToEdit: Note | null;
  onClose: () => void;
  onSave: (noteData: {
    id?: string;
    title: string;
    content: string;
    category: NoteCategory;
    colorId: string;
    isPinned: boolean;
    isLocked: boolean;
  }) => void;
}

const CATEGORIES: NoteCategory[] = [
  'Công việc',
  'Học tập',
  'Cá nhân',
  'Ý tưởng',
  'Khác',
];

export function NoteEditorModal({
  visible,
  noteToEdit,
  onClose,
  onSave,
}: NoteEditorModalProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('Công việc');
  const [colorId, setColorId] = useState('default');
  const [isPinned, setIsPinned] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pinModalVisible, setPinModalVisible] = useState(false);

  const handleToggleLock = async () => {
    if (!isLocked) {
      // Đang bật khóa: kiểm tra đã có PIN chưa
      const hasPinAlready = await NoteStorage.hasUserPin();
      if (hasPinAlready) {
        // Đã có PIN -> bật khóa luôn
        setIsLocked(true);
      } else {
        // Chưa có PIN -> mở modal đặt PIN
        setPinModalVisible(true);
      }
    } else {
      // Đang tắt khóa: yêu cầu nhập PIN xác minh trước
      setPinModalVisible(true);
    }
  };

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setCategory(noteToEdit.category || 'Công việc');
      setColorId(noteToEdit.colorId || 'default');
      setIsPinned(noteToEdit.isPinned ?? false);
      setIsLocked(noteToEdit.isLocked ?? false);
    } else {
      setTitle('');
      setContent('');
      setCategory('Công việc');
      setColorId('default');
      setIsPinned(false);
      setIsLocked(false);
    }
    setErrorMsg('');
  }, [noteToEdit, visible]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề hoặc nội dung ghi chú.');
      return;
    }

    onSave({
      id: noteToEdit ? noteToEdit.id : undefined,
      title: title.trim(),
      content: content.trim(),
      category,
      colorId,
      isPinned,
      isLocked,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />

        <ThemedView
          style={[
            styles.modalBox,
            isDesktop ? styles.modalDesktop : styles.modalMobile,
            {
              backgroundColor: isDark ? '#1E222A' : '#FFFFFF',
              borderColor: isDark ? '#2E3440' : '#E2E8F0',
            },
          ]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <ThemedText type="smallBold" style={styles.modalTitle}>
              {noteToEdit ? 'Chỉnh sửa ghi chú' : 'Thêm ghi chú mới'}
            </ThemedText>

            <View style={styles.headerRightActions}>
              {/* Nút bật/tắt Khóa bảo mật */}
              <Pressable
                onPress={handleToggleLock}
                style={[
                  styles.iconToggleBtn,
                  isLocked && {
                    backgroundColor: isDark ? 'rgba(59, 130, 246, 0.25)' : '#DBEAFE',
                    borderColor: '#3B82F6',
                    borderWidth: 1,
                  },
                ]}
                hitSlop={8}>
                <Ionicons
                  name={isLocked ? 'lock-closed' : 'lock-open-outline'}
                  size={19}
                  color={isLocked ? '#3B82F6' : colors.textSecondary}
                />
              </Pressable>

              {/* Nút ghim */}
              <Pressable
                onPress={() => setIsPinned(!isPinned)}
                style={[
                  styles.iconToggleBtn,
                  isPinned && {
                    backgroundColor: isDark ? 'rgba(234, 179, 8, 0.25)' : '#FEF9C3',
                    borderColor: '#EAB308',
                    borderWidth: 1,
                  },
                ]}
                hitSlop={8}>
                <Ionicons
                  name={isPinned ? 'pin' : 'pin-outline'}
                  size={19}
                  color={isPinned ? '#EAB308' : colors.textSecondary}
                />
              </Pressable>

              {/* Nút đóng */}
              <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {/* Cảnh báo lỗi nếu có */}
            {!!errorMsg && (
              <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>
            )}

            {/* Banner hiển thị khi đang bật chế độ khóa */}
            {isLocked && (
              <View
                style={[
                  styles.lockBanner,
                  {
                    backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
                    borderColor: isDark ? '#2563EB' : '#BFDBFE',
                  },
                ]}>
                <Ionicons name="shield-checkmark" size={18} color="#3B82F6" />
                <ThemedText style={[styles.lockBannerText, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>
                  Ghi chú này đang được khóa bảo mật. Người xem cần nhập mã PIN (mặc định: 1234).
                </ThemedText>
              </View>
            )}

            {/* Ô nhập tiêu đề */}
            <ThemedText style={styles.label}>Tiêu đề ghi chú</ThemedText>
            <TextInput
              style={[
                styles.titleInput,
                {
                  color: colors.text,
                  backgroundColor: isDark ? '#14171E' : '#F8FAFC',
                  borderColor: isDark ? '#2B3245' : '#E2E8F0',
                },
              ]}
              placeholder="Nhập tiêu đề..."
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                if (errorMsg) setErrorMsg('');
              }}
            />

            {/* Chọn danh mục */}
            <ThemedText style={styles.label}>Danh mục</ThemedText>
            <View style={styles.categoryWrap}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
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
                          color: isSelected
                            ? '#FFFFFF'
                            : isDark
                              ? '#E2E8F0'
                              : '#475569',
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}>
                      {cat}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>

            {/* Chọn màu thẻ ghi chú */}
            <ThemedText style={styles.label}>Màu sắc thẻ</ThemedText>
            <View style={styles.colorsWrap}>
              {NOTE_COLORS.map((c) => {
                const isSelected = colorId === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setColorId(c.id)}
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

            {/* Ô nhập nội dung */}
            <ThemedText style={styles.label}>Nội dung</ThemedText>
            <TextInput
              style={[
                styles.contentInput,
                {
                  color: colors.text,
                  backgroundColor: isDark ? '#14171E' : '#F8FAFC',
                  borderColor: isDark ? '#2B3245' : '#E2E8F0',
                },
              ]}
              placeholder="Viết nội dung ghi chú tại đây..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={content}
              onChangeText={(t) => {
                setContent(t);
                if (errorMsg) setErrorMsg('');
              }}
            />
          </ScrollView>

          {/* Footer nút hành động */}
          <View
            style={[
              styles.modalFooter,
              { borderTopColor: isDark ? '#2E3440' : '#E2E8F0' },
            ]}>
            <Pressable
              onPress={onClose}
              style={[
                styles.cancelBtn,
                {
                  backgroundColor: isDark ? '#272B35' : '#F1F5F9',
                },
              ]}>
              <ThemedText
                style={[
                  styles.cancelBtnText,
                  { color: isDark ? '#E2E8F0' : '#475569' },
                ]}>
                Hủy bỏ
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleSave}
              style={[styles.saveBtn, { backgroundColor: '#2563EB' }]}>
              <Ionicons
                name={noteToEdit ? 'checkmark-circle-outline' : 'add-circle-outline'}
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <ThemedText style={styles.saveBtnText}>
                {noteToEdit ? 'Cập nhật ghi chú' : 'Thêm ghi chú'}
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>

      {/* PinModal: đặt PIN lần đầu hoặc xác minh để tắt khóa */}
      <PinModal
        visible={pinModalVisible}
        noteTitle={title || noteToEdit?.title}
        actionLabel={isLocked ? 'tắt khóa ghi chú' : 'kích hoạt khóa bảo mật'}
        onSuccess={(newPin) => {
          if (!isLocked) {
            // Vừa đặt PIN thành công -> bật khóa
            setIsLocked(true);
          } else {
            // Vừa xác minh PIN thành công -> tắt khóa
            setIsLocked(false);
          }
          setPinModalVisible(false);
        }}
        onClose={() => setPinModalVisible(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.three,
  },
  backdropPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalBox: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: '90%',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
      } as any,
      default: {
        elevation: 8,
      },
    }),
  },
  modalDesktop: {
    maxWidth: 560,
  },
  modalMobile: {
    maxWidth: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconToggleBtn: {
    padding: 6,
    borderRadius: 10,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: Spacing.four,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginBottom: Spacing.two,
    fontWeight: '600',
  },
  lockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  lockBannerText: {
    fontSize: 12.5,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.75,
  },
  titleInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.four,
    outlineStyle: 'none',
  } as any,
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.four,
  },
  categoryBtn: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 16,
  },
  categoryBtnText: {
    fontSize: 13,
  },
  colorsWrap: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.four,
    flexWrap: 'wrap',
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 140,
    outlineStyle: 'none',
  } as any,
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.two,
    borderTopWidth: 1,
  },
  cancelBtn: {
    paddingHorizontal: Spacing.four,
    paddingVertical: 10,
    borderRadius: 12,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
