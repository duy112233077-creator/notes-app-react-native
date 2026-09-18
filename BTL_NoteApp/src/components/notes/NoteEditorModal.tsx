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
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PinModal } from '@/components/notes/PinModal';
import { MediaPickerModal } from '@/components/MediaPickerModal';
import { VoiceToTextModal } from '@/components/VoiceToTextModal';
import { AttachmentViewerModal } from '@/components/AttachmentViewerModal';
import { ReminderPickerModal } from '@/components/ReminderPickerModal';
import { EditorCategoryPicker } from '@/components/notes/editor/EditorCategoryPicker';
import { EditorColorPicker } from '@/components/notes/editor/EditorColorPicker';
import { EditorAttachmentStrip } from '@/components/notes/editor/EditorAttachmentStrip';
import { Colors, Spacing } from '@/constants/theme';
import { Note, NoteCategory, MediaAttachment, DEFAULT_CATEGORIES } from '@/types/note';
import { NoteStorage } from '@/services/storage';
import { AIService } from '@/services/aiService';
import { ExportService } from '@/services/exportService';
import { NotificationService } from '@/services/notificationService';

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
    attachments?: MediaAttachment[];
    reminderAt?: string;
    tags?: string[];
  }) => void;
}

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
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);
  const [reminderAt, setReminderAt] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [voiceToTextVisible, setVoiceToTextVisible] = useState(false);
  const [reminderPickerVisible, setReminderPickerVisible] = useState(false);
  const [viewerAttachment, setViewerAttachment] = useState<MediaAttachment | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [allCategories, setAllCategories] = useState<NoteCategory[]>(DEFAULT_CATEGORIES);

  // Load custom categories
  useEffect(() => {
    NoteStorage.getCustomCategories().then((customs) => {
      const merged = [...DEFAULT_CATEGORIES];
      customs.forEach((c) => { if (!merged.includes(c)) merged.push(c); });
      setAllCategories(merged);
    });
  }, [visible]);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setCategory(noteToEdit.category || 'Công việc');
      setColorId(noteToEdit.colorId || 'default');
      setIsPinned(noteToEdit.isPinned ?? false);
      setIsLocked(noteToEdit.isLocked ?? false);
      setAttachments(noteToEdit.attachments || []);
      setReminderAt(noteToEdit.reminderAt);
      setTags(noteToEdit.tags || []);
    } else {
      setTitle('');
      setContent('');
      setCategory('Công việc');
      setColorId('default');
      setIsPinned(false);
      setIsLocked(false);
      setAttachments([]);
      setReminderAt(undefined);
      setTags([]);
    }
    setErrorMsg('');
    setSummaryText(null);
  }, [noteToEdit, visible]);

  const handleToggleLock = async () => {
    if (!isLocked) {
      const hasPinAlready = await NoteStorage.hasUserPin();
      if (hasPinAlready) {
        setIsLocked(true);
      } else {
        setPinModalVisible(true);
      }
    } else {
      setPinModalVisible(true);
    }
  };

  const handleConfirmReminder = async (isoString: string) => {
    setReminderAt(isoString);
    const dateObj = new Date(isoString);
    if (Platform.OS !== 'web') {
      await NotificationService.scheduleNoteReminder(
        noteToEdit?.id || 'temp',
        title || 'Ghi chú',
        content || 'Nhắc nhở ghi chú',
        dateObj
      );
    }
  };

  const handleAISummarize = async () => {
    if (!content.trim()) {
      setErrorMsg('Vui lòng nhập nội dung ghi chú trước khi tóm tắt.');
      return;
    }
    setAiLoading(true);
    try {
      const summary = await AIService.summarizeNote(title, content);
      setSummaryText(summary);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tóm tắt AI.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIAutoTag = async () => {
    setAiLoading(true);
    try {
      const generatedTags = await AIService.generateAutoTags(title, content);
      setTags(generatedTags);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tạo tag AI.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'md' | 'txt') => {
    const currentNote: Note = {
      id: noteToEdit?.id || 'temp',
      title: title || 'Ghi chú',
      content,
      category,
      colorId,
      attachments,
      tags,
      createdAt: noteToEdit?.createdAt || new Date().toISOString(),
    };
    try {
      if (format === 'pdf') {
        await ExportService.exportToPDF(currentNote);
      } else {
        await ExportService.exportToFile(currentNote, format);
      }
    } catch (err: any) {
      Alert.alert('Lỗi xuất tệp', err.message || 'Không thể xuất tệp.');
    }
  };

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
      attachments,
      reminderAt,
      tags,
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
        style={[styles.backdrop, isFullscreen && styles.backdropFullscreen]}>
        {!isFullscreen && <Pressable style={styles.backdropPressable} onPress={onClose} />}

        <ThemedView
          style={[
            styles.modalBox,
            isDesktop ? styles.modalDesktop : styles.modalMobile,
            isFullscreen && styles.modalBoxFullscreen,
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
              <Pressable
                onPress={() => setIsFullscreen((f) => !f)}
                style={styles.iconToggleBtn}
                hitSlop={8}>
                <Ionicons
                  name={isFullscreen ? 'contract-outline' : 'expand-outline'}
                  size={19}
                  color={colors.textSecondary}
                />
              </Pressable>

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

              <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {!!errorMsg && <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>}

            {/* Toolbar */}
            <View style={styles.toolbar}>
              <TouchableOpacity style={styles.toolBtn} onPress={() => setMediaModalVisible(true)}>
                <Ionicons name="attach-outline" size={18} color="#2563EB" />
                <ThemedText style={styles.toolText}>
                  {attachments.length > 0 ? `Đính kèm (${attachments.length})` : 'Đính kèm tệp'}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.toolBtn} onPress={() => setVoiceToTextVisible(true)}>
                <Ionicons name="mic-outline" size={18} color="#0891B2" />
                <ThemedText style={styles.toolText}>Giọng nói → Chữ</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.toolBtn} onPress={() => setReminderPickerVisible(true)}>
                <Ionicons name="alarm-outline" size={18} color="#D97706" />
                <ThemedText style={styles.toolText}>
                  {reminderAt
                    ? new Date(reminderAt).toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit' })
                    : 'Nhắc nhở'}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.toolBtn} onPress={handleAISummarize}>
                <Ionicons name="sparkles-outline" size={18} color="#7C3AED" />
                <ThemedText style={styles.toolText}>Tóm tắt AI</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.toolBtn} onPress={handleAIAutoTag}>
                <Ionicons name="pricetag-outline" size={18} color="#059669" />
                <ThemedText style={styles.toolText}>Tạo Tag AI</ThemedText>
              </TouchableOpacity>
            </View>

            {aiLoading && (
              <View style={styles.aiLoadingBox}>
                <ActivityIndicator color="#7C3AED" />
                <ThemedText style={styles.aiLoadingText}>AI đang xử lý nội dung ghi chú...</ThemedText>
              </View>
            )}

            {summaryText && (
              <View style={styles.summaryBox}>
                <View style={styles.summaryHeader}>
                  <Ionicons name="sparkles" size={16} color="#7C3AED" />
                  <ThemedText style={styles.summaryTitle}>Kết quả Tóm tắt AI</ThemedText>
                  <TouchableOpacity onPress={() => setSummaryText(null)}>
                    <Ionicons name="close-circle" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
                <ThemedText style={styles.summaryContent}>{summaryText}</ThemedText>
              </View>
            )}

            {/* Input Tiêu đề */}
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

            {/* Sub-components */}
            <EditorAttachmentStrip
              attachments={attachments}
              onOpenViewer={setViewerAttachment}
              onRemoveAttachment={(id) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
            />

            <EditorCategoryPicker
              categories={allCategories}
              selectedCategory={category}
              onSelectCategory={setCategory}
            />

            <EditorColorPicker
              selectedColorId={colorId}
              onSelectColor={setColorId}
            />

            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                <ThemedText style={styles.label}>Thẻ Tag AI:</ThemedText>
                <View style={styles.tagsList}>
                  {tags.map((t, idx) => (
                    <View key={idx} style={styles.tagChip}>
                      <ThemedText style={styles.tagText}>{t}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Input Nội dung */}
            <ThemedText style={styles.label}>Nội dung ghi chú</ThemedText>
            <TextInput
              style={[
                styles.contentInput,
                isFullscreen && styles.contentInputFullscreen,
                {
                  color: colors.text,
                  backgroundColor: isDark ? '#14171E' : '#F8FAFC',
                  borderColor: isDark ? '#2B3245' : '#E2E8F0',
                },
              ]}
              placeholder="Viết nội dung ghi chú tại đây..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={isFullscreen ? 20 : 6}
              textAlignVertical="top"
              value={content}
              onChangeText={(t) => {
                setContent(t);
                if (errorMsg) setErrorMsg('');
              }}
            />

            {/* Export Toolbar */}
            <View style={styles.exportRow}>
              <ThemedText style={styles.exportLabel}>📤 Xuất ghi chú:</ThemedText>
              <TouchableOpacity style={styles.exportBtn} onPress={() => handleExport('pdf')}>
                <Ionicons name="document" size={14} color="#EF4444" />
                <ThemedText style={styles.exportText}>PDF</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.exportBtn} onPress={() => handleExport('md')}>
                <Ionicons name="code-slash" size={14} color="#2563EB" />
                <ThemedText style={styles.exportText}>Markdown</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.exportBtn} onPress={() => handleExport('txt')}>
                <Ionicons name="text" size={14} color="#475569" />
                <ThemedText style={styles.exportText}>TXT</ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.modalFooter, { borderTopColor: isDark ? '#2E3440' : '#E2E8F0' }]}>
            <Pressable
              onPress={onClose}
              style={[styles.cancelBtn, { backgroundColor: isDark ? '#272B35' : '#F1F5F9' }]}>
              <ThemedText style={[styles.cancelBtnText, { color: isDark ? '#E2E8F0' : '#475569' }]}>
                Hủy bỏ
              </ThemedText>
            </Pressable>

            <Pressable onPress={handleSave} style={[styles.saveBtn, { backgroundColor: '#2563EB' }]}>
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

      {/* Modals */}
      <PinModal
        visible={pinModalVisible}
        noteTitle={title || noteToEdit?.title}
        actionLabel={isLocked ? 'tắt khóa ghi chú' : 'kích hoạt khóa bảo mật'}
        onSuccess={() => {
          setIsLocked(!isLocked);
          setPinModalVisible(false);
        }}
        onClose={() => setPinModalVisible(false)}
      />

      <MediaPickerModal
        visible={mediaModalVisible}
        attachments={attachments}
        onClose={() => setMediaModalVisible(false)}
        onAddAttachment={(item) => setAttachments((prev) => [...prev, item])}
        onRemoveAttachment={(id) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
      />

      <VoiceToTextModal
        visible={voiceToTextVisible}
        onClose={() => setVoiceToTextVisible(false)}
        onTextReady={(text) => {
          setContent((prev) => (prev ? prev + '\n' + text : text));
          setVoiceToTextVisible(false);
        }}
      />

      {viewerAttachment && (
        <AttachmentViewerModal
          visible={!!viewerAttachment}
          attachment={viewerAttachment}
          onClose={() => setViewerAttachment(null)}
        />
      )}

      <ReminderPickerModal
        visible={reminderPickerVisible}
        initialDate={reminderAt}
        onClose={() => setReminderPickerVisible(false)}
        onConfirm={handleConfirmReminder}
        onClear={() => {
          setReminderAt(undefined);
          setReminderPickerVisible(false);
        }}
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
  backdropFullscreen: {
    padding: 0,
  },
  modalBox: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalDesktop: {
    maxWidth: 680,
  },
  modalMobile: {
    maxWidth: '100%',
  },
  modalBoxFullscreen: {
    maxWidth: '100%',
    height: '100%',
    maxHeight: '100%',
    borderRadius: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconToggleBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: Spacing.three,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginBottom: 10,
    fontWeight: '600',
  },
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  toolText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  aiLoadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    backgroundColor: '#F3E8FF',
    padding: 10,
    borderRadius: 10,
  },
  aiLoadingText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  summaryBox: {
    backgroundColor: '#F3E8FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
    flex: 1,
    marginLeft: 6,
  },
  summaryContent: {
    fontSize: 13,
    color: '#4C1D95',
    lineHeight: 19,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    opacity: 0.8,
  },
  titleInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.three,
  },
  tagsContainer: {
    marginBottom: 12,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tagChip: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
  },
  contentInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 14.5,
    lineHeight: 22,
    minHeight: 120,
    marginBottom: 14,
  },
  contentInputFullscreen: {
    minHeight: 300,
    flex: 1,
  },
  exportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  exportLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  exportText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
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
