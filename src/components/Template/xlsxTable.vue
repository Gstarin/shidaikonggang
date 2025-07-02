<!-- TableTemplate.vue -->
<template>
  <div class="table-container">
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @change="onFileChange($event, currentRow, currentProp)"
    >
    <div class="table-header d-flex align-items-center mb-3">
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
        
        <!-- 统一处理所有列 -->
        <template v-for="column in processedColumns">
          <!-- 有子列的情况 -->
          <el-table-column 
            v-if="column.children && column.children.length"
            :key="column.label"
            :label="column.label"
            :width="column.width"
          >
            <el-table-column 
              v-for="child in column.children"
              :key="child.prop"
              :prop="child.prop"
              :label="child.label"
              :width="child.width"
            >
              <template v-slot="scope">
                <table-cell
                  :column="child"
                  :row="scope.row"
                  :edit-mode="editMode"
                  @file-upload="handleFileUpload"
                  @file-view="handleFileView"
                  @file-delete="handleFileDelete"
                  @row-click="$emit('row-click', scope.row)"
                />
              </template>
            </el-table-column>
          </el-table-column>
          
          <!-- 没有子列的情况 -->
          <el-table-column 
            v-else
            :key="column.prop"
            :prop="column.prop" 
            :label="column.label" 
            :width="column.width"
          >
            <template v-slot="scope">
              <table-cell
                :column="column"
                :row="scope.row"
                :edit-mode="editMode"
                @file-upload="handleFileUpload"
                @file-view="handleFileView"
                @file-delete="handleFileDelete"
                @row-click="$emit('row-click', scope.row)"
              />
            </template>
          </el-table-column>
        </template>
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
            v-if="!column.children"
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

// 独立的单元格组件
const TableCell = {
  props: ['column', 'row', 'editMode'],
  render(h) {
    const { column, row, editMode } = this
    
    // 变量类型字段
    if (column.type === 'variable') {
      return h('span', row[column.prop])
    }
    
    // 操作按钮类型
    if (column.type === 'actions') {
      return h('div', { class: 'action-buttons' }, 
        column.actions.map(action => 
          h('b-button', {
            props: {
              variant: action.variant || 'default',
              size: action.size || 'sm'
            },
            class: 'mr-2',
            on: {
              click: e => {
                e.stopPropagation()
                action.handler(row)
              }
            }
          }, action.label)
        )
      )
    }
    
    // 文件类型字段
    if (column.type === 'file') {
      return h('div', { class: 'file-cell' }, [
        h('div', { class: 'uploaded-files' }, [
          !row[column.prop] ? h('span', '无') : h('span', [
            row[column.prop].originalname,
            h('br'),
            h('small', `(${this.formatFileSize(row[column.prop].size)})`)
          ])
        ]),
        h('b-button', {
          props: {
            variant: 'outline-primary',
            size: 'sm'
          },
          class: 'mt-2',
          on: {
            click: () => this.$emit('file-upload', row, column.prop)
          }
        }, '上传文件'),
        h('b-button', {
          props: {
            variant: 'outline-info',
            size: 'sm',
            disabled: !row[column.prop]
          },
          class: 'mt-2',
          on: {
            click: () => this.$emit('file-view', row, column.prop)
          }
        }, '查看文件'),
        h('b-button', {
          props: {
            variant: 'outline-danger',
            size: 'sm',
            disabled: !row[column.prop]
          },
          class: 'mt-2',
          on: {
            click: () => this.$emit('file-delete', row, column.prop)
          }
        }, '删除文件')
      ])
    }
    
    // 编辑模式下的各种控件
    if (editMode) {
      // 日期选择器
      if (column.type === 'date') {
        return h('el-date-picker', {
          props: {
            value: row[column.prop],
            type: 'date',
            placeholder: '选择日期',
            'value-format': 'yyyy-MM-dd',
            disabled: row.isTotal
          },
          style: { width: '100%' },
          on: {
            input: val => { row[column.prop] = val }
          }
        })
      }
      
      // 下拉选择
      if (column.options) {
        return h('el-select', {
          props: {
            value: row[column.prop],
            placeholder: '请选择',
            disabled: row.isTotal
          },
          style: { width: '100%' },
          on: {
            input: val => { row[column.prop] = val }
          }
        }, column.options.map(option => 
          h('el-option', {
            props: {
              label: option.label,
              value: option.value
            }
          })
        ))
      }
      
      // 数字输入
      if (column.type === 'number') {
        return h('el-input', {
          props: {
            value: row[column.prop],
            type: 'number',
            disabled: row.isTotal
          },
          on: {
            input: val => { row[column.prop] = Number(val) }
          }
        })
      }
      
      // 普通文本输入
      return h('el-input', {
        props: {
          value: row[column.prop],
          disabled: row.isTotal
        },
        on: {
          input: val => { row[column.prop] = val }
        }
      })
    }
    
    // 非编辑模式下的显示
    return h('span', {
      class: { clickable: column.slot },
      on: column.slot ? {
        click: () => this.$emit('row-click', row)
      } : {}
    }, row[column.prop])
  },
  methods: {
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i])
    },
  }
}

export default {
  components: {
    ExcelHandler,
    TableCell
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
          const isValid = col.prop && col.label
          if (col.children) {
            return col.children.every(child => child.prop && child.label)
          }
          if (col.type === 'actions') {
            return Array.isArray(col.actions) && col.actions.every(action => 
              action.label && typeof action.handler === 'function'
            )
          }
          return isValid
        })
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
      default: true
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
      editMode: false,
      currentRow: null,
      currentProp: null,
    }
  },
  computed: {
    processedColumns() {
      return this.columns
    },
    filteredItems() {
      return this.tableData || []
    },
    displayData() {
      let data = this.tableData || []
      
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
      this.$message.success('Excel导出成功')
    },
    
    handleTemplateExported() {
      this.$message.success('模板导出成功')
    },
    
    performSearch() {
      if (!this.searchText.trim()) {
        this.clearSearch()
        return
      }
      
      this.isSearching = true
      const searchTerm = this.searchText.toLowerCase()
      
      this.searchResults = this.filteredItems.filter(item => {
        return this.columns.some(column => {
          if (column.children) {
            return column.children.some(child => {
              const value = item[child.prop]
              return value && value.toString().toLowerCase().includes(searchTerm)
            })
          }
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
    
    calculateVariables(row) {
      this.columns.forEach(column => {
        if (column.type === 'variable' && typeof column.calculate === 'function') {
          this.$set(row, column.prop, column.calculate(row))
        }
        if (column.children) {
          column.children.forEach(child => {
            if (child.type === 'variable' && typeof child.calculate === 'function') {
              this.$set(row, child.prop, child.calculate(row))
            }
          })
        }
      })
    },
    
    submitForm() {
      const newRow = { ...this.form }
      this.calculateVariables(newRow)
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
        await dbInstance.save(this.storageKey, this.tableData)
        this.$message.success('数据保存成功')
        this.$emit('save-success')
      } catch (error) {
        console.error('保存数据时出错:', error)
        this.$message.error('保存数据失败: ' + (error.message || '未知错误'))
        this.$emit('save-error', error)
      }
    },
    
    async silentsave() {
      try {
        await dbInstance.save(this.storageKey, this.tableData)
        this.$emit('save-success')
      } catch (error) {
        console.error('保存数据时出错:', error)
        this.$message.error('保存数据失败: ' + (error.message || '未知错误'))
        this.$emit('save-error', error)
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
    
    handleFileUpload(row, prop) {
      this.currentRow = row
      this.currentProp = prop
      this.$refs.fileInput.click()
    },
    
    async onFileChange(e, row, prop) {
      const file = e.target.files[0]
      if (!file) return
      
      try {
        if (row[prop]) {
          await this.$confirm('这会删除原本的文件，确定吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          
          const fileInfo = row[prop]
          await axios.delete('/api/delete', {
            data: {
              filename: fileInfo.filename,
              path: fileInfo.path
            }
          })
        }
        
        const formData = new FormData()
        formData.append('file', file)
        formData.append('originalname', encodeURIComponent(file.name))
        
        const res = await axios.post('/api/uploads', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        const responseData = {
          ...res.data,
          originalname: decodeURIComponent(res.data.originalname || file.name)
        }
        
        const newRow = {
          ...row,
          [prop]: { 
            originalname: responseData.originalname,
            filename: responseData.filename,
            size: responseData.size,
            path: decodeURIComponent(responseData.path),
            url: responseData.url
          }
        }
        
        const index = this.tableData.indexOf(row)
        this.tableData.splice(index, 1, newRow)
        this.calculateVariables(newRow)
        this.$emit('update:tableData', [...this.tableData])
        
        this.$message.success('文件上传成功')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('上传失败:', error)
          this.$message.error(error.message || '文件上传失败')
        } else {
          this.$message.info('已取消上传')
        }
      } finally {
        e.target.value = ''
      }
    },
    
    handleFileView(row, prop) {
      if (!row[prop]) return
      window.open(row[prop].url, '_blank')
    },

    async handleFileDelete(row, prop) {
      try {
        await this.$confirm('确定要删除这个文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const fileInfo = row[prop]
        if (!fileInfo) return
        
        const response = await axios.delete('/api/delete', {
          data: {
            filename: fileInfo.filename,
            path: fileInfo.path
          }
        })
        
        if (response.data.success) {
          const newRow = { ...row, [prop]: null }
          const index = this.tableData.indexOf(row)
          this.tableData.splice(index, 1, newRow)
          this.calculateVariables(newRow)
          this.$emit('update:tableData', [...this.tableData])
          
          this.$message.success('文件已删除')
        } else {
          throw new Error(response.data.error || '删除文件失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除文件失败:', error)
          this.$message.error(error.message || '删除文件失败')
        } else {
          this.$message.info('已取消删除')
        }
      }
    },
    
    isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n)
    }
  },
  beforeDestroy() {
    this.silentsave().catch(error => {
      console.error('自动保存失败:', error)
    })
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
  background-color: transparent;
}

.table-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  background-color: transparent;
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
    background-color: transparent !important;
    
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
    background-color: rgba(245, 247, 250, 0.7);
    color: white;
    font-weight: bold;
  }

  ::v-deep .el-table__body tr,
  ::v-deep .el-table__body td {
    padding: 0;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #e0e0e0;
    background-color: transparent;
  }

  ::v-deep .el-table__expanded-cell {
    background-color: transparent !important;
  }

  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table td {
    background-color: transparent;
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