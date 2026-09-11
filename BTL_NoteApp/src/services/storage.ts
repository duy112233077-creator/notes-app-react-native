import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Note } from '@/types/note';

const STORAGE_KEY = '@noteapp_notes_list_v1';

const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: '🌟 Chào mừng bạn đến với Note App!',
    content:
      'Đây là ứng dụng ghi chú cá nhân đơn giản nhưng đầy đủ tính năng:\n• Nhấn "Thêm ghi chú" để tạo ghi chú mới\n• Nhấn vào icon ghim để đưa ghi chú quan trọng lên đầu\n• Bạn có thể sửa nội dung hoặc xóa ghi chú bất cứ lúc nào\n• Hỗ trợ phân loại theo danh mục và đổi màu sắc thẻ.',
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
      '1. Hoàn thiện bài tập lớn ứng dụng React Native.\n2. Kiểm tra giao diện responsive trên máy tính & điện thoại.\n3. Đọc thêm tài liệu về Expo Router và Reanimated.\n4. Chuẩn bị slide báo cáo tiến độ.',
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
      '- Họp giao ban đầu tuần lúc 9:00 sáng\n- Phản hồi email khách hàng về dự án mới\n- Rà soát lại thiết kế UI/UX cho màn hình quản trị\n- Tối ưu hóa hiệu năng tải trang web',
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
      '• Sách mới về lập trình TypeScript & Mobile App\n• Cà phê hạt rang mộc\n• Bàn phím cơ & giá đỡ máy tính xách tay\n• Trái cây và đồ ăn nhẹ cho cả tuần',
    category: 'Cá nhân',
    colorId: 'rose',
    isPinned: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

export const NoteStorage = {
  async getNotes(): Promise<Note[]> {
    try {
      let json: string | null = null;
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        json = window.localStorage.getItem(STORAGE_KEY);
      } else {
        json = await AsyncStorage.getItem(STORAGE_KEY);
      }

      if (!json) {
        // Lưu dữ liệu ban đầu
        await this.saveNotes(INITIAL_NOTES);
        return INITIAL_NOTES;
      }

      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : INITIAL_NOTES;
    } catch (err) {
      console.error('Lỗi khi tải ghi chú:', err);
      return INITIAL_NOTES;
    }
  },

  async saveNotes(notes: Note[]): Promise<void> {
    try {
      const json = JSON.stringify(notes);
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, json);
      }
      await AsyncStorage.setItem(STORAGE_KEY, json);
    } catch (err) {
      console.error('Lỗi khi lưu ghi chú:', err);
    }
  },
};
