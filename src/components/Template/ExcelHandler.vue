<!-- ExcelHandler.vue -->
<template>
  <div class="excel-handler">
    <!-- 第一行：文件选择 -->
    <div class="excel-row">
      <b-form-file 
        v-model="file" 
        placeholder="请选择一个Excel文件" 
        class="mr-3 mb-2" 
        style="max-width: 300px;"
      ></b-form-file>
    </div>
    
    <!-- 第二行：操作按钮 -->
    <div class="excel-row">
      <b-button 
        variant="default" 
        class="mr-3 mb-2" 
        size="sm" 
        @click="parseExcel"
      >解析Excel</b-button>
      <b-button 
        variant="default" 
        class="mr-3 mb-2" 
        size="sm" 
        @click="handleExportTable"
      >下载模板</b-button>
      <b-button 
        variant="success" 
        class="mr-3 mb-2 custom-btn" 
        size="sm" 
        @click="exportToExcel"
      >导出Excel</b-button>
    </div>
    
    <!-- 隐藏的模板表格 -->
    <el-table 
      :data="[]" 
      style="display:none;th: 100%" 
      id="templateTable" 
      height="500"
    >
      <el-table-column 
        v-for="column in columns" 
        :key="column.prop"
        :prop="column.prop" 
        :label="column.label" 
        :width="column.width"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import * as XLSX from 'xlsx/xlsx.mjs'
import { export_excel } from '@/utils/exportExcel.js'

export default {
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    tableData: Array,
    filteredItems: Array,
    isSearching: Boolean,
    searchResults: Array
  },
  data() {
    return {
      file: null
    }
  },
  methods: {
    parseExcel() {
      if (this.file) {
        let that = this
        this.$emit('clear-table')
        const reader = new FileReader()
        reader.readAsArrayBuffer(this.file)
        reader.onload = function(e) {
          try {
            const data = new Uint8Array(e.target.result)
            const workbook = XLSX.read(data, { type: 'array' })
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            
            // 获取表头行
            const headers = that.columns.map(col => col.prop)
            
            // 转换整个工作表为JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet)
            
            const newData = jsonData.map(row => {
              const obj = {}
              // 确保只处理我们需要的列
              headers.forEach((header, index) => {
                const excelHeader = that.columns[index].label // 使用label匹配Excel表头
                const value = row[excelHeader]
                
                // 处理数值类型
                if (typeof value === 'number') {
                  obj[header] = value.toFixed(2)
                } else {
                  obj[header] = value || '' // 防止undefined
                }
              })
              return obj
            })
            
            that.$emit('update-data', newData)
            that.$emit('excel-parsed', true)
          } catch (error) {
            console.error('解析Excel失败:', error)
            that.$emit('excel-parsed', false, error)
          }
        }
        reader.onerror = function() {
          that.$emit('excel-parsed', false, new Error('文件读取失败'))
        }
      } else {
        this.$emit('excel-parsed', false, new Error('请先选择Excel文件'))
      }
    },
    
    exportToExcel() {
      // 创建一个临时表格用于导出
      const tempTableId = 'tempExportTable';
      let tempTable = document.getElementById(tempTableId);
      
      if(tempTable) {
        tempTable.remove();
      }
      
      // 创建新表格
      tempTable = document.createElement('table');
      tempTable.id = tempTableId;
      tempTable.style.display = 'none';
      
      // 创建表头
      const thead = document.createElement('thead');
      const tr = document.createElement('tr');
      
      this.columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column.label;
        tr.appendChild(th);
      });
      
      thead.appendChild(tr);
      tempTable.appendChild(thead);
      
      // 创建表格内容
      const tbody = document.createElement('tbody');
      
      const dataToExport = this.isSearching ? this.searchResults : this.filteredItems;
      
      dataToExport.forEach(item => {
        const tr = document.createElement('tr');
        
        this.columns.forEach(column => {
          const td = document.createElement('td');
          td.textContent = item[column.prop] || '';
          tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
      });
      
      tempTable.appendChild(tbody);
      document.body.appendChild(tempTable);
      
      // 导出临时表格
      this.$nextTick(() => {
        export_excel(tempTableId);
        tempTable.remove();
        this.$emit('excel-exported');
      });
    },
    
    handleExportTable() {
      this.$nextTick(() => {
        export_excel('templateTable')
        this.$emit('template-exported')
      })
    }
  }
}
</script>

<style scoped>
.excel-handler {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>