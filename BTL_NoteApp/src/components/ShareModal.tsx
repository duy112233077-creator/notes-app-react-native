import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '@/types/note';
import { API_BASE_URL } from '@/constants/config';
import { AuthService } from '@/services/authService';
import { ExportService } from '@/services/exportService';

interface ShareModalProps {
  visible: boolean;
  note: Note | null;
  onClose: () => void;
  onUpdateNoteShare: (shareCode: string, collaborators: string[]) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  note,
  onClose,
  onUpdateNoteShare,
}) => {
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [collaboratorList, setCollaboratorList] = useState<string[]>(
    note?.collaborators || []
  );

  if (!note) return null;

  const shareCode = note.shareCode || `NOTE-${note.id.slice(0, 8).toUpperCase()}`;

  // 1. Chia sẻ dạng Hình ảnh
  const handleShareAsImage = async () => {
    try {
      await ExportService.shareAsImage(note);
    } catch (err: any) {
      Alert.alert('Lỗi chia sẻ', err.message || 'Không thể chia sẻ bằng hình ảnh.');
    }
  };

  // 2. Chia sẻ dạng Văn bản
  const handleShareAsText = async () => {
    try {
      await ExportService.shareAsText(note);
    } catch (err: any) {
      Alert.alert('Lỗi chia sẻ', err.message || 'Không thể chia sẻ dạng văn bản.');
    }
  };

  // 3. Chia sẻ dạng File PDF
  const handleShareAsPDF = async () => {
    try {
      await ExportService.exportToPDF(note);
    } catch (err: any) {
      Alert.alert('Lỗi chia sẻ', err.message || 'Không thể chia sẻ dạng PDF.');
    }
  };

  // Thêm người cộng tác
  const addCollaborator = async () => {
    if (!collaboratorEmail.trim() || !collaboratorEmail.includes('@')) {
      Alert.alert('Email không hợp lệ', 'Vui lòng nhập email chính xác.');
      return;
    }
    const clean = collaboratorEmail.trim().toLowerCase();
    if (collaboratorList.includes(clean)) {
      Alert.alert('Thông báo', 'Email này đã có trong danh sách cộng tác.');
      return;
    }

    const updated = [...collaboratorList, clean];
    setCollaboratorList(updated);
    setCollaboratorEmail('');

    try {
      const headers = await AuthService.getAuthHeaders();
      await fetch(`${API_BASE_URL}/notes/${note.id}/share`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ collaboratorEmails: updated }),
      });
      onUpdateNoteShare(shareCode, updated);
    } catch (err) {
      console.error('Lỗi cập nhật danh sách cộng tác:', err);
    }
  };

  const removeCollaborator = async (email: string) => {
    const updated = collaboratorList.filter((e) => e !== email);
    setCollaboratorList(updated);
    try {
      const headers = await AuthService.getAuthHeaders();
      await fetch(`${API_BASE_URL}/notes/${note.id}/share`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ collaboratorEmails: updated }),
      });
      onUpdateNoteShare(shareCode, updated);
    } catch (err) {
      console.error('Lỗi gỡ cộng tác viên:', err);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>📤 Chia sẻ Ghi Chú</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.noteTitleHeader} numberOfLines={1}>
            "{note.title || 'Ghi chú không tên'}"
          </Text>

          {/* 3 Lựa chọn Chia sẻ */}
          <Text style={styles.sectionTitle}>Chọn hình thức chia sẻ ra ngoài:</Text>

          <View style={styles.shareOptionsGrid}>
            {/* 1. Chia sẻ bằng Hình ảnh */}
            <TouchableOpacity style={styles.optionCard} onPress={handleShareAsImage}>
              <View style={[styles.optionIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="image-outline" size={24} color="#2563EB" />
              </View>
              <Text style={styles.optionTitle}>Chia sẻ bằng hình ảnh</Text>
              <Text style={styles.optionDesc}>Xuất dạng thẻ ghi chú đẹp mắt</Text>
            </TouchableOpacity>

            {/* 2. Chia sẻ bằng Văn bản */}
            <TouchableOpacity style={styles.optionCard} onPress={handleShareAsText}>
              <View style={[styles.optionIconBox, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="document-text-outline" size={24} color="#16A34A" />
              </View>
              <Text style={styles.optionTitle}>Chia sẻ bằng văn bản</Text>
              <Text style={styles.optionDesc}>Gửi tin nhắn dạng chữ thuần</Text>
            </TouchableOpacity>

            {/* 3. Chia sẻ bằng File PDF */}
            <TouchableOpacity style={styles.optionCard} onPress={handleShareAsPDF}>
              <View style={[styles.optionIconBox, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="document-outline" size={24} color="#DC2626" />
              </View>
              <Text style={styles.optionTitle}>Chia sẻ bằng tệp PDF</Text>
              <Text style={styles.optionDesc}>Đóng gói tệp tài liệu PDF</Text>
            </TouchableOpacity>
          </View>

          {/* Multi-user Collaborators Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mời tài khoản cùng chỉnh sửa (Email):</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Nhập email người muốn chia sẻ..."
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={collaboratorEmail}
                onChangeText={setCollaboratorEmail}
              />
              <TouchableOpacity style={styles.addBtn} onPress={addCollaborator}>
                <Ionicons name="person-add" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* List Collaborators */}
            <View style={styles.collaboratorList}>
              {collaboratorList.map((email) => (
                <View key={email} style={styles.collabTag}>
                  <Ionicons name="person" size={14} color="#2563EB" />
                  <Text style={styles.collabEmail}>{email}</Text>
                  <TouchableOpacity onPress={() => removeCollaborator(email)}>
                    <Ionicons name="close-circle" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
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
    borderRadius: 24,
    padding: 24,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  noteTitleHeader: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  shareOptionsGrid: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  optionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  optionDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  section: {
    gap: 8,
    marginTop: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  addBtn: {
    backgroundColor: '#16A34A',
    width: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collaboratorList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  collabTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  collabEmail: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
});
