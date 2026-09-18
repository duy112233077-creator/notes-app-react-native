import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface ReminderPickerModalProps {
  visible: boolean;
  initialDate?: string;
  onClose: () => void;
  onConfirm: (isoString: string) => void;
  onClear: () => void;
}

export const ReminderPickerModal: React.FC<ReminderPickerModalProps> = ({
  visible,
  initialDate,
  onClose,
  onConfirm,
  onClear,
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const now = new Date();
  const defaultTarget = initialDate ? new Date(initialDate) : new Date(Date.now() + 3600000);

  const [hour, setHour] = useState(defaultTarget.getHours().toString().padStart(2, '0'));
  const [minute, setMinute] = useState(defaultTarget.getMinutes().toString().padStart(2, '0'));
  const [day, setDay] = useState(defaultTarget.getDate().toString().padStart(2, '0'));
  const [month, setMonth] = useState((defaultTarget.getMonth() + 1).toString().padStart(2, '0'));
  const [year, setYear] = useState(defaultTarget.getFullYear().toString());
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      const d = initialDate ? new Date(initialDate) : new Date(Date.now() + 3600000);
      setHour(d.getHours().toString().padStart(2, '0'));
      setMinute(d.getMinutes().toString().padStart(2, '0'));
      setDay(d.getDate().toString().padStart(2, '0'));
      setMonth((d.getMonth() + 1).toString().padStart(2, '0'));
      setYear(d.getFullYear().toString());
      setError('');
    }
  }, [visible, initialDate]);

  const setPreset = (hoursOffset: number, fixedHour?: number, fixedMin?: number) => {
    const d = new Date();
    if (fixedHour !== undefined && fixedMin !== undefined) {
      if (d.getHours() >= fixedHour) {
        d.setDate(d.getDate() + 1);
      }
      d.setHours(fixedHour, fixedMin, 0, 0);
    } else {
      d.setTime(d.getTime() + hoursOffset * 3600000);
    }

    setHour(d.getHours().toString().padStart(2, '0'));
    setMinute(d.getMinutes().toString().padStart(2, '0'));
    setDay(d.getDate().toString().padStart(2, '0'));
    setMonth((d.getMonth() + 1).toString().padStart(2, '0'));
    setYear(d.getFullYear().toString());
    setError('');
  };

  const handleSave = () => {
    const h = parseInt(hour, 10);
    const m = parseInt(minute, 10);
    const d = parseInt(day, 10);
    const mo = parseInt(month, 10) - 1;
    const y = parseInt(year, 10);

    if (isNaN(h) || h < 0 || h > 23) {
      setError('Giờ không hợp lệ (00 - 23)');
      return;
    }
    if (isNaN(m) || m < 0 || m > 59) {
      setError('Phút không hợp lệ (00 - 59)');
      return;
    }
    if (isNaN(d) || d < 1 || d > 31) {
      setError('Ngày không hợp lệ (01 - 31)');
      return;
    }
    if (isNaN(mo) || mo < 0 || mo > 11) {
      setError('Tháng không hợp lệ (01 - 12)');
      return;
    }
    if (isNaN(y) || y < 2024 || y > 2100) {
      setError('Năm không hợp lệ');
      return;
    }

    const scheduledDate = new Date(y, mo, d, h, m, 0);
    if (isNaN(scheduledDate.getTime())) {
      setError('Thời gian không hợp lệ');
      return;
    }

    onConfirm(scheduledDate.toISOString());
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: isDark ? '#1E222A' : '#FFFFFF',
              borderColor: isDark ? '#2E3440' : '#E2E8F0',
            },
          ]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconBadge}>
                <Ionicons name="alarm-outline" size={20} color="#D97706" />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>Hẹn Giờ Nhắc Nhở</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
            Định dạng: <Text style={{ fontWeight: '700', color: '#D97706' }}>Giờ : Phút - Ngày / Tháng / Năm</Text>
          </Text>

          {/* Presets */}
          <View style={styles.presetRow}>
            <TouchableOpacity style={styles.presetChip} onPress={() => setPreset(1)}>
              <Text style={styles.presetText}>+1 Giờ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetChip} onPress={() => setPreset(3)}>
              <Text style={styles.presetText}>+3 Giờ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetChip} onPress={() => setPreset(0, 20, 0)}>
              <Text style={styles.presetText}>Tối nay 20:00</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetChip} onPress={() => setPreset(0, 9, 0)}>
              <Text style={styles.presetText}>Sáng mai 09:00</Text>
            </TouchableOpacity>
          </View>

          {/* Time Picker Inputs: HH : mm */}
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>⏰ GIỜ : PHÚT</Text>
          <View style={styles.timeRow}>
            <View style={styles.inputCol}>
              <TextInput
                style={[
                  styles.timeInput,
                  { color: colors.text, backgroundColor: isDark ? '#14171E' : '#F8FAFC', borderColor: isDark ? '#2B3245' : '#CBD5E1' },
                ]}
                value={hour}
                onChangeText={setHour}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="HH"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.inputLabel}>Giờ (0-23)</Text>
            </View>

            <Text style={[styles.colon, { color: colors.text }]}>:</Text>

            <View style={styles.inputCol}>
              <TextInput
                style={[
                  styles.timeInput,
                  { color: colors.text, backgroundColor: isDark ? '#14171E' : '#F8FAFC', borderColor: isDark ? '#2B3245' : '#CBD5E1' },
                ]}
                value={minute}
                onChangeText={setMinute}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="MM"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.inputLabel}>Phút (0-59)</Text>
            </View>
          </View>

          {/* Date Picker Inputs: DD / MM / YYYY */}
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>📅 NGÀY / THÁNG / NĂM</Text>
          <View style={styles.dateRow}>
            <View style={styles.inputCol}>
              <TextInput
                style={[
                  styles.dateInput,
                  { color: colors.text, backgroundColor: isDark ? '#14171E' : '#F8FAFC', borderColor: isDark ? '#2B3245' : '#CBD5E1' },
                ]}
                value={day}
                onChangeText={setDay}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="DD"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.inputLabel}>Ngày</Text>
            </View>

            <Text style={[styles.slash, { color: colors.textSecondary }]}>/</Text>

            <View style={styles.inputCol}>
              <TextInput
                style={[
                  styles.dateInput,
                  { color: colors.text, backgroundColor: isDark ? '#14171E' : '#F8FAFC', borderColor: isDark ? '#2B3245' : '#CBD5E1' },
                ]}
                value={month}
                onChangeText={setMonth}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="MM"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.inputLabel}>Tháng</Text>
            </View>

            <Text style={[styles.slash, { color: colors.textSecondary }]}>/</Text>

            <View style={[styles.inputCol, { flex: 1.5 }]}>
              <TextInput
                style={[
                  styles.dateInput,
                  { color: colors.text, backgroundColor: isDark ? '#14171E' : '#F8FAFC', borderColor: isDark ? '#2B3245' : '#CBD5E1' },
                ]}
                value={year}
                onChangeText={setYear}
                keyboardType="number-pad"
                maxLength={4}
                placeholder="YYYY"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.inputLabel}>Năm</Text>
            </View>
          </View>

          {/* Error Message */}
          {!!error && <Text style={styles.errorText}>⚠️ {error}</Text>}

          {/* Footer actions */}
          <View style={styles.footer}>
            {initialDate ? (
              <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
                <Text style={styles.clearText}>Xóa hẹn giờ</Text>
              </TouchableOpacity>
            ) : null}

            <View style={styles.rightFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmBtn} onPress={handleSave}>
                <Ionicons name="checkmark" size={18} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.confirmText}>Xác nhận</Text>
              </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 12,
    marginBottom: 16,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  presetChip: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  colon: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  slash: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  inputCol: {
    flex: 1,
    alignItems: 'center',
  },
  timeInput: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },
  dateInput: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  clearText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  },
  rightFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 'auto',
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D97706',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
