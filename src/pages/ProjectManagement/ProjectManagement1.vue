<template>
    <div class="tables-basic">
        <b-breadcrumb>
            <b-breadcrumb-item>投资发展部</b-breadcrumb-item>
            <b-breadcrumb-item active>项目管理</b-breadcrumb-item>
        </b-breadcrumb>
        <!-- <h2 class="page-title">市政公司支出信息</h2> -->
        <b-row>
            <b-col>
                <Widget title="<h5>项目管理</h5>" customHeader settings close>
                    <TableTemplate ref="tableTemplate" :tableData="tableData" :columns="columns" :formFields="form"
                        :storageKey="'projectManagementData'" :customFilter1="filterBySearch"
                        @update:tableData="updateTableData">
                        <template v-slot:custom-filter1>
                            <b-input v-model="search" placeholder="搜索项目状态..."
                                style="width: 300px; margin-right: 10px;" />
                        </template>

                        <template v-slot:custom-filter3>
                            <b-button variant="default" @click="dialogVisible = true" class="mr-2">增加</b-button>
                            <b-button variant="default" @click="handleDelete">删除</b-button>
                        </template>
                    </TableTemplate>

                    <el-dialog :visible.sync="dialogVisible" title="新增项目">
                        <el-form :model="form" label-width="120px">
                            <el-form-item label="创建日期">
                                <el-input v-model="form.date"></el-input>
                            </el-form-item>
                            <el-form-item label="项目名称">
                                <el-input v-model="form.hetongmingcheng"></el-input>
                            </el-form-item>
                            <el-form-item label="项目状态">
                                <el-input v-model="form.category"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取消</el-button>
                            <el-button type="primary" @click="submitForm">确定</el-button>
                        </span>
                    </el-dialog>

                    <el-dialog :visible.sync="dialogVisible" title="">
                        <el-form ref="form" :model="form" label-width="120px">
                            <el-form-item label="创建日期">
                                <el-input v-model="form.date"></el-input>
                            </el-form-item>
                            <!-- <el-form-item label="创建人">
                    <el-input v-model="form.operator"></el-input>
                  </el-form-item> -->
                            <el-form-item label="项目名称">

                                <el-input type="input" v-model="form.hetongmingcheng"></el-input>

                            </el-form-item>
                            <el-form-item label="项目状态">
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
import Sparklines from '../../components/Sparklines/Sparklines'
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
                hetongmingcheng: '',
                category: ''
            },
            columns: [
                { type: 'selection', label: '选择', width: 60 },
                { prop: 'id', label: '序号', width: 100 },
                {
                    prop: 'htmc',
                    label: '项目名称',
                    render: (row) => `<span style="text-decoration: underline; color:white; cursor:pointer" onclick="window.__goToDetail('${row.htmc}')">${row.htmc}</span>`
                },
                { prop: 'date', label: '创建日期', width: 180 },
                { prop: 'name', label: '项目状态' }
            ],
            search: '',
            dialogVisible: false,
            multipleSelection: []
        };
    },

    computed: {
        filteredItems() {
            let temp = [];
            if (this.search != "") {
                temp = this.tableData.filter(item => {
                    return ((item.category != undefined && item.category.includes(this.search)))
                });
            }
            if (this.select_ != " ") {
                console.log("bbbb")
                if (temp.length > 0)
                    temp = temp.filter(item => {

                        return (item.category != undefined && item.category === this.select_)
                    });
                else
                    temp = this.tableData.filter(item => {
                        return (item.category != undefined && item.category === this.select_)
                    });


            }
            if (this.select_ == " " && this.search == "") return this.tableData;
            else if (temp != undefined) return temp;
            else {
                return this.tableData
            }
        },
        current() {
            const start = (this.currentPage - 1) * 20;
            const end = start + 20;
            console.log(this.filteredItems.slice(start, end))
            return this.filteredItems.slice(start, end);
        },
        rows() {
            return this.filteredItems.length
        },
        filterBySearch() {
            return item => !this.search || (item.category && item.category.includes(this.search));
        }
    },
    methods: {
        updateTableData(newData) {
            this.tableData = newData;
        },
        submitForm() {
            const newRow = {
                id: this.tableData.length + 1,
                date: this.form.date,
                htmc: this.form.hetongmingcheng,
                name: this.form.category,
                category: this.form.category
            };
            this.tableData.push(newRow);
            axios.post('/api/save/zlda', this.tableData, { headers: { 'Content-Type': 'application/json' } });
            this.dialogVisible = false;
        },
        handleDelete() {
            const set = new Set(this.multipleSelection);
            this.tableData = this.tableData.filter(item => !set.has(item));
            axios.post('/api/save/zlda', this.tableData, { headers: { 'Content-Type': 'application/json' } });
            this.multipleSelection = [];
        }
    },
    // gpt
    // mounted() {
    //   window.__goToDetail = (htmc) => {
    //     this.$router.push(`/app/ProjectManagement/Project?id=${htmc}`);
    //   };
    //   axios.get('/api/data/zlda').then(res => {
    //     this.tableData = res.data;
    //     this.tableData.forEach((item, idx) => item.id = idx + 1);
    //   });
    // }

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

#aaa :hover {
    cursor: pointer;
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