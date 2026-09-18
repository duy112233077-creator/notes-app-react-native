import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform, Share } from 'react-native';
import { Note } from '@/types/note';

export const ExportService = {
  // 1. Chia sẻ dưới dạng Văn bản (Text)
  async shareAsText(note: Note): Promise<void> {
    const textContent = `📌 ${note.title || 'Ghi chú'}\n📂 Danh mục: ${note.category || 'Khác'}\n🗓️ Ngày tạo: ${new Date(note.createdAt).toLocaleString('vi-VN')}\n----------------------------------------\n\n${note.content || ''}`;
    try {
      await Share.share({
        title: note.title,
        message: textContent,
      });
    } catch (err) {
      console.error('Lỗi khi chia sẻ văn bản:', err);
    }
  },

  // 2. Chia sẻ dưới dạng Thẻ Hình ảnh / Card Layout
  async shareAsImage(note: Note): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              margin: 0;
              padding: 40px;
              background: #F8FAFC;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .card {
              width: 520px;
              background: #FFFFFF;
              border-radius: 24px;
              padding: 36px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
              border: 2px solid #E2E8F0;
            }
            .badge {
              display: inline-block;
              background: #EFF6FF;
              color: #2563EB;
              font-weight: 800;
              font-size: 13px;
              padding: 6px 14px;
              border-radius: 20px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 16px;
            }
            .title {
              font-size: 24px;
              font-weight: 800;
              color: #0F172A;
              margin: 0 0 16px 0;
              line-height: 1.3;
            }
            .content {
              font-size: 16px;
              color: #334155;
              line-height: 1.6;
              white-space: pre-wrap;
              margin-bottom: 28px;
            }
            .footer {
              border-top: 1px solid #F1F5F9;
              padding-top: 16px;
              font-size: 13px;
              color: #94A3B8;
              display: flex;
              justify-content: space-between;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">${note.category || 'Ghi chú'}</div>
            <h2 class="title">${note.title || 'Không tên'}</h2>
            <div class="content">${note.content || '(Chưa có nội dung)'}</div>
            <div class="footer">
              <span>🌟 BTL NoteApp</span>
              <span>${new Date(note.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      if (Platform.OS === 'web') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.print();
        }
        return;
      }

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Chia sẻ thẻ ghi chú: ${note.title}`,
        });
      }
    } catch (err) {
      console.error('Lỗi khi chia sẻ hình ảnh:', err);
      throw err;
    }
  },

  // 3. Xuất / Chia sẻ ghi chú ra định dạng PDF
  async exportToPDF(note: Note): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${note.title}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              padding: 40px;
              color: #1e293b;
              line-height: 1.6;
            }
            .header {
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .title {
              font-size: 26px;
              font-weight: bold;
              color: #0f172a;
              margin: 0 0 8px 0;
            }
            .meta {
              font-size: 13px;
              color: #64748b;
            }
            .badge {
              display: inline-block;
              background-color: #eff6ff;
              color: #2563eb;
              padding: 4px 10px;
              border-radius: 12px;
              font-weight: 600;
              margin-right: 8px;
            }
            .content {
              font-size: 16px;
              white-space: pre-wrap;
              color: #334155;
            }
            .attachments {
              margin-top: 32px;
              padding-top: 16px;
              border-top: 1px dashed #cbd5e1;
            }
            .footer {
              margin-top: 40px;
              font-size: 11px;
              color: #94a3b8;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">${note.title}</h1>
            <div class="meta">
              <span class="badge">${note.category || 'Khác'}</span>
              <span>Tạo ngày: ${new Date(note.createdAt).toLocaleString('vi-VN')}</span>
            </div>
          </div>
          <div class="content">${note.content || '(Ghi chú chưa có nội dung)'}</div>
          ${
            note.attachments && note.attachments.length > 0
              ? `
            <div class="attachments">
              <h3>📎 Tệp đính kèm (${note.attachments.length})</h3>
              <ul>
                ${note.attachments.map((a) => `<li>${a.name} (${a.type.toUpperCase()})</li>`).join('')}
              </ul>
            </div>
          `
              : ''
          }
          <div class="footer">Xuất từ BTL NoteApp vào ${new Date().toLocaleString('vi-VN')}</div>
        </body>
      </html>
    `;

    try {
      if (Platform.OS === 'web') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.print();
        }
        return;
      }

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: `Xuất ghi chú: ${note.title}`,
        });
      }
    } catch (err) {
      console.error('Lỗi khi xuất PDF:', err);
      throw err;
    }
  },

  // 4. Xuất ghi chú ra định dạng TXT hoặc Markdown
  async exportToFile(note: Note, format: 'txt' | 'md'): Promise<void> {
    let fileContent = '';
    const dateStr = new Date(note.createdAt).toLocaleString('vi-VN');

    if (format === 'md') {
      fileContent = `# ${note.title}\n\n`;
      fileContent += `**Danh mục:** ${note.category || 'Khác'} | **Ngày tạo:** ${dateStr}\n\n`;
      if (note.tags && note.tags.length > 0) {
        fileContent += `**Tags:** ${note.tags.join(', ')}\n\n`;
      }
      fileContent += `---\n\n${note.content || ''}\n`;
    } else {
      fileContent = `TIÊU ĐỀ: ${note.title}\n`;
      fileContent += `DANH MỤC: ${note.category || 'Khác'}\n`;
      fileContent += `NGÀY TẠO: ${dateStr}\n`;
      fileContent += `----------------------------------------\n\n`;
      fileContent += `${note.content || ''}\n`;
    }

    const filename = `${note.title.replace(/[^a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '_')}.${format}`;

    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      const dir = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || '';
      const fileUri = `${dir}${filename}`;
      await FileSystem.writeAsStringAsync(fileUri, fileContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          dialogTitle: `Xuất tệp ${format.toUpperCase()}: ${note.title}`,
        });
      }
    } catch (err) {
      console.error(`Lỗi khi xuất tệp ${format}:`, err);
      throw err;
    }
  },
};
