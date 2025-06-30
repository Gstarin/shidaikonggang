<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>博泰酒店</b-breadcrumb-item>
      <b-breadcrumb-item active>经济指标</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>经济指标</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'economicIndicators'"
            :showExcelHandler="true"
            @update:tableData="updateTableData"
          >
            <!-- 自定义按钮插槽 -->
            <template v-slot:custom-filter1>
              <b-button 
                variant="default" 
                class="mr-3 mb-2" 
                size="sm" 
                @click="showChartDialog"
              >
                生成图表
              </b-button>
            </template>
          </TableTemplate>

          <!-- 图表对话框 -->
          <el-dialog  
            title="图表展示"  
            :visible.sync="dialogVisible"  
            width="80%"  
          >  
            <div style="margin-bottom: 20px;">
              <el-radio-group v-model="currentIndicator" @change="updateBarChart">
                <el-radio-button label="收入">收入</el-radio-button>
                <el-radio-button label="支出">支出</el-radio-button>
                <el-radio-button label="毛利">毛利</el-radio-button>
                <el-radio-button label="利润">利润</el-radio-button>
              </el-radio-group>
            </div>
            <div style="display: flex; justify-content: space-between; height: 400px;">
              <div id="pieChart" style="width: 48%; height: 100%;"></div>  
              <div id="barChart" style="width: 48%; height: 100%;"></div>  
            </div>
            <span slot="footer" class="dialog-footer">  
              <el-button @click="dialogVisible = false">取 消</el-button>  
            </span>  
          </el-dialog>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import TableTemplate from '@/components/Template/xlsxTable';
import * as echarts from 'echarts';
import axios from '@/utils/axios.js';

export default {
  name: 'EconomicIndicators',
  components: { Widget, TableTemplate },
  data() {
    return {
      dialogVisible: false,
      pieChart: null,
      barChart: null,
      currentIndicator: '收入',
      tableData: [
        {xm:"营业总收入",id:"1",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"-主营业务收入",id:"2",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"-其他业务收入",id:"3",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"营业成本",id:"4",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"-主营业务成本",id:"5",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"--材料费",id:"6",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"---直接劳务费",id:"7",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"---其他业务成本",id:"8",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"毛利额1",id:"9",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"毛利额2",id:"10",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"毛利率1",id:"11",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"毛利率2",id:"12",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"税金及附加",id:"13",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"销售费用",id:"14",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"-工资及社保",id:"15",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"-电费及气费",id:"16",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"费用管理",id:"17",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"-工资及社保",id:"18",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"-修缮费及其他",id:"19",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"财务费用",id:"20",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"营业外收支净额",id:"21",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"利润总额",id:"22",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"所得税费用",id:"23",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"净利润",id:"24",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"应收账款年初数",id:"25",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
        {xm:"应收账款期末数",id:"26",month1:"",leiji1:"",tongqi1:"",month2:"",leiji2:"",tongqi2:"",month3:"",leiji3:"",tongqi3:"",shuoming:""},
      ],
      tableColumns: [
        { prop: 'xm', label: '报表项目', width: 180 },
        { prop: 'id', label: '行号', width: 60 },
        { 
          label: '博泰酒店',
          children: [
            { prop: 'month1', label: '本月', width: 120, type: 'number' },
            { prop: 'leiji1', label: '累计', width: 120, type: 'number' },
            { prop: 'tongqi1', label: '同期累计', width: 120, type: 'number' }
          ]
        },
        { 
          label: '客房部',
          children: [
            { prop: 'month2', label: '本月', width: 120, type: 'number' },
            { prop: 'leiji2', label: '累计', width: 120, type: 'number' },
            { prop: 'tongqi2', label: '同期累计', width: 120, type: 'number' }
          ]
        },
        { 
          label: '餐饮部',
          children: [
            { prop: 'month3', label: '本月', width: 120, type: 'number' },
            { prop: 'leiji3', label: '累计', width: 120, type: 'number' },
            { prop: 'tongqi3', label: '同期累计', width: 120, type: 'number' }
          ]
        },
        { prop: 'shuoming', label: '说明', width: 150 }
      ],
      formFields: {
        xm: '',
        id: '',
        month1: '',
        leiji1: '',
        tongqi1: '',
        month2: '',
        leiji2: '',
        tongqi2: '',
        month3: '',
        leiji3: '',
        tongqi3: '',
        shuoming: ''
      }
    };
  },
  
  mounted() {
    this.loadData();
  },

  beforeDestroy() {
    this.saveData();
  },

  methods: {
    updateTableData(newData) {
      this.tableData = newData;
    },

    showChartDialog() {  
      this.dialogVisible = true;  
      this.$nextTick(() => {  
        this.pieChart = echarts.init(document.getElementById('pieChart'), 'macarons');
        this.barChart = echarts.init(document.getElementById('barChart'), 'macarons');
        
        const pieOption = {  
          title: {  
            text: '收入分布',  
            left: 'center'
          },  
          tooltip: {  
            trigger: 'item'
          },  
          legend: {  
            orient: 'vertical',
            left: 'left',
            data: ['客房部', '餐饮部']
          },  
          series: [  
            {  
              name: '收入来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [  
                {value: this.tableData[1].month2, name: '客房部'},  
                {value: this.tableData[1].month3, name: '餐饮部'},  
              ],  
              emphasis: {  
                itemStyle: {  
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }  
              }  
            }  
          ]  
        };  
        
        this.pieChart.setOption(pieOption);  
        this.updateBarChart();
      });   
    },

    updateBarChart() {
      const barOption = {  
        title: {
          text: this.currentIndicator + '指标概览',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['博泰酒店', '客房部', '餐饮部'],
          top: 'bottom'
        },
        xAxis: {
          type: 'category',
          data: ['博泰酒店', '客房部', '餐饮部']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: this.currentIndicator,
            type: 'bar',
            data: this.getDataForIndicator(this.currentIndicator)
          }
        ]
      };  
      
      this.barChart.setOption(barOption);
    },

    getDataForIndicator(indicator) {
      let rowIndex;
      switch(indicator) {
        case '收入':
          rowIndex = 0;
          break;
        case '支出':
          rowIndex = 3;
          break;
        case '毛利':
          rowIndex = 8;
          break;
        case '利润':
          rowIndex = 23;
          break;
      }
      return [
        this.tableData[rowIndex].month1, 
        this.tableData[rowIndex].month2, 
        this.tableData[rowIndex].month3
      ];
    },

  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/app';

::v-deep .el-input__inner {
  background-color: transparent !important;
  border: none;
  color: black;
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

  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table td {
    background-color: transparent;
  }
}
</style>