import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Bài tập 3 - Component CounterHook sử dụng useState
 * Quản lý giá trị đếm ban đầu là 0
 * Cập nhật state và re-render giao diện mỗi lần người dùng bấm nút
 */
const CounterHook = () => {
  // Khởi tạo state count với giá trị ban đầu là 0
  const [count, setCount] = useState(0);

  // Hàm xử lý tăng giá trị đếm
  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1);
  };

  // Hàm xử lý giảm giá trị đếm (nếu cần thử nghiệm thêm)
  const handleDecrement = () => {
    if (count > 0) {
      setCount(prevCount => prevCount - 1);
    }
  };

  // Hàm đặt lại giá trị về 0
  const handleReset = () => {
    setCount(0);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Bộ đếm tương tác (useState)</Text>
      <Text style={styles.description}>
        Mỗi khi bấm nút "Tăng", hàm setCount được kích hoạt, giá trị state thay đổi và React sẽ tự động re-render lại component.
      </Text>

      {/* Vùng hiển thị số lần bấm */}
      <View style={styles.counterDisplay}>
        <Text style={styles.displayLabel}>Số lần bấm hiện tại:</Text>
        <Text style={styles.counterValue}>{count}</Text>
        <Text style={styles.subStatus}>
          {count === 0
            ? 'Chưa bấm lần nào'
            : `Bạn đã tương tác ${count} lần với ứng dụng`}
        </Text>
      </View>

      {/* Nhóm các nút bấm tương tác */}
      <View style={styles.buttonGroup}>
        {/* Nút TĂNG (Yêu cầu chính của đề bài) */}
        <TouchableOpacity
          style={styles.btnIncrement}
          onPress={handleIncrement}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>➕ Tăng (+1)</Text>
        </TouchableOpacity>

        {/* Các nút bổ trợ để sinh động và kiểm thử */}
        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={[styles.btnSecondary, count === 0 && styles.btnDisabled]}
            onPress={handleDecrement}
            disabled={count === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.btnSecondaryText}>➖ Giảm (-1)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnReset}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Text style={styles.btnResetText}>🔄 Đặt lại (0)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Khối giải thích cơ chế Re-render */}
      <View style={styles.insightBox}>
        <Text style={styles.insightTitle}>💡 Cơ chế hoạt động của Hook:</Text>
        <Text style={styles.insightText}>
          • <Text style={styles.codeText}>const [count, setCount] = useState(0);</Text>{'\n'}
          • Khi gọi <Text style={styles.codeText}>setCount(count + 1)</Text>, React ghi nhận state mới và lên lịch so khớp Virtual DOM để cập nhật đúng vị trí hiển thị con số trên UI.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  counterDisplay: {
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    marginBottom: 18,
  },
  displayLabel: {
    fontSize: 14,
    color: '#6D28D9',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  counterValue: {
    fontSize: 54,
    fontWeight: '800',
    color: '#4F46E5',
    marginVertical: 4,
  },
  subStatus: {
    fontSize: 12,
    color: '#7C3AED',
    fontStyle: 'italic',
  },
  buttonGroup: {
    gap: 10,
  },
  btnIncrement: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 10,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnSecondaryText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnReset: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  btnResetText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  insightBox: {
    marginTop: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0EA5E9',
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#D97706',
    fontWeight: '600',
  },
});

export default CounterHook;
