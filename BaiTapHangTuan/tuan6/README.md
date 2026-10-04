# BÁO CÁO BÀI TẬP TUẦN 06 - REACT NATIVE
## CHỦ ĐỀ: TÌM HIỂU COMPONENT, PROPS VÀ HOOKS (USESTATE & USEEFFECT)

---

### 👤 THÔNG TIN SINH VIÊN THỰC HIỆN
* **Họ và tên:** Bùi Quang Duy - Lê Duy Linh
* **Mã sinh viên:** 11223077
* **Lớp:** Lớp 12325W.3
* **Chức danh:** Sinh viên / Lập trình viên React Native
* **Môn học:** Phát triển ứng dụng Di động đa nền tảng / React Native
* **Repository GitHub:** [https://github.com/duy112233077-creator/notes-app-react-native.git](https://github.com/duy112233077-creator/notes-app-react-native.git)
* **Thư mục bài tập:** `BaiTapHangTuan/tuan6`

---

# PHẦN A: CÂU HỎI ÔN TẬP LÝ THUYẾT

---

### Câu hỏi 1.
**Hãy trình bày khái niệm component trong React Native. Theo anh/chị, vì sao có thể xem component là các “khối xây dựng” cơ bản để tạo nên giao diện người dùng của một ứng dụng mobile?**

#### 1. Khái niệm Component trong React Native:
* **Định nghĩa:** Trong React Native, **Component** là một đơn vị mã nguồn độc lập, có thể tái sử dụng, đóng vai trò nhận dữ liệu đầu vào (gọi là `props`), quản lý trạng thái nội tại (gọi là `state`) và trả về các phần tử giao diện người dùng (mô tả dưới dạng cú pháp `JSX`) để hiển thị lên màn hình.
* Component có thể là:
  * **Core Components (Thành phần gốc có sẵn do React Native cung cấp):** Như `<View>`, `<Text>`, `<Image>`, `<ScrollView>`, `<TextInput>`, `<TouchableOpacity>`.
  * **Custom Components (Thành phần tự định nghĩa do lập trình viên viết):** Như `<Greeting>`, `<StudentInfo>`, `<HeaderBar>`, `<ProductCard>`.

#### 2. Vì sao xem Component là các “khối xây dựng” (Building Blocks) cơ bản?
Component được ví như những khối gạch hoặc **những khối đồ chơi Lego**:
1. **Chia nhỏ bài toán lớn thành các phần tử đơn giản (Decomposition):**  
   Một màn hình ứng dụng di động hoàn chỉnh thường rất phức tạp (gồm thanh điều hướng, thanh tìm kiếm, danh sách bài viết, thanh menu đáy). Thay vì viết toàn bộ mã giao diện vào một tệp khổng lồ hàng nghìn dòng, lập trình viên chia nhỏ màn hình thành các component con: `Header`, `SearchBar`, `NewsList`, `NewsItem`, `BottomNavigation`. Mỗi component chỉ chịu trách nhiệm về một phần nhỏ của giao diện.
2. **Cấu trúc Cây phân cấp (Component Hierarchy Tree):**  
   Các component có thể lồng ghép vào nhau theo mối quan hệ cha - con (Parent - Child). Component gốc (`App`) chứa các màn hình (`Screen`), trong màn hình lại chứa các component nhỏ hơn, tạo nên một cây phân cấp logic rõ ràng:
   ```text
   [App]
     ├── [HeaderBar]
     │     ├── [AvatarImage]
     │     └── [GreetingText]
     ├── [ContentScrollView]
     │     ├── [StudentInfoCard #1]
     │     ├── [StudentInfoCard #2]
     │     └── [CounterHookBox]
     └── [BottomNavigation]
   ```
3. **Tính trừu tượng hóa (Abstraction):**  
   Mỗi khối component che giấu sự phức tạp bên trong (logic tính toán, styling, tương tác Native) và chỉ để lộ ra giao tiếp bên ngoài thông qua các thuộc tính (`props`). Nhờ đó, người phát triển có thể lắp ráp các khối component lại với nhau để dựng nên toàn bộ giao diện ứng dụng một cách khoa học, chuyên nghiệp và có tổ chức.

---

### Câu hỏi 2.
**Hãy phân tích các đặc điểm chính của component như tính độc lập, tính tái sử dụng và tính đóng gói. Trong quá trình phát triển một ứng dụng React Native, các đặc điểm này giúp ích như thế nào cho việc quản lý và bảo trì mã nguồn?**

#### 1. Phân tích 3 đặc điểm cốt lõi của Component:

* **Tính độc lập (Independence / Self-contained):**
  * Mỗi component có không gian trạng thái (`state`), logic xử lý và chu kỳ sống của riêng mình. Sự thay đổi trạng thái bên trong một component (ví dụ: bấm nút tăng bộ đếm trong `CounterHook`) sẽ chỉ kích hoạt re-render cục bộ trong chính nó mà không làm xáo trộn hoặc ảnh hưởng trực tiếp đến trạng thái của các component anh em khác.
* **Tính tái sử dụng (Reusability):**
  * Một component sau khi được xây dựng chuẩn mực có thể được gọi ra sử dụng nhiều lần ở nhiều vị trí khác nhau trong cùng một màn hình, hoặc xuyên suốt toàn bộ dự án, thậm chí tái sử dụng giữa các dự án khác nhau.
  * Chỉ cần thay đổi các tham số đầu vào (`props`), component sẽ hiển thị nội dung và trạng thái phù hợp (ví dụ: component `<Greeting name="..." />` hay `<Button title="..." color="..." />`).
* **Tính đóng gói (Encapsulation):**
  * Toàn bộ mã JSX (cấu trúc hiển thị), logic nghiệp vụ (JavaScript xử lý dữ liệu) và kiểu dáng giao diện (`StyleSheet`) được gói gọn bên trong một file component duy nhất.
  * Các component bên ngoài không can thiệp sâu vào cấu trúc nội tại của nó mà chỉ tương tác thông qua hợp đồng dữ liệu rõ ràng (Props API).

#### 2. Lợi ích trong quản lý và bảo trì mã nguồn:
1. **Dễ dàng tìm lỗi và sửa lỗi (Maintainability & Debugging):** Khi giao diện xuất hiện lỗi hiển thị hoặc sai lệch logic ở một thành phần (ví dụ lỗi nút bấm), lập trình viên chỉ cần khoanh vùng và kiểm tra duy nhất file component đó mà không lo lắng việc sửa chữa sẽ làm hỏng các phần khác của ứng dụng.
2. **Tăng tốc độ phát triển và tối ưu làm việc nhóm (Team Collaboration):** Trong một dự án lớn, nhóm phát triển có thể phân công mỗi lập trình viên phụ trách một hoặc một vài component độc lập. Mọi người có thể code song song, kiểm thử độc lập mà không bị xung đột mã nguồn (merge conflict) khi kết hợp lại.
3. **Nâng cao khả năng kiểm thử (Testability):** Do mỗi component có tính độc lập và đóng gói cao, chúng ta dễ dàng thực hiện Unit Test (như Snapshot Testing với Jest / React Native Testing Library) bằng cách truyền các bộ props giả lập và kiểm tra kết quả render.
4. **Tiết kiệm chi phí mở rộng sản phẩm (Scalability):** Khi ứng dụng cần bổ sung các màn hình hoặc tính năng mới, phần lớn các thành phần giao diện nền tảng (nút bấm, ô nhập liệu, danh thiếp người dùng, tiêu đề, modal) đã có sẵn trong thư viện component dùng chung, giúp rút ngắn thời gian phát hành tính năng mới.

---

### Câu hỏi 3.
**Hãy so sánh Functional Component và Class Component trong React Native. Theo anh/chị, vì sao hiện nay Functional Component thường được ưu tiên sử dụng hơn khi kết hợp với Hooks?**

#### 1. Bảng so sánh Functional Component và Class Component:

| Tiêu chí | Functional Component (với Hooks) | Class Component (Truyền thống) |
| :--- | :--- | :--- |
| **Cú pháp định nghĩa** | Viết dưới dạng hàm JavaScript thông thường hoặc Arrow Function (`const MyComponent = (props) => ...`) | Khai báo lớp ES6 kế thừa từ `React.Component` (`class MyComponent extends React.Component`) |
| **Phương thức render** | Trả về trực tiếp JSX thông qua lệnh `return (...)` | Phải định nghĩa phương thức bắt buộc `render() { return (...); }` |
| **Quản lý State** | Sử dụng Hook `useState(initialState)` | Khai báo `this.state = {...}` trong constructor và cập nhật bằng `this.setState(...)` |
| **Quản lý Vòng đời (Lifecycle)** | Sử dụng Hook `useEffect(...)` để gộp chung logic của Mount, Update, Unmount | Phải chia nhỏ logic vào các hàm riêng biệt: `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` |
| **Từ khóa `this`** | **Không dùng `this`**. Tránh hoàn toàn lỗi mất ngữ cảnh của `this` | **Bắt buộc dùng `this`** (`this.props`, `this.state`), thường xuyên phải `bind(this)` trong constructor |
| **Kích thước mã nguồn & Đọc hiểu** | Ngắn gọn, súc tích, ít mã thừa (boilerplate), trực quan, dễ đọc | Dài dòng, nhiều cú pháp hướng đối tượng phức tạp, khó theo dõi khi component phình to |
| **Tái sử dụng Logic nghiệp vụ** | Cực kỳ linh hoạt nhờ việc tạo **Custom Hooks** (tách logic ra khỏi UI) | Khó khăn, phải dùng mô hình HOC (Higher-Order Components) hoặc Render Props gây rối cây component ("Wrapper Hell") |
| **Tối ưu hóa hiệu năng (Performance)** | Dễ dàng tối ưu bằng `React.memo`, `useMemo`, `useCallback`, kích thước bundle nhỏ hơn | Tối ưu bằng `PureComponent` hoặc `shouldComponentUpdate`, bundle lớn hơn do cú pháp Class |

#### 2. Vì sao Functional Component kết hợp Hooks được ưu tiên tuyệt đối hiện nay?
1. **Loại bỏ sự phức tạp của từ khóa `this`:** Trong JavaScript, từ khóa `this` hoạt động dựa trên ngữ cảnh thực thi (execution context) chứ không cố định như Java hay C#. Người mới học rất hay gặp lỗi `undefined is not an object (evaluating 'this.setState')` do quên bind hàm sự kiện. Functional Component xóa bỏ hoàn toàn vấn đề này.
2. **Tập trung logic theo chức năng thay vì theo chu kỳ sống:** Trong Class Component, một tác vụ như lắng nghe sự kiện và dọn dẹp bộ nhớ buộc phải chia đôi: khởi tạo ở `componentDidMount` và hủy ở `componentWillUnmount`. Với `useEffect`, toàn bộ logic liên quan được gom gọn vào một nơi duy nhất (trong cùng một effect có kèm hàm cleanup).
3. **Sức mạnh vô hạn của Custom Hooks:** Lập trình viên có thể trừu tượng hóa các tác vụ phức tạp (như gọi API, xác thực người dùng, lắng nghe cảm biến) thành các Custom Hook (ví dụ: `useFetchData`, `useLocation`) và tái sử dụng ở bất kỳ component nào một cách trong sáng, tự nhiên.
4. **Định hướng chiến lược của React và Meta:** Kể từ phiên bản React 16.8, toàn bộ hệ sinh thái thư viện (React Navigation, Redux Toolkit, React Query, React Native Paper) đều chuyển đổi mạnh mẽ sang Hooks. Các tính năng mới của React 18, React 19 (Server Components, Concurrent Mode, Action Hooks) chỉ hỗ trợ tối ưu trên Functional Component.

---

### Câu hỏi 4.
**Hãy giải thích vai trò của useState trong Functional Component. Khi xây dựng một giao diện có dữ liệu thay đổi theo thao tác của người dùng, vì sao cần sử dụng state thay vì chỉ dùng biến thông thường?**

#### 1. Vai trò của `useState`:
* `useState` là Hook cơ bản nhất trong React, cho phép Functional Component lưu giữ và quản lý trạng thái động (state) giữa các lần render.
* **Cú pháp:**
  ```javascript
  const [state, setState] = useState(initialValue);
  ```
  * `state`: Biến lưu giá trị hiện tại của trạng thái.
  * `setState`: Hàm đặc biệt dùng để cập nhật giá trị mới cho state.
  * `initialValue`: Giá trị khởi tạo ban đầu (chỉ áp dụng ở lần render đầu tiên).
* Khi gọi `setState(newValue)`, React sẽ ghi nhận giá trị mới và tự động lên lịch **re-render (vẽ lại)** component để cập nhật giao diện người dùng.

#### 2. Vì sao cần sử dụng State thay vì biến thông thường (biến cục bộ `let`/`var`)?

Khi xây dựng giao diện tương tác (người dùng bấm nút, nhập văn bản, chuyển tab), nếu chỉ sử dụng biến thông thường, ứng dụng sẽ gặp phải 2 vấn đề chí mạng sau:

1. **Biến thông thường KHÔNG kích hoạt cơ chế Re-render:**
   * React theo dõi các thay đổi trên giao diện thông qua cơ chế kích hoạt sự kiện re-render của State.
   * Khi bạn tăng giá trị của một biến thông thường (ví dụ: `let count = 0; count = count + 1;`), giá trị trong bộ nhớ RAM có tăng, nhưng React **hoàn toàn không được thông báo** về sự thay đổi này. Do đó, React không thực thi lại hàm component, thuật toán Virtual DOM không chạy và màn hình thiết bị vẫn giữ nguyên con số cũ. Người dùng không thấy giao diện có bất kỳ phản hồi nào.
2. **Biến thông thường bị "Reset" (xóa sạch) mỗi khi Component render lại:**
   * Mỗi khi component re-render (do component cha render lại hoặc do một state khác thay đổi), toàn bộ hàm component sẽ được chạy lại từ dòng đầu đến dòng cuối.
   * Các biến cục bộ khai báo bằng `let count = 0;` sẽ bị khởi tạo lại về `0`, làm biến mất toàn bộ dữ liệu người dùng đã tương tác trước đó.
3. **Cơ chế lưu trữ đặc biệt của `useState`:**
   * Dữ liệu của `useState` không nằm trong phạm vi thực thi tạm thời của hàm mà được React lưu trữ bên ngoài (trong cấu trúc dữ liệu Fiber Node).
   * Qua mọi lần re-render, React luôn đảm bảo trả về giá trị mới nhất của state đó.
   * Khi gọi hàm setter (`setCount`), React so sánh giá trị cũ và mới, phát hiện sự thay đổi, tính toán lại Virtual DOM và chỉ cập nhật đúng phần tử giao diện cần thiết trên Native UI Thread.

#### 💡 Bảng đối chiếu minh họa:

| Tiêu chí | Dùng biến thông thường (`let count = 0`) | Dùng State (`const [count, setCount] = useState(0)`) |
| :--- | :--- | :--- |
| **Khả năng lưu giữ qua các lần render** | Bị reset về giá trị ban đầu mỗi khi render lại | Được React lưu giữ liên tục qua suốt vòng đời component |
| **Kích hoạt Re-render cập nhật UI** | **KHÔNG** (Giao diện giữ nguyên, không đổi số) | **CÓ** (Tự động cập nhật UI tức thì trên màn hình) |
| **Mục đích sử dụng** | Dùng cho các phép tính toán tạm thời tức thì | Dùng cho mọi dữ liệu hiển thị ảnh hưởng đến giao diện |

---

### Câu hỏi 5.
**Hãy trình bày chức năng của useEffect trong React Native. Nêu một số tình huống thực tế có thể sử dụng useEffect, chẳng hạn như ghi log sau khi render, gọi API hoặc xử lý tác vụ phụ trong component.**

#### 1. Chức năng của `useEffect` trong React Native:
* **Khái niệm Side Effect (Tác vụ phụ):** Trong mô hình lập trình React, một component lý tưởng phải là một "hàm thuần khiết" (Pure Function) – chỉ nhận props/state và trả về JSX. Bất kỳ thao tác nào làm biến đổi dữ liệu bên ngoài, tương tác trực tiếp với API hệ thống, gọi mạng, hẹn giờ,... đều được gọi là **Side Effect**.
* **Chức năng của `useEffect`:** Cung cấp giải pháp chuẩn mực để thực hiện các Side Effects trong Functional Component sau khi React đã hoàn tất quá trình render giao diện lên màn hình.
* **Cú pháp tổng quát:**
  ```javascript
  useEffect(() => {
    // 1. Thực thi tác vụ phụ (Side Effect logic)
    
    return () => {
      // 2. Hàm dọn dẹp (Cleanup Function) - chạy khi component unmount hoặc trước effect kế tiếp
    };
  }, [dependencies]); // 3. Mảng phụ thuộc (Dependency Array)
  ```
* **Ý nghĩa của Mảng phụ thuộc (`dependencies`):**
  1. `useEffect(() => { ... })` *(Không truyền mảng)*: Chạy sau **mọi** lần render của component.
  2. `useEffect(() => { ... }, [])` *(Mảng rỗng)*: Chỉ chạy **đúng 1 lần duy nhất** sau khi component được hiển thị lần đầu tiên lên màn hình (tương đương `componentDidMount`).
  3. `useEffect(() => { ... }, [propA, stateB])` *(Có biến phụ thuộc)*: Chỉ chạy lại khi giá trị của `propA` hoặc `stateB` bị thay đổi.
  4. `return () => { ... }` *(Cleanup function)*: Giải phóng tài nguyên, hủy đăng ký sự kiện trước khi component bị hủy khỏi màn hình (tương đương `componentWillUnmount`).

#### 2. Các tình huống thực tế thường xuyên sử dụng `useEffect`:

1. **Gọi API lấy dữ liệu từ máy chủ (Data Fetching):**  
   Khi người dùng vừa mở một màn hình (ví dụ: màn hình Danh sách Ghi chú hoặc Danh sách Sinh viên), component cần gửi một HTTP Request lên máy chủ Backend để lấy dữ liệu về nạp vào state:
   ```javascript
   useEffect(() => {
     const fetchNotes = async () => {
       try {
         const response = await fetch('https://api.example.com/notes');
         const data = await response.json();
         setNotes(data);
       } catch (error) {
         console.error('Lỗi tải dữ liệu:', error);
       }
     };
     fetchNotes();
   }, []); // Chạy 1 lần khi màn hình mở lên
   ```
2. **Đăng ký và Hủy lắng nghe sự kiện thiết bị (Event Listeners & Subscriptions):**  
   Lắng nghe sự kiện bàn phím mở/đóng, trạng thái kết nối Internet (NetInfo), hoặc cảm biến xoay màn hình. Việc có hàm `return cleanup` giúp hủy lắng nghe khi rời màn hình, ngăn chặn rò rỉ bộ nhớ (**Memory Leak**):
   ```javascript
   useEffect(() => {
     const keyboardListener = Keyboard.addListener('keyboardDidShow', () => {
       setIsKeyboardVisible(true);
     });

     return () => {
       // Cleanup: Bắt buộc hủy listener khi component unmount
       keyboardListener.remove();
     };
   }, []);
   ```
3. **Bộ đếm thời gian (Timers: `setInterval` / `setTimeout`):**  
   Tạo tính năng đếm ngược thời gian gửi mã OTP hoặc đồng hồ bấm giờ:
   ```javascript
   useEffect(() => {
     const timer = setInterval(() => {
       setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
     }, 1000);

     return () => clearInterval(timer); // Xóa interval khi người dùng thoát
   }, []);
   ```
4. **Ghi nhật ký phân tích người dùng (Logging & Analytics):**  
   Theo dõi hành vi người dùng truy cập màn hình hoặc ghi lại nhật ký debug sau mỗi lần render để kiểm tra biến thay đổi:
   ```javascript
   useEffect(() => {
     console.log(`[LOG] Người dùng đã cập nhật số lần bấm mới: ${count}`);
   }, [count]); // Ghi log mỗi khi state 'count' đổi giá trị
   ```
5. **Tự động lưu dữ liệu vào Bộ nhớ cục bộ (Auto-save to AsyncStorage):**  
   Khi người dùng chỉnh sửa nội dung bài viết, `useEffect` có thể lắng nghe sự thay đổi của nội dung và tự động lưu vào bộ nhớ máy để tránh mất dữ liệu:
   ```javascript
   useEffect(() => {
     AsyncStorage.setItem('SAVED_NOTE', noteContent);
   }, [noteContent]);
   ```

---

# PHẦN B: BÀI TẬP LUYỆN TẬP THỰC HÀNH

Mã nguồn hoàn chỉnh của các bài tập được tổ chức chuẩn hóa trong thư mục `BaiTapHangTuan/tuan6`:
```text
BaiTapHangTuan/tuan6/
├── App.js                     # File điều phối trung tâm tích hợp giao diện cả 3 bài tập
├── components/
│   ├── Greeting.js            # [Bài tập 1] Functional Component Greeting nhận prop name
│   ├── StudentInfo.js         # [Bài tập 2] Component StudentInfo hiển thị thông tin sinh viên
│   └── CounterHook.js         # [Bài tập 3] Component CounterHook quản lý state với useState
├── package.json               # Cấu hình thư viện React, React Native, Expo
├── app.json                   # Cấu hình hiển thị ứng dụng
├── index.js                   # Điểm nạp ứng dụng chuẩn Expo / React Native
└── README.md                  # Toàn văn báo cáo lý thuyết và thực hành Tuần 6
```

---

## 1. BÀI TẬP 1 – MỨC DỄ: COMPONENT GREETING

### 📌 Mục tiêu:
* Hiểu cách khai báo Functional Component cơ bản.
* Nắm vững cách truyền dữ liệu từ Component cha xuống Component con thông qua thuộc tính (`props`).
* Nhận diện tính bất biến của Props (Props là Read-only).

### 💻 Mã nguồn Component con: `components/Greeting.js`
```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Bài tập 1 - Functional Component Greeting
 * @param {Object} props - Thuộc tính truyền từ component cha
 * @param {string} props.name - Tên của người dùng cần hiển thị lời chào
 */
const Greeting = ({ name }) => {
  return (
    <View style={styles.card}>
      <View style={styles.avatarMini}>
        <Text style={styles.avatarText}>
          {name ? name.charAt(0).toUpperCase() : '?'}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.greetingText}>
          Xin chào, <Text style={styles.highlightName}>{name || 'Bạn'}!</Text> 👋
        </Text>
        <Text style={styles.subText}>Chào mừng bạn đến với bài học React Native</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginVertical: 6,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  avatarMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  content: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  highlightName: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default Greeting;
```

### 💻 Cách import và sử dụng trong `App.js` (Sử dụng ít nhất 2 lần với 2 tên khác nhau):
```javascript
import Greeting from './components/Greeting';

// Sử dụng trong hàm render:
<Greeting name="Nguyễn Văn A" />
<Greeting name="Bùi Quang Duy" />
<Greeting name="Lê Duy Linh" />
```

### 🔍 Phân tích nguyên lý:
* Cú pháp Destructuring `{ name }` giúp lấy trực tiếp trường `name` từ đối tượng `props`.
* Component cha truyền giá trị thông qua cú pháp giống HTML Attribute: `name="Nguyễn Văn A"`.
* Component con hiển thị lời chào thân thiện kèm icon chữ cái đầu avatar được tính toán tự động `name.charAt(0)`.

---

## 2. BÀI TẬP 2 – MỨC DỄ ĐẾN TRUNG BÌNH: COMPONENT STUDENTINFO

### 📌 Mục tiêu:
* Xây dựng component nhận nhiều trường dữ liệu phức tạp (`name`, `className`, `major`, `studentId`, `status`).
* Thực hành tái sử dụng component để hiển thị danh sách động các đối tượng sinh viên.
* Rèn luyện tư duy phân chia layout dạng Card (Thẻ hồ sơ sinh viên) hiện đại.

### 💻 Mã nguồn Component con: `components/StudentInfo.js`
```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Bài tập 2 - Functional Component StudentInfo
 * @param {Object} props - Dữ liệu nhận từ component cha
 * @param {string} props.name - Họ và tên sinh viên
 * @param {string} [props.studentId] - Mã số sinh viên
 * @param {string} props.className - Lớp học
 * @param {string} props.major - Ngành học
 * @param {string} [props.status] - Trạng thái học tập
 */
const StudentInfo = ({ name, studentId, className, major, status = 'Đang học' }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {name ? name.split(' ').pop().charAt(0).toUpperCase() : 'S'}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.studentName}>{name}</Text>
          {studentId ? (
            <Text style={styles.studentIdText}>Mã SV: {studentId}</Text>
          ) : null}
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>🏫 Lớp học:</Text>
          <Text style={styles.value}>{className}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>🎓 Ngành học:</Text>
          <Text style={[styles.value, styles.majorHighlight]}>{major}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  studentIdText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  detailContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  majorHighlight: {
    color: '#2563EB',
  },
});

export default StudentInfo;
```

### 💻 Cách render danh sách sinh viên trong `App.js`:
```javascript
import StudentInfo from './components/StudentInfo';

const students = [
  { id: '1', name: 'Bùi Quang Duy', studentId: '11223077', className: 'Lớp 12325W.3', major: 'Công nghệ Thông tin', status: 'Trưởng nhóm' },
  { id: '2', name: 'Lê Duy Linh', studentId: '11223078', className: 'Lớp 12325W.3', major: 'Công nghệ Thông tin', status: 'Thành viên' },
  { id: '3', name: 'Nguyễn Văn A', studentId: '11223001', className: 'Lớp 12325W.1', major: 'Kỹ thuật Phần mềm', status: 'Đang học' },
  { id: '4', name: 'Trần Thị B', studentId: '11223002', className: 'Lớp 12325W.2', major: 'Hệ thống Thông tin', status: 'Đang học' },
];

// Trong JSX:
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
```

---

## 3. BÀI TẬP 3 – MỨC TRUNG BÌNH: COMPONENT COUNTERHOOK

### 📌 Mục tiêu:
* Làm chủ Hook `useState` trong môi trường thực tế.
* Quản lý trạng thái ban đầu là `0`.
* Xử lý sự kiện bấm nút (`onPress`) và kích hoạt cập nhật giao diện (Re-render).
* Bổ sung tính năng giảm và reset giá trị để trải nghiệm người dùng hoàn chỉnh.

### 💻 Mã nguồn Component: `components/CounterHook.js`
```javascript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Bài tập 3 - Component CounterHook sử dụng useState
 * Quản lý giá trị đếm ban đầu là 0
 * Cập nhật state và re-render giao diện mỗi lần người dùng bấm nút
 */
const CounterHook = () => {
  // Khởi tạo state count với giá trị ban đầu là 0
  const [count, setCount] = useState(0);

  // Hàm xử lý tăng giá trị đếm
  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1);
  };

  // Hàm xử lý giảm giá trị đếm
  const handleDecrement = () => {
    if (count > 0) {
      setCount(prevCount => prevCount - 1);
    }
  };

  // Hàm đặt lại giá trị về 0
  const handleReset = () => {
    setCount(0);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Bộ đếm tương tác (useState)</Text>
      <Text style={styles.description}>
        Mỗi khi bấm nút "Tăng", hàm setCount được kích hoạt, giá trị state thay đổi và React sẽ tự động re-render lại component.
      </Text>

      {/* Vùng hiển thị số lần bấm */}
      <View style={styles.counterDisplay}>
        <Text style={styles.displayLabel}>Số lần bấm hiện tại:</Text>
        <Text style={styles.counterValue}>{count}</Text>
        <Text style={styles.subStatus}>
          {count === 0
            ? 'Chưa bấm lần nào'
            : `Bạn đã tương tác ${count} lần với ứng dụng`}
        </Text>
      </View>

      {/* Nhóm các nút bấm tương tác */}
      <View style={styles.buttonGroup}>
        {/* Nút TĂNG (Yêu cầu chính của đề bài) */}
        <TouchableOpacity
          style={styles.btnIncrement}
          onPress={handleIncrement}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>➕ Tăng (+1)</Text>
        </TouchableOpacity>

        {/* Các nút bổ trợ để sinh động và kiểm thử */}
        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={[styles.btnSecondary, count === 0 && styles.btnDisabled]}
            onPress={handleDecrement}
            disabled={count === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.btnSecondaryText}>➖ Giảm (-1)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnReset}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Text style={styles.btnResetText}>🔄 Đặt lại (0)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Khối giải thích cơ chế Re-render */}
      <View style={styles.insightBox}>
        <Text style={styles.insightTitle}>💡 Cơ chế hoạt động của Hook:</Text>
        <Text style={styles.insightText}>
          • <Text style={styles.codeText}>const [count, setCount] = useState(0);</Text>{'\n'}
          • Khi gọi <Text style={styles.codeText}>setCount(count + 1)</Text>, React ghi nhận state mới và lên lịch so khớp Virtual DOM để cập nhật đúng vị trí hiển thị con số trên UI.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  counterDisplay: {
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    marginBottom: 18,
  },
  displayLabel: {
    fontSize: 14,
    color: '#6D28D9',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  counterValue: {
    fontSize: 54,
    fontWeight: '800',
    color: '#4F46E5',
    marginVertical: 4,
  },
  subStatus: {
    fontSize: 12,
    color: '#7C3AED',
    fontStyle: 'italic',
  },
  buttonGroup: {
    gap: 10,
  },
  btnIncrement: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 10,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnSecondaryText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnReset: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  btnResetText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  insightBox: {
    marginTop: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0EA5E9',
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#D97706',
    fontWeight: '600',
  },
});

export default CounterHook;
```

---

## 4. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY ỨNG DỤNG

### Bước 1: Mở Terminal tại thư mục `tuan6`
```bash
cd BaiTapHangTuan/tuan6
```

### Bước 2: Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

### Bước 3: Khởi chạy ứng dụng
```bash
# Khởi chạy máy chủ Metro Bundler
npx expo start

# Hoặc chạy trực tiếp trên thiết bị Android:
npx expo start --android

# Hoặc chạy trên trình duyệt web:
npx expo start --web
```

---

## 5. HƯỚNG DẪN NỘP BÀI LÊN HỆ THỐNG VÀ GITHUB

1. **Commit và đẩy mã nguồn lên GitHub:**
   ```bash
   git add .
   git commit -m "Hoàn thành bài tập Tuần 06: Component, Props và Hooks (useState, useEffect)"
   git push origin main
   ```
2. **Nộp bài trực tuyến:**
   * Sao chép liên kết repository GitHub: `https://github.com/duy112233077-creator/notes-app-react-native.git`
   * Dán liên kết vào ô nộp bài trên hệ thống học tập trực tuyến của trường.
   * Nhấn nút **Done** / **Nộp bài** để hoàn tất quá trình nộp bài.

---
*(Báo cáo hoàn thành ngày 04/10/2026 - Nhóm sinh viên Bùi Quang Duy, Lê Duy Linh)*
