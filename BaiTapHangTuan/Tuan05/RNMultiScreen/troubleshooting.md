# Nhật Ký Ghi Nhận & Xử Lý Lỗi Môi Trường (Troubleshooting Log) - RNMultiScreen

Tài liệu này ghi lại 3 lỗi môi trường thực tế thường gặp phải khi xây dựng và khởi chạy ứng dụng React Native / Expo đa màn hình, cùng nguyên nhân chi tiết và các bước khắc phục.

---

## ❌ Lỗi 1: ADB Command Not Recognized (Thiếu đường dẫn Android SDK Platform-Tools)

### 📌 Mô tả lỗi:
Khi thực hiện kiểm tra thiết bị Android bằng lệnh `adb devices` hoặc chạy ứng dụng native với `npx react-native run-android`, Terminal báo lỗi:
```text
adb : The term 'adb' is not recognized as the name of a cmdlet, function, script file, or operable program.
```

### 🔍 Nguyên nhân:
Đường dẫn thư mục `platform-tools` thuộc Android SDK (chứa công cụ `adb.exe`) chưa được khai báo vào biến môi trường `PATH` trên hệ điều hành Windows.

### 🛠️ Cách xử lý:
1. Xác định đường dẫn thư mục `platform-tools` (thường là `C:\Users\<Tên_User>\AppData\Local\Android\Sdk\platform-tools`).
2. Mở Start menu > Tìm kiếm **"Edit the system environment variables"** > Chọn **Environment Variables...**
3. Tại phần **User variables** hoặc **System variables**, chọn dòng `Path` > Bấm **Edit**.
4. Bấm **New** và dán đường dẫn `platform-tools` vào.
5. Bấm **OK** để lưu lại, mở lại PowerShell / Command Prompt hoàn toàn mới và kiểm tra lại bằng lệnh:
   ```bash
   adb version
   ```

---

## ❌ Lỗi 2: Missing Native Screen / Safe Area Dependency (Lỗi crash React Navigation Stack)

### 📌 Mô tả lỗi:
Khi ứng dụng vừa khởi chạy hoặc chuyển màn hình với `Stack.Navigator`, giao diện báo lỗi hoặc crash ứng dụng với dòng thông báo:
```text
Uncaught Error: Requiring module "node_modules/@react-navigation/native-stack...", which threw an exception: TypeError: Cannot read property 'NativeScreensModule' of null
```

### 🔍 Nguyên nhân:
Thư viện `@react-navigation/native-stack` yêu cầu hai thư viện native bên dưới là `react-native-screens` và `react-native-safe-area-context`. Nếu cài đặt thiếu các thư viện này hoặc cài sai phiên bản không tương thích với Expo SDK, Native Bridge không thể liên kết được các màn hình tương ứng.

### 🛠️ Cách xử lý:
1. Cài đặt bổ sung đầy đủ hai thư viện native chuẩn hóa theo phiên bản Expo bằng lệnh:
   ```bash
   npx expo install react-native-screens react-native-safe-area-context
   ```
2. Thực hiện clear cache của Metro Bundler khi khởi động lại:
   ```bash
   npx expo start -c
   ```

---

## ❌ Lỗi 3: Port 8081 / Metro Bundler bị chiếm dụng (Lỗi EADDRINUSE)

### 📌 Mô tả lỗi:
Khi khởi chạy server Expo với `npx expo start`, Terminal xuất hiện thông báo:
```text
Port 8081 is already in use. Use another port?
```
Hoặc ứng dụng trên Expo Go không thể kết nối tới máy chủ phát triển (Metro Server).

### 🔍 Nguyên nhân:
Tiến trình Metro Bundler của ứng dụng trước đó (ví dụ: project `BTL_NoteApp`) hoặc một ứng dụng Node.js khác vẫn đang chạy ẩn dưới nền và giữ cổng `8081`.

### 🛠️ Cách xử lý:
* **Cách 1: Tắt tiến trình Node đang chạy ngầm bằng PowerShell (Khuyên dùng)**
  ```powershell
  Stop-Process -Name node -Force
  ```
* **Cách 2: Đổi sang cổng khác để khởi chạy Expo**
  ```bash
  npx expo start --port 8082
  ```
