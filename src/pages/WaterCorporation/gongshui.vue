<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>水务公司</b-breadcrumb-item>
      <b-breadcrumb-item active>地表水厂</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>地表水厂</h5>" customHeader settings close>
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

              <el-table-column prop="riqi" label="日期" width="170">
                <template slot-scope="scope">  
                  <el-date-picker v-model="scope.row.riqi" type="month" placeholder="选择年月" value-format="yyyy-MM" style="width: 100%;"></el-date-picker>
                </template>
              </el-table-column>

              <el-table-column prop="jinshuizongliang" label="进水总量（m³）" width="150">
                <template slot-scope="scope">  
                  <el-input v-model="scope.row.jinshuizongliang"></el-input>  
                </template>
              </el-table-column>

              <el-table-column prop="zhishuizongliang" label="制水总量（m³）" width="150">
                <template slot-scope="scope">  
                  <el-input v-model="scope.row.zhishuizngliang"></el-input>  
                </template>
              </el-table-column>

              <el-table-column label="供水量">
                <el-table-column label="1#管网">
                  <el-table-column prop="zhuchequ" label="主城区（m³）" width="140">
                    <template slot-scope="scope">  
                      <el-input v-model="scope.row.zhuchequ"></el-input>  
                    </template>
                  </el-table-column>

                  <el-table-column prop="xiangzhen" label="乡镇（m³）" width="140">
                    <template slot-scope="scope">  
                      <el-input v-model="scope.row.xiangzhen"></el-input>  
                    </template>
                  </el-table-column>

                  <el-table-column prop="zongji" label="总计（m³）" width="140">
                    <template slot-scope="scope">
                      <span>{{ (parseFloat(scope.row.zhuchequ) || 0) + (parseFloat(scope.row.xiangzhen) || 0) }}</span>
                    </template>
                  </el-table-column>
                </el-table-column>

                <el-table-column label="2#, 3#管网">
                  <el-table-column prop="jingkaiqu" label="经开区（m³）" width="140">
                    <template slot-scope="scope">  
                      <el-input v-model="scope.row.jingkaiqu"></el-input>  
                    </template>
                  </el-table-column>

                  <el-table-column prop="xz" label="乡镇（m³）" width="140">
                    <template slot-scope="scope">  
                      <el-input v-model="scope.row.xz"></el-input>  
                    </template>
                  </el-table-column>

                  <el-table-column prop="linshuigongchang" label="临空水厂（m³）" width="140">
                    <template slot-scope="scope">  
                      <el-input v-model="scope.row.linshuigongchang"></el-input>  
                    </template>
                  </el-table-column>

                  <el-table-column prop="sanshekou" label="三圣口（m³）" width="140">
                    <template slot-scope="scope">  
                      <el-input v-model="scope.row.sansheku"></el-input>  
                    </template>
                  </el-table-column>

                  <el-table-column prop="jxdz" label="津兴东站（m³）" width="140">
                    <template slot-scope="scope">  
                      <el-input v-model="scope.row.jxdz"></el-input>  
                    </template>
                  </el-table-column>

                  <el-table-column prop="jinzewei" label="金泽水厂（m³）" width="140">
                    <template slot-scope="scope">  
                      <el-input v-model="scope.row.jinzewei"></el-input>  
                    </template>
                  </el-table-column>

                  <el-table-column prop="zongji2" label="总计（m³）" width="140">
                    <template slot-scope="scope">
                      <span>{{ (parseFloat(scope.row.jingkaiqu) || 0) + 
                               (parseFloat(scope.row.linshuigongchang) || 0) + 
                               (parseFloat(scope.row.sansheku) || 0) + 
                               (parseFloat(scope.row.jinzewei) || 0) +
                               (parseFloat(scope.row.xz) || 0) +
                               (parseFloat(scope.row.jxdz) || 0) 
                               
                               }}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table-column>

              <el-table-column prop="shengtaishui" label="生态水（m³）" width="140">
                <template slot-scope="scope">  
                  <el-input v-model="scope.row.shengtaishui"></el-input>  
                </template>
              </el-table-column>

              <el-table-column prop="total" label="供水量总计（m³）" width="140">
                <template slot-scope="scope">
                  <span>{{ 
                              //   (parseFloat(scope.row.jingkaiqu) || 0) + 
                              //  (parseFloat(scope.row.linshuigongchang) || 0) + 
                              //  (parseFloat(scope.row.sansheku) || 0) + 
                              //  (parseFloat(scope.row.jinzewei) || 0) + 
                              //  (parseFloat(scope.row.zhuchequ) || 0) + 
                              //  (parseFloat(scope.row.xiangzhen) || 0) + 
                              //  (parseFloat(scope.row.shengtaishui) || 0) + 
                              //  (parseFloat(scope.row.zhishuizngliang) || 0) + 
                              //  (parseFloat(scope.row.jinshuizongliang) || 0)+
                              //  (parseFloat(scope.row.xz) || 0)+
                              //  (parseFloat(scope.row.jxdz) || 0)
                              (parseFloat(scope.row.zhuchequ) || 0) + (parseFloat(scope.row.xiangzhen) || 0)+(parseFloat(scope.row.jingkaiqu) || 0) + 
                               (parseFloat(scope.row.linshuigongchang) || 0) + 
                               (parseFloat(scope.row.sansheku) || 0) + 
                               (parseFloat(scope.row.jinzewei) || 0) +
                               (parseFloat(scope.row.xz) || 0) +
                               (parseFloat(scope.row.jxdz) || 0) 

                               }}</span>
                </template>
              </el-table-column>

              <el-table-column prop="target" label="生产目标（m³）" width="140">
                <template slot-scope="scope">  
                  <el-input v-model="scope.row.target"></el-input>  
                </template>
              </el-table-column>

            </el-table>
            <el-table style="display:none;width: 100%" id="DisburseTable1">
              <el-table-column prop="riqi" label="日期" width="100"></el-table-column>
              <el-table-column prop="jinshuizongliang" label="进水总量（m³）" width="150"></el-table-column>
              <el-table-column prop="zhishuizongliang" label="制水总量（m³）" width="150"></el-table-column>

              <el-table-column label="供水量">
                <el-table-column label="1#管网">
                  <el-table-column prop="zhuchequ" label="主城区（m³）" width="140"></el-table-column>
                  <el-table-column prop="xiangzhen" label="乡镇（m³）" width="140"></el-table-column>
                  <el-table-column prop="zongji" label="总计（m³）" width="140"></el-table-column>
                </el-table-column>

                <el-table-column label="2#, 3#管网">
                  <el-table-column prop="jingkaiqu" label="经开区（m³）" width="140"></el-table-column>
                  <el-table-column prop="xz" label="乡镇（m³）" width="140"></el-table-column>
                  <el-table-column prop="linshuigongchang" label="临空水厂（m³）" width="140"></el-table-column>
                  <el-table-column prop="sanshekou" label="三舍口（m³）" width="140"></el-table-column>
                  <el-table-column prop="jxdz" label="津兴东站（m³）" width="140"></el-table-column>

                  <el-table-column prop="jinzewei" label="金泽水厂（m³）" width="140"></el-table-column>
                  <el-table-column prop="zongji2" label="总计（m³）" width="140"></el-table-column>
                </el-table-column>
              </el-table-column>

              <el-table-column prop="shengtaishui" label="生态水（m³）" width="140"></el-table-column>
              <el-table-column prop="total" label="供水量总计（m³）" width="140"></el-table-column>
              <el-table-column prop="target" label="生产目标（m³）" width="140"></el-table-column>
            </el-table>
          </div>

          <!-- 添加折线图按钮 -->
          <div class="table-footer">
            <b-button variant="success" @click="generateChart">生成折线图</b-button>
          </div>

          <!-- 添加折线图的 canvas -->
          <div v-if="chartVisible" style="margin-top: 20px;">
            <canvas id="targetChart"></canvas>
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
  name: 'gongshui',
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
    axios.get('/api/data/gongshui').then(response => {
      // if(this.tableData.length>0)
      this.tableData = response.data;
    }).catch(error => {
      console.error('Error fetching JSON:', error);
      // 如果数据不存在，初始化为空数组
      this.tableData = [];
    });
  },
  beforeDestroy() {
    this.uploadData();
  },
  computed: {
    filteredItems() {
      let temp = [];

      if (this.selectMonth != null) {
        let i = 0;
        for (i = 0; i < this.tableData.length; i++) {
          const datee = new Date(this.tableData[i].riqi);
          let yy = datee.getFullYear();
          let mm = datee.getMonth() + 1;
          let t = "";
          if (mm < 10) t = yy + "-" + "0" + mm;
          else t = yy + "-" + mm;

          if (t === this.selectMonth) {
            temp.push(this.tableData[i]);
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
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请先选择要删除的数据',
          type: 'warning',
        });
        return;
      }
      const set = new Set(this.multipleSelection);
      this.tableData = this.tableData.filter(item => !set.has(item));
      this.multipleSelection = [];
      // 立即保存
      this.uploadData();
    },
    addData() {
      this.tableData.push({});
      // 立即保存
      this.uploadData();
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
          console.log("Parsed JSON Data: ", jsonData);

          const title = ["riqi", "jinshuizongliang", "zhishuizongliang", "zhuchequ", "xiangzhen", "zongji", "jingkaiqu", 'xz',"linshuigongchang", "sanshekou", 'jxdz',"jinzewei", "zongji2", "shengtaishui", "total", "target"];

          this.tableData = jsonData.slice(1).map((row, i) => {
            const obj = {};
            row.forEach((cell, j) => {
              if (title[j] === "riqi") {
                if (typeof cell === 'number' && !isNaN(cell)) {
                  const epoch = new Date(Date.UTC(1899, 11, 30));
                  const parsedDate = new Date(epoch.getTime() + (cell * 24 * 60 * 60 * 1000));
                  obj[title[j]] = parsedDate.toISOString().split('T')[0];
                } else {
                  console.log("Invalid date or empty cell at row ", i, ", column ", j);
                  obj[title[j]] = null;
                }
              } else {
                obj[title[j]] = typeof cell === 'number' ? cell.toFixed(2) : cell;
              }
            });
            return obj;
          });
        };
      }
    },
    uploadData() {
      axios.post('/api/save/gongshui', this.tableData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          console.log('地表水厂数据保存成功');
          this.$message({
            message: '数据保存成功',
            type: 'success',
          });
        })
        .catch(error => {
          console.error('地表水厂数据保存失败：', error);
          this.$message({
            message: '数据保存失败，请重试',
            type: 'error',
          });
        });
    },
    generateChart() {
      const labels = this.tableData.map(item => item.riqi);
      const targetData = this.tableData.map(item => (parseFloat(item.jingkaiqu) || 0) + 
                               (parseFloat(item.linshuigongchang) || 0) + 
                               (parseFloat(item.sansheku) || 0) + 
                               (parseFloat(item.jinzewei) || 0) + 
                               (parseFloat(item.zhuchequ) || 0) + 
                               (parseFloat(item.xiangzhen) || 0) + 
                               (parseFloat(item.shengtaishui) || 0) + 
                               (parseFloat(item.zhishuizngliang) || 0) + 
                               (parseFloat(item.jinshuizongliang) || 0));

      this.chartVisible = true;

      this.$nextTick(() => {
        const ctx = document.getElementById('targetChart').getContext('2d');

        if (this.chart) {
          this.chart.destroy(); // 如果已有图表实例，销毁它以避免重复
        }

        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: '总计（m³）',
              data: targetData,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false,
            }]
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
                  text: '生产目标（m³）'
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
  }

  ::v-deep .el-table__body tr,
  ::v-deep.el-table__body td {
    padding: 0;
    height: 50px;
    line-height: 50px;
  }

  ::v-deep .el-table {
    background-color: transparent !important;
    color: white !important;
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

#targetChart {
  max-width: 100%;
  height: 400px;
  margin: 0 auto;
}

.clickable {
  cursor: pointer;
  color: white;
  text-decoration: underline;
}
</style>
