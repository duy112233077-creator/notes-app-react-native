-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 11, 2026
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
  `category` varchar(50) DEFAULT 'Khác',
  `color_id` varchar(30) DEFAULT 'yellow',
  `is_pinned` tinyint(1) DEFAULT 0,
  `is_locked` tinyint(1) DEFAULT 0,
  `attachments` longtext DEFAULT NULL,
  `reminder_at` varchar(50) DEFAULT NULL,
  `share_code` varchar(100) DEFAULT NULL,
  `collaborators` longtext DEFAULT NULL,
  `created_at` varchar(50) DEFAULT NULL,
  `updated_at` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_share_code` (`share_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dữ liệu mẫu ban đầu cho bảng `notes`
--

INSERT INTO `notes` (`id`, `user_id`, `title`, `content`, `category`, `color_id`, `is_pinned`, `is_locked`, `attachments`, `reminder_at`, `share_code`, `collaborators`, `created_at`, `updated_at`) VALUES
('note-1', NULL, '🌟 Chào mừng bạn đến với Note App!', 'Dữ liệu đã kết nối trực tiếp với MySQL trên XAMPP!\n• Bạn tạo ghi chú mới sẽ tự động lưu vào MySQL.\n• Bạn sửa nội dung hoặc xóa ghi chú thì MySQL cũng cập nhật tương ứng.\n• Có thể mở phpMyAdmin (http://localhost/phpmyadmin) để xem bảng notes.', 'Ý tưởng', 'yellow', 1, 0, NULL, NULL, 'WELCOME123', NULL, '2026-09-10T10:00:00.000Z', '2026-09-10T10:00:00.000Z'),
('note-2', NULL, '📚 Nhiệm vụ học tập tuần này', '1. Hoàn thiện bài tập lớn ứng dụng React Native.\n2. Kiểm tra kết nối cơ sở dữ liệu MySQL trên XAMPP.\n3. Chuẩn bị slide báo cáo tiến độ.', 'Học tập', 'blue', 1, 0, NULL, NULL, NULL, NULL, '2026-09-11T08:00:00.000Z', '2026-09-11T08:00:00.000Z'),
('note-3', NULL, '💼 Danh sách việc cần làm công việc', '- Họp giao ban đầu tuần lúc 9:00 sáng\n- Phản hồi email khách hàng về dự án mới\n- Rà soát lại thiết kế UI/UX', 'Công việc', 'green', 0, 0, NULL, NULL, NULL, NULL, '2026-09-11T09:30:00.000Z', '2026-09-11T09:30:00.000Z'),
('note-4', NULL, '🛒 Mua sắm cuối tuần', '• Sách mới về lập trình TypeScript & Mobile App\n• Cà phê hạt rang mộc\n• Bàn phím cơ & giá đỡ máy tính xách tay', 'Cá nhân', 'rose', 0, 0, NULL, NULL, NULL, NULL, '2026-09-11T11:15:00.000Z', '2026-09-11T11:15:00.000Z');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

