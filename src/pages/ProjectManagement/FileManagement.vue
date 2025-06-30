<template>
  <div id="app">
    <b-breadcrumb>
      <b-breadcrumb-item>项目管理</b-breadcrumb-item>
      <b-breadcrumb-item active>文件管理</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">文件管理</h1>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="6">
            <div class="folder-actions" style="display: flex; align-items: center; margin-bottom: 10px;">
              <el-input v-model="newFolderName" placeholder="新建文件夹" style="margin-right: 10px;" />
              <el-button type="primary" @click="createFolder" style="margin-right: 10px;">新建</el-button>
            </div>
            <el-tree :data="folderTree" :props="defaultProps" @node-click="handleFolderClick">
              <span slot-scope="{ node, data }">
                <i class="el-icon-folder"></i>
                <span>{{ data.name }}</span>
                <el-button
                  type="text"
                  size="mini"
                  @click.stop="deleteFolder(node, data)"
				  style="margin-left: 5rem;"
                >删除</el-button>
              </span>
            </el-tree>
          </el-col>
          <el-col :span="16" style="margin-left: 5%;">
            <div v-if="currentFolder" class="file-actions" style="display: flex; align-items: center; margin-bottom: 10px;">
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
				:http-request="upload"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
              >
                <el-button type="primary">上传文件</el-button>
              </el-upload>
            </div>
            <div v-if="currentFolder">
              <el-table :data="files">
                <el-table-column prop="name" label="文件名" />
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="downloadFile(scope.row)">
                      下载
                    </el-button>
                    <el-button type="danger" size="mini" @click="deleteFile(scope.row)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else>
              请选择一个文件夹
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from '@/utils/axios.js'
export default {
  name: 'App',
  data() {
    return {
      newFolderName: '',
      folderTree: [
        { name: 'root', children: [], files: []}
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      currentFolder: null,
      files: [],
      uploadUrl: '/api/upload'
    }
  },
  mounted() {
    axios.get('/api/data/tree').then(response => {
      // console.log('Fetched JSON:', response.data);
      this.folderTree = response.data
    }).catch(error => {
      console.error('Error fetching JSON:', error);
    });
  },
  beforeDestroy() {
    axios.post('/api/save/tree', this.folderTree, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('上传成功');
      })
      .catch(error => {
        console.error('出错：', error);
      });
  },
  methods: {
	upload(res){
		console.log(res)
		var that = this;
		const formData = new FormData();
		formData.append("file", res.file);
		// formData.append("projectName", that.project_id);
		formData.append("fileName", res.file.name);
		axios
		  .post("/api/save/file", formData)
		  .then((response) => {
		    that.$message({
		      message: "文件上传成功",
		      type: "success",
		    });
			console.log(response)
			that.currentFolder.files.push({ name: response.data })
			that.files = that.currentFolder.files
		  })
		  .catch((error) => {
		    console.error("上传文件时出错：", error);
		  });
	},
    createFolder() {
      if (this.newFolderName.trim()) {
        this.currentFolder.children.push({ name: this.newFolderName, children: [], files: []});
        this.newFolderName = '';
      }
    },
    deleteFolder(node, data) {
      this.$confirm(`确定删除文件夹 "${data.name}"?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
		if (data.name === "root"){
			this.$message.error('无法删除根目录！');
		}else{
			const parent = node.parent;
			const children = parent.data.children || parent.data;
			const index = children.findIndex(item => item.name === data.name);
			children.splice(index, 1);
		}
      }).catch(() => {
        // 取消删除
      });
    },
    handleFolderClick(data) {
      this.currentFolder = data;
      this.files = data.files;
    },
    handleUploadSuccess(response, file, fileList) {
      this.$message.success('上传成功');
      this.currentFolder.files.push({ name: file.name });
    },
    handleUploadError(err, file, fileList) {
      this.$message.error('上传失败');
    },
    downloadFile(file) {
      // 实现下载文件的逻辑
      console.log('下载文件: ', file.name);
	  var that = this;
	  axios.get(
	      `/api/data/file?fileName=${file.name}`
	    ).then((response) => {
	      const url = "http://8.130.106.134:5000/" + response.data;
	      window.open(url, "_blank");
	    }).catch((error) => {
	      that.$message({
	        message: "文件下载失败",
	        type: "error",
	      });
	    });
    },
    deleteFile(file) {
      this.$confirm(`确定删除文件 "${file.name}"?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.files.findIndex(item => item.name === file.name);
        this.files.splice(index, 1);
        this.$message.success('删除成功');
      }).catch(() => {
        // 取消删除
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #409EFF;
  color: #fff;
  line-height: 60px;
  text-align: center;
}
</style>