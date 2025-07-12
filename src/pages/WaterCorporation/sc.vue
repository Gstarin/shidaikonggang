<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>青清水务</b-breadcrumb-item>
      <b-breadcrumb-item active>水厂经营成本</b-breadcrumb-item>
    </b-breadcrumb>

    <b-row>
      <b-col>
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
            <canvas id="costChart"></canvas>
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
        }
      ],
      formFields: {
        index: '',
        materialName: '',
        specModel: '',
        unit: '',
        requestQuantity: '',
        receivedQuantity: '',
        qita: 0
      }
    }
  },
  methods: {
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
    },
    handleEdit(row) {
      this.$router.push({
        path: '/app/WaterCorporation/sc2',
        query: { name: row.index }
      })
    }
  }
}
</script>

<style scoped>
#costChart {
  max-width: 100%;
  height: 400px;
  margin: 0 auto;
}
</style>
