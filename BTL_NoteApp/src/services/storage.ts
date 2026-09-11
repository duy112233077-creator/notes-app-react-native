import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Note } from '@/types/note';

const STORAGE_KEY = '@noteapp_notes_list_v1';
const PENDING_SYNC_KEY = '@noteapp_pending_sync_flag_v1';

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
  // Lấy dữ liệu ghi chú: Cơ chế tự động đồng bộ bù (Offline-to-Online Sync)
  async getNotes(): Promise<Note[]> {
    const localNotes = await this.loadFromLocalCache();
    const hasPendingSync = await this.getPendingSyncFlag();

    // 1. Thử kết nối tới MySQL trên XAMPP
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch(`${API_BASE_URL}/notes`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        // KHI MYSQL ĐÃ BẬT LẠI THÀNH CÔNG:

        // A. Nếu có dữ liệu đã tạo/sửa lúc TẮT XAMPP (pending sync):
        if (hasPendingSync) {
          console.log('🔄 [Auto-Sync] Đã phát hiện XAMPP bật lại, tự động đẩy toàn bộ ghi chú offline vào MySQL...');
          await this.syncToMySQL(localNotes);
          await this.setPendingSyncFlag(false);
          return localNotes;
        }

        // B. Nếu không có thay đổi offline, đọc dữ liệu mới nhất từ MySQL
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          await this.saveToLocalCache(data);
          return data;
        } else if (Array.isArray(data) && data.length === 0) {
          // Nếu MySQL vừa tạo trống, đẩy danh sách ban đầu lên
          const toSync = localNotes.length > 0 ? localNotes : INITIAL_NOTES;
          await this.syncToMySQL(toSync);
          await this.saveToLocalCache(toSync);
          return toSync;
        }
      }
    } catch (apiErr) {
      console.warn('⚠️ [Offline] Chưa kết nối được MySQL trên XAMPP, chuyển sang dùng bộ nhớ máy cục bộ.');
    }

    // 2. Khi XAMPP đang TẮT: Đọc từ bộ nhớ máy (Local Storage / AsyncStorage)
    return localNotes;
  },

  // Lưu ghi chú: Lưu cục bộ và đồng bộ ngay lên MySQL. Nếu MySQL tắt, đánh dấu để đồng bộ bù sau
  async saveNotes(notes: Note[]): Promise<void> {
    // 1. Luôn lưu ngay vào bộ nhớ máy để đảm bảo không mất dữ liệu
    await this.saveToLocalCache(notes);

    // 2. Thử đồng bộ lên MySQL
    const synced = await this.syncToMySQL(notes);
    if (!synced) {
      // Nếu XAMPP đang tắt, ghi nhận cờ "Pending Sync"
      console.log('📝 [Offline Mode] Đã lưu vào bộ nhớ máy. Sẽ tự động cập nhật vào MySQL ngay khi bạn bật lại XAMPP!');
      await this.setPendingSyncFlag(true);
    } else {
      await this.setPendingSyncFlag(false);
    }
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

  // Quản lý cờ đồng bộ bù (Pending Sync Flag)
  async getPendingSyncFlag(): Promise<boolean> {
    try {
      let val: string | null = null;
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        val = window.localStorage.getItem(PENDING_SYNC_KEY);
      } else {
        val = await AsyncStorage.getItem(PENDING_SYNC_KEY);
      }
      return val === 'true';
    } catch {
      return false;
    }
  },

  async setPendingSyncFlag(pending: boolean): Promise<void> {
    try {
      const val = pending ? 'true' : 'false';
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(PENDING_SYNC_KEY, val);
      }
      await AsyncStorage.setItem(PENDING_SYNC_KEY, val);
    } catch (err) {
      console.error('Lỗi khi cập nhật cờ pending sync:', err);
    }
  },
};
