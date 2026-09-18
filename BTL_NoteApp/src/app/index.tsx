import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/notes/EmptyState';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteEditorModal } from '@/components/notes/NoteEditorModal';
import { PinModal } from '@/components/notes/PinModal';
import { SearchBar } from '@/components/notes/SearchBar';
import { AuthModal } from '@/components/AuthModal';
import { ShareModal } from '@/components/ShareModal';
import { ReminderAlertModal } from '@/components/ReminderAlertModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ToastConfig, ToastNotification, ToastType } from '@/components/ui/ToastNotification';
import { Colors, Spacing } from '@/constants/theme';
import { Note } from '@/types/note';
import { useNotesData } from '@/hooks/useNotesData';
import { useRealtimeReminders } from '@/hooks/useRealtimeReminders';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];
  const safeAreaInsets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 860;
  const isTablet = width >= 600 && width < 860;
  const numColumns = isDesktop ? 3 : isTablet ? 2 : 1;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [toast, setToast] = useState<ToastConfig | null>(null);

  const showToast = (message: string, type: ToastType = 'success', subMessage?: string) => {
    setToast({ message, type, subMessage });
  };

  const {
    notes,
    loading,
    syncStatus,
    currentUser,
    handleLoginSuccess,
    handleLogout,
    handleSaveNote,
    handleDeleteNote,
    handleTogglePin,
    handleUpdateNoteShare,
  } = useNotesData(showToast);

  const { reminderAlertNote, setReminderAlertNote } = useRealtimeReminders(notes);

  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedShareNote, setSelectedShareNote] = useState<Note | null>(null);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pendingUnlockNote, setPendingUnlockNote] = useState<Note | null>(null);
  const [pendingUnlockAction, setPendingUnlockAction] = useState<'edit' | 'delete' | null>(null);

  const handleOpenShare = (note: Note) => {
    setSelectedShareNote(note);
    setShareModalVisible(true);
  };

  const handleRequestUnlock = (note: Note, action: 'edit' | 'delete') => {
    setPendingUnlockNote(note);
    setPendingUnlockAction(action);
    setPinModalVisible(true);
  };

  const handlePinSuccess = () => {
    if (!pendingUnlockNote) return;
    if (pendingUnlockAction === 'edit') {
      openEditModal(pendingUnlockNote);
    } else if (pendingUnlockAction === 'delete') {
      handleDeleteNote(pendingUnlockNote.id);
    }
    setPendingUnlockNote(null);
    setPendingUnlockAction(null);
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setIsEditorVisible(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setIsEditorVisible(true);
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchCat =
        selectedCategory === 'Tất cả' || n.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.tags && n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCat && matchSearch;
    });
  }, [notes, searchQuery, selectedCategory]);

  const pinnedNotes = useMemo(() => filteredNotes.filter((n) => n.isPinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter((n) => !n.isPinned), [filteredNotes]);

  const renderNoteColumns = (list: Note[]) => {
    if (numColumns === 1) {
      return (
        <View style={styles.listContainer}>
          {list.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={openEditModal}
              onDelete={handleDeleteNote}
              onTogglePin={handleTogglePin}
              onRequestUnlock={handleRequestUnlock}
              onShare={handleOpenShare}
            />
          ))}
        </View>
      );
    }

    const columns: Note[][] = Array.from({ length: numColumns }, () => []);
    list.forEach((n, idx) => {
      columns[idx % numColumns].push(n);
    });

    return (
      <View style={styles.gridContainer}>
        {columns.map((colNotes, colIdx) => (
          <View key={colIdx} style={styles.gridColumn}>
            {colNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEditModal}
                onDelete={handleDeleteNote}
                onTogglePin={handleTogglePin}
                onRequestUnlock={handleRequestUnlock}
                onShare={handleOpenShare}
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
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.brandRow}>
                <ThemedText style={styles.headerTitle}>Note App</ThemedText>
                <View
                  style={[
                    styles.syncBadge,
                    {
                      backgroundColor:
                        syncStatus === 'synced'
                          ? isDark
                            ? 'rgba(16, 185, 129, 0.2)'
                            : '#DCFCE7'
                          : syncStatus === 'syncing'
                            ? isDark
                              ? 'rgba(59, 130, 246, 0.2)'
                              : '#DBEAFE'
                            : isDark
                              ? 'rgba(234, 179, 8, 0.2)'
                              : '#FEF9C3',
                    },
                  ]}>
                  <Ionicons
                    name={
                      syncStatus === 'synced'
                        ? 'checkmark-circle'
                        : syncStatus === 'syncing'
                          ? 'sync-circle'
                          : 'cloud-offline'
                    }
                    size={14}
                    color={
                      syncStatus === 'synced'
                        ? '#10B981'
                        : syncStatus === 'syncing'
                          ? '#2563EB'
                          : '#D97706'
                    }
                  />
                  <ThemedText
                    style={[
                      styles.syncBadgeText,
                      {
                        color:
                          syncStatus === 'synced'
                            ? isDark
                              ? '#34D399'
                              : '#15803D'
                            : syncStatus === 'syncing'
                              ? isDark
                                ? '#60A5FA'
                                : '#1D4ED8'
                              : isDark
                                ? '#FBBF24'
                                : '#B45309',
                      },
                    ]}>
                    {syncStatus === 'synced'
                      ? 'MySQL Online'
                      : syncStatus === 'syncing'
                        ? 'Đang kết nối...'
                        : 'Lưu bộ nhớ máy'}
                  </ThemedText>
                </View>
              </View>

              <ThemedText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Quản lý ghi chú cá nhân & đồng bộ bảo mật
              </ThemedText>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity
                style={[
                  styles.userAuthBtn,
                  {
                    backgroundColor: currentUser
                      ? isDark
                        ? '#1E2A3A'
                        : '#EFF6FF'
                      : isDark
                        ? '#272B35'
                        : '#F1F5F9',
                  },
                ]}
                onPress={() => setAuthModalVisible(true)}>
                <Ionicons
                  name={currentUser ? 'person-circle' : 'person-circle-outline'}
                  size={22}
                  color={currentUser ? '#2563EB' : colors.textSecondary}
                />
                <ThemedText style={[styles.userAuthText, { color: currentUser ? '#2563EB' : colors.text }]}>
                  {currentUser ? currentUser.name : 'Đăng nhập'}
                </ThemedText>
              </TouchableOpacity>

              <Pressable
                onPress={openCreateModal}
                style={({ pressed }) => [
                  styles.addNoteBtn,
                  { backgroundColor: '#2563EB' },
                  pressed && { opacity: 0.85 },
                ]}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <ThemedText style={styles.addBtnText}>Ghi chú mới</ThemedText>
              </Pressable>
            </View>
          </View>

          {/* Search bar */}
          <View style={styles.searchSection}>
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </View>

          {/* Content */}
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

              {otherNotes.length > 0 && (
                <View style={styles.section}>
                  {pinnedNotes.length > 0 && (
                    <View style={styles.sectionHeader}>
                      <Ionicons name="document-text-outline" size={16} color={colors.textSecondary} />
                      <ThemedText style={styles.sectionTitle}>GHI CHÚ KHÁC</ThemedText>
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

      {/* FAB button */}
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

      {/* Modals */}
      <NoteEditorModal
        visible={isEditorVisible}
        noteToEdit={editingNote}
        onClose={() => setIsEditorVisible(false)}
        onSave={(data) => handleSaveNote(data, editingNote)}
      />

      <PinModal
        visible={pinModalVisible}
        noteTitle={pendingUnlockNote?.title}
        actionLabel={pendingUnlockAction === 'delete' ? 'xóa ghi chú bảo mật' : 'mở khóa ghi chú'}
        onSuccess={handlePinSuccess}
        onClose={() => {
          setPinModalVisible(false);
          setPendingUnlockNote(null);
          setPendingUnlockAction(null);
        }}
      />

      <AuthModal
        visible={authModalVisible}
        currentUser={currentUser}
        onClose={() => setAuthModalVisible(false)}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      <ShareModal
        visible={shareModalVisible}
        note={selectedShareNote}
        onClose={() => setShareModalVisible(false)}
        onUpdateNoteShare={(shareCode, collaborators) => handleUpdateNoteShare(selectedShareNote, shareCode, collaborators)}
      />

      <ReminderAlertModal
        visible={!!reminderAlertNote}
        note={reminderAlertNote}
        onClose={() => setReminderAlertNote(null)}
        onOpenNote={(note) => {
          setEditingNote(note);
          setIsEditorVisible(true);
        }}
      />

      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
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
    paddingHorizontal: Spacing.four,
  },
  container: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
    gap: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  syncBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  userAuthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  userAuthText: {
    fontSize: 13,
    fontWeight: '600',
  },
  addNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
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
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
