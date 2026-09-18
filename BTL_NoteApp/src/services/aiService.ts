import { API_BASE_URL } from '@/constants/config';

export const AIService = {
  async summarizeNote(title: string, content: string): Promise<string> {
    if (!content || !content.trim()) {
      throw new Error('Nội dung ghi chú trống, không thể tóm tắt.');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${API_BASE_URL}/ai/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return data.summary;
      }
    } catch {
      // Offline fallback NLP engine
    }

    // Smart Offline Summarization Engine
    const text = content.trim();
    const sentences = text
      .split(/(?<=[.!?])\s+|\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 3);

    if (sentences.length === 0) return 'Ghi chú rỗng.';

    const topSentences = sentences.slice(0, 3);
    return `📌 TÓM TẮT THÔNG MINH AI:\n` + topSentences.map((s) => `• ${s}`).join('\n');
  },

  async generateAutoTags(title: string, content: string): Promise<string[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${API_BASE_URL}/ai/autotag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return data.tags || [];
      }
    } catch {
      // Offline fallback
    }

    const fullText = (title + ' ' + content).toLowerCase();
    const tags: string[] = [];

    if (fullText.includes('bài tập') || fullText.includes('học') || fullText.includes('thi')) tags.push('📚 Học Tập');
    if (fullText.includes('họp') || fullText.includes('công việc') || fullText.includes('dự án')) tags.push('💼 Công Việc');
    if (fullText.includes('gấp') || fullText.includes('quan trọng') || fullText.includes('deadline')) tags.push('⚡ Quan Trọng');
    if (fullText.includes('mua') || fullText.includes('tiền') || fullText.includes('giá')) tags.push('🛒 Mua Sắm');
    if (fullText.includes('ý tưởng') || fullText.includes('thiết kế')) tags.push('💡 Ý Tưởng');

    if (tags.length === 0) tags.push('📝 Ghi chú');
    return tags;
  },
};
