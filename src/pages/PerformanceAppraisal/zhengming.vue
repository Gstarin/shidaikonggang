<template>
    <div class="tables-basic">
        <b-breadcrumb>
            <b-breadcrumb-item></b-breadcrumb-item>
            <b-breadcrumb-item active>证明材料</b-breadcrumb-item>
        </b-breadcrumb>
        <b-row>
            <b-col>
                <Widget title="<h5>证明材料</h5>" customHeader settings close>
                    <div class="table-header"
                        style="width: 100%;display: flex;justify-content: center;margin-bottom: 15px;">
                        <b-input type="text" v-model="search" style="width: 360px;height: 35px;margin:0 15px;"
                            placeholder="Search..." />
                        <b-button variant="default" class="mr-3" size="sm" @click="dialogVisible = true"
                            style="width: 110px;height: 35px;">增加</b-button>
                        <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"
                             @click="handleDelete">删除</b-button>
                             <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"
                             @click="back">返回</b-button>


                    </div>
                    <div id="table">
                        <el-table :data="current" style="width: 100%"  @selection-change="handleSelectionChange">

                            <el-table-column type="selection" width="80">

                            </el-table-column>
                            <el-table-column prop="xmmc" label="材料名称" >

                            </el-table-column>
                            <el-table-column prop="type" label="材料类型" >

</el-table-column>
                            <el-table-column prop="time" label="材料" >
                                <template slot-scope="scope">
                                    <div v-if="scope.row.type=='pdf'"> 
                            <b-button variant="default" class="mr-3" size="sm" @click="upload_pdf(scope.row.xmmc,scope.row.type,scope.row)"
                          style="width: 70px;height: 35px;">上传</b-button>
                         
                          <br> <br>
                          <b-button  variant="default" class="mr-3" size="sm" @click="download_pdf(scope.row.xmmc,scope.row.type,scope.row)"
                          style="width: 70px;height: 35px;">查看</b-button>
                        </div> 

                        <div v-else-if="scope.row.type=='word'"> 
                            <b-button variant="default" class="mr-3" size="sm" @click="upload_word(scope.row.xmmc)"
                          style="width: 70px;height: 35px;">上传</b-button>
                         
                          <br> <br>
                          <b-button  variant="default" class="mr-3" size="sm" @click="download_word(scope.row.xmmc)"
                          style="width: 70px;height: 35px;">查看</b-button>
                        </div> 

                        <div v-else-if="scope.row.type=='ppt'"> 
                            <b-button variant="default" class="mr-3" size="sm" @click="upload_ppt(scope.row.xmmc)"
                          style="width: 70px;height: 35px;">上传</b-button>
                         
                          <br> <br>
                          <b-button  variant="default" class="mr-3" size="sm" @click="download_ppt(scope.row.xmmc)"
                          style="width: 70px;height: 35px;">查看</b-button>
                        </div> 

                        <div v-else-if="scope.row.type=='excel'"> 
                            <b-button variant="default" class="mr-3" size="sm" @click="upload_excel(scope.row.xmmc)"
                          style="width: 70px;height: 35px;">上传</b-button>
                         
                          <br> <br>
                          <b-button  variant="default" class="mr-3" size="sm" @click="download_excel(scope.row.xmmc)"
                          style="width: 70px;height: 35px;">查看</b-button>
                        </div> 


                        <div v-else @dblclick="toggleEditing(scope.row)">
                          <div v-if="scope.row.isEditing">
						<b-form-file
						  v-model="scope.row.picture"
						  @change="handlePictureChange($event, scope.row)"
						  accept="image/*"
						  plain
						></b-form-file>
					  </div>
					  <div v-else>
						<img
                        @click="toggleModal"
						  class="img-rounded"
						  :src="scope.row.picture"
						  alt=""
						  height="50"
						/>
                        <div v-if="isModalVisible" class="modal">  
      <img :src="scope.row.picture" alt="" class="modal-content">  
      <button @click="toggleModal">关闭</button>  
    </div>
					  </div>
                    </div>
                            </template >  
                            </el-table-column>
                    


                        </el-table>
                    </div>
					<el-dialog :visible.sync="dialogVisible" title="上传日志">
					      <el-form ref="form" :model="form" label-width="120px">
                            <el-form-item label="材料名称">
					          <el-input v-model="form.xmmcc" ></el-input>
					        </el-form-item>
                            <el-form-item label="材料类型">
                                <el-select v-model="form.typee">
				<el-option label="pdf" value="pdf" />
				<el-option label="图片" value="图片" />
                <el-option label="word" value="word" />
                <el-option label="ppt" value="ppt" />
                <el-option label="excel" value="excel" />
			  </el-select>
					        </el-form-item>
					      
                            
					      </el-form>


					      <span slot="footer" class="dialog-footer">
					        <el-button @click="dialogVisible = false">取 消</el-button>
					        <el-button type="primary" @click="submitForm">确 定</el-button>
					      </span>
					</el-dialog>
                    <div class="table-footer">
                        <b-pagination v-model="currentPage" :total-rows="rows" size="lg"></b-pagination>
                    </div>
                </Widget>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import Sparklines from '../../components/Sparklines/Sparklines'
import * as XLSX from 'xlsx/xlsx.mjs'
import axios from '@/utils/axios.js'

export default {
    name: 'xmjd2',
    components: { Widget, Sparklines },
    data() {
        return {
            isModalVisible: false,  
            dialogVisible: false,
            multipleSelection : [],  
            form: {
                date: new Date().toISOString().slice(0,10), // 当前日期
                namee: '', // 操作人
                xmmcc:"",
                jinduu:"",
                beizhuu:"",
                pizhuu:"",
                typee:""
            },
            file: null,
            currentPage: 1,
            search: "",
            tableData: [],
            namee:"",
            project_id:0,
            nodeId: null,
            projectId: null,
            idd: null
        };
    },
    mounted() {
        this.nodeId = this.$route.query.id;
        this.projectId = this.$route.query.projectId;
        this.idd = this.$route.query.idd;
        
        axios.post('/api/save/xmjdd', { "iddd": this.nodeId + this.idd }, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            console.log('证明材料数据获取成功');
            this.tableData = response.data;
        })
        .catch(error => {
            console.error('获取证明材料数据时出错：', error);
        });
    },
    beforeDestroy() {
        console.log(this.nodeId + this.idd);
        if (this.tableData.length > 0) {
            axios.post('/api/save/xmjd2', [this.tableData, this.nodeId + this.idd], {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                console.log('已成功上传');
            })
            .catch(error => {
                console.error('上传证明材料数据时出错：', error);
            });
        }
    },
    computed: {
        filteredItems() {
            return this.tableData;
        },
        current() {
            const start = (this.currentPage - 1) * 20;
            const end = start + 20;
            console.log(this.filteredItems.slice(start, end));
            return this.filteredItems.slice(start, end);
        },
        rows() {
            return this.filteredItems.length;
        },
    },
    methods: {
        back() {
        if(this.nodeId!=undefined)
        {
            this.$router.push({
                path:"/app/ProjectManagement/ProjectManagement1",
            });
        }
        else{
            this.$router.push({
                path:"/app/PerformanceAppraisal/rwjx" ,
            });
        }
        },
        toggleModal() {  
            this.isModalVisible = !this.isModalVisible;  
        },
        upload_word(id){
                 var that = this;
                const vm = this;
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "application/application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                input.addEventListener("change", function () {
                    const formData = new FormData();
                    formData.append("pdf", input.files[0]);
                    formData.append("projectName", that.projectId);
                    formData.append("pdfName", that.nodeId + id);
                    axios
                        .post("/api/save/word", formData)
                        .then((response) => {
                            that.$message({
                                message: "WORD上传成功",
                                type: "success",
                            });
                        })
                        .catch((error) => {
                            console.error("上传 WORD 文件时出错：", error);
                        });
                });
                input.click();
        },

        download_word(id){
            var that = this;
                axios
                    .get(
                        `http://8.130.106.134:5000/download_word?projectName=${that.projectId}&pdfName=${that.nodeId +id}`
                    )
                    .then((response) => {
                        const url = "http://8.130.106.134:5000/" + response.data;
                        window.open(url, "_blank");
                    })
                    .catch((error) => {
                        that.$message({
                            message: "word暂未上传",
                            type: "error",
                        });
                    });
},

upload_ppt(id){
                 var that = this;
                const vm = this;
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
                input.addEventListener("change", function () {
                    const formData = new FormData();
                    formData.append("pdf", input.files[0]);
                    formData.append("projectName", that.projectId);
                    formData.append("pdfName", that.nodeId + id);
                    axios
                        .post("/api/save/ppt", formData)
                        .then((response) => {
                            that.$message({
                                message: "ppt上传成功",
                                type: "success",
                            });
                        })
                        .catch((error) => {
                            console.error("上传 ppt 文件时出错：", error);
                        });
                });
                input.click();
        },

        download_ppt(id){
            var that = this;
                axios
                    .get(
                        `http://8.130.106.134:5000/download_ppt?projectName=${that.projectId}&pdfName=${that.nodeId +id}`
                    )
                    .then((response) => {
                        const url = "http://8.130.106.134:5000/" + response.data;
                        window.open(url, "_blank");
                    })
                    .catch((error) => {
                        that.$message({
                            message: "ppt暂未上传",
                            type: "error",
                        });
                    });
},


upload_excel(id){
                 var that = this;
                const vm = this;
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                input.addEventListener("change", function () {
                    const formData = new FormData();
                    formData.append("pdf", input.files[0]);
                    formData.append("projectName", that.projectId);
                    formData.append("pdfName", that.nodeId + id);
                    axios
                        .post("/api/save/excel", formData)
                        .then((response) => {
                            that.$message({
                                message: "excel上传成功",
                                type: "success",
                            });
                        })
                        .catch((error) => {
                            console.error("上传 excel 文件时出错：", error);
                        });
                });
                input.click();
        },

        download_excel(id){
            var that = this;
                axios
                    .get(
                        `http://8.130.106.134:5000/download_excel?projectName=${that.projectId}&pdfName=${that.nodeId +id}`
                    )
                    .then((response) => {
                        const url = "http://8.130.106.134:5000/" + response.data;
                        window.open(url, "_blank");
                    })
                    .catch((error) => {
                        that.$message({
                            message: "excel暂未上传",
                            type: "error",
                        });
                    });
},




        upload_pdf(id, type, row) {
            console.log(id);
            if (type == "pdf") {
                var that = this;
                const vm = this;
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "application/pdf";
                input.addEventListener("change", function () {
                    const formData = new FormData();
                    formData.append("pdf", input.files[0]);
                    formData.append("projectName", that.projectId);
                    formData.append("pdfName", that.nodeId + that.idd);
                    axios
                        .post("/api/save/pdf", formData)
                        .then((response) => {
                            that.$message({
                                message: "PDF上传成功",
                                type: "success",
                            });
                        })
                        .catch((error) => {
                            console.error("上传 PDF 文件时出错：", error);
                        });
                });
                input.click();
            }
        },
        download_pdf(id, type, row) {
            if (type == "pdf") {
                var that = this;
                axios
                    .get(
                        `/api/data/pdf?projectName=${that.projectId}&pdfName=${that.nodeId + that.idd}`
                    )
                    .then((response) => {
                        const url = "http://8.130.106.134:5000/" + response.data;
                        window.open(url, "_blank");
                    })
                    .catch((error) => {
                        that.$message({
                            message: "PDF暂未上传",
                            type: "error",
                        });
                    });
            } else {
                console.log(this.file);
                window.open(this.file, "_blank");
            }
        },
        handleSelectionChange(val) {  
            this.multipleSelection = val;
        },  
        handleDelete() {  
            const set = new Set(this.multipleSelection);  
            this.tableData = this.tableData.filter(item => !set.has(item));  
            this.multipleSelection = [];  
        },  
        resetForm() {
            this.form = {
                date: "", // 当前日期
                namee: '', // 操作人
                xmmcc:"",
                jinduu:"",
                beizhuu:"",
                pizhuu:"",
                typee:"",
            };
        },
        handleFileChange(file, fileList) {
            console.log(typeof file);
            this.form.file = file.raw;
        },
        submitForm() {
            console.log(typeof this.form.file);
            const newRow = {
                id: this.tableData.length + 1,
                time: this.form.date,
                name: this.form.namee,
                jindu: this.form.jinduu,
                beizhu: this.form.beizhuu,
                xmmc: this.form.xmmcc,
                pizhu: this.form.pizhuu,
                type: this.form.typee,
                isEditing: true
            };
            this.tableData.push(newRow);
            this.resetForm();
            this.dialogVisible = false;
        },
        handlePictureChange(event, item) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    item.picture = e.target.result; // 设置图片预览
                    item.isEditing = false; // 完成上传后关闭编辑状态
                };
                reader.readAsDataURL(file);
            }
        },
        toggleEditing(item) {
            console.log(item);
            item.isEditing = true;
        },
        handleFileUpload(event) {  
            console.log(event);
            const files = event.target.files;  
            if (files.length > 0) {  
                const file = files[0];  
                const reader = new FileReader();  
                reader.onload = (e) => {  
                    console.log(e.target.result);
                    this.file = e.target.result;
                };  
                reader.readAsDataURL(file);  
            }  
        },  
    },
};
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.table-header {
    width: 50%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;
}

.table-footer {
    // background-color: red;
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal {  
  display: flex;  
  align-items: center;  
  justify-content: center;  
  position: fixed;  
  top: 0;  
  left: 0;  
  width: 100%;  
  height: 100%;  
  background-color: rgba(0, 0, 0, 0.5);  
  z-index: 1000;  
}  
  
.modal-content {  
  max-width: 90%;  
  max-height: 80%;  
}  
#table {

    //background-color: red;
    // 表格文字间距、颜色
    ::v-deep .cell {
        // padding: 0;
        color: #9f9fad;
    }

    // 表头高度
    ::v-deep .el-table__header th {
        padding: 0;
        height: 50px;
        line-height: 50px;

    }

    ::v-deep .el-table__body tr,
    ::v-deep.el-table__body td {
        padding: 5px 0;
        height: 50px;
        line-height: 50px;
    }

    ::v-deep .el-table {
        background-color: transparent !important;
        color: #9f9fad !important;
    }

    ::v-deep .el-table__expanded-cell {
        background-color: transparent !important;
    }

    // 透明背景
    ::v-deep .el-table th,
    ::v-deep .el-table tr,
    ::v-deep .el-table td {
        background-color: transparent;
    }

    // 下划线改成黑色
    // ::v-deep .el-table td,
    // ::v-deep .el-table th.is-leaf {
    //   border-bottom: 1px solid #000;
    // }

    // ::v-deep .el-table::before {
    //   //去掉最下面的那一条线
    //   height: 0px;
    // }


}
</style>