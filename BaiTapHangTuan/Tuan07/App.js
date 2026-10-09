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

// Import các components luyện tập thực hành và lý thuyết
import BaiTap1_ControlledInput from './components/BaiTap1_ControlledInput';
import BaiTap2_UserProfileList from './components/BaiTap2_UserProfileList';
import BaiTap3_RegisterForm from './components/BaiTap3_RegisterForm';
import LyThuyetView from './components/LyThuyetView';

export default function App() {
  // Quản lý tab lọc bài tập (all | ex1 | ex2 | ex3 | theory)
  const [activeTab, setActiveTab] = useState('all');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1D4ED8" />

      {/* Header chính của ứng dụng */}
      <View style={styles.header}>
        <View style={styles.badgeTop}>
          <Text style={styles.badgeTopText}>REACT NATIVE • TUẦN 07</Text>
        </View>
        <Text style={styles.headerTitle}>Controlled Components & Lifecycle</Text>
        <Text style={styles.headerSubtitle}>
          Sinh viên: Bùi Quang Duy - Lê Duy Linh • Lớp: 12325W.3
        </Text>
        <Text style={styles.headerMssv}>MSSV: 11223077 - 11223078</Text>
      </View>

      {/* Thanh điều hướng Tab chuyển bài tập */}
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
            <Text
              style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}
            >
              ⭐ Tất cả bài
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'ex1' && styles.tabButtonActive]}
            onPress={() => setActiveTab('ex1')}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabText, activeTab === 'ex1' && styles.tabTextActive]}
            >
              📝 Bài 1: Nhập Tên
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'ex2' && styles.tabButtonActive]}
            onPress={() => setActiveTab('ex2')}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabText, activeTab === 'ex2' && styles.tabTextActive]}
            >
              👥 Bài 2: Hồ Sơ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'ex3' && styles.tabButtonActive]}
            onPress={() => setActiveTab('ex3')}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabText, activeTab === 'ex3' && styles.tabTextActive]}
            >
              🔐 Bài 3: Form ĐK
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'theory' && styles.tabButtonActive]}
            onPress={() => setActiveTab('theory')}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabText, activeTab === 'theory' && styles.tabTextActive]}
            >
              📚 Lý Thuyết
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Nội dung danh sách các bài tập */}
      <ScrollView
        style={styles.contentScrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* TAB TẤT CẢ: HIỂN THỊ TOÀN BỘ CẢ 3 BÀI TẬP VÀ LÝ THUYẾT */}
        {activeTab === 'all' && (
          <>
            <View style={styles.sectionHeaderCard}>
              <Text style={styles.sectionHeaderTitle}>
                🚀 Tổng Hợp Toàn Bộ Bài Tập Tuần 07
              </Text>
              <Text style={styles.sectionHeaderDesc}>
                Bao gồm bài thực hành Controlled Input, Lồng Component Profile, Form Đăng Ký xác thực dữ liệu và 5 câu hỏi lý thuyết.
              </Text>
            </View>

            {/* Bài tập 1 */}
            <BaiTap1_ControlledInput />

            {/* Bài tập 2 */}
            <BaiTap2_UserProfileList />

            {/* Bài tập 3 */}
            <BaiTap3_RegisterForm />

            {/* Phần lý thuyết */}
            <LyThuyetView />
          </>
        )}

        {/* TAB BÀI 1: NHẬP HỌ TÊN VỚI CONTROLLED COMPONENT */}
        {activeTab === 'ex1' && (
          <View>
            <BaiTap1_ControlledInput />
          </View>
        )}

        {/* TAB BÀI 2: LỒNG COMPONENT DANH SÁCH HỒ SƠ NGƯỜI DÙNG */}
        {activeTab === 'ex2' && (
          <View>
            <BaiTap2_UserProfileList />
          </View>
        )}

        {/* TAB BÀI 3: FORM ĐĂNG KÝ VÀ VALIDATION */}
        {activeTab === 'ex3' && (
          <View>
            <BaiTap3_RegisterForm />
          </View>
        )}

        {/* TAB LÝ THUYẾT: TỔNG HỢP 5 CÂU HỎI ÔN TẬP */}
        {activeTab === 'theory' && (
          <View>
            <LyThuyetView />
          </View>
        )}

        {/* Chân trang thông tin sinh viên & bản quyền */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Báo cáo Bài tập Tuần 07 • Phát triển ứng dụng Di động đa nền tảng
          </Text>
          <Text style={styles.footerSubText}>
            Sinh viên thực hiện: Bùi Quang Duy - Lê Duy Linh • MSSV: 11223077
          </Text>
          <Text style={styles.footerVersion}>React Native 0.86 • Expo 57</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#1D4ED8',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  badgeTop: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  badgeTopText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#DBEAFE',
    fontSize: 13,
    fontWeight: '500',
  },
  headerMssv: {
    color: '#BFDBFE',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  contentScrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionHeaderDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  footerSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  footerVersion: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    fontFamily: 'monospace',
  },
});
