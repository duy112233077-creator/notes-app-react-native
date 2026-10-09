import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserProfile from './UserProfile';

/**
 * BÀI TẬP 2 – MỨC TRUNG BÌNH:
 * Màn hình danh sách hồ sơ người dùng bằng kỹ thuật Lồng Component (Component Nesting)
 * Cây component:
 * BaiTap2_UserProfileList (Cha)
 *    └── UserProfile (Con của Danh sách / Cha của Avatar)
 *           └── Avatar (Cháu / Con của UserProfile)
 */
const BaiTap2_UserProfileList = () => {
  // Dữ liệu danh sách người dùng mẫu (ít nhất 2 hồ sơ khác nhau theo đề bài)
  const usersList = [
    {
      id: 'usr_01',
      name: 'Bùi Quang Duy',
      bio: 'Nhóm trưởng • Đam mê phát triển ứng dụng di động đa nền tảng React Native và kiến trúc phần mềm.',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: 'Nhóm trưởng (11223077)',
      email: 'duy.bq@sinhvien.edu.vn',
      badgeColor: '#2563EB',
    },
    {
      id: 'usr_02',
      name: 'Lê Duy Linh',
      bio: 'Thành viên cốt lõi • Chuyên sâu về thiết kế UI/UX hiện đại, tối ưu trải nghiệm và quản lý State.',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      role: 'Thành viên (11223078)',
      email: 'linh.ld@sinhvien.edu.vn',
      badgeColor: '#7C3AED',
    },
    {
      id: 'usr_03',
      name: 'Nguyễn Văn Minh',
      bio: 'Lập trình viên Fullstack • Yêu thích công nghệ mới, hệ thống Backend Node.js và cơ sở dữ liệu SQLite.',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      role: 'Cộng tác viên',
      email: 'minh.nv@dev.vn',
      badgeColor: '#059669',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Tiêu đề phần bài tập */}
      <View style={styles.headerBox}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagBadgeText}>BÀI TẬP 2 • COMPONENT LỒNG COMPONENT</Text>
        </View>
        <Text style={styles.title}>Danh Sách Hồ Sơ Người Dùng</Text>
        <Text style={styles.subtitle}>
          Mô hình lồng ghép: <Text style={styles.codeText}>Screen</Text> ➔{' '}
          <Text style={styles.codeText}>UserProfile</Text> ➔{' '}
          <Text style={styles.codeText}>Avatar</Text>
        </Text>
      </View>

      {/* Render danh sách hồ sơ với vòng lặp map và truyền props */}
      {usersList.map((user) => (
        <UserProfile
          key={user.id}
          name={user.name}
          bio={user.bio}
          profileImage={user.profileImage}
          role={user.role}
          email={user.email}
          badgeColor={user.badgeColor}
        />
      ))}

      {/* Thẻ phân tích kiến trúc truyền dữ liệu và lợi ích */}
      <View style={styles.analysisCard}>
        <Text style={styles.analysisTitle}>
          🔍 Giải thích cơ chế truyền dữ liệu & Lợi ích:
        </Text>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletIcon}>1️⃣</Text>
          <Text style={styles.bulletText}>
            <Text style={styles.boldText}>Truyền dữ liệu qua Props:</Text> Dữ liệu chảy 1 chiều từ cha xuống con. Component cha truyền <Text style={styles.codeMini}>name, bio, profileImage</Text> vào <Text style={styles.codeMini}>UserProfile</Text>. Sau đó <Text style={styles.codeMini}>UserProfile</Text> tiếp tục truyền <Text style={styles.codeMini}>imageUrl, name</Text> vào component con <Text style={styles.codeMini}>Avatar</Text>.
          </Text>
        </View>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletIcon}>2️⃣</Text>
          <Text style={styles.bulletText}>
            <Text style={styles.boldText}>Tính tái sử dụng cao:</Text> Component <Text style={styles.codeMini}>Avatar</Text> có thể được tái sử dụng độc lập ở Header, Comment, Chat mà không phụ thuộc vào <Text style={styles.codeMini}>UserProfile</Text>.
          </Text>
        </View>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletIcon}>3️⃣</Text>
          <Text style={styles.bulletText}>
            <Text style={styles.boldText}>Dễ quản lý & mở rộng:</Text> Khi muốn đổi kiểu bo góc của avatar hoặc thêm viền VIP, ta chỉ cần chỉnh sửa duy nhất file <Text style={styles.codeMini}>Avatar.js</Text>, toàn bộ ứng dụng sẽ tự động cập nhật đồng bộ.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  headerBox: {
    marginBottom: 8,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginBottom: 8,
  },
  tagBadgeText: {
    color: '#7C3AED',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#7C3AED',
    fontWeight: '700',
  },
  analysisCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  analysisTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#581C87',
    marginBottom: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletIcon: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    color: '#4C1D95',
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
  },
  codeMini: {
    fontFamily: 'monospace',
    backgroundColor: '#F3E8FF',
    color: '#6B21A8',
  },
});

export default BaiTap2_UserProfileList;
