<!-- TableTemplate.vue -->
<template>
  <div class="table-container">
    <div class="table-header d-flex align-items-center mb-3">
      <!-- 使用 ExcelHandler 组件 -->
      <excel-handler
        v-if="showExcelHandler"
        :columns="columns"
        :table-data="tableData"
        :filtered-items="filteredItems"
        :is-searching="isSearching"
        :search-results="searchResults"
        @update-data="updateTableData"
        @clear-table="clearTable"
        @excel-parsed="handleExcelParsed"
        @excel-exported="handleExcelExported"
        @template-exported="handleTemplateExported"
      ></excel-handler>
      
      <b-button variant="danger" class="mr-3 mb-2 custom-btn" size="sm" @click="deleteSelectedRows">删除选中行</b-button>
      <b-button variant="default" class="mr-3 mb-2 custom-btn" size="sm" @click="showAddDialog">增加条目</b-button>
      <b-button variant="primary" class="mr-3 mb-2 custom-btn" size="sm" @click="save">保存</b-button>
      <b-button variant="info" class="mr-3 mb-2 custom-btn" size="sm" @click="toggleEditMode">
        {{ editMode ? '退出编辑' : '编辑模式' }}
      </b-button>
      <b-form-input 
        v-model="searchText" 
        placeholder="输入搜索内容" 
        class="mr-3 mb-2" 
        style="max-width: 200px;"
        @keyup.enter="performSearch"
      ></b-form-input>
      <b-button variant="secondary" class="mr-3 mb-2" size="sm" @click="performSearch">搜索</b-button>
      <b-button variant="light" class="mr-3 mb-2" size="sm" @click="clearSearch">清除</b-button>
      <slot name="custom-filter1"></slot>
      <slot name="custom-filter2"></slot>
      <slot name="custom-filter3"></slot>
    </div>

    <div id="table" class="table-wrapper">
      <el-table 
        :data="displayData" 
        style="width: 100%" 
        @selection-change="handleSelectionChange" 
        height="500"  
        @cell-dblclick="handleCellDblclick"
        border
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column 
          v-for="column in columns" 
          :key="column.prop"
          :prop="column.prop" 
          :label="column.label" 
          :width="column.width"
        >
          <!-- 多行表头支持 -->
          <template v-if="column.children && column.children.length" #header>
            <div class="multi-header">
              <div class="header-row main-header">{{ column.label }}</div>
              <div class="header-row sub-header">
                <span v-for="child in column.children" :key="child.prop">{{ child.label }}</span>
              </div>
            </div>
          </template>
          
          <template v-slot="scope">
            <!-- 变量类型字段的特殊处理 -->
            <span v-if="column.type === 'variable'">
              {{ scope.row[column.prop] }}
            </span>
              <div v-if="column.type === 'actions'" class="action-buttons">
                <b-button
                  v-for="(action, idx) in column.actions"
                  :key="idx"
                  :variant="action.variant || 'default'"
                  :size="action.size || 'sm'"
                  class="mr-2"
                  @click.stop="action.handler(scope.row)"
                >
                  {{ action.label }}
                </b-button>
            </div>
            <!-- 文件类型字段的特殊处理 -->
            <div v-if="column.type === 'file'" class="file-cell">
              <!-- 1. 已上传文件显示 -->
              <div class="uploaded-files">
                <span v-if="!scope.row[column.prop]">无</span>
                <span v-else>
                  {{ scope.row[column.prop].originalname }}
                  <br>
                  <small>({{ formatFileSize(scope.row[column.prop].size) }})</small>
                </span>
              </div>
              
              <!-- 2. 上传按钮 -->
              <b-button 
                variant="outline-primary" 
                size="sm" 
                @click="handleFileUpload(scope.row, column.prop)"
                class="mt-2"
              >
                上传文件
              </b-button>
              
              <!-- 3. 查看按钮 -->
              <b-button 
                variant="outline-info" 
                size="sm" 
                @click="handleFileView(scope.row, column.prop)"
                class="mt-2"
                :disabled="!scope.row[column.prop]"
              >
                查看文件
              </b-button>
              
              <!-- 删除按钮 -->
              <b-button 
                variant="outline-danger" 
                size="sm" 
                @click="handleFileDelete(scope.row, column.prop)"
                class="mt-2"
                :disabled="!scope.row[column.prop]"
              >
                删除文件
              </b-button>
              
              <!-- 隐藏的文件输入 -->
              <input 
                type="file" 
                :ref="`fileInput_${scope.$index}_${column.prop}`" 
                style="display: none" 
                @change="(e) => onFileChange(e, scope.row, column.prop)"
              >
            </div>
            <template v-if="editMode">
              <!-- 日期类型字段 -->
              <el-date-picker
                v-if="column.type === 'date'"
                v-model="scope.row[column.prop]"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                :disabled="scope.row.isTotal"
              ></el-date-picker>
              
              <!-- 下拉选择类型字段 -->
              <el-select
                v-else-if="column.options"
                v-model="scope.row[column.prop]"
                placeholder="请选择"
                style="width: 100%"
                :disabled="scope.row.isTotal"
              >
                <el-option
                  v-for="item in column.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              
              <!-- 数字类型字段 -->
              <el-input
                v-else-if="column.type === 'number'"
                v-model.number="scope.row[column.prop]"
                type="number"
                :disabled="scope.row.isTotal"
              ></el-input>
              
              <!-- 普通文本字段 -->
              <el-input
                v-else
                v-model="scope.row[column.prop]"
                :disabled="scope.row.isTotal"
              ></el-input>
              
            </template>
            
            
            <!-- 非编辑模式下的显示 -->
            <template v-else>
              <span 
                v-if="column.slot"
                class="clickable"
                @click="$emit('row-click', scope.row)"
              >
                {{ scope.row[column.prop] }}
              </span>
              <span v-else>
                {{ scope.row[column.prop] }}
              </span>
            </template>
          </template>
        </el-table-column>
      </el-table>
      
      <el-dialog  
        v-draggable
        title="新增条目"  
        :visible.sync="dialogVisible"  
        width="50%"  
        @close="dialogVisible = false"  
      >  
        <el-form :model="form" label-width="140px">
          <el-form-item 
            v-for="column in columns" 
            :key="column.prop" 
            :label="column.label"
          >
            <el-input v-model="form[column.prop]"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">  
          <el-button @click="dialogVisible = false">取 消</el-button>  
          <el-button type="primary" @click="submitForm">确 定</el-button>  
        </span>  
      </el-dialog>
    </div>

    <!-- 分页 -->
    <div class="table-footer">
      <b-pagination v-model="currentPage" :total-rows="rows" size="lg"></b-pagination>
    </div>
  </div>
</template>


<script>
import ExcelHandler from './ExcelHandler.vue'
import dbInstance from '@/database/db.js'
import axios from '@/utils/axios.js'

export default {
  components: {
    ExcelHandler
  },
  created() {
    this.resetForm()
    this.loadData() // 组件创建时自动加载数据
  },
  props: {
    tableData: Array,
    columns: {
      type: Array,
      default: () => [],
      validator: (columns) => {
      return columns.every(col => {
        const isValid = col.prop && col.label;
        if (col.children) {
          return col.children.every(child => child.prop && child.label);
        }
        if (col.type === 'actions') {
          return Array.isArray(col.actions) && col.actions.every(action => 
            action.label && typeof action.handler === 'function'
          );
        }
        return isValid;
      });
    }
    },
    units: Array,
    apiEndpoint: String,
    formFields: Object,
    storageKey: {
      type: String,
      required: true
    },
    showExcelHandler: {
      type: Boolean,
      default: true  // 默认显示 ExcelHandler
    },
    customFilter1: {
      type: Function,
      default: null
    },
    customFilter2: {
      type: Function,
      default: null
    },
    customFilter3: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      currentPage: 1,
      selectedRows: [],
      searchText: "",
      isSearching: false,
      searchResults: [],
      dialogVisible: false,
      dialogVisible1: false,
      editingRow: null,
      editingValue: '',
      editingcolumn: null,
      form: {},
      editMode: false // 添加编辑模式状态
    }
  },
  computed: {
    filteredItems() {
      return this.tableData || []
    },
    displayData() {
      let data = this.tableData || []
      
      // 应用自定义筛选（如果有）
      if (this.$scopedSlots['custom-filter1'] && this.customFilter1) {
        data = data.filter(this.customFilter1)
      }
      if (this.$scopedSlots['custom-filter2'] && this.customFilter2) {
        data = data.filter(this.customFilter2)
      }
      if (this.$scopedSlots['custom-filter3'] && this.customFilter3) {
        data = data.filter(this.customFilter3)
      }
      
      if (this.isSearching) {
        data = this.searchResults
      }
      
      const start = (this.currentPage - 1) * 20
      const end = start + 20
      return data.slice(start, end)
    },
    rows() {
      if (this.isSearching) {
        return this.searchResults.length
      }
      return this.filteredItems.length
    }
  },
  methods: {
    // Excel 相关事件处理
    updateTableData(newData) {
      this.$emit('update:tableData', newData)
    },
    
    clearTable() {
      this.$emit('update:tableData', [])
    },
    
    handleExcelParsed(success, error) {
      if (success) {
        this.$message.success('Excel导入成功')
      } else {
        console.error('解析Excel失败:', error)
        this.$message.error(error.message || 'Excel解析失败，请检查文件格式')
      }
    },
    
    handleExcelExported() {
      // 可以在这里添加导出成功后的处理
    },
    
    handleTemplateExported() {
      // 可以在这里添加模板导出成功后的处理
    },
    
    // 其他原有方法保持不变
    performSearch() {
      if (!this.searchText.trim()) {
        this.clearSearch()
        return
      }
      
      this.isSearching = true
      const searchTerm = this.searchText.toLowerCase()
      
      this.searchResults = this.filteredItems.filter(item => {
        return this.columns.some(column => {
          const value = item[column.prop]
          return value && value.toString().toLowerCase().includes(searchTerm)
        })
      })
      
      this.currentPage = 1
    },
    
    clearSearch() {
      this.searchText = ""
      this.isSearching = false
      this.searchResults = []
      this.currentPage = 1
    },
    // 添加计算变量的方法
    calculateVariables(row) {
      this.columns.forEach(column => {
        if (column.type === 'variable' && typeof column.calculate === 'function') {
          // 使用Vue.set确保响应式更新
          this.$set(row, column.prop, column.calculate(row))
        }
      })
    },
    
    // 修改submitForm方法，添加变量计算
    submitForm() {
      const newRow = { ...this.form }
      this.calculateVariables(newRow) // 计算变量值
      const newData = [...this.tableData, newRow]
      this.$emit('update:tableData', newData)
      this.dialogVisible = false
    },
    
    toggleEditMode() {
      this.editMode = !this.editMode
    },
    
    resetForm() {
      this.form = JSON.parse(JSON.stringify(this.formFields))
    },
    
    showAddDialog() {
      this.resetForm()
      this.dialogVisible = true
    },
    
    submitForm() {
      const newRow = { ...this.form }
      const newData = [...this.tableData, newRow]
      this.$emit('update:tableData', newData)
      this.dialogVisible = false
    },
    
    handleCellDblclick(row, column, cell, event) {
      if (this.editMode) {
        return
      }
      this.editingRow = row.xuhao
      this.editingcolumn = column.property
      this.editingValue = row[column.property]
      this.dialogVisible1 = true
    },
    
    updateValue() {
      if (this.editingRow !== null) {
        const newData = [...this.tableData]
        if (!this.isNumeric(this.editingValue)) {
          newData[this.editingRow][this.editingcolumn] = this.editingValue
        } else {
          newData[this.editingRow][this.editingcolumn] = Number(this.editingValue)
        }
        this.$emit('update:tableData', newData)
      }
      this.dialogVisible1 = false
    },
    
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    
    deleteSelectedRows() {
      if (this.selectedRows.length > 0) {
        const newData = this.tableData.filter(item => !this.selectedRows.includes(item))
        this.$emit('update:tableData', newData)
        this.selectedRows = []
      }
    },
    
    async save() {
      try {
        await dbInstance.save(this.storageKey, this.tableData);
        this.$message.success('数据保存成功');
        this.$emit('save-success');
      } catch (error) {
        console.error('保存数据时出错:', error);
        this.$message.error('保存数据失败: ' + (error.message || '未知错误'));
        this.$emit('save-error', error);
      }
    },
    
    async silentsave() {
      try {
        await dbInstance.save(this.storageKey, this.tableData);
        this.$emit('save-success');
      } catch (error) {
        console.error('保存数据时出错:', error);
        this.$message.error('保存数据失败: ' + (error.message || '未知错误'));
        this.$emit('save-error', error);
      }
    },
    
    async loadData() {
      try {
        const data = await dbInstance.load(this.storageKey)
        if (data) {
          this.$emit('update:tableData', data)
          this.$emit('load-success')
        }
      } catch (error) {
        console.error('加载数据时出错:', error)
        this.$message.error('加载数据失败，请重试')
        this.$emit('load-error', error)
      }
    },
    // 触发文件上传
    handleFileUpload(row, prop) {
      const inputRef = `fileInput_${this.tableData.indexOf(row)}_${prop}`;
      this.$refs[inputRef][0].click();
    },
    
    // 处理文件选择
    async onFileChange(e, row, prop) {
      const file = e.target.files[0];
      if (!file) return;
      
        try {
        await this.$confirm('这会删除原本的文件，确定吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        
        // 获取文件信息
        const fileInfo = row[prop];
        
        const response = await axios.delete('/api/delete', {
          data: {
            filename: fileInfo.filename,
            path: fileInfo.path
          }
        });
        
        
      } catch (error) {
        if (error !== 'cancel') { // 不是用户取消的情况
          console.error('删除文件失败:', error);
          this.$message.error('删除文件失败: ' + (error.message || '未知错误'));
        } else {
          this.$message.info('已取消上传');
          
          return
        }

      }
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // 添加原始文件名到FormData
        formData.append('originalname', encodeURIComponent(file.name));
        
        console.log('准备上传的文件:', file);
        console.log('FormData内容:');
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        const res = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('上传响应:', res.data);
        
        // 确保响应中包含原始文件名
        const responseData = {
          ...res.data,
          originalname: decodeURIComponent(res.data.originalname || file.name)
        };
        
        // 创建新对象确保Vue能检测到变化
        const newRow = {
          ...row,
          [prop]: { 
            originalname: responseData.originalname,
            filename: responseData.filename,
            size: responseData.size,
            path: decodeURIComponent(responseData.path),
            url: responseData.url
          }
        };
        
        // 更新表格数据
        const index = this.tableData.indexOf(row);
        this.tableData.splice(index, 1, newRow);
        this.calculateVariables(newRow)
        this.$emit('update:tableData', [...this.tableData]);
        
        this.$message.success('文件上传成功');
      } catch (error) {
        console.error('上传失败:', error);
      } finally {
        // 重置文件输入，允许重复上传相同文件
        e.target.value = '';
      }
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    handleFileView(row, prop) {
      if (!row[prop]) return;
      
      const fileInfo = row[prop];
      console.error(fileInfo);
      // 强制替换端口号
      const correctUrl = fileInfo.path.replace(':3001', ':3000');
      window.open(fileInfo.url, '_blank');
    },

    async handleFileDelete(row, prop) {
      try {
        await this.$confirm('确定要删除这个文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        
        // 获取文件信息
        const fileInfo = row[prop];
        if (!fileInfo) return;
        
        // 1. 先调用API删除服务器上的文件
        const response = await axios.delete('/api/delete', {
          data: {
            filename: fileInfo.filename,
            path: fileInfo.path
          }
        });
        
        if (response.data.success) {
          // 2. 更新前端表格数据
          const newRow = { ...row, [prop]: null };
          const index = this.tableData.indexOf(row);
          this.tableData.splice(index, 1, newRow);
          this.calculateVariables(newRow)
          this.$emit('update:tableData', [...this.tableData]);
          
          this.$message.success('文件已删除');
        } else {
          throw new Error(response.data.error || '删除文件失败');
        }
      } catch (error) {
        if (error !== 'cancel') { // 不是用户取消的情况
          console.error('删除文件失败:', error);
          this.$message.error('删除文件失败: ' + (error.message || '未知错误'));
        } else {
          this.$message.info('已取消删除');
        }
      }
    },
  },
  beforeDestroy() {
    this.silentsave().catch(error => {
      console.error('自动保存失败:', error);
    });
  },
  watch: {
      tableData: {
        deep: true,
        handler(newVal) {
          newVal.forEach(row => {
            this.calculateVariables(row)
          })
        }
      }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.table-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background-color: transparent; /* 改为透明背景 */
}

.table-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  background-color: transparent; /* 改为透明背景 */
}

.table-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  margin-bottom: 15px;
}

.table-footer {
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.select-small {
  max-width: 180px;
}

#table {
  color: rgb(255, 255, 255) !important;
  font-weight: 600;
  
  ::v-deep .el-table {
    border: 1px solid #e0e0e0;
    background-color: transparent !important; /* 改为透明背景 */
    
    th, td {
      border-right: 1px solid #e0e0e0 !important;
      &:last-child {
        border-right: none !important;
      }
    }
    
    &::before {
      display: none;
    }
  }
  
  ::v-deep .cell {
    color: white;
    padding: 0 10px;
  }

  ::v-deep .el-table__header th {
    padding: 0;
    height: auto;
    line-height: normal;
    background-color: rgba(245, 247, 250, 0.7); /* 改为半透明背景 */
    color: white;
    font-weight: bold;
  }

  ::v-deep .el-table__body tr,
  ::v-deep .el-table__body td {
    padding: 0;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #e0e0e0;
    background-color: transparent; /* 改为透明背景 */
  }

  ::v-deep .el-table__expanded-cell {
    background-color: transparent !important;
  }

  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table td {
    background-color: transparent;
  }
  
  /* 多行表头样式 */
  ::v-deep .multi-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    
    .header-row {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      
      &.main-header {
        font-weight: bold;
        padding: 5px 0;
      }
      
      &.sub-header {
        display: flex;
        border-top: 1px solid #e0e0e0;
        
        span {
          flex: 1;
          padding: 5px;
          &:not(:last-child) {
            border-right: 1px solid #e0e0e0;
          }
        }
      }
    }
  }
  
  /* 日期选择器样式 */
  ::v-deep .el-date-editor .el-input__inner {
    padding-left: 30px;
  }
  
  /* 下拉选择器样式 */
  ::v-deep .el-select .el-input__inner {
    padding-right: 30px;
  }
  
  .file-cell {
    display: flex;
    flex-direction: column;
    padding: 8px 10px;
    
    .uploaded-files {
      margin-bottom: 8px;
      word-break: break-all;
    }
    
    button {
      margin: 2px 0;
      width: 100%;
    }
  }
}

.clickable {
  cursor: pointer;
  color: white;
  text-decoration: underline;
}
</style>