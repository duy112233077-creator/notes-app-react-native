import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { Note } from '@/types/note';

interface AppointmentSchedulerModalProps {
  visible: boolean;
  notes: Note[];
  initialNoteId?: string;
  onClose: () => void;
  onSaveAppointment: (noteId: string, reminderIsoString?: string) => void;
}

export const AppointmentSchedulerModal: React.FC<AppointmentSchedulerModalProps> = ({
  visible,
  notes,
  initialNoteId,
  onClose,
  onSaveAppointment,
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const activeNotes = useMemo(() => notes.filter((n) => !n.isDeleted), [notes]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedNote = useMemo(
    () => activeNotes.find((n) => n.id === selectedNoteId),
    [activeNotes, selectedNoteId]
  );

  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');
  const [day, setDay] = useState('10');
  const [month, setMonth] = useState('10');
  const [year, setYear] = useState('2026');
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      const defaultId = initialNoteId || (activeNotes.length > 0 ? activeNotes[0].id : '');
      setSelectedNoteId(defaultId);
      setSearchQuery('');
      setError('');

      const targetNote = activeNotes.find((n) => n.id === defaultId);
      const d = targetNote?.reminderAt ? new Date(targetNote.reminderAt) : new Date(Date.now() + 3600000);
      setHour(d.getHours().toString().padStart(2, '0'));
      setMinute(d.getMinutes().toString().padStart(2, '0'));
      setDay(d.getDate().toString().padStart(2, '0'));
      setMonth((d.getMonth() + 1).toString().padStart(2, '0'));
      setYear(d.getFullYear().toString());
    }
  }, [visible, initialNoteId, activeNotes]);

  // When note changes, load its current reminder date if any
  const handleSelectNote = (note: Note) => {
    setSelectedNoteId(note.id);
    setError('');
    const d = note.reminderAt ? new Date(note.reminderAt) : new Date(Date.now() + 3600000);
    setHour(d.getHours().toString().padStart(2, '0'));
    setMinute(d.getMinutes().toString().padStart(2, '0'));
    setDay(d.getDate().toString().padStart(2, '0'));
    setMonth((d.getMonth() + 1).toString().padStart(2, '0'));
    setYear(d.getFullYear().toString());
  };

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
    if (!selectedNoteId) {
      setError('Vui lòng chọn ghi chú để đặt lịch hẹn.');
      return;
    }

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

    const targetDate = new Date(y, mo, d, h, m, 0);
    if (targetDate.getTime() < Date.now()) {
      setError('Thời gian đặt lịch hẹn phải ở tương lai.');
      return;
    }

    onSaveAppointment(selectedNoteId, targetDate.toISOString());
    onClose();
  };

  const handleClear = () => {
    if (!selectedNoteId) return;
    onSaveAppointment(selectedNoteId, undefined);
    onClose();
  };

  const filteredNoteList = useMemo(() => {
    if (!searchQuery.trim()) return activeNotes;
    return activeNotes.filter(
      (n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeNotes, searchQuery]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.headerIconBg}>
                <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>Đặt Lịch Hẹn Ghi Chú</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Step 1: Pick Note */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              1. Chọn ghi chú cần đặt lịch hẹn:
            </Text>

            {activeNotes.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={{ color: colors.textSecondary }}>Chưa có ghi chú nào. Hãy tạo ghi chú trước!</Text>
              </View>
            ) : (
              <View style={styles.notePickerSection}>
                {activeNotes.length > 3 && (
                  <View style={[styles.searchBox, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                    <Ionicons name="search" size={16} color={colors.textSecondary} />
                    <TextInput
                      style={[styles.searchInput, { color: colors.text }]}
                      placeholder="Tìm ghi chú..."
                      placeholderTextColor={colors.textSecondary}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                )}

                <ScrollView style={styles.noteList} nestedScrollEnabled>
                  {filteredNoteList.map((note) => {
                    const isSelected = note.id === selectedNoteId;
                    return (
                      <TouchableOpacity
                        key={note.id}
                        style={[
                          styles.noteItem,
                          {
                            backgroundColor: isSelected
                              ? 'rgba(37, 99, 235, 0.12)'
                              : isDark
                                ? '#1E293B'
                                : '#F8FAFC',
                            borderColor: isSelected ? '#2563EB' : isDark ? '#334155' : '#E2E8F0',
                          },
                        ]}
                        onPress={() => handleSelectNote(note)}>
                        <Ionicons
                          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                          size={18}
                          color={isSelected ? '#2563EB' : colors.textSecondary}
                        />
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              styles.noteItemTitle,
                              { color: isSelected ? '#2563EB' : colors.text, fontWeight: isSelected ? '700' : '600' },
                            ]}
                            numberOfLines={1}>
                            {note.title || 'Ghi chú không tiêu đề'}
                          </Text>
                          {note.reminderAt && (
                            <Text style={styles.reminderBadgeText}>
                              🕒 Lịch hẹn: {new Date(note.reminderAt).toLocaleString('vi-VN')}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Step 2: Set Date & Time */}
            {selectedNote && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>
                  2. Chọn ngày & giờ hẹn:
                </Text>

                {/* Quick Presets */}
                <View style={styles.presetsRow}>
                  <TouchableOpacity
                    style={[styles.presetChip, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}
                    onPress={() => setPreset(1)}>
                    <Ionicons name="time-outline" size={14} color="#2563EB" />
                    <Text style={styles.presetText}>+1 giờ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.presetChip, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}
                    onPress={() => setPreset(0, 8, 0)}>
                    <Ionicons name="sunny-outline" size={14} color="#2563EB" />
                    <Text style={styles.presetText}>8:00 Sáng mai</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.presetChip, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}
                    onPress={() => setPreset(0, 20, 0)}>
                    <Ionicons name="moon-outline" size={14} color="#2563EB" />
                    <Text style={styles.presetText}>20:00 Tối nay</Text>
                  </TouchableOpacity>
                </View>

                {/* Time & Date Inputs */}
                <View style={styles.inputsGrid}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Giờ (00-23)</Text>
                    <TextInput
                      style={[styles.input, { color: colors.text, backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}
                      keyboardType="number-pad"
                      maxLength={2}
                      value={hour}
                      onChangeText={setHour}
                    />
                  </View>

                  <Text style={[styles.colon, { color: colors.text }]}>:</Text>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Phút (00-59)</Text>
                    <TextInput
                      style={[styles.input, { color: colors.text, backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}
                      keyboardType="number-pad"
                      maxLength={2}
                      value={minute}
                      onChangeText={setMinute}
                    />
                  </View>
                </View>

                <View style={[styles.inputsGrid, { marginTop: 12 }]}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Ngày</Text>
                    <TextInput
                      style={[styles.input, { color: colors.text, backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}
                      keyboardType="number-pad"
                      maxLength={2}
                      value={day}
                      onChangeText={setDay}
                    />
                  </View>

                  <Text style={[styles.colon, { color: colors.text }]}>/</Text>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Tháng</Text>
                    <TextInput
                      style={[styles.input, { color: colors.text, backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}
                      keyboardType="number-pad"
                      maxLength={2}
                      value={month}
                      onChangeText={setMonth}
                    />
                  </View>

                  <Text style={[styles.colon, { color: colors.text }]}>/</Text>

                  <View style={[styles.inputGroup, { flex: 1.5 }]}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Năm</Text>
                    <TextInput
                      style={[styles.input, { color: colors.text, backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}
                      keyboardType="number-pad"
                      maxLength={4}
                      value={year}
                      onChangeText={setYear}
                    />
                  </View>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </>
            )}
          </ScrollView>

          {/* Actions */}
          <View style={styles.footer}>
            {selectedNote?.reminderAt && (
              <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
                <Text style={styles.clearBtnText}>Xóa lịch hẹn</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, { opacity: selectedNote ? 1 : 0.5 }]}
              disabled={!selectedNote}
              onPress={handleSave}>
              <Ionicons name="checkmark-sharp" size={18} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Lưu Lịch Hẹn</Text>
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
    maxWidth: 520,
    maxHeight: '85%',
    borderRadius: 24,
    padding: 20,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
  } as any,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  headerIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
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
    borderRadius: 20,
  },
  body: {
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyBox: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  notePickerSection: {
    gap: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  noteList: {
    maxHeight: 160,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 6,
    gap: 10,
  },
  noteItemTitle: {
    fontSize: 14,
  },
  reminderBadgeText: {
    fontSize: 11,
    color: '#D97706',
    marginTop: 2,
    fontWeight: '500',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  inputsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
  },
  colon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  clearBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
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
