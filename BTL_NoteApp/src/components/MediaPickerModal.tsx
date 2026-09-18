import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { MediaAttachment } from '@/types/note';
import { AudioRecorder } from './AudioRecorder';

interface MediaPickerModalProps {
  visible: boolean;
  attachments: MediaAttachment[];
  onClose: () => void;
  onAddAttachment: (attachment: MediaAttachment) => void;
  onRemoveAttachment: (id: string) => void;
  onOpenVoiceToText?: () => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  visible,
  attachments,
  onClose,
  onAddAttachment,
  onRemoveAttachment,
  onOpenVoiceToText,
}) => {
  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Cần cấp quyền', 'Ứng dụng cần quyền truy cập thư viện.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newAttachment: MediaAttachment = {
          id: 'img-' + Date.now(),
          type: 'image',
          uri: asset.uri,
          name: asset.fileName || `Hình ảnh ${attachments.length + 1}.jpg`,
          size: asset.fileSize,
        };
        onAddAttachment(newAttachment);
      }
    } catch (err) {
      console.error('Lỗi chọn ảnh:', err);
    }
  };

  // Chọn video từ thư viện
  const pickVideo = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Cần cấp quyền', 'Ứng dụng cần quyền truy cập thư viện.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newAttachment: MediaAttachment = {
          id: 'vid-' + Date.now(),
          type: 'video',
          uri: asset.uri,
          name: asset.fileName || `Video_${attachments.length + 1}.mp4`,
          size: asset.fileSize,
          duration: asset.duration ? Math.round(asset.duration) : undefined,
        };
        onAddAttachment(newAttachment);
      }
    } catch (err) {
      console.error('Lỗi chọn video:', err);
    }
  };

  // Đính kèm tệp PDF hoặc tài liệu
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        const newAttachment: MediaAttachment = {
          id: 'pdf-' + Date.now(),
          type: file.mimeType?.includes('pdf') ? 'pdf' : 'file',
          uri: file.uri,
          name: file.name,
          size: file.size,
        };
        onAddAttachment(newAttachment);
      }
    } catch (err) {
      console.error('Lỗi chọn tài liệu:', err);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>🖼️ Đính kèm Đa phương tiện</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Action Pickers */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
              <Ionicons name="image-outline" size={20} color="#2563EB" />
              <Text style={styles.actionText}>Chèn Ảnh</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={pickVideo}>
              <Ionicons name="videocam-outline" size={20} color="#059669" />
              <Text style={styles.actionText}>Đính Video</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={pickDocument}>
              <Ionicons name="document-text-outline" size={20} color="#7C3AED" />
              <Text style={styles.actionText}>Tệp PDF</Text>
            </TouchableOpacity>
          </View>

          {/* Speech to text shortcut button */}
          {onOpenVoiceToText && (
            <TouchableOpacity
              style={styles.voiceTextBtn}
              onPress={() => {
                onClose();
                onOpenVoiceToText();
              }}>
              <Ionicons name="mic-outline" size={18} color="#2563EB" />
              <Text style={styles.voiceBtnText}>🎤 Ghi âm giọng nói thành Văn Bản (Voice-to-Text)</Text>
            </TouchableOpacity>
          )}

          {/* Ghi âm trực tiếp âm thanh */}
          <View style={styles.recorderBox}>
            <Text style={styles.recorderLabel}>🎙️ Ghi âm tệp Âm Thanh (Audio file):</Text>
            <AudioRecorder onRecordingComplete={onAddAttachment} />
          </View>

          {/* Current List of Attachments */}
          <Text style={styles.sectionTitle}>Tệp đã đính kèm ({attachments.length}):</Text>
          <View style={styles.list}>
            {attachments.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có tệp đính kèm nào.</Text>
            ) : (
              attachments.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Ionicons
                    name={
                      item.type === 'image'
                        ? 'image'
                        : item.type === 'video'
                        ? 'videocam'
                        : item.type === 'audio'
                        ? 'mic'
                        : 'document'
                    }
                    size={20}
                    color={
                      item.type === 'image'
                        ? '#2563EB'
                        : item.type === 'video'
                        ? '#059669'
                        : item.type === 'audio'
                        ? '#DC2626'
                        : '#7C3AED'
                    }
                  />
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <TouchableOpacity onPress={() => onRemoveAttachment(item.id)}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneText}>Hoàn tất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  recorderBox: {
    marginBottom: 16,
  },
  recorderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  voiceTextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  voiceBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  list: {
    gap: 8,
    maxHeight: 180,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
  },
  doneBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  doneText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
