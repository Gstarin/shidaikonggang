<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>水务公司</b-breadcrumb-item>
      <b-breadcrumb-item active>水厂生产、完成情况</b-breadcrumb-item>
    </b-breadcrumb>

    <b-row>
      <b-col>
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
          </div>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
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

      this.chartVisible = true
      this.$nextTick(() => {
        const ctx = document.getElementById('completionChart').getContext('2d')
        if (this.chart) this.chart.destroy()

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

<style scoped>
#completionChart {
  max-width: 100%;
  height: 400px;
  margin: 20px auto;
}
</style>
