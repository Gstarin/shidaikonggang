<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>车辆年审费用</h5>" customHeader settings close>
          <div class="table-header">
            <b-form-file v-model="file" placeholder="请选择一个Excel文件" style="margin-right: 15px;"></b-form-file>
            <b-button variant="default" class="mr-3" size="sm" @click="parseExcel" style="width: 110px;height: 35px;">
              解析Excel
            </b-button>
            <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="handleExportTable('DisburseTable')">
              导出Excel
            </b-button>
            <b-button variant="default" class="mr-3" size="sm" @click="addRecord" style="width: 110px;height: 35px;">
              增加
            </b-button>
            <b-button variant="danger" class="mr-3" size="sm" @click="deleteSelectedRecords" style="width: 110px;height: 35px;">
              删除
            </b-button>
            <el-date-picker v-model="selectMonth" type="month" placeholder="选择年月" @change="handleMonthChange" value-format="yyyy-MM" style="margin-right: 15px;">
            </el-date-picker>
            <b-button variant="default" class="mr-3" size="sm" @click="save" style="width: 110px;height: 35px;">
              保存
            </b-button>
          </div>
          <div id="table">
            <el-table :data="current" style="width: 100%" id="DisburseTable" @selection-change="handleSelectionChange" @cell-dblclick="handleCellDblclick">
              <el-table-column type="selection" width="55"></el-table-column>

              <el-table-column prop="xuhao" label="序号">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.xuhao" class="white-input"></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="name" label="车牌号">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name" class="white-input"></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="gendeer" label="所属车队">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.gendeer" class="white-input"></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="nation" label="年审日期">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.nation" class="white-input"></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="id" label="有效期至">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.id" class="white-input"></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="birthday" label="年审费（元）">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.birthday" class="white-input"></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="age" label="备注">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.age" class="white-input"></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="img" label="图片">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.img" class="white-input"></el-input>
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
  name: 'p6',
  components: { Widget, Sparklines },
  data() {
    return {
      file: null,
      dialogVisible1: false,
      editingRow: null, // 当前编辑的行数据  
      editingValue: '', // 输入框中的值  
      editingcolumn: null,
      currentPage: 1,
      tableData: [],
      multipleSelection: [], // 用于存储选中的记录
      selectMonth: null,  // 用于存储用户选择的月份
      path: '',  // 用于存储生成的路径信息
    };
  },
  // mounted() {
  //   axios.get('/api/data/p6').then(response => {
  //     console.log('Fetched JSON:', response.data);
  //     this.tableData = response.data;
  //   }).catch(error => {
  //     console.error('Error fetching JSON:', error);
  //   });
  // },
  // beforeDestroy() {
  //   axios.post('/api/save/p6', this.tableData, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then(response => {
  //       console.log('上传成功');
  //     })
  //     .catch(error => {
  //       console.error('出错：', error);
  //     });
  // },
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
        xuhao: this.tableData.length + 1,
        name: "",
        gendeer: "",
        nation: "",
        id: "",
        birthday: "",
        age: "",
        img: "",
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
        that.tableData = [];
        const reader = new FileReader();
        reader.readAsArrayBuffer(this.file);
        reader.onload = function (e) {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          // 获取第一个工作表
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const title = [
            "name", "gendeer", "nation", "id", "birthday", "age", "img"
          ];
          // 解析工作表数据
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          for (let i = 2; i < jsonData.length; i++) {
            let obj = {};
            if (jsonData[i].length == 0) {
              continue;
            }
            for (let j = 0; j < jsonData[i].length; j++) {
              if (typeof jsonData[i][j + 1] === 'number') {
                obj[title[j]] = jsonData[i][j + 1].toFixed(2);
              } else {
                obj[title[j]] = jsonData[i][j + 1];
              }
            }
            obj.xuhao = i - 1;
            obj["isEditing"] = false;
            that.tableData.push(obj);
          }
        };
        reader.readAsBinaryString(this.file);
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
      axios.post('/api/data/p6', { iddd: this.path }, {
        headers: { 'Content-Type': 'application/json' },
      }).then(response => {
        this.tableData = response.data || [{}];
        // console.log(this.tableData.length)
        if(this.tableData==undefined) this.tableData=[{}]        // if (!this.tableData.length) {
        //   const daysInMonth = new Date(this.selectMonth.split('-')[0], this.selectMonth.split('-')[1], 0).getDate();
        //   for (let i = 1; i <= daysInMonth; i++) {
        //     this.tableData.push({
        //       xuhao: i,
        //       name: "",
        //       gendeer: "",
        //       nation: "",
        //       id: "",
        //       birthday: "",
        //       age: "",
        //       img: "",
        //     });
        //   }
        // }
      }).catch(error => {
        console.error('Error fetching data:', error);
      });
    },
    save() {
      axios.post('/api/save/p6', [this.tableData, this.path], {
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