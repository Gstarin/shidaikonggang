<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>项目管理</b-breadcrumb-item>
      <b-breadcrumb-item active>文件管理</b-breadcrumb-item>
    </b-breadcrumb>

    <b-row>
      <b-col>
        <Widget title="<h5>文件管理</h5>" customHeader settings close>
          <el-row>
            <el-col :span="6">
              <!-- 📁 文件夹树 -->
              <div class="folder-actions" style="display: flex; margin-bottom: 10px;">
                <el-input v-model="newFolderName" placeholder="新建文件夹" style="margin-right: 10px;" />
                <el-button type="primary" @click="createFolder">新建</el-button>
              </div>

              <el-tree :data="folderTree" :props="defaultProps" node-key="name" @node-click="handleFolderClick">
                <span slot-scope="{ node, data }">
                  <i class="el-icon-folder"></i>
                  <span>{{ data.name }}</span>
                  <el-button
                    v-if="data.name !== 'root'"
                    type="text"
                    size="mini"
                    style="margin-left: 5rem;"
                    @click.stop="deleteFolder(node, data)"
                  >删除</el-button>
                </span>
              </el-tree>
            </el-col>

            <el-col :span="17" style="margin-left: 2%;">
              <div v-if="currentFolder" style="margin-bottom: 10px;">
                <el-upload
                  :http-request="upload"
                  :show-file-list="false"
                >
                  <el-button type="primary">上传文件</el-button>
                </el-upload>
              </div>

              <xlsx-table
                v-if="currentFolder"
                :columns="columns"
                :table-data.sync="files"
                :form-fields="{}"
                :show-form="false"
                :show-delete="false"
                :show-add="false"
                :clickable-columns="[]"
              >
                <template v-slot:action="scope">
                  <el-button size="mini" type="primary" @click="downloadFile(scope.row)">下载</el-button>
                  <el-button size="mini" type="danger" @click="deleteFile(scope.row)">删除</el-button>
                </template>
              </xlsx-table>

              <el-alert v-else type="info" title="请选择一个文件夹以查看文件内容" show-icon />
            </el-col>
          </el-row>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget.vue'
import XlsxTable from '@/components/Template/xlsxTable.vue'
import axios from '@/utils/axios.js'

export default {
  name: 'FileManager',
  components: { Widget, XlsxTable },
  data() {
    return {
      newFolderName: '',
      folderTree: [{ name: 'root', children: [], files: [] }],
      defaultProps: { children: 'children', label: 'name' },
      currentFolder: null,
      files: [],
      columns: [
        { prop: 'name', label: '文件名' }
      ]
    }
  },
  mounted() {
    axios.get('/api/data/tree').then(res => {
      this.folderTree = res.data || [{ name: 'root', children: [], files: [] }]
    })
  },
  beforeDestroy() {
    axios.post('/api/save/tree', this.folderTree, {
      headers: { 'Content-Type': 'application/json' }
    }).then(() => {
      console.log('结构保存成功')
    })
  },
  methods: {
    createFolder() {
      if (!this.currentFolder) {
        this.$message.warning('请先选择一个父目录')
        return
      }
      if (this.newFolderName.trim()) {
        this.currentFolder.children.push({
          name: this.newFolderName.trim(),
          children: [],
          files: []
        })
        this.newFolderName = ''
      }
    },
    deleteFolder(node, data) {
      this.$confirm(`确定删除文件夹 "${data.name}"?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(item => item.name === data.name)
        children.splice(index, 1)
      })
    },
    handleFolderClick(data) {
      this.currentFolder = data
      this.files = data.files
    },
    upload({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileName', file.name)
      axios.post('/api/save/file', formData)
        .then(res => {
          this.currentFolder.files.push({ name: res.data })
          this.$message.success('上传成功')
        })
        .catch(() => {
          this.$message.error('上传失败')
        })
    },
    downloadFile(file) {
      axios.get(`/api/data/file?fileName=${file.name}`)
        .then(res => {
          window.open("http://8.130.106.134:5000/" + res.data, "_blank")
        })
        .catch(() => {
          this.$message.error('下载失败')
        })
    },
    deleteFile(file) {
      this.$confirm(`确定删除文件 "${file.name}"?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idx = this.files.findIndex(f => f.name === file.name)
        this.files.splice(idx, 1)
        this.$message.success('删除成功')
      })
    }
  }
}
</script>
