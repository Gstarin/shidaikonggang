<!-- HistoryViewer.vue -->
<template>
  <div>
    <b-button 
      variant="warning" 
      class="mr-3 mb-2 custom-btn" 
      size="sm" 
      @click="showDialog"
      :disabled="loading"
    >
      <b-spinner small v-if="loading"></b-spinner>
      查看历史
    </b-button>

    <el-dialog  
      v-draggable
      :title="title"  
      :visible.sync="dialogVisible"  
      width="60%"
      top="5vh"
    >  
      <el-table 
        :data="historyData" 
        style="width: 100%" 
        height="500"
        border
        v-loading="loading"
        @row-click="handleRowClick"
      >
        <el-table-column 
          prop="timestamp" 
          label="时间" 
          width="180"
          :formatter="formatTimestamp"
        ></el-table-column>
        <el-table-column 
          prop="description" 
          label="描述"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column 
          label="操作" 
          width="120"
        >
          <template v-slot="scope">
            <el-button 
              type="primary" 
              size="mini" 
              @click.stop="handleRestore(scope.row)"
              :loading="scope.row.loading"
            >
              恢复
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">  
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>  
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/utils/axios.js'

export default {
  name: 'HistoryViewer',
  props: {
    // 存储键名，用于确定历史记录路径
    storageKey: {
      type: String,
      required: true
    },
    // 对话框标题
    title: {
      type: String,
      default: '历史记录'
    },
    // 是否在恢复后自动保存
    autoSave: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      historyData: [],
      loading: false
    }
  },
  methods: {
    async showDialog() {
      this.dialogVisible = true
      this.loading = true
      try {
        const response = await axios.get('/api/get-file', {
          params: {
            path: `data/${this.storageKey}/history.json`
          }
        })
        console.error(`data/${this.storageKey}/history.json`)
        this.historyData = response.data || []
      } catch (error) {
        console.error('获取历史记录失败:', error)
        this.$message.error('获取历史记录失败: ' + (error.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },
    
    formatTimestamp(row, column, cellValue) {
      return new Date(cellValue).toLocaleString()
    },
    
    async handleRestore(historyItem) {
      try {
        await this.$confirm('确定要恢复这个历史版本吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        this.$set(historyItem, 'loading', true)
        const response = await axios.get('/api/get-file', {
          params: {
            path: historyItem.filePath
          }
        })
        
        this.$emit('restore', response.data)
        this.$message.success('历史版本恢复成功')
        
        if (this.autoSave) {
          this.$emit('save')
        }
        
        this.dialogVisible = false
      } catch (error) {
        if (error !== 'cancel') {
          console.error('恢复历史版本失败:', error)
          this.$message.error('恢复历史版本失败: ' + (error.message || '未知错误'))
        }
      } finally {
        this.$set(historyItem, 'loading', false)
      }
    },
    
    handleRowClick(row) {
      this.$emit('row-click', row)
    }
  }
}
</script>