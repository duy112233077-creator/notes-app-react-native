import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const THEORY_QUESTIONS = [
  {
    id: 'q1',
    number: 'Câu 1',
    title: 'Phân biệt Default Export và Named Export trong React Native',
    summary:
      'Sự khác nhau cơ bản, cú pháp import/export, quy ước khi file chỉ chứa một component chính và các ví dụ tình huống thực tế.',
    content: `1. Sự khác nhau giữa Default Export và Named Export:
• Default Export (Xuất khẩu mặc định):
  - Mỗi file (module) chỉ được phép có duy nhất MỘT default export.
  - Cú pháp xuất: export default ProductCard; hoặc export default function ProductCard() {...}
  - Cú pháp nhập: import ProductCard from './ProductCard'; (Không cần dấu ngoặc nhọn {}).
  - Tên import linh hoạt: Bên file nhận có thể tự do đổi tên mà không cần dùng từ khóa 'as' (ví dụ: import CardSanPham from './ProductCard').

• Named Export (Xuất khẩu có tên):
  - Một file có thể chứa NHIỀU named export (nhiều hàm, biến, component, hằng số).
  - Cú pháp xuất: export const ProductCard = () => {...} hoặc export { ProductCard, calculateDiscount };
  - Cú pháp nhập: import { ProductCard, calculateDiscount } from './ProductCard'; (Bắt buộc phải bọc trong cặp ngoặc nhọn {}).
  - Tên import chặt chẽ: Phải trùng khớp chính xác với tên đã được export, nếu muốn đổi tên phải dùng cú pháp 'as' (ví dụ: import { ProductCard as CustomCard } ...).

2. Khi một file chỉ chứa MỘT component chính thì nên dùng cách nào?
• Khuyến nghị chuẩn mực (Best Practice): NÊN SỬ DỤNG DEFAULT EXPORT.
• Lý do:
  - Tính trực quan và mục đích duy nhất (Single Responsibility): Thể hiện rõ file này đại diện trọn vẹn cho component đó.
  - Cú pháp import ngắn gọn, tự nhiên và phổ biến trong cộng đồng React/React Native: import Header from './Header'; thay vì import { Header } from './Header';.
  - Tương thích tốt với React Navigation, Lazy Loading (React.lazy) và các hệ thống Route vốn mặc định nhận module default.

3. Ví dụ tình huống sử dụng phù hợp:
• Dùng Default Export: Cho các màn hình lớn hoặc component độc lập hoàn chỉnh như HomeScreen.js, ProductDetailScreen.js, ProductCard.js.
• Dùng Named Export: Cho các file thư viện tiện ích chứa nhiều hàm/hằng số (như utils/formatters.js xuất { formatVND, formatDate, isValidEmail }), hoặc UI Kit chứa nhiều nút nhỏ (export { PrimaryButton, SecondaryButton, IconButton }).`,
  },
  {
    id: 'q2',
    number: 'Câu 2',
    title: 'Khái niệm Props, Luồng truyền dữ liệu và Đặc tính Read-only',
    summary:
      'Bản chất của Props, luồng dữ liệu 1 chiều (Top-down), đặc tính bất biến (read-only) và hậu quả khi component con cố tình sửa props.',
    content: `1. Khái niệm Props trong React Native:
• Props (viết tắt của "Properties") là đối số đầu vào (arguments) được truyền từ component cha xuống component con dưới dạng các thuộc tính JSX.
• Props là phương tiện chính để tùy biến hiển thị, chia sẻ dữ liệu hoặc truyền hàm callback xử lý sự kiện giữa các tầng component.

2. Vì sao Props là cách truyền dữ liệu từ Component Cha xuống Component Con?
• React áp dụng kiến trúc Luồng dữ liệu một chiều (One-Way Data Flow / Top-Down): Dữ liệu luôn chảy từ gốc (cha) tới các nhánh lá (con).
• Component cha là người nắm giữ và kiểm soát dữ liệu gốc (Single Source of Truth). Component con hoạt động phụ thuộc vào dữ liệu được cha cấp phát.
• Giúp ứng dụng dễ dự đoán (Predictable), dễ lần vết lỗi (Traceable): Khi giao diện hiển thị sai, lập trình viên chỉ cần kiểm tra ngược lên component cha nơi dữ liệu bắt nguồn.

3. Phân tích đặc điểm "Read-only" (Bất biến / Chỉ đọc) của Props:
• Nguyên tắc thuần khiết (Pure Function): Trong React, tất cả các component phải hoạt động như một hàm thuần khiết đối với props của chúng.
• Component con tuyệt đối KHÔNG ĐƯỢC PHÉP thay đổi (mutate) giá trị của props nhận được.
• Ví dụ vi phạm: props.price = 10000; hoặc props.name = 'New Name';.

4. Điều gì xảy ra nếu Component con cố gắng thay đổi trực tiếp Props?
• Gây lỗi Runtime Error trong chế độ Strict Mode: TypeError: Cannot assign to read only property.
• Phá vỡ tính đồng bộ giao diện: Gây ra trạng thái bất nhất (Inconsistent UI State) giữa cha và con. Cha nghĩ giá vẫn là 500k nhưng con tự ý sửa thành 200k.
• React không thể theo dõi biến đổi (Dirty Checking thất bại), dẫn đến Virtual DOM không re-render đúng cách, gây rò rỉ bộ nhớ hoặc hành vi khó lường.
• Giải pháp chuẩn: Nếu component con muốn thay đổi giá trị đó, component cha phải truyền một hàm callback xuống qua props (ví dụ: onUpdatePrice), component con gọi hàm này để yêu cầu cha cập nhật State của cha!`,
  },
  {
    id: 'q3',
    number: 'Câu 3',
    title: 'Vai trò của việc tách Component nhỏ (Atomic Design / Modularity)',
    summary:
      'Lợi ích to lớn của việc chia nhỏ Header, Button, InputField, Card đối với khả năng tái sử dụng, bảo trì và mở rộng ứng dụng.',
    content: `1. Lợi ích đối với Khả năng Tái sử dụng (Reusability):
• Tránh lặp lại mã nguồn (nguyên lý DRY - Don't Repeat Yourself):
  Thay vì viết đi viết lại 20 dòng mã cấu trúc JSX và style cho từng ô nhập liệu ở trang Đăng ký, Đăng nhập, Quên mật khẩu, ta chỉ cần tạo một component <InputField /> và tái sử dụng ở mọi nơi.
• Chuẩn hóa giao diện (Design System Consistency):
  Mọi nút bấm <CustomButton /> hay thẻ sản phẩm <ProductCard /> đều có chung độ cong viền (borderRadius), màu sắc chủ đạo, hiệu ứng bóng đổ, tạo nên sự đồng nhất chuyên nghiệp cho cả ứng dụng.

2. Lợi ích đối với Khả năng Bảo trì (Maintainability):
• Cô lập lỗi và dễ debug (Isolation of Concerns):
  Khi nút bấm bị lỗi hiệu ứng activeOpacity hoặc ô nhập liệu bị vỡ layout trên bàn phím iOS, ta chỉ cần vào đúng file Button.js hoặc InputField.js để sửa 1 lần duy nhất, toàn bộ ứng dụng sẽ tự động được cập nhật.
• File code ngắn gọn, rõ ràng:
  Thay vì một file HomeScreen.js dài 2000 dòng mã rối rắm, khi tách nhỏ ra, file chính chỉ còn 150-200 dòng, tổ chức bố cục logic trong sáng và dễ đọc.

3. Lợi ích đối với Khả năng Mở rộng ứng dụng (Scalability):
• Dễ dàng làm việc nhóm (Team Collaboration):
  Nhiều lập trình viên có thể làm việc song song trên các component khác nhau (Dev A làm Header, Dev B làm Card, Dev C làm InputField) mà không xảy ra xung đột mã (Git Merge Conflicts).
• Tối ưu hiệu năng Re-render (Performance Optimization):
  Khi một component nhỏ thay đổi trạng thái (ví dụ ô Input gõ phím), chỉ duy nhất component nhỏ đó re-render, toàn bộ phần Header và Card xung quanh không bị tính toán lại không cần thiết (kết hợp React.memo).`,
  },
  {
    id: 'q4',
    number: 'Câu 4',
    title: 'Mối liên hệ giữa Props, State, Hooks trong Form nhập liệu',
    summary:
      'Phân định dữ liệu quản lý bằng State, dữ liệu truyền qua Props trong form đăng ký (Tên, Email, Mật khẩu) và giải thích lý do.',
    content: `1. Mối liên hệ cốt lõi giữa Props, State và Hooks:
• Hooks (useReducer, useState, useMemo): Cung cấp cơ chế để Functional Component khai báo trạng thái nội tại và vòng đời.
• State: Là dữ liệu động, có thể thay đổi theo thời gian thông qua hành động của người dùng (gõ phím, chọn checkbox, submit).
• Props: Là đường ống dẫn dữ liệu từ nơi nắm giữ State truyền xuống các component giao diện hiển thị con.
• Mối liên hệ: State được khởi tạo bởi Hook useState() tại component form cha -> Truyền xuống component Input con qua Props -> Khi user gõ phím, component con kích hoạt callback truyền ngược qua Props để gọi hàm setState() cập nhật State cha.

2. Trong Form Đăng ký (Tên, Email, Mật khẩu): Dữ liệu nào dùng State, dữ liệu nào dùng Props?

A. DỮ LIỆU ĐƯỢC QUẢN LÝ BẰNG STATE (Tại Form Component cha):
• Giá trị người dùng gõ vào:
  - const [name, setName] = useState('')
  - const [email, setEmail] = useState('')
  - const [password, setPassword] = useState('')
• Trạng thái lỗi (Validation Errors):
  - const [errors, setErrors] = useState({ name: '', email: '', password: '' })
• Trạng thái Form:
  - const [isLoading, setIsLoading] = useState(false)
  - const [isPasswordVisible, setIsPasswordVisible] = useState(false)
* Vì sao? Vì đây là những dữ liệu biến động liên tục theo hành động người dùng thực tế và cần kích hoạt re-render để hiển thị giá trị mới hoặc câu thông báo lỗi kịp thời.

B. DỮ LIỆU ĐƯỢC TRUYỀN QUA PROPS (Xuống các component con như <CustomInput />, <SubmitButton />):
• Các cấu hình tĩnh hoặc dữ liệu hiển thị:
  - placeholder="Nhập họ và tên..."
  - label="Địa chỉ Email"
  - secureTextEntry={true} (dành cho mật khẩu)
  - keyboardType="email-address"
• Giá trị hiện tại được lấy từ State cha:
  - value={email}
  - errorMessage={errors.email}
• Các hàm cập nhật State (Callbacks):
  - onChangeText={(text) => setEmail(text)}
  - onSubmit={handleRegister}
* Vì sao? Vì các ô Input con chỉ đóng vai trò hiển thị và bắt sự kiện (Presentational Component). Truyền qua props giúp Input con hoàn toàn độc lập, có thể tái sử dụng cho bất kỳ trường dữ liệu nào.`,
  },
  {
    id: 'q5',
    number: 'Câu 5',
    title: 'Controlled Component với TextInput và Tầm quan trọng của Validation',
    summary:
      'Bản chất Controlled Component, luồng hoạt động 2 chiều giả lập, và lý do bắt buộc phải validate dữ liệu (rỗng, định dạng email, độ dài mật khẩu).',
    content: `1. Khái niệm Controlled Component với TextInput trong React Native:
• Controlled Component là thành phần giao diện mà giá trị của nó (ô nhập liệu TextInput) được kiểm soát HOÀN TOÀN bởi React State thay vì để phần tử gốc tự quản lý bộ nhớ đệm (native buffer).
• Trong TextInput:
  - Thuộc tính 'value' luôn được gán bằng giá trị của một biến State: value={email}.
  - Sự kiện 'onChangeText' lắng nghe người dùng gõ phím và gọi hàm cập nhật State: onChangeText={(text) => setEmail(text)}.
• Cơ chế hoạt động: Khi người dùng gõ chữ 'a' -> Sự kiện onChangeText bắn ra -> State cập nhật -> Component re-render -> Thuộc tính value nhận giá trị mới và hiển thị chữ 'a' lên màn hình. React trở thành "Nguồn chân lý duy nhất" (Single Source of Truth).

2. Vì sao cần quản lý giá trị bằng State và thực hiện Validate dữ liệu?
• 1. Đảm bảo tính toàn vẹn và hợp lệ của dữ liệu trước khi gửi lên Server:
  - Kiểm tra rỗng (Not Empty): Ngăn chặn việc gửi thông tin rác, thiếu họ tên hay tài khoản trống gây lỗi Database.
  - Kiểm tra định dạng Email (chứa ký tự '@' và domain hợp lệ): Đảm bảo hệ thống có thể gửi email xác thực, kích hoạt tài khoản hoặc khôi phục mật khẩu.
  - Kiểm tra độ dài tối thiểu của Mật khẩu (ví dụ >= 6 hoặc 8 ký tự): Bảo vệ an toàn an ninh mạng cho người dùng, chống lại các cuộc tấn công đoán mật khẩu thô bạo (Brute-force attacks).
• 2. Cung cấp phản hồi tức thì cho người dùng (Instant UX Feedback):
  - Khi quản lý bằng State, ứng dụng có thể kiểm tra lỗi theo thời gian thực (Real-time Validation) ngay khi người dùng vừa gõ xong (onBlur / onChangeText), hiển thị dòng chữ đỏ báo lỗi trước khi bấm nút Gửi.
• 3. Kiểm soát quyền kích hoạt nút Submit:
  - Có thể vô hiệu hóa (disable) nút Đăng ký màu xám nếu form chưa hợp lệ, chỉ sáng xanh khi toàn bộ thông tin đã điền chính xác, tránh việc người dùng bấm liên tục gây nghẽn mạng (Spam Requests).
• 4. Dễ dàng định dạng và làm sạch dữ liệu (Data Formatting & Sanitization):
  - Cho phép tự động loại bỏ khoảng trắng thừa (trim), tự động viết hoa hoặc giới hạn ký tự đặc biệt ngay trong hàm setState.`,
  },
];

export default function LyThuyetView() {
  const [expandedId, setExpandedId] = useState('q1');

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner tiêu đề */}
      <View style={styles.banner}>
        <View style={styles.badgeTop}>
          <Text style={styles.badgeTopText}>PHẦN A • 5 CÂU HỎI ÔN TẬP LÝ THUYẾT</Text>
        </View>
        <Text style={styles.bannerTitle}>React Native Architecture & Concepts</Text>
        <Text style={styles.bannerSub}>
          Export/Import, Props, Component Breakdown, State & Hooks, Controlled Component & Validation.
        </Text>
      </View>

      {/* Danh sách 5 câu hỏi lý thuyết */}
      <View style={styles.listContainer}>
        {THEORY_QUESTIONS.map((item, index) => {
          const isExpanded = expandedId === item.id;

          return (
            <View key={item.id} style={styles.card}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.headerLeft}>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberBadgeText}>0{index + 1}</Text>
                  </View>
                  <View style={styles.titleWrapper}>
                    <Text style={styles.questionNumber}>{item.number}</Text>
                    <Text style={styles.questionTitle}>{item.title}</Text>
                  </View>
                </View>
                <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {/* Tóm tắt ngắn */}
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>📌 {item.summary}</Text>
              </View>

              {/* Nội dung chi tiết khi mở rộng */}
              {isExpanded && (
                <View style={styles.bodyBox}>
                  <View style={styles.divider} />
                  <Text style={styles.bodyText}>{item.content}</Text>
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
  banner: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  badgeTop: {
    alignSelf: 'flex-start',
    backgroundColor: '#38BDF8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeTopText: {
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  bannerSub: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  listContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  numberBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  titleWrapper: {
    flex: 1,
  },
  questionNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
  },
  expandIcon: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '800',
    padding: 4,
  },
  summaryBox: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  summaryText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  bodyBox: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 21,
    fontFamily: 'monospace',
  },
});
