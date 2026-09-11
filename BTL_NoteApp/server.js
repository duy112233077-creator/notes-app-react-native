const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3001; // Sử dụng cổng 3001 để tránh xung đột

app.use(cors());
app.use(express.json());

const DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
};

const DB_NAME = 'notes_app_db';
let pool;

async function initDatabase() {
  try {
    // 1. Kết nối ban đầu để kiểm tra và tạo database nếu chưa có
    const connection = await mysql.createConnection(DB_CONFIG);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await connection.end();

    // 2. Tạo Pool kết nối thẳng vào database notes_app_db
    pool = mysql.createPool({
      ...DB_CONFIG,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // 3. Tạo bảng notes nếu chưa có
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS \`notes\` (
        \`id\` VARCHAR(100) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`content\` TEXT,
        \`category\` VARCHAR(50) DEFAULT 'Khác',
        \`color_id\` VARCHAR(30) DEFAULT 'yellow',
        \`is_pinned\` TINYINT(1) DEFAULT 0,
        \`created_at\` VARCHAR(50),
        \`updated_at\` VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createTableQuery);

    console.log(`✅ [MySQL] Kết nối thành công tới database "${DB_NAME}" trên XAMPP!`);
    console.log(`✅ [MySQL] Bảng "notes" đã sẵn sàng.`);
  } catch (error) {
    console.error('❌ [MySQL] Lỗi kết nối CSDL XAMPP:', error.message);
  }
}

// 1. Kiểm tra trạng thái server & MySQL
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// 2. Lấy toàn bộ danh sách ghi chú
app.get('/api/notes', async (req, res) => {
  try {
    if (!pool) return res.status(503).json({ error: 'Database chưa sẵn sàng' });
    const [rows] = await pool.query(
      'SELECT * FROM `notes` ORDER BY `is_pinned` DESC, `updated_at` DESC'
    );
    const notes = rows.map((r) => ({
      id: r.id,
      title: r.title,
      content: r.content || '',
      category: r.category || 'Khác',
      colorId: r.color_id || 'yellow',
      isPinned: Boolean(r.is_pinned),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
    res.json(notes);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách ghi chú:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Thêm mới hoặc cập nhật 1 ghi chú
app.post('/api/notes', async (req, res) => {
  try {
    if (!pool) return res.status(503).json({ error: 'Database chưa sẵn sàng' });
    const { id, title, content, category, colorId, isPinned, createdAt, updatedAt } = req.body;
    if (!id || !title) {
      return res.status(400).json({ error: 'Thiếu thông tin id hoặc title' });
    }

    const query = `
      INSERT INTO \`notes\` (\`id\`, \`title\`, \`content\`, \`category\`, \`color_id\`, \`is_pinned\`, \`created_at\`, \`updated_at\`)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`title\` = VALUES(\`title\`),
        \`content\` = VALUES(\`content\`),
        \`category\` = VALUES(\`category\`),
        \`color_id\` = VALUES(\`color_id\`),
        \`is_pinned\` = VALUES(\`is_pinned\`),
        \`updated_at\` = VALUES(\`updated_at\`);
    `;

    await pool.query(query, [
      id,
      title,
      content || '',
      category || 'Khác',
      colorId || 'yellow',
      isPinned ? 1 : 0,
      createdAt || new Date().toISOString(),
      updatedAt || new Date().toISOString(),
    ]);

    res.json({ success: true, message: 'Đã lưu ghi chú vào MySQL thành công!' });
  } catch (err) {
    console.error('Lỗi khi lưu ghi chú:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Đồng bộ danh sách ghi chú (hỗ trợ cả thêm, sửa, và xóa các bản ghi không còn trong danh sách)
app.post('/api/notes/sync', async (req, res) => {
  try {
    if (!pool) return res.status(503).json({ error: 'Database chưa sẵn sàng' });
    const notes = req.body;
    if (!Array.isArray(notes)) {
      return res.status(400).json({ error: 'Dữ liệu phải là mảng ghi chú' });
    }

    if (notes.length === 0) {
      // Nếu danh sách rỗng, xóa hết bảng
      await pool.query('DELETE FROM `notes`');
      return res.json({ success: true, count: 0 });
    }

    // Xóa các ghi chú trong MySQL nếu người dùng đã xóa trên app
    const activeIds = notes.map((n) => n.id);
    await pool.query('DELETE FROM `notes` WHERE `id` NOT IN (?)', [activeIds]);

    // Thêm mới hoặc cập nhật các ghi chú hiện có
    for (const note of notes) {
      const query = `
        INSERT INTO \`notes\` (\`id\`, \`title\`, \`content\`, \`category\`, \`color_id\`, \`is_pinned\`, \`created_at\`, \`updated_at\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          \`title\` = VALUES(\`title\`),
          \`content\` = VALUES(\`content\`),
          \`category\` = VALUES(\`category\`),
          \`color_id\` = VALUES(\`color_id\`),
          \`is_pinned\` = VALUES(\`is_pinned\`),
          \`updated_at\` = VALUES(\`updated_at\`);
      `;
      await pool.query(query, [
        note.id,
        note.title,
        note.content || '',
        note.category || 'Khác',
        note.colorId || 'yellow',
        note.isPinned ? 1 : 0,
        note.createdAt || new Date().toISOString(),
        note.updatedAt || new Date().toISOString(),
      ]);
    }

    res.json({ success: true, count: notes.length });
  } catch (err) {
    console.error('Lỗi khi đồng bộ danh sách:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Xóa ghi chú theo id
app.delete('/api/notes/:id', async (req, res) => {
  try {
    if (!pool) return res.status(503).json({ error: 'Database chưa sẵn sàng' });
    const { id } = req.params;
    await pool.query('DELETE FROM `notes` WHERE `id` = ?', [id]);
    res.json({ success: true, message: `Đã xóa ghi chú ${id} khỏi MySQL!` });
  } catch (err) {
    console.error('Lỗi khi xóa ghi chú:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 [Server] Đang chạy tại http://localhost:${PORT}`);
  await initDatabase();
});
