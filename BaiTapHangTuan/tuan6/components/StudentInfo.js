import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Bài tập 2 - Functional Component StudentInfo
 * @param {Object} props - Dữ liệu nhận từ component cha
 * @param {string} props.name - Họ và tên sinh viên
 * @param {string} [props.studentId] - Mã số sinh viên
 * @param {string} props.className - Lớp học
 * @param {string} props.major - Ngành học
 * @param {string} [props.status] - Trạng thái học tập (Đang học, Hoàn thành,...)
 */
const StudentInfo = ({ name, studentId, className, major, status = 'Đang học' }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {name ? name.split(' ').pop().charAt(0).toUpperCase() : 'S'}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.studentName}>{name}</Text>
          {studentId ? (
            <Text style={styles.studentIdText}>Mã SV: {studentId}</Text>
          ) : null}
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>🏫 Lớp học:</Text>
          <Text style={styles.value}>{className}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>🎓 Ngành học:</Text>
          <Text style={[styles.value, styles.majorHighlight]}>{major}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
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
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  studentIdText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  detailContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  majorHighlight: {
    color: '#2563EB',
  },
});

export default StudentInfo;
