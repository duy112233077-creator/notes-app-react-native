import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MediaAttachment } from '@/types/note';

interface AttachmentViewerModalProps {
  visible: boolean;
  attachment: MediaAttachment | null;
  onClose: () => void;
}

export const AttachmentViewerModal: React.FC<AttachmentViewerModalProps> = ({
  visible,
  attachment,
  onClose,
}) => {
  if (!attachment) return null;

  const isImage = attachment.type === 'image';
  const isVideo = attachment.type === 'video';
  const isAudio = attachment.type === 'audio';

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleGroup}>
              <Ionicons
                name={
                  isImage
                    ? 'image'
                    : isVideo
                    ? 'videocam'
                    : isAudio
                    ? 'musical-notes'
                    : 'document'
                }
                size={20}
                color="#2563EB"
              />
              <Text style={styles.fileName} numberOfLines={1}>
                {attachment.name}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Main Display Area */}
          <View style={styles.displayArea}>
            {isImage ? (
              <Image source={{ uri: attachment.uri }} style={styles.fullImage} resizeMode="contain" />
            ) : isVideo ? (
              Platform.OS === 'web' ? (
                <video
                  src={attachment.uri}
                  controls
                  autoPlay
                  style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '12px' }}
                />
              ) : (
                <View style={styles.mediaPlaceholder}>
                  <Ionicons name="videocam" size={48} color="#3B82F6" />
                  <Text style={styles.mediaText}>Phát video đính kèm: {attachment.name}</Text>
                  <Text style={styles.mediaSubText}>Tệp Video: {attachment.uri}</Text>
                </View>
              )
            ) : isAudio ? (
              <View style={styles.audioBox}>
                <Ionicons name="mic-circle" size={64} color="#EF4444" />
                <Text style={styles.audioTitle}>{attachment.name}</Text>
                <Text style={styles.audioSub}>
                  Thời lượng: {attachment.duration ? `${attachment.duration}s` : 'Ghi âm'}
                </Text>
                {Platform.OS === 'web' && (
                  <audio controls src={attachment.uri} style={{ marginTop: 12, width: '100%' }} />
                )}
              </View>
            ) : (
              <View style={styles.fileBox}>
                <Ionicons name="document-text" size={64} color="#7C3AED" />
                <Text style={styles.fileTitle}>{attachment.name}</Text>
                <Text style={styles.fileSub}>Định dạng tài liệu / tệp tin</Text>
              </View>
            )}
          </View>

          {/* Footer details */}
          <View style={styles.footer}>
            <Text style={styles.infoText}>Phân loại: {attachment.type.toUpperCase()}</Text>
            {attachment.size && (
              <Text style={styles.infoText}>
                Dung lượng: {(attachment.size / 1024).toFixed(1)} KB
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 720,
    maxHeight: '90%',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  fileName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  displayArea: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    maxHeight: 500,
    backgroundColor: '#000000',
    borderRadius: 14,
    overflow: 'hidden',
    padding: 8,
  },
  fullImage: {
    width: '100%',
    height: 400,
  },
  mediaPlaceholder: {
    alignItems: 'center',
    gap: 10,
    padding: 24,
  },
  mediaText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  mediaSubText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  audioBox: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  audioTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  audioSub: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },
  fileBox: {
    alignItems: 'center',
    padding: 24,
  },
  fileTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  fileSub: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  infoText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
});
