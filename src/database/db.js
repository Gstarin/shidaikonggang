class Database {
  constructor() {
    this.dbName = 'MainDB';
    this.dbVersion = 1;
    this.db = null;
    this.initPromise = this.initDB();
  }

  // 初始化数据库
  initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = (event) => {
        console.error('数据库打开失败:', event.target.error);
        reject(event.target.error);
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('数据库连接成功');
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // 创建存储对象仓库(相当于表)
        if (!db.objectStoreNames.contains('excelData')) {
          const store = db.createObjectStore('excelData', { keyPath: 'comfrom' });
          console.log('创建对象仓库成功');
        }
      };
    });
  }

  // 保存数据
  async save(comfrom, data) {
    await this.initPromise; // 确保数据库已初始化
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['excelData'], 'readwrite');
      const store = transaction.objectStore('excelData');
      
      const request = store.put({ comfrom, data });
      
      request.onsuccess = () => {
        console.log(`数据保存成功: ${comfrom}`);
        resolve();
      };
      
      request.onerror = (event) => {
        console.error(`数据保存失败: ${comfrom}`, event.target.error);
        reject(event.target.error);
      };
    });
  }

  // 加载数据
  async load(comfrom) {
    await this.initPromise; // 确保数据库已初始化
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['excelData'], 'readonly');
      const store = transaction.objectStore('excelData');
      
      const request = store.get(comfrom);
      
      request.onsuccess = () => {
        const result = request.result ? request.result.data : null;
        console.log(`数据加载成功: ${comfrom}`);
        resolve(result);
      };
      
      request.onerror = (event) => {
        console.error(`数据加载失败: ${comfrom}`, event.target.error);
        reject(event.target.error);
      };
    });
  }

  // 删除数据
  async delete(comfrom) {
    await this.initPromise;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['excelData'], 'readwrite');
      const store = transaction.objectStore('excelData');
      
      const request = store.delete(comfrom);
      
      request.onsuccess = () => {
        console.log(`数据删除成功: ${comfrom}`);
        resolve();
      };
      
      request.onerror = (event) => {
        console.error(`数据删除失败: ${comfrom}`, event.target.error);
        reject(event.target.error);
      };
    });
  }
}

// 创建单例实例
const dbInstance = new Database();

// 导出实例
export default dbInstance;