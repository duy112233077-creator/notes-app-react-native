import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

/**
 * BÀI TẬP 1 – MỨC DỄ:
 * Màn hình nhập họ tên người dùng sử dụng Controlled Component
 * - Functional Component
 * - useState quản lý giá trị họ tên
 * - TextInput nhận value={fullName} và sự kiện onChangeText={setFullName}
 * - Dòng Text phản hồi hiển thị: "Bạn đã nhập: ..."
 */
const BaiTap1_ControlledInput = () => {
  // Khởi tạo state fullName quản lý dữ liệu ô nhập liệu
  const [fullName, setFullName] = useState('');

  // Hàm xóa nội dung ô nhập liệu (thay đổi trực tiếp từ state)
  const handleClear = () => {
    setFullName('');
  };

  // Hàm gán nhanh họ tên mẫu để minh chứng State kiểm soát giá trị Input
  const handleQuickFill = (sampleName) => {
    setFullName(sampleName);
  };

  return (
    <View style={styles.card}>
      {/* Header của bài tập */}
      <View style={styles.headerRow}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagBadgeText}>BÀI TẬP 1 • CONTROLLED COMPONENT</Text>
        </View>
      </View>

      <Text style={styles.title}>Nhập Họ Tên Người Dùng</Text>
      <Text style={styles.description}>
        Dữ liệu trong ô <Text style={styles.codeText}>TextInput</Text> được liên kết 2 chiều với <Text style={styles.codeText}>state fullName</Text>. Mọi thay đổi ký tự đều thông qua sự kiện <Text style={styles.codeText}>onChangeText</Text> để cập nhật state.
      </Text>

      {/* Vùng nhập liệu */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Họ và tên của bạn:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập họ và tên (ví dụ: Bùi Quang Duy)..."
          placeholderTextColor="#9CA3AF"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
          autoCapitalize="words"
          autoCorrect={false}
        />
        {fullName.length > 0 && (
          <TouchableOpacity style={styles.clearIconBtn} onPress={handleClear}>
            <Text style={styles.clearIconText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Hiển thị số ký tự */}
      <View style={styles.charCounterRow}>
        <Text style={styles.charCounterText}>
          Độ dài: <Text style={styles.boldText}>{fullName.length}</Text> ký tự
        </Text>
        {fullName.trim().length > 0 && (
          <Text style={styles.wordCounterText}>
            Số từ: <Text style={styles.boldText}>{fullName.trim().split(/\s+/).length}</Text>
          </Text>
        )}
      </View>

      {/* Dòng Text hiển thị kết quả theo đúng yêu cầu đề bài */}
      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>Kết quả phản hồi thời gian thực:</Text>
        <Text style={styles.resultContent}>
          Bạn đã nhập: <Text style={styles.resultHighlight}>{fullName ? fullName : '(Chưa có dữ liệu)'}</Text>
        </Text>
      </View>

      {/* Nút hành động thử nghiệm */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, !fullName && styles.btnDisabled]}
          onPress={handleClear}
          disabled={!fullName}
        >
          <Text style={[styles.actionBtnText, !fullName && styles.btnTextDisabled]}>
            🗑️ Xóa ô nhập
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickFillBtn}
          onPress={() => handleQuickFill('Bùi Quang Duy')}
        >
          <Text style={styles.quickFillBtnText}>⚡ Điền: Bùi Quang Duy</Text>
        </TouchableOpacity>
      </View>

      {/* Hộp giải thích cơ chế State quản lý */}
      <View style={styles.explanationBox}>
        <Text style={styles.explanationTitle}>💡 Vì sao gọi là dữ liệu do state quản lý?</Text>
        <Text style={styles.explanationText}>
          Trong React Native, khi sử dụng <Text style={styles.boldText}>value={'{fullName}'}</Text>, ô <Text style={styles.boldText}>TextInput</Text> không tự lưu trữ giá trị độc lập. Mỗi khi người dùng gõ phím, hàm <Text style={styles.boldText}>setFullName</Text> trong <Text style={styles.boldText}>onChangeText</Text> sẽ cập nhật state. React sau đó re-render và gán lại giá trị từ state vào ô input. Do đó, state đóng vai trò là <Text style={styles.boldText}>Single Source of Truth</Text> (nguồn dữ liệu duy nhất).
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginVertical: 10,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tagBadgeText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#2563EB',
    backgroundColor: '#F1F5F9',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 8,
    position: 'relative',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    paddingRight: 40,
  },
  clearIconBtn: {
    position: 'absolute',
    right: 12,
    top: 36,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIconText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: 'bold',
  },
  charCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  charCounterText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  wordCounterText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  boldText: {
    fontWeight: '700',
    color: '#334155',
  },
  resultBox: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  resultContent: {
    fontSize: 16,
    color: '#166534',
    fontWeight: '500',
  },
  resultHighlight: {
    fontWeight: '700',
    color: '#15803D',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  btnTextDisabled: {
    color: '#94A3B8',
  },
  quickFillBtn: {
    flex: 1.2,
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  quickFillBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  explanationBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  explanationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
});

export default BaiTap1_ControlledInput;
