# BÁO CÁO BÀI TẬP TUẦN 08 - REACT NATIVE
## CHỦ ĐỀ: EXPORT/IMPORT, PROPS, COMPONENT REUSABILITY, FLATLIST & SCREEN NAVIGATION PARAMS

---

### 👤 THÔNG TIN SINH VIÊN THỰC HIỆN
* **Họ và tên:** Bùi Quang Duy - Lê Duy Linh
* **Mã sinh viên:** 11223077 - 11223078
* **Lớp:** Lớp 12325W.3
* **Chức danh:** Sinh viên / Lập trình viên React Native
* **Môn học:** Phát triển ứng dụng Di động đa nền tảng / React Native
* **Trường:** Đại học Sư phạm Kỹ thuật Hưng Yên (UTEHY)
* **Repository GitHub:** [https://github.com/duy112233077-creator/notes-app-react-native.git](https://github.com/duy112233077-creator/notes-app-react-native.git)
* **Thư mục bài tập:** `BaiTapHangTuan/Tuan08`

---

## 📑 MỤC LỤC BÁO CÁO
1. [Phần A: Câu hỏi ôn tập lý thuyết](#phần-a-câu-hỏi-ôn-tập-lý-thuyết)
   * [Câu 1: Sự khác nhau giữa default export và named export trong React Native](#câu-1-sự-khác-nhau-giữa-default-export-và-named-export-trong-react-native)
   * [Câu 2: Khái niệm Props, Luồng truyền dữ liệu và Đặc điểm “Read-only”](#câu-2-khái-niệm-props-luồng-truyền-dữ-liệu-và-đặc-điểm-read-only)
   * [Câu 3: Vai trò của việc tách component nhỏ trong xây dựng ứng dụng](#câu-3-vai-trò-của-việc-tách-component-nhỏ-trong-xây-dựng-ứng-dụng)
   * [Câu 4: Mối liên hệ giữa props, state và hooks trong Form nhập liệu](#câu-4-mối-liên-hệ-giữa-props-state-và-hooks-trong-form-nhập-liệu)
   * [Câu 5: Khái niệm Controlled Component với TextInput và Tầm quan trọng của Validation](#câu-5-khái-niệm-controlled-component-với-textinput-và-tầm-quan-trọng-của-validation)
2. [Phần B: Bài tập luyện tập thực hành](#phần-b-bài-tập-luyện-tập-thực-hành)
   * [Bài tập 1 (Mức dễ): Tạo component ProductCard và minh họa tái sử dụng với 3+ bộ dữ liệu](#bài-tập-1-mức-dễ-tạo-component-productcard-và-minh-họa-tái-sử-dụng-với-3-bộ-dữ-liệu)
   * [Bài tập 2 (Mức trung bình): Product List Mock Data (10 sản phẩm) dùng FlatList và Màn hình Detail truyền Props/Params](#bài-tập-2-mức-trung-bình-product-list-mock-data-10-sản-phẩm-dùng-flatlist-và-màn-hình-detail-truyền-propsparams)
3. [Cấu trúc mã nguồn thư mục Tuần 8](#cấu-trúc-mã-nguồn-thư-mục-tuần-8)
4. [Hướng dẫn cài đặt và chạy ứng dụng](#hướng-dẫn-cài-đặt-và-chạy-ứng-dụng)
5. [Kết luận và Đánh giá kết quả](#kết-luận-và-đánh-giá-kết-quả)

---

# PHẦN A: CÂU HỎI ÔN TẬP LÝ THUYẾT

---

### Câu 1.
**Trình bày sự khác nhau giữa default export và named export trong React Native. Khi một file chỉ chứa một component chính thì nên sử dụng cách export nào? Hãy giải thích lý do và nêu ví dụ tình huống sử dụng phù hợp.**

#### 1. Bảng so sánh toàn diện giữa Default Export và Named Export:

| Tiêu chí so sánh | Default Export (Xuất mặc định) | Named Export (Xuất có tên) |
| :--- | :--- | :--- |
| **Số lượng cho phép mỗi file** | **Duy nhất 1** default export trên một module/file. | **Không giới hạn**, có thể export nhiều hàm, biến, class, component. |
| **Cú pháp Export** | `export default ProductCard;`<br>hoặc `export default function Header() {}` | `export const ProductCard = () => {}`<br>hoặc `export { Card, Button, Input };` |
| **Cú pháp Import** | `import ProductCard from './ProductCard';`<br>*(Không dùng dấu ngoặc nhọn `{}`)* | `import { ProductCard } from './ProductCard';`<br>*(Bắt buộc phải bọc trong ngoặc nhọn `{}`)* |
| **Đặt lại tên khi Import** | **Tự do đổi tên** bất kỳ mà không cần từ khóa phụ:<br>`import CardSp from './ProductCard';` | Bắt buộc phải trùng tên chính xác. Muốn đổi tên phải dùng từ khóa `as`:<br>`import { ProductCard as CardSp } from './ProductCard';` |
| **Mục đích thiết kế chính** | Đại diện cho thực thể trung tâm, linh hồn chính của file module đó. | Cung cấp tập hợp các công cụ phụ trợ, hằng số, helper functions, hoặc bộ UI components. |

---

#### 2. Khi một file chỉ chứa một component chính thì nên sử dụng cách export nào?
👉 **Khuyến nghị tiêu chuẩn:** NÊN SỬ DỤNG **DEFAULT EXPORT**.

#### 3. Giải thích lý do chuyên sâu:
1. **Tuân thủ nguyên lý Đơn nhiệm (Single Responsibility Principle):**
   * Khi một file được đặt tên là `ProductCard.js`, nhiệm vụ duy nhất của file là định nghĩa và cung cấp component `ProductCard`. Việc dùng `default export` khẳng định rõ đây là thành phần chính duy nhất của module.
2. **Cú pháp import tự nhiên, trong sáng:**
   * Lập trình viên gọi `import ProductCard from './ProductCard';` rất ngắn gọn, quen thuộc và phù hợp với quy ước của React / React Native.
3. **Tương thích hoàn hảo với hệ sinh thái React:**
   * Các tính năng như **Code Splitting**, Lazy Loading với `React.lazy(() => import('./ProductCard'))` hay cơ chế dynamic routes của React Navigation đều ngầm định lấy module mặc định từ `default export`.

#### 4. Ví dụ tình huống sử dụng phù hợp trong dự án:

* **Tình huống sử dụng Default Export:**
  * Các màn hình ứng dụng (Screens): `HomeScreen.js`, `ProductDetailScreen.js`, `LoginScreen.js`.
  * Các Component giao diện độc lập: `ProductCard.js`, `Header.js`, `CustomModal.js`.

* **Tình huống sử dụng Named Export:**
  * File tiện ích, hàm phụ trợ (`utils/formatters.js`):
    ```javascript
    export const formatVND = (price) => price.toLocaleString('vi-VN') + ' ₫';
    export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    export const truncateText = (text, maxLength) => ...;
    ```
  * Thư viện màu sắc hoặc cấu hình chung (`constants/theme.js`):
    ```javascript
    export const COLORS = { primary: '#2563EB', danger: '#EF4444' };
    export const SIZES = { padding: 16, radius: 12 };
    ```

---

### Câu 2.
**Giải thích khái niệm props trong React Native. Vì sao props được xem là cách truyền dữ liệu từ component cha xuống component con? Hãy phân tích đặc điểm “read-only” của props và cho biết điều gì có thể xảy ra nếu component con cố gắng thay đổi trực tiếp giá trị props nhận được.**

#### 1. Khái niệm Props:
* **Props** (viết tắt của *Properties*) là tập hợp các đối số đầu vào (arguments) bất biến được truyền từ component cha xuống component con thông qua các thuộc tính khai báo trong cú pháp JSX:
  ```jsx
  <ProductCard name="iPhone 16 Pro Max" price={34990000} />
  ```
* Props cho phép cấu hình hành vi, diện mạo và nội dung của component con, biến component thành một khối giao diện động có khả năng tái sử dụng vô tận.

#### 2. Vì sao Props là cách truyền dữ liệu từ Component Cha xuống Component Con?
* **Kiến trúc Luồng dữ liệu một chiều (One-way Data Flow / Unidirectional Data Flow):**
  ```text
  ┌────────────────────────────────────────────────────────┐
  │                   COMPONENT CHA                        │
  │  Nắm giữ State: const [price, setPrice] = useState(...)│
  └──────────────────────────┬─────────────────────────────┘
                             │  Truyền Props: name, price
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │                   COMPONENT CON                        │
  │  Nhận Props: function ProductCard({ name, price })     │
  │  Render hiển thị lên Native Views                      │
  └────────────────────────────────────────────────────────┘
  ```
* Dữ liệu trong React luôn chảy từ trên xuống dưới (Top-Down). Component cha kiểm soát dữ liệu gốc (**Single Source of Truth**), còn component con nhận dữ liệu để hiển thị.
* **Lợi ích:** Đảm bảo hệ thống có tính dự đoán cao (Predictable), dễ gỡ lỗi (Traceable). Khi giao diện hiển thị sai giá tiền, lập trình viên biết chắc chắn cần kiểm tra ở component cha chứ không sợ bị can thiệp lung tung ở các tầng con.

#### 3. Phân tích đặc điểm “Read-only” (Bất biến / Chỉ đọc) của Props:
* **Nguyên tắc Pure Function (Hàm thuần khiết):** React quy định rằng một component không bao giờ được phép làm thay đổi các giá trị đầu vào của chính nó.
* Props một khi đã truyền vào component con là **bất biến (Immutable)**. Component con chỉ được phép "đọc" giá trị để render ra Text, Image, hoặc làm điều kiện logic, tuyệt đối không được gán lại:
  ```javascript
  // ❌ SAI NGHIÊM TRỌNG (Gây lỗi hoặc phá vỡ hệ thống):
  props.price = 200000;
  props.name = 'Tên mới';
  ```

#### 4. Điều gì có thể xảy ra nếu Component con cố gắng thay đổi trực tiếp Props?
1. **Gây lỗi Runtime trong Strict Mode:** Trình duyệt hoặc engine JavaScript (Hermes/V8) sẽ ném lỗi:
   `TypeError: Cannot assign to read only property 'price' of object '#<Object>'`.
2. **Gây hiện tượng Bất đồng bộ giao diện (Inconsistent UI State):**
   * Component cha vẫn lưu giữ giá gốc (ví dụ: 30.000.000 ₫), nhưng component con lại hiển thị 20.000.000 ₫. Khi có sự kiện re-render ở component cha, props mới truyền xuống sẽ ghi đè lại hoặc gây xung đột hiển thị.
3. **Phá vỡ cơ chế Reconcilation (So khớp Virtual DOM) của React:**
   * React dựa vào tham chiếu bất biến để biết khi nào component cần render lại. Sửa trực tiếp props (Mutation) làm mất dấu vết thay đổi, khiến UI không cập nhật hoặc cập nhật sai lệch.
4. **Cách xử lý đúng chuẩn khi muốn thay đổi dữ liệu:**
   * Component cha truyền xuống một hàm callback qua props:
     ```jsx
     <ProductCard name={name} price={price} onUpdatePrice={(newPrice) => setPrice(newPrice)} />
     ```
   * Component con gọi `onUpdatePrice(newPrice)` để yêu cầu cha cập nhật State của cha.

---

### Câu 3.
**Phân tích vai trò của việc tách component nhỏ trong quá trình xây dựng ứng dụng React Native. Theo em, việc tách các thành phần như Header, Button, InputField, Card thành các component riêng giúp ích như thế nào cho việc tái sử dụng, bảo trì và mở rộng ứng dụng?**

Việc áp dụng triết lý thiết kế module hóa (**Modular Component Architecture**) hay phương pháp luận **Atomic Design** mang lại 3 giá trị to lớn:

#### 1. Khả năng Tái sử dụng (Reusability) - Triệt tiêu mã trùng lặp (DRY):
* **Trước khi tách:** Nếu ứng dụng có 5 màn hình cần ô nhập dữ liệu (Đăng nhập, Đăng ký, Đổi mật khẩu, Tìm kiếm, Cập nhật thông tin), lập trình viên phải copy-paste hàng trăm dòng `TextInput`, `StyleSheet` với viền, màu sắc, bóng đổ tương tự.
* **Sau khi tách:** Chỉ cần tạo duy nhất component `<InputField label="..." value="..." onChangeText="..." />`.
* Mọi thành phần giao diện như `<Header title="..." />`, `<CustomButton text="..." />`, `<ProductCard ... />` có thể dùng lại ở bất kỳ đâu chỉ với một dòng code ngắn gọn.

#### 2. Khả năng Bảo trì (Maintainability) - Đóng gói và cô lập lỗi:
* **Tập trung hóa thay đổi:** Khi khách hàng hoặc Designer yêu cầu đổi màu thương hiệu từ Xanh dương sang Tím, hoặc đổi bo góc nút bấm từ 8px sang 16px, lập trình viên chỉ cần sửa đúng 1 file duy nhất `Button.js`. Toàn bộ 50 màn hình trong ứng dụng sẽ tự động đồng bộ ngay lập tức.
* **Dễ dàng khoanh vùng lỗi (Isolation):** Nếu ô nhập liệu bị che khuất bởi bàn phím trên iOS, ta biết chính xác vấn đề nằm ở `InputField.js` và khắc phục tại đó mà không sợ ảnh hưởng đến các logic nghiệp vụ khác.
* **Mã nguồn sạch (Clean Code):** File màn hình chính giảm từ hàng nghìn dòng xuống chỉ còn 100 - 150 dòng, tập trung vào điều phối dữ liệu thay vì chi tiết vẽ giao diện.

#### 3. Khả năng Mở rộng ứng dụng (Scalability) & Tối ưu hiệu năng:
* **Làm việc nhóm hiệu quả (Parallel Development):** Thành viên A xây dựng bộ UI Kit (`Header`, `Button`, `InputField`), thành viên B ghép nối màn hình Đăng ký, thành viên C làm màn hình Giỏ hàng. Không ai dẫm chân lên code của nhau, giảm thiểu xung đột Git Conflict.
* **Tối ưu hóa re-render:** Khi người dùng nhập text vào một ô `InputField`, nhờ component được tách nhỏ kết hợp với `React.memo`, chỉ có component ô nhập đó re-render, các phần `Header` hay `ProductCard` xung quanh hoàn toàn không bị tính toán lại.

---

### Câu 4.
**Trình bày mối liên hệ giữa props, state và hooks khi xây dựng một giao diện có nhập liệu. Trong trường hợp tạo form đăng ký gồm tên, email và mật khẩu, dữ liệu nào nên được quản lý bằng state, dữ liệu nào có thể truyền qua props, và vì sao?**

#### 1. Mối liên hệ tuần hoàn giữa Hooks, State và Props:
```text
┌────────────────────────────────────────────────────────┐
│      1. HOOKS (useState, useMemo, useEffect)           │
│      Khởi tạo và cung cấp cơ chế quản trị State        │
└──────────────────────────┬─────────────────────────────┘
                           │ Quản lý
                           ▼
┌────────────────────────────────────────────────────────┐
│      2. STATE (Trạng thái nội tại của Form Cha)        │
│      Lưu trữ dữ liệu biến động: name, email, password  │
└──────────────────────────┬─────────────────────────────┘
                           │ Truyền xuống & Bắt sự kiện
                           ▼
┌────────────────────────────────────────────────────────┐
│      3. PROPS (Đường ống dẫn dữ liệu)                  │
│      value={email}, onChangeText={setEmail}            │
│      Truyền vào component con: <CustomInputField />    │
└────────────────────────────────────────────────────────┘
```

#### 2. Phân định dữ liệu trong Form Đăng Ký (Tên, Email, Mật khẩu):

#### A. Dữ liệu PHẢI được quản lý bằng STATE (Tại Form Component Cha):
1. **Giá trị người dùng nhập vào:**
   * `const [name, setName] = useState('');`
   * `const [email, setEmail] = useState('');`
   * `const [password, setPassword] = useState('');`
2. **Thông báo lỗi kiểm tra hợp lệ (Validation Errors):**
   * `const [errors, setErrors] = useState({ name: '', email: '', password: '' });`
3. **Trạng thái giao diện tương tác:**
   * `const [isLoading, setIsLoading] = useState(false);` (khi nhấn Submit đang gọi API)
   * `const [isPasswordVisible, setIsPasswordVisible] = useState(false);` (ẩn/hiện mật khẩu)

👉 **Vì sao?** Bởi vì đây là các dữ liệu biến đổi liên tục theo thời gian thực dựa trên từng lần gõ phím của người dùng. Khi giá trị này thay đổi, component cần re-render ngay để hiển thị chữ trên màn hình và cập nhật thông báo lỗi tương ứng.

#### B. Dữ liệu ĐƯỢC TRUYỀN QUA PROPS (Từ Form Cha xuống Component Con `<CustomInput />`):
1. **Các cấu hình giao diện tĩnh:**
   * `label="Địa chỉ Email"`, `placeholder="Nhập email của bạn..."`
   * `secureTextEntry={true}` (dành riêng cho trường Mật khẩu)
   * `keyboardType="email-address"` (để bật bàn phím có sẵn phím `@`)
2. **Giá trị nhận từ State cha:**
   * `value={email}`, `value={password}`
   * `errorMessage={errors.email}`
3. **Hàm Callback nhận phản hồi sự kiện:**
   * `onChangeText={(text) => setEmail(text)}`
   * `onBlur={() => validateEmail(email)}`

👉 **Vì sao?** Bởi vì component con `<CustomInput />` là một **Dumb / Presentational Component** không tự quyết định nghiệp vụ lưu trữ tài khoản của ai. Nhận dữ liệu và hàm xử lý qua props giúp component con này có thể tái sử dụng cho bất kỳ form nào (Đăng nhập, Đổi thông tin cá nhân, Mua hàng).

---

### Câu 5.
**Giải thích khái niệm controlled component với TextInput trong React Native. Vì sao khi xây dựng form nhập liệu cần quản lý giá trị ô nhập bằng state và thực hiện validate như kiểm tra rỗng, email có ký tự “@”, mật khẩu có độ dài tối thiểu?**

#### 1. Khái niệm Controlled Component với TextInput:
* Trong React Native, một `TextInput` được gọi là **Controlled Component** khi giá trị hiển thị của nó được kiểm soát hoàn toàn bởi **React State**.
* Hai thuộc tính quyết định:
  1. `value={stateVariable}`: Gán giá trị hiển thị của ô nhập luôn bằng với biến State.
  2. `onChangeText={(newText) => setStateVariable(newText)}`: Lắng nghe mọi ký tự người dùng gõ vào và cập nhật ngay vào State.

```jsx
// Mô hình Controlled Component mẫu:
const [email, setEmail] = useState('');

<TextInput
  value={email}
  onChangeText={(text) => setEmail(text)}
  placeholder="example@gmail.com"
/>
```

#### 2. Vì sao cần quản lý giá trị ô nhập bằng State và thực hiện Validate dữ liệu?
1. **Tạo ra Nguồn chân lý duy nhất (Single Source of Truth):**
   * Nếu không dùng State (Uncontrolled), dữ liệu nằm kẹt trong Native DOM/View của hệ điều hành. Khi người dùng bấm nút Đăng ký, ứng dụng rất khó để thu thập, so sánh hay gửi lên Server. Khi dùng State, giá trị luôn sẵn sàng ngay trong biến JavaScript.
2. **Cung cấp phản hồi người dùng tức thì (Real-time Feedback & Great UX):**
   * Nhờ có State, ta có thể hiển thị cảnh báo đỏ ngay dưới ô nhập khi người dùng rời chuột hoặc gõ sai mà không cần phải chờ bấm Submit mới báo lỗi.
3. **Bảo đảm tính toàn vẹn và chất lượng dữ liệu (Data Integrity):**
   * **Kiểm tra rỗng:** Ngăn ngừa việc lưu trữ các bản ghi trống, thiếu tên hoặc email gây lỗi cơ sở dữ liệu (`NOT NULL constraint violation`).
   * **Kiểm tra ký tự `@` và định dạng Email:** Đảm bảo hệ thống có thể gửi email kích hoạt, gửi hóa đơn hoặc mã OTP khôi phục mật khẩu đến một hòm thư có thực.
   * **Kiểm tra độ dài tối thiểu mật khẩu (tối thiểu 6-8 ký tự):** Yêu cầu an toàn thông tin bắt buộc, ngăn ngừa các cuộc tấn công đoán mật khẩu vét cạn (Brute-Force Attack) và bảo vệ an toàn cho tài khoản người dùng.
4. **Kiểm soát logic kích hoạt nút Đăng ký:**
   * Cho phép làm mờ (disable) nút Đăng ký khi các điều kiện kiểm tra chưa thỏa mãn, tránh người dùng bấm liên tục gây spam request lên Server.

---

# PHẦN B: BÀI TẬP LUYỆN TẬP THỰC HÀNH

---

### Bài tập 1 (Mức dễ): Tạo component ProductCard và minh họa tái sử dụng với 3+ bộ dữ liệu

#### 1. Yêu cầu chi tiết:
* Tạo component riêng `ProductCard.js` nhận props gồm `name` và `price`.
* Bố cục dạng thẻ đẹp mắt, viền bo tròn, bóng đổ, hiển thị tên sản phẩm và định dạng tiền tệ chuyên nghiệp.
* Export component và import vào màn hình chính, sử dụng ít nhất 3 lần với 3 bộ dữ liệu sản phẩm khác nhau.
* Viết đoạn giải thích cơ chế truyền props và lý do component có thể tái sử dụng nhiều lần.

#### 2. Mã nguồn triển khai Component `ProductCard.js`:
*(Vị trí file: `BaiTapHangTuan/Tuan08/components/ProductCard.js`)*

```javascript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function ProductCard({ name, price, category, badge, onPress }) {
  const formatPrice = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString('vi-VN') + ' ₫';
    }
    return val;
  };

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      style={styles.cardContainer}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>📦</Text>
        </View>
        {badge && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        {category && <Text style={styles.categoryText}>{category.toUpperCase()}</Text>}
        <Text style={styles.productName} numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.divider} />
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Giá niêm yết:</Text>
          <Text style={styles.productPrice}>{formatPrice(price)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ProductCard;
```

#### 3. Sử dụng ít nhất 3 lần với 3 bộ dữ liệu khác nhau trong Màn hình:
*(Vị trí file: `BaiTapHangTuan/Tuan08/components/BaiTap1_EasyProductCards.js`)*

```jsx
// 1. Dữ liệu sản phẩm 1:
<ProductCard
  name="Điện thoại iPhone 16 Pro Max 256GB - Titan Tự Nhiên"
  price={34990000}
  category="Điện thoại & Tablet"
  badge="Bán chạy"
/>

// 2. Dữ liệu sản phẩm 2:
<ProductCard
  name="Tai nghe Bluetooth Apple AirPods Pro 2 USB-C (MagSafe)"
  price={5690000}
  category="Âm thanh & Phụ kiện"
  badge="Giảm 15%"
/>

// 3. Dữ liệu sản phẩm 3:
<ProductCard
  name="Bàn phím cơ không dây Keychron K2 Pro QMK/VIA Gateron Red Switch"
  price={2450000}
  category="Phụ kiện máy tính"
  badge="Đánh giá cao"
/>

// 4. Dữ liệu sản phẩm 4:
<ProductCard
  name="Chuột không dây Logitech MX Master 3S for Mac Silent"
  price={2190000}
  category="Phụ kiện máy tính"
  badge="Mới về"
/>
```

#### 4. Đoạn giải thích cơ chế truyền Props và Khả năng tái sử dụng:
> **1. Cách Props được truyền từ cha xuống con:**  
> Dữ liệu di chuyển theo luồng một chiều (Top-down). Component cha nắm giữ danh sách sản phẩm. Khi render, component cha truyền các giá trị qua thuộc tính JSX (`name={item.name}`, `price={item.price}`). Component con `ProductCard` nhận các đối số này qua tham số hàm và đưa vào các thẻ `<Text>` để vẽ lên màn hình.
>  
> **2. Vì sao ProductCard có thể tái sử dụng nhiều lần:**  
> Bản thân `ProductCard` đóng vai trò là một "bộ khung khuôn mẫu" thuần túy (Presentational Component). Nó không gán chết bất kỳ chuỗi tên hay con số giá cụ thể nào. Toàn bộ cách dàn trang, đổ bóng, màu sắc, format tiền tệ đều đã được đóng gói bên trong component. Bất kỳ màn hình nào cần hiển thị thẻ sản phẩm chỉ việc import và truyền 2 props `name` và `price` vào là có ngay một thẻ sản phẩm hoàn chỉnh mà không cần viết lại mã định kiểu giao diện.

---

### Bài tập 2 (Mức trung bình): Product List Mock Data (10 sản phẩm) dùng FlatList và Màn hình Detail truyền Props/Params

#### 1. Yêu cầu chi tiết:
* Tạo mock data danh sách chuẩn **10 sản phẩm** đầy đủ thông số.
* Màn hình Danh sách (**Product List**) dùng component hiệu năng cao `FlatList`.
* Nhấn vào 1 item trên danh sách → chuyển sang màn hình **Detail** và truyền toàn bộ props/params gồm: `id`, `name`, `price` (và các thông tin mở rộng như mô tả, cấu hình kỹ thuật, đánh giá).
* Màn hình Detail có nút quay lại danh sách, khung hiển thị chi tiết các params nhận được và nút tương tác đặt hàng.

#### 2. Danh sách 10 Sản phẩm Mock Data:
```javascript
const MOCK_PRODUCTS = [
  { id: 1, name: 'iPhone 16 Pro Max 256GB Desert Titanium', price: 34990000, category: 'Smartphone', rating: 4.9, icon: '📱' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra 5G 12GB/512GB', price: 31490000, category: 'Smartphone', rating: 4.8, icon: '📱' },
  { id: 3, name: 'MacBook Pro 14 M3 Pro 18GB/512GB Space Black', price: 49990000, category: 'Laptop', rating: 5.0, icon: '💻' },
  { id: 4, name: 'Laptop Gaming ASUS ROG Zephyrus G16 OLED', price: 52990000, category: 'Laptop', rating: 4.9, icon: '💻' },
  { id: 5, name: 'Tai nghe Bluetooth Sony WH-1000XM5 Hi-Res', price: 6790000, category: 'Âm thanh', rating: 4.8, icon: '🎧' },
  { id: 6, name: 'Apple Watch Series 10 GPS 46mm Nhôm Jet Black', price: 11490000, category: 'Đồng hồ', rating: 4.7, icon: '⌚' },
  { id: 7, name: 'Máy tính bảng iPad Air 6 M2 11 inch Wi-Fi 128GB', price: 15890000, category: 'Tablet', rating: 4.9, icon: '📟' },
  { id: 8, name: 'Loa không dây Marshall Stanmore III Bluetooth', price: 9290000, category: 'Âm thanh', rating: 4.8, icon: '🔊' },
  { id: 9, name: 'Bàn phím cơ công thái học Logitech Wave Keys', price: 1690000, category: 'Phụ kiện', rating: 4.6, icon: '⌨️' },
  { id: 10, name: 'Màn hình Dell UltraSharp U2724D 27 inch 2K 120Hz', price: 9890000, category: 'Phụ kiện', rating: 4.9, icon: '🖥️' },
];
```

#### 3. Sử dụng `FlatList` tối ưu hiệu năng:
```jsx
<FlatList
  data={filteredProducts}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      {/* Hiển thị Icon, Tên, Giá, Đánh giá */}
    </TouchableOpacity>
  )}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
  }
/>
```

#### 4. Cơ chế truyền Props / Params sang màn hình Detail:
* **Khi bấm vào 1 item trên danh sách:**
  ```javascript
  const handleItemPress = (product) => {
    // Lưu params và kích hoạt điều hướng
    setSelectedProductParams(product);
    setCurrentScreen('detail');
  };
  ```
* **Màn hình Detail tiếp nhận và hiển thị thông số:**
  ```jsx
  <View style={styles.paramsCard}>
    <Text>• Param id: {product.id}</Text>
    <Text>• Param name: {product.name}</Text>
    <Text>• Param price: {formatVND(product.price)}</Text>
  </View>
  ```
* **Đối với dự án sử dụng thư viện `@react-navigation/native`:**
  * Màn hình List điều hướng bằng:
    ```javascript
    navigation.navigate('ProductDetail', {
      id: item.id,
      name: item.name,
      price: item.price,
    });
    ```
  * Màn hình Detail lấy params bằng:
    ```javascript
    const { id, name, price } = route.params;
    ```

---

## 📂 CẤU TRÚC MÃ NGUỒN THƯ MỤC TUẦN 8

```text
BaiTapHangTuan/Tuan08/
├── App.js                              # Màn hình chính tích hợp Tab điều hướng tổng quan
├── index.js                            # File khởi tạo registerRootComponent (Expo / React Native)
├── package.json                        # Cấu hình dependency dự án
├── app.json                            # Cấu hình Expo metadata
├── README.md                           # Báo cáo chi tiết lý thuyết & thực hành
├── Tuan_8_11223077.zip                 # File nén toàn bộ bài làm theo yêu cầu nộp
└── components/
    ├── ProductCard.js                  # Component thẻ sản phẩm riêng biệt (Bài tập dễ)
    ├── BaiTap1_EasyProductCards.js     # Màn hình minh họa 3+ ProductCard & Box giải thích
    ├── BaiTap2_ProductListDetail.js    # Màn hình FlatList 10 sản phẩm & Detail Screen
    └── LyThuyetView.js                 # Giao diện hiển thị trực quan 5 câu hỏi lý thuyết
```

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY ỨNG DỤNG

### 1. Cài đặt các gói phụ thuộc:
Mở terminal tại thư mục bài tập:
```bash
cd BaiTapHangTuan/Tuan08
npm install
```

### 2. Khởi chạy ứng dụng:
* Chạy với giao diện Web:
  ```bash
  npm run web
  ```
* Chạy với máy ảo hoặc thiết bị thật Android / iOS qua ứng dụng Expo Go:
  ```bash
  npx expo start
  ```

---

## 🎯 KẾT LUẬN VÀ ĐÁNH GIÁ KẾT QUẢ

1. **Về lý thuyết:**
   * Nắm vững sự khác biệt giữa `default export` và `named export`, biết cách chọn lựa đúng đắn cho từng loại file trong kiến trúc dự án.
   * Hiểu sâu sắc bản chất bất biến (read-only) của `props`, luồng dữ liệu một chiều và cơ chế tách component nhỏ để tái sử dụng tối đa.
   * Nắm rõ cách quản lý dữ liệu form bằng `useState` và tầm quan trọng của việc kiểm tra tính hợp lệ dữ liệu (validation) trước khi gửi đi.

2. **Về thực hành:**
   * Xây dựng thành công component độc lập `ProductCard.js` nhận props `name` và `price`, tái sử dụng mượt mà với nhiều bộ dữ liệu khác nhau.
   * Xây dựng hoàn chỉnh màn hình danh sách 10 sản phẩm mock data sử dụng `FlatList`, hỗ trợ tìm kiếm, lọc danh mục, kéo để làm mới (pull-to-refresh).
   * Triển khai luồng điều hướng mượt mà từ màn hình List sang màn hình Detail, truyền đầy đủ và chuẩn xác các tham số `id`, `name`, `price`, mang lại trải nghiệm người dùng hiện đại và chuyên nghiệp.
