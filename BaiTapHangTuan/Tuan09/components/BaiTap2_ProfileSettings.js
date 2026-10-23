import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

import ProfileCard from './ProfileCard';
import SettingsList from './SettingsList';

export default function BaiTap2_ProfileSettings() {
  const { width: deviceWidth } = useWindowDimensions();

  // Chế độ xem kích thước: 'auto' (thực tế) | 'small' (360px) | 'large' (768px)
  const [viewMode, setViewMode] = useState('auto');

  // Xác định chiều rộng hiệu dụng dựa trên chế độ xem
  const effectiveWidth =
    viewMode === 'small' ? 360 : viewMode === 'large' ? 768 : deviceWidth;

  // Ngưỡng phân chia kích thước Responsive (Breakpoint: 640px)
  const isLargeScreen = effectiveWidth >= 640;

  return (
    <View style={styles.outerContainer}>
      {/* =======================================================
          THANH ĐIỀU KHIỂN GIẢ LẬP KÍCH THƯỚC RESPONSIVE
          (Dành cho việc kiểm tra giao diện & chụp ảnh nộp bài)
         ======================================================= */}
      <View style={styles.responsiveToolbar}>
        <View style={styles.toolbarInfo}>
          <Text style={styles.toolbarTitle}>📐 BỘ GIẢ LẬP RESPONSIVE MÀN HÌNH</Text>
          <Text style={styles.toolbarSubtitle}>
            Độ rộng hiện tại: <Text style={styles.toolbarBold}>{Math.round(effectiveWidth)}px</Text> •{' '}
            Bố cục Flexbox: <Text style={styles.toolbarBold}>{isLargeScreen ? '2 Cột Song Song (Tablet)' : '1 Cột Dọc (Mobile)'}</Text>
          </Text>
        </View>

        <View style={styles.toolbarButtonGroup}>
          <TouchableOpacity
            style={[styles.modeButton, viewMode === 'small' && styles.modeButtonActive]}
            onPress={() => setViewMode('small')}
            activeOpacity={0.7}
          >
            <Text style={[styles.modeButtonText, viewMode === 'small' && styles.modeButtonTextActive]}>
              📱 Màn hình nhỏ (360px)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeButton, viewMode === 'large' && styles.modeButtonActive]}
            onPress={() => setViewMode('large')}
            activeOpacity={0.7}
          >
            <Text style={[styles.modeButtonText, viewMode === 'large' && styles.modeButtonTextActive]}>
              💻 Màn hình lớn (768px)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeButton, viewMode === 'auto' && styles.modeButtonActive]}
            onPress={() => setViewMode('auto')}
            activeOpacity={0.7}
          >
            <Text style={[styles.modeButtonText, viewMode === 'auto' && styles.modeButtonTextActive]}>
              🔄 Thiết bị thực tế
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* =======================================================
          VÙNG HIỂN THỊ GIAO DIỆN CHÍNH
          Co giãn theo khung container mô phỏng responsive
         ======================================================= */}
      <View style={styles.viewportWrapper}>
        <View
          style={[
            styles.viewportFrame,
            viewMode === 'small' && styles.frameSmall,
            viewMode === 'large' && styles.frameLarge,
          ]}
        >
          <ScrollView
            style={styles.mainScroll}
            contentContainerStyle={[
              styles.scrollContent,
              isLargeScreen ? styles.scrollContentLarge : styles.scrollContentSmall,
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Banner giới thiệu Flexbox Responsive */}
            <View style={styles.introCard}>
              <View style={styles.introHeader}>
                <Text style={styles.introBadge}>
                  {isLargeScreen ? 'TABLET / LARGE SCREEN (≥ 640px)' : 'MOBILE / SMALL SCREEN (< 640px)'}
                </Text>
                <Text style={styles.introBadgeType}>
                  Flexbox {isLargeScreen ? 'Row 2-Columns' : 'Column 1-Stack'}
                </Text>
              </View>
              <Text style={styles.introTitle}>
                {isLargeScreen
                  ? '🖥️ Bố cục 2 cột song song (Horizontal Split)'
                  : '📱 Bố cục 1 cột cuộn dọc (Vertical Stack)'}
              </Text>
              <Text style={styles.introDesc}>
                {isLargeScreen
                  ? 'Trên màn hình lớn, giao diện tự động dàn trang 2 cột bằng Flexbox (flexDirection: "row"). Cột trái chứa Profile Card cố định, cột phải hiển thị trọn vẹn danh mục Settings List.'
                  : 'Trên màn hình nhỏ điện thoại, toàn bộ giao diện tự động xếp dọc (flexDirection: "column") với kích thước font và padding tối ưu, đảm bảo không bị tràn hay vỡ chữ.'}
              </Text>
            </View>

            {/* ===================================================
                KHỐI GIAO DIỆN PROFILE CARD + SETTINGS LIST
                ÁP DỤNG BỐ CỤC FLEXBOX RESPONSIVE
               =================================================== */}
            {isLargeScreen ? (
              // BỐ CỤC MÀN HÌNH LỚN: 2 CỘT SONG SONG
              <View style={styles.twoColumnContainer}>
                {/* Cột trái: Profile Card */}
                <View style={styles.leftColumn}>
                  <ProfileCard isLargeScreen={true} />
                </View>

                {/* Cột phải: Settings List */}
                <View style={styles.rightColumn}>
                  <SettingsList isLargeScreen={true} />
                </View>
              </View>
            ) : (
              // BỐ CỤC MÀN HÌNH NHỎ: 1 CỘT XẾP DỌC
              <View style={styles.singleColumnContainer}>
                {/* Profile Card ở trên */}
                <ProfileCard isLargeScreen={false} />

                {/* Khoảng cách */}
                <View style={{ height: 16 }} />

                {/* Settings List ở dưới */}
                <SettingsList isLargeScreen={false} />
              </View>
            )}

            {/* Hộp thuyết minh tiêu chí kỹ thuật Flexbox */}
            <View style={styles.explanationBox}>
              <Text style={styles.explanationTitle}>
                ⚡ Các kỹ thuật Flexbox & Responsive áp dụng trong Bài 2:
              </Text>
              <View style={styles.explanationList}>
                <Text style={styles.explanationItem}>
                  1. <Text style={styles.expBold}>useWindowDimensions</Text>: Đo kích thước thực tế và chuyển đổi breakpoint linh hoạt giữa 360px và 768px.
                </Text>
                <Text style={styles.explanationItem}>
                  2. <Text style={styles.expBold}>flexDirection</Text>: Chuyển đổi động giữa 'column' (màn hình nhỏ) và 'row' (màn hình lớn).
                </Text>
                <Text style={styles.explanationItem}>
                  3. <Text style={styles.expBold}>flex: 0.38 vs flex: 0.62</Text>: Chia tỷ lệ vàng giữa cột hồ sơ người dùng và danh sách thiết lập.
                </Text>
                <Text style={styles.explanationItem}>
                  4. <Text style={styles.expBold}>justifyContent: 'space-between'</Text>: Phân bố đều icon, tiêu đề và công tắc Switch trên từng dòng.
                </Text>
                <Text style={styles.explanationItem}>
                  5. <Text style={styles.expBold}>flexWrap: 'wrap'</Text>: Đảm bảo các thẻ tag chuyên ngành tự rớt dòng thẩm mỹ khi co hẹp chiều ngang.
                </Text>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  responsiveToolbar: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  toolbarInfo: {
    marginBottom: 10,
  },
  toolbarTitle: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  toolbarSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
  },
  toolbarBold: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  toolbarButtonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modeButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modeButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#3B82F6',
  },
  modeButtonText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  viewportWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#E2E8F0',
  },
  viewportFrame: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F8FAFC',
  },
  frameSmall: {
    maxWidth: 380,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#CBD5E1',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  frameLarge: {
    maxWidth: 900,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#CBD5E1',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  scrollContentSmall: {
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  scrollContentLarge: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  introCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  introHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  introBadge: {
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    fontSize: 10.5,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  introBadgeType: {
    backgroundColor: '#F0FDF4',
    color: '#15803D',
    fontSize: 10.5,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  introDesc: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  leftColumn: {
    flex: 0.38,
  },
  rightColumn: {
    flex: 0.62,
  },
  singleColumnContainer: {
    width: '100%',
  },
  explanationBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 16,
    marginTop: 20,
  },
  explanationTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  explanationList: {
    gap: 6,
  },
  explanationItem: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  expBold: {
    fontWeight: '800',
    color: '#1D4ED8',
  },
});
