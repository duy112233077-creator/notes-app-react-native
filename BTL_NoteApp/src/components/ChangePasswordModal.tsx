import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { AuthService } from '@/services/authService';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }

    setLoading(true);
    try {
      await AuthService.changePassword(oldPassword, newPassword);
      setLoading(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onSuccess('Đã thay đổi mật khẩu thành công!');
      onClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Thay đổi mật khẩu không thành công.');
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.iconBg}>
                <Ionicons name="key-outline" size={18} color="#FFFFFF" />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>Thay Đổi Mật Khẩu</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {/* Old Password */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Mật khẩu hiện tại:</Text>
            <View style={[styles.inputRow, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                secureTextEntry={!showOld}
                placeholder="Nhập mật khẩu hiện tại..."
                placeholderTextColor={colors.textSecondary}
                value={oldPassword}
                onChangeText={setOldPassword}
              />
              <TouchableOpacity onPress={() => setShowOld(!showOld)} style={{ padding: 6 }}>
                <Ionicons name={showOld ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* New Password */}
            <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>Mật khẩu mới (Tối thiểu 6 ký tự):</Text>
            <View style={[styles.inputRow, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                secureTextEntry={!showNew}
                placeholder="Nhập mật khẩu mới..."
                placeholderTextColor={colors.textSecondary}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)} style={{ padding: 6 }}>
                <Ionicons name={showNew ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Confirm New Password */}
            <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>Xác nhận mật khẩu mới:</Text>
            <View style={[styles.inputRow, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                secureTextEntry={!showNew}
                placeholder="Nhập lại mật khẩu mới..."
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
                  <Text style={styles.saveBtnText}>Lưu Mật Khẩu</Text>
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
    maxWidth: 440,
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
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
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
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 14,
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
