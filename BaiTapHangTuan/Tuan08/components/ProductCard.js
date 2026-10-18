import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Component ProductCard - Thẻ hiển thị thông tin sản phẩm
 * @param {Object} props - Thuộc tính nhận từ Component cha
 * @param {string} props.name - Tên sản phẩm (Bắt buộc)
 * @param {string|number} props.price - Giá sản phẩm (Bắt buộc)
 * @param {string} [props.category] - Danh mục sản phẩm (Tùy chọn)
 * @param {string} [props.badge] - Huy hiệu / Tag (Tùy chọn)
 * @param {function} [props.onPress] - Hàm callback khi click (Tùy chọn)
 */
export function ProductCard({ name, price, category, badge, onPress }) {
  // Format giá hiển thị VND nếu là số
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

// Hỗ trợ cả default export theo chuẩn ES6 Module
export default ProductCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Shadow cho iOS
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    // Elevation cho Android
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  iconText: {
    fontSize: 20,
  },
  badgeContainer: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BCF0DA',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#03543F',
  },
  contentContainer: {
    marginTop: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B82F6',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 22,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  priceLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#E11D48',
  },
});
