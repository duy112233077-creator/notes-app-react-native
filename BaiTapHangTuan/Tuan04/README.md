# BÀI TẬP TUẦN 04 - TÌM HIỂU KIẾN TRÚC VÀ CÀI ĐẶT MÔI TRƯỜNG REACT NATIVE

**Họ và tên:** Bùi Quang Duy, Lê Duy Linh  
**Mã Sinh Viên:** [MSV]  
**Lớp:** [Mã Lớp]  
**Môn học:** Lập trình ứng dụng Di động / React Native  

---

## A. CÂU HỎI ÔN TẬP LÝ THUYẾT

### Câu 1. Quy trình hoạt động cơ bản của một ứng dụng React Native
Quy trình hoạt động cơ bản của ứng dụng React Native bao gồm 5 bước chính:

1. **Lập trình viên viết mã JavaScript:**  
   Lập trình viên xây dựng ứng dụng bằng JavaScript/TypeScript cùng với các thành phần React (JSX, State, Props, Hooks).

2. **Mã được xử lý trong JavaScript Runtime:**  
   Mã nguồn JS được đóng gói (bundle) bởi Metro Bundler. Khi ứng dụng khởi chạy, mã JS sẽ được thực thi bên trong **JavaScript Engine** (chẳng hạn như **Hermes** hoặc **JavaScriptCore**). Tại đây, JS Engine tính toán và đưa ra danh sách các hành động/lệnh cần tương tác với hệ thống.

3. **Gửi yêu cầu qua Bridge (Cầu nối):**  
   Mọi yêu cầu tạo UI, cập nhật thuộc tính hoặc gọi API thiết bị từ JS không được thực thi trực tiếp trên Native mà được chuyển đổi (serialize) thành định dạng dữ liệu **JSON**. Chuỗi JSON này được xếp vào hàng đợi (Queue) và gửi qua **Bridge** theo cơ chế **bất đồng bộ (Asynchronous)**.

4. **Ứng dụng Native xử lý yêu cầu:**  
   Phía Native (Android sử dụng Java/Kotlin; iOS sử dụng Objective-C/Swift) nhận các thông điệp JSON từ Bridge. Native UI Thread/UIManager sẽ giải mã (deserialize) và tiến hành tạo hoặc cập nhật các vị trí thành phần UI Native thực sự trên màn hình thiết bị (như `ViewGroup`, `TextView` trên Android hoặc `UIView`, `UILabel` trên iOS).

5. **Trả kết quả về cho JavaScript:**  
   Khi người dùng tương tác với thiết bị (vuốt, chạm, nhập dữ liệu) hoặc khi các tác vụ Native hoàn thành (lấy xong tọa độ GPS, chụp ảnh xong), các sự kiện này được Native đóng gói thành thông điệp JSON và gửi ngược qua Bridge về cho JavaScript Runtime để kích hoạt các hàm phản hồi (event callbacks) tương ứng.

---

### Câu 2. Vai trò của Bridge trong React Native
**Bridge** là thành phần trung gian đóng vai trò là một giao diện truyền thông điệp (Message Passing Interface) giữa hai môi trường hoàn toàn độc lập: **JavaScript Thread** và **Native Main/UI Thread**.

**Vì sao Bridge là thành phần quan trọng?**
* **Xử lý sự bất tương thích ngôn ngữ:** JavaScript và các ngôn ngữ Native (Java/Kotlin/Swift) không thể đọc hay gọi hàm trực tiếp của nhau. Bridge giúp chuẩn hóa dữ liệu hai bên thông qua định dạng chung là chuỗi **JSON**.
* **Đảm bảo hiệu năng với cơ chế bất đồng bộ (Asynchronous):** Bridge hoạt động theo cơ chế Asynchronous, nghĩa là JS Thread không bị tắc nghẽn (block) khi Native xử lý tác vụ nặng và ngược lại. Điều này giúp ứng dụng giữ được tốc độ phản hồi 60fps mượt mà.
* **Cho phép JS điều khiển hệ sinh thái Native:** Nhờ có Bridge, mã JavaScript viết một lần có thể gọi các API thiết bị cấp thấp (Camera, Bluetooth, Sensor, File System, Storage) và render ra các thành phần giao diện Native gốc của từng hệ điều hành mà không cần phải giả lập qua màn hình WebView.

---

### Câu 3. Phân tích sự khác nhau trong việc cài đặt môi trường React Native trên Windows và macOS

| Tiêu chí | Môi trường Windows | Môi trường macOS |
| :--- | :--- | :--- |
| **Nền tảng ứng dụng có thể build** | **Chỉ build được Android** | **Build được cả iOS và Android** |
| **Công cụ build iOS** | Không hỗ trợ (Không thể cài Xcode) | **Xcode** (iOS Simulator, Trình biên dịch Swift/Objective-C) |
| **Công cụ build Android** | **Android Studio**, Android SDK, Java JDK | **Android Studio**, Android SDK, Java JDK |
| **Trình quản lý gói hệ thống** | Chocolatey / winget | Homebrew (Brew) |
| **Công cụ hỗ trợ khác** | Python, Node.js, VS Code | Watchman, CocoaPods, Node.js, VS Code |

**Giải thích nguyên nhân:**
* **Vì sao Windows chỉ build được ứng dụng Android:**  
  Để đóng gói và biên dịch một ứng dụng iOS, hệ thống bắt buộc phải sử dụng **Xcode**, bộ công cụ lập trình cùng với trình biên dịch `swiftc`/`clang` và các SDK/chứng chỉ bảo mật (Provisioning Profile) do Apple phát triển. Apple giới hạn bản quyền và thiết kế Xcode để **chỉ chạy duy nhất trên hệ điều hành macOS**. Windows không sở hữu nhân Darwin/macOS nên không thể cài đặt Xcode gốc để biên dịch trực tiếp ra ứng dụng iOS.
* **Vì sao macOS build được cả hai:**  
  macOS hỗ trợ đầy đủ các công cụ độc quyền của Apple (Xcode) để build iOS, đồng thời Google cũng cung cấp đầy đủ Android Studio, Android SDK và Java JDK tương thích hoàn hảo trên hệ điều hành macOS. Do đó, kỹ sư lập trình sử dụng máy Mac có thể phát triển song song cho cả hai nền tảng Android và iOS trên cùng một máy tính.

---

### Câu 4. Các bước cơ bản để khởi tạo và chạy một dự án React Native đầu tiên
Để khởi tạo và chạy một dự án React Native bằng React Native CLI, ta thực hiện các bước:

1. **Chuẩn bị môi trường:** Cài đặt Node.js, JDK, Android Studio (với Android SDK) hoặc Xcode.
2. **Mở Terminal/CMD** tại thư mục mong muốn và gõ lệnh khởi tạo.
3. **Di chuyển vào thư mục dự án** và chạy lệnh khởi động nền tảng tương ứng.

**Ý nghĩa của từng lệnh:**
* `npx react-native init ProjectName` *(hoặc `react-native init ProjectName`)*:  
  Khởi tạo cấu trúc bộ mã nguồn dự án React Native CLI mới có tên là `ProjectName`. Lệnh này sẽ tự động tải các template tiêu chuẩn, tạo thư mục mã nguồn JS/TS, thư mục cấu hình Native `android/`, `ios/` và tự động cài đặt các dependency phụ thuộc từ npm.
* `cd ProjectName`:  
  Chuyển đường dẫn thư mục làm việc hiện tại của cửa sổ dòng lệnh (Terminal/Command Prompt) đi vào bên trong thư mục gốc của dự án `ProjectName` vừa được tạo.
* `react-native run-android` *(hoặc `npx react-native run-android`)*:  
  Biên dịch toàn bộ mã nguồn Java/Kotlin/C++ và JS thành file `.apk`, tự động kết nối và mở máy ảo Android (Android Emulator) hoặc thiết bị thật (qua USB ADB) để cài đặt và khởi chạy ứng dụng Android.
* `react-native run-ios` *(hoặc `npx react-native run-ios`)*:  
  Gọi công cụ Xcode trên macOS để biên dịch mã nguồn Swift/Objective-C và JS, tự động khởi chạy máy ảo iOS Simulator và cài đặt ứng dụng iOS (Lệnh này chỉ chạy được trên macOS).

---

### Câu 5. Vai trò của các thành phần cơ bản trong cấu trúc dự án React Native

* `android/`: Thư mục chứa toàn bộ mã nguồn Native dành riêng cho nền tảng Android (Bao gồm cấu hình Gradle, `AndroidManifest.xml`, file khởi chạy `MainActivity`/`MainApplication`, tài nguyên hình ảnh drawable).
* `ios/`: Thư mục chứa toàn bộ mã nguồn Native dành riêng cho nền tảng iOS (Bao gồm file dự án Xcode `.xcodeproj`/`.xcworkspace`, cấu hình dependencies `Podfile`, file cài đặt `AppDelegate` và `Info.plist`).
* `node_modules/`: Thư mục chứa toàn bộ mã nguồn của các thư viện phụ thuộc (dependencies) được tải về từ npm/yarn mà dự án khai báo sử dụng.
* `package.json`: File cấu hình trung tâm của dự án Node.js. Khai báo các thông tin tổng quan (tên, phiên bản), danh sách thư viện phụ thuộc (`dependencies`, `devDependencies`) và các câu lệnh thực thi nhanh (`scripts`).
* `index.js`: Điểm khởi chạy đầu tiên (Entry Point) của ứng dụng React Native. Nơi sử dụng `AppRegistry.registerComponent` để đăng ký Component gốc với hệ thống Native.
* `app.json`: File chứa thông tin cấu hình tĩnh dạng JSON cho ứng dụng như tên hiển thị (`displayName`) và tên ứng dụng (`name`), được Metro Bundler và bộ CLI sử dụng.
* `App.js`: Component giao diện chính của ứng dụng. Nơi lập trình viên bắt đầu viết cấu trúc giao diện, định tuyến và xử lý logic cho ứng dụng.

---

## B. BÀI TẬP LUYỆN TẬP THỰC HÀNH

### Bài tập 1 – Mức dễ

#### 1. Sơ đồ hoạt động của React Native
```
+-----------------------------------------------------------------+
|                        MÃ JAVASCRIPT                            |
|             (Viết giao diện JSX, logic, xử lý event)            |
+-----------------------------------------------------------------+
                                |
                                v
+-----------------------------------------------------------------+
|                    JAVASCRIPT RUNTIME (Engine)                  |
|                 (Thực thi mã JS bằng Hermes/JSC)                |
+-----------------------------------------------------------------+
                                |
                                v
+-----------------------------------------------------------------+
|                            BRIDGE                               |
|        (Chuyển đổi dữ liệu JSON & truyền bất đồng bộ)           |
+-----------------------------------------------------------------+
                                |
                                v
+-----------------------------------------------------------------+
|                    NATIVE MODULE / NATIVE UI                    |
|      (Android: ViewGroup, TextView | iOS: UIView, UILabel)      |
+-----------------------------------------------------------------+
                                |
                                v
+-----------------------------------------------------------------+
|                     ỨNG DỤNG NATIVE XỬ LÝ                       |
|         (Vẽ UI thực tế, nhận tương tác và phản hồi lại JS)      |
+-----------------------------------------------------------------+
```

#### 2. Giải thích cơ chế xây dựng giao diện gần giống (chính là) Native của React Native
React Native có thể dùng JavaScript để xây dựng giao diện đạt chất lượng và hiệu năng tương đương ứng dụng Native thực thụ là vì:
React Native **không hề render giao diện thông qua một trang web giả lập (WebView)** giống như các công cụ Hybrid truyền thống (Ionic, Cordova). 

Thay vào đó, khi chúng ta viết mã giao diện bằng các thành phần của React Native (như `<View>`, `<Text>`, `<Image>`, `<ScrollView>`), React Native sẽ thông qua cơ chế **Bridge** để ánh xạ (map) trực tiếp các thẻ này thành các **thành phần UI Native thực sự của hệ điều hành**:
* Thẻ `<View>` sẽ được render thành `android.view.ViewGroup` trên Android và `UIView` trên iOS.
* Thẻ `<Text>` sẽ được render thành `android.widget.TextView` trên Android và `UILabel` trên iOS.

Do các thành phần hiển thị trên màn hình hoàn toàn là các View Native thật do chính Android và iOS vẽ ra, ứng dụng React Native giữ nguyên được trải nghiệm người dùng, đồ họa sắc nét, thao tác vuốt chạm mượt mà cũng như hiệu năng thực thi gần như không có sự khác biệt so với ứng dụng viết bằng Java/Kotlin hay Swift.

---

### Bài tập 2 – Mức dễ đến trung bình

#### 1. Danh sách các công cụ cài đặt môi trường React Native trên Windows và vai trò của từng công cụ

| STT | Công cụ | Vai trò trong quá trình phát triển |
| :---: | :--- | :--- |
| **1** | **Chocolatey** | Trình quản lý gói (Package Manager) trên Windows, giúp tự động hóa việc tải và cài đặt các công cụ lập trình (Node, JDK, Python...) nhanh chóng qua dòng lệnh. |
| **2** | **Node.js** | Môi trường thực thi JavaScript server-side, đi kèm `npm` giúp quản lý thư viện và chạy **Metro Bundler** (bộ đóng gói mã nguồn JS của React Native). |
| **3** | **Java JDK (JDK 17)** | Bộ công cụ phát triển Java, bắt buộc phải có để biên dịch mã nguồn Android và chạy trình đóng gói Gradle của Android. |
| **4** | **Python** | Công cụ hỗ trợ môi trường, được các bộ build native (như `node-gyp`) dùng làm script phụ trợ trong quá trình biên dịch module C/C++. |
| **5** | **Android Studio** | Môi trường phát triển tích hợp (IDE) chính thức cho Android, cung cấp trình quản lý Android SDK, công cụ biên dịch Gradle và quản lý thiết bị ảo (Emulator). |
| **6** | **Android SDK** | Tập hợp các thư viện API, công cụ build (build-tools), công cụ kết nối (`adb`) giúp biên dịch mã nguồn thành file đóng gói ứng dụng `.apk`/`.aab`. |
| **7** | **Visual Studio Code** | Trình soạn thảo mã nguồn (Code Editor) phổ biến, nhẹ và mượt mà, giúp lập trình viên viết mã JavaScript/TypeScript và debug ứng dụng. |

#### 2. Giải thích lý do Windows không thể build trực tiếp ứng dụng iOS
Hệ điều hành Windows không thể build trực tiếp ứng dụng iOS vì:
* Quá trình biên dịch (compile) mã nguồn ứng dụng iOS đòi hỏi trình biên dịch **Xcode Command Line Tools** (`swiftc`, `clang`) cùng các bộ thư viện iOS SDK độc quyền.
* Apple áp đặt chính sách bảo mật và bản quyền chặt chẽ: **Xcode chỉ được phép chạy trên hệ điều hành macOS**.
* Việc ký số ứng dụng (Code Signing), tạo chứng chỉ nhà phát triển (Developer Certificates) và file cấu hình thiết bị (Provisioning Profiles) đều tích hợp sâu vào hệ thống mã hóa của macOS. Vì vậy, máy tính Windows thiếu môi trường hệ điều hành và bộ công cụ Xcode nên không thể tạo ra file cài đặt `.ipa` của iOS.

---

### Bài tập 3 – Mức trung bình

#### 1. Kế hoạch cài đặt môi trường React Native trên macOS

##### Bước 1: Cài đặt Homebrew (Brew)
Mở Terminal và chạy lệnh cài đặt Homebrew (Package Manager cho macOS):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

##### Bước 2: Cài đặt Node.js và Watchman bằng Brew
```bash
brew install node
brew install watchman
```

##### Bước 3: Cài đặt Xcode và Command Line Tools
1. Tải và cài đặt **Xcode** từ App Store.
2. Mở Xcode -> Chọn **Settings/Preferences** -> **Locations** -> Chọn phiên bản tại mục **Command Line Tools**.
3. Cài đặt thiết bị ảo iOS Simulator trong Xcode.

##### Bước 4: Cài đặt CocoaPods (Trình quản lý phụ thuộc Native cho iOS)
```bash
sudo gem install cocoapods
# Hoặc cài qua brew:
brew install cocoapods
```

##### Bước 5: Cài đặt React Native CLI & Khởi tạo dự án
```bash
npx react-native init MyAwesomeProject
cd MyAwesomeProject
npx react-native run-ios
```

---

#### 2. Các công cụ cần bổ sung nếu muốn chạy ứng dụng Android trên macOS
Nếu muốn phát triển và chạy thêm ứng dụng Android trên máy Mac, cần bổ sung:
1. **Java Development Kit (JDK 17):** Cài đặt qua brew: `brew install --cask zulu@17`.
2. **Android Studio cho Mac:** Tải bản dành cho chip Intel hoặc Apple Silicon (M1/M2/M3/M4).
3. **Android SDK & Android Virtual Device (AVD):** Cài đặt SDK Platform (ví dụ Android 13/14) và tạo máy ảo Android Emulator trong Android Studio.
4. **Cấu hình biến môi trường (Environment Variables):** Thêm cấu hình `ANDROID_HOME` vào file `~/.zshrc` hoặc `~/.bash_profile`.

---

#### 3. Vai trò của từng công cụ trên macOS

* **Homebrew (Brew):** Quản lý, cài đặt và cập nhật tự động các công cụ dòng lệnh trên macOS dễ dàng.
* **Watchman:** Trình giám sát sự thay đổi file do Facebook phát triển. Giúp Metro Bundler nhận diện tức thì file mã nguồn vừa sửa để thực hiện **Hot Reloading / Fast Refresh** cực nhanh.
* **Xcode:** Bộ IDE duy nhất hỗ trợ biên dịch mã nguồn Swift/Objective-C, cung cấp trình giả lập iOS Simulator và quản lý chứng chỉ ký số của Apple.
* **CocoaPods:** Quản lý các thư viện Native của hệ sinh thái iOS (tương tự `npm` cho JavaScript hay `Gradle` cho Android).
* **Android Studio & Android SDK:** Cung cấp bộ biên dịch Gradle, Android SDK Platform, công cụ giao tiếp `adb` và máy ảo Android Emulator trên macOS.
