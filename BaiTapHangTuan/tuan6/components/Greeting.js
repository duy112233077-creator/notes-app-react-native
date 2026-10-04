import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Bài tập 1 - Functional Component Greeting
 * @param {Object} props - Thuộc tính truyền từ component cha
 * @param {string} props.name - Tên của người dùng cần hiển thị lời chào
 */
const Greeting = ({ name }) => {
  return (
    <View style={styles.card}>
      <View style={styles.avatarMini}>
        <Text style={styles.avatarText}>
          {name ? name.charAt(0).toUpperCase() : '?'}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.greetingText}>
          Xin chào, <Text style={styles.highlightName}>{name || 'Bạn'}!</Text> 👋
        </Text>
        <Text style={styles.subText}>Chào mừng bạn đến với bài học React Native</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginVertical: 6,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  avatarMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  content: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  highlightName: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default Greeting;
