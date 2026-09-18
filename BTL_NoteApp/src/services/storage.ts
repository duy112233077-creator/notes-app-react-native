import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Note } from '@/types/note';
import { API_BASE_URL } from '@/constants/config';
import { AuthService } from '@/services/authService';


const STORAGE_KEY = '@noteapp_notes_list_v1';
const PENDING_QUEUE_KEY = '@noteapp_pending_actions_v1';
const USER_PIN_KEY = '@noteapp_user_security_pin_v1';

export type PendingAction =
  | { type: 'SAVE'; note: Note; timestamp: number }
  | { type: 'DELETE'; id: string; timestamp: number };

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: '🌟 Chào mừng bạn đến với Note App!',
    content:
      'Dữ liệu đã kết nối trực tiếp với MySQL trên XAMPP!\n• Bạn tạo ghi chú mới sẽ tự động lưu vào MySQL.\n• Bạn sửa nội dung hoặc xóa ghi chú thì MySQL cũng cập nhật tương ứng.\n• Có thể mở phpMyAdmin (http://localhost/phpmyadmin) để xem bảng "notes".\n• Bạn cũng có thể khóa bảo mật các ghi chú quan trọng bằng mã PIN!',
    category: 'Ý tưởng',
    colorId: 'yellow',
    isPinned: true,
    isLocked: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'note-2',
    title: '📚 Nhiệm vụ học tập tuần này',
    content:
      '1. Hoàn thiện bài tập lớn ứng dụng React Native.\n2. Kiểm tra kết nối cơ sở dữ liệu MySQL trên XAMPP.\n3. Chuẩn bị slide báo cáo tiến độ và demo các tính năng nâng cao.',
    category: 'Học tập',
    colorId: 'blue',
    isPinned: true,
    isLocked: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'note-3',
    title: '🔒 Thông tin mật cá nhân',
    content:
      'Đây là ghi chú được bảo vệ bằng lớp khóa thứ hai.\nChỉ những người biết mã PIN (mặc định: 1234) mới có thể mở xem và chỉnh sửa nội dung này!',
    category: 'Cá nhân',
    colorId: 'purple',
    isPinned: false,
    isLocked: true,
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
    isLocked: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

export const NoteStorage = {
  // Lấy toàn bộ danh sách ghi chú — merge local + server thông minh theo updatedAt
  async getNotes(): Promise<Note[]> {
    const localNotes = await this.loadFromLocalCache();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const headers = await AuthService.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/notes`, {
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        // 1. Đẩy hàng đợi offline (thao tác tạo/sửa/xóa khi mất mạng) lên server trước
        const hasPending = await this.hasPendingActions();
        if (hasPending) {
          await this.syncPendingQueue();
        }

        const serverNotes: Note[] = await response.json();

        if (!Array.isArray(serverNotes)) return localNotes;

        // 2. Trường hợp server trống nhưng local có dữ liệu → đẩy toàn bộ local lên server
        if (serverNotes.length === 0 && localNotes.length > 0) {
          for (const note of localNotes) {
            try {
              await fetch(`${API_BASE_URL}/notes`, {
                method: 'POST',
                headers,
                body: JSON.stringify(note),
              });
            } catch { /* bỏ qua lỗi từng note */ }
          }
          return localNotes;
        }

        // 3. Merge thông minh: ưu tiên bản có updatedAt mới hơn
        const serverMap = new Map<string, Note>(serverNotes.map((n) => [n.id, n]));
        const localMap  = new Map<string, Note>(localNotes.map((n) => [n.id, n]));
        const mergedMap = new Map<string, Note>();

        // Thêm toàn bộ từ server
        for (const [id, sNote] of serverMap) {
          const lNote = localMap.get(id);
          if (!lNote) {
            mergedMap.set(id, sNote);
          } else {
            // Có ở cả 2 nơi → lấy bản mới hơn theo updatedAt
            const sTime = new Date(sNote.updatedAt || 0).getTime();
            const lTime = new Date(lNote.updatedAt || 0).getTime();
            mergedMap.set(id, lTime > sTime ? lNote : sNote);
          }
        }

        // Ghi chú chỉ có local (tạo offline chưa sync) → POST lên server
        for (const [id, lNote] of localMap) {
          if (!serverMap.has(id)) {
            mergedMap.set(id, lNote);
            try {
              await fetch(`${API_BASE_URL}/notes`, {
                method: 'POST',
                headers,
                body: JSON.stringify(lNote),
              });
            } catch { /* ghi vào queue sau */ }
          }
        }

        const merged = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
        );

        // 4. Cập nhật cache local với kết quả merge
        await this.saveToLocalCache(merged);
        return merged;
      }
    } catch (apiErr) {
      // Server MySQL chưa bật hoặc lỗi mạng: dùng dữ liệu bộ nhớ máy
    }

    return localNotes;
  },

  // Lưu 1 ghi chú (Tạo mới hoặc Sửa) theo từng thao tác đơn lẻ (Atomic Save)
  async saveSingleNote(note: Note): Promise<{ success: boolean; synced: boolean }> {
    // 1. Cập nhật ngay vào bộ nhớ máy để đảm bảo không mất dữ liệu
    const currentNotes = await this.loadFromLocalCache();
    const existingIndex = currentNotes.findIndex((n) => n.id === note.id);
    let updatedNotes: Note[];

    if (existingIndex >= 0) {
      updatedNotes = currentNotes.map((n) => (n.id === note.id ? note : n));
    } else {
      updatedNotes = [note, ...currentNotes];
    }
    await this.saveToLocalCache(updatedNotes);

    // 2. Thử gửi POST lên API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const headers = await AuthService.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(note),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        return { success: true, synced: true };
      }
    } catch {
      // API lỗi hoặc offline
    }

    // Nếu không kết nối được server, đưa vào hàng đợi chờ đồng bộ bù
    await this.enqueuePendingAction({ type: 'SAVE', note, timestamp: Date.now() });
    return { success: true, synced: false };
  },

  // Xóa 1 ghi chú theo ID đơn lẻ (Atomic Delete)
  async deleteSingleNote(id: string): Promise<{ success: boolean; synced: boolean }> {
    // 1. Xóa khỏi bộ nhớ máy cục bộ
    const currentNotes = await this.loadFromLocalCache();
    const filtered = currentNotes.filter((n) => n.id !== id);
    await this.saveToLocalCache(filtered);

    // 2. Thử gọi API DELETE
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const headers = await AuthService.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE',
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        return { success: true, synced: true };
      }
    } catch {
      // API lỗi hoặc offline
    }

    // Thêm vào hàng đợi chờ đồng bộ bù
    await this.enqueuePendingAction({ type: 'DELETE', id, timestamp: Date.now() });
    return { success: true, synced: false };
  },


  // Lưu tương thích ngược cho danh sách mảng (gọi saveNotes)
  async saveNotes(notes: Note[]): Promise<void> {
    await this.saveToLocalCache(notes);
    await this.batchSync(notes);
  },

  // KHÔI PHỤC GHI CHÚ MẪU CHỈ TRÊN THIẾT BỊ NÀY (Tuyệt đối không xóa MySQL)
  async resetLocalSampleNotes(): Promise<Note[]> {
    await this.saveToLocalCache(INITIAL_NOTES);
    // Xóa hàng đợi pending để tránh đẩy dữ liệu rác
    await this.clearPendingActions();
    return INITIAL_NOTES;
  },

  // Đồng bộ hàng loạt an toàn
  async batchSync(notes: Note[]): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${API_BASE_URL}/notes/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notes),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  },

  // Kiểm tra sức khỏe server & MySQL
  async checkServerHealth(): Promise<{ online: boolean; dbReady: boolean }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return { online: true, dbReady: Boolean(data.databaseReady) };
      }
      return { online: false, dbReady: false };
    } catch {
      return { online: false, dbReady: false };
    }
  },

  // Đồng bộ bù hàng đợi pending actions
  async syncPendingQueue(): Promise<void> {
    const queue = await this.getPendingActions();
    if (queue.length === 0) return;

    const remainingActions: PendingAction[] = [];

    for (const action of queue) {
      try {
        if (action.type === 'SAVE') {
          const res = await fetch(`${API_BASE_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action.note),
          });
          if (!res.ok) remainingActions.push(action);
        } else if (action.type === 'DELETE') {
          const res = await fetch(`${API_BASE_URL}/notes/${action.id}`, {
            method: 'DELETE',
          });
          if (!res.ok) remainingActions.push(action);
        }
      } catch {
        remainingActions.push(action);
      }
    }

    await this.savePendingActions(remainingActions);
  },

  // Quản lý hàng đợi thao tác chờ đồng bộ
  async enqueuePendingAction(action: PendingAction): Promise<void> {
    const queue = await this.getPendingActions();
    // Loại bỏ action trùng lặp id nếu có để tối ưu
    const filtered = queue.filter((a) => {
      if (a.type === 'DELETE' && action.type === 'DELETE' && a.id === action.id) return false;
      if (a.type === 'SAVE' && action.type === 'SAVE' && a.note.id === action.note.id) return false;
      return true;
    });
    filtered.push(action);
    await this.savePendingActions(filtered);
  },

  async getPendingActions(): Promise<PendingAction[]> {
    try {
      let raw: string | null = null;
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        raw = window.localStorage.getItem(PENDING_QUEUE_KEY);
      } else {
        raw = await AsyncStorage.getItem(PENDING_QUEUE_KEY);
      }
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async hasPendingActions(): Promise<boolean> {
    const queue = await this.getPendingActions();
    return queue.length > 0;
  },

  async savePendingActions(queue: PendingAction[]): Promise<void> {
    try {
      const json = JSON.stringify(queue);
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(PENDING_QUEUE_KEY, json);
      }
      await AsyncStorage.setItem(PENDING_QUEUE_KEY, json);
    } catch {
      // Bỏ qua lỗi cache
    }
  },

  async clearPendingActions(): Promise<void> {
    await this.savePendingActions([]);
  },

  // Bộ nhớ đệm cục bộ (Local Cache)
  async saveToLocalCache(notes: Note[]): Promise<void> {
    try {
      const json = JSON.stringify(notes);
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, json);
      }
      await AsyncStorage.setItem(STORAGE_KEY, json);
    } catch (err) {
      console.error('Lỗi khi lưu cache cục bộ:', err);
    }
  },

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
      console.error('Lỗi khi đọc cache cục bộ:', err);
      return INITIAL_NOTES;
    }
  },

  // --- Quản lý mã PIN bảo mật do người dùng tự đặt ---

  // Kiểm tra người dùng đã đặt PIN chưa
  async hasUserPin(): Promise<boolean> {
    try {
      let val: string | null = null;
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        val = window.localStorage.getItem(USER_PIN_KEY);
      } else {
        val = await AsyncStorage.getItem(USER_PIN_KEY);
      }
      return val !== null && val.length === 4;
    } catch {
      return false;
    }
  },

  // Lấy mã PIN đã lưu (null nếu chưa có)
  async getUserPin(): Promise<string | null> {
    try {
      let val: string | null = null;
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        val = window.localStorage.getItem(USER_PIN_KEY);
      } else {
        val = await AsyncStorage.getItem(USER_PIN_KEY);
      }
      return val;
    } catch {
      return null;
    }
  },

  // Lưu mã PIN người dùng đặt
  async setUserPin(pin: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(USER_PIN_KEY, pin);
      }
      await AsyncStorage.setItem(USER_PIN_KEY, pin);
    } catch (err) {
      console.error('Lỗi khi lưu mã PIN:', err);
    }
  },
};
