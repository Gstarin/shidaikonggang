import axios from '@/utils/axios.js'
class Database {
  constructor() {
    this.dbName = 'MainDB';
    this.dbVersion = 2;
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
        if (!db.objectStoreNames.contains('excelData')) {
          const store = db.createObjectStore('excelData', { keyPath: 'comfrom' });
          console.log('创建对象仓库成功');
        }
      };
    });
  }

  // 保存数据到本地和服务器
  async save(comfrom, data) {
    await this.initPromise;
    
    // 先保存到本地
    await this.saveToLocal(comfrom, data);
    
    // 然后保存到服务器
    try {
      await this.saveToServer(comfrom, data);
    } catch (error) {
      console.error('保存到服务器失败:', error);
      // 不阻止流程，只是记录错误
    }
  }

  // 保存到本地IndexedDB
  async saveToLocal(comfrom, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['excelData'], 'readwrite');
      const store = transaction.objectStore('excelData');
      
      const request = store.put({ comfrom, data });
      
      request.onsuccess = () => {
        console.log(`本地数据保存成功: ${comfrom}`);
        resolve();
      };
      
      request.onerror = (event) => {
        console.error(`本地数据保存失败: ${comfrom}`, event.target.error);
        reject(event.target.error);
      };
    });
  }

  // 保存到服务器
  async saveToServer(comfrom, data) {
    const timestamp = Date.now();
    const filename = `${timestamp}.json`;
    
    try {
      const response = await axios.post('/api/save-data', {
        comfrom,
        filename,
        data: JSON.stringify(data)
      });
      
      console.log(`服务器数据保存成功: ${comfrom}`);
      return response.data;
    } catch (error) {
      console.error(`服务器数据保存失败: ${comfrom}`, error);
      throw error;
    }
  }

  // 加载数据 - 同时从本地和服务器加载
  async load(comfrom) {
    await this.initPromise;
    
    // 从本地加载
    const localData = await this.loadFromLocal(comfrom);
    
    // 从服务器加载
    let serverData = null;
    try {
      serverData = await this.loadFromServer(comfrom);
    } catch (error) {
      console.error('从服务器加载数据失败:', error);
      // 如果服务器加载失败，只返回本地数据
      return localData;
    }
    
    // 合并数据 - 优先使用最新的
    if (localData && serverData) {
      // 这里可以根据时间戳决定使用哪个数据
      // 简单起见，我们优先使用服务器数据
      return serverData;
    } else if (localData) {
      return localData;
    } else {
      return serverData;
    }
  }

  // 从本地加载
  async loadFromLocal(comfrom) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['excelData'], 'readonly');
      const store = transaction.objectStore('excelData');
      
      const request = store.get(comfrom);
      
      request.onsuccess = () => {
        const result = request.result ? request.result.data : null;
        console.log(`本地数据加载成功: ${comfrom}`);
        resolve(result);
      };
      
      request.onerror = (event) => {
        console.error(`本地数据加载失败: ${comfrom}`, event.target.error);
        reject(event.target.error);
      };
    });
  }

  // 从服务器加载
  async loadFromServer(comfrom) {
    try {
      const response = await axios.get(`/api/load-data?comfrom=${comfrom}`);
      console.log(`服务器数据加载成功: ${comfrom}`);
      return response.data;
    } catch (error) {
      console.error(`服务器数据加载失败: ${comfrom}`, error);
      throw error;
    }
  }

  // 删除数据
  async delete(comfrom) {
    await this.initPromise;
    
    // 从本地删除
    await this.deleteFromLocal(comfrom);
    
    // 从服务器删除
    try {
      await this.deleteFromServer(comfrom);
    } catch (error) {
      console.error('从服务器删除数据失败:', error);
      // 不阻止流程，只是记录错误
    }
  }

  // 从本地删除
  async deleteFromLocal(comfrom) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['excelData'], 'readwrite');
      const store = transaction.objectStore('excelData');
      
      const request = store.delete(comfrom);
      
      request.onsuccess = () => {
        console.log(`本地数据删除成功: ${comfrom}`);
        resolve();
      };
      
      request.onerror = (event) => {
        console.error(`本地数据删除失败: ${comfrom}`, event.target.error);
        reject(event.target.error);
      };
    });
  }

  // 从服务器删除
  async deleteFromServer(comfrom) {
    try {
      const response = await axios.delete('/api/delete-data', {
        data: { comfrom }
      });
      console.log(`服务器数据删除成功: ${comfrom}`);
      return response.data;
    } catch (error) {
      console.error(`服务器数据删除失败: ${comfrom}`, error);
      throw error;
    }
  }
}

// 创建单例实例
const dbInstance = new Database();

// 导出实例
export default dbInstance;