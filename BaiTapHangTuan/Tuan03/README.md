Sinh Viên : BÙI QUANG DUY , LÊ DUY LINH

A. CÂU HỎI ÔN TẬP LÝ THUYẾT
Câu 1: Khái niệm Điều hướng (Navigation) trong ứng dụng Mobile & Thư viện React Navigation
• Khái niệm Điều hướng trên nền tảng Di động (Mobile Navigation):
Khác với môi trường trình duyệt Web vốn quản lý các trang thông qua địa chỉ URL và cơ chế tải lại (Routing / Browser History), trên hệ điều hành di động, điều hướng được quản lý dựa trên mô hình ngăn xếp giao diện (Screen Stack). Các màn hình được xếp chồng lên nhau; khi người dùng tiến vào một tính năng mới, một màn hình sẽ được "đẩy" (Push) lên đỉnh ngăn xếp, và khi nhấn nút Quay lại (Back), màn hình hiện tại sẽ được "lấy ra" (Pop) để lộ lại màn hình nằm ngay bên dưới.

• Thư viện React Navigation và vai trò của NavigationContainer:
React Navigation là giải pháp điều hướng tiêu chuẩn cộng đồng cho React Native. Trọng tâm của kiến trúc này là thành phần `<NavigationContainer>`:
- Đóng vai trò là thành phần gốc (Root Provider) bao bọc toàn bộ cây điều hướng của ứng dụng.
- Quản lý trạng thái điều hướng tập trung (Navigation State), xử lý thao tác phím Back phần cứng trên Android và liên kết sâu (Deep Linking).

• Bảng so sánh 3 bộ điều hướng cốt lõi (Navigators) trong React Navigation:
Tiêu chí	Native Stack Navigator (@react-navigation/native-stack)	Bottom Tabs Navigator (@react-navigation/bottom-tabs)	Drawer Navigator (@react-navigation/drawer)
Cơ chế hiển thị	Sử dụng trực tiếp các thành phần ngăn xếp gốc của hệ điều hành (UINavigationController trên iOS, FragmentManager trên Android).	Sử dụng JavaScript để dựng thanh điều hướng dạng tab cố định ở cạnh dưới màn hình.	Dựng một bảng chọn trượt ra từ mép cạnh màn hình (trái hoặc phải) bằng cử chỉ vuốt hoặc bấm nút menu.
Hiệu năng & Trải nghiệm	Hiệu năng tối đa đạt chuẩn Native 60-120 FPS; các hiệu ứng chuyển cảnh, vuốt cạnh để back (Swipe to go back) hoàn toàn mượt mà.	Hiệu năng ổn định, giữ các màn hình tab trong bộ nhớ để chuyển đổi qua lại tức thời mà không phải tải lại dữ liệu.	Đòi hỏi thư viện cử chỉ `react-native-gesture-handler` và `react-native-reanimated`, có thể tốn bộ nhớ nếu cây menu phức tạp.
Cấu trúc tương tác	Phù hợp cho luồng phân cấp sâu: Danh sách -> Chi tiết -> Chỉnh sửa. Màn hình mới che phủ toàn bộ màn hình trước.	Phù hợp cho các phân hệ tính năng ngang hàng chính của ứng dụng (cùng cấp độ, từ 3 - 5 mục).	Phù hợp cho menu điều hướng phụ, danh mục tài khoản, cài đặt chuyên sâu hoặc ứng dụng nhiều tính năng mở rộng.
Ứng dụng trong App Ghi chú	Điều hướng từ Màn hình danh sách (`HomeScreen`) sang Màn hình soạn thảo (`AddEditNoteScreen`) và Xem chi tiết (`NoteDetailScreen`).	Phân chia giữa: "Tất cả ghi chú", "Ghi chú đã ghim", "Thùng rác", "Cài đặt".	Bảng danh mục các nhãn/thư mục (Labels/Folders) mở rộng như trong Google Keep.

Câu 2: Cơ chế truyền tham số (Passing Params) & Nhận phản hồi dữ liệu giữa các màn hình
• Quy trình truyền dữ liệu từ màn hình gửi sang màn hình nhận:
1. Màn hình gửi (Sender Screen): Sử dụng đối tượng `navigation` được truyền qua props hoặc qua hook `useNavigation()`, gọi phương thức `navigate` kèm đối tượng tham số:
   ```javascript
   navigation.navigate('AddEditNote', { noteId: 'n_101', mode: 'edit' });
   ```
2. Màn hình nhận (Receiver Screen): Tiếp nhận thông qua prop `route.params` hoặc sử dụng hook `useRoute()`:
   ```javascript
   const route = useRoute();
   const { noteId, mode } = route.params || {};
   ```

• Cơ chế nhận phản hồi/kết quả từ màn hình con về lại màn hình cha:
Trong React Navigation, để màn hình con gửi dữ liệu đã tạo hoặc cập nhật ngược về màn hình cha trước đó, có 2 giải pháp kỹ thuật chính:
1. Truyền hàm Callback qua Params (Truyền thông điệp trực tiếp): Màn hình cha truyền một hàm xử lý (như `onNoteSaved`) vào params khi mở màn hình con. Màn hình con sau khi xử lý xong sẽ gọi hàm này trước khi đóng màn hình (`navigation.goBack()`).
2. Gọi `navigation.navigate('ParentScreen', { updatedData })`: Khi gọi lệnh này từ màn hình con, React Navigation sẽ quay lại màn hình cha và đồng thời cập nhật lại giá trị mới vào `route.params` của màn hình cha. Màn hình cha dùng `useEffect` để theo dõi `route.params?.updatedData` và cập nhật lại state giao diện.

• Quy tắc an toàn dữ liệu (Best Practices) khi truyền Route Params:
- Chỉ truyền dữ liệu định danh (Primitive IDs / Metadata nhẹ): Không nên truyền toàn bộ một đối tượng dữ liệu khổng lồ (như danh sách 500 ghi chú hoặc dữ liệu hình ảnh nhị phân dạng base64) qua `params`. Điều này làm giảm hiệu năng tuần tự hóa và gây tốn bộ nhớ.
- Dữ liệu có thể tuần tự hóa (Serializable): React Navigation khuyến cáo không nên truyền các đối tượng phức tạp không thể chuyển thành JSON (như class instance, hàm callback phức tạp) vì sẽ phá vỡ khả năng lưu trạng thái (State Persistence) và cơ chế Deep Linking của ứng dụng.

Câu 3: Vòng đời màn hình (Screen Lifecycle) trong Stack Navigator & Hook useFocusEffect
• Sự khác biệt cốt lõi về vòng đời màn hình giữa Mobile Stack và Web:
- Trên Web: Khi người dùng chuyển từ Trang A sang Trang B, Trang A sẽ bị hủy hoàn toàn khỏi DOM (Unmount). Khi quay lại Trang A, component được gắn mới (Mount) từ đầu, kích hoạt lại `useEffect(() => {}, [])`.
- Trong Mobile Stack Navigator: Khi chuyển từ Màn hình A sang Màn hình B, Màn hình A KHÔNG hề bị Unmount. Nó vẫn tiếp tục tồn tại ngầm trong bộ nhớ RAM và nằm bên dưới Màn hình B trong ngăn xếp. Khi người dùng bấm nút Back ở Màn hình B để quay về A, Màn hình A chỉ đơn thuần được "đưa trở lại tầm nhìn" (Focus) chứ không trải qua chu kỳ Mount mới.

• Hạn chế của useEffect trong trường hợp này:
Nếu lập trình viên tải dữ liệu danh sách ghi chú bằng `useEffect` với mảng phụ thuộc rỗng:
```javascript
useEffect(() => {
  loadNotesFromStorage();
}, []);
```
Hàm này sẽ CHỈ CHẠY 1 LẦN DUY NHẤT khi ứng dụng khởi chạy. Khi người dùng sang màn hình `AddEditNoteScreen` tạo ghi chú mới rồi Back về, `HomeScreen` không hề re-mount, dẫn đến việc danh sách ghi chú không hề được cập nhật nội dung mới.

• Giải pháp với Hook useFocusEffect kết hợp useCallback:
Thư viện React Navigation cung cấp hook `useFocusEffect` chuyên dụng:
- Hook này sẽ được kích hoạt mỗi khi màn hình người dùng đang xem nhận được quyền lấy nét (Focused), bao gồm cả lần đầu mở màn hình lẫn khi quay lại từ các màn hình khác trong ngăn xếp.
- Bắt buộc phải bọc hàm xử lý bên trong `useCallback` để tránh tạo lại hàm liên tục gây vòng lặp render vô tận:
```javascript
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(
  React.useCallback(() => {
    let isActive = true;
    const fetchNotes = async () => {
      const data = await noteStorage.getAllNotes();
      if (isActive) setNotes(data);
    };
    fetchNotes();

    return () => {
      isActive = false; // Hàm cleanup khi màn hình bị blur (rời khỏi tầm nhìn)
    };
  }, [])
);
```

Câu 4: Vấn đề che khuất giao diện do bàn phím ảo (Keyboard Overlapping) và kỹ thuật xử lý
• Bản chất vấn đề:
Bàn phím mềm (Soft Keyboard) trên điện thoại thông minh là một thành phần nổi của hệ điều hành. Khi người dùng chạm vào ô nhập liệu (`TextInput`), bàn phím xuất hiện và có thể chiếm từ 40% đến 55% diện tích màn hình. Nếu không có cơ chế xử lý giao diện thích ứng:
- Ô nhập liệu nội dung ghi chú ở nửa dưới màn hình sẽ bị bàn phím che kín hoàn toàn, người dùng không thể nhìn thấy chữ mình đang gõ.
- Nút "Lưu ghi chú" hoặc thanh công cụ định dạng bị đẩy ra ngoài tầm nhìn hoặc bị che mất.
- Khác biệt nền tảng: Android có cơ chế cấu hình `windowSoftInputMode` trong manifest giúp tự động co giao diện, trong khi iOS mặc định bàn phím sẽ nổi đè lên toàn bộ giao diện mà không tự dịch chuyển nội dung.

• Thành phần KeyboardAvoidingView và các chế độ behavior:
React Native cung cấp thành phần `<KeyboardAvoidingView>` tự động tính toán chiều cao bàn phím để điều chỉnh vùng hiển thị:
1. `behavior="padding"`: Tự động cộng thêm một khoảng đệm (`paddingBottom`) bằng đúng chiều cao của bàn phím. Đây là lựa chọn tối ưu và hoạt động chuẩn xác nhất trên hệ điều hành iOS.
2. `behavior="height"`: Tự động co rút chiều cao của chính view bọc lại để nhường không gian cho bàn phím. Thường được ưa chuộng và tương thích tốt trên hệ điều hành Android.
3. `behavior="position"`: Dịch chuyển tọa độ vị trí toàn bộ view lên phía trên theo chiều cao bàn phím. Thích hợp cho các form đăng nhập hoặc modal nhỏ.

• Mô hình phối hợp chuẩn để đạt trải nghiệm nhập liệu hoàn hảo:
Một màn hình soạn thảo văn bản chuẩn UX trên Mobile phải kết hợp bộ 3 thành phần:
- `<TouchableWithoutFeedback onPress={Keyboard.dismiss}>`: Cho phép người dùng chạm ngón tay vào bất kỳ khoảng trống nào ngoài ô nhập liệu để tự động ẩn bàn phím.
- `<KeyboardAvoidingView>`: Điều chỉnh không gian hiển thị tự động theo nền tảng (`Platform.OS === 'ios' ? 'padding' : 'height'`).
- `<ScrollView keyboardShouldPersistTaps="handled">`: Đảm bảo nội dung luôn có thể cuộn tự do khi bàn phím đang mở và các thao tác chạm vào nút bấm không bị bàn phím nuốt mất (dismiss tap).

Câu 5: Lưu trữ dữ liệu cục bộ với @react-native-async-storage/async-storage
• Khái niệm & Đặc điểm của AsyncStorage:
`AsyncStorage` là giải pháp lưu trữ dữ liệu dạng khóa - giá trị (Key-Value Storage), bất đồng bộ (Asynchronous) và bền bỉ (Persistent) được cộng đồng tách ra thành thư viện độc lập từ core React Native. Dữ liệu được ghi vào bộ nhớ flash của thiết bị di động (sử dụng RocksDB/SQLite trên Android và các file từ điển/tệp tin nối tiếp trên iOS), giúp thông tin không bị biến mất khi người dùng tắt ứng dụng hoặc khởi động lại máy.

• Bảng so sánh giữa localStorage (Web) và AsyncStorage (React Native):
Tiêu chí	localStorage (Trình duyệt Web)	AsyncStorage (React Native)
Cơ chế thực thi	Đồng bộ (Synchronous): Việc đọc/ghi dữ liệu diễn ra chặn (blocking) luồng thực thi chính của trình duyệt cho đến khi hoàn tất.	Bất đồng bộ (Asynchronous): Mọi thao tác đều trả về một `Promise` và sử dụng cơ chế `async/await`, hoàn toàn không gây khựng giao diện (non-blocking).
Môi trường lưu trữ	Trình duyệt web (lưu theo từng Origin tên miền).	Bộ nhớ cục bộ gốc của thiết bị di động (Sandbox lưu trữ độc lập của ứng dụng).
Giới hạn dung lượng	Mặc định khoảng 5MB cho mỗi domain.	Mặc định khoảng 6MB trên Android (có thể mở rộng kích thước qua file cấu hình), không giới hạn cứng trên iOS ngoài dung lượng trống của máy.
Kiểu dữ liệu hỗ trợ	Chỉ lưu trữ chuỗi văn bản (String).	Chỉ lưu trữ chuỗi văn bản (String). Mọi đối tượng Object/Array đều phải tuần tự hóa.
Hỗ trợ thao tác hàng loạt	Không có (phải lặp từng key thủ công).	Có sẵn các API hàng loạt tối ưu cao: `multiGet`, `multiSet`, `multiRemove`.

• Quy trình chuyển đổi dữ liệu khi lưu trữ:
- Khi ghi dữ liệu (Save): Phải chuyển đổi mảng/đối tượng JavaScript sang chuỗi JSON bằng `JSON.stringify()`:
  ```javascript
  await AsyncStorage.setItem('@notes_key', JSON.stringify(notesArray));
  ```
- Khi đọc dữ liệu (Read): Phải giải mã chuỗi JSON ngược về đối tượng JavaScript bằng `JSON.parse()` kèm khối xử lý ngoại lệ `try...catch`:
  ```javascript
  const jsonValue = await AsyncStorage.getItem('@notes_key');
  const notesArray = jsonValue != null ? JSON.parse(jsonValue) : [];
  ```

---

B. BÀI TẬP LUYỆN TẬP THỰC HÀNH
Bài tập 1: Phân tích & Thiết kế Sơ đồ luồng điều hướng (Navigation Flow) và Cấu trúc thư mục dự án chuẩn
• Phân tích luồng nghiệp vụ của Ứng dụng Ghi chú (Note App):
1. Khởi động ứng dụng -> Màn hình chính (`HomeScreen`):
   - Hiển thị danh sách các thẻ ghi chú bằng `FlatList`.
   - Cung cấp thanh tìm kiếm và bộ lọc nhanh theo danh mục (Tag pills).
   - Nút hành động nổi (FAB) có biểu tượng dấu cộng (+) để tạo ghi chú mới.
2. Từ `HomeScreen` -> Màn hình tạo mới (`AddEditNoteScreen` với `mode: 'create'`):
   - Người dùng bấm nút FAB. Ứng dụng kích hoạt hiệu ứng chuyển cảnh trượt từ phải sang trái (`slide_from_right`).
   - Màn hình hiển thị biểu mẫu trắng sẵn sàng để nhập tiêu đề và nội dung.
3. Từ `HomeScreen` -> Màn hình xem chi tiết / chỉnh sửa:
   - Người dùng chạm vào một thẻ ghi chú trong danh sách. Ứng dụng chuyển sang `AddEditNoteScreen` (với `mode: 'edit'` và truyền toàn bộ dữ liệu của ghi chú đó qua params) để người dùng xem và chỉnh sửa trực tiếp.
4. Lưu và quay lại:
   - Sau khi người dùng bấm nút "Lưu", ứng dụng ghi dữ liệu vào bộ nhớ cục bộ và thực thi lệnh `navigation.goBack()` để rút màn hình soạn thảo ra khỏi ngăn xếp, đưa người dùng về lại màn hình danh sách với dữ liệu đã được làm mới tức thì.

• Cấu trúc thư mục dự án chuẩn hóa theo mô hình phân tầng (Layered Architecture):
```text
notes-app-react-native/
├── assets/                  # Chứa hình ảnh, biểu tượng, font chữ tĩnh
├── src/
│   ├── constants/           # Các biến hằng số (Màu sắc Colors, Phông chữ, Theme)
│   │   ├── colors.js
│   │   └── categories.js
│   ├── components/          # Các thành phần giao diện con tái sử dụng
│   │   ├── NoteCard.js      # Thẻ hiển thị ghi chú đơn lẻ
│   │   ├── SearchBar.js     # Thanh tìm kiếm ghi chú
│   │   └── CategoryPill.js  # Nút lọc danh mục ghi chú
│   ├── screens/             # Các màn hình chính trong ứng dụng
│   │   ├── HomeScreen.js           # Màn hình danh sách ghi chú
│   │   └── AddEditNoteScreen.js    # Màn hình tạo mới và chỉnh sửa ghi chú
│   ├── navigation/          # Cấu hình cây điều hướng toàn ứng dụng
│   │   └── AppNavigator.js
│   ├── services/            # Xử lý logic đọc/ghi dữ liệu và API
│   │   └── noteStorage.js   # Module tương tác với AsyncStorage
│   └── utils/               # Các hàm tiện ích (Format ngày tháng, cắt ngắn chuỗi)
│       └── dateHelper.js
├── App.js                   # Điểm khởi chạy gốc của ứng dụng (Root Component)
├── app.json                 # Cấu hình ứng dụng Expo/React Native
└── package.json             # Danh sách các thư viện phụ thuộc
```

Bài tập 2: Đoạn phân tích kỹ thuật: Giải pháp xử lý trải nghiệm nhập liệu & Cảnh báo mất dữ liệu (Unsaved Changes Warning)
Trong các ứng dụng ghi chú cá nhân, một trong những tình huống gây ức chế lớn nhất cho người dùng là việc mất dữ liệu do thao tác vô ý. Người dùng đang soạn thảo một đoạn ghi chú dài, nhưng vô tình quẹt tay vào cử chỉ vuốt cạnh mép (Swipe back) của iOS hoặc nhấn phím Back vật lý trên điện thoại Android, dẫn đến việc màn hình đóng lại và toàn bộ nội dung vừa gõ biến mất hoàn toàn.

Để giải quyết triệt để rủi ro này, giải pháp kỹ thuật tối ưu là tích hợp cơ chế phát hiện thay đổi dữ liệu chưa lưu kết hợp sự kiện `beforeRemove` do React Navigation cung cấp:
1. Nhận diện trạng thái chưa lưu (`hasUnsavedChanges`):
   - Màn hình duy trì một biến trạng thái logic `hasUnsavedChanges` (hoặc so sánh trực tiếp giá trị của `title` và `content` hiện tại với giá trị gốc ban đầu được truyền vào qua `route.params`).
   - Bất kỳ khi nào người dùng gõ thêm ký tự, cờ này sẽ được đặt thành `true`. Khi người dùng chủ động bấm nút "Lưu ghi chú" thành công, cờ được đặt lại về `false`.
2. Can thiệp vào luồng hủy màn hình bằng sự kiện beforeRemove:
   - Đăng ký lắng nghe sự kiện `navigation.addListener('beforeRemove', (e) => { ... })`.
   - Khi hành động thoát màn hình được kích hoạt, hệ thống sẽ kiểm tra cờ `hasUnsavedChanges`. Nếu người dùng chưa chỉnh sửa gì hoặc đã bấm lưu xong, sự kiện thoát sẽ diễn ra bình thường.
   - Ngược lại, nếu phát hiện có dữ liệu mới chưa được lưu, ứng dụng sẽ lập tức can thiệp bằng lệnh `e.preventDefault()` để tạm dừng quá trình rút màn hình (Pop stack), đồng thời kích hoạt hộp thoại cảnh báo Native `Alert.alert`:
     * Lựa chọn 1: "Tiếp tục chỉnh sửa" (Hủy bỏ lệnh thoát, giữ nguyên trạng thái soạn thảo).
     * Lựa chọn 2: "Hủy thay đổi" (Chấp nhận thoát và bỏ qua dữ liệu vừa nhập thông qua lệnh `navigation.dispatch(e.data.action)`).
3. Hiệu quả trải nghiệm (UX):
   - Đảm bảo dữ liệu của người dùng luôn được bảo vệ ở mức tối đa.
   - Tạo cảm giác an tâm, chuyên nghiệp chuẩn mực của các ứng dụng ghi chú cao cấp như Apple Notes hay Google Keep.

Bài tập 3: Mô tả sơ đồ cây điều hướng (Navigation Tree) dạng ASCII & Đoạn mã cấu hình Stack Navigator
1. Sơ đồ cấu trúc cây điều hướng (Navigation Tree) dạng ASCII:
```text
+-------------------------------------------------------------------------+
|                        NavigationContainer                              |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |                  NativeStackNavigator (RootStack)                |  |
|  |                                                                   |  |
|  |  +---------------------------+     Push      +-----------------+  |  |
|  |  |        HomeScreen         | ------------> | AddEditNote     |  |  |
|  |  |                           |               |                 |  |  |
|  |  | - Danh sách ghi chú       | <------------ | - Form nhập     |  |  |
|  |  | - Thanh tìm kiếm          |   Pop (Back)  | - Chọn category |  |  |
|  |  | - Nút FAB Tạo mới (+)     |               | - Nút Lưu/Thoát |  |  |
|  |  +---------------------------+               +-----------------+  |  |
|  |                                                                   |  |
|  +-------------------------------------------------------------------+  |
+-------------------------------------------------------------------------+
```

2. Đoạn mã React Native cấu hình ngăn xếp điều hướng chuẩn mực (`src/navigation/AppNavigator.js`):
```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import AddEditNoteScreen from '../screens/AddEditNoteScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4F46E5', // Tông màu tím Indigo hiện đại
          },
          headerTintColor: '#FFFFFF',   // Màu chữ và nút Back trên Header
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
          animation: 'slide_from_right', // Hiệu ứng lướt ngang mượt mà chuẩn di động
        }}
      >
        {/* Màn hình chính: Danh sách Ghi chú */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Sổ Tay Ghi Chú',
            headerLargeTitle: false,
          }}
        />

        {/* Màn hình Soạn thảo: Tạo mới hoặc Sửa Ghi chú */}
        <Stack.Screen
          name="AddEditNote"
          component={AddEditNoteScreen}
          options={({ route }) => ({
            title: route.params?.note ? 'Chỉnh Sửa Ghi Chú' : 'Tạo Ghi Chú Mới',
            headerBackTitle: 'Quay lại',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

Bài tập 4: Đề xuất & Xây dựng Module lưu trữ dữ liệu ghi chú ngoại tuyến (Note Storage Service)
Mã nguồn dịch vụ `src/services/noteStorage.js` hoàn chỉnh, đóng gói toàn bộ các hàm thao tác dữ liệu ngoại tuyến với `AsyncStorage`, áp dụng đầy đủ cơ chế an toàn và xử lý ngoại lệ:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Khóa định danh lưu trữ duy nhất của ứng dụng ghi chú
const STORAGE_KEY = '@notes_app_storage_v1';

// Dữ liệu mẫu ban đầu xuất hiện khi người dùng mới cài đặt ứng dụng
const INITIAL_NOTES = [
  {
    id: 'note_1',
    title: 'Chào mừng đến với NoteApp!',
    content: 'Ứng dụng ghi chú đa nền tảng viết bằng React Native. Bạn có thể thêm, sửa, xóa và lọc ghi chú dễ dàng.',
    category: 'Chung',
    createdAt: '2026-09-01 08:30',
    updatedAt: '2026-09-01 08:30',
  },
  {
    id: 'note_2',
    title: 'Ôn tập React Native Tuần 3',
    content: 'Hoàn thành bài tập lý thuyết về React Navigation, KeyboardAvoidingView và module AsyncStorage.',
    category: 'Học tập',
    createdAt: '2026-09-05 14:15',
    updatedAt: '2026-09-05 14:15',
  },
];

export const noteStorage = {
  /**
   * Lấy toàn bộ danh sách ghi chú từ bộ nhớ thiết bị
   */
  getAllNotes: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) {
        return JSON.parse(jsonValue);
      }
      // Nếu là lần đầu mở app, lưu và trả về dữ liệu khởi tạo mặc định
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTES));
      return INITIAL_NOTES;
    } catch (error) {
      console.error('Lỗi khi đọc danh sách ghi chú:', error);
      return [];
    }
  },

  /**
   * Lưu thêm một ghi chú mới vào đầu danh sách
   */
  saveNote: async (newNoteData) => {
    try {
      const currentNotes = await noteStorage.getAllNotes();
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      
      const createdNote = {
        id: 'note_' + Date.now().toString(),
        title: newNoteData.title.trim(),
        content: newNoteData.content.trim(),
        category: newNoteData.category || 'Chung',
        createdAt: now,
        updatedAt: now,
      };

      // Thêm bản ghi mới lên đầu mảng
      const updatedNotes = [createdNote, ...currentNotes];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      return createdNote;
    } catch (error) {
      console.error('Lỗi khi thêm ghi chú mới:', error);
      throw error;
    }
  },

  /**
   * Cập nhật nội dung một ghi chú đã có theo ID
   */
  updateNote: async (updatedNoteData) => {
    try {
      const currentNotes = await noteStorage.getAllNotes();
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

      const updatedNotes = currentNotes.map((item) => {
        if (item.id === updatedNoteData.id) {
          return {
            ...item,
            title: updatedNoteData.title.trim(),
            content: updatedNoteData.content.trim(),
            category: updatedNoteData.category || item.category,
            updatedAt: now,
          };
        }
        return item;
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật ghi chú:', error);
      throw error;
    }
  },

  /**
   * Xóa vĩnh viễn một ghi chú khỏi bộ nhớ theo ID
   */
  deleteNote: async (noteId) => {
    try {
      const currentNotes = await noteStorage.getAllNotes();
      const filteredNotes = currentNotes.filter((item) => item.id !== noteId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa ghi chú:', error);
      throw error;
    }
  },
};

export default noteStorage;
```

• Thuyết minh kiến trúc kỹ thuật của Module `noteStorage`:
1. Tính đóng gói (Encapsulation): Toàn bộ logic tương tác cấp thấp với `AsyncStorage` (như cấu trúc khóa, chuyển đổi JSON chuỗi) đều được gom gọn vào module `noteStorage`. Các màn hình giao diện không cần biết dữ liệu được lưu bằng cách nào, chỉ cần gọi các hàm nghiệp vụ cấp cao (`getAllNotes`, `saveNote`).
2. An toàn dữ liệu & Khởi tạo ban đầu (Fallback): Khi người dùng mới mở ứng dụng lần đầu, hàm `getAllNotes` tự động nhận diện giá trị `null` và tạo ngay bộ dữ liệu mẫu khởi tạo, giúp giao diện không bị trống rỗng.
3. Cơ chế Bất đồng bộ (Async/Await) & Xử lý lỗi: Mọi hàm đều được bọc bên trong khối `try...catch` cẩn thận, ngăn chặn nguy cơ ứng dụng bị văng (crash) đột ngột nếu thiết bị gặp sự cố hết dung lượng bộ nhớ.

Bài tập 5: Xây dựng Màn hình hoàn chỉnh: Màn hình Thêm & Chỉnh sửa Ghi chú (AddEditNoteScreen.js)
Mã nguồn thành phần `AddEditNoteScreen.js` hoàn chỉnh áp dụng toàn bộ kiến thức về:
- Đón nhận tham số `route.params` để tự động chuyển đổi giữa chế độ Tạo mới và Chỉnh sửa.
- Tùy biến nút bấm "Lưu" trực tiếp trên thanh tiêu đề thông qua `navigation.setOptions`.
- Bọc ngoài bằng `KeyboardAvoidingView` và `TouchableWithoutFeedback` chống che khuất bàn phím.
- Cơ chế cảnh báo mất dữ liệu chưa lưu với sự kiện `beforeRemove`.
- Tích hợp gọi dịch vụ `noteStorage` để lưu trữ dữ liệu thật.

```javascript
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import noteStorage from '../services/noteStorage';

// Danh sách thể loại ghi chú định sẵn
const CATEGORIES = ['Chung', 'Công việc', 'Học tập', 'Cá nhân', 'Ý tưởng'];

const AddEditNoteScreen = ({ navigation, route }) => {
  // Lấy dữ liệu ghi chú từ params (nếu có thì là chế độ Sửa, ngược lại là Tạo mới)
  const existingNote = route.params?.note;
  const isEditMode = Boolean(existingNote);

  // Quản lý trạng thái dữ liệu biểu mẫu
  const [title, setTitle] = useState(existingNote ? existingNote.title : '');
  const [content, setContent] = useState(existingNote ? existingNote.content : '');
  const [category, setCategory] = useState(existingNote ? existingNote.category : 'Chung');

  // Kiểm tra xem dữ liệu có sự thay đổi so với ban đầu hay không
  const hasChanges = isEditMode
    ? title !== existingNote.title || content !== existingNote.content || category !== existingNote.category
    : title.trim().length > 0 || content.trim().length > 0;

  // Xử lý lưu ghi chú
  const handleSave = useCallback(async () => {
    if (title.trim() === '') {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập tiêu đề cho ghi chú!');
      return;
    }

    try {
      if (isEditMode) {
        await noteStorage.updateNote({
          id: existingNote.id,
          title,
          content,
          category,
        });
      } else {
        await noteStorage.saveNote({
          title,
          content,
          category,
        });
      }
      // Lưu thành công -> Quay lại màn hình danh sách
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi lưu trữ', 'Không thể lưu ghi chú vào bộ nhớ thiết bị.');
    }
  }, [title, content, category, isEditMode, existingNote, navigation]);

  // Cấu hình nút "Lưu" nằm ngay trên thanh Header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} style={styles.headerSaveButton} activeOpacity={0.8}>
          <Text style={styles.headerSaveButtonText}>Lưu</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSave]);

  // Cảnh báo người dùng khi thoát màn hình mà có dữ liệu chưa lưu
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Nếu không có thay đổi nào, cho phép thoát tự nhiên
      if (!hasChanges) {
        return;
      }

      // Ngăn chặn hành vi thoát mặc định
      e.preventDefault();

      Alert.alert(
        'Bỏ thay đổi?',
        'Bạn có những thay đổi chưa được lưu. Bạn có chắc chắn muốn thoát không?',
        [
          { text: 'Ở lại tiếp tục', style: 'cancel', onPress: () => {} },
          {
            text: 'Bỏ thay đổi',
            style: 'destructive',
            // Thực hiện tiếp tục hành động thoát bị trì hoãn
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, hasChanges]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Ô nhập tiêu đề ghi chú */}
          <TextInput
            style={styles.inputTitle}
            placeholder="Tiêu đề ghi chú..."
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
            maxLength={120}
            autoFocus={!isEditMode}
            returnKeyType="next"
          />

          {/* Thanh chọn phân loại danh mục */}
          <View style={styles.categoryContainer}>
            <Text style={styles.sectionLabel}>Phân loại:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                    onPress={() => setCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Ô nhập nội dung chi tiết nhiều dòng */}
          <View style={styles.contentInputWrapper}>
            <TextInput
              style={styles.inputBody}
              placeholder="Bắt đầu viết nội dung ghi chú ở đây..."
              placeholderTextColor="#9CA3AF"
              value={content}
              onChangeText={setContent}
              multiline={true}
              textAlignVertical="top"
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },
  headerSaveButton: {
    backgroundColor: '#3730A3',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  headerSaveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  inputTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 10,
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryPillActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  categoryPillText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  categoryPillTextActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  contentInputWrapper: {
    minHeight: 250,
  },
  inputBody: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    paddingVertical: 8,
    minHeight: 200,
  },
});

export default AddEditNoteScreen;
```

• Thuyết minh kiến trúc kỹ thuật của Component AddEditNoteScreen:
1. Đa năng hóa chế độ hiển thị (Two-in-one Screen):
   - Màn hình linh hoạt kiểm tra tham số `route.params?.note`. Nếu tồn tại, component lập tức nạp dữ liệu cũ vào state để phục vụ chế độ "Chỉnh sửa". Nếu không, component hiển thị các trường nhập trắng tinh khôi ở chế độ "Tạo mới".
2. Tích hợp Header Action với useLayoutEffect:
   - Thay vì tốn diện tích màn hình để đặt nút "Lưu" ở cuối trang, màn hình đưa nút Lưu trực tiếp lên góc phải của thanh Header hệ thống (`navigation.setOptions`). Việc sử dụng `useLayoutEffect` kết hợp `useCallback` giúp nút bấm luôn được đồng bộ tức thì với state mới nhất mà không bị nhấp nháy giao diện.
3. Xử lý bàn phím và phản xạ xúc giác mượt mà:
   - Bao bọc màn hình bằng `KeyboardAvoidingView` với tham số `behavior` thích ứng theo từng hệ điều hành (`iOS: padding`, `Android: height`).
   - Bổ sung `TouchableWithoutFeedback` gọi `Keyboard.dismiss` để người dùng có thể chạm vào khoảng trống bất kỳ để đóng bàn phím mà không cần bấm phím Done.
4. Cơ chế bảo vệ dữ liệu thông minh (Data Guard):
   - Quản lý cờ `hasChanges` theo thời gian thực và can thiệp sự kiện `beforeRemove`, giúp người dùng không bao giờ bị mất dữ liệu ngoài ý muốn khi chạm nhầm nút Back.
