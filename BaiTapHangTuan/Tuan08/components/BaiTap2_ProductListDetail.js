import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  Alert,
  ScrollView,
} from 'react-native';

// DỮ LIỆU MẪU MOCK DATA 10 SẢN PHẨM THEO ĐÚNG YÊU CẦU ĐỀ BÀI
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'iPhone 16 Pro Max 256GB Desert Titanium',
    price: 34990000,
    category: 'Smartphone',
    rating: 4.9,
    reviewsCount: 328,
    stock: 15,
    icon: '📱',
    badge: 'Mới ra mắt',
    badgeColor: '#EF4444',
    description:
      'Trang bị vi xử lý Apple A18 Pro tiến trình 3nm, khung vỏ Titan sa mạc cao cấp siêu bền nhẹ, hệ thống camera 48MP Fusion với nút điều khiển Camera Control tiện lợi, thời lượng pin lên đến 33 giờ phát video liên tục.',
    specs: {
      brand: 'Apple',
      screen: '6.9 inch Super Retina XDR OLED 120Hz',
      cpu: 'Apple A18 Pro 6 nhân',
      ramStorage: '8GB RAM - 256GB Bộ nhớ',
      battery: '4685 mAh, Sạc nhanh MagSafe 25W',
    },
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra 5G 12GB/512GB',
    price: 31490000,
    category: 'Smartphone',
    rating: 4.8,
    reviewsCount: 215,
    stock: 22,
    icon: '📱',
    badge: 'Galaxy AI',
    badgeColor: '#3B82F6',
    description:
      'Kỷ nguyên Galaxy AI đỉnh cao với tính năng Khoanh vùng tìm kiếm (Circle to Search), Dịch trực tiếp cuộc gọi, bút S-Pen tích hợp và camera tiềm vọng 200MP zoom siêu phân giải 100x.',
    specs: {
      brand: 'Samsung',
      screen: '6.8 inch Dynamic AMOLED 2X 120Hz',
      cpu: 'Snapdragon 8 Gen 3 for Galaxy',
      ramStorage: '12GB RAM - 512GB Bộ nhớ',
      battery: '5000 mAh, Sạc nhanh 45W',
    },
  },
  {
    id: 3,
    name: 'MacBook Pro 14 M3 Pro 18GB/512GB Space Black',
    price: 49990000,
    category: 'Laptop',
    rating: 5.0,
    reviewsCount: 142,
    stock: 8,
    icon: '💻',
    badge: 'Chuyên nghiệp',
    badgeColor: '#8B5CF6',
    description:
      'Sức mạnh xử lý đồ họa đột phá với chip Apple M3 Pro, màn hình Liquid Retina XDR độ sáng tối đa 1600 nits, thời lượng pin 18 tiếng, màu Đen không gian mới phủ lớp chống bám vân tay.',
    specs: {
      brand: 'Apple',
      screen: '14.2 inch Liquid Retina XDR (3024x1964)',
      cpu: 'Apple M3 Pro 11 nhân CPU, 14 nhân GPU',
      ramStorage: '18GB Unified Memory - 512GB SSD',
      battery: '70Wh, Sạc MagSafe 3 70W',
    },
  },
  {
    id: 4,
    name: 'Laptop Gaming ASUS ROG Zephyrus G16 OLED',
    price: 52990000,
    category: 'Laptop',
    rating: 4.9,
    reviewsCount: 88,
    stock: 5,
    icon: '💻',
    badge: 'Gaming Đỉnh',
    badgeColor: '#EC4899',
    description:
      'Thiết kế khung nhôm CNC siêu mỏng nhẹ chỉ 1.85kg, màn hình ROG Nebula OLED 2.5K 240Hz sắc nét, trang bị card đồ họa rời NVIDIA GeForce RTX 4070 mạnh mẽ đáp ứng đồ họa và lập trình nặng.',
    specs: {
      brand: 'ASUS ROG',
      screen: '16.0 inch OLED 2.5K 240Hz 0.2ms',
      cpu: 'Intel Core Ultra 9 185H',
      ramStorage: '32GB LPDDR5X - 1TB PCIe 4.0 SSD',
      battery: '90Wh, Sạc nhanh Type-C',
    },
  },
  {
    id: 5,
    name: 'Tai nghe Bluetooth Sony WH-1000XM5 Hi-Res',
    price: 6790000,
    category: 'Âm thanh',
    rating: 4.8,
    reviewsCount: 405,
    stock: 30,
    icon: '🎧',
    badge: 'Chống ồn số 1',
    badgeColor: '#10B981',
    description:
      'Công nghệ chống ồn chủ động ANC hàng đầu thế giới với bộ đôi vi xử lý V1 & QN1 tích hợp 8 micro, màng loa carbon 30mm cho chất âm Hi-Res Audio sắc nét, thời lượng pin lên đến 30 giờ.',
    specs: {
      brand: 'Sony',
      screen: 'Không có màn hình',
      cpu: 'Chip xử lý tiếng ồn Sony HD QN1 + V1',
      ramStorage: 'Bộ nhớ đệm DSP âm thanh',
      battery: '30 giờ (bật ANC), 40 giờ (tắt ANC)',
    },
  },
  {
    id: 6,
    name: 'Apple Watch Series 10 GPS 46mm Nhôm Jet Black',
    price: 11490000,
    category: 'Đồng hồ',
    rating: 4.7,
    reviewsCount: 160,
    stock: 18,
    icon: '⌚',
    badge: 'Bán chạy',
    badgeColor: '#F59E0B',
    description:
      'Mẫu Apple Watch mỏng nhất từ trước đến nay, góc nhìn màn hình rộng hơn 40% với tấm nền OLED góc rộng, cảm biến đo độ sâu và nhiệt độ nước, phát hiện chứng ngưng thở khi ngủ đột phá.',
    specs: {
      brand: 'Apple',
      screen: 'OLED Always-On Retina góc nhìn rộng',
      cpu: 'Apple S10 SiP 64-bit lõi kép',
      ramStorage: '64GB Bộ nhớ trong',
      battery: '18 giờ sử dụng tiêu chuẩn, sạc nhanh 80% trong 30 phút',
    },
  },
  {
    id: 7,
    name: 'Máy tính bảng iPad Air 6 M2 11 inch Wi-Fi 128GB',
    price: 15890000,
    category: 'Tablet',
    rating: 4.9,
    reviewsCount: 230,
    stock: 25,
    icon: '📟',
    badge: 'Hiệu năng cao',
    badgeColor: '#6366F1',
    description:
      'Hiệu năng tăng vọt với chip M2 cực mạnh, camera trước đặt ngang tối ưu cho gọi video call FaceTime, hỗ trợ bút Apple Pencil Pro mới và bàn phím Magic Keyboard tiện dụng.',
    specs: {
      brand: 'Apple',
      screen: '11 inch Liquid Retina True Tone',
      cpu: 'Apple M2 8 nhân CPU, 10 nhân GPU',
      ramStorage: '8GB RAM - 128GB ROM',
      battery: '28.93 Wh, sạc nhanh qua cổng USB-C',
    },
  },
  {
    id: 8,
    name: 'Loa không dây Marshall Stanmore III Bluetooth',
    price: 9290000,
    category: 'Âm thanh',
    rating: 4.8,
    reviewsCount: 178,
    stock: 12,
    icon: '🔊',
    badge: 'Vintage Decor',
    badgeColor: '#D97706',
    description:
      'Âm trường trải rộng sống động đặc trưng phong cách Rock Marshall, kết nối Bluetooth 5.2 thế hệ mới sẵn sàng cho công nghệ Bluetooth LE Audio tương lai, thiết kế bọc da cổ điển sang trọng.',
    specs: {
      brand: 'Marshall',
      screen: 'Bảng điều khiển cơ học mạ vàng',
      cpu: 'Bộ khuếch đại Class D 80W tổng công suất',
      ramStorage: 'Không áp dụng',
      battery: 'Nguồn điện trực tiếp 100-240V',
    },
  },
  {
    id: 9,
    name: 'Bàn phím cơ công thái học Logitech Wave Keys',
    price: 1690000,
    category: 'Phụ kiện',
    rating: 4.6,
    reviewsCount: 94,
    stock: 40,
    icon: '⌨️',
    badge: 'Công thái học',
    badgeColor: '#14B8A6',
    description:
      'Bố cục uốn lượn hình sóng độc đáo giúp cổ tay và cẳng tay đặt ở tư thế tự nhiên thoải mái, đệm kê tay 3 lớp giảm căng cơ hiệu quả khi làm việc văn phòng suốt cả ngày.',
    specs: {
      brand: 'Logitech',
      screen: 'Đèn LED chỉ báo pin và thiết bị',
      cpu: 'Chip kết nối không dây Logi Bolt & Bluetooth',
      ramStorage: 'Bộ nhớ lưu 3 thiết bị Easy-Switch',
      battery: '2 pin AAA thời lượng lên đến 36 tháng',
    },
  },
  {
    id: 10,
    name: 'Màn hình Dell UltraSharp U2724D 27 inch 2K 120Hz',
    price: 9890000,
    category: 'Phụ kiện',
    rating: 4.9,
    reviewsCount: 110,
    stock: 14,
    icon: '🖥️',
    badge: 'Đồ họa chuẩn màu',
    badgeColor: '#0EA5E9',
    description:
      'Tấm nền IPS Black đột phá với độ tương phản 2000:1 sâu thẳm, tần số quét mượt mà 120Hz, phủ 100% sRGB và 98% DCI-P3 kèm cảm biến ánh sáng xung quanh tự động điều chỉnh độ sáng.',
    specs: {
      brand: 'Dell',
      screen: '27 inch IPS Black QHD (2560 x 1440) 120Hz',
      cpu: 'Vi xử lý xử lý tín hiệu hình ảnh chuyên dụng',
      ramStorage: 'Tích hợp Hub USB đa cổng kết nối',
      battery: 'Nguồn AC trực tiếp',
    },
  },
];

export default function BaiTap2_ProductListDetail() {
  // Quản lý trạng thái màn hình hiện tại (navigation state: 'list' | 'detail')
  const [currentScreen, setCurrentScreen] = useState('list');

  // Tham số / Props truyền sang màn hình Detail (id, name, price, v.v.)
  const [selectedProductParams, setSelectedProductParams] = useState(null);

  // Bộ lọc danh mục và từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  // Danh mục duy nhất lấy từ mock data
  const categories = ['All', 'Smartphone', 'Laptop', 'Âm thanh', 'Tablet', 'Đồng hồ', 'Phụ kiện'];

  // Lọc sản phẩm theo danh mục và tìm kiếm
  const filteredProducts = MOCK_PRODUCTS.filter((item) => {
    const matchCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Xử lý sự kiện bấm 1 item -> Chuyển sang màn hình Detail và truyền props/params
  const handleItemPress = (product) => {
    // Truyền đầy đủ props/params (id, name, price...) sang màn hình Detail
    setSelectedProductParams(product);
    setCurrentScreen('detail');
  };

  // Quay lại màn hình danh sách
  const handleBackToList = () => {
    setCurrentScreen('list');
    setSelectedProductParams(null);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  // Format giá tiền tệ VND
  const formatVND = (price) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  // ==========================================
  // RENDER MÀN HÌNH CHI TIẾT (DETAIL SCREEN)
  // ==========================================
  if (currentScreen === 'detail' && selectedProductParams) {
    const product = selectedProductParams;

    return (
      <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
        {/* Thanh Header Detail với nút Back */}
        <View style={styles.detailTopBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToList}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Quay lại danh sách</Text>
          </TouchableOpacity>
          <View style={styles.badgeDetailId}>
            <Text style={styles.badgeDetailIdText}>Mã ID: #{product.id}</Text>
          </View>
        </View>

        {/* Khung Hero hình ảnh & icon sản phẩm */}
        <View style={styles.detailHeroBox}>
          <View style={styles.detailIconCircle}>
            <Text style={styles.detailBigIcon}>{product.icon}</Text>
          </View>
          <View style={[styles.detailBadgeTag, { backgroundColor: product.badgeColor || '#2563EB' }]}>
            <Text style={styles.detailBadgeTagText}>{product.badge}</Text>
          </View>
          <Text style={styles.detailCategory}>{product.category.toUpperCase()}</Text>
          <Text style={styles.detailName}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.ratingScore}>{product.rating} / 5.0</Text>
            <Text style={styles.reviewsCount}>({product.reviewsCount} lượt đánh giá thực tế)</Text>
          </View>

          <View style={styles.detailPriceRow}>
            <Text style={styles.detailPriceLabel}>Giá niêm yết chính hãng:</Text>
            <Text style={styles.detailPriceValue}>{formatVND(product.price)}</Text>
          </View>
        </View>

        {/* THÔNG SỐ VÀ DỮ LIỆU ĐƯỢC TRUYỀN QUA PROPS/PARAMS */}
        <View style={styles.paramsCard}>
          <View style={styles.paramsHeader}>
            <Text style={styles.paramsHeaderIcon}>📥</Text>
            <Text style={styles.paramsHeaderTitle}>Dữ liệu nhận qua Props / Params:</Text>
          </View>
          <View style={styles.paramItemRow}>
            <Text style={styles.paramKey}>• Param `id`:</Text>
            <Text style={styles.paramValHighlight}>{product.id}</Text>
          </View>
          <View style={styles.paramItemRow}>
            <Text style={styles.paramKey}>• Param `name`:</Text>
            <Text style={styles.paramValText} numberOfLines={2}>{product.name}</Text>
          </View>
          <View style={styles.paramItemRow}>
            <Text style={styles.paramKey}>• Param `price`:</Text>
            <Text style={styles.paramValPrice}>{formatVND(product.price)}</Text>
          </View>
          <View style={styles.paramItemRow}>
            <Text style={styles.paramKey}>• Trạng thái kho:</Text>
            <Text style={styles.stockText}>Còn {product.stock} sản phẩm sẵn có</Text>
          </View>
        </View>

        {/* MÔ TẢ CHI TIẾT SẢN PHẨM */}
        <View style={styles.sectionBox}>
          <Text style={styles.boxTitle}>📝 Mô tả sản phẩm</Text>
          <Text style={styles.detailDescription}>{product.description}</Text>
        </View>

        {/* BẢNG THÔNG SỐ KỸ THUẬT */}
        {product.specs && (
          <View style={styles.sectionBox}>
            <Text style={styles.boxTitle}>⚙️ Thông số kỹ thuật</Text>
            <View style={styles.specTable}>
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Thương hiệu</Text>
                <Text style={styles.specValue}>{product.specs.brand}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Màn hình</Text>
                <Text style={styles.specValue}>{product.specs.screen}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Vi xử lý (CPU)</Text>
                <Text style={styles.specValue}>{product.specs.cpu}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specKey}>RAM / Lưu trữ</Text>
                <Text style={styles.specValue}>{product.specs.ramStorage}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Pin & Sạc</Text>
                <Text style={styles.specValue}>{product.specs.battery}</Text>
              </View>
            </View>
          </View>
        )}

        {/* NÚT THAO TÁC MUA HÀNG */}
        <View style={styles.actionButtonGroup}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() =>
              Alert.alert(
                '🛒 Đã thêm vào giỏ hàng!',
                `Sản phẩm: "${product.name}"\nĐơn giá: ${formatVND(product.price)}`
              )
            }
            activeOpacity={0.8}
          >
            <Text style={styles.cartButtonText}>Thêm vào giỏ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buyNowButton}
            onPress={() =>
              Alert.alert(
                '💳 Mua ngay',
                `Đang tiến hành tạo đơn hàng cho sản phẩm #${product.id} (${formatVND(
                  product.price
                )})`
              )
            }
            activeOpacity={0.8}
          >
            <Text style={styles.buyNowButtonText}>Mua ngay</Text>
          </TouchableOpacity>
        </View>

        {/* HỘP PHÂN TÍCH KỸ THUẬT VỀ ĐIỀU HƯỚNG VÀ TRUYỀN PARAMS */}
        <View style={styles.techNoteBox}>
          <Text style={styles.techNoteTitle}>
            💡 Phân tích kỹ thuật: Cơ chế truyền Props & Params giữa List và Detail
          </Text>
          <Text style={styles.techNoteParagraph}>
            • <Text style={styles.boldNote}>Khi dùng React Navigation:</Text> Điều hướng sử dụng câu lệnh:
          </Text>
          <View style={styles.codeSnippet}>
            <Text style={styles.codeSnippetText}>
              {'navigation.navigate(\'DetailScreen\', {\n  id: item.id,\n  name: item.name,\n  price: item.price,\n  ...item\n});'}
            </Text>
          </View>
          <Text style={styles.techNoteParagraph}>
            • Ở màn hình <Text style={styles.codeText}>DetailScreen</Text>, component con lấy params thông qua Hook <Text style={styles.codeText}>useRoute()</Text> hoặc thuộc tính <Text style={styles.codeText}>route.params</Text>:
          </Text>
          <View style={styles.codeSnippet}>
            <Text style={styles.codeSnippetText}>
              {'const { id, name, price } = route.params;'}
            </Text>
          </View>
          <Text style={styles.techNoteParagraph}>
            • <Text style={styles.boldNote}>Khi dùng Navigation bằng State/Props:</Text> Component cha giữ trạng thái <Text style={styles.codeText}>selectedProductParams</Text> và truyền trực tiếp xuống component <Text style={styles.codeText}>DetailScreen</Text> dưới dạng props, đảm bảo tính đóng gói, dễ kiểm thử và độc lập tuyệt đối.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  // ==========================================
  // RENDER MÀN HÌNH DANH SÁCH (LIST SCREEN - DÙNG FLATLIST)
  // ==========================================
  const renderProductItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardLeft}>
          <View style={styles.itemIconCircle}>
            <Text style={styles.itemEmoji}>{item.icon}</Text>
          </View>
          <View style={styles.idBadge}>
            <Text style={styles.idBadgeText}>#{item.id}</Text>
          </View>
        </View>

        <View style={styles.cardCenter}>
          <View style={styles.categoryBadgeRow}>
            <Text style={styles.cardCategoryText}>{item.category.toUpperCase()}</Text>
            {item.badge && (
              <View style={[styles.microBadge, { backgroundColor: item.badgeColor + '18' }]}>
                <Text style={[styles.microBadgeText, { color: item.badgeColor }]}>
                  {item.badge}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.cardName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>{formatVND(item.price)}</Text>
            <View style={styles.cardRating}>
              <Text style={styles.cardRatingStar}>⭐</Text>
              <Text style={styles.cardRatingText}>{item.rating}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardRightArrow}>
          <Text style={styles.arrowText}>›</Text>
          <Text style={styles.viewDetailHint}>Chi tiết</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Khung giới thiệu bài tập */}
      <View style={styles.headerBox}>
        <View style={styles.badgeMedium}>
          <Text style={styles.badgeMediumText}>MỨC TRUNG BÌNH • FLATLIST & PARAMS</Text>
        </View>
        <Text style={styles.mainTitle}>Danh Sách Sản Phẩm (Mock 10 Items)</Text>
        <Text style={styles.subTitle}>
          Sử dụng FlatList hiển thị 10 sản phẩm công nghệ. Bấm vào một item để điều hướng sang màn hình Detail và truyền bộ params (id, name, price).
        </Text>

        {/* Thanh tìm kiếm sản phẩm */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên sản phẩm hoặc danh mục..."
            placeholderTextColor="#94A3B8"
            value={searchTerm}
            onChangeText={setSearchTerm}
            clearButtonMode="while-editing"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Thanh cuộn ngang lọc danh mục */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Thông tin số lượng kết quả */}
      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          Hiển thị <Text style={styles.statsBold}>{filteredProducts.length}</Text> / {MOCK_PRODUCTS.length} sản phẩm
        </Text>
        <Text style={styles.hintTapText}>👉 Bấm vào thẻ để xem màn hình Detail</Text>
      </View>

      {/* DANH SÁCH SỬ DỤNG FLATLIST THEO ĐÚNG YÊU CẦU ĐỀ BÀI */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm phù hợp</Text>
            <Text style={styles.emptySub}>
              Vui lòng thử lại với từ khóa tìm kiếm hoặc danh mục khác!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  badgeMedium: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeMediumText: {
    color: '#6D28D9',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 44,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '700',
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
  },
  statsText: {
    fontSize: 12,
    color: '#64748B',
  },
  statsBold: {
    fontWeight: '700',
    color: '#1E293B',
  },
  hintTapText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
  },
  listContent: {
    padding: 14,
    paddingBottom: 30,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  itemIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemEmoji: {
    fontSize: 24,
  },
  idBadge: {
    marginTop: 4,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  idBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  cardCenter: {
    flex: 1,
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  cardCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3B82F6',
    letterSpacing: 0.5,
  },
  microBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  microBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 19,
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#E11D48',
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardRatingStar: {
    fontSize: 10,
    marginRight: 2,
  },
  cardRatingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  cardRightArrow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  arrowText: {
    fontSize: 22,
    color: '#94A3B8',
    fontWeight: '300',
  },
  viewDetailHint: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },

  // STYLES CHO DETAIL SCREEN
  detailContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  detailTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  badgeDetailId: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  badgeDetailIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  detailHeroBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  detailIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#DBEAFE',
  },
  detailBigIcon: {
    fontSize: 42,
  },
  detailBadgeTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  detailBadgeTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  detailCategory: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
    letterSpacing: 1,
    marginBottom: 4,
  },
  detailName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  starIcon: {
    fontSize: 15,
    marginRight: 4,
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 6,
  },
  reviewsCount: {
    fontSize: 12,
    color: '#64748B',
  },
  detailPriceRow: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  detailPriceLabel: {
    fontSize: 12,
    color: '#9F1239',
    fontWeight: '600',
    marginBottom: 2,
  },
  detailPriceValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#E11D48',
  },
  paramsCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  paramsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  paramsHeaderIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  paramsHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0369A1',
  },
  paramItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E0F2FE',
  },
  paramKey: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0C4A6E',
  },
  paramValHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284C7',
    fontFamily: 'monospace',
  },
  paramValText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    maxWidth: '65%',
    textAlign: 'right',
  },
  paramValPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E11D48',
  },
  stockText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
  },
  sectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  boxTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 21,
  },
  specTable: {
    gap: 8,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  specKey: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
  },
  specValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
    maxWidth: '65%',
    textAlign: 'right',
  },
  actionButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  cartButton: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  buyNowButton: {
    flex: 1.2,
    backgroundColor: '#E11D48',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  buyNowButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  techNoteBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  techNoteTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 8,
  },
  techNoteParagraph: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginVertical: 3,
  },
  boldNote: {
    fontWeight: '700',
    color: '#0F172A',
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
    fontSize: 11.5,
    lineHeight: 16,
  },
  codeText: {
    fontFamily: 'monospace',
    backgroundColor: '#E2E8F0',
    color: '#D97706',
    fontWeight: '600',
    fontSize: 11,
  },
});
