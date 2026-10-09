import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from './Avatar';

/**
 * COMPONENT CHA (TRONG MỐI QUAN HỆ VỚI AVATAR): UserProfile
 * Nhiệm vụ:
 * - Hiển thị thẻ hồ sơ người dùng đầy đủ
 * - Nhúng (lồng) component Avatar bên trong
 * - Truyền dữ liệu qua props: name, bio, profileImage
 *
 * @param {Object} props
 * @param {string} props.name - Tên người dùng
 * @param {string} props.bio - Mô tả ngắn / tiểu sử
 * @param {string} props.profileImage - URL ảnh đại diện
 * @param {string} [props.role] - Vai trò / chức danh (tùy chọn)
 * @param {string} [props.email] - Email liên hệ (tùy chọn)
 * @param {string} [props.badgeColor] - Màu sắc thẻ badge
 */
const UserProfile = ({
  name,
  bio,
  profileImage,
  role = 'Thành viên',
  email = '',
  badgeColor = '#2563EB',
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        {/* Lồng component Avatar và truyền props */}
        <Avatar
          imageUrl={profileImage}
          name={name}
          size={64}
          isOnline={true}
        />

        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {name}
            </Text>
            <View style={[styles.roleBadge, { backgroundColor: badgeColor + '18' }]}>
              <Text style={[styles.roleBadgeText, { color: badgeColor }]}>
                {role}
              </Text>
            </View>
          </View>

          {email ? (
            <Text style={styles.emailText} numberOfLines={1}>
              ✉️ {email}
            </Text>
          ) : null}

          <Text style={styles.bioText} numberOfLines={2}>
            {bio}
          </Text>
        </View>
      </View>

      {/* Thanh chân trang thẻ hồ sơ */}
      <View style={styles.footerRow}>
        <View style={styles.propsTag}>
          <Text style={styles.propsTagText}>Props: name, bio, profileImage</Text>
        </View>
        <TouchableOpacity style={styles.detailBtn}>
          <Text style={styles.detailBtnText}>Xem hồ sơ →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoSection: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emailText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  bioText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  footerRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  propsTag: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  propsTagText: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'monospace',
  },
  detailBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  detailBtnText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
});

export default UserProfile;
