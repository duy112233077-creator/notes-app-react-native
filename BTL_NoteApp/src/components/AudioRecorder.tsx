import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { MediaAttachment } from '@/types/note';

interface AudioRecorderProps {
  onRecordingComplete: (attachment: MediaAttachment) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => setDuration((prev) => prev + 1), 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('Cần cấp quyền micro để ghi âm.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Lỗi bắt đầu ghi âm:', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        const attachment: MediaAttachment = {
          id: 'audio-' + Date.now(),
          type: 'audio',
          uri,
          name: `Ghi âm ${new Date().toLocaleTimeString('vi-VN')}`,
          duration,
        };
        onRecordingComplete(attachment);
      }
      setRecording(null);
    } catch (err) {
      console.error('Lỗi dừng ghi âm:', err);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {isRecording ? (
        <View style={styles.recordingRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.recordingTime}>Đang thu âm: {formatTime(duration)}</Text>
          <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
            <Ionicons name="stop" size={20} color="#FFFFFF" />
            <Text style={styles.stopText}>Dừng</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
          <Ionicons name="mic-outline" size={20} color="#EF4444" />
          <Text style={styles.recordText}>Ghi âm trực tiếp</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  recordText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 14,
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  recordingTime: {
    flex: 1,
    color: '#991B1B',
    fontWeight: '700',
    fontSize: 14,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stopText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
