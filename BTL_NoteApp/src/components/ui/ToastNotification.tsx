import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastConfig {
  message: string;
  type?: ToastType;
  subMessage?: string;
  duration?: number;
}

interface ToastNotificationProps {
  toast: ToastConfig | null;
  onDismiss: () => void;
}

export function ToastNotification({ toast, onDismiss }: ToastNotificationProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isDesktop ? 20 : -20)).current;

  useEffect(() => {
    if (toast) {
      // Hiệu ứng hiện
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 70,
          friction: 9,
          useNativeDriver: true,
        }),
      ]).start();

      // Tự động ẩn sau thời gian định sẵn (mặc định 2500ms)
      const timer = setTimeout(() => {
        hideToast();
      }, toast.duration || 2600);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: isDesktop ? 20 : -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!toast) return null;

  const getIconConfig = () => {
    switch (toast.type) {
      case 'error':
        return { name: 'close-circle' as const, color: '#EF4444', bg: '#FEE2E2' };
      case 'warning':
        return { name: 'alert-circle' as const, color: '#F59E0B', bg: '#FEF3C7' };
      case 'info':
        return { name: 'cloud-done' as const, color: '#3B82F6', bg: '#DBEAFE' };
      case 'success':
      default:
        return { name: 'checkmark-circle' as const, color: '#10B981', bg: '#D1FAE5' };
    }
  };

  const iconInfo = getIconConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        isDesktop ? styles.desktopPosition : styles.mobilePosition,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}>
      <View
        style={[
          styles.toastBox,
          {
            backgroundColor: isDark ? '#1E232F' : '#FFFFFF',
            borderColor: isDark ? '#2E384D' : '#E2E8F0',
          },
        ]}>
        <View style={[styles.iconWrap, { backgroundColor: isDark ? `${iconInfo.color}25` : iconInfo.bg }]}>
          <Ionicons name={iconInfo.name} size={20} color={iconInfo.color} />
        </View>

        <View style={styles.textWrap}>
          <ThemedText style={styles.messageText}>{toast.message}</ThemedText>
          {!!toast.subMessage && (
            <ThemedText style={[styles.subText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {toast.subMessage}
            </ThemedText>
          )}
        </View>

        <Pressable onPress={hideToast} hitSlop={8} style={styles.closeBtn}>
          <Ionicons name="close" size={18} color={isDark ? '#94A3B8' : '#94A3B8'} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
  },
  // Trên Desktop / Web: Đặt ở góc dưới bên phải
  desktopPosition: {
    right: 24,
    bottom: 24,
    maxWidth: 380,
    minWidth: 280,
  },
  // Trên Mobile: Đặt ở phía trên (Top Toast), tuyệt đối KHÔNG che nút FAB (+) ở góc dưới bên phải
  mobilePosition: {
    top: 50,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      } as any,
      default: {
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
      },
    }),
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  messageText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  subText: {
    fontSize: 11.5,
  },
  closeBtn: {
    padding: 4,
  },
});
