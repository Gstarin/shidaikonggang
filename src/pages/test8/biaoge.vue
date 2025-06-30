<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5> 收入记录 </h5>" customHeader settings close>
          <div class="table-header">
            <b-form-file v-model="file" placeholder="请选择一个Excel文件" style="margin-right: 15px;"></b-form-file>
            <b-button variant="default" class="mr-3" size="sm" @click="parseExcel"
              style="width: 110px;height: 35px;">解析Excel</b-button>
            <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;">导出Excel</b-button>
            <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="submitForm">增加</b-button>
            <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"  @click="handleDelete">删除</b-button>
            <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"
                       @click="saveData">保存</b-button>
          </div>
          <div id="table">
            <el-table :data="tableDataWithTotal" style="width: 100%"  @cell-dblclick="handleCellDblclick"  @selection-change="handleSelectionChange">
              <el-table-column type="selection"  label="序号" fixed :selectable="row => !row.isTotal">
              </el-table-column>
              <el-table-column prop="name1" label="合作客户" fixed width="150">  
                <template slot-scope="scope">  
                  <el-input v-if="!scope.row.isTotal" v-model="scope.row.name1" placeholder="请输入合作客户"></el-input>  
                  <span v-else>{{ scope.row.name1 }}</span>
                </template>  
              </el-table-column>  
              <el-table-column prop="begin" label="开始时间" fixed width="150">  
                <template slot-scope="scope">  
                  <el-input v-if="!scope.row.isTotal" v-model="scope.row.begin" type="date" placeholder="选择开始时间"></el-input>  
                  <span v-else>{{ scope.row.begin }}</span>
                </template>  
              </el-table-column>  
              <el-table-column prop="end" label="结束时间" fixed width="150">  
                <template slot-scope="scope">  
                  <el-input v-if="!scope.row.isTotal" v-model="scope.row.end" type="date" placeholder="选择结束时间"></el-input>  
                  <span v-else>{{ scope.row.end }}</span>
                </template>  
              </el-table-column>  
              <el-table-column prop="way" label="结账方式" fixed width="150">  
                <template slot-scope="scope">  
                  <el-input v-if="!scope.row.isTotal" v-model="scope.row.way" placeholder="请输入结账方式"></el-input>  
                  <span v-else>{{ scope.row.way }}</span>
                </template>  
              </el-table-column>  
              
              <!-- 月份列 -->  
              <el-table-column v-for="month in 12" :key="month" :label="`${month}月份`" width="200">  
                <el-table-column :prop="`yuji${month}`" label="预计收入" width="100">  
                  <template slot-scope="scope">  
                    <el-input v-if="!scope.row.isTotal" type="number" v-model.number="scope.row[`yuji${month}`]" placeholder="预计收入"></el-input>  
                    <span v-else>{{ scope.row[`yuji${month}`] }}</span>
                  </template>  
                </el-table-column>  
                <el-table-column :prop="`shiji${month}`" label="实际收入" width="100">  
                  <template slot-scope="scope">  
                    <el-input v-if="!scope.row.isTotal" type="number" v-model.number="scope.row[`shiji${month}`]" placeholder="实际收入"></el-input>  
                    <span v-else>{{ scope.row[`shiji${month}`] }}</span>
                  </template>    
                </el-table-column>  
              </el-table-column> 

              <el-table-column  label="共计预计收入" fixed="right">
                <template slot-scope="scope">  
                  <span>{{ calculateTotalYuji(scope.row) }}</span>  
                </template> 
              </el-table-column>
              <el-table-column  label="共计实际收入" fixed="right">
                <template slot-scope="scope">  
                  <span>{{ calculateTotalShiji(scope.row) }}</span>  
                </template> 
              </el-table-column>

              <el-table-column prop="rate" label="达成率" fixed="right">
                <template slot-scope="scope">  
                  <span>{{ calculateRate(scope.row) }}</span>  
                </template> 
              </el-table-column>

            </el-table>
          </div>  

          <el-dialog  
            title="修改值"  
            :visible.sync="dialogVisible"  
            width="30%"  
            @close="dialogVisible = false"  
          >  
            <el-input v-model="editingValue" placeholder="请输入新值"></el-input>  
            <span slot="footer" class="dialog-footer">  
              <el-button @click="dialogVisible = false">取 消</el-button>  
              <el-button type="primary" @click="updateValue">确 定</el-button>  
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
  name: 'test8',
  components: { Widget, Sparklines },
  data() {
    return {
      dialogVisible: false,
      editingRow: null,
      editingValue: '',
      editingcolumn: null,
      multipleSelection: [],
      file: null,
      currentPage: 1,
      tableData: [{id:"1",name1:"1",begin:"11",end:"22",way:"333",yuji1:1,shiji1:1,yuji2:2,shiji2:2,yuji3:3,shiji3:3,yuji4:4,shiji4:4,yuji5:5,shiji5:1,yuji6:2,shiji6:2,yuji7:3,shiji7:3,yuji8:4,shiji8:4,yuji9:1,shiji9:1,yuji10:2,shiji10:2,yuji11:3,shiji11:3,yuji12:4,shiji12:4}],
    };
  },
  mounted() {
    axios.get('/api/data/test8').then(response => {
      this.tableData = response.data
    }).catch(error => {
      console.error('Error fetching JSON:', error);
    });
  },
  beforeDestroy() {
    if (this.tableData.length > 0) {
      axios.post('/api/save/test8', this.tableData, {
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
    current() {
      const start = (this.currentPage - 1) * 20;
      const end = start + 20;
      return this.tableData.slice(start, end);
    },
    rows() {
      return this.tableData.length
    },
    totalYuji() {
      return this.tableData.reduce((total, row) => {
        return total + this.calculateTotalYuji(row);
      }, 0).toFixed(2);
    },
    totalShiji() {
      return this.tableData.reduce((total, row) => {
        return total + this.calculateTotalShiji(row);
      }, 0).toFixed(2);
    },
    tableDataWithTotal() {
      const data = this.current;
      const totalRow = {
        id: '合计',
        name1: '合计',
        begin: '',
        end: '',
        way: '',
        isTotal: true
      };
      for (let i = 1; i <= 12; i++) {
        totalRow[`yuji${i}`] = this.tableData.reduce((sum, row) => sum + (parseFloat(row[`yuji${i}`]) || 0), 0);
        totalRow[`shiji${i}`] = this.tableData.reduce((sum, row) => sum + (parseFloat(row[`shiji${i}`]) || 0), 0);
      }
      return [...data, totalRow];
    }
  },
  methods: {
    calculateTotalYuji(row) {
      return Array.from({length: 12}, (_, i) => i + 1)
        .reduce((sum, month) => sum + (parseFloat(row[`yuji${month}`]) || 0), 0);
    },
    calculateTotalShiji(row) {
      return Array.from({length: 12}, (_, i) => i + 1)
        .reduce((sum, month) => sum + (parseFloat(row[`shiji${month}`]) || 0), 0);
    },
    calculateRate(row) {
      const totalYuji = this.calculateTotalYuji(row);
      const totalShiji = this.calculateTotalShiji(row);
      return totalYuji ? ((totalShiji / totalYuji) * 100).toFixed(2) + '%' : '0.00%';
    },
    handleSelectionChange(val) {  
      this.multipleSelection = val;   
    },  
    saveData() {
      axios.post('/api/save/test8', this.tableData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        console.log('保存成功');
        this.$message.success('保存成功');
      })
      .catch(error => {
        console.error('保存时出错：', error);
        this.$message.error('保存失败，请重试');
      });
    },
    handleDelete() {  
      const set = new Set(this.multipleSelection);  
      this.tableData = this.tableData.filter(item => !set.has(item));  
      this.multipleSelection = [];  
      this.tableData.forEach((item, index) => item.id = (index + 1).toString());
    },  
    submitForm() {
      const newRow = {
        id: (this.tableData.length + 1).toString(),
        name1: "",
        begin: "",
        end: "",
        way: "",
        ...Array.from({length: 12}, (_, i) => i + 1).reduce((obj, month) => ({
          ...obj,
          [`yuji${month}`]: 0,
          [`shiji${month}`]: 0
        }), {})
      };
      this.tableData.push(newRow);
    },
    handleCellDblclick(row, column, cell, event) {  
      if (!row.isTotal) {
        this.editingRow = row.id;
        this.editingcolumn = column.property;
        this.editingValue = row[column.property];
        this.dialogVisible = true;
      }
    },  
    isNumeric(str) {  
      return !isNaN(parseFloat(str)) && isFinite(str);  
    },  
    updateValue() {  
      if (this.editingRow && this.editingValue !== this.editingRow.value) {  
        const index = this.tableData.findIndex(item => item.id === this.editingRow);
        if (index !== -1) {
          this.tableData[index][this.editingcolumn] = this.isNumeric(this.editingValue) 
            ? Number(this.editingValue) 
            : this.editingValue;
        }
      }  
      this.dialogVisible = false;
    },  
    parsePrice(price) {
      if (price === undefined) {
        return price
      }
      else {
        price = Number(price)
        const priceStr = price.toFixed(2);
        const formattedPrice = priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return formattedPrice;
      }
    },
    handlePictureChange(event, item) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          item.picture = e.target.result;
          item.isEditing = false;
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
        const reader = new FileReader();
        reader.readAsArrayBuffer(this.file);
        reader.onload = (e) => {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const title = ["id","name1","begin","end","way","yuji1","shiji1","yuji2","shiji2","yuji3","shiji3","yuji4","shiji4","yuji5","shiji5","yuji6","shiji6","yuji7","shiji7","yuji8","shiji8","yuji9","shiji9","yuji10","shiji10","yuji11","shiji11","yuji12","shiji12"];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          this.tableData = [];
          for (let i = 1; i < jsonData.length; i++) {
            let obj = {};
            if (jsonData[i].length == 0) {
              continue;
            }
            for (let j = 0; j < jsonData[i].length; j++) {
              if (typeof jsonData[i][j] === 'number') {
                obj[title[j]] = jsonData[i][j].toFixed(2);
              } else {
                obj[title[j]] = jsonData[i][j];
              }
            }
            obj["isEditing"] = false;
            this.tableData.push(obj);
          }
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/app';

#total-income {
  font-size: 16px;
  color: #fff; /* 或者根据你的主题颜色调整 */
}
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
    color: white;
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
     background-color:rgb(48, 53, 59);
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