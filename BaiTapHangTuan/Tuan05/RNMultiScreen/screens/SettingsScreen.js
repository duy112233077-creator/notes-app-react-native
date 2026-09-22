import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Switch } from 'react-native';

export default function SettingsScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.iconText}>⚙️</Text>
          <Text style={styles.title}>Cài Đặt (Settings)</Text>
          <Text style={styles.subtitle}>Quản lý tùy chọn ứng dụng của bạn</Text>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>🔔 Thởng báo push</Text>
            <Switch
              trackColor={{ false: '#CBD5E1', true: '#818CF8' }}
              thumbColor={notificationsEnabled ? '#4F46E5' : '#F1F5F9'}
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>🌙 Chế độ tối (Dark Mode)</Text>
            <Switch
              trackColor={{ false: '#CBD5E1', true: '#818CF8' }}
              thumbColor={darkModeEnabled ? '#4F46E5' : '#F1F5F9'}
              onValueChange={setDarkModeEnabled}
              value={darkModeEnabled}
            />
          </View>
        </View>

        <View style={styles.versionCard}>
          <Text style={styles.versionTitle}>Thông tin hệ thống</Text>
          <Text style={styles.versionText}>Phiên bản App: 1.0.0 (Lab 02)</Text>
          <Text style={styles.versionText}>Framework: React Native + Expo</Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            activeOpacity={0.8}
            onPress={() => navigation.popToTop()}
          >
            <Text style={styles.primaryButtonText}>🏠 Trở về Trang Chủ (Home)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>⬅️ Quay lại trang trước</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  versionCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
  },
  versionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  versionText: {
    fontSize: 13,
    color: '#64748B',
    marginVertical: 2,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#0EA5E9',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#E2E8F0',
  },
  backButtonText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '600',
  },
});
