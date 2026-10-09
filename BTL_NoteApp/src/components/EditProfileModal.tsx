import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { User, AuthSession } from '@/types/note';
import { AuthService } from '@/services/authService';

interface EditProfileModalProps {
  visible: boolean;
  currentUser: User | null;
  onClose: () => void;
  onProfileUpdated: (session: AuthSession) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  currentUser,
  onClose,
  onProfileUpdated,
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (visible && currentUser) {
      setName(currentUser.name || '');
      setAvatar(currentUser.avatar || '');
      setErrorMsg(null);
    }
  }, [visible, currentUser]);

  const handleSave = async () => {
    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập họ tên của bạn.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const updatedSession = await AuthService.updateProfile(name, avatar);
      setLoading(false);
      onProfileUpdated(updatedSession);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Lỗi khi cập nhật thông tin.');
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Chỉnh Sửa Thông Tin</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Avatar preview */}
            <View style={styles.avatarSection}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarInitialsBg}>
                  <Text style={styles.avatarInitialsText}>
                    {name ? name.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>
              )}
            </View>

            {/* Avatar presets */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Chọn ảnh đại diện mẫu:</Text>
            <View style={styles.presetRow}>
              {PRESET_AVATARS.map((url, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.presetAvatarBtn, avatar === url && styles.selectedPreset]}
                  onPress={() => setAvatar(url)}>
                  <Image source={{ uri: url }} style={styles.presetImage} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Avatar URL input */}
            <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>Hoặc dán Link Ảnh URL:</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}
              placeholder="https://example.com/avatar.png"
              placeholderTextColor={colors.textSecondary}
              value={avatar}
              onChangeText={setAvatar}
            />

            {/* Name Input */}
            <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>Họ và tên:</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}
              placeholder="Nhập họ và tên..."
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
            />

            {/* Email (Readonly) */}
            <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>Email (Cố định):</Text>
            <View style={[styles.input, styles.readonlyInput, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
              <Text style={{ color: colors.textSecondary }}>{currentUser?.email}</Text>
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  <Text style={styles.saveBtnText}>Lưu Thay Đổi</Text>
                </>
              )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '85%',
    borderRadius: 24,
    padding: 20,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
  } as any,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    marginVertical: 14,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#2563EB',
  },
  avatarInitialsBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitialsText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 8,
  },
  presetAvatarBtn: {
    borderRadius: 24,
    padding: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPreset: {
    borderColor: '#2563EB',
  },
  presetImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    paddingHorizontal: 14,
    fontSize: 14,
    justifyContent: 'center',
  },
  readonlyInput: {
    borderWidth: 0,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    gap: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
