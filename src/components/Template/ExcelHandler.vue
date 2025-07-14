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
    <div style="display:none;">
      <table id="templateTable">
        <thead>
          <tr>
            <template v-for="column in columns">
              <th 
                v-if="column.children && column.children.length" 
                :colspan="column.children.length"
              >
                {{ column.label }}
              </th>
              <th v-else :rowspan="getHeaderRowCount()">
                {{ column.label }}
              </th>
            </template>
          </tr>
          <tr v-if="hasSecondHeaderRow()">
            <template v-for="column in columns">
              <template v-if="column.children && column.children.length">
                <th v-for="child in column.children" :key="child.prop">
                  {{ child.label }}
                </th>
              </template>
            </template>
          </tr>
        </thead>
      </table>
    </div>
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
    searchResults: Array,
  },
  data() {
    return {
      file: null
    }
  },
  computed: {
    // 计算表头的最大行数
    maxHeaderRows() {
      return this.calculateMaxHeaderRows(this.columns, 1)
    }
  },
  methods: {
    // 递归计算表头的最大行数
    calculateMaxHeaderRows(columns, currentDepth) {
      let maxDepth = currentDepth
      for (const column of columns) {
        if (column.children && column.children.length) {
          const childDepth = this.calculateMaxHeaderRows(column.children, currentDepth + 1)
          if (childDepth > maxDepth) {
            maxDepth = childDepth
          }
        }
      }
      return maxDepth
    },
    
    // 获取表头总行数
    getHeaderRowCount() {
      return this.maxHeaderRows
    },
    
    // 检查是否有第二行表头
    hasSecondHeaderRow() {
      return this.maxHeaderRows > 1
    },
    
    parseExcel() {
  if (this.file) {
    let that = this
    const reader = new FileReader()
    reader.readAsArrayBuffer(this.file)
    reader.onload = function(e) {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array', cellDates: true })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        
        // 获取所有列(包括子列)
        const allColumns = []
        that.columns.forEach(column => {
          if (column.children && column.children.length) {
            allColumns.push(...column.children)
          } else {
            allColumns.push(column)
          }
        })
        
        // 转换整个工作表为JSON数组
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        // 使用计算出的表头行数
        const headerRows = that.maxHeaderRows
        
        // 从表头行之后开始处理数据
        const newData = jsonData.slice(headerRows).map(row => {
          const obj = {}
          
          // 按照列顺序匹配数据
          allColumns.forEach((column, index) => {
            const value = row[index]
            
            // 处理日期类型
            if (column.type === 'date' && value instanceof Date) {
              // 格式化为 yyyy-MM-dd
              const year = value.getFullYear()
              const month = String(value.getMonth() + 1).padStart(2, '0')
              const day = String(value.getDate()).padStart(2, '0')
              obj[column.prop] = `${year}-${month}-${day}`
            } else {
              obj[column.prop] = value || '' // 防止undefined
            }
          })
          
          return obj
        })
        
        // 合并新旧数据
        const combinedData = [...(that.tableData || []), ...newData]
        that.$emit('update-data', combinedData)
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
      
      // 构建表头行
      const headerRows = this.buildHeaderRows(this.columns, this.maxHeaderRows);
      headerRows.forEach(row => {
        thead.appendChild(row);
      });
      
      tempTable.appendChild(thead);
      
      // 创建表格内容
      const tbody = document.createElement('tbody');
      
      const dataToExport = this.isSearching ? this.searchResults : this.filteredItems;
      
      // 获取所有列(包括子列)
      const allColumns = []
      this.columns.forEach(column => {
        if (column.children && column.children.length) {
          allColumns.push(...column.children)
        } else {
          allColumns.push(column)
        }
      })
      
      dataToExport.forEach(item => {
        const tr = document.createElement('tr');
        
        allColumns.forEach(column => {
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
    
    // 递归构建表头行
    buildHeaderRows(columns, maxDepth, currentDepth = 1, rows = []) {
      // 初始化行数组
      if (currentDepth === 1) {
        for (let i = 0; i < maxDepth; i++) {
          rows[i] = document.createElement('tr');
        }
      }
      
      columns.forEach(column => {
        if (column.children && column.children.length) {
          // 如果有子列，创建跨列的单元格
          const th = document.createElement('th');
          th.setAttribute('colspan', column.children.length);
          th.textContent = column.label;
          rows[currentDepth - 1].appendChild(th);
          
          // 递归处理子列
          this.buildHeaderRows(column.children, maxDepth, currentDepth + 1, rows);
        } else {
          // 如果没有子列，创建跨行的单元格
          const th = document.createElement('th');
          th.setAttribute('rowspan', maxDepth - currentDepth + 1);
          th.textContent = column.label;
          rows[currentDepth - 1].appendChild(th);
        }
      });
      
      return rows;
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