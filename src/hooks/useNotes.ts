import { useState } from 'react';
import { Note } from '../types/note';

// Dữ liệu mẫu ban đầu để phục vụ việc ghép nối và dựng UI ngay lập tức
const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: 'Học React Native & Expo',
    content: 'Ôn tập về Hooks (useState, useEffect), Components và Navigation với Expo Router.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Làm bài tập lớn Note App',
    content: 'Duy phụ trách Data & Logic (useNotes, AsyncStorage). Linh phụ trách UI & Navigation.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Làm trắc nghiệm LMS',
    content: 'Hoàn thành bài TNĐGTX01 và TNĐGTX02 trên hệ thống LMS.',
    createdAt: new Date().toISOString(),
  },
];

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);

  /**
   * Thêm một ghi chú mới
   * @param title Tiêu đề ghi chú
   * @param content Nội dung ghi chú
   * @returns Note mới nếu thêm thành công, null nếu cả tiêu đề và nội dung đều rỗng
   */
  const addNote = (title: string, content: string): Note | null => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    // Không cho phép tạo ghi chú hoàn toàn trống
    if (!trimmedTitle && !trimmedContent) {
      return null;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: trimmedTitle || 'Không có tiêu đề',
      content: trimmedContent,
      createdAt: new Date().toISOString(),
    };

    setNotes((prevNotes) => [newNote, ...prevNotes]);
    return newNote;
  };

  /**
   * Sửa một ghi chú hiện có theo id
   * @param id ID của ghi chú cần sửa
   * @param title Tiêu đề mới
   * @param content Nội dung mới
   */
  const editNote = (id: string, title: string, content: string): boolean => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    let found = false;
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === id) {
          found = true;
          return {
            ...note,
            title: trimmedTitle || 'Không có tiêu đề',
            content: trimmedContent,
          };
        }
        return note;
      })
    );

    return found;
  };

  /**
   * Xóa một ghi chú theo id
   * @param id ID của ghi chú cần xóa
   */
  const deleteNote = (id: string): void => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  /**
   * Tìm một ghi chú theo id
   * @param id ID của ghi chú
   */
  const getNoteById = (id: string): Note | undefined => {
    return notes.find((note) => note.id === id);
  };

  return {
    notes,
    addNote,
    editNote,
    deleteNote,
    getNoteById,
  };
}
