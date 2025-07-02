<template>
    <div class="tables-basic">
        <b-breadcrumb>
            <b-breadcrumb-item>综合管理部</b-breadcrumb-item>
            <b-breadcrumb-item active>集团内部资料</b-breadcrumb-item>
        </b-breadcrumb>
        <!-- <h2 class="page-title">市政公司支出信息</h2> -->
        <b-row>
            <b-col>
                <Widget title="<h5>内部资料</h5>" customHeader settings close>
                    <TableTemplate ref="tableTemplate" :tableData="tableData" :columns="columns" :formFields="form"
                        :storageKey="'internalFiles'" :customFilter1="filterByCategory" :customFilter2="filterBySearch"
                        @update:tableData="updateTableData">
                        <template v-slot:custom-filter1>
                            <el-select v-model="selectedCategory" placeholder="选择类别"
                                style="width: 180px; margin-right: 10px;">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in classs" :key="item" :label="item" :value="item" />
                            </el-select>
                        </template>

                        <template v-slot:custom-filter2>
                            <b-input v-model="search" placeholder="搜索类别..." style="width: 300px; margin-right: 10px;" />
                        </template>

                        <template v-slot:custom-filter3>
                            <b-button variant="default" @click="dialogVisible = true" class="mr-2">增加</b-button>
                            <b-button variant="default" @click="handleDelete">删除</b-button>
                        </template>
                    </TableTemplate>

                    <el-dialog :visible.sync="dialogVisible" title="">
                        <el-form ref="form" :model="form" label-width="120px">
                            <el-form-item label="当前日期">
                                <el-input v-model="form.date" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="创建人">
                                <el-input v-model="form.operator"></el-input>
                            </el-form-item>
                            <el-form-item label="合同名称">

                                <el-input type="input" v-model="form.hetongmingcheng"></el-input>

                            </el-form-item>
                            <el-form-item label="类别">
                                <el-input type="input" v-model="form.category"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="submitForm">确 定</el-button>
                        </span>
                    </el-dialog>
                </Widget>
            </b-col>
        </b-row>
    </div>
</template>

<script>



import Widget from '@/components/Widget/Widget';
import * as XLSX from 'xlsx/xlsx.mjs'
import axios from '@/utils/axios.js'
import TableTemplate from '@/components/Template/xlsxTable'


export default {
    name: 'jygl',
    components: { Widget, TableTemplate },
    data() {
        return {
            tableData: [],
            form: {
                date: new Date().toISOString().slice(0, 10),
                operator: '',
                hetongmingcheng: '',
                category: ''
            },
            columns: [
                { type: 'selection', label: '选择', width: 60 },
                {
                    prop: 'htmc',
                    label: '项目名称',
                    width: 120,
                    render: (row) => `<span style="text-decoration: underline; color:white; cursor:pointer" onclick="window.__goToDetail('${row.htmc}')">${row.htmc}</span>`
                },
                { prop: 'date', label: '创建时间', width: 180 },
                { prop: 'name', label: '创建人', width: 100 },
                { prop: 'category', label: '类别' }
            ],
            selectedCategory: '',
            search: '',
            classs: ['aaa', 'bbb', 'ccc'],
            dialogVisible: false,
            multipleSelection: []
        };
    },

    mounted() {
        axios.get('/api/data/jygl').then(response => {
            // console.log('Fetched JSON:', response.data);
            this.tableData = response.data
        }).catch(error => {
            console.error('Error fetching JSON:', error);
        });

        // window.__goToDetail = (htmc) => {
        //     this.$router.push({
        //         path: '/app/zhgl/nbzhiliao',
        //         query: { hetong: htmc }
        //     });
        // };
    },
    beforeDestroy() {
        if (this.tableData.length > 0) {
            axios.post('/api/save/jygl', this.tableData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    console.log('市政公司收入表上传成功');
                })
                .catch(error => {
                    console.error('市政公司收入表文件时出错：', error);
                });
        }
    },
    computed: {
        filterByCategory() {
            return item => !this.selectedCategory || (item.category && item.category === this.selectedCategory);
        },
        filterBySearch() {
            return item => !this.search || (item.category && item.category.includes(this.search));
        }
    },

    methods: {
        updateTableData(newData) {
            this.tableData = newData;
        },
        handleDelete() {
            const toDelete = new Set(this.multipleSelection);
            this.tableData = this.tableData.filter(item => !toDelete.has(item));
            this.multipleSelection = [];
        },
        submitForm() {
            const newRow = {
                date: this.form.date,
                name: this.form.operator,
                htmc: this.form.hetongmingcheng,
                category: this.form.category
            };
            this.tableData.push(newRow);
            this.dialogVisible = false;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleDelete() {
            const set = new Set(this.multipleSelection);
            this.tableData = this.tableData.filter(item => !set.has(item));
            this.multipleSelection = [];
        },
        handleCellClick(row, column, cell, event) {
            // 假设 date 列是表格的第一列，其索引为 0  
            // console.log(row.htmc)
            if (column.label == "项目名称") {
                this.$router.push({
                    path: "/app/zhgl/nbzhiliao?htmc=" + row.htmc,
                    query: {
                        hetong: row.htmc
                    }
                })
            }
        }
        ,
        resetForm() {
            this.form = {
                date: new Date().toISOString().slice(0, 10),
                operator: '',
                htmc: " ",
                name: ''
            }
        },
        handleFileChange(file, fileList) {
            // 由于 Element UI 的上传组件会将文件转换为 Blob，这里我们直接使用文件对象
            console.log(typeof file)
            this.form.file = file.raw;
        },
        submitForm() {
            console.log(typeof this.form.file)
            const newRow = {

                date: this.form.date,
                name: this.form.operator,
                htmc: this.form.hetongmingcheng,
                category: this.form.category
            };

            // 将新行添加到表格数据数组中
            this.tableData.push(newRow);

            // 重置表单
            this.resetForm();

            // 关闭对话框
            this.dialogVisible = false;
        },
        parsePrice(price) {
            // 将数字转换为字符串，并固定两位小数
            if (price === undefined) {
                return price
            }
            else {
                price = Number(price)
                const priceStr = price.toFixed(2);
                // 使用正则表达式将字符串中的数字每三位一组，并用逗号分隔
                const formattedPrice = priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return formattedPrice;
            }
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
            console.log(item)
            item.isEditing = true;
        },
        parseExcel() {
            if (this.file) {
                let that = this
                that.tableData = []
                const reader = new FileReader();
                reader.readAsArrayBuffer(this.file);
                reader.onload = function (e) {
                    const workbook = XLSX.read(e.target.result, { type: 'binary' });
                    // 获取第一个工作表
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const title = ["xiangguandanwei", "xiangmumingcheng", "hetongjine_", "hetongjine", "jiesuanjine", "progress", "yingshoukuan", "shishoukuan", "yingshouweishou", "zaicishoukuan", "yingshouweishou2"]
                    // 解析工作表数据
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    console.log('解析后的数据为：', jsonData)
                    for (let i = 4; i < jsonData.length; i++) {
                        let obj = {};
                        if (jsonData[i].length == 0) {
                            continue
                        }
                        for (let j = 0; j < jsonData[i].length; j++) {
                            if (typeof jsonData[i][j] === 'number') {
                                obj[title[j]] = jsonData[i][j].toFixed(2);
                            } else {
                                obj[title[j]] = jsonData[i][j];
                            }

                        }
                        obj["isEditing"] = false
                        that.tableData.push(obj)
                    }

                };
            }
        },

    },
};
</script>

<style lang="scss" scoped>
@import '../../styles/app';

#table .table-header {
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

#aaa :hover {
    cursor: pointer;
}

#table {

    //background-color: red;
    // 表格文字间距、颜色
    // ::v-deep .cell {
    //     // padding: 0;
    //     color: #9f9fad;
    // }



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

    //   ::v-deep .el-table .cell:nth-child(1) {  

    //     text-decoration: underline !important  ;
    //     color: #da6014db !important 
    // }  


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