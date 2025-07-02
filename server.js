const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const app = express();
const multer = require('multer');


// 目录配置
const DATA_DIR = path.join(__dirname, 'data');
const BACKUP_DIR = path.join(__dirname, 'backups');
const LOG_DIR = path.join(__dirname, 'logs');

// 备份配置
const BACKUP_CONFIG = {
  // 分层备份策略
  recent: {
    maxCount: 5,        // 最近5个备份
    maxAgeDays: 1       // 1天内的备份
  },
  daily: {
    maxCount: 7,        // 每日备份保留7个
    maxAgeDays: 7       // 7天内的每日备份
  },
  weekly: {
    maxCount: 4,        // 每周备份保留4个
    maxAgeDays: 28      // 4周内的每周备份
  },
  monthly: {
    maxCount: 6,        // 每月备份保留6个
    maxAgeDays: 180     // 6个月内的每月备份
  },
  maxTotalBackupSize: 200 * 1024 * 1024  // 总备份大小限制200MB
};

// 启用CORS
app.use(cors());

// 启用JSON解析
app.use(express.json({ limit: '50mb' }));


// 日志记录函数
async function writeLog(action, filename, ip, success, error = null) {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      action,
      filename,
      ip,
      success,
      error: error ? error.message : null
    };
    
    const logFile = path.join(LOG_DIR, `${new Date().toISOString().split('T')[0]}.log`);
    const logLine = JSON.stringify(logEntry) + '\n';
    
    await fs.appendFile(logFile, logLine);
  } catch (logError) {
    console.error('写入日志失败:', logError);
  }
}

// 获取备份的时间分类
function getBackupCategory(backupTime) {
  const now = new Date();
  const ageInDays = (now - backupTime) / (1000 * 60 * 60 * 24);
  
  if (ageInDays <= 1) return 'recent';
  if (ageInDays <= 7) return 'daily';
  if (ageInDays <= 28) return 'weekly';
  if (ageInDays <= 180) return 'monthly';
  return 'old';
}

// 智能备份清理（分层保留策略）
async function smartCleanupBackups(filename) {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    const fileBackups = files
      .filter(file => file.startsWith(`${filename}_`) && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(BACKUP_DIR, file),
        time: fs.stat(path.join(BACKUP_DIR, file)).then(stats => stats.mtime)
      }));

    // 等待所有文件状态
    for (let backup of fileBackups) {
      backup.time = await backup.time;
    }

    // 按时间排序，最新的在前
    fileBackups.sort((a, b) => b.time - a.time);

    // 分类备份文件
    const categorized = {
      recent: [],
      daily: [],
      weekly: [],
      monthly: [],
      old: []
    };

    for (let backup of fileBackups) {
      const category = getBackupCategory(backup.time);
      categorized[category].push(backup);
    }

    // 对于daily、weekly、monthly，只保留每个时间段的第一个备份
    const toKeep = new Set();
    
    // 保留最近的备份
    categorized.recent.slice(0, BACKUP_CONFIG.recent.maxCount).forEach(b => toKeep.add(b.name));
    
    // 保留每日第一个备份
    const dailyGroups = new Map();
    categorized.daily.forEach(backup => {
      const day = backup.time.toISOString().split('T')[0];
      if (!dailyGroups.has(day)) {
        dailyGroups.set(day, backup);
      }
    });
    Array.from(dailyGroups.values()).slice(0, BACKUP_CONFIG.daily.maxCount).forEach(b => toKeep.add(b.name));
    
    // 保留每周第一个备份
    const weeklyGroups = new Map();
    categorized.weekly.forEach(backup => {
      const week = Math.floor(backup.time.getTime() / (7 * 24 * 60 * 60 * 1000));
      if (!weeklyGroups.has(week)) {
        weeklyGroups.set(week, backup);
      }
    });
    Array.from(weeklyGroups.values()).slice(0, BACKUP_CONFIG.weekly.maxCount).forEach(b => toKeep.add(b.name));
    
    // 保留每月第一个备份
    const monthlyGroups = new Map();
    categorized.monthly.forEach(backup => {
      const month = `${backup.time.getFullYear()}-${backup.time.getMonth()}`;
      if (!monthlyGroups.has(month)) {
        monthlyGroups.set(month, backup);
      }
    });
    Array.from(monthlyGroups.values()).slice(0, BACKUP_CONFIG.monthly.maxCount).forEach(b => toKeep.add(b.name));

    // 删除不需要保留的备份
    for (let backup of fileBackups) {
      if (!toKeep.has(backup.name)) {
        try {
          await fs.unlink(backup.path);
          console.log(`删除备份: ${backup.name} (${getBackupCategory(backup.time)})`);
        } catch (err) {
          console.error(`删除备份失败: ${backup.name}`, err);
        }
      }
    }

    console.log(`${filename} 备份清理完成，保留 ${toKeep.size} 个备份`);
    
  } catch (error) {
    console.error('智能备份清理失败:', error);
  }
}

// 检查备份总大小
async function checkBackupSize() {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    let totalSize = 0;
    
    for (let file of files) {
      const stats = await fs.stat(path.join(BACKUP_DIR, file));
      totalSize += stats.size;
    }

    if (totalSize > BACKUP_CONFIG.maxTotalBackupSize) {
      console.warn(`备份总大小超限: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
      
      // 删除最旧的备份文件直到大小符合要求
      const allBackups = [];
      for (let file of files) {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = await fs.stat(filePath);
        allBackups.push({ name: file, path: filePath, time: stats.mtime, size: stats.size });
      }
      
      allBackups.sort((a, b) => a.time - b.time); // 最旧的在前
      
      let currentSize = totalSize;
      for (let backup of allBackups) {
        if (currentSize <= BACKUP_CONFIG.maxTotalBackupSize) break;
        
        await fs.unlink(backup.path);
        currentSize -= backup.size;
        console.log(`删除备份以释放空间: ${backup.name}`);
      }
    }
  } catch (error) {
    console.error('检查备份大小失败:', error);
  }
}

// 备份数据文件
async function backupFile(filename) {
  try {
    const sourceFile = path.join(DATA_DIR, `${filename}.json`);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `${filename}_${timestamp}.json`);
    
    // 检查源文件是否存在
    try {
      await fs.access(sourceFile);
      await fs.copyFile(sourceFile, backupFile);
      console.log(`备份创建: ${backupFile}`);
      
      // 智能清理该文件的旧备份
      await smartCleanupBackups(filename);
      
      // 检查总备份大小
      await checkBackupSize();
      
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  } catch (error) {
    console.error('备份文件失败:', error);
  }
}

// 确保目录存在
async function ensureDirectories() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    await fs.mkdir(LOG_DIR, { recursive: true });
  } catch (error) {
    console.error('创建目录失败:', error);
  }
}
// ==================== 新增文件上传接口 ====================
// 1. 修改Multer配置
// 修改后的Multer配置
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    // 保留原始文件名
    const originalname = decodeURIComponent(file.originalname);
    // 添加时间戳防止重名
    const timestamp = Date.now();
    cb(null, `${timestamp}_${originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // 接受所有文件
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, true);
  }
});

// 2. 修改上传路由
app.post('/api/uploads', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.log('请求体:', req.body); // 调试日志
      console.log('请求头:', req.headers); // 调试日志
      throw new Error('未接收到文件');
    }

    console.log('接收到的文件:', req.file); // 调试日志
    const serverUrl = `${req.protocol}://${req.get('host')}`;
    // 返回文件信息
    res.json({
      success: true,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: `/uploads/${encodeURIComponent(req.file.filename)}`,
      url: `${serverUrl}/uploads/${req.file.filename}`,
    });

  } catch (error) {
    console.error('文件上传失败:', error);
    res.status(500).json({ 
      error: error.message,
      details: '请检查请求是否包含文件'
    });
  }
});

// ==================== 结束新增 ====================
// API路由
// 保存数据
app.post('/api/save/:filename', async (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const { filename } = req.params;
  
  try {
    const data = req.body;
    
    // 确保目录存在
    await ensureDirectories();
    
    // 备份现有文件（如果存在）
    await backupFile(filename);
    
    // 写入文件
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`数据已保存到: ${filePath}`);
    
    // 记录操作日志
    await writeLog('SAVE', filename, clientIP, true);
    
    res.json({ success: true });
  } catch (error) {
    console.error('保存数据错误:', error);
    
    // 记录错误日志
    await writeLog('SAVE', filename, clientIP, false, error);
    
    res.status(500).json({ error: '保存数据失败' });
  }
});
// 在服务器端添加一个专门的文件下载路由
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send('文件不存在');
      return;
    }

    // 设置下载头
    res.download(filePath, req.query.originalname || req.params.filename, (err) => {
      if (err) {
        console.error('下载出错:', err);
        res.status(500).send('下载失败');
      }
    });
  });
});
app.delete('/api/delete', async (req, res) => {
  try {
    const { filename, path: filePath } = req.body;
    
    if (!filename || !filePath) {
      return res.status(400).json({ success: false, error: '缺少必要参数' });
    }
    
    // 从URL路径转换为服务器文件系统路径
    const relativePath = filePath.replace(/^\/uploads\//, '');
    const absolutePath = path.join(__dirname, 'uploads', relativePath);
    
    console.log('尝试删除文件:', absolutePath);
    
    // 检查文件是否存在
    try {
      await fs.access(absolutePath);
    } catch (err) {
      return res.status(404).json({ success: false, error: '文件不存在' });
    }
    
    // 删除文件
    await fs.unlink(absolutePath);
    
    res.json({ success: true });
  } catch (error) {
    console.error('删除文件失败:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || '删除文件失败'
    });
  }
});
// 读取数据
app.get('/api/data/:filename', async (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const { filename } = req.params;
  
  try {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      
      // 记录读取日志
      await writeLog('READ', filename, clientIP, true);
      
      res.json(JSON.parse(data));
    } catch (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在时返回空数组
        await writeLog('READ', filename, clientIP, true);
        res.json([]);
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error('读取数据错误:', error);
    
    // 记录错误日志
    await writeLog('READ', filename, clientIP, false, error);
    
    res.status(500).json({ error: '读取数据失败' });
  }
});

// 获取备份列表
app.get('/api/backups/:filename', async (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const { filename } = req.params;
  
  try {
    const files = await fs.readdir(BACKUP_DIR);
    const fileBackups = files
      .filter(file => file.startsWith(`${filename}_`) && file.endsWith('.json'))
      .map(async file => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = await fs.stat(filePath);
        return {
          name: file,
          timestamp: stats.mtime,
          size: stats.size,
          category: getBackupCategory(stats.mtime)
        };
      });

    const backups = await Promise.all(fileBackups);
    backups.sort((a, b) => b.timestamp - a.timestamp);

    await writeLog('LIST_BACKUPS', filename, clientIP, true);
    res.json(backups);
    
  } catch (error) {
    console.error('获取备份列表错误:', error);
    await writeLog('LIST_BACKUPS', filename, clientIP, false, error);
    res.status(500).json({ error: '获取备份列表失败' });
  }
});

// 恢复备份
app.post('/api/restore/:filename/:backupName', async (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const { filename, backupName } = req.params;
  
  try {
    const backupFile = path.join(BACKUP_DIR, backupName);
    const targetFile = path.join(DATA_DIR, `${filename}.json`);
    
    // 验证备份文件是否存在
    await fs.access(backupFile);
    
    // 在恢复前备份当前文件
    await backupFile(filename);
    
    // 恢复备份
    await fs.copyFile(backupFile, targetFile);
    console.log(`恢复备份: ${backupName} -> ${filename}.json`);
    
    await writeLog('RESTORE', `${filename} from ${backupName}`, clientIP, true);
    res.json({ success: true, message: '备份恢复成功' });
    
  } catch (error) {
    console.error('恢复备份错误:', error);
    await writeLog('RESTORE', `${filename} from ${backupName}`, clientIP, false, error);
    res.status(500).json({ error: '恢复备份失败' });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 静态文件服务 - 放在API路由之后
app.use(express.static(path.join(__dirname, 'dist')));
// 静态文件服务 - 添加这行
// 添加静态文件服务中间件
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/static_files', express.static(path.join(__dirname, 'static_files')));

// 处理所有其他路由，返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// 启动服务器
const PORT = process.env.PORT || 3000;

// 定时备份任务（每小时执行一次）
async function scheduleBackups() {
  console.log('启动定时备份任务...');
  
  setInterval(async () => {
    try {
      const files = await fs.readdir(DATA_DIR);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      for (const file of jsonFiles) {
        const filename = file.replace('.json', '');
        await backupFile(filename);
      }
      
      console.log(`定时备份完成，共备份 ${jsonFiles.length} 个文件`);
    } catch (error) {
      console.error('定时备份失败:', error);
    }
  }, 60 * 60 * 1000); // 每小时
}

// 确保目录存在后再启动服务器
ensureDirectories().then(() => {
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('数据存储目录:', DATA_DIR);
    console.log('备份目录:', BACKUP_DIR);
    console.log('日志目录:', LOG_DIR);
    
    // 启动定时备份
    scheduleBackups();
  });
});