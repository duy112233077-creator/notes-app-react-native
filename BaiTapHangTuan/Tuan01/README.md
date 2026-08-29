Sinh Viên : BÙI QUANG DUY
A. CÂU HỎI ÔN TẬP LÝ THUYẾT
Câu 1: Khái niệm & Lợi ích của Cơ sở mã duy nhất (Codebase)
• Khái niệm phát triển ứng dụng mobile đa nền tảng (Cross-platform): Là phương pháp tạo ra các ứng dụng di động có khả năng chạy tương thích trên nhiều hệ điều hành khác nhau (như Android và iOS) bằng cách sử dụng một cơ sở mã (codebase) duy nhất. Trái ngược với phát triển Native (phải viết mã riêng biệt bằng Java/Kotlin cho Android và Swift/Objective-C cho iOS), phương pháp đa nền tảng giúp lập trình viên chỉ cần quản lý một dự án đơn lẻ.
• Vì sao một codebase duy nhất giúp rút ngắn thời gian và giảm chi phí?
•	Rút ngắn thời gian phát triển: Thay vì xây dựng 2 dự án song song với 2 nhóm lập trình viên độc lập, nhà phát triển chỉ cần làm việc trên một codebase duy nhất. Khả năng tái sử dụng lớn hơn 80%–90% lượng code giúp quy trình thiết kế, viết logic kinh doanh và kiểm thử diễn ra nhanh chóng hơn.
•	Tiết kiệm chi phí nhân lực và bảo trì: Doanh nghiệp không phải duy trì hai đội ngũ kĩ sư riêng biệt (Android team và iOS team). Nhờ đó, chi phí tổng thể có thể giảm khoảng 30%–40% so với phát triển Native.
•	Đồng bộ tính năng & Bảo trì dễ dàng: Khi cần nâng cấp, sửa lỗi (bug fixes) hoặc thêm tính năng mới, nhà phát triển chỉ cần cập nhật mã nguồn ở một nơi duy nhất thay vì triển khai hai lần độc lập trên hai nền tảng.
Câu 2: Sự cần thiết & Chiến lược lựa chọn Đa nền tảng
• Sự cần thiết trong bối cảnh đa thiết bị: Thị trường di động bị chia rẽ bởi hai hệ điều hành chính là Android và iOS. Việc chỉ tiếp cận một trong hai hệ điều hành sẽ làm bỏ lỡ lượng lớn khách hàng tiềm năng. Chiến lược đa nền tảng giúp doanh nghiệp tiếp cận tối đa đối tượng người dùng ngay từ giai đoạn đầu phát hành sản phẩm mà không gặp phải rào cản về chi phí phát triển tăng gấp đôi.
• Khi nào doanh nghiệp nên ưu tiên chọn giải pháp Đa nền tảng (React Native)?
•	Khi cần xây dựng sản phẩm khả thi tối thiểu (MVP - Minimum Viable Product) để thử nghiệm thị trường trong thời gian ngắn nhất.
•	Khi ngân sách đầu tư ban đầu có hạn.
•	Các ứng dụng thiên về hiển thị thông tin, tin tức, thương mại điện tử, ứng dụng quản lý, mạng xã hội không đòi hỏi đồ họa 3D phức tạp hay xử lý tính toán phần cứng quá nặng.
•	Khi nhóm phát triển đã có sẵn nền tảng kiến thức vững chắc về JavaScript / React.
Câu 3: Tổng quan React Native & Cơ chế hoạt động
• Khái niệm React Native: React Native là một framework mã nguồn mở do Meta (Facebook) phát triển, cho phép xây dựng ứng dụng di động đa nền tảng (Android và iOS) bằng ngôn ngữ JavaScript và thư viện React. Khác với các framework web-view (hybrid), React Native render giao diện bằng các thành phần gốc (Native Components) của thiết bị.
• Cách thức hoạt động và vai trò của các thành phần:
1. JavaScript Engine (Hermes / JSC): Đảm nhận nhiệm vụ thực thi mã JavaScript do lập trình viên viết, xử lý logic kinh doanh, tính toán state và quyết định giao diện cần thay đổi.
2. Bridge (Cầu nối): Đóng vai trò là cầu nối truyền dữ liệu (dạng chuỗi JSON bất đồng bộ) giữa luồng JavaScript (JS Thread) và luồng Native (Native Thread). Bridge truyền các thông điệp từ JS để yêu cầu phía Native vẽ giao diện hoặc gọi tính năng thiết bị.
3. Native Views: Là các thành phần UI thực sự của hệ điều hành (như android.widget.TextView trên Android hay UILabel trên iOS). Nhờ render ra Native Views chứ không phải HTML/WebView, ứng dụng React Native đem lại trải nghiệm mượt mà và giao diện chuẩn native.
Câu 4: Bảng so sánh Ứng dụng Native và React Native
Tiêu chí	Ứng dụng Native	Ứng dụng React Native
Ngôn ngữ lập trình	Java / Kotlin (Android)
Swift / Objective-C (iOS)	JavaScript / TypeScript
Cơ sở mã (Codebase)	Riêng biệt cho từng nền tảng
(2 codebase)	Dùng chung 1 codebase duy nhất cho cả Android & iOS
Hiệu suất (Performance)	Tối đa (Rất cao do giao tiếp trực tiếp với hệ điều hành)	Cao (Tốt cho ứng dụng thông thường, có thể ảnh hưởng nếu gửi dữ liệu qua Bridge quá nhiều)
Truy cập API thiết bị	Truy cập trực tiếp, nhanh chóng và tức thì	Truy cập qua thư viện sẵn có hoặc viết thêm Native Module
Tốc độ phát triển	Chậm hơn (Cần 2 đội ngũ làm việc song song)	Nhanh hơn nhiều (Chỉ cần 1 nhóm phát triển)
Công cụ Debug	Android Studio Debugger, Xcode Debugger	Chrome DevTools, React Native Debugger, Flipper
Loại app phù hợp	Game 3D đồ họa nặng, xử lý video/hình ảnh thời gian thực, VR/AR	Thương mại điện tử, mạng xã hội, tin tức, app doanh nghiệp, MVP

Câu 5: Yêu cầu kiến thức React căn bản khi học React Native
• Vì sao cần nắm vững JSX, Component, Props và State? React Native kế thừa hoàn toàn tư duy thiết kế cốt lõi của React. Để làm việc với React Native, lập trình viên bắt buộc phải nắm chắc các khái niệm này vì cấu trúc ứng dụng di động cũng được lắp ghép hoàn toàn từ các thành phần này.
• Liên hệ thực tế trong một ứng dụng Mobile đơn giản (Ví dụ: Màn hình danh sách sản phẩm):
•	JSX: Dùng để khai báo cấu trúc giao diện bằng cú pháp giống HTML nhưng render ra Native View (ví dụ: dùng <View> thay cho <div>, <Text> thay cho <p>).
•	Component: Giúp chia nhỏ giao diện thành các khối độc lập có thể tái sử dụng, ví dụ: tạo một ProductCard component để hiển thị từng thẻ sản phẩm.
•	Props: Dùng để truyền dữ liệu từ Component cha xuống Component con (ví dụ: truyền tên title='Áo sơ mi' và giá price='250.000đ' vào ProductCard).
•	State: Dùng để quản lý dữ liệu nội bộ có tính chất biến đổi theo thời gian (ví dụ: biến state cartCount quản lý số lượng sản phẩm trong giỏ hàng, khi người dùng bấm nút 'Chọn mua', state thay đổi và giao diện tự động cập nhật lại).
B. BÀI TẬP LUYỆN TẬP THỰC HÀNH
Bài tập 1: Đánh giá độ phù hợp của một ứng dụng thực tế
• Ứng dụng chọn phân tích: Shopee (Ứng dụng Thương mại điện tử).
• Các chức năng chính:
•	Hiển thị danh sách sản phẩm, danh mục hàng hóa, banner quảng cáo.
•	Tìm kiếm, lọc và xem chi tiết sản phẩm.
•	Quản lý giỏ hàng, thông tin thanh toán và lịch sử đơn hàng.
•	Nhận thông báo đẩy (Push Notifications) về khuyến mãi.
• Nhận xét & Giải thích độ phù hợp: Shopee hoàn toàn phù hợp để xây dựng bằng React Native. Các lý do chính bao gồm:
•	Phát triển nhanh & Dùng chung mã nguồn: Shopee có lượng tính năng logic giống hệt nhau trên cả 2 hệ điều hành. Việc dùng React Native giúp tái sử dụng >80% logic xử lý đơn hàng, gọi API backend.
•	Giao diện nhất quán: Đảm bảo trải nghiệm mua sắm, nhận diện thương hiệu chuẩn xác trên cả iPhone và các máy Android.
•	Cập nhật nhanh: Luồng hiển thị thông tin sản phẩm thiên về các thao tác CRUD cơ bản, không đòi hỏi tính toán đồ họa 3D phức tạp, do đó hiệu năng React Native đáp ứng mượt mà trải nghiệm người dùng.
Bài tập 2: Đoạn phân tích so sánh Native vs React Native
Trong chiến lược phát triển ứng dụng di động, việc lựa chọn giữa Native và React Native phụ thuộc lớn vào mục tiêu bài toán kinh doanh.

Phát triển Native mang lại lợi thế tuyệt đối về mặt hiệu năng và khả năng tối ưu phần cứng. Do tương tác trực tiếp với hệ điều hành, Native là lựa chọn duy nhất cho các ứng dụng yêu cầu xử lý đồ họa phức tạp (Game 3D), AI/AR trực tiếp trên thiết bị. Tuy nhiên, hạn chế lớn nhất của Native là chi phí cao và thời gian phát triển kéo dài do phải duy trì hai cơ sở mã (codebase) độc lập cho Android và iOS.

Ngược lại, React Native thể hiện sức mạnh vượt trội khi doanh nghiệp cần ra mắt sản phẩm nhanh (Time-to-market) và tiết kiệm chi phí. Nhờ cơ chế tái sử dụng chung mã nguồn đến hơn 90%, doanh nghiệp chỉ cần một đội ngũ lập trình viên duy nhất để phát hành ứng dụng song song trên cả hai nền tảng. Công tác bảo trì và nâng cấp cũng đơn giản hơn đáng kể khi các thay đổi logic chỉ cần cập nhật ở một nơi. Dù vậy, hạn chế của React Native nằm ở luồng giao tiếp qua Bridge có thể tạo ra mút thắt cổ chai nếu ứng dụng phải xử lý luồng dữ liệu khổng lồ liên tục thời gian thực.
Bài tập 3: Mô tả quy trình hoạt động của React Native & Giải thích
1. Sơ đồ quy trình hoạt động:
+-------------------------------------------------------------------+
|                        JAVASCRIPT THREAD                          |
|  [Mã JavaScript / React] ---> [JS Engine (Hermes / JSC)]         |
+---------------------------------+---------------------------------+
                                  |
                   (Dữ liệu JSON bất đồng bộ)
                                  v
+-------------------------------------------------------------------+
|                           THE BRIDGE                              |
+---------------------------------+---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                          NATIVE THREAD                            |
|  [Native Modules / Yoga Layout] ---> [Native Views (UI Cục bộ)]   |
+---------------------------------+---------------------------------+
                                  |
                                  v
                    [Màn hình thiết bị Di động]
 
2. Thuyết minh quy trình & Trải nghiệm giao diện gốc:
•	Mã JavaScript: Lập trình viên viết mã bằng React/JSX để định nghĩa giao diện và logic.
•	JS Engine: Mã JavaScript được thực thi bởi JavaScript Engine (như Hermes).
•	The Bridge: Engine tạo ra cấu trúc UI mô phỏng và gửi các lệnh điều khiển (dưới dạng chuỗi JSON) qua Bridge.
•	Native Modules / Views: Phía Native tiếp nhận lệnh, sử dụng công cụ Yoga để tính toán bố cục Flexbox và gọi các Native Views tương ứng của iOS/Android.
•	Giải thích trải nghiệm gốc: React Native mang lại trải nghiệm tiệm cận Native vì nó không hiển thị ứng dụng qua trình duyệt hay WebView. Các nút bấm, văn bản, hình ảnh hiển thị trên màn hình chính là các thành phần giao diện gốc của iOS và Android. Framework này phân tách hoàn toàn giữa phần logic xử lý (JS) và phần hiển thị giao diện gốc, giúp vừa dùng chung mã vừa giữ được hiệu năng tối ưu.
Bài tập 4: Đề xuất giải pháp cho Cửa hàng Thời trang
• Đề xuất giải pháp: Lựa chọn giải pháp phát triển bằng React Native.
•	Lý do lựa chọn: Nhóm phát triển đã có sẵn kinh nghiệm về JavaScript/React, giúp bỏ qua thời gian đào tạo ngôn ngữ mới (Java/Swift). Chi phí giới hạn và thời gian triển khai ngắn hoàn toàn phù hợp với mô hình 1 codebase duy nhất. Ngoài ra, ứng dụng thời trang có luồng chức năng tiêu chuẩn (xem hàng, giỏ hàng, đặt hàng).
•	Ưu điểm đạt được: Phát hành ứng dụng đồng thời trên cả App Store và Google Play chỉ trong 1 chu kỳ phát triển. Tiết kiệm ~30-40% ngân sách so với thuê 2 nhóm làm Native riêng biệt. Tái sử dụng được các tư duy component và thư viện React sẵn có.
•	Rủi ro & Khắc phục: Rủi ro chính là việc cấu hình thông báo đẩy (Push Notification) hoặc kết nối cổng thanh toán trên từng thiết bị Native. Khắc phục bằng cách áp dụng các thư viện cộng đồng uy tín (@react-native-firebase/messaging) hoặc chọn hệ sinh thái Expo để đơn giản hóa quá trình tích hợp.
Bài tập 5: Kế hoạch chuẩn bị môi trường & Lựa chọn CLI
1. Vai trò các công cụ trong môi trường phát triển:
•	Node.js: Môi trường thực thi JavaScript phía server, dùng để chạy công cụ đóng gói mã nguồn (Metro Bundler) của React Native.
•	npm / Yarn: Trình quản lý gói (Package Manager), dùng để cài đặt các thư viện phụ thuộc cho dự án.
•	Java JDK (JDK 11+): Bộ công cụ phát triển Java, bắt buộc phải có để biên dịch ứng dụng cho nền tảng Android.
•	Android Studio & Android SDK: Cung cấp môi trường build ứng dụng Android, bao gồm SDK Platform, Build-Tools và trình quản lý thiết bị.
•	AVD Emulator: Thiết bị Android ảo chạy trên máy tính giúp lập trình viên kiểm thử ứng dụng mà không cần điện thoại thật.
•	VS Code: Trình soạn thảo mã nguồn nhẹ, phổ biến, hỗ trợ nhiều extension bổ trợ cho React Native.
•	React Native CLI / Expo CLI: Các công cụ dòng lệnh dùng để khởi tạo, build và chạy dự án.
2. Đề xuất trường hợp chọn React Native CLI vs Expo CLI:
•	Chọ Expo CLI khi: Người mới bắt đầu học React Native, muốn cài đặt nhanh chóng, không muốn can thiệp sâu vào cấu hình Android Studio / Xcode ban đầu; Cần làm ứng dụng nhỏ, làm demo/MVP trong thời gian cực ngắn; Không có máy Mac nhưng vẫn muốn kiểm thử trên iPhone (qua ứng dụng Expo Go).
•	Chọn React Native CLI khi: Xây dựng dự án thực tế quy mô lớn, lâu dài cho doanh nghiệp; Cần tùy chỉnh sâu vào mã nguồn Native (android/ hoặc ios/) hoặc tích hợp các SDK/Module Native riêng biệt; Cần tối ưu hóa dung lượng file cài đặt (APK/IPA) và hiệu năng ứng dụng ở mức tối đa.

