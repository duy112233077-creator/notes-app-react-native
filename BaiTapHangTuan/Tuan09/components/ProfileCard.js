import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function ProfileCard({ isLargeScreen = false }) {
  const handleEditProfile = () => {
    Alert.alert('Chỉnh sửa hồ sơ', 'Mở giao diện cập nhật thông tin cá nhân sinh viên.');
  };

  const handleShareProfile = () => {
    Alert.alert('Chia sẻ hồ sơ', 'Sao chép liên kết hồ sơ sinh viên thành công!');
  };

  return (
    <View style={[styles.cardContainer, isLargeScreen && styles.cardContainerLarge]}>
      {/* Banner trang trí phía trên */}
      <View style={[styles.headerBanner, isLargeScreen && styles.headerBannerLarge]}>
        <View style={styles.badgeMember}>
          <Text style={styles.badgeMemberText}>PRO MEMBER</Text>
        </View>
      </View>

      {/* Vùng Avatar và Thông tin chính */}
      <View style={styles.profileBody}>
        {/* Avatar với vòng bao quanh và badge trực tuyến */}
        <View style={styles.avatarWrapper}>
          <View style={[styles.avatarCircle, isLargeScreen && styles.avatarCircleLarge]}>
            <Text style={[styles.avatarEmoji, isLargeScreen && styles.avatarEmojiLarge]}>
              👨‍💻
            </Text>
          </View>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
          </View>
        </View>

        {/* Họ tên và Chức danh */}
        <Text style={[styles.userName, isLargeScreen && styles.userNameLarge]}>
          Bùi Quang Duy
        </Text>
        <Text style={styles.userRole}>Mobile & Fullstack Developer</Text>
        <Text style={styles.userOrg}>Khoa CNTT • SPKT Hưng Yên (UTEHY)</Text>
        <Text style={styles.userMssv}>MSSV: 11223077 • Lớp 12325W.3</Text>

        {/* Thẻ tags chuyên ngành */}
        <View style={styles.tagsRow}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>⚛️ React Native</Text>
          </View>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>🎨 UI/UX Flexbox</Text>
          </View>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>📱 Expo Go</Text>
          </View>
        </View>

        {/* Khối thống kê chỉ số (Stats Row - Flexbox Layout) */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>48</Text>
            <Text style={styles.statLabel}>Ghi chú</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Thư mục</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>98.5%</Text>
            <Text style={styles.statLabel}>Tiến độ</Text>
          </View>
        </View>

        {/* Các nút bấm thao tác tương tác */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleEditProfile}
            activeOpacity={0.75}
          >
            <Text style={styles.primaryBtnText}>✏️ Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleShareProfile}
            activeOpacity={0.75}
          >
            <Text style={styles.secondaryBtnText}>🔗 Chia sẻ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  cardContainerLarge: {
    borderRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  headerBanner: {
    height: 85,
    backgroundColor: '#1E40AF',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 12,
  },
  headerBannerLarge: {
    height: 110,
    padding: 16,
  },
  badgeMember: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeMemberText: {
    color: '#78350F',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  profileBody: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginTop: -45,
    marginBottom: 10,
  },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#EEF2FF',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarCircleLarge: {
    width: 104,
    height: 104,
    borderRadius: 52,
    marginTop: -55,
  },
  avatarEmoji: {
    fontSize: 42,
  },
  avatarEmojiLarge: {
    fontSize: 52,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
    textAlign: 'center',
  },
  userNameLarge: {
    fontSize: 22,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 3,
    textAlign: 'center',
  },
  userOrg: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 2,
    textAlign: 'center',
  },
  userMssv: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 12,
    textAlign: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  tagBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  statsContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
  },
  actionsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  primaryBtn: {
    flex: 2,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
});
