# BÁO CÁO BÀI TẬP TUẦN 5 - REACT NATIVE MULTISCREEN (LAB 02)

**Họ và tên sinh viên:** Bùi Văn Duy - Lê Duy Linh  
**Chức danh:** Lập trình viên  
**Mã sinh viên:** 11223077  
**Lớp học:** Lớp 12325W.3  
**Email:** duy11223077@gmail.com  
**Repository GitHub:** [https://github.com/duy112233077-creator/notes-app-react-native.git](https://github.com/duy112233077-creator/notes-app-react-native.git)  

---

# PHẦN A: BÀI TẬP LUYỆN TẬP THỰC HÀNH

## 1. Bài tập mức dễ: Quy trình hoạt động của ứng dụng React Native khi khởi chạy

### 📌 3 Thread chính trong Kiến trúc React Native:
1. **Native Thread (Main / UI Thread):** Quản lý vòng đời ứng dụng, lắng nghe sự kiện vuốt/chạm (User Touch Events) và render các phần tử giao diện người dùng gốc (Native UI Components như `android.widget.TextView`, `android.view.ViewGroup` trên Android hoặc `UILabel`, `UIView` trên iOS).
2. **JavaScript Thread:** Chạy toàn bộ mã nguồn JavaScript/React (logic xử lý dữ liệu, state, props, JSX và gọi API).
3. **Shadow Thread (Yoga Layout Engine):** Tính toán kích thước, vị trí và bố cục khung hình (Layout, Flexbox) của các thành phần giao diện, chuyển đổi thành tọa độ và kích thước pixel tuyệt đối.

### 🔄 Luồng phối hợp giữa các thành phần khi ứng dụng khởi chạy:
1. **Khởi tạo:** Người dùng mở ứng dụng, Native Thread khởi chạy và tạo môi trường thực thi JavaScript Engine (Hermes / JSC).
2. **Thực thi JS:** JavaScript Thread nạp mã nguồn, chạy `App.js` và tạo cây giao diện ảo (Virtual DOM / React Element Tree).
3. **Tính toán Bố cục:** JavaScript Thread gửi thông điệp cấu trúc sang Shadow Thread. Shadow Thread sử dụng Yoga Engine để tính toán vị trí, kích thước chính xác dựa trên thuộc tính Flexbox.
4. **Vẽ Giao diện Native:** Shadow Thread gửi thông số bố cục đã tính toán sang Native Thread. Native Thread vẽ các phần tử Native thật lên màn hình thiết bị.

---

## 2. Bài tập mức dễ đến trung bình: Đoạn mã ví dụ View, Text & Styling

### 💻 Mã nguồn ví dụ:
```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HelloRN() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hello React Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
});
```

### 📖 Giải thích đoạn mã:
* **`View`:** Là thành phần container cơ bản (tương tự thẻ `<div>` trên Web) dùng để bọc và quản lý bố cục cho các phần tử con.
* **`Text`:** Là thành phần bắt buộc để hiển thị văn bản (tương tự `<span>`/`<p>` trên Web). Trong React Native, mọi chữ hiển thị đều phải bọc trong `<Text>`.
* **`StyleSheet`:** Dùng để định nghĩa kiểu dáng, màu sắc, khoảng cách theo mô hình Flexbox. Dùng `StyleSheet.create` giúp tối ưu hiệu năng do mã style được tạo ID duy nhất.
* **Vì sao chuyển thành Native UI?** Thông qua cơ chế Bridge / JSI, React Native ánh xạ (mapping) trực tiếp phần tử `<View>` thành `ViewGroup`/`UIView` và `<Text>` thành `TextView`/`UILabel` trên thiết bị thật, giúp app đạt hiệu năng thuần gốc.

---

## 3. Bài tập mức trung bình: Checklist thiết bị Android thật & Báo cáo lỗi

### 📋 Checklist các bước chuẩn bị:
- [x] **Bật Developer Mode:** Vào *Settings* -> *About Phone* -> Nhấn 7 lần vào *Build Number*.
- [x] **Bật USB Debugging:** Vào *Settings* -> *System* -> *Developer Options* -> Bật *USB Debugging*.
- [x] **Kết nối Cáp USB:** Cắm cáp kết nối điện thoại với PC (chọn chế độ MTP / File Transfer).
- [x] **Cấp quyền tin cậy:** Mở màn hình điện thoại, chọn *"Always allow from this computer"* và bấm *Allow*.
- [x] **Kiểm tra thiết bị:** Chạy lệnh `adb devices` trong Terminal để đảm bảo thiết bị xuất hiện ở trạng thái `device`.
- [x] **Chạy ứng dụng:** Chạy `npx react-native run-android` hoặc `npx expo start`.

### ⚠️ Lỗi thường gặp nếu thiết bị chưa nhận diện / mở khóa:
1. **Lỗi `unauthorized`:** Do chưa bấm "Allow" cấp quyền RSA trên màn hình điện thoại. Khắc phục bằng cách cắm lại cáp, mở khóa điện thoại và bấm xác nhận.
2. **Lỗi `no devices/emulators found`:** Do dây cáp USB hỏng (cáp sạc thuần túy), chưa bật USB Debugging hoặc thiếu Driver USB Android trên Windows.
3. **Lỗi ngắt cài đặt APK (`INSTALL_FAILED_CANCELLED_BY_USER`):** Do màn hình điện thoại bị khóa hoặc cài đặt mật khẩu khi nhận tệp APK từ máy tính. Cần luôn mở khóa điện thoại trong khi chạy lệnh build.

---

# PHẦN B: THỰC HÀNH LAB 02 — PROJECT RNMULTISCREEN

### 📁 Cấu trúc Thư mục Dự án:
```text
RNMultiScreen/
├── App.js                     (Cấu hình NavigationContainer + Stack.Navigator)
├── screens/
│   ├── HomeScreen.js          (Trang chủ điều hướng sang Profile & Settings)
│   ├── ProfileScreen.js       (Hồ sơ cá nhân sinh viên Bùi Văn Duy - Lê Duy Linh)
│   └── SettingsScreen.js      (Cài đặt hệ thống + Nút quay về Home)
├── troubleshooting.md         (Ghi nhận 3 lỗi môi trường & cách xử lý)
├── BAO_CAO_TUAN_5.md          (Báo cáo tổng hợp bài tập tuần 5)
└── package.json               (Cấu hình các gói phụ thuộc React Navigation)
```

### 🔗 Mã nguồn các Màn hình chính:
* **Stack Navigation ([App.js](file:///c:/Users/duyen/andoi/RNMultiScreen/App.js)):** Đã bọc `NavigationContainer` và khai báo 3 `Stack.Screen` (`Home`, `Profile`, `Settings`).
* **Trang chủ ([HomeScreen.js](file:///c:/Users/duyen/andoi/RNMultiScreen/screens/HomeScreen.js)):** Chứa giao diện chào mừng và các nút điều hướng `navigation.navigate('Profile')` & `navigation.navigate('Settings')`.
* **Hồ sơ ([ProfileScreen.js](file:///c:/Users/duyen/andoi/RNMultiScreen/screens/ProfileScreen.js)):** Hiển thị đầy đủ thông tin cá nhân sinh viên Bùi Văn Duy - Lê Duy Linh (Mã SV: `11223077`, Lớp: `Lớp 12325W.3`, Email: `duy11223077@gmail.com`).
* **Cài đặt ([SettingsScreen.js](file:///c:/Users/duyen/andoi/RNMultiScreen/screens/SettingsScreen.js)):** Tùy chỉnh thông báo, chế độ tối và nút `navigation.popToTop()` trở về Home.
* **Nhật ký lỗi ([troubleshooting.md](file:///c:/Users/duyen/andoi/RNMultiScreen/troubleshooting.md)):** Ghi lại chi tiết 3 lỗi môi trường (Lỗi ADB Command, Lỗi Native Screen Dependency, Lỗi Port 8081).
