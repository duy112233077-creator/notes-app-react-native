import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VoiceToTextModalProps {
  visible: boolean;
  onClose: () => void;
  onInsertText?: (text: string) => void;
  onTextReady?: (text: string) => void;
}

export const VoiceToTextModal: React.FC<VoiceToTextModalProps> = ({
  visible,
  onClose,
  onInsertText,
  onTextReady,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState('Bấm nút Micro để bắt đầu nói');

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = true;
        reco.interimResults = true;
        reco.lang = 'vi-VN';

        reco.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = 0; i < event.results.length; i++) {
            const res = event.results[i];
            if (res.isFinal) {
              finalTranscript += res[0].transcript + ' ';
            } else {
              interimTranscript += res[0].transcript;
            }
          }

          const combined = (finalTranscript + interimTranscript).replace(/\s+/g, ' ').trim();
          if (combined) {
            setTranscript(combined);
          }
        };

        reco.onerror = (err: any) => {
          console.warn('Speech error:', err);
          setStatusMessage('Không nhận diện được giọng nói. Nhập văn bản hoặc thử lại.');
          setIsListening(false);
        };

        reco.onend = () => {
          setIsListening(false);
        };

        setRecognition(reco);
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      if (recognition) recognition.stop();
      setIsListening(false);
      setStatusMessage('Đã dừng thu âm giọng nói');
    } else {
      if (recognition) {
        try {
          recognition.start();
          setIsListening(true);
          setStatusMessage('🎙️ Đang nghe giọng nói của bạn... Hãy nói điều gì đó!');
        } catch (e) {
          setIsListening(true);
          setStatusMessage('Đang thu âm...');
        }
      } else {
        setIsListening(true);
        setStatusMessage('🎙️ Đang thu âm giọng nói... (Bạn có thể sửa trực tiếp khung bên dưới)');
      }
    }
  };

  const handleInsert = () => {
    if (transcript.trim()) {
      const callback = onTextReady || onInsertText;
      if (callback) callback(transcript.trim());
      setTranscript('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.micBadge}>
                <Ionicons name="mic-outline" size={20} color="#2563EB" />
              </View>
              <Text style={styles.title}>Ghi âm ra Văn Bản (Voice-to-Text)</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.statusText}>{statusMessage}</Text>

          <View style={styles.micContainer}>
            <TouchableOpacity
              style={[styles.bigMicBtn, isListening && styles.bigMicBtnActive]}
              onPress={toggleListening}>
              <Ionicons
                name={isListening ? 'stop-circle' : 'mic'}
                size={40}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <Text style={styles.micHint}>
              {isListening ? 'Bấm để dừng' : 'Bấm vào micro để phát biểu'}
            </Text>
          </View>

          <Text style={styles.label}>Văn bản được chuyển đổi:</Text>
          <TextInput
            style={styles.transcriptInput}
            value={transcript}
            onChangeText={setTranscript}
            placeholder="Nội dung giọng nói của bạn sẽ xuất hiện ở đây..."
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearBtn} onPress={() => setTranscript('')}>
              <Text style={styles.clearText}>Xóa nội dung</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.insertBtn, !transcript.trim() && styles.insertBtnDisabled]}
              disabled={!transcript.trim()}
              onPress={handleInsert}>
              <Ionicons name="add-circle" size={18} color="#FFFFFF" />
              <Text style={styles.insertText}>Chèn vào Ghi chú</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  micBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 14,
  },
  micContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  bigMicBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  bigMicBtnActive: {
    backgroundColor: '#EF4444',
  },
  micHint: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 10,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  transcriptInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 110,
    color: '#1E293B',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  clearBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  insertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  insertBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  insertText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
