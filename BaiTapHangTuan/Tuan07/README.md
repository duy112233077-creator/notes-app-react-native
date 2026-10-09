# BÁO CÁO BÀI TẬP TUẦN 07 - REACT NATIVE
## CHỦ ĐỀ: VÒNG ĐỜI COMPONENT (LIFECYCLE), CONTROLLED COMPONENT & FORM VALIDATION

---

### 👤 THÔNG TIN SINH VIÊN THỰC HIỆN
* **Họ và tên:** Bùi Quang Duy - Lê Duy Linh
* **Mã sinh viên:** 11223077 - 11223078
* **Lớp:** Lớp 12325W.3
* **Chức danh:** Sinh viên / Lập trình viên React Native
* **Môn học:** Phát triển ứng dụng Di động đa nền tảng / React Native
* **Repository GitHub:** [https://github.com/duy112233077-creator/notes-app-react-native.git](https://github.com/duy112233077-creator/notes-app-react-native.git)
* **Thư mục bài tập:** `BaiTapHangTuan/Tuan07`

---

## MỤC LỤC BÁO CÁO
1. [Phần A: Câu hỏi ôn tập lý thuyết](#phần-a-câu-hỏi-ôn-tập-lý-thuyết)
   * [Câu 1: Vòng đời hoạt động của Component React Native](#câu-1-vòng-đời-hoạt-động-của-component-react-native)
   * [Câu 2: Sử dụng Hook useEffect mô phỏng vòng đời](#câu-2-sử-dụng-hook-useeffect-mô-phỏng-vòng-đời)
   * [Câu 3: Khái niệm Controlled Component trong React Native](#câu-3-khái-niệm-controlled-component-trong-react-native)
   * [Câu 4: Lợi ích của Controlled Component trong xử lý dữ liệu nhập](#câu-4-lợi-ích-của-controlled-component-trong-xử-lý-dữ-liệu-nhập)
   * [Câu 5: Khái niệm Component lồng Component (Nesting & Composition)](#câu-5-khái-niệm-component-lồng-component-nesting--composition)
2. [Phần B: Bài tập luyện tập thực hành](#phần-b-bài-tập-luyện-tập-thực-hành)
   * [Bài tập 1 (Mức dễ): Nhập họ tên người dùng với Controlled Component](#bài-tập-1-mức-dễ-nhập-họ-tên-người-dùng-với-controlled-component)
   * [Bài tập 2 (Mức trung bình): Danh sách hồ sơ người dùng bằng component lồng component](#bài-tập-2-mức-trung-bình-danh-sách-hồ-sơ-người-dùng-bằng-component-lồng-component)
   * [Bài tập 3 (Mức nâng cao): Màn hình Form đăng ký và Validation dữ liệu](#bài-tập-3-mức-nâng-cao-màn-hình-form-đăng-ký-và-validation-dữ-liệu)
3. [Hướng dẫn cài đặt và chạy ứng dụng](#hướng-dẫn-cài-đặt-và-chạy-ứng-dụng)
4. [Kết luận và đánh giá](#kết-luận-và-đánh-giá)

---

# PHẦN A: CÂU HỎI ÔN TẬP LÝ THUYẾT

---

### Câu 1.
**Em hãy trình bày các giai đoạn chính trong vòng đời hoạt động của một component React Native. Trong phần trả lời cần làm rõ ba giai đoạn: mounting, updating và unmounting; đồng thời nêu vai trò của render(), componentDidMount(), componentDidUpdate(), componentWillUnmount() đối với Class Component.**

#### 1. Ba giai đoạn chính trong vòng đời hoạt động (Lifecycle Phases):
Mỗi component trong React Native đều trải qua một chu trình sống từ lúc sinh ra, thay đổi trạng thái cho đến khi bị hủy bỏ khỏi giao diện người dùng. Chu trình này bao gồm 3 giai đoạn cốt lõi:

```text
 ┌────────────────┐       ┌────────────────┐       ┌──────────────────┐
 │ 1. MOUNTING    │  ──>  │ 2. UPDATING    │  ──>  │ 3. UNMOUNTING    │
 │ (Khởi tạo/Gắn) │       │ (Cập nhật UI)  │       │ (Tháo gỡ/Hủy bỏ) │
 └────────────────┘       └────────────────┘       └──────────────────┘
```

1. **Giai đoạn 1: Mounting (Gắn kết / Khởi tạo):**
   * **Bản chất:** Là giai đoạn một component được khởi tạo lần đầu tiên và được chèn vào cây phân cấp giao diện (Virtual DOM và chuyển đổi sang Native Views như `UIView` trên iOS hoặc `android.view.View` trên Android).
   * **Mục đích:** Khởi tạo giá trị State ban đầu, tải dữ liệu cấu hình, đăng ký các dịch vụ ngầm (timers, event listeners) và vẽ giao diện lần đầu tiên lên màn hình điện thoại.

2. **Giai đoạn 2: Updating (Cập nhật):**
   * **Bản chất:** Xảy ra mỗi khi component có sự thay đổi về dữ liệu đầu vào (`props`) hoặc dữ liệu trạng thái nội tại (`state`), hoặc khi component cha bị re-render.
   * **Mục đích:** Tính toán lại giao diện mới thông qua cơ chế so khớp DOM ảo (Reconciliation/Diffing algorithm) và cập nhật đúng phần tử Native View bị thay đổi trên màn hình mà không cần vẽ lại toàn bộ ứng dụng.

3. **Giai đoạn 3: Unmounting (Tháo gỡ / Hủy bỏ):**
   * **Bản chất:** Là giai đoạn component bị loại bỏ hoàn toàn khỏi cây phân cấp giao diện (ví dụ: người dùng chuyển sang màn hình khác, đóng một popup modal, hoặc một tab bị đóng).
   * **Mục đích:** Giải phóng tài nguyên hệ thống, hủy bỏ các tiến trình bất đồng bộ, dọn dẹp bộ nhớ nhằm tránh hiện tượng rò rỉ bộ nhớ (Memory Leak) và lỗi cố gắng gọi cập nhật state trên component đã bị hủy (`Can't perform a React state update on an unmounted component`).

---

#### 2. Vai trò của các phương thức vòng đời trong Class Component:

| Phương thức | Giai đoạn | Vai trò và Mục đích sử dụng | Những điều cần lưu ý |
| :--- | :--- | :--- | :--- |
| **`render()`** | Mounting & Updating | **Bắt buộc phải có**. Có nhiệm vụ phân tích props, state hiện tại và trả về cây phần tử JSX để React Native chuyển đổi thành giao diện Native. | **Phải là Pure Function (Hàm thuần khiết)**: Tuyệt đối không được gọi `this.setState()` trong `render()` vì sẽ gây ra vòng lặp vô tận (Infinite Loop). |
| **`componentDidMount()`** | Mounting | Được gọi **duy nhất 1 lần** ngay sau khi component đã mount thành công vào cây giao diện. | Thích hợp nhất để: Gọi API lấy dữ liệu từ server qua `fetch/axios`, thiết lập `setInterval/setTimeout`, đăng ký lắng nghe sự kiện (`AppState`, `Dimensions`, `Keyboard`). |
| **`componentDidUpdate(prevProps, prevState)`** | Updating | Được gọi ngay sau khi quá trình re-render hoàn tất do props hoặc state thay đổi. | Cho phép so sánh dữ liệu cũ (`prevProps`, `prevState`) với dữ liệu mới để quyết định có gọi lại API hay cập nhật dữ liệu tiếp hay không. **Nếu gọi `setState` ở đây, bắt buộc phải đặt trong câu lệnh điều kiện `if`**. |
| **`componentWillUnmount()`** | Unmounting | Được gọi **ngay trước khi** component bị tháo gỡ và hủy bỏ khỏi bộ nhớ. | Là nơi dọn dẹp (cleanup) toàn bộ: `clearInterval()`, hủy kết nối WebSocket, gỡ bỏ `addEventListener`, hủy các request mạng đang dở dang để bảo vệ tài nguyên thiết bị. |

---

### Câu 2.
**Em hãy giải thích cách sử dụng useEffect trong Functional Component để thay thế hoặc mô phỏng các hành vi tương ứng với vòng đời component. Hãy phân biệt trường hợp useEffect chạy một lần sau lần render đầu tiên, chạy lại khi state hoặc props thay đổi, và thực hiện cleanup khi component bị tháo gỡ.**

#### 1. Khái niệm và Vai trò của `useEffect`:
Trong Functional Component, React giới thiệu Hook `useEffect` nhằm xử lý các tác vụ phụ (Side Effects) như gọi API dữ liệu, tương tác trực tiếp với hệ điều hành, lắng nghe sự kiện phần cứng, thiết lập đồng hồ bấm giờ.  
`useEffect` thay thế hoàn toàn và tổng hợp sức mạnh của 3 hàm vòng đời truyền thống trong Class Component (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`) vào một API duy nhất, trực quan và dễ bảo trì.

Cú pháp tổng quát:
```javascript
useEffect(() => {
  // Thực thi tác vụ phụ (Side Effect logic)

  return () => {
    // Hàm dọn dẹp (Cleanup function)
  };
}, [dependencies]); // Mảng phụ thuộc (Dependency Array)
```

---

#### 2. Phân biệt 3 trường hợp sử dụng `useEffect`:

#### Trường hợp 1: Chạy một lần sau lần render đầu tiên (Mô phỏng `componentDidMount`)
* **Cú pháp:** Truyền mảng phụ thuộc rỗng: `[]`.
* **Cơ chế hoạt động:** React sẽ thực thi hàm callback bên trong effect đúng một lần sau khi component được mount lần đầu lên màn hình. Do mảng `[]` không có bất kỳ biến nào thay đổi ở các lần render tiếp theo, effect này sẽ không bao giờ chạy lại.
* **Ví dụ thực tế:** Gọi API tải danh sách hồ sơ người dùng từ máy chủ ngay khi mở màn hình:
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log('Component đã Mounted - Bắt đầu tải dữ liệu...');
    fetch('https://api.example.com/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []); // Mảng rỗng [] đảm bảo chỉ chạy duy nhất 1 lần khi khởi tạo

  return (
    <View>
      <Text>Tổng số người dùng: {users.length}</Text>
    </View>
  );
};
```

---

#### Trường hợp 2: Chạy lại khi State hoặc Props thay đổi (Mô phỏng `componentDidUpdate`)
* **Cú pháp:** Truyền các biến trạng thái hoặc thuộc tính vào mảng phụ thuộc: `[propA, stateB]`.
* **Cơ chế hoạt động:** Sau mỗi lần component re-render, React sẽ kiểm tra các phần tử trong mảng phụ thuộc. Nếu ít nhất một giá trị bị thay đổi (so sánh theo `Object.is`), effect sẽ được kích hoạt thực thi lại.
* **Lưu ý đặc biệt:** Nếu **không truyền mảng phụ thuộc** (bỏ trống tham số thứ hai `useEffect(() => { ... })`), effect sẽ chạy sau **MỌI** lần render.
* **Ví dụ thực tế:** Tự động lọc danh sách hoặc kiểm tra độ hợp lệ của mật khẩu mỗi khi người dùng thay đổi giá trị `password`:
```javascript
useEffect(() => {
  if (password.length > 0 && password.length < 6) {
    setPasswordWarning('Cảnh báo: Mật khẩu quá ngắn, cần ít nhất 6 ký tự!');
  } else {
    setPasswordWarning('');
  }
}, [password]); // Chỉ chạy lại khi giá trị state password thay đổi
```

---

#### Trường hợp 3: Thực hiện Cleanup khi Component bị tháo gỡ (Mô phỏng `componentWillUnmount`)
* **Cú pháp:** Trả về một hàm callback bên trong `useEffect`: `return () => { /* cleanup */ };`.
* **Cơ chế hoạt động:**
  1. Khi component bị tháo gỡ (unmount) khỏi màn hình, React sẽ gọi hàm cleanup này để giải phóng tài nguyên.
  2. Ngoài ra, nếu effect có chạy lại ở các lần render sau, React cũng sẽ gọi hàm cleanup của lần chạy trước đó trước khi thực thi effect mới, giúp ngăn chặn xung đột tác vụ.
* **Ví dụ thực tế:** Thiết lập đồng hồ đếm ngược và hủy bỏ interval khi người dùng thoát khỏi màn hình:
```javascript
useEffect(() => {
  // Khởi tạo tác vụ: Bắt đầu đếm giây
  const timer = setInterval(() => {
    setSeconds(prev => prev + 1);
  }, 1000);

  // Dọn dẹp (Cleanup): Hủy timer khi component bị Unmount
  return () => {
    console.log('Component bị Unmounted - Dọn dẹp bộ nhớ timer');
    clearInterval(timer);
  };
}, []);
```

---

### Câu 3.
**Em hãy trình bày khái niệm Controlled Component trong React Native. Vì sao nói giá trị của input trong Controlled Component luôn được kiểm soát bởi state của React? Hãy liên hệ với ví dụ sử dụng TextInput, value, onChangeText, useState và hàm cập nhật state.**

#### 1. Khái niệm Controlled Component trong React Native:
Trong React Native, **Controlled Component** (Thành phần được kiểm soát) là mô hình thiết kế giao diện nhập liệu (Form Inputs) trong đó dữ liệu của phần tử nhập (như `TextInput`) **không tự quản lý trạng thái nội bộ của nó**, mà giá trị của nó được ràng buộc trực tiếp và phụ thuộc hoàn toàn vào **State của React**.

Mô hình hoạt động theo nguyên lý **Luồng dữ liệu 1 chiều khép kín (One-way Data Flow)**:
```text
┌─────────────────┐       props: value        ┌─────────────────────────┐
│                 │  ──────────────────────>  │                         │
│   React State   │                           │        TextInput        │
│  (Single Source │  <──────────────────────  │     (Giao diện UI)      │
│    of Truth)    │    event: onChangeText    │                         │
└─────────────────┘                           └─────────────────────────┘
```

#### 2. Vì sao nói giá trị của input luôn được kiểm soát bởi State của React?
Nói giá trị của ô input luôn được kiểm soát bởi state của React bởi vì:
1. **Ô input không thể tự ý thay đổi giá trị độc lập:** Thuộc tính `value` của `TextInput` bị khóa cứng vào giá trị của biến state (`value={fullName}`). Nếu bạn gõ phím mà không có hàm cập nhật state, màn hình sẽ không hiển thị ký tự mới nào vì state chưa thay đổi.
2. **Mọi thao tác gõ phím đều phải xin phép State:** Khi người dùng nhấn một phím, sự kiện `onChangeText` được kích hoạt và truyền chuỗi ký tự mới cho hàm cập nhật state (`setFullName(text)`).
3. **State quyết định giao diện hiển thị:** Sau khi state được cập nhật, React kích hoạt chu trình re-render, tính toán lại và truyền giá trị mới từ state ngược trở lại vào thuộc tính `value` của `TextInput`.
4. **State là "Nguồn chân lý duy nhất" (Single Source of Truth):** Ở bất kỳ thời điểm nào, giá trị hiển thị trên ô nhập luôn bằng chính xác giá trị đang lưu trong bộ nhớ state, không có sự sai lệch giữa giao diện (UI) và dữ liệu logic (Data).

#### 3. Liên hệ ví dụ cụ thể trong React Native:
```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const ControlledInputExample = () => {
  // 1. Khai báo state quản lý giá trị của ô nhập liệu
  const [fullName, setFullName] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nhập họ và tên:</Text>

      {/* 2. Ràng buộc Controlled Component với value và onChangeText */}
      <TextInput
        style={styles.input}
        placeholder="Nhập tên của bạn..."
        value={fullName} // Giá trị luôn được điều khiển bởi state fullName
        onChangeText={(text) => setFullName(text)} // Sự kiện bắt và cập nhật state
      />

      {/* 3. Hiển thị lại giá trị ngay lập tức từ state */}
      <Text style={styles.feedback}>Bạn đã nhập: {fullName}</Text>
    </View>
  );
};
```
* **Phân tích luồng thực thi trong ví dụ:**
  * Giả sử người dùng gõ thêm chữ `'A'`:
    1. Sự kiện `onChangeText` kích hoạt với tham số `text = 'A'`.
    2. Hàm `setFullName('A')` được thực thi.
    3. State `fullName` chuyển từ `''` sang `'A'`.
    4. React thực hiện re-render component `ControlledInputExample`.
    5. Tại `TextInput`, thuộc tính `value` nhận giá trị mới `'A'`.
    6. Tại thẻ `Text`, hiển thị ngay nội dung: `"Bạn đã nhập: A"`.

---

### Câu 4.
**Em hãy phân tích lợi ích của Controlled Component trong việc xử lý dữ liệu nhập từ người dùng. Trong câu trả lời cần nêu được vì sao Controlled Component giúp đồng bộ dữ liệu, dễ kiểm tra dữ liệu nhập, dễ thực hiện validation và dễ cập nhật giao diện theo state.**

Controlled Component mang lại 4 lợi ích vượt trội so với Uncontrolled Component (sử dụng Ref để đọc dữ liệu từ phần tử gốc):

#### 1. Đồng bộ dữ liệu tập trung (Single Source of Truth):
* Trong các ứng dụng di động phức tạp, nhiều thành phần giao diện khác nhau có thể cùng cần sử dụng dữ liệu người dùng nhập (ví dụ: họ tên vừa hiển thị ở ô input, vừa hiển thị trên thanh Header, vừa hiển thị ở thẻ xem trước Card Preview).
* Khi dùng Controlled Component, dữ liệu luôn lưu trữ tập trung tại State của React. Mọi component con hoặc các phần tử giao diện khác đều có thể đọc giá trị này trực tiếp từ state bất cứ lúc nào mà không cần phải truy vấn tham chiếu DOM/Native Ref phức tạp.

#### 2. Dễ kiểm tra dữ liệu nhập theo thời gian thực (Real-time Data Formatting & Masking):
* Vì sự kiện `onChangeText` chặn trước khi dữ liệu được ghi vào state, lập trình viên có toàn quyền kiểm soát, lọc hoặc biến đổi dữ liệu trước khi hiển thị lại cho người dùng:
  * **Tự động chuyển đổi chữ hoa:** `onChangeText={(text) => setCode(text.toUpperCase())}`
  * **Lọc bỏ ký tự không hợp lệ:** Loại bỏ ký tự đặc biệt, chỉ cho phép nhập số cho ô số điện thoại hoặc CCCD: `text.replace(/[^0-9]/g, '')`.
  * **Định dạng tiền tệ tự động:** Tự động chèn dấu chấm phân cách hàng nghìn (ví dụ: `100.000 VNĐ`) ngay khi đang gõ.

#### 3. Dễ thực hiện Validation (Kiểm tra tính hợp lệ dữ liệu):
* Có thể kiểm tra lỗi ngay trong khi người dùng đang nhập liệu (Inline / On-change validation) hoặc khi người dùng hoàn tất (On-blur / Submit).
* Ví dụ: Khi người dùng gõ email, ta có thể chạy regex kiểm tra cú pháp ngay lập tức:
  ```javascript
  const handleEmailChange = (text) => {
    setEmail(text);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setEmailError('Email chưa đúng định dạng!');
    } else {
      setEmailError('');
    }
  };
  ```
* Nhờ đó, người dùng nhận được phản hồi ngay lập tức thay vì phải chờ bấm gửi form mới biết mình nhập sai.

#### 4. Dễ dàng cập nhật và điều khiển giao diện theo State (UI Reactive to State):
* **Bật/Tắt nút bấm Submit (Dynamic Button State):** Dễ dàng vô hiệu hóa nút gửi nếu các trường chưa hợp lệ:
  ```javascript
  <TouchableOpacity disabled={!isFormValid}> ... </TouchableOpacity>
  ```
* **Đổi màu viền và hiển thị icon cảnh báo:** Đổi viền TextInput sang màu đỏ khi có lỗi (`borderColor: hasError ? '#EF4444' : '#E2E8F0'`).
* **Đếm số ký tự nhập thời gian thực:** Hiển thị `fullName.length / 50` ký tự.
* **Xóa form (Reset) chỉ với một dòng code:** Muốn xóa trắng form sau khi gửi thành công, chỉ cần gọi `setFormData(initialValues)`, toàn bộ các ô nhập sẽ lập tức trống rỗng mà không cần can thiệp Native code.

---

### Câu 5.
**Em hãy giải thích khái niệm component lồng component trong React Native. Vì sao việc tách giao diện thành các component nhỏ như Avatar, UserProfile rồi lồng chúng lại với nhau giúp chương trình dễ quản lý, dễ tái sử dụng và dễ mở rộng hơn?**

#### 1. Khái niệm Component lồng Component (Component Composition / Hierarchy):
* **Định nghĩa:** Component lồng component (Component Nesting hay Component Composition) là kỹ thuật xây dựng giao diện người dùng bằng cách kết hợp, bao bọc các component nhỏ, chuyên biệt (con) vào bên trong các component lớn hơn (cha), tạo thành một **Cây phân cấp Component (Component Hierarchy Tree)**.
* **Mô hình lồng ghép thực tế trong bài tập:**
```text
[Màn hình App / Danh Sách Hồ Sơ] (Component Ông/Bà)
   └── [UserProfile Card #1] (Component Cha)
          └── [Avatar] (Component Con)
   └── [UserProfile Card #2] (Component Cha)
          └── [Avatar] (Component Con)
```
* **Cách thức giao tiếp:** Dữ liệu truyền từ component cấp cao xuống component cấp thấp thông qua **Props** (Properties) theo cơ chế một chiều từ trên xuống dưới (Top-down data flow).

---

#### 2. Vì sao việc tách giao diện nhỏ thành Avatar, UserProfile giúp ứng dụng tối ưu hơn?

#### A. Dễ quản lý mã nguồn (Maintainability & Single Responsibility Principle):
* **Nguyên tắc đơn nhiệm:** Mỗi component chỉ đảm nhận duy nhất một công việc cụ thể:
  * Component `Avatar`: Chỉ quan tâm đến việc tải ảnh đại diện, bo tròn kích thước, hiển thị chữ cái đại diện fallback nếu ảnh hỏng, và hiển thị chấm xanh online.
  * Component `UserProfile`: Chỉ quan tâm đến việc bố cục thẻ hồ sơ (tên, chức danh, bio, liên kết).
* **Dễ khoanh vùng lỗi:** Nếu ảnh đại diện bị méo hoặc không bo tròn, lập trình viên chỉ cần mở file `Avatar.js` để chỉnh sửa trong 30 giây, hoàn toàn không sợ làm hỏng logic của `UserProfile` hay `App.js`.

#### B. Dễ tái sử dụng tối đa (Reusability):
* Component con sau khi được đóng gói hoàn chỉnh có thể được sử dụng ở bất kỳ đâu trong toàn bộ dự án:
  * Component `Avatar` không chỉ dùng trong thẻ `UserProfile`, mà còn có thể tái sử dụng ngay trong:
    * Thanh tiêu đề (Header bar) hiển thị ảnh đại diện người dùng hiện tại.
    * Danh sách bình luận (Comments list) hiển thị avatar người bình luận.
    * Màn hình danh bạ / chat (Messenger list).
* Chỉ cần truyền các props khác nhau (`<Avatar imageUrl="..." size={40} />`), component sẽ hiển thị hoàn hảo ở mọi ngữ cảnh mà không cần viết lại mã giao diện.

#### C. Dễ mở rộng và phát triển tính năng mới (Scalability & Extensibility):
* Khi ứng dụng cần bổ sung tính năng mới (ví dụ: thêm viền kim loại cho tài khoản VIP, hoặc hiệu ứng rung khi avatar được nhấn), ta chỉ cần nâng cấp duy nhất bên trong `Avatar.js`.
* Toàn bộ các nơi đang sử dụng `Avatar` trong toàn bộ ứng dụng (bao gồm các thẻ `UserProfile`) sẽ tự động thừa hưởng tính năng mới này một cách đồng bộ mà không cần phải đi sửa từng màn hình.
* Giúp nhóm phát triển (Development Team) có thể phân chia công việc: Một lập trình viên tập trung làm `Avatar`, một người làm `UserProfile`, tăng tốc độ bàn giao sản phẩm.

---

# PHẦN B: BÀI TẬP LUYỆN TẬP THỰC HÀNH

---

## BÀI TẬP 1 (MỨC DỄ): NHẬP HỌ TÊN NGƯỜI DÙNG VỚI CONTROLLED COMPONENT

### 1. Mục tiêu và Yêu cầu:
* Xây dựng màn hình nhập họ tên bằng Functional Component.
* Khởi tạo `useState` để lưu trữ chuỗi họ tên.
* Ràng buộc hai chiều cho `TextInput` bằng thuộc tính `value` và sự kiện `onChangeText`.
* Hiển thị dòng chữ phản hồi thời gian thực: **“Bạn đã nhập: ...”**.
* Giải thích ngắn gọn cơ chế state quản lý dữ liệu.

### 2. Thiết kế Component `BaiTap1_ControlledInput.js`:
* Tệp: `BaiTapHangTuan/Tuan07/components/BaiTap1_ControlledInput.js`
* Giao diện gồm ô nhập đẹp mắt, nút xóa nhanh, đếm số ký tự và từ, cùng hộp thoại giải thích cơ chế State Management.

```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const BaiTap1_ControlledInput = () => {
  // State fullName quản lý giá trị của ô nhập
  const [fullName, setFullName] = useState('');

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Nhập Họ Tên Người Dùng</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Họ và tên của bạn:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập họ và tên (ví dụ: Bùi Quang Duy)..."
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
      </View>

      {/* Dòng Text phản hồi hiển thị nội dung đã nhập */}
      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>Kết quả phản hồi thời gian thực:</Text>
        <Text style={styles.resultContent}>
          Bạn đã nhập: <Text style={styles.resultHighlight}>{fullName ? fullName : '(Chưa có dữ liệu)'}</Text>
        </Text>
      </View>
    </View>
  );
};
```

### 3. Giải thích ngắn gọn vì sao dữ liệu nhập được gọi là dữ liệu do State quản lý:
> **Trả lời:**  
> Dữ liệu trong ô input được gọi là do State quản lý bởi vì ô `TextInput` không nắm quyền quyết định giá trị hiển thị bên trong nó. Thay vào đó, thuộc tính `value` được gán cố định bằng biến `fullName` của state. Khi người dùng thao tác bấm phím, chuỗi ký tự mới kích hoạt sự kiện `onChangeText`, gọi hàm `setFullName(text)` để đưa dữ liệu vào state. React sau đó re-render component và truyền dữ liệu mới nhất từ state vào thuộc tính `value` của `TextInput`. Dữ liệu hiển thị luôn bắt nguồn và được đồng bộ tuyệt đối từ State.

---

## BÀI TẬP 2 (MỨC TRUNG BÌNH): DANH SÁCH HỒ SƠ NGƯỜI DÙNG BẰNG COMPONENT LỒNG COMPONENT

### 1. Mục tiêu và Yêu cầu:
* Tạo component `Avatar` hiển thị ảnh đại diện (kèm fallback chữ cái đầu và chấm trạng thái online).
* Tạo component `UserProfile` nhận các props `name`, `bio`, `profileImage`, bên trong import và sử dụng component `Avatar`.
* Trong `App.js`, hiển thị ít nhất hai hồ sơ người dùng khác nhau.
* Giải thích luồng truyền dữ liệu từ cha sang con qua props và lợi ích của việc tách nhỏ component.

### 2. Cấu trúc Component:
1. **Component con cấp 2: `Avatar.js`**
   * Tệp: `BaiTapHangTuan/Tuan07/components/Avatar.js`
   * Nhận props: `imageUrl`, `name`, `size`, `isOnline`.
   * Hiển thị ảnh qua thẻ `<Image>` hoặc thẻ tròn fallback nếu không có ảnh hoặc ảnh lỗi.
2. **Component cấp 1: `UserProfile.js`**
   * Tệp: `BaiTapHangTuan/Tuan07/components/UserProfile.js`
   * Import `<Avatar />`.
   * Nhận props: `name`, `bio`, `profileImage`, `role`, `email`, `badgeColor`.
   * Truyền `imageUrl={profileImage}` và `name={name}` vào `<Avatar />`.
3. **Màn hình danh sách: `BaiTap2_UserProfileList.js` & `App.js`**
   * Chứa danh sách dữ liệu người dùng (Bùi Quang Duy, Lê Duy Linh, Nguyễn Văn Minh).
   * Lặp qua mảng bằng phương thức `.map()` và render các thẻ `<UserProfile />`.

### 3. Trích đoạn mã nguồn chính:
```javascript
// UserProfile.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Avatar from './Avatar';

const UserProfile = ({ name, bio, profileImage, role, email }) => {
  return (
    <View style={styles.card}>
      {/* Lồng component Avatar và truyền props */}
      <Avatar imageUrl={profileImage} name={name} size={64} isOnline={true} />
      <View style={styles.infoSection}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.roleText}>{role}</Text>
        <Text style={styles.bioText}>{bio}</Text>
      </View>
    </View>
  );
};
```

### 4. Giải thích cơ chế truyền dữ liệu & Lợi ích:
* **Cơ chế truyền dữ liệu:** Dữ liệu chảy 1 chiều từ trên xuống dưới (Top-Down Props Passing):
  1. `App / UserProfileList` nắm giữ mảng dữ liệu người dùng `usersList`.
  2. Khi render, `App` truyền các thuộc tính `name`, `bio`, `profileImage` vào `<UserProfile />` thông qua JSX Props.
  3. `UserProfile` đón nhận props và tiếp tục truyền `profileImage` xuống thuộc tính `imageUrl` của component con `<Avatar />`.
* **Lợi ích:**
  * **Tái sử dụng:** `Avatar` có thể mang sang dùng ở Header hoặc Chat.
  * **Đóng gói:** Logic hiển thị ảnh, bắt lỗi ảnh fallback nằm gọn trong `Avatar.js`, không làm phình to code của `UserProfile`.

---

## BÀI TẬP 3 (MỨC NÂNG CAO): MÀN HÌNH FORM ĐĂNG KÝ VÀ VALIDATION DỮ LIỆU

### 1. Mục tiêu và Yêu cầu:
* Tạo màn hình “Form đăng ký” gồm 4 trường:
  1. Họ tên
  2. Email
  3. Mật khẩu
  4. Confirm mật khẩu
* Kiểm tra tính hợp lệ dữ liệu (Validation Rules):
  * **Rỗng:** Bắt buộc nhập đầy đủ tất cả các trường.
  * **Email đúng format:** Sử dụng biểu thức chính quy (Regex) kiểm tra cấu trúc email chuẩn `username@domain.ext`.
  * **Mật khẩu ≥ 6 ký tự:** Kiểm tra độ dài chuỗi mật khẩu tối thiểu từ 6 ký tự trở lên.
  * **Confirm mật khẩu:** Bắt buộc trùng khớp 100% với mật khẩu đã nhập.
* Khi bấm nút Submit:
  * Nếu có lỗi: Hiển thị thông báo lỗi chi tiết màu đỏ ngay dưới từng trường tương ứng.
  * Nếu hợp lệ: Hiển thị dòng Text: **“Đăng ký thành công”** cùng bảng tóm tắt thông tin tài khoản đã tạo.

### 2. Thiết kế Component `BaiTap3_RegisterForm.js`:
* Tệp: `BaiTapHangTuan/Tuan07/components/BaiTap3_RegisterForm.js`
* Hỗ trợ chức năng ẩn/hiện mật khẩu bằng nút mắt (👁️ / 🙈).
* Cung cấp nút tiện ích: **"⚡ Điền form chuẩn"** và **"⚠️ Thử form lỗi"** để giảng viên và sinh viên kiểm thử nhanh ngay lập tức.

### 3. Trích đoạn mã nguồn thuật toán Validation:
```javascript
const validateForm = () => {
  const newErrors = {};

  // 1. Validate Họ tên: Không rỗng, tối thiểu 2 ký tự
  if (!formData.name.trim()) {
    newErrors.name = 'Họ tên không được để trống!';
  } else if (formData.name.trim().length < 2) {
    newErrors.name = 'Họ tên phải có ít nhất 2 ký tự!';
  }

  // 2. Validate Email: Không rỗng, đúng định dạng Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    newErrors.email = 'Email không được để trống!';
  } else if (!emailRegex.test(formData.email.trim())) {
    newErrors.email = 'Email không đúng định dạng (VD: example@gmail.com)!';
  }

  // 3. Validate Mật khẩu: Không rỗng, tối thiểu 6 ký tự
  if (!formData.password) {
    newErrors.password = 'Mật khẩu không được để trống!';
  } else if (formData.password.length < 6) {
    newErrors.password = 'Mật khẩu phải có độ dài tối thiểu từ 6 ký tự!';
  }

  // 4. Validate Confirm Mật khẩu: Phải trùng khớp với mật khẩu
  if (!formData.confirmPassword) {
    newErrors.confirmPassword = 'Vui lòng xác nhận lại mật khẩu!';
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp!';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### 4. Bảng kịch bản kiểm thử (Test Cases Table):

| Kịch bản kiểm thử | Dữ liệu đầu vào (Input) | Kết quả mong đợi | Đánh giá |
| :--- | :--- | :--- | :--- |
| **TC1: Để trống tất cả** | Tên: `""`, Email: `""`, Pass: `""`, Confirm: `""` | Hiển thị 4 thông báo lỗi bắt buộc nhập |  Đạt |
| **TC2: Email sai format** | Email: `"duybui.gmail"`, các trường khác hợp lệ | Báo lỗi: *"Email không đúng định dạng..."* |  Đạt |
| **TC3: Mật khẩu < 6 ký tự** | Pass: `"12345"`, Confirm: `"12345"` | Báo lỗi: *"Mật khẩu phải có độ dài tối thiểu từ 6 ký tự!"* |  Đạt |
| **TC4: Confirm không khớp** | Pass: `"matkhau123"`, Confirm: `"matkhau999"` | Báo lỗi: *"Mật khẩu xác nhận không trùng khớp!"* |  Đạt |
| **TC5: Dữ liệu hoàn toàn hợp lệ** | Tên: `"Bùi Quang Duy"`, Email: `"duy.bui@gmail.com"`, Pass: `"matkhau123"`, Confirm: `"matkhau123"` | Xóa bỏ mọi thông báo lỗi, hiển thị Text **“Đăng ký thành công”** |  Đạt |

---

# HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY ỨNG DỤNG

### 1. Yêu cầu môi trường:
* Node.js phiên bản ≥ 18.x
* Quản lý gói: npm hoặc yarn
* Thiết bị kiểm thử: Ứng dụng **Expo Go** trên điện thoại Android/iOS hoặc Trình giả lập (Android Emulator / iOS Simulator).

### 2. Các bước khởi chạy dự án:
1. Mở terminal và chuyển tới thư mục bài tập Tuần 07:
   ```bash
   cd BaiTapHangTuan/Tuan07
   ```
2. Cài đặt các gói thư viện phụ thuộc (nếu chưa cài):
   ```bash
   npm install
   ```
3. Khởi động máy chủ Expo Development:
   ```bash
   npx expo start
   ```
4. Quét mã QR hiển thị trên màn hình terminal bằng ứng dụng Expo Go trên điện thoại để trải nghiệm ứng dụng.

---

# HƯỚNG DẪN NỘP BÀI TẬP
Theo quy định nộp bài:
1. **Nộp Link GitHub:**
   * Sinh viên commit và push toàn bộ thư mục `BaiTapHangTuan/Tuan07` lên kho lưu trữ GitHub:
   * URL: [https://github.com/duy112233077-creator/notes-app-react-native.git](https://github.com/duy112233077-creator/notes-app-react-native.git)
   * Nhấn nút **Done** trên hệ thống học tập để hoàn tất.
2. **Nộp File Nén (Zip):**
   * Dự án đã được đóng gói thành file duy nhất: `Tuan_7_11223077.zip` đặt ngay tại thư mục `BaiTapHangTuan/Tuan07`.
   * File nén bảo đảm chứa đầy đủ toàn bộ mã nguồn, cấu trúc thư mục và file tài liệu báo cáo `README.md`.

---

# KẾT LUẬN VÀ ĐÁNH GIÁ
Qua bài tập thực hành Tuần 07, sinh viên đã nắm vững và áp dụng thành thạo:
1. Bản chất 3 giai đoạn vòng đời của component React Native (`Mounting`, `Updating`, `Unmounting`) và cách ánh xạ sang Hook `useEffect`.
2. Mô hình kiến trúc **Controlled Component**, nguyên lý **Single Source of Truth** và luồng dữ liệu 1 chiều giữa `state`, `value` và `onChangeText`.
3. Kỹ thuật chia nhỏ và lồng ghép component (`Avatar` trong `UserProfile`), giúp mã nguồn đạt tính đóng gói, dễ mở rộng và tái sử dụng cao.
4. Quy trình xử lý **Form Validation** chuyên nghiệp trên thiết bị di động, mang lại trải nghiệm người dùng (UX) tối ưu và mượt mà.
