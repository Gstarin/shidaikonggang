<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>青清水务</b-breadcrumb-item>
      <b-breadcrumb-item active>污水厂成本</b-breadcrumb-item>
    </b-breadcrumb>

    <b-row>
      <b-col>
        <Widget title="污水厂成本" customHeader settings close>
          <xlsxTable
            v-model:tableData="items"
            :columns="columns"
            :formFields="formFields"
            apiEndpoint="/api/save/wsc"
            storageKey="wsc"
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

          <div class="table-footer">
            <b-button variant="success" @click="generateChart">生成折线图</b-button>
          </div>

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
import xlsxTable from '@/components/Template/xlsxTable'
import { Chart } from 'chart.js'

export default {
  name: 'wsc',
  components: { Widget, xlsxTable },
  data() {
    return {
      items: [],
      chartVisible: false,
      chart: null,
      selectMonth: null,
      columns: [
        { prop: 'index', label: '月份', type: 'date', width: 120 },
        { prop: 'materialName', label: '经营药剂费', type: 'number' },
        { prop: 'specModel', label: '电费', type: 'number' },
        { prop: 'unit', label: '实验药剂费', type: 'number' },
        { prop: 'requestQuantity', label: '设备维修费', type: 'number' },
        { prop: 'receivedQuantity', label: '人员工资', type: 'number' },
        { prop: 'stockQuantity', label: '食堂费用', type: 'number' },
        { prop: 'stockTime', label: '合规性费用', type: 'number' },
        { prop: 'jine', label: '水费', type: 'number' },
        { prop: 'note', label: '固废处理费', type: 'number' },
        {
          prop: 'heji',
          label: '合计',
          type: 'number',
          compute: (row) =>
            (
              Number(row.materialName || 0) +
              Number(row.specModel || 0) +
              Number(row.unit || 0) +
              Number(row.requestQuantity || 0) +
              Number(row.receivedQuantity || 0) +
              Number(row.stockQuantity || 0) +
              Number(row.stockTime || 0) +
              Number(row.jine || 0) +
              Number(row.note || 0)
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
        stockQuantity: '',
        stockTime: '',
        jine: '',
        note: ''
      }
    }
  },
  methods: {
    handleEdit(row) {
      this.$router.push({
        path: '/app/WaterCorporation/sc2',
        query: { name: row.unit }
      })
    },
    generateChart() {
      const selected = this.items.filter(i => !this.selectMonth || i.index === this.selectMonth)
      if (selected.length === 0) {
        this.$bvToast.toast('请选择数据生成图表', {
          title: '提示',
          variant: 'warning',
          solid: true
        })
        return
      }

      const get = key => selected.map(i => parseFloat(i[key]) || 0)
      const labels = selected.map(i => i.index)

      const datasets = [
        { label: '经营药剂费', key: 'materialName', color: 'rgba(75, 192, 192, 1)' },
        { label: '电费', key: 'specModel', color: 'rgba(192, 75, 75, 1)' },
        { label: '实验药剂费', key: 'unit', color: 'rgba(75, 75, 192, 1)' },
        { label: '设备维修费', key: 'requestQuantity', color: 'rgba(75, 192, 75, 1)' },
        { label: '人员工资', key: 'receivedQuantity', color: 'rgba(192, 192, 75, 1)' },
        { label: '食堂费用', key: 'stockQuantity', color: 'rgba(75, 75, 75, 1)' },
        { label: '合规性费用', key: 'stockTime', color: 'rgba(192, 75, 192, 1)' },
        { label: '水费', key: 'jine', color: 'rgba(75, 192, 192, 1)' },
        { label: '固废处理费', key: 'note', color: 'rgba(192, 75, 75, 1)' }
      ].map(ds => ({
        label: ds.label,
        data: get(ds.key),
        borderColor: ds.color,
        backgroundColor: ds.color.replace('1)', '0.2)'),
        fill: false
      }))

      this.chartVisible = true
      this.$nextTick(() => {
        const ctx = document.getElementById('costChart').getContext('2d')
        if (this.chart) this.chart.destroy()
        this.chart = new Chart(ctx, {
          type: 'line',
          data: { labels, datasets },
          options: {
            responsive: true,
            scales: {
              x: { title: { display: true, text: '月份' } },
              y: { title: { display: true, text: '成本' }, beginAtZero: true }
            }
          }
        })
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
