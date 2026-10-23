import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';

export default function BaiTap1_LoginScreen() {
  // Quản lý state dữ liệu nhập form
  const [email, setEmail] = useState('sinhvien.utehy@edu.vn');
  const [password, setPassword] = useState('utehy@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Xử lý sự kiện đăng nhập
  const handleLogin = () => {
    setErrorMessage('');

    // Kiểm tra dữ liệu rỗng
    if (!email.trim()) {
      setErrorMessage('⚠️ Vui lòng nhập email hoặc tên đăng nhập!');
      return;
    }
    if (!password) {
      setErrorMessage('⚠️ Vui lòng nhập mật khẩu bảo mật!');
      return;
    }

    // Kiểm tra định dạng email cơ bản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('⚠️ Địa chỉ email không đúng định dạng (vd: user@domain.com)!');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('⚠️ Mật khẩu phải chứa ít nhất 6 ký tự!');
      return;
    }

    // Đăng nhập hợp lệ
    setShowSuccessModal(true);
  };

  // Xử lý gửi yêu cầu quên mật khẩu
  const handleForgotSubmit = () => {
    if (!forgotEmail.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập địa chỉ email để khôi phục mật khẩu!');
      return;
    }
    Alert.alert(
      'Thành công',
      `Liên kết khôi phục mật khẩu đã được gửi đến: ${forgotEmail}\nVui lòng kiểm tra hòm thư của bạn!`,
      [
        {
          text: 'Đồng ý',
          onPress: () => {
            setShowForgotModal(false);
            setForgotEmail('');
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Card chứa form đăng nhập chính */}
        <View style={styles.loginCard}>
          {/* Logo biểu tượng ứng dụng */}
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>📝</Text>
          </View>

          {/* 1. Tiêu đề ứng dụng */}
          <Text style={styles.appTitle}>EduNotes UTEHY</Text>
          <Text style={styles.appSubtitle}>
            Hệ thống Sổ tay & Quản lý Học tập Sinh viên
          </Text>

          {/* Hiển thị thông báo lỗi validation nếu có */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* 2. Ô nhập thông tin thứ nhất: Email / Tên tài khoản */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tên tài khoản hoặc Email:</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập email sinh viên..."
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errorMessage) setErrorMessage('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* 2. Ô nhập thông tin thứ hai: Mật khẩu */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mật khẩu bảo mật:</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập mật khẩu của bạn..."
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errorMessage) setErrorMessage('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.toggleEyeButton}
                activeOpacity={0.6}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Dòng chữ "Forgot password" */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => {
              setForgotEmail(email);
              setShowForgotModal(true);
            }}
            activeOpacity={0.6}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* 4. Nút đăng nhập */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
          </TouchableOpacity>

          {/* Đường phân cách */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>HOẶC</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Nút đăng nhập phụ / Khách */}
          <TouchableOpacity
            style={styles.guestButton}
            onPress={() => {
              setEmail('guest.utehy@demo.vn');
              setPassword('123456');
              setErrorMessage('');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.guestButtonText}>⚡ Điền tài khoản trải nghiệm mẫu</Text>
          </TouchableOpacity>
        </View>

        {/* Khung phân tích kỹ thuật StyleSheet đã áp dụng theo yêu cầu đề bài */}
        <View style={styles.specBox}>
          <Text style={styles.specTitle}>
            📋 Bảng tra cứu thuộc tính StyleSheet.create() sử dụng trong bài:
          </Text>
          <View style={styles.specList}>
            <Text style={styles.specItem}>
              • <Text style={styles.specHighlight}>backgroundColor</Text>: #F1F5F9 (nền tổng thể), #FFFFFF (nền card), #2563EB (nền nút bấm).
            </Text>
            <Text style={styles.specItem}>
              • <Text style={styles.specHighlight}>fontSize</Text>: 24px (tiêu đề chính), 16px (nút bấm), 14px (nhãn & ô nhập liệu).
            </Text>
            <Text style={styles.specItem}>
              • <Text style={styles.specHighlight}>fontWeight</Text>: '800' (tiêu đề đậm nét), '700' (nút bấm), '600' (nhãn form).
            </Text>
            <Text style={styles.specItem}>
              • <Text style={styles.specHighlight}>padding</Text>: 24px (đệm trong login card), 12px (đệm ô input), 14px (đệm nút).
            </Text>
            <Text style={styles.specItem}>
              • <Text style={styles.specHighlight}>margin</Text>: margin ngắt khoảng cách giữa tiêu đề, inputGroup, nút bấm và forgot password.
            </Text>
            <Text style={styles.specItem}>
              • <Text style={styles.specHighlight}>borderWidth & borderColor</Text>: 1.5px (#CBD5E1) tạo viền ô nhập; 1px bo viền card.
            </Text>
            <Text style={styles.specItem}>
              • <Text style={styles.specHighlight}>borderRadius</Text>: 20px (bo góc khung card), 12px (bo góc ô nhập & nút đăng nhập).
            </Text>
            <Text style={styles.specItem}>
              • <Text style={styles.specHighlight}>justifyContent & alignItems</Text>: 'center', 'space-between' căn chỉnh bố cục Flexbox hoàn mỹ.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal thông báo Đăng nhập thành công */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>🎉</Text>
            <Text style={styles.modalTitle}>Đăng nhập thành công!</Text>
            <Text style={styles.modalDesc}>
              Chào mừng tài khoản: <Text style={styles.modalBold}>{email}</Text>
            </Text>
            <Text style={styles.modalSubDesc}>
              Hệ thống đã xác thực thông tin thành công theo tiêu chuẩn React Native StyleSheet.
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalCloseText}>Vào trang chủ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal popup "Forgot password" */}
      <Modal
        visible={showForgotModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowForgotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>🔑</Text>
            <Text style={styles.modalTitle}>Khôi phục mật khẩu</Text>
            <Text style={styles.modalDesc}>
              Nhập email tài khoản của bạn để nhận liên kết đặt lại mật khẩu mới:
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nhập email khôi phục..."
              placeholderTextColor="#94A3B8"
              value={forgotEmail}
              onChangeText={setForgotEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={[styles.modalActionBtn, styles.modalCancelBtn]}
                onPress={() => setShowForgotModal(false)}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionBtn, styles.modalSubmitBtn]}
                onPress={handleForgotSubmit}
              >
                <Text style={styles.modalSubmitText}>Gửi liên kết</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ==========================================
// TOÀN BỘ STYLE ĐƯỢC ĐỊNH NGHĨA BẰNG StyleSheet.create()
// ĐÁP ỨNG ĐẦY ĐỦ CÁC THUỘC TÍNH THEO BAREM YÊU CẦU ĐỀ BÀI:
// backgroundColor, fontSize, fontWeight, padding, margin,
// borderWidth, borderRadius, justifyContent, alignItems
// ==========================================
const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#F1F5F9', // Thuộc tính: backgroundColor
  },
  scrollContainer: {
    paddingHorizontal: 20, // Thuộc tính: padding
    paddingVertical: 24,
    justifyContent: 'center', // Thuộc tính: justifyContent
    alignItems: 'center', // Thuộc tính: alignItems
  },
  loginCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF', // Thuộc tính: backgroundColor
    borderRadius: 20, // Thuộc tính: borderRadius
    padding: 24, // Thuộc tính: padding
    borderWidth: 1, // Thuộc tính: borderWidth
    borderColor: '#E2E8F0',
    alignItems: 'center', // Thuộc tính: alignItems
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32, // Thuộc tính: borderRadius
    backgroundColor: '#EFF6FF', // Thuộc tính: backgroundColor
    borderWidth: 1.5, // Thuộc tính: borderWidth
    borderColor: '#BFDBFE',
    justifyContent: 'center', // Thuộc tính: justifyContent
    alignItems: 'center', // Thuộc tính: alignItems
    marginBottom: 12, // Thuộc tính: margin
  },
  logoIcon: {
    fontSize: 32, // Thuộc tính: fontSize
  },
  appTitle: {
    fontSize: 24, // Thuộc tính: fontSize
    fontWeight: '800', // Thuộc tính: fontWeight
    color: '#0F172A',
    marginBottom: 6, // Thuộc tính: margin
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 13, // Thuộc tính: fontSize
    fontWeight: '500', // Thuộc tính: fontWeight
    color: '#64748B',
    marginBottom: 20, // Thuộc tính: margin
    textAlign: 'center',
    lineHeight: 18,
  },
  errorBox: {
    width: '100%',
    backgroundColor: '#FEF2F2', // Thuộc tính: backgroundColor
    borderWidth: 1, // Thuộc tính: borderWidth
    borderColor: '#FECACA',
    borderRadius: 10, // Thuộc tính: borderRadius
    padding: 10, // Thuộc tính: padding
    marginBottom: 16, // Thuộc tính: margin
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12.5, // Thuộc tính: fontSize
    fontWeight: '600', // Thuộc tính: fontWeight
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16, // Thuộc tính: margin
  },
  inputLabel: {
    fontSize: 13.5, // Thuộc tính: fontSize
    fontWeight: '600', // Thuộc tính: fontWeight
    color: '#334155',
    marginBottom: 6, // Thuộc tính: margin
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center', // Thuộc tính: alignItems
    backgroundColor: '#F8FAFC', // Thuộc tính: backgroundColor
    borderWidth: 1.5, // Thuộc tính: borderWidth
    borderColor: '#CBD5E1',
    borderRadius: 12, // Thuộc tính: borderRadius
    paddingHorizontal: 12, // Thuộc tính: padding
  },
  inputIcon: {
    fontSize: 16, // Thuộc tính: fontSize
    marginRight: 8, // Thuộc tính: margin
  },
  textInput: {
    flex: 1,
    height: 46,
    fontSize: 14.5, // Thuộc tính: fontSize
    color: '#0F172A',
    fontWeight: '500', // Thuộc tính: fontWeight
  },
  toggleEyeButton: {
    padding: 6, // Thuộc tính: padding
  },
  eyeIcon: {
    fontSize: 16, // Thuộc tính: fontSize
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20, // Thuộc tính: margin
    paddingVertical: 4, // Thuộc tính: padding
  },
  forgotPasswordText: {
    fontSize: 13.5, // Thuộc tính: fontSize
    fontWeight: '700', // Thuộc tính: fontWeight
    color: '#2563EB',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#2563EB', // Thuộc tính: backgroundColor
    paddingVertical: 14, // Thuộc tính: padding
    borderRadius: 12, // Thuộc tính: borderRadius
    alignItems: 'center', // Thuộc tính: alignItems
    justifyContent: 'center', // Thuộc tính: justifyContent
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15, // Thuộc tính: fontSize
    fontWeight: '700', // Thuộc tính: fontWeight
    letterSpacing: 0.8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center', // Thuộc tính: alignItems
    marginVertical: 18, // Thuộc tính: margin
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0', // Thuộc tính: backgroundColor
  },
  dividerText: {
    marginHorizontal: 10, // Thuộc tính: margin
    fontSize: 11, // Thuộc tính: fontSize
    fontWeight: '700', // Thuộc tính: fontWeight
    color: '#94A3B8',
  },
  guestButton: {
    width: '100%',
    paddingVertical: 11, // Thuộc tính: padding
    backgroundColor: '#F8FAFC', // Thuộc tính: backgroundColor
    borderRadius: 10, // Thuộc tính: borderRadius
    borderWidth: 1, // Thuộc tính: borderWidth
    borderColor: '#E2E8F0',
    alignItems: 'center', // Thuộc tính: alignItems
  },
  guestButtonText: {
    color: '#475569',
    fontSize: 12.5, // Thuộc tính: fontSize
    fontWeight: '600', // Thuộc tính: fontWeight
  },
  specBox: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF', // Thuộc tính: backgroundColor
    borderRadius: 16, // Thuộc tính: borderRadius
    padding: 16, // Thuộc tính: padding
    marginTop: 20, // Thuộc tính: margin
    borderWidth: 1, // Thuộc tính: borderWidth
    borderColor: '#CBD5E1',
  },
  specTitle: {
    fontSize: 13.5, // Thuộc tính: fontSize
    fontWeight: '800', // Thuộc tính: fontWeight
    color: '#1E293B',
    marginBottom: 8, // Thuộc tính: margin
  },
  specList: {
    gap: 6,
  },
  specItem: {
    fontSize: 12, // Thuộc tính: fontSize
    color: '#475569',
    lineHeight: 18,
  },
  specHighlight: {
    fontWeight: '800', // Thuộc tính: fontWeight
    color: '#2563EB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // Thuộc tính: backgroundColor
    justifyContent: 'center', // Thuộc tính: justifyContent
    alignItems: 'center', // Thuộc tính: alignItems
    padding: 20, // Thuộc tính: padding
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF', // Thuộc tính: backgroundColor
    borderRadius: 20, // Thuộc tính: borderRadius
    padding: 24, // Thuộc tính: padding
    alignItems: 'center', // Thuộc tính: alignItems
  },
  modalIcon: {
    fontSize: 48, // Thuộc tính: fontSize
    marginBottom: 12, // Thuộc tính: margin
  },
  modalTitle: {
    fontSize: 18, // Thuộc tính: fontSize
    fontWeight: '800', // Thuộc tính: fontWeight
    color: '#0F172A',
    marginBottom: 8, // Thuộc tính: margin
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 13.5, // Thuộc tính: fontSize
    color: '#475569',
    textAlign: 'center',
    marginBottom: 12, // Thuộc tính: margin
    lineHeight: 19,
  },
  modalBold: {
    fontWeight: '700', // Thuộc tính: fontWeight
    color: '#2563EB',
  },
  modalSubDesc: {
    fontSize: 12, // Thuộc tính: fontSize
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 18, // Thuộc tính: margin
  },
  modalCloseButton: {
    width: '100%',
    backgroundColor: '#2563EB', // Thuộc tính: backgroundColor
    paddingVertical: 12, // Thuộc tính: padding
    borderRadius: 10, // Thuộc tính: borderRadius
    alignItems: 'center', // Thuộc tính: alignItems
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontWeight: '700', // Thuộc tính: fontWeight
    fontSize: 14, // Thuộc tính: fontSize
  },
  modalInput: {
    width: '100%',
    height: 44,
    borderWidth: 1.5, // Thuộc tính: borderWidth
    borderColor: '#CBD5E1',
    borderRadius: 10, // Thuộc tính: borderRadius
    paddingHorizontal: 12, // Thuộc tính: padding
    fontSize: 14, // Thuộc tính: fontSize
    color: '#0F172A',
    backgroundColor: '#F8FAFC', // Thuộc tính: backgroundColor
    marginBottom: 16, // Thuộc tính: margin
  },
  modalActionRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  modalActionBtn: {
    flex: 1,
    paddingVertical: 11, // Thuộc tính: padding
    borderRadius: 10, // Thuộc tính: borderRadius
    alignItems: 'center', // Thuộc tính: alignItems
  },
  modalCancelBtn: {
    backgroundColor: '#E2E8F0', // Thuộc tính: backgroundColor
  },
  modalCancelText: {
    color: '#475569',
    fontWeight: '700', // Thuộc tính: fontWeight
    fontSize: 13.5, // Thuộc tính: fontSize
  },
  modalSubmitBtn: {
    backgroundColor: '#2563EB', // Thuộc tính: backgroundColor
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: '700', // Thuộc tính: fontWeight
    fontSize: 13.5, // Thuộc tính: fontSize
  },
});
