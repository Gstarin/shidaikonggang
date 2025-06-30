<template>
    <div class="tables-basic">
        <b-breadcrumb>
            <b-breadcrumb-item>市政公司</b-breadcrumb-item>
            <b-breadcrumb-item active>日志信息</b-breadcrumb-item>
        </b-breadcrumb>
        <b-row>
            <b-col>
                <Widget title="<h5>日志信息</h5>" customHeader settings close>
                    <div class="filter-section" style="margin-bottom: 20px;">
                        <b-form-select v-model="selectedDepartment" :options="departments" @change="onDepartmentChange" placeholder="选择公司部门" />
                        <b-form-select v-model="selectedProject" :options="projects" @change="onProjectChange" placeholder="选择项目名称" :disabled="!selectedDepartment" />
                        <b-form-select v-model="selectedConstruction" :options="constructions" @change="onConstructionChange" placeholder="选择工程名称" :disabled="!selectedProject" />
                        <b-form-select v-model="selectedDetail" :options="details" placeholder="选择工程细化" :disabled="!selectedConstruction" />
                    </div>
                    <div v-if="selectedDepartment && selectedProject && selectedConstruction && selectedDetail">
                        <div class="table-header" style="width: 100%; display: flex; justify-content: flex-start; align-items: center; margin-bottom: 15px;">
                            <b-input type="text" v-model="search" style="width: 360px; height: 35px; margin: 0 15px;" placeholder="Search..." />
                            <b-button variant="default" class="mr-3" size="sm" @click="dialogVisible = true" style="width: 110px; height: 35px;">增加</b-button>
                            <b-button variant="default" class="mr-3" size="sm" style="width: 110px; height: 35px;" @click="handleExportTable('DisburseTable')">删除</b-button>
                        </div>
                        <div id="table">
                            <el-table :data="current" style="width: 100%">
                                <el-table-column prop="length" label="全长(米)" width="80"></el-table-column>
                                <el-table-column prop="begin" label="倒排工期表开始时间" width="180"></el-table-column>
                                <el-table-column prop="end" label="倒排工期表结束时间" width="180"></el-table-column>
                                <el-table-column prop="ontime" label="是否按工期表完成" width="100"></el-table-column>
                                <el-table-column prop="date" label="实际完成日期" width="100"></el-table-column>
                                <el-table-column label="延期天数">
                                    <el-table-column prop="cqwc" label="超前完成" width="150"></el-table-column>
                                    <el-table-column prop="wwc" label="截至今日未完成" width="150"></el-table-column>
                                </el-table-column>
                                <el-table-column label="日志信息">
                                    <b-button variant="default" class="mr-3" size="sm" @click="dialogVisible1 = true" style="width: 110px; height: 35px;">查看</b-button>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div v-else>
                        <p>请先选择公司部门、项目名称、工程名称和工程细化。</p>
                    </div>
                    <el-dialog :visible.sync="dialogVisible" title="上传日志">
                        <el-form ref="form" :model="form" label-width="120px">
                            <el-form-item label="全长（米）">
                                <el-input v-model="form.lengthh"></el-input>
                            </el-form-item>
                            <el-form-item label="倒排工期表开始时间">
                                <el-input v-model="form.beginn"></el-input>
                            </el-form-item>
                            <el-form-item label="倒排工期表结束时间">
                                <el-input type="input" v-model="form.endd"></el-input>
                            </el-form-item>
                            <el-form-item label="是否按照工期表完成">
                                <el-input type="input" v-model="form.ontimee"></el-input>
                            </el-form-item>
                            <el-form-item label="实际完成日期">
                                <el-input type="input" v-model="form.datee"></el-input>
                            </el-form-item>
                            <el-form-item label="超前完成">
                                <el-input type="input" v-model="form.cqwcc"></el-input>
                            </el-form-item>
                            <el-form-item label="截至今日未完成">
                                <el-input type="input" v-model="form.wwcc"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="submitForm">确 定</el-button>
                        </span>
                    </el-dialog>
                    <el-dialog :visible.sync="dialogVisible1" title="日志详情" width="1200px">
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>开始时间</th>
                                    <th>结束时间</th>
                                    <th>完成情况</th>
                                    <th>长度（米）</th>
                                    <th>完成占比（%）</th>
                                    <th>未完成原因</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in tableData[0].log" :key="index">
                                    <td><input v-model="item.begin"></td>
                                    <td><input v-model="item.end"></td>
                                    <td><input v-model="item.wcqk"></td>
                                    <td><input v-model="item.length"></td>
                                    <td><input v-model="item.zhanbi"></td>
                                    <td><input v-model="item.reason"></td>
                                </tr>
                            </tbody>
                        </table>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible1 = false">取 消</el-button>
                            <el-button type="primary" @click="submitForm1">新增</el-button>
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
import * as XLSX from 'xlsx/xlsx.mjs';
import axios from '@/utils/axios.js';

export default {
    name: 'gcxm_',
    components: { Widget },
    data() {
        return {
            dialogVisible: false,
            dialogVisible1: false,
            form: {
                lengthh: "",
                beginn: "",
                endd: "",
                ontimee: "",
                datee: "",
                cqwcc: "",
                wwcc: "",
            },
            file: null,
            currentPage: 1,
            search: "",
            tableData: [{
                length: 1,
                begin: 2,
                end: 3,
                ontime: 4,
                date: 5,
                cqwc: 6,
                wwc: 7,
                log: [
                    { begin: '2024-07-08', end: '2024-07-10', wcqk: '已完成', length: 100, zhanbi: 90, reason: '无' },
                    { begin: '2024-07-11', end: '2024-07-13', wcqk: '未完成', length: 80, zhanbi: 70, reason: '雨天' }
                ]
            }],
            departments: ['部门A', '部门B', '部门C'], // 示例数据
            projects: [],
            constructions: [],
            details: [],
            selectedDepartment: null,
            selectedProject: null,
            selectedConstruction: null,
            selectedDetail: null,
        };
    },
    methods: {
        onDepartmentChange() {
            // 根据选择的部门加载项目名称
            this.projects = ['项目A', '项目B', '项目C']; // 示例数据
            this.selectedProject = null;
            this.selectedConstruction = null;
            this.selectedDetail = null;
        },
        onProjectChange() {
            // 根据选择的项目加载工程名称
            this.constructions = ['工程A', '工程B', '工程C']; // 示例数据
            this.selectedConstruction = null;
            this.selectedDetail = null;
        },
        onConstructionChange() {
            // 根据选择的工程加载工程细化
            this.details = ['细化A', '细化B', '细化C']; // 示例数据
            this.selectedDetail = null;
        },
        submitForm1() {
            const newRow = {
                begin: "",
                end: "",
                wcqk: "",
                length: "",
                zhanbi: "",
                reason: ""
            };
            this.tableData[0].log.push(newRow);
        },
        resetForm() {
            this.form = {
                lengthh: "",
                beginn: "",
                endd: "",
                ontimee: "",
                datee: "",
                cqwcc: "",
                wwcc: "",
            };
        },
        submitForm() {
            this.tableData.push({
                length: this.form.lengthh,
                begin: this.form.beginn,
                end: this.form.endd,
                ontime: this.form.ontimee,
                date: this.form.datee,
                cqwc: this.form.cqwcc,
                wwc: this.form.wwcc,
                log: []
            });
            this.dialogVisible = false;
            this.resetForm();
        }
    },
    computed: {
        current() {
            const startIndex = (this.currentPage - 1) * 10;
            const endIndex = startIndex + 10;
            return this.tableData.slice(startIndex, endIndex);
        },
        rows() {
            return this.tableData.length;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../../styles/app';
.filter-section {
    display: flex;
    justify-content: space-between;
}
.table-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.table-header {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 15px;
}

#table {
    ::v-deep .cell {
        color: #9f9fad;
    }

    ::v-deep .el-table__header th {
        padding: 0;
        height: 50px;
        line-height: 50px;
    }

    ::v-deep .el-table__body tr,
    ::v-deep .el-table__body td {
        padding: 0;
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

    ::v-deep .el-table th,
    ::v-deep .el-table tr,
    ::v-deep .el-table td {
        background-color: transparent;
    }
}

.clickable {
    cursor: pointer;
    color: #9f9fad;
    text-decoration: underline;
}
</style>
