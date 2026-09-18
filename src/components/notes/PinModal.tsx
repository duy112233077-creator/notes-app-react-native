import React, { useState, useEffect } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { NoteStorage } from '@/services/storage';
import { Colors, Spacing } from '@/constants/theme';

// Chế độ của modal:
// 'verify'    - Nhập PIN để mở khóa ghi chú (đã có PIN rồi)
// 'set'       - Người dùng đặt PIN lần đầu
// 'confirm'   - Nhập lại PIN để xác nhận (sau bước 'set')
type PinMode = 'verify' | 'set' | 'confirm';

interface PinModalProps {
  visible: boolean;
  noteTitle?: string;
  actionLabel?: string;
  onSuccess: (newPin?: string) => void;
  onClose: () => void;
}

export function PinModal({
  visible,
  noteTitle,
  actionLabel = 'mở khóa',
  onSuccess,
  onClose,
}: PinModalProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [mode, setMode] = useState<PinMode>('verify');
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState(''); // Lưu PIN bước 1 để so sánh bước 2
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Khi modal mở ra, kiểm tra xem đã có PIN chưa để chọn chế độ
  useEffect(() => {
    if (visible) {
      setPin('');
      setFirstPin('');
      setErrorMessage('');
      checkInitialMode();
    }
  }, [visible]);

  const checkInitialMode = async () => {
    setIsLoading(true);
    const hasPinAlready = await NoteStorage.hasUserPin();
    setMode(hasPinAlready ? 'verify' : 'set');
    setIsLoading(false);
  };

  const handleKeyPress = (num: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + num;
    setPin(newPin);
    setErrorMessage('');

    if (newPin.length === 4) {
      setTimeout(() => handlePinComplete(newPin), 150);
    }
  };

  const handlePinComplete = async (enteredPin: string) => {
    if (mode === 'set') {
      // Bước 1: Ghi nhớ PIN, chuyển sang bước xác nhận
      setFirstPin(enteredPin);
      setPin('');
      setMode('confirm');
      return;
    }

    if (mode === 'confirm') {
      // Bước 2: So sánh với PIN bước 1
      if (enteredPin === firstPin) {
        await NoteStorage.setUserPin(enteredPin);
        onSuccess(enteredPin);
        onClose();
      } else {
        setPin('');
        setFirstPin('');
        setMode('set');
        setErrorMessage('Hai lần nhập không khớp. Vui lòng đặt lại từ đầu.');
      }
      return;
    }

    if (mode === 'verify') {
      // Xác minh PIN đã có
      const savedPin = await NoteStorage.getUserPin();
      if (enteredPin === savedPin) {
        onSuccess();
        onClose();
      } else {
        setPin('');
        setErrorMessage('Mã PIN không đúng. Vui lòng thử lại.');
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin((prev) => prev.slice(0, -1));
      setErrorMessage('');
    }
  };

  const handleClose = () => {
    setPin('');
    setFirstPin('');
    setMode('verify');
    setErrorMessage('');
    onClose();
  };

  // Nội dung header theo từng chế độ
  const getHeaderContent = () => {
    if (mode === 'set') {
      return {
        icon: 'lock-open' as const,
        iconColor: '#3B82F6',
        title: 'Đặt mã PIN bảo mật',
        subtitle: `Chọn mã PIN 4 số để khóa ghi chú${noteTitle ? ` "${noteTitle}"` : ''}`,
      };
    }
    if (mode === 'confirm') {
      return {
        icon: 'checkmark-circle' as const,
        iconColor: '#10B981',
        title: 'Xác nhận mã PIN',
        subtitle: 'Nhập lại PIN vừa chọn để xác nhận',
      };
    }
    return {
      icon: 'lock-closed' as const,
      iconColor: '#3B82F6',
      title: 'Xác minh bảo mật',
      subtitle: `Nhập mã PIN để ${actionLabel}${noteTitle ? ` "${noteTitle}"` : ''}`,
    };
  };

  const headerContent = getHeaderContent();

  if (isLoading) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={handleClose} />

        <ThemedView
          style={[
            styles.modalBox,
            isDesktop ? styles.desktopModal : styles.mobileModal,
            {
              backgroundColor: isDark ? '#1C2029' : '#FFFFFF',
              borderColor: isDark ? '#2D3546' : '#E2E8F0',
            },
          ]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View
              style={[
                styles.lockIconWrap,
                { backgroundColor: `${headerContent.iconColor}18` },
              ]}>
              <Ionicons name={headerContent.icon} size={26} color={headerContent.iconColor} />
            </View>
            <ThemedText style={styles.headerTitle}>{headerContent.title}</ThemedText>
            <ThemedText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {headerContent.subtitle}
            </ThemedText>

            {/* Chỉ báo bước cho chế độ đặt PIN */}
            {(mode === 'set' || mode === 'confirm') && (
              <View style={styles.stepRow}>
                <View
                  style={[
                    styles.stepDot,
                    { backgroundColor: mode === 'set' ? '#3B82F6' : '#10B981' },
                  ]}
                />
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor:
                        mode === 'confirm' ? '#10B981' : (isDark ? '#2B3448' : '#E2E8F0'),
                    },
                  ]}
                />
                <ThemedText style={[styles.stepText, { color: colors.textSecondary }]}>
                  {mode === 'set' ? 'Bước 1/2: Nhập PIN mới' : 'Bước 2/2: Xác nhận PIN'}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Dấu chấm hiển thị số ký tự PIN */}
          <View style={styles.dotsRow}>
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pin.length > index;
              return (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isFilled
                        ? (mode === 'confirm' ? '#10B981' : '#3B82F6')
                        : (isDark ? '#2B3448' : '#E2E8F0'),
                      borderColor: isFilled
                        ? (mode === 'confirm' ? '#10B981' : '#3B82F6')
                        : (isDark ? '#3D4963' : '#CBD5E1'),
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Thông báo lỗi */}
          {!!errorMessage && (
            <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
          )}

          {/* Bàn phím số */}
          <View style={styles.keypad}>
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
            ].map((row, rowIdx) => (
              <View key={rowIdx} style={styles.keypadRow}>
                {row.map((num) => (
                  <Pressable
                    key={num}
                    onPress={() => handleKeyPress(num)}
                    style={({ pressed }) => [
                      styles.numBtn,
                      {
                        backgroundColor: isDark ? '#252C3B' : '#F1F5F9',
                      },
                      pressed && { opacity: 0.65, transform: [{ scale: 0.95 }] },
                    ]}>
                    <ThemedText style={styles.numBtnText}>{num}</ThemedText>
                  </Pressable>
                ))}
              </View>
            ))}

            {/* Hàng cuối: Hủy / 0 / Xóa */}
            <View style={styles.keypadRow}>
              <Pressable
                onPress={handleClose}
                style={({ pressed }) => [
                  styles.numBtn,
                  styles.actionKeyBtn,
                  pressed && { opacity: 0.65 },
                ]}>
                <ThemedText style={[styles.cancelText, { color: colors.textSecondary }]}>
                  Hủy
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => handleKeyPress('0')}
                style={({ pressed }) => [
                  styles.numBtn,
                  {
                    backgroundColor: isDark ? '#252C3B' : '#F1F5F9',
                  },
                  pressed && { opacity: 0.65, transform: [{ scale: 0.95 }] },
                ]}>
                <ThemedText style={styles.numBtnText}>0</ThemedText>
              </Pressable>

              <Pressable
                onPress={handleDelete}
                style={({ pressed }) => [
                  styles.numBtn,
                  styles.actionKeyBtn,
                  pressed && { opacity: 0.65 },
                ]}>
                <Ionicons name="backspace-outline" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>

          {/* Gợi ý thêm khi đặt PIN */}
          {mode === 'set' && (
            <ThemedText style={[styles.hintText, { color: colors.textSecondary }]}>
              💡 Mã PIN dùng chung cho tất cả ghi chú bảo mật của bạn
            </ThemedText>
          )}
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  backdropPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalBox: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.four,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      } as any,
      default: {
        elevation: 8,
      },
    }),
  },
  desktopModal: {
    maxWidth: 380,
  },
  mobileModal: {
    maxWidth: 340,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.two,
    gap: 4,
    width: '100%',
  },
  lockIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: Spacing.two,
    lineHeight: 18,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: Spacing.three,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12.5,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  keypad: {
    width: '100%',
    gap: 12,
    marginTop: Spacing.one,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  numBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numBtnText: {
    fontSize: 20,
    fontWeight: '700',
  },
  actionKeyBtn: {
    backgroundColor: 'transparent',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hintText: {
    fontSize: 12,
    marginTop: Spacing.three,
    textAlign: 'center',
    paddingHorizontal: Spacing.two,
  },
});
