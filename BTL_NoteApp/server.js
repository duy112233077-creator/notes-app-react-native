const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'btl_noteapp_secret_key_2026';

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

// Middleware xác thực JWT Token (Optional hoặc Strict)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
}

function requireAuth(req, res, next) {
  authenticateToken(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ error: 'Bạn cần đăng nhập để thực hiện thao tác này.' });
    }
    next();
  });
}

async function initDatabase() {
  try {
    // 1. Tạo database nếu chưa tồn tại
    const connection = await mysql.createConnection(DB_CONFIG);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await connection.end();

    // 2. Tạo Connection Pool
    pool = mysql.createPool({
      ...DB_CONFIG,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // 3. Tạo bảng users nếu chưa có
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` VARCHAR(100) PRIMARY KEY,
        \`name\` VARCHAR(150) NOT NULL,
        \`email\` VARCHAR(191) NOT NULL UNIQUE,
        \`password\` VARCHAR(255) NOT NULL,
        \`created_at\` VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createUsersTableQuery);

    // 4. Tạo bảng notes nếu chưa có
    const createNotesTableQuery = `
      CREATE TABLE IF NOT EXISTS \`notes\` (
        \`id\` VARCHAR(100) PRIMARY KEY,
        \`user_id\` VARCHAR(100) DEFAULT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`content\` TEXT,
        \`category\` VARCHAR(50) DEFAULT 'Khác',
        \`color_id\` VARCHAR(30) DEFAULT 'yellow',
        \`is_pinned\` TINYINT(1) DEFAULT 0,
        \`is_locked\` TINYINT(1) DEFAULT 0,
        \`attachments\` LONGTEXT DEFAULT NULL,
        \`reminder_at\` VARCHAR(50) DEFAULT NULL,
        \`share_code\` VARCHAR(100) DEFAULT NULL,
        \`collaborators\` LONGTEXT DEFAULT NULL,
        \`created_at\` VARCHAR(50),
        \`updated_at\` VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createNotesTableQuery);

    // 5. Run Migrations an toàn bổ sung cột mới cho DB cũ
    const safeAddColumn = async (colName, colDef) => {
      try {
        await pool.query(`ALTER TABLE \`notes\` ADD COLUMN \`${colName}\` ${colDef};`);
        console.log(`✅ [MySQL Migration] Đã bổ sung cột "${colName}" vào bảng "notes".`);
      } catch (err) {
        // Cột đã tồn tại -> An toàn bỏ qua
      }
    };

    await safeAddColumn('user_id', 'VARCHAR(100) DEFAULT NULL');
    await safeAddColumn('is_locked', 'TINYINT(1) DEFAULT 0');
    await safeAddColumn('attachments', 'LONGTEXT DEFAULT NULL');
    await safeAddColumn('reminder_at', 'VARCHAR(50) DEFAULT NULL');
    await safeAddColumn('share_code', 'VARCHAR(100) DEFAULT NULL');
    await safeAddColumn('collaborators', 'LONGTEXT DEFAULT NULL');

    console.log(`✅ [MySQL] Kết nối thành công tới CSDL "${DB_NAME}" trên XAMPP!`);
  } catch (error) {
    console.error('❌ [MySQL] Lỗi khởi tạo CSDL XAMPP:', error.message);
  }
}

// ----------------------------------------------------
// AUTH API
// ----------------------------------------------------

// 1. Đăng ký tài khoản mới
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    if (password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu phải có tối thiểu 6 ký tự.' });
    }

    // Kiểm tra trùng email
    const [existing] = await pool.query('SELECT id FROM `users` WHERE `email` = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email này đã được đăng ký tài khoản.' });
    }

    const userId = 'user-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();

    await pool.query(
      'INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES (?, ?, ?, ?, ?)',
      [userId, name.trim(), cleanEmail, hashedPassword, createdAt]
    );

    const userObj = { id: userId, name: name.trim(), email: cleanEmail, createdAt };
    const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      user: userObj,
      token,
    });
  } catch (err) {
    console.error('Lỗi khi đăng ký:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng ký: ' + err.message });
  }
});

// 2. Đăng nhập tài khoản
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền Email và Mật khẩu.' });
    }
    const cleanEmail = email.trim().toLowerCase();

    const [rows] = await pool.query('SELECT * FROM `users` WHERE `email` = ?', [cleanEmail]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
    }

    const userObj = { id: user.id, name: user.name, email: user.email, createdAt: user.created_at };
    const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: userObj,
      token,
    });
  } catch (err) {
    console.error('Lỗi khi đăng nhập:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng nhập: ' + err.message });
  }
});

// 3. Lấy thông tin user hiện tại
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// ----------------------------------------------------
// NOTES API
// ----------------------------------------------------

// Helper parse note record
function parseNoteRecord(r) {
  let attachments = [];
  let collaborators = [];
  try {
    if (r.attachments) attachments = JSON.parse(r.attachments);
  } catch (e) {}
  try {
    if (r.collaborators) collaborators = JSON.parse(r.collaborators);
  } catch (e) {}

  return {
    id: r.id,
    userId: r.user_id || undefined,
    title: r.title,
    content: r.content || '',
    category: r.category || 'Khác',
    colorId: r.color_id || 'yellow',
    isPinned: Boolean(r.is_pinned),
    isLocked: Boolean(r.is_locked),
    attachments,
    reminderAt: r.reminder_at || undefined,
    shareCode: r.share_code || undefined,
    collaborators,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// 1. Lấy danh sách ghi chú (Hỗ trợ phân quyền người dùng & ghi chú chia sẻ)
app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ error: 'CSDL MySQL chưa sẵn sàng.' });
    }

    let query = 'SELECT * FROM `notes` ';
    let params = [];

    if (req.user) {
      // Đã đăng nhập -> Lấy ghi chú sở hữu + ghi chú công khai + ghi chú được hợp tác chia sẻ
      query += 'WHERE `user_id` = ? OR `user_id` IS NULL OR `collaborators` LIKE ? ';
      params.push(req.user.id, `%${req.user.email}%`);
    } else {
      // Khách chưa đăng nhập -> Lấy ghi chú vô danh (guest/public)
      query += 'WHERE `user_id` IS NULL ';
    }

    query += 'ORDER BY `is_pinned` DESC, `updated_at` DESC';
    const [rows] = await pool.query(query, params);
    const notes = rows.map(parseNoteRecord);
    res.json(notes);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách ghi chú:', err);
    res.status(500).json({ error: 'Lỗi máy chủ: ' + err.message });
  }
});

// 2. Lấy 1 ghi chú qua mã chia sẻ (Share Code / QR)
app.get('/api/notes/shared/:shareCode', async (req, res) => {
  try {
    const { shareCode } = req.params;
    const [rows] = await pool.query('SELECT * FROM `notes` WHERE `share_code` = ?', [shareCode]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy ghi chú với mã chia sẻ này.' });
    }
    res.json(parseNoteRecord(rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi tải ghi chú chia sẻ: ' + err.message });
  }
});

// 3. Thêm mới / Cập nhật Ghi chú (UPSERT)
app.post('/api/notes', authenticateToken, async (req, res) => {
  try {
    if (!pool) return res.status(503).json({ error: 'CSDL MySQL chưa sẵn sàng.' });

    const {
      id,
      userId,
      title,
      content,
      category,
      colorId,
      isPinned,
      isLocked,
      attachments,
      reminderAt,
      shareCode,
      collaborators,
      createdAt,
      updatedAt,
    } = req.body;

    if (!id || typeof id !== 'string' || !id.trim()) {
      return res.status(400).json({ error: 'Mã ghi chú (id) không hợp lệ.' });
    }
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Tiêu đề ghi chú không được để trống.' });
    }

    const currentUserId = req.user ? req.user.id : userId || null;
    const attachmentsJson = Array.isArray(attachments) ? JSON.stringify(attachments) : null;
    const collaboratorsJson = Array.isArray(collaborators) ? JSON.stringify(collaborators) : null;
    const now = new Date().toISOString();

    const query = `
      INSERT INTO \`notes\` (
        \`id\`, \`user_id\`, \`title\`, \`content\`, \`category\`, \`color_id\`, 
        \`is_pinned\`, \`is_locked\`, \`attachments\`, \`reminder_at\`, \`share_code\`, 
        \`collaborators\`, \`created_at\`, \`updated_at\`
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`user_id\` = COALESCE(VALUES(\`user_id\`), \`user_id\`),
        \`title\` = VALUES(\`title\`),
        \`content\` = VALUES(\`content\`),
        \`category\` = VALUES(\`category\`),
        \`color_id\` = VALUES(\`color_id\`),
        \`is_pinned\` = VALUES(\`is_pinned\`),
        \`is_locked\` = VALUES(\`is_locked\`),
        \`attachments\` = VALUES(\`attachments\`),
        \`reminder_at\` = VALUES(\`reminder_at\`),
        \`share_code\` = VALUES(\`share_code\`),
        \`collaborators\` = VALUES(\`collaborators\`),
        \`updated_at\` = VALUES(\`updated_at\`);
    `;

    await pool.query(query, [
      id.trim(),
      currentUserId,
      title.trim(),
      content ? String(content).trim() : '',
      category || 'Khác',
      colorId || 'yellow',
      isPinned ? 1 : 0,
      isLocked ? 1 : 0,
      attachmentsJson,
      reminderAt || null,
      shareCode || null,
      collaboratorsJson,
      createdAt || now,
      updatedAt || now,
    ]);

    res.json({
      success: true,
      message: 'Đã lưu ghi chú thành công vào MySQL!',
      noteId: id,
    });
  } catch (err) {
    console.error('Lỗi khi lưu ghi chú:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi lưu ghi chú: ' + err.message });
  }
});

// 4. Cập nhật Ghi chú theo ID (PUT)
app.put('/api/notes/:id', authenticateToken, async (req, res) => {
  try {
    if (!pool) return res.status(503).json({ error: 'CSDL MySQL chưa sẵn sàng.' });
    const { id } = req.params;
    const {
      title,
      content,
      category,
      colorId,
      isPinned,
      isLocked,
      attachments,
      reminderAt,
      shareCode,
      collaborators,
      updatedAt,
    } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Tiêu đề ghi chú không được để trống.' });
    }

    const attachmentsJson = Array.isArray(attachments) ? JSON.stringify(attachments) : null;
    const collaboratorsJson = Array.isArray(collaborators) ? JSON.stringify(collaborators) : null;
    const now = updatedAt || new Date().toISOString();

    const [result] = await pool.query(
      `UPDATE \`notes\` SET
        \`title\` = ?,
        \`content\` = ?,
        \`category\` = ?,
        \`color_id\` = ?,
        \`is_pinned\` = ?,
        \`is_locked\` = ?,
        \`attachments\` = ?,
        \`reminder_at\` = ?,
        \`share_code\` = ?,
        \`collaborators\` = ?,
        \`updated_at\` = ?
      WHERE \`id\` = ?`,
      [
        title.trim(),
        content ? String(content).trim() : '',
        category || 'Khác',
        colorId || 'yellow',
        isPinned ? 1 : 0,
        isLocked ? 1 : 0,
        attachmentsJson,
        reminderAt || null,
        shareCode || null,
        collaboratorsJson,
        now,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Không tìm thấy ghi chú mã ${id}.` });
    }

    res.json({ success: true, message: `Đã cập nhật ghi chú ${id} thành công!` });
  } catch (err) {
    console.error('Lỗi khi cập nhật:', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật ghi chú: ' + err.message });
  }
});

// 5. Tạo/Cập nhật mã chia sẻ và người cộng tác
app.post('/api/notes/:id/share', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { collaboratorEmails } = req.body;

    // Sinh share code ngẫu nhiên nếu chưa có
    const shareCode = 'NOTE-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const collaboratorsJson = Array.isArray(collaboratorEmails)
      ? JSON.stringify(collaboratorEmails)
      : null;

    await pool.query(
      'UPDATE `notes` SET `share_code` = COALESCE(`share_code`, ?), `collaborators` = ? WHERE `id` = ?',
      [shareCode, collaboratorsJson, id]
    );

    const [rows] = await pool.query('SELECT `share_code` FROM `notes` WHERE `id` = ?', [id]);
    const finalShareCode = rows[0] ? rows[0].share_code : shareCode;

    res.json({
      success: true,
      shareCode: finalShareCode,
      collaborators: collaboratorEmails || [],
    });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi chia sẻ ghi chú: ' + err.message });
  }
});

// 6. Xóa Ghi chú
app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
  try {
    if (!pool) return res.status(503).json({ error: 'CSDL MySQL chưa sẵn sàng.' });
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM `notes` WHERE `id` = ?', [id]);

    res.json({
      success: true,
      message: `Đã xóa ghi chú ${id}!`,
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    console.error('Lỗi khi xóa ghi chú:', err);
    res.status(500).json({ error: 'Lỗi khi xóa ghi chú: ' + err.message });
  }
});

// 7. Synchronize Batch Notes
app.post('/api/notes/sync', authenticateToken, async (req, res) => {
  try {
    if (!pool) return res.status(503).json({ error: 'CSDL MySQL chưa sẵn sàng.' });
    const notes = req.body;
    if (!Array.isArray(notes)) {
      return res.status(400).json({ error: 'Dữ liệu gửi lên phải là danh sách ghi chú.' });
    }

    if (notes.length === 0) {
      return res.json({ success: true, count: 0 });
    }

    const currentUserId = req.user ? req.user.id : null;

    for (const note of notes) {
      if (!note.id || !note.title) continue;
      const attachmentsJson = Array.isArray(note.attachments)
        ? JSON.stringify(note.attachments)
        : null;
      const collaboratorsJson = Array.isArray(note.collaborators)
        ? JSON.stringify(note.collaborators)
        : null;

      const query = `
        INSERT INTO \`notes\` (
          \`id\`, \`user_id\`, \`title\`, \`content\`, \`category\`, \`color_id\`, 
          \`is_pinned\`, \`is_locked\`, \`attachments\`, \`reminder_at\`, \`share_code\`, 
          \`collaborators\`, \`created_at\`, \`updated_at\`
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          \`title\` = VALUES(\`title\`),
          \`content\` = VALUES(\`content\`),
          \`category\` = VALUES(\`category\`),
          \`color_id\` = VALUES(\`color_id\`),
          \`is_pinned\` = VALUES(\`is_pinned\`),
          \`is_locked\` = VALUES(\`is_locked\`),
          \`attachments\` = VALUES(\`attachments\`),
          \`reminder_at\` = VALUES(\`reminder_at\`),
          \`share_code\` = VALUES(\`share_code\`),
          \`collaborators\` = VALUES(\`collaborators\`),
          \`updated_at\` = VALUES(\`updated_at\`);
      `;
      await pool.query(query, [
        note.id,
        currentUserId || note.userId || null,
        note.title,
        note.content || '',
        note.category || 'Khác',
        note.colorId || 'yellow',
        note.isPinned ? 1 : 0,
        note.isLocked ? 1 : 0,
        attachmentsJson,
        note.reminderAt || null,
        note.shareCode || null,
        collaboratorsJson,
        note.createdAt || new Date().toISOString(),
        note.updatedAt || new Date().toISOString(),
      ]);
    }

    res.json({ success: true, count: notes.length });
  } catch (err) {
    console.error('Lỗi đồng bộ:', err);
    res.status(500).json({ error: 'Lỗi đồng bộ: ' + err.message });
  }
});

// ----------------------------------------------------
// AI ASSISTANT API
// ----------------------------------------------------

// 1. Tóm tắt AI (Smart NLP engine & Keyword Extractor)
app.post('/api/ai/summarize', (req, res) => {
  const { title, content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Nội dung ghi chú trống, không thể tóm tắt.' });
  }

  const text = content.trim();
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  let summarySentences = [];

  if (sentences.length <= 2) {
    summarySentences = sentences;
  } else {
    // Lấy câu đầu tiên, 1 câu tiêu biểu ở giữa và câu có nhiều từ khóa quan trọng
    summarySentences.push(sentences[0]);

    const keywords = ['nhiệm vụ', 'cần làm', 'quan trọng', 'deadline', 'mục tiêu', 'kế hoạch', 'kết quả', 'chú ý'];
    const keySentence = sentences.find(
      (s, idx) => idx > 0 && keywords.some((kw) => s.toLowerCase().includes(kw))
    );

    if (keySentence && keySentence !== sentences[0]) {
      summarySentences.push(keySentence);
    } else if (sentences.length > 2) {
      summarySentences.push(sentences[Math.floor(sentences.length / 2)]);
    }

    if (sentences.length > 3) {
      summarySentences.push(sentences[sentences.length - 1]);
    }
  }

  const summary = `📌 TÓM TẮT AI:\n` + summarySentences.map((s) => `• ${s}`).join('\n');
  res.json({ summary, bulletPoints: summarySentences });
});

// 2. Gợi ý thẻ Tag AI
app.post('/api/ai/autotag', (req, res) => {
  const { title = '', content = '' } = req.body;
  const fullText = (title + ' ' + content).toLowerCase();

  const tagDictionary = [
    { tag: '⚡ Quan Trọng', keywords: ['gấp', 'khẩn cấp', 'quan trọng', 'hạn chót', 'deadline'] },
    { tag: '📚 Học Tập', keywords: ['bài tập', 'thi', 'ôn tập', 'lý thuyết', 'khoa học', 'học', 'slide', 'báo cáo'] },
    { tag: '💼 Công Việc', keywords: ['họp', 'dự án', 'khách hàng', 'kế hoạch', 'báo cáo', 'sếp', 'email', 'task'] },
    { tag: '💰 Tài Chính', keywords: ['tiền', 'chi tiêu', 'ngân sách', 'mua', 'giá', 'đồng', 'vnd', 'thanh toán'] },
    { tag: '💡 Ý Tưởng', keywords: ['ý tưởng', 'sáng tạo', 'thiết kế', 'tính năng', 'cải tiến', 'mới'] },
    { tag: '🏠 Cá Nhân', keywords: ['sách', 'cà phê', 'sức khỏe', 'tập thể dục', 'gia đình', 'du lịch', 'mua sắm'] },
  ];

  const matchedTags = new Set();

  tagDictionary.forEach((item) => {
    if (item.keywords.some((kw) => fullText.includes(kw))) {
      matchedTags.add(item.tag);
    }
  });

  if (matchedTags.size === 0) {
    matchedTags.add('📝 Ghi chú');
  }

  res.json({ tags: Array.from(matchedTags) });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    databaseReady: Boolean(pool),
    serverTime: new Date().toISOString(),
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 [Server] Đang chạy tại http://localhost:${PORT}`);
  await initDatabase();
});
