import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Note } from '@/types/note';

const STORAGE_KEY = '@noteapp_notes_list_v1';

// Tự động nhận diện IP máy tính khi chạy trên điện thoại thật (qua Expo Go), máy ảo hoặc trình duyệt Web
function getApiBaseUrl(): string {
  if (Platform.OS === 'web') {
    return 'http://localhost:3001/api';
  }

  // Khi quét mã QR bằng Expo Go trên điện thoại thật, Expo tự cung cấp hostUri chứa IP máy tính
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:3001/api`;
  }

  // Trường hợp máy ảo Android mặc định kết nối máy tính qua 10.0.2.2 hoặc IP Wi-Fi
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001/api';
  }

  return 'http://192.168.88.182:3001/api';
}

const API_BASE_URL = getApiBaseUrl();

const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: '🌟 Chào mừng bạn đến với Note App!',
    content:
      'Dữ liệu đã kết nối trực tiếp với MySQL trên XAMPP!\n• Bạn tạo ghi chú mới sẽ tự động lưu vào MySQL.\n• Bạn sửa nội dung hoặc xóa ghi chú thì MySQL cũng cập nhật tương ứng.\n• Có thể mở phpMyAdmin (http://localhost/phpmyadmin) để xem bảng "notes".',
    category: 'Ý tưởng',
    colorId: 'yellow',
    isPinned: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'note-2',
    title: '📚 Nhiệm vụ học tập tuần này',
    content:
      '1. Hoàn thiện bài tập lớn ứng dụng React Native.\n2. Kiểm tra kết nối cơ sở dữ liệu MySQL trên XAMPP.\n3. Chuẩn bị slide báo cáo tiến độ.',
    category: 'Học tập',
    colorId: 'blue',
    isPinned: true,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'note-3',
    title: '💼 Danh sách việc cần làm công việc',
    content:
      '- Họp giao ban đầu tuần lúc 9:00 sáng\n- Phản hồi email khách hàng về dự án mới\n- Rà soát lại thiết kế UI/UX',
    category: 'Công việc',
    colorId: 'green',
    isPinned: false,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'note-4',
    title: '🛒 Mua sắm cuối tuần',
    content:
      '• Sách mới về lập trình TypeScript & Mobile App\n• Cà phê hạt rang mộc\n• Bàn phím cơ & giá đỡ máy tính xách tay',
    category: 'Cá nhân',
    colorId: 'rose',
    isPinned: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

export const NoteStorage = {
  // Lấy dữ liệu ghi chú: Ưu tiên tải từ MySQL trên XAMPP, fallback về lưu trữ cục bộ
  async getNotes(): Promise<Note[]> {
    // 1. Thử tải từ API MySQL
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch(`${API_BASE_URL}/notes`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          // Lưu cache vào local
          await this.saveToLocalCache(data);
          return data;
        } else if (Array.isArray(data) && data.length === 0) {
          // Nếu MySQL chưa có dữ liệu, nạp INITIAL_NOTES vào MySQL
          await this.syncToMySQL(INITIAL_NOTES);
          await this.saveToLocalCache(INITIAL_NOTES);
          return INITIAL_NOTES;
        }
      }
    } catch (apiErr) {
      console.warn('⚠️ [API] Không kết nối được API MySQL, dùng dữ liệu bộ nhớ đệm:', apiErr);
    }

    // 2. Fallback: Đọc từ bộ nhớ máy (Local Storage / AsyncStorage)
    return await this.loadFromLocalCache();
  },

  // Lưu ghi chú: Lưu cục bộ và đồng bộ ngay lập tức vào MySQL
  async saveNotes(notes: Note[]): Promise<void> {
    // Lưu vào bộ nhớ máy ngay lập tức
    await this.saveToLocalCache(notes);

    // Đồng bộ lên MySQL trên XAMPP
    await this.syncToMySQL(notes);
  },

  // Đồng bộ danh sách ghi chú lên MySQL
  async syncToMySQL(notes: Note[]): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notes),
      });
      return response.ok;
    } catch (err) {
      console.warn('⚠️ [MySQL Sync] Chưa thể đồng bộ lên MySQL lúc này:', err);
      return false;
    }
  },

  // Lưu cache nội bộ
  async saveToLocalCache(notes: Note[]): Promise<void> {
    try {
      const json = JSON.stringify(notes);
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, json);
      }
      await AsyncStorage.setItem(STORAGE_KEY, json);
    } catch (err) {
      console.error('Lỗi khi lưu cache:', err);
    }
  },

  // Đọc cache nội bộ
  async loadFromLocalCache(): Promise<Note[]> {
    try {
      let json: string | null = null;
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        json = window.localStorage.getItem(STORAGE_KEY);
      } else {
        json = await AsyncStorage.getItem(STORAGE_KEY);
      }

      if (!json) {
        await this.saveToLocalCache(INITIAL_NOTES);
        return INITIAL_NOTES;
      }

      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : INITIAL_NOTES;
    } catch (err) {
      console.error('Lỗi khi đọc cache:', err);
      return INITIAL_NOTES;
    }
  },
};
