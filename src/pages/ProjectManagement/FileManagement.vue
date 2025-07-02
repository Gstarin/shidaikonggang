<template>
    <div id="app">
        <b-breadcrumb>
            <b-breadcrumb-item>项目管理</b-breadcrumb-item>
            <b-breadcrumb-item active>文件管理</b-breadcrumb-item>
        </b-breadcrumb>
        <!-- <h1 class="page-title fw-semi-bold">文件管理</h1> -->
        <b-row>
            <b-col>
                <Widget title="<h5>文件管理</h5>" customHeader settings close>
                    <TableTemplate ref="tableTemplate" :tableData="files" :columns="columns" :formFields="{}"
                        :storageKey="'fileManager'">
                        <template v-slot:custom-filter3>
                            <el-upload class="upload-demo" :action="uploadUrl" :http-request="upload"
                                :on-success="handleUploadSuccess" :on-error="handleUploadError">
                                <el-button type="primary">上传文件</el-button>
                            </el-upload>
                        </template>
                    </TableTemplate>

                </Widget>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from '@/utils/axios.js'
import Widget from '@/components/Widget/Widget';
import TableTemplate from '@/components/Template/xlsxTable'

export default {
    name: 'App',
    components: { Widget, TableTemplate },
    data() {
        return {
            newFolderName: '',
            folderTree: [
                { name: 'root', children: [], files: [] }
            ],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            currentFolder: null,
            files: [],
            uploadUrl: '/api/upload',
            columns: [
                { prop: 'name', label: '文件名' },
                {
                    label: '操作',
                    render: (row) => `
      <el-button type="primary" size="mini" onclick="window.__downloadFile('${row.name}')">下载</el-button>
      <el-button type="danger" size="mini" onclick="window.__deleteFile('${row.name}')">删除</el-button>
    `
                }
            ],

        }
    },
    mounted() {
        axios.get('/api/data/tree').then(response => {
            // console.log('Fetched JSON:', response.data);
            this.folderTree = response.data
        }).catch(error => {
            console.error('Error fetching JSON:', error);
        });
        // window.__downloadFile = (fileName) => {
        //     this.downloadFile({ name: fileName });
        // };
        // window.__deleteFile = (fileName) => {
        //     const file = this.files.find(f => f.name === fileName);
        //     if (file) this.deleteFile(file);
        // };
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
        upload(res) {
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
        // gpt
        // upload(res) {
        //     const formData = new FormData();
        //     formData.append("file", res.file);
        //     formData.append("fileName", res.file.name);
        //     axios.post("/api/save/file", formData).then((response) => {
        //         this.$message.success("上传成功");
        //         const uploadedName = response.data;
        //         this.currentFolder.files.push({ name: uploadedName });
        //         this.files = this.currentFolder.files;
        //     }).catch(() => {
        //         this.$message.error("上传失败");
        //     });
        // },
        createFolder() {
            if (this.newFolderName.trim()) {
                this.currentFolder.children.push({ name: this.newFolderName, children: [], files: [] });
                this.newFolderName = '';
            }
        },
        deleteFolder(node, data) {
            this.$confirm(`确定删除文件夹 "${data.name}"?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (data.name === "root") {
                    this.$message.error('无法删除根目录！');
                } else {
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