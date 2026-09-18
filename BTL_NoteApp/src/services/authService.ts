import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { User, AuthSession } from '@/types/note';
import { API_BASE_URL } from '@/constants/config';

const AUTH_TOKEN_KEY = '@noteapp_auth_token_v1';
const AUTH_USER_KEY = '@noteapp_auth_user_v1';

export const AuthService = {
  async getStoredSession(): Promise<AuthSession | null> {
    try {
      let token: string | null = null;
      let userJson: string | null = null;

      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        token = window.localStorage.getItem(AUTH_TOKEN_KEY);
        userJson = window.localStorage.getItem(AUTH_USER_KEY);
      } else {
        token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        userJson = await AsyncStorage.getItem(AUTH_USER_KEY);
      }

      if (token && userJson) {
        const user: User = JSON.parse(userJson);
        return { token, user };
      }
      return null;
    } catch {
      return null;
    }
  },

  async setSession(session: AuthSession): Promise<void> {
    try {
      const userJson = JSON.stringify(session.user);
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, session.token);
        window.localStorage.setItem(AUTH_USER_KEY, userJson);
      }
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, session.token);
      await AsyncStorage.setItem(AUTH_USER_KEY, userJson);
    } catch (err) {
      console.error('Lỗi lưu phiên đăng nhập:', err);
    }
  },

  async clearSession(): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        window.localStorage.removeItem(AUTH_USER_KEY);
      }
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(AUTH_USER_KEY);
    } catch (err) {
      console.error('Lỗi xóa phiên đăng nhập:', err);
    }
  },

  async register(name: string, email: string, password: string): Promise<AuthSession> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Đăng ký không thành công.');
    }

    const session: AuthSession = { token: data.token, user: data.user };
    await this.setSession(session);
    return session;
  },

  async login(email: string, password: string): Promise<AuthSession> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Đăng nhập không thành công.');
    }

    const session: AuthSession = { token: data.token, user: data.user };
    await this.setSession(session);
    return session;
  },

  async getAuthHeaders(): Promise<Record<string, string>> {
    const session = await this.getStoredSession();
    if (session && session.token) {
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`,
      };
    }
    return { 'Content-Type': 'application/json' };
  },
};
