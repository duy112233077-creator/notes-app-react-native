import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { User } from '@/types/note';

interface UserAccountMenuProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenEditProfile: () => void;
  onOpenChangePassword: () => void;
  onLogout: () => void;
}

export const UserAccountMenu: React.FC<UserAccountMenuProps> = ({
  currentUser,
  onOpenAuth,
  onOpenEditProfile,
  onOpenChangePassword,
  onLogout,
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <View style={styles.wrapper}>
      {/* Collapsed Compact Trigger Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.triggerBtn,
          {
            backgroundColor: currentUser
              ? isDark
                ? '#1E293B'
                : '#EFF6FF'
              : isDark
                ? '#272B35'
                : '#F1F5F9',
            borderColor: currentUser ? 'rgba(37, 99, 235, 0.3)' : 'transparent',
          },
        ]}
        onPress={() => {
          if (!currentUser) {
            onOpenAuth();
          } else {
            toggleMenu();
          }
        }}>
        {currentUser ? (
          currentUser.avatar ? (
            <Image source={{ uri: currentUser.avatar }} style={styles.triggerAvatar} />
          ) : (
            <View style={styles.triggerInitialsBg}>
              <Text style={styles.triggerInitialsText}>
                {currentUser.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )
        ) : (
          <Ionicons name="person-circle-outline" size={20} color={colors.textSecondary} />
        )}

        <Text style={[styles.triggerText, { color: currentUser ? '#2563EB' : colors.text }]}>
          {currentUser ? currentUser.name : 'Tài khoản người dùng'}
        </Text>

        <Ionicons
          name={menuOpen ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={currentUser ? '#2563EB' : colors.textSecondary}
          style={{ marginLeft: 2 }}
        />
      </TouchableOpacity>

      {/* Dropdown Menu Overlay & Content */}
      {menuOpen && currentUser && (
        <Modal transparent animationType="fade" visible={menuOpen} onRequestClose={closeMenu}>
          <Pressable style={styles.modalOverlay} onPress={closeMenu}>
            <View
              style={[
                styles.dropdownCard,
                {
                  backgroundColor: colors.backgroundElement,
                  borderColor: isDark ? '#334155' : 'rgba(200, 200, 200, 0.4)',
                },
              ]}
              onStartShouldSetResponder={() => true}>
              {/* Profile Header */}
              <View style={styles.profileHeader}>
                {currentUser.avatar ? (
                  <Image source={{ uri: currentUser.avatar }} style={styles.dropdownAvatar} />
                ) : (
                  <View style={styles.dropdownInitialsBg}>
                    <Text style={styles.dropdownInitialsText}>
                      {currentUser.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.dropdownName, { color: colors.text }]} numberOfLines={1}>
                    {currentUser.name}
                  </Text>
                  <Text style={[styles.dropdownEmail, { color: colors.textSecondary }]} numberOfLines={1}>
                    {currentUser.email}
                  </Text>
                  <View style={styles.syncBadge}>
                    <Ionicons name="checkmark-circle" size={12} color="#16A34A" />
                    <Text style={styles.syncBadgeText}>Đã xác thực MySQL</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Action 1: Edit Profile */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  onOpenEditProfile();
                }}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(37, 99, 235, 0.1)' }]}>
                  <Ionicons name="create-outline" size={16} color="#2563EB" />
                </View>
                <Text style={[styles.menuItemText, { color: colors.text }]}>Chỉnh sửa thông tin</Text>
              </TouchableOpacity>

              {/* Action 2: Change Avatar */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  onOpenEditProfile();
                }}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
                  <Ionicons name="camera-outline" size={16} color="#A855F7" />
                </View>
                <Text style={[styles.menuItemText, { color: colors.text }]}>Thay đổi ảnh đại diện</Text>
              </TouchableOpacity>

              {/* Action 3: Change Password */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  onOpenChangePassword();
                }}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(234, 179, 8, 0.1)' }]}>
                  <Ionicons name="key-outline" size={16} color="#D97706" />
                </View>
                <Text style={[styles.menuItemText, { color: colors.text }]}>Thay đổi mật khẩu</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Action 4: Logout */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  onLogout();
                }}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                  <Ionicons name="log-out-outline" size={16} color="#EF4444" />
                </View>
                <Text style={[styles.menuItemText, { color: '#EF4444', fontWeight: '600' }]}>
                  Đăng xuất tài khoản
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 999,
  },
  triggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  triggerAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  triggerInitialsBg: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerInitialsText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  triggerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 65,
    paddingRight: 20,
  },
  dropdownCard: {
    width: 280,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    gap: 4,
  } as any,
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 8,
  },
  dropdownAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  dropdownInitialsBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownInitialsText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  dropdownName: {
    fontSize: 14,
    fontWeight: '700',
  },
  dropdownEmail: {
    fontSize: 11,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  syncBadgeText: {
    fontSize: 10,
    color: '#16A34A',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    marginVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 10,
  },
  menuIconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
