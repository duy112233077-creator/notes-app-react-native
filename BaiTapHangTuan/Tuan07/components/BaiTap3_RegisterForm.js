import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

/**
 * BÀI TẬP 3 – MỨC NÂNG CAO:
 * Màn hình "Form đăng ký"
 * Các trường: Họ tên, Email, Mật khẩu, Confirm mật khẩu
 * Validate:
 *  - Không để rỗng
 *  - Email đúng format chuẩn
 *  - Mật khẩu >= 6 ký tự
 *  - Confirm mật khẩu khớp chính xác
 * Khi bấm Submit: nếu đúng hiển thị "Đăng ký thành công" (Text)
 */
const BaiTap3_RegisterForm = () => {
  // Quản lý giá trị form bằng State (Controlled Component)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Quản lý thông báo lỗi cho từng trường
  const [errors, setErrors] = useState({});

  // Trạng thái thành công khi Submit hợp lệ
  const [isSuccess, setIsSuccess] = useState(false);

  // Ẩn / Hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hàm cập nhật state khi người dùng nhập dữ liệu
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Tự động xóa lỗi của trường đang nhập nếu đã có lỗi trước đó
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }

    // Nếu đã submit thành công trước đó, khi sửa form thì reset trạng thái thành công
    if (isSuccess) {
      setIsSuccess(false);
    }
  };

  // Hàm kiểm tra hợp lệ toàn bộ form (Validation logic)
  const validateForm = () => {
    const newErrors = {};

    // 1. Kiểm tra Họ tên: không để rỗng
    if (!formData.name.trim()) {
      newErrors.name = 'Họ tên không được để trống!';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Họ tên phải có ít nhất 2 ký tự!';
    }

    // 2. Kiểm tra Email: không để rỗng và đúng format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống!';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Email không đúng định dạng (VD: example@gmail.com)!';
    }

    // 3. Kiểm tra Mật khẩu: không để rỗng và >= 6 ký tự
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống!';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có độ dài tối thiểu từ 6 ký tự!';
    }

    // 4. Kiểm tra Confirm mật khẩu: không để rỗng và phải khớp
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận lại mật khẩu!';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý khi nhấn nút Submit
  const handleSubmit = () => {
    const isValid = validateForm();
    if (isValid) {
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
  };

  // Hàm reset form về ban đầu
  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
    setIsSuccess(false);
  };

  // Điền dữ liệu mẫu hợp lệ để kiểm thử nhanh
  const fillSampleValid = () => {
    setFormData({
      name: 'Bùi Quang Duy',
      email: 'duy.bui@gmail.com',
      password: 'matkhau123',
      confirmPassword: 'matkhau123',
    });
    setErrors({});
    setIsSuccess(false);
  };

  // Điền dữ liệu mẫu có lỗi để kiểm thử validation
  const fillSampleInvalid = () => {
    setFormData({
      name: '',
      email: 'duy-sai-email',
      password: '123',
      confirmPassword: '999',
    });
    setErrors({});
    setIsSuccess(false);
  };

  return (
    <View style={styles.card}>
      {/* Header Form */}
      <View style={styles.headerRow}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagBadgeText}>BÀI TẬP 3 • FORM VALIDATION</Text>
        </View>
      </View>

      <Text style={styles.title}>Màn Hình Form Đăng Ký</Text>
      <Text style={styles.subtitle}>
        Quản lý form với State, kiểm tra tính hợp lệ dữ liệu chặt chẽ và phản hồi giao diện tức thì.
      </Text>

      {/* Thông báo thành công theo đúng yêu cầu đề bài */}
      {isSuccess && (
        <View style={styles.successBanner}>
          <View style={styles.successHeaderRow}>
            <Text style={styles.successIcon}>🎉</Text>
            {/* Đề bài yêu cầu: "nếu đúng hiển thị 'Đăng ký thành công' (Text)" */}
            <Text style={styles.successText}>Đăng ký thành công</Text>
          </View>
          <Text style={styles.successSubtext}>
            Chúc mừng bạn <Text style={styles.boldText}>{formData.name}</Text> đã tạo tài khoản thành công với email <Text style={styles.boldText}>{formData.email}</Text>.
          </Text>

          <View style={styles.successSummaryBox}>
            <Text style={styles.summaryTitle}>📋 THÔNG TIN ĐÃ XÁC THỰC:</Text>
            <Text style={styles.summaryItem}>• Họ tên: {formData.name}</Text>
            <Text style={styles.summaryItem}>• Email: {formData.email}</Text>
            <Text style={styles.summaryItem}>
              • Mật khẩu: {'•'.repeat(formData.password.length)} (Đạt tiêu chuẩn an toàn)
            </Text>
            <Text style={styles.summaryItem}>• Trạng thái: Hợp lệ 100%</Text>
          </View>

          <TouchableOpacity style={styles.btnNewRegister} onPress={handleReset}>
            <Text style={styles.btnNewRegisterText}>🔄 Đăng ký tài khoản mới</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FORM NHẬP LIỆU */}
      <View style={styles.formContainer}>
        {/* Trường 1: Họ tên */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Họ và tên <Text style={styles.requiredMark}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              errors.name ? styles.inputError : formData.name ? styles.inputValid : null,
            ]}
            placeholder="Ví dụ: Bùi Quang Duy"
            placeholderTextColor="#94A3B8"
            value={formData.name}
            onChangeText={(val) => handleChange('name', val)}
            autoCapitalize="words"
          />
          {errors.name ? (
            <Text style={styles.errorText}>⚠️ {errors.name}</Text>
          ) : null}
        </View>

        {/* Trường 2: Email */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Email <Text style={styles.requiredMark}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              errors.email ? styles.inputError : formData.email ? styles.inputValid : null,
            ]}
            placeholder="Ví dụ: student@gmail.com"
            placeholderTextColor="#94A3B8"
            value={formData.email}
            onChangeText={(val) => handleChange('email', val)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email ? (
            <Text style={styles.errorText}>⚠️ {errors.email}</Text>
          ) : null}
        </View>

        {/* Trường 3: Mật khẩu */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Mật khẩu (≥ 6 ký tự) <Text style={styles.requiredMark}>*</Text>
          </Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                errors.password ? styles.inputError : formData.password ? styles.inputValid : null,
              ]}
              placeholder="Nhập mật khẩu an toàn..."
              placeholderTextColor="#94A3B8"
              value={formData.password}
              onChangeText={(val) => handleChange('password', val)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeBtnText}>{showPassword ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>⚠️ {errors.password}</Text>
          ) : null}
        </View>

        {/* Trường 4: Confirm Mật khẩu */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Xác nhận lại mật khẩu <Text style={styles.requiredMark}>*</Text>
          </Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                errors.confirmPassword
                  ? styles.inputError
                  : formData.confirmPassword
                  ? styles.inputValid
                  : null,
              ]}
              placeholder="Nhập lại chính xác mật khẩu..."
              placeholderTextColor="#94A3B8"
              value={formData.confirmPassword}
              onChangeText={(val) => handleChange('confirmPassword', val)}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eyeBtnText}>
                {showConfirmPassword ? '👁️' : '🙈'}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>⚠️ {errors.confirmPassword}</Text>
          ) : null}
        </View>

        {/* Nút bấm Submit chính */}
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.btnSubmitText}>🚀 Gửi Đăng Ký (Submit)</Text>
        </TouchableOpacity>

        {/* Nhóm nút hỗ trợ kiểm thử */}
        <View style={styles.testActionsRow}>
          <TouchableOpacity
            style={styles.btnSampleValid}
            onPress={fillSampleValid}
          >
            <Text style={styles.btnSampleValidText}>⚡ Điền form chuẩn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSampleInvalid}
            onPress={fillSampleInvalid}
          >
            <Text style={styles.btnSampleInvalidText}>⚠️ Thử form lỗi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnReset} onPress={handleReset}>
            <Text style={styles.btnResetText}>🗑️ Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bảng tóm tắt các tiêu chí Validation */}
      <View style={styles.rulesCard}>
        <Text style={styles.rulesTitle}>📌 Tiêu chí kiểm tra hợp lệ (Validation Checklist):</Text>
        <Text style={styles.ruleItem}>
          • <Text style={styles.boldText}>Rỗng:</Text> Họ tên, email, mật khẩu và confirm đều không được để trống.
        </Text>
        <Text style={styles.ruleItem}>
          • <Text style={styles.boldText}>Email format:</Text> Bắt buộc đúng định dạng email tiêu chuẩn có @ và tên miền.
        </Text>
        <Text style={styles.ruleItem}>
          • <Text style={styles.boldText}>Độ dài mật khẩu:</Text> Mật khẩu tối thiểu phải từ 6 ký tự trở lên.
        </Text>
        <Text style={styles.ruleItem}>
          • <Text style={styles.boldText}>Khớp xác nhận:</Text> Confirm mật khẩu phải trùng khớp hoàn toàn với mật khẩu.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginVertical: 10,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  tagBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  formContainer: {
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  requiredMark: {
    color: '#DC2626',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#0F172A',
  },
  inputValid: {
    borderColor: '#94A3B8',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 45,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeBtnText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 2,
  },
  btnSubmit: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  btnSubmitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  testActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  btnSampleValid: {
    flex: 1.2,
    backgroundColor: '#EFF6FF',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  btnSampleValidText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
  },
  btnSampleInvalid: {
    flex: 1.2,
    backgroundColor: '#FFF7ED',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  btnSampleInvalidText: {
    color: '#EA580C',
    fontSize: 12,
    fontWeight: '600',
  },
  btnReset: {
    flex: 0.8,
    backgroundColor: '#F1F5F9',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  btnResetText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  successBanner: {
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  successHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  successIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  successText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#047857',
  },
  successSubtext: {
    fontSize: 13,
    color: '#065F46',
    lineHeight: 18,
    marginBottom: 12,
  },
  successSummaryBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
    marginBottom: 6,
  },
  summaryItem: {
    fontSize: 12,
    color: '#064E3B',
    lineHeight: 18,
  },
  btnNewRegister: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnNewRegisterText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  rulesCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 6,
  },
  rulesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  ruleItem: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
});

export default BaiTap3_RegisterForm;
