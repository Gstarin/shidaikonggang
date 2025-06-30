import axios from './axios';

const saveData = async (filename, data) => {
  try {
    const response = await axios.post(`/api/save/${filename}`, data);
    return response.data;
  } catch (error) {
    console.error('保存数据失败:', error);
    throw error;
  }
};

const getData = async (filename) => {
  try {
    const response = await axios.get(`/api/data/${filename}`);
    return response.data;
  } catch (error) {
    console.error('获取数据失败:', error);
    return [];
  }
};

export { saveData, getData }; 