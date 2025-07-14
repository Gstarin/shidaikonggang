<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>水务公司</b-breadcrumb-item>
      <b-breadcrumb-item active>水厂生产、完成情况</b-breadcrumb-item>
    </b-breadcrumb>

    <b-row>
      <b-col>
<<<<<<< HEAD
        <Widget title="<h5>水厂生产、完成情况</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'waterProductionStatus'"
            :customFilter1="filterByYearMonth"
            @update:tableData="updateTableData"
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
            
            <template v-slot:custom-table>
              <el-table style="display: none;width: 100%" id="WaterProductionTable">
                <el-table-column 
                  v-for="column in tableColumns" 
                  :key="column.prop"
                  :prop="column.prop" 
                  :label="column.label" 
                ></el-table-column>
              </el-table>
            </template>
          </TableTemplate>
          
          <!-- 添加折线图按钮 -->
          <div class="table-footer">
            <b-button variant="success" @click="generateChart">生成折线图</b-button>
          </div>

          <!-- 添加折线图的 canvas -->
          <div v-if="chartVisible" style="margin-top: 20px;">
            <canvas id="productionChart"></canvas>
=======
        <Widget title="水厂生产、完成情况" customHeader settings close>
          <xlsxTable
            v-model:tableData="tableData"
            :columns="columns"
            :formFields="formFields"
            storageKey="completionStatus"
            apiEndpoint="/api/save/completionStatus"
          >
            <template #custom-filter1>
              <el-date-picker
                v-model="selectMonth"
                type="month"
                placeholder="选择年月"
                value-format="yyyy-MM"
                style="margin-left: 15px"
              />
            </template>
          </xlsxTable>

          <!-- 折线图按钮 -->
          <div class="text-center mt-4">
            <b-button variant="success" @click="generateChart">生成折线图</b-button>
          </div>

          <!-- 折线图区域 -->
          <div v-if="chartVisible" class="mt-4">
            <canvas id="completionChart"></canvas>
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
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
  name: 'WaterProductionStatus',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: '',
      tableData: [],
      chartVisible: false,
      chart: null,
      tableColumns: [
        { prop: 'yuefen', label: '月份', width: 150, type: 'date' },
        { prop: 'zongliang', label: '总量', width: 150, type: 'number' },
        { prop: 'changquxiaojian', label: '厂区消减', width: 150, type: 'number' },
        { prop: 'yuezuidazhi', label: '月最大值', width: 150, type: 'number' },
        { prop: 'yuezuidizhi', label: '月最小值', width: 150, type: 'number' },
        { prop: 'pingjiazhi', label: '平均值', width: 150, type: 'number' }
      ],
      formFields: {
        yuefen: new Date().toISOString().slice(0, 7),
        zongliang: 0,
        changquxiaojian: 0,
        yuezuidazhi: 0,
        yuezuidizhi: 0,
        pingjiazhi: 0
      }
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
    }
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData
    },
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true
      return item.yuefen && item.yuefen.startsWith(this.selectedYearMonth)
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectedYearMonth)
    },
    
    clearMonthFilter() {
      this.selectedYearMonth = ''
    },
    
    generateChart() {
      const labels = this.tableData.map(item => item.yuefen)
      const zongliangData = this.tableData.map(item => parseFloat(item.zongliang) || 0)
      const changquxiaojianData = this.tableData.map(item => parseFloat(item.changquxiaojian) || 0)
      const yuezuidazhiData = this.tableData.map(item => parseFloat(item.yuezuidazhi) || 0)
      const yuezuidizhiData = this.tableData.map(item => parseFloat(item.yuezuidizhi) || 0)
      const pingjiazhiData = this.tableData.map(item => parseFloat(item.pingjiazhi) || 0)

      this.chartVisible = true
=======
import xlsxTable from '@/components/Template/xlsxTable'
import { Chart } from 'chart.js'

export default {
  name: 'completionStatus',
  components: { Widget, xlsxTable },
  data() {
    return {
      tableData: [],
      selectMonth: null,
      chart: null,
      chartVisible: false,
      formFields: {
        yuefen: '',
        zongliang: '',
        changquxiaojian: '',
        yuezuidazhi: '',
        yuezuidizhi: '',
        pingjiazhi: '',
      },
      columns: [
        { prop: 'yuefen', label: '月份', type: 'date', width: 150 },
        { prop: 'zongliang', label: '总量', type: 'number', width: 150 },
        { prop: 'changquxiaojian', label: '厂区消减', type: 'number', width: 150 },
        { prop: 'yuezuidazhi', label: '月最大值', type: 'number', width: 150 },
        { prop: 'yuezuidizhi', label: '月最小值', type: 'number', width: 150 },
        { prop: 'pingjiazhi', label: '平均值', type: 'number', width: 150 },
      ]
    }
  },
  methods: {
    generateChart() {
      const labels = this.tableData.map(item => item.yuefen)
      const getData = key => this.tableData.map(item => parseFloat(item[key]) || 0)

      const datasets = [
        { label: '总量', data: getData('zongliang'), color: 'rgba(75, 192, 192, 1)' },
        { label: '厂区消减', data: getData('changquxiaojian'), color: 'rgba(192, 75, 75, 1)' },
        { label: '月最大值', data: getData('yuezuidazhi'), color: 'rgba(75, 75, 192, 1)' },
        { label: '月最小值', data: getData('yuezuidizhi'), color: 'rgba(192, 192, 75, 1)' },
        { label: '平均值', data: getData('pingjiazhi'), color: 'rgba(75, 192, 75, 1)' }
      ]
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29

      this.chartVisible = true
      this.$nextTick(() => {
<<<<<<< HEAD
        const ctx = document.getElementById('productionChart').getContext('2d')

        if (this.chart) {
          this.chart.destroy()
        }
=======
        const ctx = document.getElementById('completionChart').getContext('2d')
        if (this.chart) this.chart.destroy()
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29

        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
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
                title: { display: true, text: '数值' },
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

<<<<<<< HEAD
<style lang="scss" scoped>
@import '../../styles/app';

#productionChart {
=======
<style scoped>
#completionChart {
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
  max-width: 100%;
  height: 400px;
  margin: 20px auto;
}
<<<<<<< HEAD

.table-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.filter-container {
  display: flex;
  align-items: center;
  margin-right: 15px;
}
</style>
=======
</style>
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
