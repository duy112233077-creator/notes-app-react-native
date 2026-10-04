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

// Import các component luyện tập thực hành từ thư mục components
import Greeting from './components/Greeting';
import StudentInfo from './components/StudentInfo';
import CounterHook from './components/CounterHook';

export default function App() {
  // Quản lý tab lọc bài tập (all | ex1 | ex2 | ex3)
  const [activeTab, setActiveTab] = useState('all');

  // Danh sách sinh viên mẫu cho Bài tập 2
  const students = [
    {
      id: '1',
      name: 'Bùi Quang Duy',
      studentId: '11223077',
      className: 'Lớp 12325W.3',
      major: 'Công nghệ Thông tin',
      status: 'Trưởng nhóm',
    },
    {
      id: '2',
      name: 'Lê Duy Linh',
      studentId: '11223078',
      className: 'Lớp 12325W.3',
      major: 'Công nghệ Thông tin',
      status: 'Thành viên',
    },
    {
      id: '3',
      name: 'Nguyễn Văn A',
      studentId: '11223001',
      className: 'Lớp 12325W.1',
      major: 'Kỹ thuật Phần mềm',
      status: 'Đang học',
    },
    {
      id: '4',
      name: 'Trần Thị B',
      studentId: '11223002',
      className: 'Lớp 12325W.2',
      major: 'Hệ thống Thông tin',
      status: 'Đang học',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4338CA" />

      {/* Header chính của ứng dụng */}
      <View style={styles.header}>
        <View style={styles.badgeTop}>
          <Text style={styles.badgeTopText}>REACT NATIVE • TUẦN 06</Text>
        </View>
        <Text style={styles.headerTitle}>Luyện Tập Component & Hooks</Text>
        <Text style={styles.headerSubtitle}>
          Sinh viên: Bùi Quang Duy - Lê Duy Linh • Lớp: 12325W.3
        </Text>
      </View>

      {/* Thanh chuyển đổi bộ lọc bài tập */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'all' && styles.tabButtonActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              🌟 Tất cả bài
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'ex1' && styles.tabButtonActive]}
            onPress={() => setActiveTab('ex1')}
          >
            <Text style={[styles.tabText, activeTab === 'ex1' && styles.tabTextActive]}>
              Bài 1: Greeting
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'ex2' && styles.tabButtonActive]}
            onPress={() => setActiveTab('ex2')}
          >
            <Text style={[styles.tabText, activeTab === 'ex2' && styles.tabTextActive]}>
              Bài 2: StudentInfo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'ex3' && styles.tabButtonActive]}
            onPress={() => setActiveTab('ex3')}
          >
            <Text style={[styles.tabText, activeTab === 'ex3' && styles.tabTextActive]}>
              Bài 3: CounterHook
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Nội dung danh sách các bài tập */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* =========================================================================
            BÀI TẬP 1: COMPONENT GREETING (MỨC DỄ)
            Yêu cầu: Nhận prop 'name', hiển thị lời chào, dùng ít nhất 2 lần với 2 tên khác nhau.
           ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'ex1') && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionPill, { backgroundColor: '#10B981' }]}>
                <Text style={styles.sectionPillText}>BÀI TẬP 1</Text>
              </View>
              <Text style={styles.sectionTitle}>Component Greeting (Props)</Text>
            </View>
            <Text style={styles.sectionDesc}>
              Truyền dữ liệu từ component cha xuống con qua thuộc tính (prop `name`). Tái sử dụng component nhiều lần:
            </Text>

            {/* Gọi component Greeting lần 1 */}
            <Greeting name="Nguyễn Văn A" />

            {/* Gọi component Greeting lần 2 */}
            <Greeting name="Bùi Quang Duy" />

            {/* Gọi component Greeting lần 3 */}
            <Greeting name="Lê Duy Linh" />
          </View>
        )}

        {/* =========================================================================
            BÀI TẬP 2: COMPONENT STUDENTINFO (MỨC DỄ - TRUNG BÌNH)
            Yêu cầu: Hiển thị họ tên, lớp, ngành học; truyền qua props; hiển thị danh sách SV.
           ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'ex2') && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionPill, { backgroundColor: '#3B82F6' }]}>
                <Text style={styles.sectionPillText}>BÀI TẬP 2</Text>
              </View>
              <Text style={styles.sectionTitle}>Danh Sách Sinh Viên (StudentInfo)</Text>
            </View>
            <Text style={styles.sectionDesc}>
              Tổ chức giao diện thành các module nhỏ độc lập. Dữ liệu được render động qua danh sách đối tượng:
            </Text>

            {/* Hiển thị nhiều StudentInfo khác nhau qua phương thức map */}
            {students.map(item => (
              <StudentInfo
                key={item.id}
                name={item.name}
                studentId={item.studentId}
                className={item.className}
                major={item.major}
                status={item.status}
              />
            ))}
          </View>
        )}

        {/* =========================================================================
            BÀI TẬP 3: COMPONENT COUNTERHOOK (MỨC TRUNG BÌNH)
            Yêu cầu: Sử dụng useState, giá trị ban đầu là 0, nút "Tăng", cập nhật giao diện.
           ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'ex3') && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionPill, { backgroundColor: '#8B5CF6' }]}>
                <Text style={styles.sectionPillText}>BÀI TẬP 3</Text>
              </View>
              <Text style={styles.sectionTitle}>Quản Lý State (CounterHook)</Text>
            </View>
            <Text style={styles.sectionDesc}>
              Ứng dụng Hook `useState` để quản lý trạng thái động và kích hoạt chu trình re-render:
            </Text>

            {/* Component CounterHook độc lập */}
            <CounterHook />
          </View>
        )}

        {/* Footer ghi nhận thông tin bản quyền và bài tập */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Báo cáo Bài tập Tuần 6 - React Native & Mobile App Development
          </Text>
          <Text style={styles.footerSubText}>
            Nhóm sinh viên: Bùi Quang Duy - Lê Duy Linh • MSV: 11223077
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#4338CA',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  badgeTop: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeTopText: {
    color: '#E0E7FF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#C7D2FE',
    marginTop: 4,
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  tabButtonActive: {
    backgroundColor: '#4F46E5',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  contentScroll: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 36,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  sectionPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sectionPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionDesc: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
    lineHeight: 18,
  },
  footer: {
    marginTop: 16,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  footerSubText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
});
