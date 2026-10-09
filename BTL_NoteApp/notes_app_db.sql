-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 09, 2026
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `notes_app_db`
--
CREATE DATABASE IF NOT EXISTS `notes_app_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `notes_app_db`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng `users` (Quản lý tài khoản người dùng)
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(100) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(191) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `created_at` varchar(50) DEFAULT NULL,
  `avatar` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng `notes` (Quản lý ghi chú & bản ghi thời gian)
--

CREATE TABLE IF NOT EXISTS `notes` (
  `id` varchar(100) NOT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `category` varchar(100) DEFAULT 'Khác',
  `color_id` varchar(30) DEFAULT 'yellow',
  `is_pinned` tinyint(1) DEFAULT 0,
  `is_locked` tinyint(1) DEFAULT 0,
  `attachments` longtext DEFAULT NULL,
  `reminder_at` varchar(50) DEFAULT NULL,
  `share_code` varchar(100) DEFAULT NULL,
  `collaborators` longtext DEFAULT NULL,
  `last_modified_by` longtext DEFAULT NULL,
  `edit_history` longtext DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` varchar(50) DEFAULT NULL,
  `created_at` varchar(50) DEFAULT NULL,
  `updated_at` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_share_code` (`share_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dữ liệu mẫu 50 ghi chú ban đầu cho bảng `notes`
--

INSERT INTO `notes` (`id`, `user_id`, `title`, `content`, `category`, `color_id`, `is_pinned`, `is_locked`, `attachments`, `reminder_at`, `share_code`, `collaborators`, `created_at`, `updated_at`) VALUES
('note-1', NULL, '🌟 Chào mừng bạn đến với Note App!', 'Dữ liệu đã kết nối trực tiếp với MySQL trên XAMPP!\n• Bạn tạo ghi chú mới sẽ tự động lưu vào MySQL.\n• Bạn sửa nội dung hoặc xóa ghi chú thì MySQL cũng cập nhật tương ứng.\n• Có thể mở phpMyAdmin (http://localhost/phpmyadmin) để xem bảng notes.', 'Ý tưởng', 'yellow', 1, 0, NULL, NULL, 'WELCOME123', NULL, '2026-10-09T10:00:00.000Z', '2026-10-09T10:00:00.000Z'),
('note-2', NULL, '📚 Nhiệm vụ học tập tuần này', '1. Hoàn thiện bài tập lớn ứng dụng React Native.\n2. Kiểm tra kết nối cơ sở dữ liệu MySQL trên XAMPP.\n3. Chuẩn bị slide báo cáo tiến độ.', 'Học tập', 'blue', 1, 0, NULL, NULL, NULL, NULL, '2026-10-09T09:30:00.000Z', '2026-10-09T09:30:00.000Z'),
('note-3', NULL, '🔒 Thông tin mật cá nhân', 'Đây là ghi chú được bảo vệ bằng lớp khóa thứ hai.\nChỉ những người biết mã PIN (mặc định: 1234) mới có thể mở xem và chỉnh sửa nội dung này!', 'Cá nhân', 'purple', 0, 1, NULL, NULL, NULL, NULL, '2026-10-09T08:15:00.000Z', '2026-10-09T08:15:00.000Z'),
('note-4', NULL, '🛒 Mua sắm cuối tuần', '• Sách mới về lập trình TypeScript & Mobile App\n• Cà phê hạt rang mộc\n• Bàn phím cơ & giá đỡ máy tính xách tay', 'Cá nhân', 'rose', 0, 0, NULL, NULL, NULL, NULL, '2026-10-09T07:00:00.000Z', '2026-10-09T07:00:00.000Z'),
('note-5', NULL, '💻 Lập trình React Native với Expo Router', '- Đọc tài liệu Expo v57.0.0 về file-based routing.\n- Tìm hiểu cách quản lý state toàn cục qua React Context hoặc Hook.\n- Tối ưu hiệu năng render danh sách bằng FlashList / FlatList.\n- Xử lý Safe Area Insets chuẩn trên cả iOS và Android.', 'Học tập', 'blue', 1, 0, NULL, NULL, NULL, NULL, '2026-10-08T16:00:00.000Z', '2026-10-08T16:00:00.000Z'),
('note-6', NULL, '🚀 Ý tưởng ứng dụng AI Assistant cho sinh viên', 'Tính năng chính:\n1. Tự động tóm tắt bài giảng bằng giọng nói.\n2. Lập kế hoạch học tập theo phương pháp Pomodoro.\n3. Gợi ý tài liệu và đề thi ôn tập theo môn học.\n4. Tích hợp chatbot hỏi đáp bài tập 24/7.', 'Ý tưởng', 'yellow', 0, 0, NULL, NULL, NULL, NULL, '2026-10-08T14:20:00.000Z', '2026-10-08T14:20:00.000Z'),
('note-7', NULL, '🎯 Mục tiêu phát triển bản thân năm 2026', '• Đạt chứng chỉ IELTS 7.5 Academic.\n• Hoàn thành 3 dự án Fullstack với React Native & Express.\n• Chạy bộ tối thiểu 5km mỗi tuần.\n• Đọc ít nhất 12 cuốn sách về công nghệ và tư duy phát triển.', 'Cá nhân', 'green', 1, 0, NULL, NULL, NULL, NULL, '2026-10-08T11:00:00.000Z', '2026-10-08T11:00:00.000Z'),
('note-8', NULL, '📋 Checklist chuẩn bị bảo vệ Bài tập lớn', '[x] Kiểm tra lại source code frontend & backend\n[x] Chuẩn bị cơ sở dữ liệu mẫu MySQL với 50 ghi chú\n[ ] Thiết kế slide thuyết trình Canva/PowerPoint\n[ ] Quay video demo sản phẩm phòng trường hợp lỗi mạng\n[ ] Tổng duyệt bài nói trước khi bảo vệ.', 'Công việc', 'yellow', 0, 0, NULL, NULL, NULL, NULL, '2026-10-08T09:45:00.000Z', '2026-10-08T09:45:00.000Z'),
('note-9', NULL, '💡 Thiết kế Kiến trúc Backend Express & MySQL', '- Dùng Connection Pool với mysql2/promise để quản lý kết nối hiệu quả.\n- Áp dụng JWT (JSON Web Token) xác thực người dùng.\n- Mã hóa mật khẩu bằng bcryptjs trước khi lưu vào database.\n- Tạo middleware xử lý lỗi tập trung và logging activity_logs.', 'Dự án', 'green', 0, 0, NULL, NULL, NULL, NULL, '2026-10-07T17:30:00.000Z', '2026-10-07T17:30:00.000Z'),
('note-10', NULL, '📖 Từ vựng tiếng Anh chuyên ngành CNTT tuần 1', '1. Scalability: Khả năng mở rộng hệ thống\n2. Asynchronous: Bất đồng bộ\n3. Middleware: Phần mềm trung gian\n4. Authentication vs Authorization: Xác thực vs Phân quyền\n5. Deprecated: Không còn được hỗ trợ.', 'Học tập', 'blue', 0, 0, NULL, NULL, NULL, NULL, '2026-10-07T15:10:00.000Z', '2026-10-07T15:10:00.000Z'),
('note-11', NULL, '🏋️ Kế hoạch tập luyện Gym & Sức khỏe', '- Thứ 2: Ngực + Tay sau (Bench Press, Incline Dumbbell Press)\n- Thứ 4: Lưng + Tay trước (Pull-up, Lat Pulldown, Barbell Curl)\n- Thứ 6: Chân + Vai (Squat, Leg Press, Shoulder Press)\n- Uống đủ 2.5 lít nước mỗi ngày và ngủ đủ 8 tiếng.', 'Sức khỏe', 'rose', 0, 0, NULL, NULL, NULL, NULL, '2026-10-07T10:00:00.000Z', '2026-10-07T10:00:00.000Z'),
('note-12', NULL, '✈️ Lịch trình du lịch Đà Nẵng - Hội An 4 ngày 3 đêm', 'Ngày 1: Bay tới Đà Nẵng, check-in khách sạn Mỹ Khê, ăn hải sản.\nNgày 2: Tham quan Bà Nà Hills, Cầu Vàng, tối dạo Chợ đêm Sơn Trà.\nNgày 3: Khám phá Phố cổ Hội An, thả đèn hoa đăng sông Hoài.\nNgày 4: Mua quà lưu niệm (chả bò, hải sản khô) và trở về.', 'Du lịch', 'purple', 0, 0, NULL, NULL, NULL, NULL, '2026-10-06T18:00:00.000Z', '2026-10-06T18:00:00.000Z'),
('note-13', NULL, '💰 Quản lý tài chính cá nhân tháng này', 'Tổng thu nhập: 15.000.000 VNĐ\n- Tiền nhà & điện nước: 3.500.000 VNĐ\n- Ăn uống & sinh hoạt: 4.500.000 VNĐ\n- Quỹ tiết kiệm & đầu tư: 4.000.000 VNĐ\n- Giải trí & học tập: 3.000.000 VNĐ.', 'Tài chính', 'green', 0, 0, NULL, NULL, NULL, NULL, '2026-10-06T14:30:00.000Z', '2026-10-06T14:30:00.000Z'),
('note-14', NULL, '📝 Biên bản họp Team dự án NoteApp (09/10/2026)', 'Thành phần tham dự: Duy, Minh, Anh.\nNội dung chính:\n- Chốt giao diện Dark Mode & Light Mode đồng bộ.\n- Bổ sung tính năng thông báo nhắc giờ (Reminder).\n- Khắc phục lỗi cuộn mượt danh sách ghi chú trên máy Android.', 'Công việc', 'yellow', 0, 0, NULL, NULL, NULL, NULL, '2026-10-06T11:15:00.000Z', '2026-10-06T11:15:00.000Z'),
('note-15', NULL, '🛠️ Các lệnh Git thường dùng trong dự án', '- git status: Kiểm tra trạng thái các file thay đổi\n- git add .: Đưa toàn bộ thay đổi vào Staging area\n- git commit -m "msg": Lưu phiên bản mới\n- git push origin main: Đẩy code lên GitHub\n- git pull --rebase: Cập nhật code mới nhất về máy.', 'Học tập', 'blue', 0, 0, NULL, NULL, NULL, NULL, '2026-10-05T16:40:00.000Z', '2026-10-05T16:40:00.000Z'),
('note-16', NULL, '🍕 Công thức làm bánh Pizza Hải sản tại nhà', 'Nguyên liệu:\n- Đế bánh pizza làm sẵn\n- Tôm tươi, mực, thanh cua cắt nhỏ\n- Phô mai Mozzarella bào sợi\n- Sốt cà chua & ớt dông\nCách làm: Nướng ở 200°C trong 15 phút đến khi phô mai chảy vàng mượt.', 'Cá nhân', 'rose', 0, 0, NULL, NULL, NULL, NULL, '2026-10-05T12:00:00.000Z', '2026-10-05T12:00:00.000Z'),
('note-17', NULL, '📱 Nghiên cứu React Native Performance Optimization', '- Sử dụng React.memo cho các Component con ít thay đổi.\n- Dùng useCallback & useMemo tránh tạo lại hàm/biến không cần thiết.\n- Tối ưu hình ảnh bằng format WebP / expo-image.\n- Giảm thiểu số lần re-render không đáng có trong danh sách.', 'Học tập', 'green', 0, 0, NULL, NULL, NULL, NULL, '2026-10-05T09:20:00.000Z', '2026-10-05T09:20:00.000Z'),
('note-18', NULL, '☕ Danh sách quán Cà phê học bài yên tĩnh tại Hà Nội', '1. Tranquil Books & Coffee - Nguyễn Quang Bích\n2. Aha Coffee - Phố cổ (góc nhìn đẹp)\n3. The Kafe / Highland Coffee đường Thanh Niên\n4. Mono Coffee Lab - Hồ Giám (cà phê ngon, không gian ấm cúng).', 'Cá nhân', 'yellow', 0, 0, NULL, NULL, NULL, NULL, '2026-10-04T19:00:00.000Z', '2026-10-04T19:00:00.000Z'),
('note-19', NULL, '🔒 Mã PIN & Tài khoản dự phòng bảo mật', 'Ghi chú khóa bảo mật:\n- Tài khoản iCloud phục hồi: duy.backup2026@gmail.com\n- Mã kích hoạt 2FA dự phòng: 8912-4412-9012\n- Mã PIN thiết bị: 1234.', 'Cá nhân', 'purple', 0, 1, NULL, NULL, NULL, NULL, '2026-10-04T15:30:00.000Z', '2026-10-04T15:30:00.000Z'),
('note-20', NULL, '🎨 Quy chuẩn Palette màu thiết kế Note App', '- Yellow: #FEF9C3 (Ghi chú ý tưởng & nhắc nhở)\n- Blue: #E0F2FE (Ghi chú học tập & công nghệ)\n- Green: #DCFCE7 (Tài chính & công việc hoàn thành)\n- Rose: #FFE4E6 (Cá nhân & mua sắm)\n- Purple: #F3E8FF (Ghi chú bảo mật & quan trọng).', 'Công việc', 'purple', 0, 0, NULL, NULL, NULL, NULL, '2026-10-04T11:00:00.000Z', '2026-10-04T11:00:00.000Z'),
('note-21', NULL, '🎬 Danh sách Phim kinh điển cần xem cuối tuần', '1. Interstellar (2014) - Khoa học viễn tưởng & Vũ trụ\n2. Inception (2010) - Đột nhập giấc mơ\n3. The Shawshank Redemption (1994) - Hy vọng & Tự do\n4. Spirited Away (2001) - Phim hoạt hình Ghibli tuyệt đẹp.', 'Cá nhân', 'rose', 0, 0, NULL, NULL, NULL, NULL, '2026-10-03T20:15:00.000Z', '2026-10-03T20:15:00.000Z'),
('note-22', NULL, '💡 Lập trình NodeJS & Async/Await Best Practices', '- Luôn dùng try/catch xung quanh các thao tác bất đồng bộ.\n- Tránh callback hell bằng cách promisify hoặc async/await.\n- Đảm bảo đóng kết nối MySQL Pool khi ngắt server.\n- Sử dụng Express rate-limit chống tấn công DDoS.', 'Học tập', 'blue', 0, 0, NULL, NULL, NULL, NULL, '2026-10-03T16:00:00.000Z', '2026-10-03T16:00:00.000Z'),
('note-23', NULL, '🛒 Danh sách nguyên liệu nấu lẩu Thái cuối tuần', '• 500g Tôm tươi, 300g mực ống\n• Nấm kim châm, nấm đùi gà\n• Rau muống, cải cúc, hoa chuối\n• Gói cốt lẩu Thái Tomyum + sả, ớt, lá chanh\n• Bún tươi & mì tôm.', 'Cá nhân', 'rose', 0, 0, NULL, NULL, NULL, NULL, '2026-10-03T10:45:00.000Z', '2026-10-03T10:45:00.000Z'),
('note-24', NULL, '📅 Lịch khám sức khỏe định kỳ năm 2026', '- Khám tổng quát & xét nghiệm máu: Tháng 5/2026\n- Khám nha khoa & lấy cao răng: Tháng 6/2026\n- Đo thị lực & thay tròng kính: Tháng 10/2026\n- Địa điểm: Bệnh viện Đại học Y Hà Nội.', 'Sức khỏe', 'green', 0, 0, NULL, NULL, NULL, NULL, '2026-10-02T17:00:00.000Z', '2026-10-02T17:00:00.000Z'),
('note-25', NULL, '📚 Đúc kết sách "Atomic Habits - Thay đổi tí hon"', 'Ghi chú cốt lõi:\n- Đừng tập trung quá nhiều vào mục tiêu, hãy tập trung vào hệ thống.\n- Tăng 1% mỗi ngày -> sau 1 năm bạn sẽ tốt hơn 37 lần.\n- Tạo môi trường thuận lợi để thói quen tốt dễ thực hiện hơn.', 'Cá nhân', 'yellow', 0, 0, NULL, NULL, NULL, NULL, '2026-10-02T13:30:00.000Z', '2026-10-02T13:30:00.000Z'),
('note-26', NULL, '🌐 Cấu hình CORS & Security Header trong Express', '- Cấu hình cors({ origin: "*" }) cho môi trường phát triển.\n- Sử dụng helmet middleware tăng cường bảo mật HTTP headers.\n- Giới hạn kích thước payload json(limit: "10mb") tránh tràn bộ nhớ.', 'Công việc', 'green', 0, 0, NULL, NULL, NULL, NULL, '2026-10-02T09:00:00.000Z', '2026-10-02T09:00:00.000Z'),
('note-27', NULL, '💡 Kế hoạch xây dựng kênh YouTube Lập trình', '- Chủ đề: Hướng dẫn Lập trình Mobile App từ Zero tới Hero.\n- Video 1: Hướng dẫn cài đặt Expo Router v57 & TypeScript.\n- Video 2: Kết nối MySQL XAMPP với NodeJS API đơn giản.\n- Video 3: Tạo giao diện Note App đẹp chuẩn Material / Apple.', 'Ý tưởng', 'yellow', 0, 0, NULL, NULL, NULL, NULL, '2026-10-01T18:20:00.000Z', '2026-10-01T18:20:00.000Z'),
('note-28', NULL, '🚗 Chi phí bảo dưỡng xe máy định kỳ', '- Thay dầu máy (sau mỗi 2.000km): 150.000 VNĐ\n- Thay dầu lốp/dầu lab: 60.000 VNĐ\n- Vệ sinh nồi & lọc gió: 120.000 VNĐ\n- Kiểm tra má phanh & đĩa phanh.', 'Cá nhân', 'rose', 0, 0, NULL, NULL, NULL, NULL, '2026-10-01T14:00:00.000Z', '2026-10-01T14:00:00.000Z'),
('note-29', NULL, '🏡 Danh sách đồ dùng gia đình cần sắm', '1. Đèn bàn chống cận thị học tập\n2. Máy hút bụi cầm tay Xiaomi\n3. Thảm chùi chân hút nước phòng tắm\n4. Hộp đựng gia vị thông minh cho bếp.', 'Cá nhân', 'rose', 0, 0, NULL, NULL, NULL, NULL, '2026-10-01T10:15:00.000Z', '2026-10-01T10:15:00.000Z'),
('note-30', NULL, '🎓 Kinh nghiệm viết Báo cáo Luận văn Tốt nghiệp', '- Cấu trúc gồm 5 chương chuẩn khoa học.\n- Trích dẫn tài liệu tham khảo theo chuẩn APA.\n- Đảm bảo chỉ số trùng lặp (Turnitin) dưới 15%.\n- Kiểm tra lỗi chính tả và định dạng font Times New Roman 13.', 'Học tập', 'blue', 0, 0, NULL, NULL, NULL, NULL, '2026-09-30T16:50:00.000Z', '2026-09-30T16:50:00.000Z'),
('note-31', NULL, '🎵 Playlist nhạc Lofi chilled tập trung học tập', '1. Lofi Hip Hop Radio - Beats to Relax/Study to\n2. Vietnamese Lofi Acoustic Chill Beats\n3. Ghibli Piano Collection - Relaxing Study Music\n4. Jazz Hop Cafe - Rain Day Chill.', 'Cá nhân', 'purple', 0, 0, NULL, NULL, NULL, NULL, '2026-09-30T11:30:00.000Z', '2026-09-30T11:30:00.000Z'),
('note-32', NULL, '💡 Ý tưởng tính năng Sync Offline / Online', '- Lưu trữ ghi chú tại AsyncStorage khi không có mạng.\n- Đưa các thao tác SAVE/DELETE vào hàng chờ Pending Queue.\n- Tự động đồng bộ lên MySQL server khi mạng được khôi phục.', 'Dự án', 'green', 0, 0, NULL, NULL, NULL, NULL, '2026-09-29T15:00:00.000Z', '2026-09-29T15:00:00.000Z'),
('note-33', NULL, '🍵 Thói quen lành mạnh mỗi buổi sáng', '1. Uống 1 ly nước ấm ngay sau khi thức dậy.\n2. Tập giãn cơ / Yoga nhẹ nhàng 10 phút.\n3. Đọc 5 trang sách hoặc tin tức công nghệ mới.\n4. Lên danh sách 3 việc quan trọng nhất cần làm trong ngày.', 'Sức khỏe', 'green', 0, 0, NULL, NULL, NULL, NULL, '2026-09-29T08:30:00.000Z', '2026-09-29T08:30:00.000Z'),
('note-34', NULL, '🧳 Checklist đồ đạc cắm trại Trekking núi', '[x] Lều cắm trại chống nước 2 người\n[x] Túi ngủ & đệm cách nhiệt\n[x] Bếp ga dã ngoại & nồi nấu mini\n[ ] Đèn pin siêu sáng & pin dự phòng\n[ ] Bộ dụng cụ y tế sơ cứu cơ bản.', 'Du lịch', 'purple', 0, 0, NULL, NULL, NULL, NULL, '2026-09-28T17:15:00.000Z', '2026-09-28T17:15:00.000Z'),
('note-35', NULL, '💻 Cấu hình môi trường Android Studio & Emulator', '- Cài đặt Android SDK Build-Tools 34.0.0.\n- Cấu hình biến môi trường ANDROID_HOME trong System Variables.\n- Tạo máy ảo Pixel 8 Pro RAM 4GB, Android 14 (API 34).\n- Đảm bảo bật Hyper-V / HAXM để máy ảo chạy mượt.', 'Học tập', 'blue', 0, 0, NULL, NULL, NULL, NULL, '2026-09-28T11:00:00.000Z', '2026-09-28T11:00:00.000Z'),
('note-36', NULL, '📊 Phân tích ưu nhược điểm MySQL vs MongoDB', '- MySQL: CSDL quan hệ, hỗ trợ ACID, phù hợp dữ liệu cấu trúc rõ ràng.\n- MongoDB: CSDL NoSQL Document, linh hoạt schema, mở rộng dễ dàng.\n- Lựa chọn dự án NoteApp: MySQL đảm bảo tính nhất quán dữ liệu người dùng.', 'Học tập', 'blue', 0, 0, NULL, NULL, NULL, NULL, '2026-09-27T16:30:00.000Z', '2026-09-27T16:30:00.000Z'),
('note-37', NULL, '🔑 Hướng dẫn tạo SSH Key kết nối GitHub', '1. Mở Terminal gõ: ssh-keygen -t ed25519 -C "email@example.com"\n2. Copy nội dung file ~/.ssh/id_ed25519.pub\n3. Vào GitHub -> Settings -> SSH Keys -> Add New SSH Key.\n4. Kiểm tra kết nối: ssh -T git@github.com.', 'Học tập', 'blue', 0, 0, NULL, NULL, NULL, NULL, '2026-09-27T10:00:00.000Z', '2026-09-27T10:00:00.000Z'),
('note-38', NULL, '🎁 Ý tưởng quà sinh nhật cho người thân', '- Mẹ: Khăn lụa tơ tăm + Bộ chăm sóc da tự nhiên\n- Bố: Đồng hồ đeo tay dây da + Bộ trà ô long cao cấp\n- Em gái: Tai nghe không dây Bluetooth + Sách tiểu thuyết.', 'Cá nhân', 'rose', 0, 0, NULL, NULL, NULL, NULL, '2026-09-26T18:00:00.000Z', '2026-09-26T18:00:00.000Z'),
('note-39', NULL, '💡 Ứng dụng quét mã QR chia sẻ ghi chú', '- Sử dụng thư viện react-native-qrcode-svg để tạo mã QR.\n- Mã QR chứa đường dẫn shareCode của ghi chú.\n- Người nhận quét mã sẽ tự động mở và xem nội dung ghi chú được chia sẻ.', 'Ý tưởng', 'yellow', 0, 0, NULL, NULL, NULL, NULL, '2026-09-26T14:10:00.000Z', '2026-09-26T14:10:00.000Z'),
('note-40', NULL, '📌 Danh sách các phím tắt VS Code tăng tốc độ code', '- Ctrl + Shift + P: Mở Command Palette\n- Alt + Shift + F: Format tài liệu theo chuẩn Prettier\n- Ctrl + D: Chọn các từ giống nhau tiếp theo\n- Alt + Up/Down: Di chuyển dòng code lên/xuống.', 'Học tập', 'blue', 0, 0, NULL, NULL, NULL, NULL, '2026-09-26T09:30:00.000Z', '2026-09-26T09:30:00.000Z'),
('note-41', NULL, '🥦 Chế độ ăn Eat Clean giảm cân an toàn', '- Tăng cường rau xanh, bông cải luộc, ức gà, cá hồi.\n- Thay thế cơm trắng bằng gạo lứt hoặc khoai lang luộc.\n- Hạn chế tối đa đường tinh luyện, nước ngọt có ga và đồ chiên dầu.', 'Sức khỏe', 'green', 0, 0, NULL, NULL, NULL, NULL, '2026-09-25T16:00:00.000Z', '2026-09-25T16:00:00.000Z'),
('note-42', NULL, '🔐 Quy trình mã hóa mật khẩu người dùng', '- Sử dụng bcrypt.genSalt(10) tạo chuỗi salt an toàn.\n- Hash mật khẩu người dùng trước khi lưu trữ vào bảng users MySQL.\n- So sánh mật khẩu khi đăng nhập bằng bcrypt.compare().', 'Công việc', 'purple', 0, 0, NULL, NULL, NULL, NULL, '2026-09-25T11:45:00.000Z', '2026-09-25T11:45:00.000Z'),
('note-43', NULL, '📱 Tối ưu hóa UI/UX cho thiết bị màn hình nhỏ', '- Sử dụng Flexbox responsive và useWindowDimensions hook.\n- Tăng diện tích cảm ứng của nút bấm tối thiểu 44x44 dp.\n- Điều chỉnh cỡ chữ linh hoạt tránh bị tràn viền chữ.', 'Công việc', 'green', 0, 0, NULL, NULL, NULL, NULL, '2026-09-24T17:00:00.000Z', '2026-09-24T17:00:00.000Z'),
('note-44', NULL, '☀️ Nhật ký suy ngẫm cuối tuần', '"Thành công không phải là đích đến cuối cùng, mà là hành trình mỗi ngày chúng ta kiên trì học hỏi và hoàn thiện bản thân hơn hôm qua."', 'Cá nhân', 'yellow', 0, 0, NULL, NULL, NULL, NULL, '2026-09-24T13:20:00.000Z', '2026-09-24T13:20:00.000Z'),
('note-45', NULL, '🏖️ Kế hoạch nghỉ mát công ty tại Nha Trang', '- Thời gian: 3 ngày 2 đêm (Tháng 7/2026)\n- Đăng ký các hoạt động Teambuilding bãi biển\n- Đêm Gala Dinner trao giải cá nhân xuất sắc\n- Đăng ký tour lặn ngắm san hô Đảo Hòn Mun.', 'Du lịch', 'purple', 0, 0, NULL, NULL, NULL, NULL, '2026-09-23T15:00:00.000Z', '2026-09-23T15:00:00.000Z'),
('note-46', NULL, '🧪 Viết Unit Test cho ứng dụng React Native', '- Sử dụng Jest & React Native Testing Library.\n- Viết test case cho hàm xử lý lưu, sửa, xóa ghi chú.\n- Mock AsyncStorage và các API network request.\n- Đảm bảo Code Coverage đạt trên 80%.', 'Học tập', 'blue', 0, 0, NULL, NULL, NULL, NULL, '2026-09-22T14:00:00.000Z', '2026-09-22T14:00:00.000Z'),
('note-47', NULL, '📦 Danh sách dependencies quan trọng trong package.json', '- expo-router: Điều hướng màn hình chuẩn Expo v57\n- @react-native-async-storage/async-storage: Lưu trữ dữ liệu offline\n- mysql2: Kết nối CSDL MySQL\n- express: Server RESTful API backend.', 'Học tập', 'blue', 0, 0, NULL, NULL, NULL, NULL, '2026-09-21T16:30:00.000Z', '2026-09-21T16:30:00.000Z'),
('note-48', NULL, '💡 Giải pháp lưu trữ tệp đính kèm (Media Attachments)', '- Hỗ trợ hình ảnh, video, âm thanh voice note và file PDF.\n- Lưu trữ chuỗi Base64 hoặc URI đường dẫn trong trường attachments.\n- Giới hạn dung lượng tệp dưới 5MB để tránh lag ứng dụng.', 'Ý tưởng', 'yellow', 0, 0, NULL, NULL, NULL, NULL, '2026-09-20T11:00:00.000Z', '2026-09-20T11:00:00.000Z'),
('note-49', NULL, '📈 Lịch trình thi cử HK2 năm học 2025-2026', '- Môn Lập trình Thiết bị Di động: Thi ngày 15/10/2026\n- Môn Quản trị Cơ sở Dữ liệu: Thi ngày 18/10/2026\n- Môn Phân tích Thiết kế Hệ thống: Thi ngày 22/10/2026.', 'Học tập', 'blue', 0, 0, NULL, NULL, NULL, NULL, '2026-09-19T09:00:00.000Z', '2026-09-19T09:00:00.000Z'),
('note-50', NULL, '🎉 Hoàn thành xuất sắc 50 ghi chú mẫu cho Note App!', 'Chúc mừng! Bạn đã tải thành công bộ 50 ghi chú phong phú đa dạng thể loại.\nỨng dụng Note App đã sẵn sàng cho trải nghiệm mượt mà, đầy đủ dữ liệu trên cả MySQL và Offline storage!', 'Ý tưởng', 'yellow', 1, 0, NULL, NULL, NULL, NULL, '2026-09-18T08:00:00.000Z', '2026-09-18T08:00:00.000Z');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
