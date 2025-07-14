<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>青清水务</b-breadcrumb-item>
      <b-breadcrumb-item active>污水厂成本</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>污水厂成本</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="items"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'wsc'"
            :customFilter1="filterByMonth"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-filter1>
              <el-date-picker
                v-model="selectedMonth"
                type="month"
                placeholder="选择年月"
                value-format="yyyy-MM"
                :clearable="true"
                @change="handleMonthChange"
                style="width: 150px; margin-right: 15px;"
              />
            </template>
            
            <template v-slot:custom-filter2>
              <b-button variant="success" @click="generateChart" class="mr-2">
                生成折线图
              </b-button>
            </template>
          </TableTemplate>

          <!-- 图表区域 -->
          <div v-if="chartVisible" style="margin-top: 20px;">
            <canvas id="costChart"></canvas>
          </div>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import TableTemplate from '@/components/Template/xlsxTable'
import { Chart } from 'chart.js'
import axios from '@/utils/axios.js'

export default {
  name: 'WscCost',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedMonth: null,
      chartVisible: false,
      chart: null,
      items: [],
      tableColumns: [
        { 
          prop: 'index', 
          label: '月度', 
          width: 150,
          type: 'date',
          editable: true
        },
        { 
          prop: 'materialName', 
          label: '经营药剂费', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'specModel', 
          label: '电费', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'unit', 
          label: '实验药剂费', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'requestQuantity', 
          label: '设备维修费', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'receivedQuantity', 
          label: '人员工资', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'stockQuantity', 
          label: '食堂费用', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'stockTime', 
          label: '合规性费用', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'jine', 
          label: '水费', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'note', 
          label: '固废处理费', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'qita', 
          label: '其他费用', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'heji', 
          label: '合计', 
          width: 120,
          type: 'variable',
          calculate: (row) => {
            return (
              (Number(row.materialName) || 0) +
              (Number(row.specModel) || 0) +
              (Number(row.unit) || 0) +
              (Number(row.requestQuantity) || 0) +
              (Number(row.receivedQuantity) || 0) +
              (Number(row.stockQuantity) || 0) +
              (Number(row.stockTime) || 0) +
              (Number(row.jine) || 0) +
              (Number(row.note) || 0) +
              (Number(row.qita) || 0)
            ).toFixed(2)
          }
        }
      ],
      formFields: {
        index: new Date().toISOString().slice(0, 7),
        materialName: 0,
        specModel: 0,
        unit: 0,
        requestQuantity: 0,
        receivedQuantity: 0,
        stockQuantity: 0,
        stockTime: 0,
        jine: 0,
        note: 0,
        qita: 0,
        heji: 0,
        selected: false
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    updateTableData(newData) {
      this.items = newData
    },
    
    loadData() {
      axios.get('/api/data/wsc').then(response => {
        this.items = response.data || []
        if (this.items.length === undefined) this.items = []
      }).catch(error => {
        console.error('Error fetching data:', error)
        this.items = []
      })
    },
    
    filterByMonth(item) {
      if (!this.selectedMonth) return true
      return item.index === this.selectedMonth
    },
    
    handleMonthChange() {
      // 可以在这里添加额外的处理逻辑
    },
    
    generateChart() {
      const selectedItems = this.items.filter(item => item.selected)
      
      if (selectedItems.length === 0) {
        this.$bvToast.toast('请选择至少一个月份来生成图表', {
          title: '提示',
          variant: 'warning',
          solid: true
        })
        return
      }

      this.chartVisible = true

      this.$nextTick(() => {
        const ctx = document.getElementById('costChart').getContext('2d')

        // 创建每种成本的数据集
        const datasets = [
          {
            label: '经营药剂费',
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
            label: '实验药剂费',
            data: selectedItems.map(item => parseFloat(item.unit) || 0),
            borderColor: 'rgba(75, 75, 192, 1)',
            backgroundColor: 'rgba(75, 75, 192, 0.2)',
            fill: false,
          },
          {
            label: '设备维修费',
            data: selectedItems.map(item => parseFloat(item.requestQuantity) || 0),
            borderColor: 'rgba(75, 192, 75, 1)',
            backgroundColor: 'rgba(75, 192, 75, 0.2)',
            fill: false,
          },
          {
            label: '人员工资',
            data: selectedItems.map(item => parseFloat(item.receivedQuantity) || 0),
            borderColor: 'rgba(192, 192, 75, 1)',
            backgroundColor: 'rgba(192, 192, 75, 0.2)',
            fill: false,
          },
          {
            label: '食堂费用',
            data: selectedItems.map(item => parseFloat(item.stockQuantity) || 0),
            borderColor: 'rgba(75, 75, 75, 1)',
            backgroundColor: 'rgba(75, 75, 75, 0.2)',
            fill: false,
          },
          {
            label: '合规性费用',
            data: selectedItems.map(item => parseFloat(item.stockTime) || 0),
            borderColor: 'rgba(192, 75, 192, 1)',
            backgroundColor: 'rgba(192, 75, 192, 0.2)',
            fill: false,
          },
          {
            label: '水费',
            data: selectedItems.map(item => parseFloat(item.jine) || 0),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
          },
          {
            label: '固废处理费',
            data: selectedItems.map(item => parseFloat(item.note) || 0),
            borderColor: 'rgba(192, 75, 75, 1)',
            backgroundColor: 'rgba(192, 75, 75, 0.2)',
            fill: false,
          }
        ]

        if (this.chart) {
          this.chart.destroy() // 如果已有图表实例，销毁它以避免重复
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
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';

#costChart {
  max-width: 100%;
  height: 400px;
  margin: 0 auto;
}
</style>