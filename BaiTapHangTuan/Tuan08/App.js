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
import BaiTap1_EasyProductCards from './components/BaiTap1_EasyProductCards';
import BaiTap2_ProductListDetail from './components/BaiTap2_ProductListDetail';
import LyThuyetView from './components/LyThuyetView';

export default function App() {
  // Quản lý tab lọc bài tập ('all' | 'easy' | 'medium' | 'theory')
  const [activeTab, setActiveTab] = useState('all');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header chính của ứng dụng */}
      <View style={styles.header}>
        <View style={styles.badgeTop}>
          <Text style={styles.badgeTopText}>REACT NATIVE • BÀI TẬP TUẦN 08</Text>
        </View>
        <Text style={styles.headerTitle}>Props, Component, FlatList & Detail</Text>
        <Text style={styles.headerSubtitle}>
          Sinh viên: Bùi Quang Duy - Lê Duy Linh • Lớp: 12325W.3
        </Text>
        <Text style={styles.headerMssv}>MSSV: 11223077 - 11223078 • SPKTHY</Text>
      </View>

      {/* Thanh điều hướng Tab chuyển đổi bài tập */}
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
            style={[styles.tabButton, activeTab === 'easy' && styles.tabButtonActive]}
            onPress={() => setActiveTab('easy')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'easy' && styles.tabTextActive]}>
              🏷️ Bài dễ: ProductCard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'medium' && styles.tabButtonActive]}
            onPress={() => setActiveTab('medium')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'medium' && styles.tabTextActive]}>
              📱 Bài TB: List & Detail (10 Items)
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

      {/* Nội dung tương ứng với Tab được chọn */}
      <View style={styles.bodyContent}>
        {activeTab === 'all' && (
          <ScrollView style={styles.allScrollContainer} showsVerticalScrollIndicator={false}>
            {/* Banner tóm tắt */}
            <View style={styles.summaryBanner}>
              <Text style={styles.summaryTitle}>
                🚀 Tổng quan kết quả thực hiện Bài tập Tuần 8
              </Text>
              <Text style={styles.summaryDesc}>
                Bao gồm đầy đủ 5 câu hỏi lý thuyết chuyên sâu, bài tập mức dễ (tách ProductCard nhận props name, price) và bài tập mức trung bình (FlatList 10 sản phẩm công nghệ chuyển sang màn hình Detail truyền params).
              </Text>
            </View>

            {/* Mục 1: Bài tập mức dễ */}
            <View style={styles.sectionHeaderCard}>
              <Text style={styles.sectionBadge}>PHẦN 1</Text>
              <Text style={styles.sectionTitleText}>🏷️ Bài tập mức dễ: Component ProductCard</Text>
            </View>
            <View style={styles.nestedContainer}>
              <BaiTap1_EasyProductCards />
            </View>

            {/* Mục 2: Bài tập mức trung bình */}
            <View style={styles.sectionHeaderCard}>
              <Text style={styles.sectionBadge}>PHẦN 2</Text>
              <Text style={styles.sectionTitleText}>📱 Bài tập mức trung bình: FlatList & Detail Screen</Text>
            </View>
            <View style={[styles.nestedContainer, { height: 600 }]}>
              <BaiTap2_ProductListDetail />
            </View>

            {/* Mục 3: Lý thuyết */}
            <View style={styles.sectionHeaderCard}>
              <Text style={styles.sectionBadge}>PHẦN 3</Text>
              <Text style={styles.sectionTitleText}>📖 5 Câu hỏi ôn tập lý thuyết</Text>
            </View>
            <View style={styles.nestedContainer}>
              <LyThuyetView />
            </View>

            <View style={{ height: 50 }} />
          </ScrollView>
        )}

        {activeTab === 'easy' && <BaiTap1_EasyProductCards />}

        {activeTab === 'medium' && <BaiTap2_ProductListDetail />}

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
    fontSize: 20,
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
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  nestedContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 14,
  },
});
