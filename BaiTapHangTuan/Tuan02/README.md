Sinh Viên : BÙI QUANG DUY , LÊ DUY LINH

A. CÂU HỎI ÔN TẬP LÝ THUYẾT
Câu 1: Khái niệm Core Components trong React Native & So sánh với HTML trên Web
• Khái niệm Core Components: Là tập hợp các thành phần giao diện cơ bản do React Native cung cấp sẵn. Khi ứng dụng biên dịch và chạy trên thiết bị, React Native không render ra các thẻ HTML trên nền webview mà tự động ánh xạ (mapping) trực tiếp các Core Components này thành các thành phần giao diện gốc (Native UI Widgets) tương ứng của từng hệ điều hành (Android và iOS).
• Bảng đối chiếu thành phần giữa Web (HTML) và React Native:
HTML (Web)	React Native Component	Thành phần Android gốc	Thành phần iOS gốc
<div>	<View>	android.view.ViewGroup	UIView
<p>, <span>, <h1>-<h6>	<Text>	android.widget.TextView	UILabel / UITextView
<img>	<Image>	android.widget.ImageView	UIImageView
<input type="text">	<TextInput>	android.widget.EditText	UITextField
<div> (có overflow: scroll)	<ScrollView>	android.widget.ScrollView	UIScrollView
Danh sách dữ liệu lớn	<FlatList>	androidx.recyclerview.widget.RecyclerView	UICollectionView / UITableView
<button>	<TouchableOpacity> / <Pressable>	android.view.View (kèm Ripple)	UIView (kèm Alpha Animation)
• Điểm khác biệt và quy tắc bắt buộc so với Web:
•	Bắt buộc dùng <Text>: Trong React Native, toàn bộ nội dung văn bản (chuỗi string) bắt buộc phải được bọc bên trong thẻ <Text>. Nếu đặt text tự do trực tiếp trong <View>, ứng dụng sẽ báo lỗi runtime ngay lập tức.
•	Không tự động kế thừa Style: Trên nền Web, các thuộc tính CSS như font-size, color thường tự động kế thừa từ phần tử cha xuống phần tử con. Trong React Native, cơ chế kế thừa này không tồn tại giữa các component khác nhau (ngoại trừ trường hợp thẻ <Text> lồng bên trong một thẻ <Text> khác).

Câu 2: Cơ chế định kiểu (Styling) trong React Native & Vai trò của StyleSheet.create
• Cách thức viết Style trong React Native:
React Native không sử dụng các file `.css` độc lập và không áp dụng bộ chọn CSS (selectors như class, id, tag). Thay vào đó, lập trình viên định nghĩa kiểu dáng bằng các đối tượng JavaScript (JavaScript Objects). Tên các thuộc tính được chuẩn hóa theo định dạng lạc đà (`camelCase`), ví dụ: `backgroundColor` thay vì `background-color`, `fontSize` thay vì `font-size`, `paddingHorizontal` thay vì `padding-left` & `padding-right`.
• So sánh Inline Styles và StyleSheet.create:
•	Inline Styles: Viết đối tượng style trực tiếp vào thuộc tính của component (ví dụ: `style={{ padding: 16, backgroundColor: '#FFFFFF' }}`). Cách này tiện lợi khi cần thử nghiệm nhanh hoặc truyền style phụ thuộc vào biến động, nhưng có nhược điểm lớn: mỗi khi component re-render, một đối tượng JavaScript mới lại được cấp phát trong bộ nhớ, làm tăng tải cho bộ thu gom rác (Garbage Collector).
•	StyleSheet.create: Gom toàn bộ khai báo giao diện vào một đối tượng tập trung đặt bên ngoài phạm vi của hàm Component. Mã nguồn được tổ chức ngăn nắp, dễ đọc và tách bạch rõ ràng giữa phần logic xử lý và phần giao diện.
• Cơ chế tối ưu hiệu năng của StyleSheet.create:
1. Đánh chỉ mục ID tĩnh (Style ID): Khi ứng dụng khởi chạy, `StyleSheet.create` sẽ đăng ký các thuộc tính style vào một bảng ánh xạ nội bộ và trả về một mã định danh số nguyên (ID) duy nhất đại diện cho nhóm thuộc tính đó.
2. Tiết kiệm băng thông qua Bridge / JSI: Thay vì phải tuần tự hóa (serialize) toàn bộ một đối tượng style phức tạp gửi qua luồng Native mỗi khi component cập nhật giao diện, React Native chỉ cần truyền mã ID tĩnh. Điều này giúp giảm thiểu đáng kể chi phí giao tiếp giữa JavaScript Thread và Native Thread.

Câu 3: Bố cục giao diện với Flexbox trên Mobile & Khác biệt cốt lõi so với Web CSS
• Nguyên lý Flexbox trong React Native:
React Native tích hợp bộ công cụ Yoga Layout (thư viện mã nguồn mở viết bằng C++ do Meta phát triển) nhằm tính toán tọa độ và kích thước của các phần tử con trên màn hình dựa trên mô hình hộp Flexbox.
• Các thuộc tính bố cục cốt lõi:
•	flexDirection: Xác định hướng của trục chính (Main Axis). Gồm các giá trị: `'column'` (dọc), `'row'` (ngang), `'column-reverse'`, `'row-reverse'`.
•	justifyContent: Định vị và phân bổ các phần tử con dọc theo trục chính. Gồm: `'flex-start'`, `'center'`, `'flex-end'`, `'space-between'`, `'space-around'`, `'space-evenly'`.
•	alignItems: Định vị và căn lề các phần tử con dọc theo trục phụ (Cross Axis). Gồm: `'stretch'`, `'flex-start'`, `'center'`, `'flex-end'`, `'baseline'`.
•	flex: Một giá trị số thực thể hiện tỉ lệ co giãn không gian trống mà phần tử được phép chiếm dụng so với các phần tử anh em có cùng phần tử cha.
• Ba điểm khác biệt cốt lõi so với CSS Flexbox trên Web:
1. Trục chính mặc định là Hàng dọc (column): Trên trình duyệt Web, `flexDirection` mặc định là `'row'`. Ngược lại, trong React Native mặc định là `'column'` để hoàn toàn tương thích với tỷ lệ hiển thị theo chiều dọc chuẩn của điện thoại thông minh.
2. Đơn vị đo lường (Density-independent Pixels): React Native không sử dụng các đơn vị đo của web như `px`, `em`, `rem`, `vw`, `vh`. Mọi giá trị kích thước số nguyên đều là điểm ảnh độc lập thiết bị (dp trên Android, pt trên iOS), tự động co giãn theo mật độ điểm ảnh của từng màn hình phần cứng.
3. Cú pháp thuộc tính flex tối giản: React Native không hỗ trợ bộ ba gộp `flex: flex-grow flex-shrink flex-basis` như CSS web. Thuộc tính `flex` trong React Native chỉ nhận một giá trị số thực dương hoặc 0 để phân chia tỉ lệ layout.

Câu 4: Bảng so sánh giữa <ScrollView> và <FlatList> trong React Native
Tiêu chí	<ScrollView>	<FlatList>
Cơ chế hiển thị (Rendering)	Eager Rendering: Khởi tạo và render toàn bộ các phần tử con cùng một lúc ngay từ lần đầu tải, kể cả các phần tử nằm ngoài màn hình.	Lazy Rendering / Virtualization: Chỉ render các phần tử thực sự hiển thị trong tầm nhìn (viewport) và một lượng nhỏ đệm; tự động tái sử dụng view khi cuộn.
Tiêu thụ bộ nhớ (RAM)	Tăng tuyến tính theo độ dài danh sách. Khi dữ liệu lớn, tiêu tốn rất nhiều RAM và dễ dẫn tới lỗi tràn bộ nhớ (Out Of Memory).	Duy trì mức tiêu thụ RAM ổn định và thấp, không phụ thuộc vào độ dài hàng nghìn phần tử của danh sách.
Hiệu năng khung hình (FPS)	Dễ xảy ra hiện tượng giật, khựng, sụt giảm khung hình nghiêm trọng khi danh sách vượt quá 50 - 100 phần tử.	Duy trì ổn định mức 60 FPS mượt mà nhờ cơ chế cửa sổ cuộn ảo (Windowing).
Tính năng tích hợp sẵn	Chỉ cung cấp khung cuộn đơn giản. Lập trình viên phải tự viết thêm tính năng phân trang, kéo làm mới.	Tích hợp sẵn nhiều thuộc tính tối ưu: `keyExtractor`, kéo để làm mới (`onRefresh`, `refreshing`), tải trang vô tận (`onEndReached`), Header, Footer, Separator, Empty view.
Trường hợp sử dụng tối ưu	Giao diện nội dung tĩnh, độ dài ngắn và cố định: Form đăng ký/đăng nhập, màn hình giới thiệu, màn hình cài đặt cá nhân.	Danh sách dữ liệu động, số lượng phần tử lớn hoặc không thể đoán trước được trả về từ API: Danh sách ghi chú, newfeed tin tức, danh mục sản phẩm.

Câu 5: Quản lý trạng thái (State), Props và Xử lý sự kiện (Event Handling) trong React Native
• Phân biệt Props và State:
•	Props (Properties): Là các tham số dữ liệu được truyền từ Component cha xuống Component con. Props mang tính bất biến (read-only) đối với Component con, giúp các component con hoạt động như những khối giao diện độc lập có thể tái sử dụng ở nhiều nơi.
•	State: Là dữ liệu nội bộ được lưu giữ bên trong component, có tính biến thiên theo thời gian dựa vào các tương tác của người dùng hoặc phản hồi từ server. Khi giá trị State thay đổi thông qua hàm setter của hook `useState`, React Native sẽ lập tức kích hoạt chu kỳ re-render để cập nhật lại giao diện tương ứng.
• Luồng dữ liệu một chiều (Unidirectional Data Flow):
Dữ liệu trong ứng dụng luôn di chuyển theo một chiều duy nhất từ trên xuống dưới (từ Component cha xuống con thông qua Props). Khi người dùng phát sinh hành động tương tác (bấm nút, nhập văn bản) tại Component con, Component con sẽ gọi hàm callback nhận được từ cha để yêu cầu cha cập nhật lại State, qua đó đồng bộ lại toàn bộ nhánh giao diện.
• So sánh các thành phần tương tác chạm (Touchables):
•	<Button>: Thành phần nút bấm cơ bản nhất do hệ thống cung cấp. Giao diện bị phụ thuộc hoàn toàn vào kiểu dáng mặc định của Android và iOS, khó tùy chỉnh các thuộc tính như màu nền phức tạp, bán kính bo góc hay chèn icon.
•	<TouchableOpacity>: Thành phần bọc tương tác linh hoạt nhất. Khi người dùng chạm ngón tay vào màn hình, độ mờ (`opacity`) của component sẽ giảm tức thì tạo phản hồi xúc giác tự nhiên, hỗ trợ tùy biến style không giới hạn.
•	<Pressable>: Thành phần tương tác hiện đại được khuyến nghị trong các phiên bản React Native mới. Cung cấp bộ lắng nghe sự kiện đa dạng (`onPressIn`, `onPressOut`, `onLongPress`), cho phép truyền hàm để đổi style linh hoạt theo trạng thái chạm (`pressed`), đồng thời hỗ trợ hiệu ứng sóng nước (Ripple Effect) chuẩn Material Design trên nền tảng Android.

B. BÀI TẬP LUYỆN TẬP THỰC HÀNH
Bài tập 1: Phân tích & Bóc tách bố cục giao diện màn hình "Danh sách Ghi chú" (Note List Screen)
• Ứng dụng phân tích: Màn hình chính của Ứng dụng Ghi chú cá nhân (đề tài Bài tập lớn của môn học).
• Bóc tách cấu trúc cây thành phần (Component Hierarchy):
•	Vùng chứa an toàn (SafeAreaView): Đóng vai trò gốc (root), giữ toàn bộ nội dung nằm trong khu vực hiển thị an toàn, tránh bị che khuất bởi tai thỏ (Notch) hoặc thanh điều hướng.
•	Khối tiêu đề (Header Bar): Bố trí theo chiều ngang (`flexDirection: 'row'`) gồm tiêu đề "Ghi chú của tôi" (<Text>) và nút tạo ghi chú nhanh (<TouchableOpacity>).
•	Thanh tìm kiếm (Search Bar): Gồm khung viền bo góc chứa biểu tượng kính lúp và ô nhập liệu văn bản (<TextInput>) để lọc ghi chú tức thời theo từ khóa.
•	Danh sách hiển thị (Note List): Thành phần <FlatList> quản lý hiển thị các thẻ ghi chú con (<NoteCardItem>).
•	Nút hành động nổi (Floating Action Button - FAB): Nút tròn mang dấu cộng (+) đặt cố định ở góc dưới bên phải màn hình thông qua thuộc tính `position: 'absolute'`.
• Phân tích Flexbox ứng dụng trong từng phần:
•	Container tổng thể: Sử dụng `flex: 1` và `backgroundColor: '#F8F9FA'` để chiếm trọn toàn bộ chiều cao màn hình thiết bị.
•	Khối Header Bar: Áp dụng `flexDirection: 'row'`, `justifyContent: 'space-between'`, `alignItems: 'center'` nhằm đẩy tiêu đề sang lề trái và nút bấm sang lề phải một cách cân đối.
•	Thẻ ghi chú con (NoteCardItem): Áp dụng `flexDirection: 'column'`, `padding: 14`, `borderRadius: 12`, `marginBottom: 12` và thiết lập đổ bóng (`elevation: 3` cho Android, kết hợp `shadowOffset` và `shadowOpacity: 0.1` cho iOS) nhằm tạo độ nổi chiều sâu thị giác.

Bài tập 2: Đoạn phân tích kỹ thuật và giải pháp tối ưu hiệu năng cuộn danh sách lớn
Trong các ứng dụng di động như Sổ tay ghi chú hay Quản lý công việc, số lượng bản ghi của người dùng có xu hướng tích lũy liên tục theo thời gian, dễ dàng đạt ngưỡng hàng trăm hoặc hàng nghìn mục.

Nếu lập trình viên sử dụng <ScrollView> kết hợp hàm `.map()` để dựng giao diện danh sách, ứng dụng sẽ nhanh chóng gặp sự cố hiệu năng nghiêm trọng. Nguyên nhân cốt lõi là do <ScrollView> buộc hệ thống phải khởi tạo và giữ toàn bộ cây Native Views của 1.000 phần tử trong bộ nhớ RAM, ngay cả khi người dùng chỉ nhìn thấy 5 đến 7 ghi chú trên màn hình tại một thời điểm. Điều này dẫn đến thời gian mở ứng dụng kéo dài (lâu hơn 3 - 5 giây), hiện tượng sụt giảm khung hình đột ngột khi vuốt nhanh (FPS rơi từ 60 xuống dưới 20) và nguy cơ bị hệ điều hành tắt đột ngột (crash) do tràn RAM.

Để giải quyết triệt để bài toán này, giải pháp tối ưu là chuyển dịch sang sử dụng <FlatList> kết hợp các kỹ thuật tinh chỉnh tham số:
1. `keyExtractor={(item) => item.id.toString()}`: Cung cấp định danh duy nhất cho từng bản ghi, hỗ trợ thuật toán Virtual DOM so sánh chính xác phần tử nào bị thêm/sửa/xóa mà không phải vẽ lại toàn bộ danh sách.
2. `initialNumToRender={8}`: Giới hạn chỉ dựng đủ số lượng thẻ ghi chú lấp đầy khung hình đầu tiên, giúp rút ngắn thời gian sẵn sàng tương tác (Time-to-Interactive) của ứng dụng xuống dưới 150ms.
3. `maxToRenderPerBatch={10}` & `windowSize={5}`: Kiểm soát số lượng phần tử được vẽ thêm trong mỗi đợt cuộn và thu hẹp cửa sổ đệm ảo hóa, giúp giữ mức tiêu thụ RAM luôn ở ngưỡng an toàn dưới 80MB.
4. Áp dụng `React.memo` cho từng thẻ `NoteCardItem`: Ngăn chặn việc render lại các thẻ ghi chú cũ khi chỉ có một thẻ mới được thêm vào hoặc cập nhật trạng thái.

Bài tập 3: Mô tả sơ đồ cây phân cấp Component (Component Tree) & Đoạn mã minh họa Flexbox
1. Sơ đồ cây phân cấp Component (Component Tree) dạng ASCII:
+-------------------------------------------------------------------------+
|                  SafeAreaView (Container chính - flex: 1)               |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  | Header (View - flexDirection: 'row', justifyContent: 'space-betw')|  |
|  |  [Text: 'Ghi Chú Cá Nhân']        [Touch: Nút Lọc / Đổi View]     |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  | SearchBar (View - flexDirection: 'row', alignItems: 'center')     |  |
|  |  [Image: SearchIcon]  [TextInput: 'Tìm kiếm tiêu đề ghi chú...']  |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  | NoteList (FlatList - flex: 1)                                     |  |
|  |  +-------------------------------------------------------------+  |  |
|  |  | NoteCardItem (TouchableOpacity - flexDirection: 'column')   |  |  |
|  |  |  +-------------------------------------------------------+  |  |  |
|  |  |  | CardHeader (View: row): [Text: Tiêu đề] [Touch: Ghim] |  |  |  |
|  |  |  +-------------------------------------------------------+  |  |  |
|  |  |  | CardBody (View): [Text: Đoạn trích nội dung tóm tắt]  |  |  |  |
|  |  |  +-------------------------------------------------------+  |  |  |
|  |  |  | CardFooter (View: row): [Tag: 'Công việc'] [Text: Date]|  |  |  |
|  |  |  +-------------------------------------------------------+  |  |  |
|  |  +-------------------------------------------------------------+  |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
|  [FloatingActionButton (Touch: position: 'absolute', bottom: 24, right)]|
+-------------------------------------------------------------------------+

2. Đoạn mã React Native minh họa cấu trúc và Bố cục Flexbox thẻ ghi chú:
```javascript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const NoteCard = ({ title, preview, date, category }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{category}</Text>
        </View>
      </View>
      <Text style={styles.previewText} numberOfLines={2}>{preview}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    // Đổ bóng trên iOS
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    // Đổ bóng trên Android
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '600',
  },
  previewText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dateText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});

export default NoteCard;
```

Bài tập 4: Đề xuất giải pháp thiết kế giao diện thích ứng đa kích thước màn hình (Responsive Design)
• Thách thức thực tế:
Thị trường thiết bị di động sở hữu độ phân giải vô cùng đa dạng, từ các mẫu điện thoại cỡ nhỏ (iPhone SE), màn hình tỷ lệ siêu dài (Android 20:9), đến các dòng máy tính bảng (iPad/Tablet) và sự xuất hiện của các thiết kế phần cứng đặc thù như phần khuyết tai thỏ (Notch), Dynamic Island hay thanh điều hướng vuốt.
• Bốn chiến lược thiết kế thích ứng toàn diện:
1. Đảm bảo khu vực an toàn với SafeAreaView:
Tích hợp `SafeAreaView` từ thư viện `react-native-safe-area-context` làm khung viền gốc cho mọi màn hình. Giải pháp này tự động tính toán kích thước phần khuyết viền (insets) để đệm giao diện, tránh tình trạng thanh trạng thái (Status Bar) hoặc tai thỏ đè lên nội dung thanh tiêu đề và các nút thao tác.
2. Nguyên tắc bố cục co giãn linh hoạt bằng Flexbox:
Tuyệt đối tránh gán giá trị kích thước tĩnh tuyệt đối (như `width: 380`, `height: 750`). Thay vào đó, sử dụng thuộc tính `flex: 1`, khoảng cách lề theo tỷ lệ phần trăm hoặc `alignSelf: 'stretch'` để các thành phần giao diện tự động dàn đều theo không gian hiển thị thực tế của từng thiết bị.
3. Đo lường kích thước thời gian thực với useWindowDimensions:
Sử dụng Hook `useWindowDimensions()` để lắng nghe sự thay đổi về chiều rộng (`width`) và chiều cao (`height`) của màn hình ngay khi người dùng xoay ngang hoặc dọc thiết bị. Khi chiều rộng vượt ngưỡng 600dp (môi trường máy tính bảng), giao diện danh sách ghi chú sẽ tự động chuyển đổi cấu hình `FlatList` từ dạng danh sách đơn 1 cột (`numColumns={1}`) sang dạng lưới 2 hoặc 3 cột (`numColumns={3}`) nhằm tận dụng tối đa diện tích màn hình lớn.
4. Chuẩn hóa tỷ lệ font chữ và khoảng cách đệm (Scale Factor):
Xây dựng hàm tính toán tỷ lệ co giãn dựa trên độ rộng màn hình chuẩn thiết kế (ví dụ chuẩn 375px của iPhone X). Các giá trị cỡ chữ (`fontSize`) và khoảng cách đệm (`padding`, `margin`) sẽ được nhân với hệ số co giãn tương ứng, giúp giao diện hiển thị đồng nhất, không bị quá to trên máy tính bảng hoặc quá nhỏ trên điện thoại mini.

Bài tập 5: Xây dựng Component hoàn chỉnh: Thẻ ghi chú tương tác (Interactive NoteItem Component)
Mã nguồn thành phần `NoteItem.js` hoàn chỉnh áp dụng đầy đủ kiến thức về Core Components, StyleSheet, Quản lý State với Hook `useState` và bắt sự kiện chạm:

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const NoteItem = ({ id, initialTitle, content, date, category, onDelete, onUpdate }) => {
  // Quản lý trạng thái hoàn thành ghi chú
  const [isCompleted, setIsCompleted] = useState(false);
  // Quản lý chế độ chỉnh sửa tiêu đề trực tiếp
  const [isEditing, setIsEditing] = useState(false);
  // Lưu giữ nội dung tiêu đề đang chỉnh sửa
  const [title, setTitle] = useState(initialTitle);

  // Xử lý bật/tắt trạng thái hoàn thành
  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted);
  };

  // Lưu tiêu đề sau khi chỉnh sửa
  const handleSaveTitle = () => {
    if (title.trim() === '') {
      Alert.alert('Thông báo', 'Tiêu đề không được để trống!');
      return;
    }
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(id, title);
    }
  };

  // Xác nhận xóa ghi chú
  const handleDeletePrompt = () => {
    Alert.alert(
      'Xóa ghi chú',
      'Bạn có chắc chắn muốn xóa ghi chú này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => onDelete(id) },
      ]
    );
  };

  return (
    <View style={[styles.container, isCompleted && styles.containerCompleted]}>
      {/* Vùng chọn đánh dấu hoàn thành */}
      <TouchableOpacity
        style={[styles.checkbox, isCompleted && styles.checkboxActive]}
        onPress={handleToggleComplete}
        activeOpacity={0.7}
      >
        {isCompleted && <Text style={styles.checkmarkText}>✓</Text>}
      </TouchableOpacity>

      {/* Vùng nội dung chính của thẻ ghi chú */}
      <View style={styles.contentWrapper}>
        <View style={styles.headerRow}>
          {isEditing ? (
            <TextInput
              style={styles.inputEdit}
              value={title}
              onChangeText={setTitle}
              autoFocus
              onBlur={handleSaveTitle}
              onSubmitEditing={handleSaveTitle}
            />
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={styles.titleTouchArea}
            >
              <Text
                style={[styles.title, isCompleted && styles.titleCompleted]}
                numberOfLines={1}
              >
                {title}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category || 'Chung'}</Text>
          </View>
        </View>

        <Text
          style={[styles.bodyText, isCompleted && styles.bodyCompleted]}
          numberOfLines={2}
        >
          {content}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.dateText}>{date}</Text>
          <TouchableOpacity onPress={handleDeletePrompt} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.deleteButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 16,
    alignItems: 'flex-start',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  containerCompleted: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    opacity: 0.75,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  contentWrapper: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleTouchArea: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  inputEdit: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    borderBottomWidth: 1.5,
    borderBottomColor: '#4F46E5',
    paddingVertical: 0,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  categoryText: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '600',
  },
  bodyText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 8,
  },
  bodyCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
});

export default NoteItem;
```

• Thuyết minh kiến trúc kỹ thuật của Component NoteItem:
1. Props nhận vào: Component đón nhận các dữ liệu cấu hình như `id`, `initialTitle`, `content`, `date`, `category`, cùng các hàm callback xử lý nghiệp vụ (`onDelete`, `onUpdate`). Việc này giúp `NoteItem` là một component thuần túy (pure presentational component), có thể tái sử dụng dễ dàng trong bất kỳ danh sách nào.
2. Quản lý trạng thái nội bộ (State):
•	`isCompleted`: Kiểm soát trạng thái hoàn thành. Khi thay đổi, tự động kích hoạt gạch ngang chữ (`textDecorationLine: 'line-through'`) và chuyển đổi màu sắc của checkbox cũng như nền thẻ.
•	`isEditing` & `title`: Chuyển đổi linh hoạt giữa việc hiển thị dạng văn bản thông thường (<Text>) và ô nhập liệu sửa nhanh (<TextInput>) khi người dùng chạm vào tiêu đề.
3. Xử lý sự kiện (Event Handling): Sử dụng sự kiện `onPress` trên <TouchableOpacity> để kích hoạt hành vi người dùng, `onChangeText` để đồng bộ ký tự gõ vào state, và `Alert.alert` để hiển thị hộp thoại xác nhận hủy bản ghi chuẩn Native của Android/iOS.
