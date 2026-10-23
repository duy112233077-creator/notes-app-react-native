import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

// Import các màn hình và components của Tuần 09
import BaiTap1_LoginScreen from './components/BaiTap1_LoginScreen';
import BaiTap2_ProfileSettings from './components/BaiTap2_ProfileSettings';
import LyThuyetView from './components/LyThuyetView';

export default function App() {
  // Quản lý tab lọc bài tập ('all' | 'login' | 'profile' | 'theory')
  const [activeTab, setActiveTab] = useState('all');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header chính của ứng dụng - Thông tin sinh viên */}
      <View style={styles.header}>
        <View style={styles.badgeTop}>
          <Text style={styles.badgeTopText}>REACT NATIVE • BÀI TẬP TUẦN 09</Text>
        </View>
        <Text style={styles.headerTitle}>StyleSheet, Flexbox Layout & Responsive UI</Text>
        <Text style={styles.headerSubtitle}>
          Sinh viên: Bùi Quang Duy - Lê Duy Linh • Lớp: 12325W.3
        </Text>
        <Text style={styles.headerMssv}>MSSV: 11223077 - 11223078 • SPKTHY (UTEHY)</Text>
      </View>

      {/* Thanh điều hướng Tab chuyển đổi các bài tập */}
      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'all' && styles.tabButtonActive]}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              ⭐ Toàn bộ bài nộp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'login' && styles.tabButtonActive]}
            onPress={() => setActiveTab('login')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>
              🔐 Bài 1: Login Screen (Dễ)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'profile' && styles.tabButtonActive]}
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>
              👤 Bài 2: Profile & Settings (TB)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'theory' && styles.tabButtonActive]}
            onPress={() => setActiveTab('theory')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'theory' && styles.tabTextActive]}>
              📖 Ôn tập lý thuyết (5 Câu)
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Vùng hiển thị nội dung theo Tab được chọn */}
      <View style={styles.bodyContent}>
        {activeTab === 'all' && (
          <ScrollView style={styles.allScrollContainer} showsVerticalScrollIndicator={false}>
            {/* Banner tóm tắt kết quả thực hiện tuần 9 */}
            <View style={styles.summaryBanner}>
              <Text style={styles.summaryTitle}>
                🚀 Tổng quan kết quả thực hiện Bài tập Tuần 09
              </Text>
              <Text style={styles.summaryDesc}>
                Bao gồm đầy đủ Bài tập 1 (Mức dễ: Thiết kế màn hình Login chuẩn StyleSheet.create với tiêu đề, 2 ô nhập, nút đăng nhập, forgot password, đủ 9 thuộc tính quy định) và Bài tập 2 (Mức trung bình: Clone giao diện Profile Card + Settings List chuẩn Flexbox, Responsive co giãn thích ứng tuyệt đẹp trên cả màn hình nhỏ và màn hình lớn).
              </Text>
            </View>

            {/* Mục 1: Bài tập 1 - Login Screen */}
            <View style={styles.sectionHeaderCard}>
              <Text style={styles.sectionBadge}>BÀI TẬP 1 (MỨC DỄ)</Text>
              <Text style={styles.sectionTitleText}>🔐 Màn hình Login chuẩn StyleSheet.create()</Text>
            </View>
            <View style={styles.nestedContainer}>
              <BaiTap1_LoginScreen />
            </View>

            {/* Mục 2: Bài tập 2 - Profile Card & Settings List */}
            <View style={styles.sectionHeaderCard}>
              <Text style={styles.sectionBadge}>BÀI TẬP 2 (MỨC TRUNG BÌNH)</Text>
              <Text style={styles.sectionTitleText}>👤 UI Clone: Profile Card & Settings List (Flexbox & Responsive)</Text>
            </View>
            <View style={[styles.nestedContainer, { minHeight: 700 }]}>
              <BaiTap2_ProfileSettings />
            </View>

            {/* Mục 3: Lý thuyết ôn tập */}
            <View style={styles.sectionHeaderCard}>
              <Text style={styles.sectionBadge}>PHẦN LÝ THUYẾT</Text>
              <Text style={styles.sectionTitleText}>📖 5 Chuyên đề ôn tập StyleSheet & Flexbox</Text>
            </View>
            <View style={[styles.nestedContainer, { minHeight: 500 }]}>
              <LyThuyetView />
            </View>

            <View style={{ height: 60 }} />
          </ScrollView>
        )}

        {activeTab === 'login' && <BaiTap1_LoginScreen />}

        {activeTab === 'profile' && <BaiTap2_ProfileSettings />}

        {activeTab === 'theory' && <LyThuyetView />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  badgeTop: {
    alignSelf: 'flex-start',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeTopText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 2,
  },
  headerMssv: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  tabBarContainer: {
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#334155',
  },
  tabButtonActive: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12.5,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bodyContent: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  allScrollContainer: {
    flex: 1,
    padding: 16,
  },
  summaryBanner: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1D4ED8',
    marginBottom: 6,
  },
  summaryDesc: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 19,
  },
  sectionHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  sectionBadge: {
    backgroundColor: '#0F172A',
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sectionTitleText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  nestedContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 16,
  },
});
