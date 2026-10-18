import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
// Import component ProductCard riêng biệt theo đúng yêu cầu đề bài
import ProductCard from './ProductCard';

export default function BaiTap1_EasyProductCards() {
  // Bộ 3 sản phẩm mẫu mặc định (dùng props name và price)
  const initialProducts = [
    {
      id: 'p1',
      name: 'Điện thoại iPhone 16 Pro Max 256GB - Titan Tự Nhiên',
      price: 34990000,
      category: 'Điện thoại & Tablet',
      badge: 'Bán chạy',
    },
    {
      id: 'p2',
      name: 'Tai nghe Bluetooth Apple AirPods Pro 2 USB-C (MagSafe)',
      price: 5690000,
      category: 'Âm thanh & Phụ kiện',
      badge: 'Giảm 15%',
    },
    {
      id: 'p3',
      name: 'Bàn phím cơ không dây Keychron K2 Pro QMK/VIA Gateron Red Switch',
      price: 2450000,
      category: 'Phụ kiện máy tính',
      badge: 'Đánh giá cao',
    },
    {
      id: 'p4',
      name: 'Chuột không dây Logitech MX Master 3S for Mac Silent',
      price: 2190000,
      category: 'Phụ kiện máy tính',
      badge: 'Mới về',
    },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Hàm mô phỏng component cha thay đổi dữ liệu truyền xuống component con
  const handleApplyDiscount = () => {
    setProducts((prev) =>
      prev.map((item) => ({
        ...item,
        price: Math.round(item.price * 0.9), // Giảm 10%
        badge: 'Ưu đãi sốc',
      }))
    );
  };

  const handleResetData = () => {
    setProducts(initialProducts);
    setSelectedProduct(null);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Khung tiêu đề bài tập */}
      <View style={styles.headerBox}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagBadgeText}>MỨC DỄ • COMPONENT & PROPS</Text>
        </View>
        <Text style={styles.title}>Thẻ Sản Phẩm (ProductCard)</Text>
        <Text style={styles.description}>
          Tách component riêng `ProductCard.js`, nhận props <Text style={styles.codeText}>name</Text> và <Text style={styles.codeText}>price</Text>, tái sử dụng nhiều lần với các tập dữ liệu khác nhau.
        </Text>
      </View>

      {/* Thanh điều khiển thử nghiệm tương tác */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleApplyDiscount}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>🏷️ Giảm giá 10% tất cả</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnOutline]}
          onPress={handleResetData}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnTextOutline}>🔄 Khôi phục</Text>
        </TouchableOpacity>
      </View>

      {/* Thông báo sản phẩm vừa click */}
      {selectedProduct && (
        <View style={styles.notifyCard}>
          <Text style={styles.notifyTitle}>🔔 Bạn đã chọn sản phẩm:</Text>
          <Text style={styles.notifyContent}>
            {selectedProduct.name} - Giá: {selectedProduct.price.toLocaleString('vi-VN')} ₫
          </Text>
        </View>
      )}

      {/* DANH SÁCH 3+ LẦN SỬ DỤNG COMPONENT PRODUCTCARD VỚI CÁC BỘ DỮ LIỆU KHÁC NHAU */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          📦 Danh sách Card sử dụng component ProductCard:
        </Text>
        <Text style={styles.sectionSub}>
          (Hiển thị {products.length} thẻ tái sử dụng)
        </Text>
      </View>

      {/* Lần dùng 1, 2, 3, 4 */}
      {products.map((item, index) => (
        <View key={item.id} style={styles.cardWrapper}>
          <View style={styles.instanceIndex}>
            <Text style={styles.instanceText}>Lần gọi #{index + 1}</Text>
            <Text style={styles.instancePropText}>
              Props: name="{item.name.substring(0, 22)}...", price={item.price}
            </Text>
          </View>
          <ProductCard
            name={item.name}
            price={item.price}
            category={item.category}
            badge={item.badge}
            onPress={() => setSelectedProduct(item)}
          />
        </View>
      ))}

      {/* KHỐI GIẢI THÍCH THEO ĐÚNG YÊU CẦU ĐỀ BÀI */}
      <View style={styles.explanationBox}>
        <View style={styles.expHeader}>
          <Text style={styles.expHeaderIcon}>💡</Text>
          <Text style={styles.expHeaderTitle}>
            Giải thích cơ chế Props & Khả năng tái sử dụng:
          </Text>
        </View>

        <View style={styles.expContent}>
          <Text style={styles.expPointTitle}>
            1. Cách props được truyền từ Component cha xuống Component con:
          </Text>
          <Text style={styles.expParagraph}>
            • Trong React Native, dữ liệu di chuyển theo luồng một chiều (<Text style={styles.boldText}>One-way data flow</Text> hay <Text style={styles.boldText}>Top-down</Text>).
          </Text>
          <Text style={styles.expParagraph}>
            • Component cha (<Text style={styles.codeText}>BaiTap1_EasyProductCards</Text>) nắm giữ dữ liệu mảng các sản phẩm. Khi render, component cha gọi thẻ con và gán dữ liệu qua các thuộc tính JSX:
          </Text>
          <View style={styles.codeSnippet}>
            <Text style={styles.codeSnippetText}>
              {'<ProductCard\n  name={item.name}\n  price={item.price}\n/>'}
            </Text>
          </View>
          <Text style={styles.expParagraph}>
            • Component con (<Text style={styles.codeText}>ProductCard</Text>) nhận các giá trị này thông qua tham số đầu vào <Text style={styles.codeText}>props</Text> (hoặc cú pháp giải nén <Text style={styles.codeText}>{'{ name, price }'}</Text>) để render lên giao diện qua các thành phần nguyên thủy <Text style={styles.codeText}>{'<Text>'}</Text> và <Text style={styles.codeText}>{'<View>'}</Text>.
          </Text>

          <View style={styles.expDivider} />

          <Text style={styles.expPointTitle}>
            2. Vì sao component ProductCard có thể tái sử dụng nhiều lần:
          </Text>
          <Text style={styles.expParagraph}>
            • <Text style={styles.boldText}>Độc lập về trạng thái và dữ liệu:</Text> <Text style={styles.codeText}>ProductCard</Text> đóng vai trò là một <Text style={styles.boldText}>Presentational / Pure Component</Text>. Bản thân nó không bị gắn chết (hardcode) với bất kỳ sản phẩm cụ thể nào, mà hoạt động như một "bộ khung khuôn mẫu" (template).
          </Text>
          <Text style={styles.expParagraph}>
            • <Text style={styles.boldText}>Tính đóng gói giao diện và kiểu dáng (Encapsulation):</Text> Toàn bộ logic giao diện, cấu trúc View, Text, đổ bóng Shadow, cách format định dạng tiền tệ "₫" đều được đóng gói gọn trong file <Text style={styles.codeText}>ProductCard.js</Text>.
          </Text>
          <Text style={styles.expParagraph}>
            • <Text style={styles.boldText}>Khả năng thích ứng cao:</Text> Bất kỳ màn hình nào trong ứng dụng (Trang chủ, Giỏ hàng, Danh mục, Lịch sử mua sắm) chỉ cần <Text style={styles.codeText}>import ProductCard</Text> và truyền vào 2 thuộc tính cơ bản <Text style={styles.codeText}>name</Text> và <Text style={styles.codeText}>price</Text> là có thể hiển thị một thẻ sản phẩm hoàn chỉnh mà không phải viết lại code định kiểu giao diện.
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  headerBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  tagBadgeText: {
    color: '#1E40AF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  codeText: {
    fontFamily: 'monospace',
    backgroundColor: '#F1F5F9',
    color: '#D97706',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  actionBtnOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    shadowOpacity: 0.05,
  },
  actionBtnTextOutline: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  notifyCard: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  notifyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 2,
  },
  notifyContent: {
    fontSize: 13,
    color: '#78350F',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
  },
  cardWrapper: {
    marginBottom: 12,
  },
  instanceIndex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  instanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  instancePropText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },
  explanationBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 18,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  expHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  expHeaderIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  expHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#166534',
    flex: 1,
  },
  expContent: {
    gap: 8,
  },
  expPointTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#14532D',
    marginTop: 6,
    marginBottom: 2,
  },
  expParagraph: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
    color: '#064E3B',
  },
  codeSnippet: {
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  codeSnippetText: {
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  expDivider: {
    height: 1,
    backgroundColor: '#DCFCE7',
    marginVertical: 8,
  },
});
