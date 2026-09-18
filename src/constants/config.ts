import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Tự động xác định địa chỉ API cơ sở cho backend Express
 * Ưu tiên:
 * 1. Biến môi trường EXPO_PUBLIC_API_URL nếu được cấu hình
 * 2. Web browser: localhost:3001
 * 3. Expo Go trên thiết bị thật: trích xuất IP LAN của máy host từ hostUri
 * 4. Android Emulator: 10.0.2.2:3001
 * 5. Fallback mặc định: localhost:3001
 */
export function getApiBaseUrl(): string {
  // 1. Biến môi trường
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Trình duyệt Web
  if (Platform.OS === 'web') {
    return 'http://localhost:3001/api';
  }

  // 3. Quét mã QR bằng Expo Go trên điện thoại thật
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:3001/api`;
  }

  // 4. Máy ảo Android Studio mặc định nối host qua 10.0.2.2
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001/api';
  }

  // 5. Fallback an toàn
  return 'http://localhost:3001/api';
}

export const API_BASE_URL = getApiBaseUrl();

// Độ dài mã PIN bảo mật
export const PIN_LENGTH = 4;
