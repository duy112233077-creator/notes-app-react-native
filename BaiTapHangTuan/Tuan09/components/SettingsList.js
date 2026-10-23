import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';

export default function SettingsList({ isLargeScreen = false }) {
  // State quản lý các công tắc Switch
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [soundNotif, setSoundNotif] = useState(true);

  // Xử lý các sự kiện click menu
  const handleItemPress = (title) => {
    Alert.alert('Cài đặt', `Bạn đã chọn mục: "${title}"`);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Xóa bộ nhớ đệm',
      'Bạn có chắc chắn muốn dọn dẹp 24.5 MB dữ liệu đệm tạm thời không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Dọn dẹp ngay',
          style: 'destructive',
          onPress: () => Alert.alert('Đã xóa thành công', 'Bộ nhớ đệm đã được giải phóng.'),
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất tài khoản',
      'Bạn có chắc muốn đăng xuất khỏi ứng dụng EduNotes không?',
      [
        { text: 'Ở lại', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: () => Alert.alert('Đã đăng xuất', 'Hẹn gặp lại bạn lần sau!'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* =========================================
          NHÓM 1: TÀI KHOẢN & BẢO MẬT
         ========================================= */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔒 TÀI KHOẢN & BẢO MẬT</Text>
      </View>
      <View style={[styles.cardGroup, isLargeScreen && styles.cardGroupLarge]}>
        {/* Item: Đổi mật khẩu */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleItemPress('Đổi mật khẩu')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
            <Text style={styles.iconEmoji}>🔑</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Đổi mật khẩu đăng nhập</Text>
            <Text style={styles.itemSubtitle}>Cập nhật lần cuối: 28 ngày trước</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.itemDivider} />

        {/* Item: Xác thực 2 bước (2FA) */}
        <View style={styles.settingItem}>
          <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
            <Text style={styles.iconEmoji}>🛡️</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Xác thực 2 bước (2FA)</Text>
            <Text style={styles.itemSubtitle}>Tăng cường an toàn qua mã OTP</Text>
          </View>
          <Switch
            value={twoFactorAuth}
            onValueChange={setTwoFactorAuth}
            trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
            thumbColor={twoFactorAuth ? '#2563EB' : '#F1F5F9'}
          />
        </View>

        <View style={styles.itemDivider} />

        {/* Item: Sinh trắc học */}
        <View style={styles.settingItem}>
          <View style={[styles.iconBox, { backgroundColor: '#FAF5FF' }]}>
            <Text style={styles.iconEmoji}>👁️</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Khóa sinh trắc học Face ID / Vân tay</Text>
            <Text style={styles.itemSubtitle}>Mở khóa ứng dụng siêu tốc</Text>
          </View>
          <Switch
            value={biometrics}
            onValueChange={setBiometrics}
            trackColor={{ false: '#CBD5E1', true: '#C084FC' }}
            thumbColor={biometrics ? '#9333EA' : '#F1F5F9'}
          />
        </View>
      </View>

      {/* =========================================
          NHÓM 2: GIAO DIỆN & TÙY BIẾN
         ========================================= */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🎨 GIAO DIỆN & TÙY BIẾN</Text>
      </View>
      <View style={[styles.cardGroup, isLargeScreen && styles.cardGroupLarge]}>
        {/* Item: Chế độ tối Dark Mode */}
        <View style={styles.settingItem}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.iconEmoji}>🌙</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Giao diện tối (Dark Mode)</Text>
            <Text style={styles.itemSubtitle}>Bảo vệ mắt khi học ban đêm</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#CBD5E1', true: '#FDE68A' }}
            thumbColor={darkMode ? '#D97706' : '#F1F5F9'}
          />
        </View>

        <View style={styles.itemDivider} />

        {/* Item: Cỡ chữ hiển thị */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleItemPress('Cỡ chữ hiển thị')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#F0FDFA' }]}>
            <Text style={styles.iconEmoji}>🔤</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Kích thước phông chữ</Text>
            <Text style={styles.itemSubtitle}>Đang chọn: Tiêu chuẩn (14px)</Text>
          </View>
          <Text style={styles.badgeValue}>Tiêu chuẩn</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.itemDivider} />

        {/* Item: Ngôn ngữ */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleItemPress('Ngôn ngữ')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
            <Text style={styles.iconEmoji}>🌐</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Ngôn ngữ hiển thị</Text>
            <Text style={styles.itemSubtitle}>Tiếng Việt (Vietnam)</Text>
          </View>
          <Text style={styles.badgeValue}>VIE</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* =========================================
          NHÓM 3: THÔNG BÁO & NHẮC NHỞ
         ========================================= */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔔 THÔNG BÁO & NHẮC NHỞ</Text>
      </View>
      <View style={[styles.cardGroup, isLargeScreen && styles.cardGroupLarge]}>
        {/* Item: Thông báo đẩy */}
        <View style={styles.settingItem}>
          <View style={[styles.iconBox, { backgroundColor: '#ECFEFF' }]}>
            <Text style={styles.iconEmoji}>📲</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Thông báo đẩy (Push Notifications)</Text>
            <Text style={styles.itemSubtitle}>Nhận lịch thi & nhắc việc học</Text>
          </View>
          <Switch
            value={pushNotif}
            onValueChange={setPushNotif}
            trackColor={{ false: '#CBD5E1', true: '#A5F3FC' }}
            thumbColor={pushNotif ? '#0891B2' : '#F1F5F9'}
          />
        </View>

        <View style={styles.itemDivider} />

        {/* Item: Âm thanh */}
        <View style={styles.settingItem}>
          <View style={[styles.iconBox, { backgroundColor: '#FDF2F8' }]}>
            <Text style={styles.iconEmoji}>🔊</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Âm thanh & Rung</Text>
            <Text style={styles.itemSubtitle}>Chuông báo khi có thông báo mới</Text>
          </View>
          <Switch
            value={soundNotif}
            onValueChange={setSoundNotif}
            trackColor={{ false: '#CBD5E1', true: '#FBCFE8' }}
            thumbColor={soundNotif ? '#DB2777' : '#F1F5F9'}
          />
        </View>
      </View>

      {/* =========================================
          NHÓM 4: HỆ THỐNG & ĐĂNG XUẤT
         ========================================= */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>⚙️ HỆ THỐNG & HỖ TRỢ</Text>
      </View>
      <View style={[styles.cardGroup, isLargeScreen && styles.cardGroupLarge]}>
        {/* Item: Dọn dẹp cache */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleClearCache}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
            <Text style={styles.iconEmoji}>🧹</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Dọn dẹp bộ nhớ đệm (Cache)</Text>
            <Text style={styles.itemSubtitle}>24.5 MB tệp tạm thời</Text>
          </View>
          <Text style={styles.actionClearText}>Dọn dẹp</Text>
        </TouchableOpacity>

        <View style={styles.itemDivider} />

        {/* Item: Thông tin phiên bản */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleItemPress('Phiên bản v1.0.9')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
            <Text style={styles.iconEmoji}>ℹ️</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Thông tin ứng dụng</Text>
            <Text style={styles.itemSubtitle}>EduNotes Mobile • UTEHY 2026</Text>
          </View>
          <Text style={styles.badgeVersion}>v1.0.9 (Build 26)</Text>
        </TouchableOpacity>
      </View>

      {/* Nút Đăng xuất nổi bật */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Đăng xuất khỏi thiết bị</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionHeader: {
    marginBottom: 8,
    marginTop: 14,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardGroupLarge: {
    borderRadius: 18,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 18,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 66,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '300',
    color: '#94A3B8',
    marginLeft: 8,
  },
  badgeValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeVersion: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  actionClearText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EA580C',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 20,
    marginBottom: 10,
    gap: 8,
  },
  logoutIcon: {
    fontSize: 18,
  },
  logoutText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#DC2626',
  },
});
