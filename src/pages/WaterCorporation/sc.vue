<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>青清水务</b-breadcrumb-item>
      <b-breadcrumb-item active>水厂经营成本</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>水厂经营成本</h5>" customHeader settings close>
          <div class="table-header">
            <b-form-file v-model="file" accept=".xlsx, .xls" placeholder="请选择一个Excel文件" class="mr-3" style="width: 40%;"></b-form-file>
            <b-button variant="primary" @click="parseExcel">上传并解析</b-button>

            <b-button variant="default" @click="addRecord">增加</b-button>
            <b-button variant="danger" @click="deleteSelectedRecords">删除</b-button>
            <b-button variant="default" @click="handleExportTable('DisburseTable1')">下载模板</b-button>
            <el-date-picker v-model="selectMonth" type="month" placeholder="选择年月"  value-format="yyyy-MM" style="margin-right: 15px"></el-date-picker>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead id="DisburseTable1">
                <tr>
                  <th><b-form-checkbox v-model="selectAll" @change="selectAllRecords"></b-form-checkbox></th>
                  <th>月度</th>
                  <th>药剂费</th>
                  <th>电费</th>
                  <th>设备维修费</th>
                  <th>人员工资</th>
                  <th>食堂费用</th>
                  <th>其他费用</th>
                  <th>合计</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in items" :key="index" v-if="row.index == selectMonth || selectMonth == null">
                  <td><b-form-checkbox v-model="row.selected"></b-form-checkbox></td>
                  <td><el-date-picker v-model="row.index" type="month" placeholder="选择年月"  value-format="yyyy-MM" style="margin-right: 15px"></el-date-picker></td>
                  <td><b-form-input v-model="row.materialName" /></td>
                  <td><b-form-input v-model="row.specModel" /></td>
                  <td><b-form-input v-model="row.unit" /></td>
                  <td><b-form-input v-model="row.requestQuantity" /></td>
                  <td><b-form-input v-model="row.receivedQuantity" /></td>
                  <td><b-button variant="default" @click="edit(row.index)">查看</b-button></td>
                  <td><span>{{((Number(row.materialName)||0)+(Number(row.specModel)||0)+(Number(row.unit)||0)+(Number(row.requestQuantity)||0)+(Number(row.receivedQuantity)||0)+(Number(row.qita)||0)).toFixed(2)}}</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 添加折线图按钮 -->
          <div class="table-footer">
            <b-button variant="success" @click="generateChart">生成折线图</b-button>
          </div>

          <!-- 添加折线图的 canvas -->
          <div v-if="chartVisible" style="margin-top: 20px;">
            <canvas id="costChart"></canvas>
          </div>
          
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import Vue from 'vue';
import Widget from '@/components/Widget/Widget';
import * as XLSX from 'xlsx/xlsx.mjs';
import axios from '@/utils/axios.js';
import { export_excel } from '@/utils/exportExcel.js';
import { Chart } from 'chart.js';

export default {
  name: 'sc',
  components: { Widget },
  data() {
    return {
      selectMonth: null,
      file: null,
      items: [],
      selectAll: false,
      chartVisible: false,  // 控制图表的显示
      chart: null,          // Chart.js 实例
      cnt:0
    };
  },
  beforeDestroy() {
    axios.post('/api/save/sc', this.items, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('记录上传成功:', response.data);
      this.$bvToast.toast('数据保存成功', {
        title: '成功',
        variant: 'success',
        solid: true
      });
    }).catch(error => {
      console.error('记录上传出错:', error);
      this.$bvToast.toast('数据保存失败，请重试', {
        title: '错误',
        variant: 'danger',
        solid: true
      });
    });
  },
  mounted() {
    axios.get('/api/data/sc').then(response => {
      // if(this.items.length>0)
      this.items = response.data || [];
      if(this.items.length==undefined) this.items=[];
      this.fetchNext();

    }).catch(error => {
      console.error('Error fetching JSON:', error);
      this.items = [];
      this.$bvToast.toast('数据加载失败，请刷新页面重试', {
        title: '错误',
        variant: 'warning',
        solid: true
      });
    });

 
  },
  methods: {
    fetchNext() { 
      axios.post('/api/save/sc2', { "iddd": this.items[this.cnt].index }, {
              headers: {
                  'Content-Type': 'application/json',
              },
          })
          .then(response2 => {
           
                  this.items[this.cnt].qita=0;
                  let j=0;
                  for(j=0;j<response2.data.length;j++)
                  {
                    this.items[this.cnt].qita+=Number(response2.data[j].time)
                  }
                this.cnt+=1;
                this.fetchNext();                  
                  
              })
              .catch(error => {
                  console.error('市政公司收入表文件时出错：', error);
              });
    },
    handleExportTable(table_id) {
      this.$nextTick(function () {
        export_excel(table_id);
      });
    },
    edit(name) {
      this.$router.push({
        path: "/app/WaterCorporation/sc2?name=" + name,
        query: {  
          name: name  
        }  
      });
    },
    parseExcel() {
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // 解析Excel数据
          const parsedData = jsonData.slice(1).map(row => ({
            index: row[0],
            materialName: row[1],
            specModel: row[2],
            unit: row[3],
            requestQuantity: row[4],
            receivedQuantity: row[5],
            stockQuantity: row[6],
            stockTime: row[7],
            selected: false
          }));

          this.items = parsedData;
        };
        reader.readAsArrayBuffer(this.file);
      }
    },
    addRecord() {
      this.items.push({
        time: '',
        in_stock: '',
        out_stock: '',
        remaining: '',
        note: '',
        qita:0,
        selected: false
      });
    },
    deleteSelectedRecords() {
      this.items = this.items.filter(item => !item.selected);
    },
    selectAllRecords() {
      this.items.forEach(item => {
        item.selected = this.selectAll;
      });
    },
    generateChart() {
      const selectedItems = this.items.filter(item => item.selected);

      if (selectedItems.length === 0) {
        this.$bvToast.toast('请选择至少一个月份来生成图表', {
          title: '提示',
          variant: 'warning',
          solid: true
        });
        return;
      }

      this.chartVisible = true;

      this.$nextTick(() => {
        const ctx = document.getElementById('costChart').getContext('2d');

        const datasets = [
          {
            label: '药剂费',
            data: selectedItems.map(item => parseFloat(item.materialName) || 0),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
          },
          {
            label: '电费',
            data: selectedItems.map(item => parseFloat(item.specModel) || 0),
            borderColor: 'rgba(192, 75, 75, 1)',
            backgroundColor: 'rgba(192, 75, 75, 0.2)',
            fill: false,
          },
          {
            label: '设备维修费',
            data: selectedItems.map(item => parseFloat(item.unit) || 0),
            borderColor: 'rgba(75, 75, 192, 1)',
            backgroundColor: 'rgba(75, 75, 192, 0.2)',
            fill: false,
          },
          {
            label: '人员工资',
            data: selectedItems.map(item => parseFloat(item.requestQuantity) || 0),
            borderColor: 'rgba(75, 192, 75, 1)',
            backgroundColor: 'rgba(75, 192, 75, 0.2)',
            fill: false,
          },
          {
            label: '食堂费用',
            data: selectedItems.map(item => parseFloat(item.receivedQuantity) || 0),
            borderColor: 'rgba(192, 192, 75, 1)',
            backgroundColor: 'rgba(192, 192, 75, 0.2)',
            fill: false,
          },
          // {
          //   label: '其他费用',
          //   data: selectedItems.map(item => parseFloat(item.stockTime) || 0),
          //   borderColor: 'rgba(75, 75, 75, 1)',
          //   backgroundColor: 'rgba(75, 75, 75, 0.2)',
          //   fill: false,
          // }
        ];

        if (this.chart) {
          this.chart.destroy(); // 如果已有图表实例，销毁它以避免重复
        }

        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: selectedItems.map(item => item.index),
            datasets: datasets
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
                  text: '成本'
                },
                beginAtZero: true
              }
            }
          }
        });
      });
    }
  }
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

#costChart {
  max-width: 100%;
  height: 400px;
  margin: 0 auto;
}
</style>
