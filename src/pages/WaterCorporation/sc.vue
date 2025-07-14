<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>青清水务</b-breadcrumb-item>
      <b-breadcrumb-item active>水厂经营成本</b-breadcrumb-item>
    </b-breadcrumb>

    <b-row>
      <b-col>
<<<<<<< HEAD
        <Widget title="<h5>水厂经营成本</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="items"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'sc'"
            :customFilter1="filterByYearMonth"
            @update:tableData="updateTableData"
            @row-click="handleRowClick"
          >
            <template v-slot:custom-filter1>
              <div class="filter-container">
                <el-date-picker
                  v-model="selectedYearMonth"
                  type="month"
                  placeholder="选择年月"
                  value-format="yyyy-MM"
                  :clearable="true"
                  @change="handleMonthChange"
                  style="width: 150px; margin-right: 15px;"
                />
                <el-button 
                  v-if="selectedYearMonth"
                  @click="clearMonthFilter"
                  size="small"
                  icon="el-icon-close"
                  circle
                />
              </div>
            </template>
            
            <template v-slot:custom-filter2>
              <b-button variant="success" @click="generateChart" class="mr-2">
                生成折线图
              </b-button>
            </template>
          </TableTemplate>

          <!-- 图表区域 -->
          <div v-if="chartVisible" style="margin-top: 20px;">
=======
        <Widget title="水厂经营成本" customHeader settings close>
          <xlsxTable
            v-model:tableData="items"
            :columns="columns"
            :formFields="formFields"
            apiEndpoint="/api/save/sc"
            storageKey="sc"
            @row-click="handleEdit"
          >
            <template #custom-filter1>
              <el-date-picker
                v-model="selectMonth"
                type="month"
                placeholder="选择年月"
                value-format="yyyy-MM"
                style="margin-right: 15px"
              />
            </template>
          </xlsxTable>

          <!-- 折线图按钮 -->
          <div class="text-center mt-4">
            <b-button variant="success" @click="generateChart">生成折线图</b-button>
          </div>

          <!-- 折线图区域 -->
          <div v-if="chartVisible" class="mt-4">
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
            <canvas id="costChart"></canvas>
          </div>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
<<<<<<< HEAD
import TableTemplate from '@/components/Template/xlsxTable'
import axios from '@/utils/axios.js'
import { Chart } from 'chart.js'

export default {
  name: 'WaterCost',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: '',
      items: [],
      chartVisible: false,
      chart: null,
      cnt: 0,
      tableColumns: [
        { prop: 'index', label: '月度', width: 150, type: 'date' },
        { prop: 'materialName', label: '药剂费', width: 120, type: 'number' },
        { prop: 'specModel', label: '电费', width: 120, type: 'number' },
        { prop: 'unit', label: '设备维修费', width: 120, type: 'number' },
        { prop: 'requestQuantity', label: '人员工资', width: 120, type: 'number' },
        { prop: 'receivedQuantity', label: '食堂费用', width: 120, type: 'number' },
        { prop: 'qita', label: '其他费用', width: 120, type: 'number' },
        { 
          prop: 'total', 
          label: '合计', 
          width: 120,
          type: 'variable',
          calculate: (row) => {
            return ((Number(row.materialName) || 0) + 
                   (Number(row.specModel) || 0) + 
                   (Number(row.unit) || 0) + 
                   (Number(row.requestQuantity) || 0) + 
                   (Number(row.receivedQuantity) || 0) + 
                   (Number(row.qita) || 0)).toFixed(2)
          }
        },
        { 
          prop: 'actions', 
          label: '操作', 
          width: 120,
          type: 'actions',
          actions: [
            {
              label: '查看',
              variant: 'success',
              size: 'sm',
              handler: (row) => this.edit(row.index)
            }
          ]
=======
import xlsxTable from '@/components/Template/xlsxTable'
import { Chart } from 'chart.js'
import axios from '@/utils/axios'

export default {
  name: 'sc',
  components: { Widget, xlsxTable },
  data() {
    return {
      items: [],
      selectMonth: null,
      chartVisible: false,
      chart: null,
      columns: [
        { prop: 'index', label: '月份', type: 'date', width: 120 },
        { prop: 'materialName', label: '药剂费', type: 'number', width: 120 },
        { prop: 'specModel', label: '电费', type: 'number', width: 120 },
        { prop: 'unit', label: '设备维修费', type: 'number', width: 120 },
        { prop: 'requestQuantity', label: '人员工资', type: 'number', width: 120 },
        { prop: 'receivedQuantity', label: '食堂费用', type: 'number', width: 120 },
        {
          prop: 'qita',
          label: '其他费用',
          type: 'number',
          width: 120,
          compute: async (row) => {
            const res = await axios.post('/api/save/sc2', { iddd: row.index })
            return res.data.reduce((sum, item) => sum + Number(item.time || 0), 0)
          }
        },
        {
          prop: 'total',
          label: '合计',
          width: 120,
          compute: (row) =>
            (
              Number(row.materialName || 0) +
              Number(row.specModel || 0) +
              Number(row.unit || 0) +
              Number(row.requestQuantity || 0) +
              Number(row.receivedQuantity || 0) +
              Number(row.qita || 0)
            ).toFixed(2)
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
        }
      ],
      formFields: {
        index: '',
<<<<<<< HEAD
        materialName: 0,
        specModel: 0,
        unit: 0,
        requestQuantity: 0,
        receivedQuantity: 0,
=======
        materialName: '',
        specModel: '',
        unit: '',
        requestQuantity: '',
        receivedQuantity: '',
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
        qita: 0
      }
    }
  },
  methods: {
<<<<<<< HEAD
    
    updateTableData(newData) {
      this.items = newData
    },
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true
      return item.index && item.index.substr(0, 7) === this.selectedYearMonth
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectedYearMonth)
    },
    
    clearMonthFilter() {
      this.selectedYearMonth = ''
    },
    
    edit(name) {
      this.$router.push({
        path: "/app/WaterCorporation/sc2",
        query: { name: name }
      })
    },
    
    handleRowClick(row) {
      // 可以在这里处理行点击事件
    },
    
    generateChart() {
      const selectedItems = this.items.filter(item => item.selected)
      
      if (selectedItems.length === 0) {
        this.$message.warning('请选择至少一个月份来生成图表')
        return
      }
      
      this.chartVisible = true
      
      this.$nextTick(() => {
        const ctx = document.getElementById('costChart').getContext('2d')
        
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
          }
        ]
        
        if (this.chart) {
          this.chart.destroy()
        }
        
=======
    generateChart() {
      const filtered = this.items.filter(item =>
        this.selectMonth ? item.index === this.selectMonth : true
      )

      if (filtered.length === 0) {
        this.$bvToast.toast('请选择至少一个月份生成图表', {
          title: '提示',
          variant: 'warning',
          solid: true
        })
        return
      }

      const labels = filtered.map(item => item.index)
      const getData = key => filtered.map(item => parseFloat(item[key]) || 0)

      const datasets = [
        { label: '药剂费', data: getData('materialName'), color: 'rgba(75, 192, 192, 1)' },
        { label: '电费', data: getData('specModel'), color: 'rgba(192, 75, 75, 1)' },
        { label: '设备维修费', data: getData('unit'), color: 'rgba(75, 75, 192, 1)' },
        { label: '人员工资', data: getData('requestQuantity'), color: 'rgba(75, 192, 75, 1)' },
        { label: '食堂费用', data: getData('receivedQuantity'), color: 'rgba(192, 192, 75, 1)' }
      ]

      this.chartVisible = true

      this.$nextTick(() => {
        const ctx = document.getElementById('costChart').getContext('2d')
        if (this.chart) this.chart.destroy()

>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: datasets.map(ds => ({
              label: ds.label,
              data: ds.data,
              borderColor: ds.color,
              backgroundColor: ds.color.replace('1)', '0.2)'),
              fill: false
            }))
          },
          options: {
            responsive: true,
            scales: {
              x: { title: { display: true, text: '月份' } },
              y: {
                title: { display: true, text: '金额' },
                beginAtZero: true
              }
            }
          }
        })
      })
<<<<<<< HEAD
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
=======
    },
    handleEdit(row) {
      this.$router.push({
        path: '/app/WaterCorporation/sc2',
        query: { name: row.index }
      })
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
    }
  }
}
</script>
<<<<<<< HEAD

<style lang="scss" scoped>
@import '../../styles/app';
=======
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29

<style scoped>
#costChart {
  max-width: 100%;
  height: 400px;
  margin: 0 auto;
}

.filter-container {
  display: flex;
  align-items: center;
  margin-right: 15px;
}
</style>