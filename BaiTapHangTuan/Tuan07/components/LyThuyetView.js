import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const theoryQuestions = [
  {
    id: 1,
    title: 'Câu 1: Vòng Đời Component (Lifecycle)',
    short: '3 giai đoạn: Mounting, Updating, Unmounting & các hàm Class Component',
    content: `1. Ba giai đoạn chính trong vòng đời Component:
• MOUNTING (Khởi tạo & Gắn kết): Giai đoạn component được tạo ra và đưa vào cây phân cấp giao diện (DOM/Native UI).
• UPDATING (Cập nhật): Kích hoạt khi Props hoặc State thay đổi, component tính toán lại và re-render giao diện.
• UNMOUNTING (Tháo gỡ): Giai đoạn component bị loại bỏ khỏi màn hình hoặc cây phân cấp.

2. Vai trò các phương thức đối với Class Component:
• render(): Bắt buộc phải có, trả về cây JSX mô tả giao diện cần hiển thị. Phải là hàm thuần khiết (pure function).
• componentDidMount(): Gọi duy nhất 1 lần ngay sau khi component mount lần đầu. Dùng để gọi API, đăng ký listener, thiết lập timer.
• componentDidUpdate(prevProps, prevState): Gọi ngay sau khi component re-render do props/state thay đổi. Thích hợp để đồng bộ dữ liệu mạng hoặc cập nhật theo props mới.
• componentWillUnmount(): Gọi ngay trước khi component bị hủy. Dùng để dọn dẹp bộ nhớ: hủy timer, hủy request mạng, hủy event listener.`,
  },
  {
    id: 2,
    title: 'Câu 2: Hook useEffect Mô Phỏng Vòng Đời',
    short: 'Cách dùng useEffect thay thế componentDidMount, componentDidUpdate, componentWillUnmount',
    content: `Trong Functional Component, useEffect tổng hợp toàn bộ các hành vi vòng đời:

1. Chạy 1 lần sau lần render đầu tiên (tương đương componentDidMount):
   useEffect(() => {
     // Gọi API, khởi tạo dữ liệu
   }, []); // Mảng phụ thuộc rỗng []

2. Chạy lại khi State hoặc Props thay đổi (tương đương componentDidUpdate):
   useEffect(() => {
     // Chạy mỗi khi count hoặc userId thay đổi
   }, [count, userId]); // Liệt kê biến phụ thuộc
   * Lưu ý: Nếu không truyền mảng phụ thuộc (bỏ trống tham số thứ hai), useEffect sẽ chạy lại sau MỌI lần re-render.

3. Thực hiện Cleanup khi component bị unmount (tương đương componentWillUnmount):
   useEffect(() => {
     const timer = setInterval(...);
     return () => {
       clearInterval(timer); // Cleanup function
     };
   }, []);`,
  },
  {
    id: 3,
    title: 'Câu 3: Controlled Component Trong React Native',
    short: 'Khái niệm & vì sao giá trị ô nhập luôn do state kiểm soát',
    content: `• Định nghĩa: Controlled Component là component mà giá trị của các phần tử nhập liệu (như TextInput) bị ràng buộc và kiểm soát hoàn toàn bởi State của React.
• Vì sao giá trị input luôn do State kiểm soát?
  - Dữ liệu hiển thị trong ô nhập được ấn định bởi thuộc tính: value={stateValue}.
  - Người dùng không thể tự ý thay đổi nội dung nếu không kích hoạt hàm cập nhật state.
  - Khi người dùng gõ phím, sự kiện onChangeText={(text) => setStateValue(text)} được kích hoạt.
  - Hàm setState cập nhật state mới -> kích hoạt re-render -> giá trị mới từ state được truyền ngược lại vào thuộc tính value của TextInput.
  - Đây là luồng dữ liệu một chiều khép kín (One-way Data Binding), biến state thành "Nguồn chân lý duy nhất" (Single Source of Truth).`,
  },
  {
    id: 4,
    title: 'Câu 4: Lợi Ích Của Controlled Component',
    short: 'Đồng bộ dữ liệu, kiểm tra real-time, validation và cập nhật giao diện',
    content: `1. Đồng bộ dữ liệu (Single Source of Truth):
   Dữ liệu luôn được lưu trữ tập trung tại State. Bất kỳ component hay hàm nào cũng có thể truy xuất giá trị hiện tại ngay lập tức mà không cần truy vấn tham chiếu DOM/Native Ref.

2. Dễ kiểm tra dữ liệu nhập (Real-time Feedback):
   Có thể can thiệp vào quá trình nhập: tự động chuyển chữ hoa, lọc bỏ ký tự đặc biệt, định dạng tiền tệ hoặc số điện thoại ngay trong khi người dùng đang gõ.

3. Dễ thực hiện Validation:
   Kiểm tra tính hợp lệ của từng trường (rỗng, định dạng email, độ dài mật khẩu) ngay lập tức hoặc khi nhấn Submit. Tự động hiển thị/ẩn lỗi dưới từng ô input.

4. Dễ cập nhật giao diện theo State:
   Dễ dàng kích hoạt hoặc vô hiệu hóa nút Submit (disable button khi form chưa đủ điều kiện), đổi màu viền ô input khi có lỗi, đếm số ký tự nhập, reset toàn bộ form chỉ bằng 1 dòng lệnh setState.`,
  },
  {
    id: 5,
    title: 'Câu 5: Component Lồng Component (Composition)',
    short: 'Tách giao diện thành Avatar, UserProfile và lợi ích quản lý, tái sử dụng',
    content: `• Khái niệm: Component lồng component (Component Nesting / Composition) là kỹ thuật ghép các component con nhỏ hơn vào bên trong một component cha để tạo thành giao diện hoàn chỉnh có cấu trúc cây phân cấp (Cây Component Hierarchy).
Ví dụ:
   App ➔ UserProfileList ➔ UserProfile ➔ Avatar

• Vì sao việc tách nhỏ giúp dễ quản lý, tái sử dụng và mở rộng?
1. Dễ quản lý (Maintainability & Single Responsibility): Mỗi component chỉ đảm nhận một trách nhiệm duy nhất (Avatar lo hiển thị ảnh đại diện, UserProfile lo thông tin cá nhân). Khi có lỗi, dễ dàng khoanh vùng và sửa chữa.
2. Dễ tái sử dụng (Reusability): Component Avatar có thể tái sử dụng ở vô số vị trí khác trong ứng dụng (Header, Comment, Chat, Danh sách bạn bè) chỉ bằng cách truyền props tương ứng.
3. Dễ mở rộng (Scalability): Khi cần thêm tính năng (như huy hiệu VIP cho Avatar), ta chỉ cần cập nhật bên trong Avatar.js mà không làm ảnh hưởng đến UserProfile hay các màn hình khác.`,
  },
];

const LyThuyetView = () => {
  const [expandedId, setExpandedId] = useState(1);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PHẦN A • LÝ THUYẾT VÒNG ĐỜI & CONTROLLED COMPONENT</Text>
        </View>
        <Text style={styles.title}>Tổng Hợp 5 Câu Hỏi Lý Thuyết</Text>
        <Text style={styles.subtitle}>
          Chạm vào từng câu hỏi để xem chi tiết câu trả lời chuyên sâu và mã nguồn minh họa.
        </Text>
      </View>

      {theoryQuestions.map((item) => {
        const isExpanded = expandedId === item.id;
        return (
          <View key={item.id} style={styles.questionCard}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => toggleExpand(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.titleContainer}>
                <Text style={styles.questionTitle}>{item.title}</Text>
                <Text style={styles.questionShort}>{item.short}</Text>
              </View>
              <Text style={styles.arrowIcon}>{isExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.cardBody}>
                <Text style={styles.contentParagraph}>{item.content}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 8,
  },
  badgeText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '700',
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
    lineHeight: 18,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F8FAFC',
  },
  titleContainer: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 3,
  },
  questionShort: {
    fontSize: 12,
    color: '#64748B',
  },
  arrowIcon: {
    fontSize: 14,
    color: '#2563EB',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  contentParagraph: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 21,
    fontFamily: 'monospace',
  },
});

export default LyThuyetView;
