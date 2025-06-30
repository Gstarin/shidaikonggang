<template>
    <div class="tables-basic">
        <b-breadcrumb>
            <b-breadcrumb-item>瑞景园林</b-breadcrumb-item>
            <b-breadcrumb-item active>合同档案</b-breadcrumb-item>
        </b-breadcrumb>
        <b-row>
            <b-col>
                <Widget title="<h5>合同档案</h5>" customHeader settings close>
                    <div class="table-header"
                        style="width: 100%;display: flex;justify-content: center;margin-bottom: 15px;">
                        <b-input type="text" v-model="search" style="width: 360px;height: 35px;margin:0 15px;"
                            placeholder="Search..." />
                        <b-button variant="default" class="mr-3" size="sm" @click="dialogVisible = true"
                            style="width: 110px;height: 35px;">增加</b-button>
                        <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"
                        @click="handleDelete">删除</b-button>
                        <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"
                       @click="saveData">保存</b-button>

                    </div>
                    <div id="table">
                        <el-table :data="current" style="width: 100%" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="80"></el-table-column>

                            <el-table-column prop="htmc" label="合同名称" width="80">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.htmc" class="white-input"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column prop="xgdw" label="相关单位" width="180">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.xgdw" class="white-input"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column prop="begin" label="签订日期" width="100">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.begin" class="white-input"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column prop="end" label="结束日期" width="120">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.end" class="white-input"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column prop="money" label="合同金额" width="120">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.money" class="white-input"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column prop="pdf" label="PDF材料">
                                <template slot-scope="scope">
                                    <div class="button-container">
                                        <el-button @click="upload_pdf(scope.row.id)">上传</el-button>
                                        <el-button @click="download_pdf(scope.row.id)">查看</el-button>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column prop="name" label="负责人">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.name" class="white-input"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
					<el-dialog :visible.sync="dialogVisible" title="合同信息">
					      <el-form ref="form" :model="form" label-width="120px">
					        <el-form-item label="合同名称">
					          <el-input v-model="form.htmc_" ></el-input>
					        </el-form-item>
					        <el-form-item label="相关单位">
					          <el-input v-model="form.xgdw_" ></el-input>
					        </el-form-item>
                            <el-form-item label="签订日期">
					          <el-input v-model="form.begin_" ></el-input>
					        </el-form-item>
                            <el-form-item label="结束日期">
					          <el-input v-model="form.end_" ></el-input>
					        </el-form-item>
                            <el-form-item label="合同金额">
					          <el-input v-model="form.money_" ></el-input>
					        </el-form-item>
					      
					        <el-form-item label="负责人">
					          <el-input type="input" v-model="form.name_"></el-input>
					        </el-form-item>

                            <el-form-item label="上传材料">
					          <el-upload
					            action="#"
					            :on-change="handleFileChange"
					            :file-list="form.fileList"
					            :auto-upload="false"
					          >
					            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
					          </el-upload>
					        </el-form-item>

					      </el-form>
					      <span slot="footer" class="dialog-footer">
					        <el-button @click="dialogVisible = false">取消</el-button>
					        <el-button type="primary" @click="submitForm">确定</el-button>
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
import axios from '@/utils/axios.js';

export default {
    name: 'htda',
    components: { Widget, Sparklines },
    data() {
        return {
            multipleSelection: [],
            project_id: 0,
            dialogVisible: false,
            form: {
                htmc_: "", 
                xgdw_: "",
                begin_: '',
                end_: "",
                money_: "",
                fileList: [], 
                name_: ""
            },
            file: null,
            currentPage: 1,
            search: "",
            tableData: [{
                htmc: "11",
                xgdw: "22",
                begin: '3',
                end: "4",
                money: "5",
                pdf: "",
                name: "6"
            }]
        };
    },
    mounted() {
        axios.get('/api/data/htda').then(response => {
            this.tableData = response.data;
        }).catch(error => {
            console.error('Error fetching JSON:', error);
        });
    },
    beforeDestroy() {
        if (this.tableData.length > 0) {
            axios.post('/api/save/htda', this.tableData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                console.log('合同档案上传成功');
            })
            .catch(error => {
                console.error('上传合同档案时出错：', error);
            });
        }
    },
    computed: {
        filteredItems() {
            if (this.search != "") {
                return this.tableData.filter(item => {
                    return ((item.htmc != undefined && item.htmc.includes(this.search)) ||
                        (item.xgdw != undefined && item.xgdw.includes(this.search)));
                });
            } else {
                return this.tableData;
            }
        },
        current() {
            const start = (this.currentPage - 1) * 20;
            const end = start + 20;
            return this.filteredItems.slice(start, end);
        },
        rows() {
            return this.filteredItems.length;
        },
    },
    methods: {
        handleSelectionChange(val) {  
            this.multipleSelection = val;
        },  
        saveData() {
            axios.post('/api/save/htda', this.tableData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                console.log('合同档案保存成功');
                this.$message.success('合同档案保存成功');
            })
            .catch(error => {
                console.error('保存合同档案时出错：', error);
                this.$message.error('保存合同档案失败，请重试');
            });
        },
        handleDelete() {  
            const set = new Set(this.multipleSelection);  
            this.tableData = this.tableData.filter(item => !set.has(item));  
            this.multipleSelection = [];  
        },  
        upload_pdf(id) {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "application/pdf";
            input.addEventListener("change", () => {
                const formData = new FormData();
                formData.append("pdf", input.files[0]);
                formData.append("projectName", this.project_id);
                formData.append("pdfName", id);
                axios.post("/api/save/pdf", formData)
                    .then(() => {
                        this.$message({
                            message: "PDF上传成功",
                            type: "success"
                        });
                    })
                    .catch((error) => {
                        console.error("上传 PDF 文件时出错：", error);
                        this.$message({
                            message: "PDF上传失败，请重试",
                            type: "error"
                        });
                    });
            });
            input.click();
        },
        download_pdf(id) {
            axios.get(`/api/data/pdf?projectName=${this.project_id}&&pdfName=${id}`)
                .then((response) => {
                    const url = "http://8.130.106.134:5000/" + response.data;
                    window.open(url, "_blank");
                })
                .catch((error) => {
                    console.error("获取 PDF 文件时出错：", error);
                    this.$message({
                        message: "PDF暂未上传",
                        type: "error"
                    });
                });
        },
        resetForm() {
            this.form = {
                htmc_: "",
                xgdw_: "",
                begin_: '',
                end_: "",
                money_: "",
                fileList: [],
                name_: ""
            };
        },
        handleFileChange(file, fileList) {
            this.form.file = file.raw;
        },
        submitForm() {
            const newRow = {
                htmc: this.form.htmc_,
                xgdw: this.form.xgdw_,
                begin: this.form.begin_,
                end: this.form.end_,
                money: this.form.money_,
                pdf: this.form.fileList,
                name: this.form.name_,
                id: this.tableData.length + 1
            };
            this.tableData.push(newRow);
            this.resetForm();
            this.dialogVisible = false;
        },
        parsePrice(price) {
            if (price === undefined) {
                return price;
            } else {
                price = Number(price);
                const priceStr = price.toFixed(2);
                const formattedPrice = priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return formattedPrice;
            }
        },
        parseExcel() {
            if (this.file) {
                let that = this;
                that.tableData = [];
                const reader = new FileReader();
                reader.readAsArrayBuffer(this.file);
                reader.onload = function (e) {
                    const workbook = XLSX.read(e.target.result, { type: 'binary' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const title = ["htmc", "xgdw", "begin", "end", "money", "pdf", "name"];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    for (let i = 1; i < jsonData.length; i++) {
                        let obj = {};
                        if (jsonData[i].length === 0) {
                            continue;
                        }
                        for (let j = 0; j < jsonData[i].length; j++) {
                            obj[title[j]] = typeof jsonData[i][j] === 'number' 
                                            ? jsonData[i][j].toFixed(2) 
                                            : jsonData[i][j];
                        }
                        that.tableData.push(obj);
                    }
                };
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.button-container {  
  display: flex; /* 设置为 Flexbox 布局 */  

}  

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