import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { MediaAttachment } from '@/types/note';

interface EditorAttachmentStripProps {
  attachments: MediaAttachment[];
  onOpenViewer: (attachment: MediaAttachment) => void;
  onRemoveAttachment: (id: string) => void;
}

export const EditorAttachmentStrip: React.FC<EditorAttachmentStripProps> = ({
  attachments,
  onOpenViewer,
  onRemoveAttachment,
}) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <View style={styles.attachStripWrap}>
      <ThemedText style={styles.label}>Tệp đính kèm</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.attachStrip}>
        {attachments.map((att) => (
          <TouchableOpacity
            key={att.id}
            style={styles.attachThumb}
            onPress={() => onOpenViewer(att)}>
            {att.type === 'image' ? (
              <Image source={{ uri: att.uri }} style={styles.thumbImg} resizeMode="cover" />
            ) : att.type === 'video' ? (
              <View style={[styles.thumbImg, styles.thumbVideo]}>
                <Ionicons name="videocam" size={22} color="#FFFFFF" />
              </View>
            ) : att.type === 'audio' ? (
              <View style={[styles.thumbImg, styles.thumbAudio]}>
                <Ionicons name="musical-notes" size={22} color="#FFFFFF" />
              </View>
            ) : (
              <View style={[styles.thumbImg, styles.thumbFile]}>
                <Ionicons name="document-text" size={22} color="#FFFFFF" />
              </View>
            )}
            <TouchableOpacity
              style={styles.thumbRemove}
              onPress={() => onRemoveAttachment(att.id)}>
              <Ionicons name="close-circle" size={16} color="#EF4444" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  attachStripWrap: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    opacity: 0.8,
  },
  attachStrip: {
    flexDirection: 'row',
  },
  attachThumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    marginRight: 8,
    position: 'relative',
  },
  thumbImg: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#94A3B8',
  },
  thumbVideo: {
    backgroundColor: '#1D4ED8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbAudio: {
    backgroundColor: '#0E7490',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbFile: {
    backgroundColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbRemove: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
});
