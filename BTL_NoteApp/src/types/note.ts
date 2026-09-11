export type NoteCategory = 'Công việc' | 'Học tập' | 'Cá nhân' | 'Ý tưởng' | 'Khác';

export interface NoteColorOption {
  id: string;
  name: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
  accent: string;
}

export const NOTE_COLORS: NoteColorOption[] = [
  {
    id: 'default',
    name: 'Tiêu chuẩn',
    bgLight: '#FFFFFF',
    bgDark: '#1E222A',
    borderLight: '#E2E8F0',
    borderDark: '#2E3440',
    accent: '#64748B',
  },
  {
    id: 'yellow',
    name: 'Vàng kem',
    bgLight: '#FEF9C3',
    bgDark: '#2A2615',
    borderLight: '#FDE047',
    borderDark: '#715A0C',
    accent: '#CA8A04',
  },
  {
    id: 'green',
    name: 'Xanh lá',
    bgLight: '#DCFCE7',
    bgDark: '#14291D',
    borderLight: '#86EFAC',
    borderDark: '#166534',
    accent: '#16A34A',
  },
  {
    id: 'blue',
    name: 'Xanh dương',
    bgLight: '#E0F2FE',
    bgDark: '#12263A',
    borderLight: '#7DD3FC',
    borderDark: '#075985',
    accent: '#0284C7',
  },
  {
    id: 'purple',
    name: 'Tím nhạt',
    bgLight: '#F3E8FF',
    bgDark: '#261C36',
    borderLight: '#D8B4FE',
    borderDark: '#6B21A8',
    accent: '#9333EA',
  },
  {
    id: 'rose',
    name: 'Hồng phấn',
    bgLight: '#FFE4E6',
    bgDark: '#351821',
    borderLight: '#FDA4AF',
    borderDark: '#9F1239',
    accent: '#E11D48',
  },
];

export interface Note {
  id: string;
  title: string;
  content: string;
  category?: NoteCategory;
  colorId?: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt?: string;
}
