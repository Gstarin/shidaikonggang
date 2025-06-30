<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>加油费用</h5>" customHeader settings close>
          <div class="table-header">
            <b-form-file v-model="file" placeholder="请选择一个Excel文件" style="margin-right: 15px;"></b-form-file>
            <b-button variant="default" class="mr-3" size="sm" @click="parseExcel" style="width: 110px;height: 35px;">解析Excel</b-button>
            <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="handleExportTable('DisburseTable')">导出Excel</b-button>
            <b-button variant="default" class="mr-3" size="sm" @click="addData" style="width: 110px;height: 35px;">增加</b-button>
            <b-button variant="default" class="mr-3" size="sm" @click="handleDelete" style="width: 110px;height: 35px;">删除</b-button>
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
              <el-table-column prop="xuhao" label="序号">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.xuhao" class="white-input"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="date" label="日期">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.date" class="white-input"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="oil_number" label="油号">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.oil_number" class="white-input"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="current_mileage" label="当前里程数">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.current_mileage" class="white-input"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="unit_price" label="单价（元）">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.unit_price" class="white-input"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="refuel_quantity" label="加油升数">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.refuel_quantity" class="white-input"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="refuel_amount" label="加油金额（元）">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.refuel_amount" class="white-input"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="driver" label="驾驶员">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.driver" class="white-input"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="license_plate" label="车牌号码">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.license_plate" class="white-input"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="refuel_times" label="加油次数">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.refuel_times" class="white-input"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="card_number" label="卡号">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.card_number" class="white-input"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="town" label="乡镇">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.town" class="white-input"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" class="white-input"></el-input>
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
    <el-dialog title="修改值" :visible.sync="dialogVisible1" width="30%" @close="dialogVisible1 = false">
      <el-input v-model="editingValue" placeholder="请输入新值"></el-input>
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
  name: 'p1',
  components: { Widget, Sparklines },
  data() {
    return {
      dialogVisible1: false,
      editingRow: null,
      editingValue: '', 
      editingcolumn: null,
      file: null,
      currentPage: 1,
      tableData: [],
      multipleSelection: [], 
      selectMonth: null,  // 用于存储用户选择的月份
      path: '',  // 用于存储生成的路径信息
    };
  },
  mounted() {
    axios.get('/api/data/p1').then(response => {
      console.log('Fetched JSON:', response.data);
      this.tableData = response.data;
    }).catch(error => {
      console.error('Error fetching JSON:', error);
    });
  },
  beforeDestroy() {
    axios.post('/api/save/p1', this.tableData, {
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
    addData() {
      this.tableData.push({});
    },
    handleDelete() {
      const set = new Set(this.multipleSelection);
      this.tableData = this.tableData.filter(item => !set.has(item));
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
    reader.readAsArrayBuffer(this.file);
    reader.onload = function (e) {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // 更新表头字段映射
      const title = [
        "date", // 日期
        "oil_number", // 油号
        "current_mileage", // 当前里程数
        "unit_price", // 单价
        "refuel_quantity", // 加油升数
        "refuel_amount", // 加油金额
        "driver", // 驾驶员
        "license_plate", // 车牌号码
        "refuel_times", // 加油次数
        "card_number", // 卡号
        "town", // 乡镇
        "remark" // 备注
      ];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // 从索引2开始读取数据，跳过表头行
      for (let i = 2; i < jsonData.length; i++) {
        let row = jsonData[i];
        let obj = {};

        // 添加序号字段
        obj['xuhao'] = i-1; // 序号从1开始

        for (let j = 0; j < title.length; j++) {
          let value = row[j];
          // 处理日期字段
          if (title[j] === 'date' && typeof value === 'number') {
            value = XLSX.SSF.parse_date_code(value);
            if (value) {
              value = `${value.y}-${String(value.m).padStart(2, '0')}-${String(value.d).padStart(2, '0')}`;
            }
          }
          obj[title[j]] = value;
        }

        obj["isEditing"] = false;
        that.tableData.push(obj);
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
      axios.post('/api/data/p1', { iddd: this.path }, {
        headers: { 'Content-Type': 'application/json' },
      }).then(response => {
        this.tableData = response.data || [];
        if (!this.tableData.length) {
          const daysInMonth = new Date(this.selectMonth.split('-')[0], this.selectMonth.split('-')[1], 0).getDate();
          for (let i = 1; i <= daysInMonth; i++) {
            this.tableData.push({
              xuhao: i,
              // 初始化其他需要的字段
              date: `${this.path}-${i.toString().padStart(2, '0')}`,
              oil_number: '',
              current_mileage: '',
              unit_price: '',
              refuel_quantity: '',
              refuel_amount: '',
              driver: '',
              license_plate: '',
              refuel_times: '',
              card_number: '',
              town: '',
              remark: '',
            });
          }
        }
      }).catch(error => {
        console.error('Error fetching data:', error);
      });
    },
    save() {
      axios.post('/api/save/p1', [this.tableData, this.path], {
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
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#table {
  ::v-deep .cell {
    color: #01010d;
  }
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
    color: #aeaec8 !important;
  }
  ::v-deep .el-table__expanded-cell {
    background-color: transparent !important;
  }
  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table td {
    background-color: transparent;
  }
  ::v-deep .el-input__inner {
    background-color: white !important; // 修改输入框背景颜色为白色
    color: #01010d !important;
  }
}

</style>
