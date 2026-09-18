import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Note, ActivityLog, DEFAULT_CATEGORIES } from '@/types/note';
import { API_BASE_URL } from '@/constants/config';
import { AuthService } from '@/services/authService';

const STORAGE_KEY = '@noteapp_notes_list_v1';
const PENDING_QUEUE_KEY = '@noteapp_pending_actions_v1';
const USER_PIN_KEY = '@noteapp_user_security_pin_v1';
const CUSTOM_CATEGORIES_KEY = '@noteapp_custom_categories_v1';
const ACTIVITY_LOGS_KEY = '@noteapp_activity_logs_v1';
const TRASH_KEY = '@noteapp_trash_notes_v1';

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
  // Lấy toàn bộ danh sách ghi chú (không bao gồm các ghi chú đã chuyển vào Thùng rác)
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
        const hasPending = await this.hasPendingActions();
        if (hasPending) {
          await this.syncPendingQueue();
        }

        const serverNotes: Note[] = await response.json();
        if (!Array.isArray(serverNotes)) return localNotes.filter((n) => !n.isDeleted);

        const serverMap = new Map<string, Note>(serverNotes.map((n) => [n.id, n]));
        const localMap  = new Map<string, Note>(localNotes.map((n) => [n.id, n]));
        const mergedMap = new Map<string, Note>();

        for (const [id, sNote] of serverMap) {
          const lNote = localMap.get(id);
          if (!lNote) {
            mergedMap.set(id, sNote);
          } else {
            const sTime = new Date(sNote.updatedAt || 0).getTime();
            const lTime = new Date(lNote.updatedAt || 0).getTime();
            mergedMap.set(id, lTime > sTime ? lNote : sNote);
          }
        }

        for (const [id, lNote] of localMap) {
          if (!serverMap.has(id)) {
            mergedMap.set(id, lNote);
          }
        }

        const merged = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
        );

        await this.saveToLocalCache(merged);
        return merged.filter((n) => !n.isDeleted);
      }
    } catch (apiErr) {
      // Offline fallback
    }

    return localNotes.filter((n) => !n.isDeleted);
  },

  // Lưu 1 ghi chú (Tạo mới hoặc Sửa)
  async saveSingleNote(note: Note): Promise<{ success: boolean; synced: boolean }> {
    const currentNotes = await this.loadFromLocalCache();
    const existingIndex = currentNotes.findIndex((n) => n.id === note.id);
    let updatedNotes: Note[];

    if (existingIndex >= 0) {
      updatedNotes = currentNotes.map((n) => (n.id === note.id ? note : n));
    } else {
      updatedNotes = [note, ...currentNotes];
    }
    await this.saveToLocalCache(updatedNotes);

    // Ghi nhận vết hoạt động
    await this.logActivity(
      existingIndex >= 0 ? 'SỬA' : 'THÊM',
      note.id,
      note.title,
      `Ghi chú "${note.title}" (${note.category || 'Khác'}) đã được lưu`
    );

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
      // API offline
    }

    await this.enqueuePendingAction({ type: 'SAVE', note, timestamp: Date.now() });
    return { success: true, synced: false };
  },

  // Chuyển ghi chú vào Thùng Rác (Soft Delete)
  async softDeleteNote(id: string): Promise<void> {
    const notes = await this.loadFromLocalCache();
    const target = notes.find((n) => n.id === id);
    if (!target) return;

    const updated: Note = {
      ...target,
      isDeleted: true,
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.saveSingleNote(updated);
    await this.logActivity('XÓA', id, target.title, `Ghi chú "${target.title}" đã được chuyển vào Thùng rác`);
  },

  // Khôi phục ghi chú từ Thùng Rác (Restore)
  async restoreNote(id: string): Promise<void> {
    const notes = await this.loadFromLocalCache();
    const target = notes.find((n) => n.id === id);
    if (!target) return;

    const updated: Note = {
      ...target,
      isDeleted: false,
      deletedAt: undefined,
      updatedAt: new Date().toISOString(),
    };

    await this.saveSingleNote(updated);
    await this.logActivity('KHÔI PHỤC', id, target.title, `Ghi chú "${target.title}" đã được khôi phục từ Thùng rác`);
  },

  // Lấy danh sách ghi chú trong Thùng Rác
  async getTrashNotes(): Promise<Note[]> {
    const notes = await this.loadFromLocalCache();
    return notes.filter((n) => n.isDeleted);
  },

  // Xóa vĩnh viễn ghi chú đơn lẻ (Atomic Delete)
  async deleteSingleNote(id: string): Promise<{ success: boolean; synced: boolean }> {
    const currentNotes = await this.loadFromLocalCache();
    const target = currentNotes.find((n) => n.id === id);
    const filtered = currentNotes.filter((n) => n.id !== id);
    await this.saveToLocalCache(filtered);

    if (target) {
      await this.logActivity('XÓA', id, target.title, `Đã xóa vĩnh viễn ghi chú "${target.title}"`);
    }

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
      // Offline
    }

    await this.enqueuePendingAction({ type: 'DELETE', id, timestamp: Date.now() });
    return { success: true, synced: false };
  },

  // Xóa sạch thùng rác
  async emptyTrash(): Promise<void> {
    const trash = await this.getTrashNotes();
    for (const note of trash) {
      await this.deleteSingleNote(note.id);
    }
  },

  // Save batch
  async saveNotes(notes: Note[]): Promise<void> {
    await this.saveToLocalCache(notes);
    await this.batchSync(notes);
  },

  // Reset sample notes
  async resetLocalSampleNotes(): Promise<Note[]> {
    await this.saveToLocalCache(INITIAL_NOTES);
    await this.clearPendingActions();
    return INITIAL_NOTES;
  },

  // Batch Sync
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

  // Check health
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

  // Pending queue sync
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

  async enqueuePendingAction(action: PendingAction): Promise<void> {
    const queue = await this.getPendingActions();
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
    } catch {}
  },

  async clearPendingActions(): Promise<void> {
    await this.savePendingActions([]);
  },

  // Cache Local
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

  // --- Quản lý Danh mục tùy chỉnh (Custom Categories) ---
  async getCustomCategories(): Promise<string[]> {
    try {
      let raw: string | null = null;
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        raw = window.localStorage.getItem(CUSTOM_CATEGORIES_KEY);
      } else {
        raw = await AsyncStorage.getItem(CUSTOM_CATEGORIES_KEY);
      }
      const list: string[] = raw ? JSON.parse(raw) : [];
      return list;
    } catch {
      return [];
    }
  },

  async addCustomCategory(catName: string): Promise<string[]> {
    const clean = catName.trim();
    if (!clean) return await this.getCustomCategories();
    const existing = await this.getCustomCategories();
    if (!existing.includes(clean)) {
      const updated = [...existing, clean];
      const json = JSON.stringify(updated);
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(CUSTOM_CATEGORIES_KEY, json);
      }
      await AsyncStorage.setItem(CUSTOM_CATEGORIES_KEY, json);
      return updated;
    }
    return existing;
  },

  // --- Quản lý Nhật ký Thao tác (Activity Logs) ---
  async getActivityLogs(): Promise<ActivityLog[]> {
    try {
      const headers = await AuthService.getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/activities`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          await this.saveLocalActivityLogs(data);
          return data;
        }
      }
    } catch {
      // Offline fallback
    }
    return await this.loadLocalActivityLogs();
  },

  async logActivity(
    action: ActivityLog['action'],
    noteId?: string,
    noteTitle?: string,
    details?: string
  ): Promise<void> {
    const session = await AuthService.getStoredSession();
    const userName = session ? session.user.name : 'Khách Vô Danh';
    const userEmail = session ? session.user.email : '';
    const userId = session ? session.user.id : undefined;
    const now = new Date().toISOString();

    const newLog: ActivityLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      userId,
      userName,
      userEmail,
      action,
      noteId,
      noteTitle,
      details: details || `Thao tác ${action} trên ghi chú ${noteTitle || ''}`,
      createdAt: now,
    };

    const localLogs = await this.loadLocalActivityLogs();
    const updated = [newLog, ...localLogs.slice(0, 99)];
    await this.saveLocalActivityLogs(updated);

    try {
      const headers = await AuthService.getAuthHeaders();
      await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newLog),
      });
    } catch {
      // API Offline
    }
  },

  async loadLocalActivityLogs(): Promise<ActivityLog[]> {
    try {
      let json: string | null = null;
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        json = window.localStorage.getItem(ACTIVITY_LOGS_KEY);
      } else {
        json = await AsyncStorage.getItem(ACTIVITY_LOGS_KEY);
      }
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  },

  async saveLocalActivityLogs(logs: ActivityLog[]): Promise<void> {
    try {
      const json = JSON.stringify(logs);
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(ACTIVITY_LOGS_KEY, json);
      }
      await AsyncStorage.setItem(ACTIVITY_LOGS_KEY, json);
    } catch {}
  },

  // --- Tính năng Sao Lưu & Khôi Phục Dữ Liệu (Backup & Restore JSON) ---
  async exportBackupJSON(): Promise<string> {
    const allNotes = await this.loadFromLocalCache();
    const customCategories = await this.getCustomCategories();
    const activityLogs = await this.loadLocalActivityLogs();

    const backupObj = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      appName: 'BTL NoteApp React Native',
      notesCount: allNotes.length,
      notes: allNotes,
      customCategories,
      activityLogs,
    };

    await this.logActivity('SAO LƯU', undefined, undefined, 'Đã xuất tệp sao lưu dữ liệu toàn bộ ứng dụng');
    return JSON.stringify(backupObj, null, 2);
  },

  async importBackupJSON(jsonStr: string): Promise<{ success: boolean; notesImported: number; message: string }> {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || !Array.isArray(parsed.notes)) {
        return { success: false, notesImported: 0, message: 'Định dạng tệp sao lưu không hợp lệ.' };
      }

      const importedNotes: Note[] = parsed.notes;
      await this.saveToLocalCache(importedNotes);

      if (Array.isArray(parsed.customCategories)) {
        for (const cat of parsed.customCategories) {
          await this.addCustomCategory(cat);
        }
      }

      // Đẩy tất cả ghi chú lên server MySQL nếu online
      await this.batchSync(importedNotes);
      await this.logActivity('KHÔI PHỤC', undefined, undefined, `Đã khôi phục ${importedNotes.length} ghi chú từ tệp sao lưu JSON`);

      return {
        success: true,
        notesImported: importedNotes.length,
        message: `Đã khôi phục thành công ${importedNotes.length} ghi chú từ tệp sao lưu!`,
      };
    } catch (err: any) {
      return { success: false, notesImported: 0, message: 'Lỗi khi khôi phục: ' + err.message };
    }
  },

  // --- Backup & Restore helpers ---
  async backupNotes(): Promise<{ success: boolean; message: string }> {
    try {
      const json = await this.exportBackupJSON();
      // On web, trigger download
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `noteapp_backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
      // Store to AsyncStorage as latest backup
      await AsyncStorage.setItem('@noteapp_backup_json_v1', json);
      return { success: true, message: 'Tệp sao lưu đã được tạo thành công.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Lỗi khi tạo sao lưu.' };
    }
  },

  async restoreNotes(): Promise<{ success: boolean; notesImported: number; message: string }> {
    try {
      const json = await AsyncStorage.getItem('@noteapp_backup_json_v1');
      if (!json) {
        return { success: false, notesImported: 0, message: 'Không tìm thấy tệp sao lưu. Hãy tạo sao lưu trước.' };
      }
      return this.importBackupJSON(json);
    } catch (err: any) {
      return { success: false, notesImported: 0, message: err.message || 'Lỗi khi khôi phục.' };
    }
  },

  // --- Quản lý mã PIN ---
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

