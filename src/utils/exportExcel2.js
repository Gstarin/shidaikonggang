import * as XLSX from 'xlsx/xlsx.mjs'
import { saveAs } from 'file-saver';  
  
export function export_excel2(table_id) {  
  // 获取表格元素  
  const table = document.querySelector('#' + table_id);  
  const rows = table.querySelectorAll('tr');  
  const data = [];  
  
  // 遍历表格行，获取每行的数据，包括表头  
  rows.forEach(row => {  
    const cols = row.querySelectorAll('th, td'); // 注意这里同时选择了 'th' 和 'td'  
    const rowData = [];  
  
    cols.forEach(col => {  
      const input = col.querySelector('input');  
      if (input) {  
        // 如果单元格中有输入框，则获取输入框的值  
        rowData.push(input.value);  
      } else {  
        // 否则，获取单元格的文本内容  
        rowData.push(col.textContent || col.innerText);  
      }  
    });  
  
    data.push(rowData);  
  });  
  
  // 使用获取到的数据创建一个新的工作簿  
  const ws = XLSX.utils.json_to_sheet(data);  
  const wb = XLSX.utils.book_new();  
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
  
  // 导出excel文件名  
  const fileName = `${table_id}_${new Date().getTime()}.xlsx`;  
  
  // 写入文件并保存  
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });  
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);  
}