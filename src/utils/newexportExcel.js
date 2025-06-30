import FileSaver from 'file-saver'
import * as XLSX from 'xlsx/xlsx.mjs'

export function new_export_excel(table_id) {
  // 获取表格元素
  const table = document.querySelector('#' + table_id);
  if (!table) {
    console.error('Table not found');
    return;
  }

  // 获取表头
  const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());

  // 获取表格数据
  const rows = Array.from(table.querySelectorAll('tbody tr')).map(row => {
    return Array.from(row.querySelectorAll('td')).map(td => {
      // 如果单元格包含输入框，获取输入框的值
      const input = td.querySelector('input');
      return input ? input.value : td.textContent.trim();
    });
  });

  // 创建工作表
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // 创建工作簿
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // 生成文件名
  const fileName = `${table_id}_${new Date().toISOString().split('T')[0]}.xlsx`;

  // 导出文件
  try {
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
    console.log('Excel file exported successfully');
  } catch (e) {
    console.error('Error exporting Excel file:', e);
  }
}