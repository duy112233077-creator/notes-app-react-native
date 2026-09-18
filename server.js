const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001; // Cổng mặc định 3001

app.use(cors());
app.use(express.json());

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
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

    // 3. Tạo bảng notes nếu chưa có (có cột is_locked)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS \`notes\` (
        \`id\` VARCHAR(100) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`content\` TEXT,
        \`category\` VARCHAR(50) DEFAULT 'Khác',
        \`color_id\` VARCHAR(30) DEFAULT 'yellow',
        \`is_pinned\` TINYINT(1) DEFAULT 0,
        \`is_locked\` TINYINT(1) DEFAULT 0,
        \`created_at\` VARCHAR(50),
        \`updated_at\` VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createTableQuery);

    // 4. Migration: Tự động bổ sung cột is_locked nếu bảng cũ đã tồn tại mà chưa có cột này
    try {
      await pool.query(
        'ALTER TABLE `notes` ADD COLUMN `is_locked` TINYINT(1) DEFAULT 0 AFTER `is_pinned`;'
      );
      console.log('✅ [MySQL Migration] Đã bổ sung cột "is_locked" vào bảng "notes".');
    } catch (migErr) {
      // Mã lỗi ER_DUP_FIELDNAME (1060): Cột đã tồn tại, an toàn bỏ qua
    }

    console.log(`✅ [MySQL] Kết nối thành công tới database "${DB_NAME}" trên XAMPP!`);
    console.log(`✅ [MySQL] Bảng "notes" đã sẵn sàng phục vụ.`);
  } catch (error) {
    console.error('❌ [MySQL] Lỗi kết nối CSDL XAMPP:', error.message);
  }
}

// 1. Kiểm tra trạng thái server & MySQL
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    databaseReady: Boolean(pool),
    serverTime: new Date().toISOString(),
  });
});

// 2. Lấy toàn bộ danh sách ghi chú
app.get('/api/notes', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({
        error: 'Cơ sở dữ liệu MySQL chưa sẵn sàng. Vui lòng kiểm tra XAMPP!',
      });
    }
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
      isLocked: Boolean(r.is_locked),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
    res.json(notes);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách ghi chú:', err);
    res.status(500).json({ error: 'Lỗi máy chủ: ' + err.message });
  }
});

// 3. Thêm mới hoặc cập nhật 1 ghi chú (UPSERT)
app.post('/api/notes', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({
        error: 'Cơ sở dữ liệu MySQL chưa sẵn sàng. Vui lòng kiểm tra XAMPP!',
      });
    }
    const { id, title, content, category, colorId, isPinned, isLocked, createdAt, updatedAt } = req.body;

    // Validate dữ liệu đầu vào
    if (!id || typeof id !== 'string' || !id.trim()) {
      return res.status(400).json({ error: 'Mã ghi chú (id) không hợp lệ hoặc bị thiếu.' });
    }
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Tiêu đề ghi chú không được để trống.' });
    }

    const query = `
      INSERT INTO \`notes\` (\`id\`, \`title\`, \`content\`, \`category\`, \`color_id\`, \`is_pinned\`, \`is_locked\`, \`created_at\`, \`updated_at\`)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`title\` = VALUES(\`title\`),
        \`content\` = VALUES(\`content\`),
        \`category\` = VALUES(\`category\`),
        \`color_id\` = VALUES(\`color_id\`),
        \`is_pinned\` = VALUES(\`is_pinned\`),
        \`is_locked\` = VALUES(\`is_locked\`),
        \`updated_at\` = VALUES(\`updated_at\`);
    `;

    const now = new Date().toISOString();
    await pool.query(query, [
      id.trim(),
      title.trim(),
      content ? String(content).trim() : '',
      category || 'Khác',
      colorId || 'yellow',
      isPinned ? 1 : 0,
      isLocked ? 1 : 0,
      createdAt || now,
      updatedAt || now,
    ]);

    res.json({
      success: true,
      message: 'Đã lưu ghi chú vào MySQL thành công!',
      noteId: id,
    });
  } catch (err) {
    console.error('Lỗi khi lưu ghi chú:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi lưu ghi chú: ' + err.message });
  }
});

// 4. Cập nhật cụ thể 1 ghi chú (PUT)
app.put('/api/notes/:id', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({
        error: 'Cơ sở dữ liệu MySQL chưa sẵn sàng. Vui lòng kiểm tra XAMPP!',
      });
    }
    const { id } = req.params;
    const { title, content, category, colorId, isPinned, isLocked, updatedAt } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Tiêu đề ghi chú không được để trống.' });
    }

    const now = updatedAt || new Date().toISOString();
    const [result] = await pool.query(
      `UPDATE \`notes\` SET
        \`title\` = ?,
        \`content\` = ?,
        \`category\` = ?,
        \`color_id\` = ?,
        \`is_pinned\` = ?,
        \`is_locked\` = ?,
        \`updated_at\` = ?
      WHERE \`id\` = ?`,
      [
        title.trim(),
        content ? String(content).trim() : '',
        category || 'Khác',
        colorId || 'yellow',
        isPinned ? 1 : 0,
        isLocked ? 1 : 0,
        now,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Không tìm thấy ghi chú có mã ${id} để cập nhật.` });
    }

    res.json({ success: true, message: `Đã cập nhật ghi chú ${id} thành công!` });
  } catch (err) {
    console.error('Lỗi khi cập nhật ghi chú:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật: ' + err.message });
  }
});

// 5. Xóa 1 ghi chú theo id
app.delete('/api/notes/:id', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({
        error: 'Cơ sở dữ liệu MySQL chưa sẵn sàng. Vui lòng kiểm tra XAMPP!',
      });
    }
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM `notes` WHERE `id` = ?', [id]);

    res.json({
      success: true,
      message: `Đã xóa ghi chú ${id} khỏi MySQL!`,
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    console.error('Lỗi khi xóa ghi chú:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi xóa ghi chú: ' + err.message });
  }
});

// 6. Đồng bộ an toàn (Chỉ upsert các note được gửi lên, KHÔNG xóa dữ liệu server của máy khác)
app.post('/api/notes/sync', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({
        error: 'Cơ sở dữ liệu MySQL chưa sẵn sàng. Vui lòng kiểm tra XAMPP!',
      });
    }
    const notes = req.body;
    if (!Array.isArray(notes)) {
      return res.status(400).json({ error: 'Dữ liệu gửi lên phải là một danh sách ghi chú.' });
    }

    // Nếu mảng rỗng: TUYỆT ĐỐI KHÔNG XÓA TOÀN BỘ BẢNG (khắc phục bug mất sạch dữ liệu)
    if (notes.length === 0) {
      return res.json({
        success: true,
        count: 0,
        message: 'Danh sách rỗng, bảo vệ an toàn dữ liệu trên MySQL.',
      });
    }

    // Upsert từng ghi chú an toàn
    for (const note of notes) {
      if (!note.id || !note.title) continue;
      const query = `
        INSERT INTO \`notes\` (\`id\`, \`title\`, \`content\`, \`category\`, \`color_id\`, \`is_pinned\`, \`is_locked\`, \`created_at\`, \`updated_at\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          \`title\` = VALUES(\`title\`),
          \`content\` = VALUES(\`content\`),
          \`category\` = VALUES(\`category\`),
          \`color_id\` = VALUES(\`color_id\`),
          \`is_pinned\` = VALUES(\`is_pinned\`),
          \`is_locked\` = VALUES(\`is_locked\`),
          \`updated_at\` = VALUES(\`updated_at\`);
      `;
      await pool.query(query, [
        note.id,
        note.title,
        note.content || '',
        note.category || 'Khác',
        note.colorId || 'yellow',
        note.isPinned ? 1 : 0,
        note.isLocked ? 1 : 0,
        note.createdAt || new Date().toISOString(),
        note.updatedAt || new Date().toISOString(),
      ]);
    }

    res.json({ success: true, count: notes.length });
  } catch (err) {
    console.error('Lỗi khi đồng bộ danh sách:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi đồng bộ: ' + err.message });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 [Server] Đang chạy tại http://localhost:${PORT}`);
  await initDatabase();
});
