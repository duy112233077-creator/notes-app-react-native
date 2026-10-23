import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';

const THEORY_QUESTIONS = [
  {
    id: 'q1',
    number: 'Câu 1',
    title: 'So sánh StyleSheet.create() và Inline Style trong React Native',
    summary:
      'Lợi ích hiệu năng, cơ chế Style ID tối ưu qua JavaScript Bridge, khả năng tái sử dụng và kiểm soát lỗi chính tả.',
    content: `1. Khái niệm và Cú pháp:
• Inline Style (Style trực tiếp trên thẻ JSX):
  - Khai báo đối tượng JavaScript ngay trong thuộc tính style:
    <View style={{ backgroundColor: '#2563EB', padding: 16, borderRadius: 12 }}>
• StyleSheet.create() (Bộ định kiểu đóng gói):
  - Khai báo các class đối tượng style tập trung bên ngoài component:
    const styles = StyleSheet.create({
      card: { backgroundColor: '#2563EB', padding: 16, borderRadius: 12 }
    });
    <View style={styles.card}>

2. Bảng so sánh toàn diện:
| Tiêu chí | StyleSheet.create() | Inline Style |
| :--- | :--- | :--- |
| Hiệu năng (Performance) | Rất cao. Object style chỉ được khởi tạo 1 lần duy nhất khi file nạp vào bộ nhớ. | Thấp. Một Object JavaScript mới toanh được cấp phát lại trong mỗi chu kỳ re-render. |
| Cơ chế Bridge | Tối ưu vượt trội. Native Bridge chỉ cần truyền Style ID (số nguyên) thay vì toàn bộ object. | Kém. Bridge phải serialize và gửi toàn bộ JSON qua lại mỗi lần render. |
| Kiểm tra lỗi (Validation) | Tự động cảnh báo lỗi thuộc tính không hợp lệ ngay lúc biên dịch (Compile-time / Startup). | Thường bỏ sót hoặc gây lỗi runtime âm thầm khi render tới. |
| Tổ chức mã nguồn | Sạch sẽ, tuân thủ nguyên tắc phân tách mối bận tâm (Separation of Concerns). | Rối rắm, khó đọc, làm phình to cấu trúc JSX. |
| Khả năng tái sử dụng | Cực cao, có thể dùng lại trên nhiều view hoặc kết hợp mảng [styles.a, styles.b]. | Không thể tái sử dụng, phải copy-paste lặp lại mã. |

3. Khi nào Inline Style được chấp nhận?
• Chỉ dùng Inline Style khi giá trị style phụ thuộc vào biến động (dynamic runtime state) không thể định nghĩa tĩnh, ví dụ: { width: animatedWidth, opacity: fadeAnim }.
• Còn lại toàn bộ style tĩnh NÊN viết 100% bằng StyleSheet.create().`,
  },
  {
    id: 'q2',
    number: 'Câu 2',
    title: 'Hệ thống Flexbox trong React Native vs CSS Web: Điểm khác biệt cốt lõi',
    summary:
      'Sự khác biệt về hướng trục mặc định (column vs row), đơn vị không dùng px, Yoga Engine và thuộc tính display hạn chế.',
    content: `Hệ thống dàn trang trong React Native được xây dựng dựa trên thuật toán Flexbox của W3C, được tính toán bởi thư viện Yoga Engine (C++ do Meta phát triển). Tuy nhiên, có những điểm khác biệt căn bản so với CSS trên trình duyệt:

1. Trục chính mặc định (flexDirection: 'column'):
• Trên CSS Web: Hướng mặc định của Flex container là 'row' (xếp theo hàng ngang từ trái qua phải).
• Trong React Native: Hướng mặc định luôn là 'column' (xếp theo cột dọc từ trên xuống dưới). Điều này xuất phát từ đặc thù màn hình điện thoại di động dài theo chiều dọc, người dùng cuộn từ trên xuống dưới.

2. Không sử dụng đơn vị đo lường (px, rem, em, pt):
• Trên Web: Lập trình viên bắt buộc phải ghi rõ đơn vị: padding: 16px, font-size: 1.2rem.
• Trong React Native: Tất cả các con số đều là số nguyên hoặc số thực không có đơn vị (ví dụ: padding: 16, fontSize: 16). React Native tự động quy đổi con số này sang mật độ điểm ảnh độc lập (dp - density-independent pixels trên Android, hoặc points trên iOS).

3. Thuộc tính display cực kỳ hạn chế:
• Trên Web: display hỗ trợ vô số giá trị: block, inline, inline-block, flex, grid, table...
• Trong React Native: Mọi thẻ View đều mặc định là display: 'flex'. Thuộc tính display chỉ chấp nhận đúng 2 giá trị duy nhất: 'flex' (hiển thị) hoặc 'none' (ẩn hoàn toàn khỏi cây layout).

4. Thuộc tính flex nhận giá trị đơn:
• Trên Web: flex là shorthand của flex-grow flex-shrink flex-basis (ví dụ: flex: 1 0 auto).
• Trong React Native: flex chỉ nhận một số dương duy nhất: flex: 1 (phần tử sẽ chiếm trọn không gian còn lại dọc theo trục chính).`,
  },
  {
    id: 'q3',
    number: 'Câu 3',
    title: 'Phân tích các thuộc tính căn chỉnh & dàn trang Flexbox',
    summary:
      'Cách thức hoạt động của flexDirection, justifyContent, alignItems, alignSelf, flexWrap và gap.',
    content: `1. flexDirection (Xác định trục chính Main Axis):
• 'column' (Mặc định): Trục chính là trục dọc. Các con xếp từ trên xuống dưới.
• 'row': Trục chính là trục ngang. Các con xếp từ trái sang phải.
• 'column-reverse' / 'row-reverse': Xếp theo thứ tự đảo ngược.

2. justifyContent (Căn chỉnh các con dọc theo Trục chính - Main Axis):
• 'flex-start': Dồn về đầu trục chính (trên cùng hoặc mép trái).
• 'flex-end': Dồn về cuối trục chính (dưới cùng hoặc mép phải).
• 'center': Căn giữa không gian trục chính.
• 'space-between': Phần tử đầu ở mép đầu, phần tử cuối ở mép cuối, khoảng trống chia đều ở giữa.
• 'space-around': Khoảng trống chia đều quanh mỗi phần tử.
• 'space-evenly': Khoảng cách giữa hai phần tử bất kỳ và giữa mép biên luôn bằng nhau chằn chặn.

3. alignItems (Căn chỉnh các con dọc theo Trục phụ - Cross Axis):
• 'stretch' (Mặc định khi con không có kích thước cố định): Kéo giãn chiếm trọn chiều rộng/cao của trục phụ.
• 'flex-start' / 'flex-end': Căn về mép đầu / mép cuối trục phụ.
• 'center': Căn giữa trục phụ.
• 'baseline': Căn chỉnh theo đường chân chữ của văn bản Text.

4. alignSelf (Ghi đè căn chỉnh riêng lẻ cho 1 phần tử con):
• Cho phép một phần tử con tự quyết định cách căn chỉnh trục phụ của chính nó mà không phụ thuộc vào giá trị alignItems chung của cha.

5. flexWrap & gap:
• flexWrap: 'wrap' cho phép các phần tử tự động rớt xuống dòng tiếp theo khi hàng ngang đã chật chỗ (rất quan trọng khi hiển thị danh sách thẻ tags, danh mục sản phẩm).
• gap, rowGap, columnGap: Tạo khoảng trống đồng đều giữa các con một cách tự nhiên mà không cần viết margin phức tạp.`,
  },
  {
    id: 'q4',
    number: 'Câu 4',
    title: 'Phương pháp thiết kế Responsive UI thích ứng đa màn hình',
    summary:
      'Sử dụng useWindowDimensions, xây dựng hệ thống Breakpoints, bố cục linh hoạt và xử lý xoay màn hình.',
    content: `Trong phát triển ứng dụng di động React Native, thiết bị có thể là một chiếc điện thoại nhỏ 4.7 inch (iPhone SE, width ~ 375px), điện thoại màn hình lớn 6.7 inch (iPhone Pro Max, Galaxy Ultra, width ~ 430px), hoặc máy tính bảng Tablet / iPad (width ≥ 768px).

1. Thu thập kích thước màn hình động với useWindowDimensions():
• Không nên dùng Dimensions.get('window') tĩnh vì nó không tự động kích hoạt re-render khi người dùng xoay ngang màn hình (Portrait to Landscape) hoặc thay đổi kích thước cửa sổ Split Screen trên iPad/Android Foldable.
• Hook chuẩn hiện đại:
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;

2. Thiết lập quy chuẩn Breakpoints:
• Mobile Phone nhỏ: width < 380px
• Mobile Phone tiêu chuẩn: 380px ≤ width < 640px
• Tablet / Màn hình lớn: width ≥ 640px

3. Chuyển đổi kiến trúc Bố cục (Layout Transformation):
• Khi trên màn hình nhỏ: Dùng 1 cột dọc (flexDirection: 'column'), người dùng cuộn ngón tay tiện lợi.
• Khi trên màn hình lớn: Chuyển sang 2 cột song song (flexDirection: 'row'): Cột thông tin hồ sơ (35% - 40%) kết hợp Cột thiết lập / danh sách chi tiết (60% - 65%), tận dụng triệt để không gian bề ngang.

4. Tối ưu kích thước chữ và khoảng đệm (Dynamic Sizing):
• Trên màn hình lớn, tăng padding từ 16 lên 24, cỡ chữ từ 14 lên 16, kích thước ảnh đại diện avatar từ 80x80 lên 100x100 để giao diện không bị lọt thỏm.`,
  },
  {
    id: 'q5',
    number: 'Câu 5',
    title: 'Mô hình hộp (Box Model) & Styling cơ bản trong React Native',
    summary:
      'Cơ chế box-sizing mặc định, hiện tượng Margin Collapsing không xảy ra và các thuộc tính viền bo góc.',
    content: `1. Cơ chế tính toán kích thước (Box-Sizing: Border-Box):
• Trong CSS Web truyền thống, box-sizing mặc định là content-box (khi đặt width: 100px và padding: 10px thì tổng chiều rộng hiển thị bị phình lên thành 120px).
• Trong React Native: Mọi View đều ngầm định hoạt động theo cơ chế border-box: Chiều rộng khai báo đã bao gồm cả padding và borderWidth, giúp lập trình viên tính toán kích thước trực quan và không bị tràn layout.

2. Không xảy ra hiện tượng chập lề (No Margin Collapsing):
• Trên Web: Nếu hai khối dọc đứng liền nhau có margin-bottom: 20px và margin-top: 15px, khoảng cách thực tế giữa chúng sẽ bị gộp lại ("collapse") chỉ còn 20px (lấy giá trị lớn nhất).
• Trong React Native: Margin hoàn toàn không bao giờ bị gộp. Khoảng cách giữa 2 View sẽ là tổng cộng 20 + 15 = 35px. Điều này giúp tính toán khoảng cách nhất quán và chuẩn xác tuyệt đối.

3. Bộ thuộc tính Style cơ bản bắt buộc nắm vững:
• backgroundColor: Màu nền phần tử (dạng HEX #RRGGBB, RGB, RGBA hoặc tên màu).
• fontSize & fontWeight: Điều chỉnh cỡ chữ (số nguyên) và độ đậm chữ ('400', '600', '700', '800', 'bold').
• padding & margin: paddingHorizontal, paddingVertical, marginTop, marginBottom...
• borderWidth & borderColor: Độ dày và màu sắc viền ngoài của phần tử.
• borderRadius: Bo tròn góc cạnh (đặc biệt khi đặt borderRadius = width / 2 sẽ tạo ra hình tròn tuyệt đối cho Avatar).`,
  },
];

export default function LyThuyetView() {
  const [expandedId, setExpandedId] = useState('q1');

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header phần lý thuyết */}
      <View style={styles.headerBox}>
        <View style={styles.badgeTop}>
          <Text style={styles.badgeTopText}>PHẦN A • ÔN TẬP LÝ THUYẾT CHUYÊN SÂU</Text>
        </View>
        <Text style={styles.mainTitle}>Kiến Thức Cốt Lõi Về StyleSheet & Flexbox</Text>
        <Text style={styles.subTitle}>
          Tài liệu phân tích 5 chuyên đề trọng tâm: Hiệu năng StyleSheet.create(), Bản chất Yoga Flexbox, Các thuộc tính căn chỉnh, Kỹ thuật thiết kế Responsive thích ứng và Box Model di động.
        </Text>
      </View>

      {/* Danh sách 5 câu hỏi lý thuyết */}
      <View style={styles.questionsList}>
        {THEORY_QUESTIONS.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <View key={item.id} style={styles.questionCard}>
              <TouchableOpacity
                style={styles.questionHeader}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.titleRow}>
                  <View style={styles.badgeNumber}>
                    <Text style={styles.badgeNumberText}>{item.number}</Text>
                  </View>
                  <Text style={styles.questionTitle}>{item.title}</Text>
                </View>
                <View style={styles.toggleIconBox}>
                  <Text style={styles.toggleIcon}>{isExpanded ? '▲' : '▼'}</Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.summaryText}>{item.summary}</Text>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View style={styles.divider} />
                  <Text style={styles.contentText}>{item.content}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  headerBox: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  badgeTop: {
    alignSelf: 'flex-start',
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
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
  mainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 12.5,
    color: '#94A3B8',
    lineHeight: 18,
  },
  questionsList: {
    gap: 12,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  badgeNumber: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  badgeNumberText: {
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: '800',
  },
  questionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  toggleIconBox: {
    padding: 4,
  },
  toggleIcon: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  summaryText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 17,
  },
  expandedContent: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 10,
  },
  contentText: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
