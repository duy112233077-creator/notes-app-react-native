import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/notes/EmptyState';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteEditorModal } from '@/components/notes/NoteEditorModal';
import { SearchBar } from '@/components/notes/SearchBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { NoteStorage } from '@/services/storage';
import { Note, NoteCategory } from '@/types/note';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];
  const safeAreaInsets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Responsive breakpoints
  const isDesktop = width >= 860;
  const isTablet = width >= 600 && width < 860;
  const numColumns = isDesktop ? 3 : isTablet ? 2 : 1;

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  // Modal editor state
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    const data = await NoteStorage.getNotes();
    setNotes(data);
    setLoading(false);
  };

  // Lưu và cập nhật danh sách
  const saveAndSyncNotes = async (newNotes: Note[]) => {
    setNotes(newNotes);
    await NoteStorage.saveNotes(newNotes);
  };

  // Thêm hoặc sửa ghi chú
  const handleSaveNote = async (data: {
    id?: string;
    title: string;
    content: string;
    category: NoteCategory;
    colorId: string;
    isPinned: boolean;
  }) => {
    const now = new Date().toISOString();
    if (data.id) {
      // Chỉnh sửa
      const updated = notes.map((n) =>
        n.id === data.id
          ? {
              ...n,
              title: data.title,
              content: data.content,
              category: data.category,
              colorId: data.colorId,
              isPinned: data.isPinned,
              updatedAt: now,
            }
          : n
      );
      await saveAndSyncNotes(updated);
    } else {
      // Thêm mới
      const newNote: Note = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: data.title,
        content: data.content,
        category: data.category,
        colorId: data.colorId,
        isPinned: data.isPinned,
        createdAt: now,
        updatedAt: now,
      };
      await saveAndSyncNotes([newNote, ...notes]);
    }
  };

  // Xóa ghi chú
  const handleDeleteNote = async (id: string) => {
    const filtered = notes.filter((n) => n.id !== id);
    await saveAndSyncNotes(filtered);
  };

  // Đổi trạng thái ghim
  const handleTogglePin = async (id: string) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() } : n
    );
    await saveAndSyncNotes(updated);
  };

  // Lọc ghi chú theo tìm kiếm & thể loại
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchCategory =
        selectedCategory === 'Tất cả' || note.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query);
      return matchCategory && matchQuery;
    });
  }, [notes, selectedCategory, searchQuery]);

  const pinnedNotes = useMemo(
    () => filteredNotes.filter((n) => n.isPinned),
    [filteredNotes]
  );
  const otherNotes = useMemo(
    () => filteredNotes.filter((n) => !n.isPinned),
    [filteredNotes]
  );

  // Mở modal tạo mới
  const openCreateModal = () => {
    setEditingNote(null);
    setIsEditorVisible(true);
  };

  // Mở modal chỉnh sửa
  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setIsEditorVisible(true);
  };

  // Render lưới nhiều cột cho desktop/tablet
  const renderNoteColumns = (items: Note[]) => {
    if (numColumns === 1) {
      return items.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={openEditModal}
          onDelete={handleDeleteNote}
          onTogglePin={handleTogglePin}
        />
      ));
    }

    // Chia đều items vào các cột
    const columns: Note[][] = Array.from({ length: numColumns }, () => []);
    items.forEach((item, index) => {
      columns[index % numColumns].push(item);
    });

    return (
      <View style={styles.gridContainer}>
        {columns.map((col, colIdx) => (
          <View key={colIdx} style={styles.gridColumn}>
            {col.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEditModal}
                onDelete={handleDeleteNote}
                onTogglePin={handleTogglePin}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: Math.max(safeAreaInsets.top, Spacing.four),
            paddingBottom: safeAreaInsets.bottom + 90,
          },
        ]}>
        <View style={styles.mainWrapper}>
          {/* Header thanh tiêu đề */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerTitleRow}>
                <View style={styles.logoIcon}>
                  <Ionicons name="document-text" size={22} color="#FFFFFF" />
                </View>
                <ThemedText style={styles.appName}>Ghi Chú</ThemedText>
              </View>
              <ThemedText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {notes.length} ghi chú • {notes.filter((n) => n.isPinned).length} đã ghim
              </ThemedText>
            </View>

            <Pressable
              onPress={openCreateModal}
              style={({ pressed }) => [
                styles.addNoteBtn,
                { backgroundColor: '#2563EB' },
                pressed && { opacity: 0.85 },
              ]}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <ThemedText style={styles.addBtnText}>Thêm ghi chú</ThemedText>
            </Pressable>
          </View>

          {/* Thanh tìm kiếm & bộ lọc */}
          <View style={styles.searchSection}>
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </View>

          {/* Nội dung danh sách */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <ThemedText style={{ marginTop: 12, color: colors.textSecondary }}>
                Đang tải ghi chú...
              </ThemedText>
            </View>
          ) : filteredNotes.length === 0 ? (
            <EmptyState
              isSearch={searchQuery.length > 0 || selectedCategory !== 'Tất cả'}
              onAction={() => {
                if (searchQuery.length > 0 || selectedCategory !== 'Tất cả') {
                  setSearchQuery('');
                  setSelectedCategory('Tất cả');
                } else {
                  openCreateModal();
                }
              }}
            />
          ) : (
            <View style={styles.listContainer}>
              {/* Khu vực ghi chú đã ghim */}
              {pinnedNotes.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="pin" size={16} color="#EAB308" />
                    <ThemedText style={styles.sectionTitle}>ĐÃ GHIM</ThemedText>
                    <View
                      style={[
                        styles.countBadge,
                        { backgroundColor: isDark ? '#2E3440' : '#E2E8F0' },
                      ]}>
                      <ThemedText style={styles.countText}>{pinnedNotes.length}</ThemedText>
                    </View>
                  </View>
                  {renderNoteColumns(pinnedNotes)}
                </View>
              )}

              {/* Khu vực tất cả ghi chú còn lại */}
              {otherNotes.length > 0 && (
                <View style={styles.section}>
                  {pinnedNotes.length > 0 && (
                    <View style={styles.sectionHeader}>
                      <Ionicons
                        name="albums-outline"
                        size={16}
                        color={colors.textSecondary}
                      />
                      <ThemedText style={styles.sectionTitle}>
                        {selectedCategory === 'Tất cả'
                          ? 'GHI CHÚ KHÁC'
                          : selectedCategory.toUpperCase()}
                      </ThemedText>
                      <View
                        style={[
                          styles.countBadge,
                          { backgroundColor: isDark ? '#2E3440' : '#E2E8F0' },
                        ]}>
                        <ThemedText style={styles.countText}>{otherNotes.length}</ThemedText>
                      </View>
                    </View>
                  )}
                  {renderNoteColumns(otherNotes)}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Nút FAB thêm nhanh trên điện thoại */}
      {!isDesktop && (
        <Pressable
          onPress={openCreateModal}
          style={({ pressed }) => [
            styles.fab,
            { backgroundColor: '#2563EB', bottom: safeAreaInsets.bottom + 85 },
            pressed && { opacity: 0.9, transform: [{ scale: 0.95 }] },
          ]}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </Pressable>
      )}

      {/* Modal biên tập ghi chú */}
      <NoteEditorModal
        visible={isEditorVisible}
        noteToEdit={editingNote}
        onClose={() => setIsEditorVisible(false)}
        onSave={handleSaveNote}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  mainWrapper: {
    width: '100%',
    maxWidth: 1060,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  headerLeft: {
    gap: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  addNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
      } as any,
      default: {
        elevation: 3,
      },
    }),
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  searchSection: {
    marginBottom: Spacing.four,
  },
  loadingContainer: {
    paddingVertical: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    gap: Spacing.four,
  },
  section: {
    gap: Spacing.two,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.two,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    opacity: 0.7,
  },
  countBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  gridColumn: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
        cursor: 'pointer',
      } as any,
      default: {
        elevation: 6,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
    }),
  },
});
