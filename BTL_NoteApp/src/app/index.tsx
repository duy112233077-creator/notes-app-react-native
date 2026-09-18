import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
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
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ToastConfig, ToastNotification, ToastType } from '@/components/ui/ToastNotification';
import { Colors, Spacing } from '@/constants/theme';
import { NoteStorage } from '@/services/storage';
import { AuthService } from '@/services/authService';
import { Note, NoteCategory, User, AuthSession, MediaAttachment } from '@/types/note';

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

  // Trạng thái đồng bộ: 'synced' (online & đã đồng bộ) | 'offline' (dùng bộ nhớ máy) | 'syncing' (đang kết nối)
  const [syncStatus, setSyncStatus] = useState<'synced' | 'offline' | 'syncing'>('syncing');

  // User Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  // Share Modal State
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedShareNote, setSelectedShareNote] = useState<Note | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<ToastConfig | null>(null);

  // Modal editor state
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Modal PIN bảo mật
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pendingUnlockNote, setPendingUnlockNote] = useState<Note | null>(null);
  const [pendingUnlockAction, setPendingUnlockAction] = useState<'edit' | 'delete' | null>(null);

  const showToast = (message: string, type: ToastType = 'success', subMessage?: string) => {
    setToast({ message, type, subMessage });
  };

  const formatCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Load user session & notes
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    const session = await AuthService.getStoredSession();
    if (session) {
      setCurrentUser(session.user);
    }
    await loadNotes();
  };

  const loadNotes = async () => {
    setLoading(true);
    setSyncStatus('syncing');

    const health = await NoteStorage.checkServerHealth();
    if (health.online && health.dbReady) {
      setSyncStatus('synced');
    } else {
      setSyncStatus('offline');
    }

    const data = await NoteStorage.getNotes();
    setNotes(data);
    setLoading(false);
  };

  // Auth Handlers
  const handleLoginSuccess = async (session: AuthSession) => {
    setCurrentUser(session.user);
    showToast(`Xin chào ${session.user.name}!`, 'success', 'Đã đăng nhập thành công.');
    await loadNotes();
  };

  const handleLogout = async () => {
    await AuthService.clearSession();
    setCurrentUser(null);
    setAuthModalVisible(false);
    showToast('Đã đăng xuất', 'info', 'Đã quay về chế độ ghi chú cá nhân.');
    await loadNotes();
  };

  // Thử đồng bộ lại
  const handleManualSync = async () => {
    setSyncStatus('syncing');
    showToast('Đang kết nối lại CSDL...', 'info');
    const health = await NoteStorage.checkServerHealth();
    if (health.online && health.dbReady) {
      await NoteStorage.syncPendingQueue();
      const fresh = await NoteStorage.getNotes();
      setNotes(fresh);
      setSyncStatus('synced');
      showToast('Đã kết nối MySQL thành công!', 'success', 'Dữ liệu đã được cập nhật đồng bộ.');
    } else {
      setSyncStatus('offline');
      showToast('Chưa kết nối được MySQL trên XAMPP', 'warning', 'Ứng dụng vẫn lưu an toàn trên bộ nhớ máy.');
    }
  };

  // Lưu ghi chú
  const handleSaveNote = async (data: {
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
  }) => {
    const now = new Date().toISOString();
    const isUpdating = Boolean(data.id);
    const targetId = data.id || `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const noteToSave: Note = {
      id: targetId,
      userId: currentUser ? currentUser.id : undefined,
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
    const timeStr = formatCurrentTime();

    if (result.synced) {
      setSyncStatus('synced');
      showToast(`Đã lưu lúc ${timeStr}`, 'success', 'Đã cập nhật trực tiếp vào MySQL.');
    } else {
      setSyncStatus('offline');
      showToast(`Đã lưu cục bộ lúc ${timeStr}`, 'info', 'Đã lưu trên máy. Sẽ đồng bộ bù khi kết nối.');
    }
  };

  // Xóa ghi chú
  const handleDeleteNote = async (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    const result = await NoteStorage.deleteSingleNote(id);
    if (result.synced) {
      showToast('Đã xóa ghi chú', 'success', 'Đã xóa khỏi MySQL.');
    } else {
      showToast('Đã xóa khỏi máy', 'info', 'Sẽ xóa trên MySQL khi có kết nối.');
    }
  };

  // Đổi ghim
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

  // Open Share Modal
  const handleOpenShare = (note: Note) => {
    setSelectedShareNote(note);
    setShareModalVisible(true);
  };

  const handleUpdateNoteShare = (shareCode: string, collaborators: string[]) => {
    if (!selectedShareNote) return;
    const updated: Note = {
      ...selectedShareNote,
      shareCode,
      collaborators,
    };
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    NoteStorage.saveSingleNote(updated);
  };

  // Unlock handlers
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

  // Search & Filter
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchCategory =
        selectedCategory === 'Tất cả' || note.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        note.title.toLowerCase().includes(query) ||
        (!note.isLocked && note.content.toLowerCase().includes(query));
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

  const openCreateModal = () => {
    setEditingNote(null);
    setIsEditorVisible(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setIsEditorVisible(true);
  };

  const renderNoteColumns = (items: Note[]) => {
    if (numColumns === 1) {
      return items.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={openEditModal}
          onDelete={handleDeleteNote}
          onTogglePin={handleTogglePin}
          onRequestUnlock={handleRequestUnlock}
          onShare={handleOpenShare}
        />
      ));
    }

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
        <View style={styles.mainWrapper}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerTitleRow}>
                <View style={styles.logoIcon}>
                  <Ionicons name="document-text" size={22} color="#FFFFFF" />
                </View>
                <ThemedText style={styles.appName}>Ghi Chú</ThemedText>

                {/* Status Badge */}
                <Pressable
                  onPress={handleManualSync}
                  hitSlop={6}
                  style={({ pressed }) => [
                    styles.syncBadge,
                    syncStatus === 'synced'
                      ? styles.syncBadgeOnline
                      : syncStatus === 'syncing'
                        ? styles.syncBadgeSyncing
                        : styles.syncBadgeOffline,
                    pressed && { opacity: 0.75 },
                  ]}>
                  <View
                    style={[
                      styles.syncDot,
                      {
                        backgroundColor:
                          syncStatus === 'synced'
                            ? '#10B981'
                            : syncStatus === 'syncing'
                              ? '#3B82F6'
                              : '#F59E0B',
                      },
                    ]}
                  />
                  <ThemedText
                    style={[
                      styles.syncBadgeText,
                      {
                        color:
                          syncStatus === 'synced'
                            ? '#059669'
                            : syncStatus === 'syncing'
                              ? '#2563EB'
                              : '#D97706',
                      },
                    ]}>
                    {syncStatus === 'synced'
                      ? 'Đã kết nối CSDL'
                      : syncStatus === 'syncing'
                        ? 'Đang kết nối...'
                        : 'Ngoại tuyến (Offline)'}
                  </ThemedText>
                  <Ionicons
                    name="refresh"
                    size={11}
                    color={
                      syncStatus === 'synced'
                        ? '#059669'
                        : syncStatus === 'syncing'
                          ? '#2563EB'
                          : '#D97706'
                    }
                  />
                </Pressable>
              </View>

              <ThemedText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {notes.length} ghi chú • {notes.filter((n) => n.isPinned).length} đã ghim •{' '}
                {notes.filter((n) => n.isLocked).length} đã khóa
              </ThemedText>
            </View>

            {/* Header Right: User Account Button & Add Note */}
            <View style={styles.headerRightGroup}>
              <TouchableOpacity
                style={styles.userAuthBtn}
                onPress={() => setAuthModalVisible(true)}>
                {currentUser ? (
                  <View style={styles.userAvatarBadge}>
                    <ThemedText style={styles.avatarLetter}>{currentUser.name.charAt(0).toUpperCase()}</ThemedText>
                  </View>
                ) : (
                  <View style={styles.loginBadge}>
                    <Ionicons name="person-circle-outline" size={24} color="#2563EB" />
                    <ThemedText style={styles.loginBadgeText}>Đăng nhập</ThemedText>
                  </View>
                )}

              </TouchableOpacity>

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

          {/* List Content */}
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
        onSave={handleSaveNote}
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
        onUpdateNoteShare={handleUpdateNoteShare}
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
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userAuthBtn: {
    padding: 2,
  },
  userAvatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  loginBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  loginBadgeText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 13,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
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
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1,
    marginLeft: 4,
  },
  syncBadgeOnline: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  syncBadgeOffline: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  syncBadgeSyncing: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  syncDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  syncBadgeText: {
    fontSize: 11,
    fontWeight: '700',
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
  },
});
