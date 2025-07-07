<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>水务公司</b-breadcrumb-item>
      <b-breadcrumb-item active>水厂生产、完成情况</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>水厂生产、完成情况</h5>" customHeader settings close>
          <div class="table-header">
            <b-form-file v-model="file" placeholder="请选择一个Excel文件" style="margin-right: 15px;width:40%"></b-form-file>
            <b-button variant="default" class="mr-3" size="sm" @click="parseExcel" style="width: 160px;height: 35px;">解析Excel</b-button>
            <b-button variant="default" style="width: 160px;height: 35px;" @click="handleExportTable('DisburseTable1')">下载模板</b-button>&nbsp;&nbsp;&nbsp;
            <b-button variant="default" class="mr-3" size="sm" @click="uploadData" style="width: 120px;height: 35px;">上传</b-button>&nbsp;&nbsp;&nbsp;
            <b-button variant="default" class="mr-3" size="sm" @click="addData" style="width: 120px;height: 35px;">增加</b-button>
            <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="handleDelete">删除</b-button>
            <el-date-picker v-model="selectMonth" type="month" placeholder="选择年月" value-format="yyyy-MM" style="margin-right: 15px"></el-date-picker>
          </div>
          <div id="table">
            <el-table :data="current" style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column label="合同名称" width="80" type="selection"></el-table-column>
              <el-table-column prop="yuefen" label="月份" width="150">
                <template slot-scope="scope">
                  <el-date-picker v-model="scope.row.yuefen" type="month" placeholder="选择年月" value-format="yyyy-MM" style="width: 100%;"></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column prop="zongliang" label="总量" width="150">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.zongliang"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="changquxiaojian" label="厂区消减" width="150">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.changquxiaojian"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="yuezuidazhi" label="月最大值" width="150">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.yuezuidazhi"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="yuezuidizhi" label="月最小值" width="150">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.yuezuidizhi"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="pingjiazhi" label="平均值" width="150">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.pingjiazhi"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <el-table style="display:none;width: 100%" id="DisburseTable1">
              <el-table-column prop="yuefen" label="月份" width="150"></el-table-column>
              <el-table-column prop="zongliang" label="总量" width="150"></el-table-column>
              <el-table-column prop="changquxiaojian" label="厂区消减" width="150"></el-table-column>
              <el-table-column prop="yuezuidazhi" label="月最大值" width="150"></el-table-column>
              <el-table-column prop="yuezuidizhi" label="月最小值" width="150"></el-table-column>
              <el-table-column prop="pingjiazhi" label="平均值" width="150"></el-table-column>
            </el-table>
          </div>

          <!-- 添加折线图按钮 -->
          <div class="table-footer">
            <b-button variant="success" @click="generateChart">生成折线图</b-button>
          </div>

          <!-- 添加折线图的 canvas -->
          <div v-if="chartVisible" style="margin-top: 20px;">
            <canvas id="completionChart"></canvas>
          </div>

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
import { export_excel } from '@/utils/exportExcel.js';
import { Chart } from 'chart.js';

export default {
  name: 'completionStatus',
  components: { Widget },
  data() {
    return {
      file: null,
      selectMonth: null,
      currentPage: 1,
      tableData: [],
      multipleSelection: [],
      chartVisible: false,  // 控制折线图的显示
      chart: null,  // Chart.js 实例
    };
  },
  mounted() {
    axios.get('/api/data/completionStatus').then(response => {
      // if(this.tableData.length>0)
      this.tableData = response.data;
    }).catch(error => {
      console.error('Error fetching JSON:', error);
    });
  },
  beforeDestroy() {
    this.uploadData();
  },
  computed: {
    filteredItems() {
      let temp = [];
      if (this.selectMonth != null) {
        for (let i = 0; i < this.tableData.length; i++) {
          const dateStr = this.tableData[i].yuefen;
          if (dateStr) {
            const [year, month] = dateStr.split('-');
            const t = `${year}-${month.padStart(2, '0')}`;
            if (t === this.selectMonth) {
              temp.push(this.tableData[i]);
            }
          }
        }
      } else {
        temp = this.tableData;
      }
      return temp;
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
    handleDelete() {  
      const set = new Set(this.multipleSelection);  
      this.tableData = this.tableData.filter(item => !set.has(item));  
      this.multipleSelection = [];  
    },  
    addData() {
      this.tableData.push({});
    },
    handleExportTable(table_id) {
      this.$nextTick(function () {
        export_excel(table_id);
      });
    },
    handleSelectionChange(val) {  
      this.multipleSelection = val; 
    },  
    parseExcel() {
      if (this.file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(this.file);
        reader.onload = (e) => {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const title = ["yuefen", "zongliang", "changquxiaojian", "yuezuidazhi", "yuezuidizhi", "pingjiazhi"];

          this.tableData = jsonData.slice(1).map(row => {
            const obj = {};
            row.forEach((cell, index) => {
              if (title[index] === "yuefen") {
                if (typeof cell === 'number' && !isNaN(cell)) {
                  const epoch = new Date(Date.UTC(1899, 11, 30));
                  const parsedDate = new Date(epoch.getTime() + (cell * 24 * 60 * 60 * 1000));
                  obj[title[index]] = parsedDate.toISOString().split('T')[0];
                } else {
                  obj[title[index]] = cell;
                }
              } else {
                obj[title[index]] = typeof cell === 'number' ? cell.toFixed(2) : cell;
              }
            });
            return obj;
          });
        };
      }
    },
    uploadData() {
      axios.post('/api/save/completionStatus', this.tableData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          console.log('数据上传成功');
        })
        .catch(error => {
          console.error('数据上传出错：', error);
        });
    },
    generateChart() {
      const labels = this.tableData.map(item => item.yuefen);
      const zongliangData = this.tableData.map(item => parseFloat(item.zongliang) || 0);
      const changquxiaojianData = this.tableData.map(item => parseFloat(item.changquxiaojian) || 0);
      const yuezuidazhiData = this.tableData.map(item => parseFloat(item.yuezuidazhi) || 0);
      const yuezuidizhiData = this.tableData.map(item => parseFloat(item.yuezuidizhi) || 0);
      const pingjiazhiData = this.tableData.map(item => parseFloat(item.pingjiazhi) || 0);

      this.chartVisible = true;

      this.$nextTick(() => {
        const ctx = document.getElementById('completionChart').getContext('2d');

        if (this.chart) {
          this.chart.destroy(); // 如果已有图表实例，销毁它以避免重复
        }

        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: '总量',
                data: zongliangData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
              },
              {
                label: '厂区消减',
                data: changquxiaojianData,
                borderColor: 'rgba(192, 75, 75, 1)',
                backgroundColor: 'rgba(192, 75, 75, 0.2)',
                fill: false,
              },
              {
                label: '月最大值',
                data: yuezuidazhiData,
                borderColor: 'rgba(75, 75, 192, 1)',
                backgroundColor: 'rgba(75, 75, 192, 0.2)',
                fill: false,
              },
              {
                label: '月最小值',
                data: yuezuidizhiData,
                borderColor: 'rgba(192, 192, 75, 1)',
                backgroundColor: 'rgba(192, 192, 75, 0.2)',
                fill: false,
              },
              {
                label: '平均值',
                data: pingjiazhiData,
                borderColor: 'rgba(75, 192, 75, 1)',
                backgroundColor: 'rgba(75, 192, 75, 0.2)',
                fill: false,
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: '月份'
                }
              },
              y: {
                title: {
                  display: true,
                  text: '数值'
                },
                beginAtZero: true
              }
            }
          }
        });
      });
    }
  },
};
</script>
<style lang="scss" scoped>
@import '../../styles/app';
.form-control {  
  background-color: white !important; /* 使用 !important 确保覆盖其他样式 */  
}
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
    color: white;
  }

  ::v-deep .el-table__header th {
    padding: 0;
    height: 50px;
    line-height: 50px;
    border: 1px solid white; 
  }

  ::v-deep .el-table__body tr,
  ::v-deep .el-table__body td {
    padding: 0;
    height: 50px;
    line-height: 50px;
    border: 1px solid white; 
  }

  ::v-deep .el-table {
    background-color: transparent !important;
    color: white !important;
    border-collapse: collapse; 
    width: 100%; 
  }

  ::v-deep .el-table__expanded-cell {
    background-color: transparent !important;
  }

  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table td {
    background-color: transparent;
    border: 1px solid white; 
  }

  ::v-deep .el-table th {
    border-top: 1px solid white !important; 
  }
}

#completionChart {
  max-width: 100%;
  height: 400px;
  margin: 20px auto;  /* 图表居中 */
}

.clickable {
  cursor: pointer;
  color: white;
  text-decoration: underline;
}
</style>
