import React, { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

/**
 * COMPONENT CON: Avatar
 * Nhiệm vụ: Hiển thị ảnh đại diện người dùng
 * @param {Object} props
 * @param {string} props.imageUrl - Đường dẫn ảnh đại diện
 * @param {string} props.name - Tên người dùng (dùng để tạo chữ cái fallback)
 * @param {number} props.size - Kích thước avatar (pixel, mặc định 60)
 * @param {boolean} props.isOnline - Trạng thái hoạt động
 */
const Avatar = ({ imageUrl, name = 'User', size = 60, isOnline = true }) => {
  const [imageError, setImageError] = useState(false);

  // Lấy chữ cái đầu của tên làm ký tự đại diện fallback
  const getInitials = (text) => {
    if (!text) return 'U';
    const words = text.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Tạo màu nền ngẫu nhiên hài hòa dựa theo tên
  const getBackgroundColor = (text) => {
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#06B6D4'];
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <View style={[styles.avatarWrapper, { width: size, height: size }]}>
      {imageUrl && !imageError ? (
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.avatarImage,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
          onError={() => setImageError(true)}
        />
      ) : (
        <View
          style={[
            styles.fallbackAvatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: getBackgroundColor(name),
            },
          ]}
        >
          <Text style={[styles.initialsText, { fontSize: size * 0.38 }]}>
            {getInitials(name)}
          </Text>
        </View>
      )}

      {/* Chấm tròn báo trạng thái online */}
      {isOnline && (
        <View
          style={[
            styles.statusIndicator,
            {
              width: Math.max(size * 0.22, 12),
              height: Math.max(size * 0.22, 12),
              borderRadius: Math.max(size * 0.22, 12) / 2,
              right: 1,
              bottom: 1,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  fallbackAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  initialsText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusIndicator: {
    position: 'absolute',
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default Avatar;
