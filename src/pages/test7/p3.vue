<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>保险费用</h5>" customHeader settings close>
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
            <el-table :data="current" style="width: 100%" id="DisburseTable" @selection-change="handleSelectionChange" @cell-dblclick="handleCellDblclick">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="sequenceNumber" label="序号">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sequenceNumber" class="white-input"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="vehicleType" label="车辆类型">
            <template slot-scope="scope">
              <el-input v-model="scope.row.vehicleType" class="white-input"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="plateNumber" label="车牌号">
            <template slot-scope="scope">
              <el-input v-model="scope.row.plateNumber" class="white-input"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="compulsoryInsurance" label="交强">
            <template slot-scope="scope">
              <el-input v-model="scope.row.compulsoryInsurance" class="white-input"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="commercialInsurance" label="商业险">
            <template slot-scope="scope">
              <el-input v-model="scope.row.commercialInsurance" class="white-input"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="vehicleTax" label="车船税">
            <template slot-scope="scope">
              <el-input v-model="scope.row.vehicleTax" class="white-input"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="totalPremium" label="总保费">
            <template slot-scope="scope">
              <el-input v-model="scope.row.totalPremium" class="white-input"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="insurancePeriod" label="保险日期">
            <template slot-scope="scope">
              <el-input v-model="scope.row.insurancePeriod" class="white-input"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="inconsistencyReason" label="保费不一致原因">
            <template slot-scope="scope">
              <el-input v-model="scope.row.inconsistencyReason" class="white-input"></el-input>
            </template>
          </el-table-column>
          
        </el-table>
          </div>
  
          <div class="table-footer">
            <b-pagination v-model="currentPage" :total-rows="rows" size="lg"></b-pagination>
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
import Sparklines from '../../components/Sparklines/Sparklines';
import * as XLSX from 'xlsx/xlsx.mjs';
import axios from '@/utils/axios.js';
import { new_export_excel } from '@/utils/newexportExcel.js';

export default {
  name: 'p3',
  components: { Widget, Sparklines },
  data() {
    return {
      dialogVisible1: false,
      editingRow: null, // 当前编辑的行数据  
      editingValue: '', // 输入框中的值  
      editingcolumn: null,
      file: null,
      currentPage: 1,
      tableData: [],
      multipleSelection: [], // 用于存储选中的记录
      selectMonth: null,  // 用于存储用户选择的月份
      path: '',  // 用于存储生成的路径信息
    };
  },
  mounted() {
    axios.get('/api/data/p3').then(response => {
      console.log('Fetched JSON:', response.data);
      this.tableData = response.data;
    }).catch(error => {
      console.error('Error fetching JSON:', error);
    });
  },
  beforeDestroy() {
    axios.post('/api/save/p3', this.tableData, {
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
  computed: {
    current() {
      const start = (this.currentPage - 1) * 20;
      const end = start + 20;
      console.log(this.tableData.slice(start, end));
      return this.tableData.slice(start, end);
    },
    rows() {
      return this.tableData.length;
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCellDblclick(row, column, cell, event) {  
      this.editingRow = row.xuhao; // 保存当前编辑的行数据 
      this.editingcolumn = column.property;
      this.editingValue = row[column.property]; // 设置输入框的初始值为当前单元格的值  
      this.dialogVisible1 = true; // 显示对话框  
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
      this.dialogVisible1 = false; // 关闭对话框  
    },
    addRecord() {
      this.tableData.push({
        sequenceNumber: this.tableData.length + 1,
        vehicleType: "",
        plateNumber: "",
        compulsoryInsurance: "",
        commercialInsurance: "",
        vehicleTax: "",
        totalPremium: "",
        insurancePeriod: "",
        inconsistencyReason: "",
        selected: false,
        isEditing: false,
      });
    },
    deleteSelectedRecords() {
      this.tableData = this.tableData.filter(item => !this.multipleSelection.includes(item));
      this.multipleSelection = []; // 清空选择
    },
    handleExportTable(table_id) {
      this.$nextTick(function () {
        new_export_excel(table_id);
      });
    },
    parseExcel() {
      if (this.file) {
        let that = this;
        that.tableData = [];  // 清空现有数据
        const reader = new FileReader();
        reader.readAsArrayBuffer(this.file);
        reader.onload = function (e) {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];

          // 获取工作表的有效范围
          const range = XLSX.utils.decode_range(worksheet['!ref']);

          // 更新后的标题映射
          const title = [
            "sequenceNumber",      // 序号
            "vehicleType",         // 车辆类型
            "plateNumber",         // 车牌号
            "compulsoryInsurance", // 交强
            "commercialInsurance", // 商业险
            "vehicleTax",          // 车船税
            "totalPremium",        // 总保费
            "insurancePeriod",     // 保险日期
            "inconsistencyReason"  // 保费不一致原因
          ];

          // 从第二行开始解析数据（跳过表头）
          for (let row = range.s.r + 1; row <= range.e.r; row++) {
            let obj = {};

            for (let col = range.s.c; col <= range.e.c; col++) {
              const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
              const cell = worksheet[cellAddress];
              const value = cell ? cell.v : "";

              if (col < title.length) {
                obj[title[col]] = value;
              }
            }

            // 确保第九列（索引为8）的数据被正确读取
            const ninthColAddress = XLSX.utils.encode_cell({ r: row, c: 8 });
            const ninthColCell = worksheet[ninthColAddress];
            obj.inconsistencyReason = ninthColCell ? ninthColCell.v : "";

            that.tableData.push(obj);
          }

          console.log("Parsed data:", JSON.stringify(that.tableData, null, 2));
          
          // 额外打印第一行数据的所有字段，以便检查
          if (that.tableData.length > 0) {
            console.log("First row data:");
            for (let key in that.tableData[0]) {
              console.log(`${key}: ${that.tableData[0][key]}`);
            }
          }
        };
      }
    },
    handleMonthChange() {
      if (this.selectMonth) {
        const [year, month] = this.selectMonth.split('-');
        this.path = `${year}-${month}`;
        this.fetchDataForMonth();  // 调用获取数据的方法
      }
    },
    fetchDataForMonth() {
      axios.post('/api/data/p3', { iddd: this.path }, {
        headers: { 'Content-Type': 'application/json' },
      }).then(response => {
        this.tableData = response.data || [];
        if(this.tableData.length==undefined) this.tableData=[{}] 
        if (!this.tableData.length) {
          const daysInMonth = new Date(this.selectMonth.split('-')[0], this.selectMonth.split('-')[1], 0).getDate();
          for (let i = 1; i <= daysInMonth; i++) {
            this.tableData.push({
              xuhao: i,
              name: "",
              gendeer: "",
              nation: "",
              id: "",
              birthday: "",
              age: "",
              img: "",
              height: "",
              weight: "",
              health: "",
              phone: "",
              PoliticalStatus: "",
              phone2: "",
              address: "",
              address2: "",
              time: "",
              channel: "",
            });
          }
        }
      }).catch(error => {
        console.error('Error fetching data:', error);
      });
    },
    save() {
      axios.post('/api/save/p3', [this.tableData, this.path], {
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
  },
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