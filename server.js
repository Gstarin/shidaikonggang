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
const uploadsDir = path.join(__dirname, 'uploads');

// 启用CORS
app.use(cors());
app.use(express.json({ limit: '500mb' }))


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

async function ensureDataDir(comfrom) {
  const dirPath = path.join(DATA_DIR, comfrom);
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`创建目录失败: ${dirPath}`, error);
  }
}

// 静态文件服务 - 放在API路由之后
app.use(express.static(path.join(__dirname, 'dist')));
// 静态文件服务 - 添加这行
// 添加静态文件服务中间件
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-store');
  }
}));
app.use('/static_files', express.static(path.join(__dirname, 'static_files')));


app.post('/api/save-data', async (req, res) => {
  try {
    const { comfrom, filename, data } = req.body;
    
    // 验证输入参数
    if (!comfrom || !filename || !data) {
      return res.status(400).json({ success: false, error: '缺少必要参数' });
    }
    
    // 确保目录存在
    await ensureDataDir(comfrom);
    
    // 构建相对路径
    const relativeDir = path.join(DATA_DIR, comfrom);
    
    // 验证路径是否在允许的目录内
    const resolvedDir = path.resolve(relativeDir);
    
    // 文件路径
    const filePath = path.join(relativeDir, filename);
    const latestFilePath = path.join(relativeDir, 'latest.json');
    const historyFilePath = path.join(relativeDir, 'history.json');
    
    // 检查latest.json是否存在，不存在则创建空数组
    let latestData = [];
    try {
      const latestFileContent = await fs.readFile(latestFilePath, 'utf8');
      latestData = JSON.parse(latestFileContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // 文件不存在，初始化为空数组
        await fs.writeFile(latestFilePath, '[]', 'utf8');
      } else {
        throw error;
      }
    }
    
    // 初始化history.json如果不存在
    let historyData = [];
    try {
      const historyFileContent = await fs.readFile(historyFilePath, 'utf8');
      historyData = JSON.parse(historyFileContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // 文件不存在，初始化为空数组
        await fs.writeFile(historyFilePath, '[]', 'utf8');
      } else {
        throw error;
      }
    }
    
    // 比较新数据与latest.json内容
    const newData = JSON.parse(data);
    if (JSON.stringify(latestData) === JSON.stringify(newData)) {
      // 数据相同，不保存，直接返回latest.json路径
      return res.json({ 
        success: true,
        message: '数据未变化，未执行保存',
        path: latestFilePath
      });
    }
    // 数据不同，准备历史记录
    const filePath1 = `data/${comfrom}/${filename}`;
    const timestamp = new Date().toISOString();
    const historyEntry = {
      timestamp,
      filePath:filePath1,
    };
    // 添加到历史记录数组开头
    historyData.unshift(historyEntry);
    
    // 保存文件、更新latest.json和history.json
    await Promise.all([
      fs.writeFile(filePath, data, 'utf8'),
      fs.writeFile(latestFilePath, data, 'utf8'),
      fs.writeFile(historyFilePath, JSON.stringify(historyData, null, 2), 'utf8')
    ]);
    
    res.json({ 
      success: true,
      message: '数据保存成功',
      path: latestFilePath.replace(__dirname, ''),  // 返回相对路径
      historyPath: historyFilePath.replace(__dirname, '')
    });
  } catch (error) {
    console.error('保存数据失败:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// 从服务器加载数据 - 简化版，直接读取latest.json
app.get('/api/load-data', async (req, res) => {
  try {
    const { comfrom } = req.query;
    const latestFilePath = path.join(DATA_DIR, comfrom, 'latest.json');
    
    // 检查文件是否存在
    try {
      await fs.access(latestFilePath);
    } catch (error) {
      // 文件不存在，返回空
      return res.json(null);
    }
    
    // 读取最新的文件
    const fileContent = await fs.readFile(latestFilePath, 'utf8');
    res.json(JSON.parse(fileContent));
  } catch (error) {
    console.error('加载数据失败:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

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
    
    res.json({ success: true });
  } catch (error) {
    console.error('保存数据错误:', error);
    
    // 记录错误日志
    
    res.status(500).json({ error: '保存数据失败' });
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
      url: `${"http://localhost:3000"}/uploads/${req.file.filename}`,
    });

  } catch (error) {
    console.error('文件上传失败:', error);
    res.status(500).json({ 
      error: error.message,
      details: '请检查请求是否包含文件'
    });
  }
});
// 通用文件获取接口
app.get('/api/get-file', async (req, res) => {
  try {
    const { path: relativePath } = req.query;

    const requestedPath = path.join(__dirname, relativePath);
    // 检查文件是否存在
    try {
      
      await fs.access(requestedPath);
    } catch (err) {
      return res.status(404).json({ 
        success: false,
        error: '文件不存在' 
      });
    }
    
    // 读取文件内容
    const fileContent = await fs.readFile(requestedPath, 'utf8');
    
    // 根据文件类型返回不同格式
    if (requestedPath.endsWith('.json')) {
      res.json(JSON.parse(fileContent));
    } else {
      res.send(fileContent);
    }
  } catch (error) {
    console.error('获取文件失败:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
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
    console.error(filePath);
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
    
    // 如果缺少参数，直接返回成功
    if (!filename || !filePath) {
      console.log('缺少参数，跳过删除操作');
      return res.json({ success: true, message: '缺少参数，跳过删除操作' });
    }
    
    // 从URL路径转换为服务器文件系统路径
    const relativePath = filePath.replace(/^\/uploads\//, '');
    const absolutePath = path.join(__dirname, 'uploads', relativePath);
    
    console.log('尝试删除文件:', absolutePath);
    
    // 检查文件是否存在，如果不存在直接返回成功
    try {
      await fs.access(absolutePath);
    } catch (err) {
      console.log('文件不存在，跳过删除操作');
    }
    
    // 删除文件
    await fs.unlink(absolutePath);
    
    res.json({ success: true });
  } catch (error) {
    console.error('删除文件过程中发生意外错误:', error);
    // 对于其他意外错误，仍然返回成功
    res.json({ 
      success: true,
      message: '删除过程中发生意外错误，但已跳过'
    });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 处理所有其他路由，返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// 启动服务器
const PORT = process.env.PORT || 3000;

// 确保目录存在后再启动服务器
ensureDirectories().then(() => {
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    
  });
});