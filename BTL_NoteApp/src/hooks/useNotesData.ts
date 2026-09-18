import { useState, useEffect, useCallback } from 'react';
import { Note, NoteCategory, User, AuthSession, MediaAttachment } from '@/types/note';
import { NoteStorage } from '@/services/storage';
import { AuthService } from '@/services/authService';

export function useNotesData(showToast: (msg: string, type?: any, subMsg?: string) => void) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'offline' | 'syncing'>('syncing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setSyncStatus('syncing');

    const health = await NoteStorage.checkServerHealth();
    if (health.online && health.dbReady) {
      setSyncStatus('synced');
    } else {
      setSyncStatus('offline');
    }

    const session = await AuthService.getStoredSession();
    const user = session ? session.user : null;
    if (session) {
      setCurrentUser(session.user);
    } else {
      setCurrentUser(null);
    }

    let allNotes = await NoteStorage.getNotes();

    // Migrating unowned notes to user 'duy'
    let migrated = false;
    allNotes = allNotes.map((n) => {
      const isSample = ['note-1', 'note-2', 'note-3', 'note-4'].includes(n.id) || n.userId === 'sample';
      if (!isSample && !n.userId) {
        migrated = true;
        return { ...n, userId: 'duy' };
      }
      return n;
    });

    if (migrated) {
      await NoteStorage.saveToLocalCache(allNotes);
    }

    // Filter notes per user permissions
    let userNotes: Note[] = [];
    if (user) {
      const uId = user.id.toLowerCase();
      const uEmail = user.email.toLowerCase();
      const uName = user.name.toLowerCase();
      const isDuyAccount = uName.includes('duy') || uEmail.includes('duy') || uId === 'duy';

      userNotes = allNotes.filter((n) => {
        const isSample = ['note-1', 'note-2', 'note-3', 'note-4'].includes(n.id) || n.userId === 'sample';
        if (isSample) return true;

        const nOwner = (n.userId || '').toLowerCase();
        const isOwner =
          nOwner === uId ||
          nOwner === uEmail ||
          nOwner === uName ||
          (isDuyAccount && (nOwner === 'duy' || !nOwner));

        if (isOwner) return true;

        const isCollaborator = n.collaborators?.some(
          (c) => c.toLowerCase() === uEmail || c.toLowerCase() === uName || c.toLowerCase() === uId
        );

        return Boolean(isCollaborator);
      });
    } else {
      userNotes = allNotes.filter((n) => {
        const isSample = ['note-1', 'note-2', 'note-3', 'note-4'].includes(n.id) || n.userId === 'sample';
        const isDuyOrGuest = !n.userId || n.userId === 'duy' || n.userId === 'guest';
        return isSample || isDuyOrGuest;
      });
    }

    setNotes(userNotes);
    setLoading(false);
  }, []);

  const handleLoginSuccess = async (session: AuthSession) => {
    setCurrentUser(session.user);
    showToast(`Xin chào ${session.user.name}!`, 'success', 'Đã đăng nhập thành công.');
    await loadNotes();
  };

  const handleLogout = async () => {
    await AuthService.clearSession();
    setCurrentUser(null);
    showToast('Đã đăng xuất', 'info', 'Đã quay về chế độ ghi chú cá nhân.');
    await loadNotes();
  };

  const handleSaveNote = async (
    data: {
      id?: string;
      title: string;
      content: string;
      category: NoteCategory;
      colorId: string;
      isPinned: boolean;
      isLocked: boolean;
      attachments?: MediaAttachment[];
      reminderAt?: string;
      tags?: string[];
    },
    editingNote: Note | null
  ) => {
    const now = new Date().toISOString();
    const isUpdating = Boolean(data.id);
    const targetId = data.id || `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const noteToSave: Note = {
      id: targetId,
      userId: isUpdating && editingNote?.userId ? editingNote.userId : (currentUser ? currentUser.id : 'duy'),
      collaborators: isUpdating && editingNote ? editingNote.collaborators : [],
      shareCode: isUpdating && editingNote ? editingNote.shareCode : undefined,
      title: data.title,
      content: data.content,
      category: data.category,
      colorId: data.colorId,
      isPinned: data.isPinned,
      isLocked: data.isLocked,
      attachments: data.attachments,
      reminderAt: data.reminderAt,
      tags: data.tags,
      createdAt: isUpdating && editingNote ? editingNote.createdAt : now,
      updatedAt: now,
    };

    if (isUpdating) {
      setNotes((prev) => prev.map((n) => (n.id === targetId ? noteToSave : n)));
    } else {
      setNotes((prev) => [noteToSave, ...prev]);
    }

    const result = await NoteStorage.saveSingleNote(noteToSave);
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    await NoteStorage.logActivity(
      isUpdating ? 'SỬA' : 'THÊM',
      targetId,
      data.title,
      isUpdating ? `Đã cập nhật ghi chú "${data.title}"` : `Đã tạo ghi chú mới "${data.title}"`
    );

    if (result.synced) {
      setSyncStatus('synced');
      showToast(`Đã lưu lúc ${timeStr}`, 'success', 'Đã cập nhật trực tiếp vào MySQL.');
    } else {
      setSyncStatus('offline');
      showToast(`Đã lưu cục bộ lúc ${timeStr}`, 'info', 'Đã lưu trên máy. Sẽ đồng bộ bù khi kết nối.');
    }
  };

  const handleDeleteNote = async (id: string) => {
    const noteToDelete = notes.find((n) => n.id === id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    const result = await NoteStorage.deleteSingleNote(id);
    await NoteStorage.logActivity(
      'XÓA',
      id,
      noteToDelete?.title || 'Ghi chú',
      `Đã xóa ghi chú "${noteToDelete?.title || id}"`
    );
    if (result.synced) {
      showToast('Đã xóa ghi chú', 'success', 'Đã xóa khỏi MySQL.');
    } else {
      showToast('Đã xóa khỏi máy', 'info', 'Sẽ xóa trên MySQL khi có kết nối.');
    }
  };

  const handleTogglePin = async (id: string) => {
    const target = notes.find((n) => n.id === id);
    if (!target) return;

    const updated: Note = {
      ...target,
      isPinned: !target.isPinned,
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    const result = await NoteStorage.saveSingleNote(updated);

    showToast(
      updated.isPinned ? '📌 Đã ghim ghi chú lên đầu' : 'Đã bỏ ghim ghi chú',
      'info',
      result.synced ? 'Đã đồng bộ MySQL' : 'Lưu cục bộ'
    );
  };

  const handleUpdateNoteShare = async (selectedShareNote: Note | null, shareCode: string, collaborators: string[]) => {
    if (!selectedShareNote) return;
    const updated: Note = {
      ...selectedShareNote,
      shareCode,
      collaborators,
    };
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    await NoteStorage.saveSingleNote(updated);
    await NoteStorage.logActivity(
      'CHIA SẺ',
      updated.id,
      updated.title,
      `Đã chia sẻ ghi chú với ${collaborators.length} thành viên (Mã: ${shareCode})`
    );
  };

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    notes,
    loading,
    syncStatus,
    currentUser,
    loadNotes,
    handleLoginSuccess,
    handleLogout,
    handleSaveNote,
    handleDeleteNote,
    handleTogglePin,
    handleUpdateNoteShare,
  };
}
