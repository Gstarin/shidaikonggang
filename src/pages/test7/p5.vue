<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>维修费用</h5>" customHeader settings close>
          <div class="table-header">
            <b-form-file v-model="file" placeholder="请选择一个Excel文件" style="margin-right: 15px;"></b-form-file>
            <b-button variant="default" class="mr-3" size="sm" @click="parseExcel"
              style="width: 110px;height: 35px;">解析Excel</b-button>
            <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="handleExportTable('DisburseTable')">导出Excel</b-button>
            <b-button variant="default" class="mr-3" size="sm" @click="addRecord" style="width: 110px;height: 35px;">增加</b-button>
            <b-button variant="danger" class="mr-3" size="sm" @click="deleteSelectedRecords" style="width: 110px;height: 35px;">删除</b-button>
            <el-date-picker
              v-model="selectMonth"
              type="month"
              placeholder="选择年月"
              @change="handleMonthChange"
              value-format="yyyy-MM"
              style="margin-right: 15px;"
            ></el-date-picker>
            <b-button variant="default" class="mr-3" size="sm" @click="save" style="width: 110px;height: 35px;">保存</b-button>
          </div>
          <div id="table">
            <el-table :data="tableData" style="width: 100%" id="DisburseTable" @selection-change="handleSelectionChange" @cell-dblclick="handleCellDblclick">
              <el-table-column type="selection" width="55" :selectable="row => !row.isTotal"></el-table-column>

              <el-table-column prop="xuhao" label="序号">
                <template slot-scope="scope">
                  <el-input v-if="!scope.row.isTotal" v-model="scope.row.xuhao" class="white-input"></el-input>
                  <span v-else>{{ scope.row.xuhao }}</span>
                </template>
              </el-table-column>

              <el-table-column prop="name" label="车牌号">
                <template slot-scope="scope">
                  <el-input v-if="!scope.row.isTotal" v-model="scope.row.name" class="white-input"></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="phone" label="日期">
                <template slot-scope="scope">
                  <el-input v-if="!scope.row.isTotal" v-model="scope.row.phone" class="white-input"></el-input>
                </template>
              </el-table-column>

              <el-table-column label="司机">
                <template slot-scope="scope">
                  <div v-for="(detail, index) in scope.row.details" :key="index">
                    <el-input v-if="!scope.row.isTotal" v-model="detail.nation" class="white-input"></el-input>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="项目">
                <template slot-scope="scope">
                  <div v-for="(detail, index) in scope.row.details" :key="index">
                    <el-input v-if="!scope.row.isTotal" v-model="detail.id" class="white-input"></el-input>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="材料费（元）">
                <template slot-scope="scope">
                  <div v-for="(detail, index) in scope.row.details" :key="index">
                    <el-input v-if="!scope.row.isTotal" v-model="detail.birthday" class="white-input"></el-input>
                    <span v-else>{{ detail.birthday }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="工时费（元）">
                <template slot-scope="scope">
                  <div v-for="(detail, index) in scope.row.details" :key="index">
                    <el-input v-if="!scope.row.isTotal" v-model="detail.age" class="white-input"></el-input>
                    <span v-else>{{ detail.age }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="费用合计（元）">
                <template slot-scope="scope">
                  <div v-for="(detail, index) in scope.row.details" :key="index">
                    <el-input v-if="!scope.row.isTotal" v-model="detail.health" class="white-input"></el-input>
                    <span v-else>{{ detail.health }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="维修单位">
                <template slot-scope="scope">
                  <div v-for="(detail, index) in scope.row.details" :key="index">
                    <el-input v-if="!scope.row.isTotal" v-model="detail.PoliticalStatus" class="white-input"></el-input>
                  </div>
                </template>
              </el-table-column>

            </el-table>
          </div>

          <div class="table-footer">
            <b-pagination v-model="currentPage" :total-rows="rows" :per-page="pageSize" size="lg"></b-pagination>
          </div>
        </Widget>
      </b-col>
    </b-row>
    <el-dialog  
      title="修改值"  
      :visible.sync="dialogVisible1"  
      width="30%"  
      @close="dialogVisible1 = false"  
    >  
      <el-input v-model="editingValue" placeholder="请输入新值" class="white-input"></el-input>  
      <span slot="footer" class="dialog-footer">  
        <el-button @click="dialogVisible1 = false">取 消</el-button>  
        <el-button type="primary" @click="updateValue">确 定</el-button>  
      </span>  
    </el-dialog> 
  </div>
</template>
<script>
import Widget from '@/components/Widget/Widget';
import * as XLSX from 'xlsx/xlsx.mjs';
import axios from '@/utils/axios.js';
import { new_export_excel } from '@/utils/newexportExcel.js';

export default {
  name: 'p5',
  components: { Widget },
  data() {
    return {
      file: null,
      dialogVisible1: false,
      editingRow: null,
      editingValue: '',
      editingcolumn: null,
      currentPage: 1,
      pageSize: 20,
      tableData: [],
      multipleSelection: [],
      selectMonth: null,
      path: '',
    };
  },
  mounted() {
    this.fetchInitialData();
  },
  beforeDestroy() {
    this.saveData();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.tableData.length / this.pageSize);
    },
    current() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.tableData.slice(start, end);
    },
    rows() {
      return this.tableData.length;
    },
    tableDataWithTotal() {
      let totalMaterial = 0;
      let totalLabor = 0;
      let totalCost = 0;

      this.tableData.forEach(row => {
        row.details.forEach(detail => {
          totalMaterial += parseFloat(detail.birthday || 0);
          totalLabor += parseFloat(detail.age || 0);
          totalCost += parseFloat(detail.health || 0);
        });
      });

      const data = this.current;

      if (this.currentPage === this.totalPages) {
        const totalRow = {
          xuhao: '合计',
          name: '',
          phone: '',
          isTotal: true,
          details: [{
            nation: '',
            id: '',
            birthday: totalMaterial.toFixed(2),
            age: totalLabor.toFixed(2),
            health: totalCost.toFixed(2),
            PoliticalStatus: ''
          }]
        };
        return [...data, totalRow];
      }

      return data;
    },
  },
  methods: {
    fetchInitialData() {
      axios.get('/api/data/p5').then(response => {
        this.tableData = response.data;
      }).catch(error => {
        console.error('Error fetching JSON:', error);
      });
    },
    saveData() {
      axios.post('/api/save/p5', this.tableData, {
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCellDblclick(row, column, cell, event) {
      this.editingRow = row.xuhao;
      this.editingcolumn = column.property;
      this.editingValue = row[column.property];
      this.dialogVisible1 = true;
    },
    isNumeric(str) {
      return !isNaN(parseFloat(str)) && isFinite(str);
    },
    updateValue() {
      if (this.editingRow && this.editingValue !== this.editingRow.value) {
        if (!this.isNumeric(this.editingValue)) {
          this.tableData[this.editingRow - 1][this.editingcolumn] = this.editingValue;
        } else {
          this.tableData[this.editingRow - 1][this.editingcolumn] = Number(this.editingValue);
        }
      }
      this.dialogVisible1 = false;
    },
    addRecord() {
      this.tableData.push({
        xuhao: this.tableData.length + 1,
        name: "",
        phone: "",
        details: [{
          nation: "",
          id: "",
          birthday: "",
          age: "",
          health: "",
          PoliticalStatus: "",
        }]
      });
    },
    deleteSelectedRecords() {
      this.tableData = this.tableData.filter(item => !this.multipleSelection.includes(item));
      this.multipleSelection = [];
    },
    handleExportTable(table_id) {
      this.$nextTick(function () {
        new_export_excel(table_id);
      });
    },
    parseExcel() { 
      if (this.file) {
        let that = this;
        that.tableData = [];
        const reader = new FileReader();
        reader.onload = function (e) {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          let currentVehicle = null;

          for (let i = 2; i < jsonData.length; i++) {
            let row = jsonData[i];
            if (row.length === 0) continue;

            let dateValue = row[7];
            if (typeof dateValue === 'number') {
              const date = XLSX.SSF.parse_date_code(dateValue);
              dateValue = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
            } else if (typeof dateValue === 'string') {
              const [day, month, year] = dateValue.split('/');
              if (year && month && day) {
                dateValue = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
              }
            }

            if (row[1]) { 
              if (currentVehicle) {
                that.tableData.push(currentVehicle);
              }
              currentVehicle = {
                xuhao: that.tableData.length + 1,
                name: row[1] || "",
                phone: dateValue || "",
                details: [{
                  nation: row[2] || "",
                  id: row[3] || "",
                  birthday: row[4] || "",
                  age: row[5] || "",
                  health: row[6] || "",
                  PoliticalStatus: row[8] || ""
                }]
              };
            } else if (currentVehicle) { 
              currentVehicle.details.push({
                nation: row[2] || "",
                id: row[3] || "",
                birthday: row[4] || "",
                age: row[5] || "",
                health: row[6] || "",
                PoliticalStatus: row[8] || ""
              });
            }
          }

          if (currentVehicle) {
            that.tableData.push(currentVehicle);
          }
        };
        reader.readAsBinaryString(this.file);
      } else {
        console.error('No file selected');
      }
    },
    handleMonthChange() {
      if (this.selectMonth) {
        const [year, month] = this.selectMonth.split('-');
        this.path = `${year}-${month}`;
        this.fetchDataForMonth();
      }
    },
    fetchDataForMonth() {
      axios.post('/api/data/p5', { iddd: this.path }, {
        headers: { 'Content-Type': 'application/json' },
      }).then(response => {
        // if (response.data && response.data.length > 0) {
        //   this.tableData = response.data;
        // } else {
        //   this.createEmptyMonthData();
        // }
        this.tableData = response.data || [{}];
        if(this.tableData.length==undefined) this.tableData=[{}] 
      }).catch(error => {
        console.error('Error fetching data:', error);
        this.$message.error('获取数据失败，请重试');
      });
    },
    createEmptyMonthData() {
      const [year, month] = this.selectMonth.split('-');
      const daysInMonth = new Date(year, month, 0).getDate();
      this.tableData = Array.from({ length: daysInMonth }, (_, i) => ({
        xuhao: i + 1,
        name: "",
        phone: `${year}-${month}-${String(i + 1).padStart(2, '0')}`,
        details: [{
          nation: "",
          id: "",
          birthday: "",
          age: "",
          health: "",
          PoliticalStatus: "",
        }]
      }));
    },
    save() {
      axios.post('/api/save/p5',[this.tableData, this.path], {
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
    }
  }
};
</script>


  
  <style lang="scss" scoped>
  @import '../../styles/app';
  
  .table-header {
    width: 100%;
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
      color: #01010d;
    }
  
    // 表头高度
    ::v-deep .el-table__header th {
      padding: 0;
      height: 50px;
      line-height: 50px;
  
    }
  
    ::v-deep .el-table__body tr,
    ::v-deep.el-table__body td {
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