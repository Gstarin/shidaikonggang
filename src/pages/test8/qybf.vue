<template>
    <div class="tables-basic">
        <b-breadcrumb>
            <b-breadcrumb-item>瑞景园林</b-breadcrumb-item>
            <b-breadcrumb-item active>企业拜访</b-breadcrumb-item>
        </b-breadcrumb>
        <b-row>
            <b-col>
                <Widget title="<h5>企业拜访记录表</h5>" customHeader settings close>
                    <div class="table-header"
                        style="width: 100%;display: flex;justify-content: center;margin-bottom: 15px;">
                        <b-input type="text" v-model="search" style="width: 360px;height: 35px;margin:0 15px;"
                            placeholder="Search..." />
                        <b-button variant="default" class="mr-3" size="sm" @click="dialogVisible = true"
                            style="width: 110px;height: 35px;">增加</b-button>
                        <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"
                        @click="handleDelete">删除</b-button>
                        <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="save">保存</b-button>
                        <el-date-picker
                            v-model="selectMonth"
                            type="month"
                            placeholder="选择年月"
                            @change="handleMonthChange"
                            value-format="yyyy-MM"
                            style="margin-right: 15px;"
                            ></el-date-picker>
                    </div>
                    <div id="table">
                        <el-table :data="current" style="width: 100%"  @selection-change="handleSelectionChange" >
                            <el-table-column type="selection" width="80">
                            </el-table-column>

                            <el-table-column prop="xz" label="乡镇" width="180">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.xz" class="white-input"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column prop="qymc" label="企业名称" width="100">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.qymc" class="white-input"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column prop="date" label="拜访日期" width="120">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.date" class="white-input"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column prop="name" label="拜访人" width="120">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.name" class="white-input"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column prop="yx" label="有无意向合作" width="120">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.yx" class="white-input"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column prop="bz" label="备注">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.bz" class="white-input"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
					<el-dialog :visible.sync="dialogVisible" title="合同信息">
					      <el-form ref="form" :model="form" label-width="120px">
					        <el-form-item label="乡镇">
					          <el-input v-model="form.xz_" ></el-input>
					        </el-form-item>
					        <el-form-item label="企业名称">
					          <el-input v-model="form.qymc_" ></el-input>
					        </el-form-item>
                            <el-form-item label="拜访日期">
					          <el-input v-model="form.date_" ></el-input>
					        </el-form-item>
                            <el-form-item label="拜访人">
					          <el-input v-model="form.name_" ></el-input>
					        </el-form-item>
                            <el-form-item label="有无意向合作">
					          <el-input v-model="form.yx_" ></el-input>
					        </el-form-item>
					        <el-form-item label="备注">
					          <el-input type="input" v-model="form.bz_"></el-input>
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
    name: 'qybf',
    components: { Widget, Sparklines },
    data() {
        return {
            dialogVisible: false,
            form: {
                xz_: "",
                date_: "",
                qymc_: '',
                name_: "",
                yx_: "",
                bz_: ""
            },
            file: null,
            currentPage: 1,
            search: "",
            tableData: [{
                id: "1",
                xz: "22",
                date: "222",
                qymc: '3',
                name: "4",
                yx: "5",
                bz: "wu",
            }],
            selectMonth: null,
            path: '',
            multipleSelection: []
        };
    },
    mounted() {
        // 初始化时不再直接获取所有数据
    },
    computed: {
        filteredItems() {
            if (this.search != "") {
                return this.tableData.filter(item => {
                    return ((item.xiangguandanwei != undefined && item.xiangguandanwei.includes(this.search)) ||
                        (item.xiangmumingcheng != undefined && item.xiangmumingcheng.includes(this.search)));
                });
            } else {
                return this.tableData
            }
        },
        current() {
            const start = (this.currentPage - 1) * 20;
            const end = start + 20;
            return this.filteredItems.slice(start, end);
        },
        rows() {
            return this.filteredItems.length
        },
    },
    methods: {
        handleMonthChange() {
            if (this.selectMonth) {
                const [year, month] = this.selectMonth.split('-');
                this.path = `${year}-${month}`;
                this.fetchDataForMonth();
            }
        },
        fetchDataForMonth() {
            axios.post('/api/data/qybf', { iddd: this.path }, {
                headers: { 'Content-Type': 'application/json' },
            }).then(response => {
                this.tableData = response.data;
                if (this.tableData.length === 0) {
                    const daysInMonth = new Date(this.selectMonth.split('-')[0], this.selectMonth.split('-')[1], 0).getDate();
                    for (let i = 1; i <= daysInMonth; i++) {
                        this.tableData.push({
                            id: i,
                            xz: '',
                            qymc: '',
                            date: `${this.path}-${i.toString().padStart(2, '0')}`,
                            name: '',
                            yx: '',
                            bz: ''
                        });
                    }
                }
            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        },
        save() {
            axios.post('/api/save/qybf', [this.tableData, this.path], {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                console.log('数据保存成功');
                this.$message.success('数据保存成功');
            })
            .catch(error => {
                console.error('保存数据时出错：', error);
                this.$message.error('保存数据失败，请重试');
            });
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
                xz_: "",
                date_: "",
                qymc_: '',
                name_: "",
                yx_: "",
                bz_: ""
            }
        },
        submitForm() {
            const newRow = {
                id: this.tableData.length + 1,
                xz: this.form.xz_,
                qymc: this.form.qymc_,
                date: this.form.date_,
                name: this.form.name_,
                yx: this.form.yx_,
                bz: this.form.bz_
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
                    const title = ["xz", "qymc", "date", "name", "yx", "bz"];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    console.log('解析后的数据为：', jsonData);
                    for (let i = 1; i < jsonData.length; i++) {
                        let obj = {};
                        if (jsonData[i].length === 0) {
                            continue;
                        }
                        for (let j = 0; j < jsonData[i].length; j++) {
                            if (typeof jsonData[i][j] === 'number') {
                                obj[title[j]] = jsonData[i][j].toFixed(2);
                            } else {
                                obj[title[j]] = jsonData[i][j];
                            }
                        }
                        that.tableData.push(obj);
                    }
                };
            }
        }
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