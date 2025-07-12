<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>水务公司</b-breadcrumb-item>
      <b-breadcrumb-item active>地表水厂</b-breadcrumb-item>
    </b-breadcrumb>

    <b-row>
      <b-col>
        <Widget title="地表水厂" customHeader settings close>
          <xlsxTable
            :columns="columns"
            v-model:tableData="tableData"
            storageKey="gongshui"
            apiEndpoint="/api/save/gongshui"
            :formFields="formFields"
          >
            <template #custom-filter1>
              <el-date-picker
                v-model="selectMonth"
                type="month"
                placeholder="选择年月"
                value-format="yyyy-MM"
                style="margin-left: 15px;"
              />
            </template>
          </xlsxTable>

          <!-- 折线图按钮 -->
          <div class="text-center mt-4">
            <b-button variant="success" @click="generateChart">生成折线图</b-button>
          </div>

          <!-- 折线图展示 -->
          <div v-if="chartVisible" class="mt-4">
            <canvas id="targetChart"></canvas>
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
  name: 'gongshui',
  components: { Widget, xlsxTable },
  data() {
    return {
      tableData: [],
      chartVisible: false,
      chart: null,
      selectMonth: null,
      formFields: {
        riqi: '',
        jinshuizongliang: '',
        zhishuizongliang: '',
        zhuchequ: '',
        xiangzhen: '',
        zongji: '',
        jingkaiqu: '',
        xz: '',
        linshuigongchang: '',
        sanshekou: '',
        jxdz: '',
        jinzewei: '',
        zongji2: '',
        shengtaishui: '',
        total: '',
        target: '',
      },
      columns: [
        { prop: 'riqi', label: '日期', type: 'date', width: 150 },
        { prop: 'jinshuizongliang', label: '进水总量（m³）', type: 'number' },
        { prop: 'zhishuizongliang', label: '制水总量（m³）', type: 'number' },
        {
          label: '供水量',
          children: [
            {
              label: '1#管网',
              children: [
                { prop: 'zhuchequ', label: '主城区（m³）', type: 'number' },
                { prop: 'xiangzhen', label: '乡镇（m³）', type: 'number' },
                {
                  prop: 'zongji',
                  label: '总计（m³）',
                  type: 'variable',
                  calculate: row =>
                    (parseFloat(row.zhuchequ) || 0) + (parseFloat(row.xiangzhen) || 0),
                },
              ],
            },
            {
              label: '2#, 3#管网',
              children: [
                { prop: 'jingkaiqu', label: '经开区（m³）', type: 'number' },
                { prop: 'xz', label: '乡镇（m³）', type: 'number' },
                { prop: 'linshuigongchang', label: '临空水厂（m³）', type: 'number' },
                { prop: 'sanshekou', label: '三圣口（m³）', type: 'number' },
                { prop: 'jxdz', label: '津兴东站（m³）', type: 'number' },
                { prop: 'jinzewei', label: '金泽水厂（m³）', type: 'number' },
                {
                  prop: 'zongji2',
                  label: '总计（m³）',
                  type: 'variable',
                  calculate: row =>
                    (parseFloat(row.jingkaiqu) || 0) +
                    (parseFloat(row.linshuigongchang) || 0) +
                    (parseFloat(row.sanshekou) || 0) +
                    (parseFloat(row.jxdz) || 0) +
                    (parseFloat(row.jinzewei) || 0) +
                    (parseFloat(row.xz) || 0),
                },
              ],
            },
          ],
        },
        { prop: 'shengtaishui', label: '生态水（m³）', type: 'number' },
        {
          prop: 'total',
          label: '供水量总计（m³）',
          type: 'variable',
          calculate: row =>
            (parseFloat(row.zhuchequ) || 0) +
            (parseFloat(row.xiangzhen) || 0) +
            (parseFloat(row.jingkaiqu) || 0) +
            (parseFloat(row.linshuigongchang) || 0) +
            (parseFloat(row.sanshekou) || 0) +
            (parseFloat(row.jxdz) || 0) +
            (parseFloat(row.jinzewei) || 0) +
            (parseFloat(row.xz) || 0),
        },
        { prop: 'target', label: '生产目标（m³）', type: 'number' },
      ],
    }
  },
  methods: {
    generateChart() {
      const labels = this.tableData.map(item => item.riqi)
      const values = this.tableData.map(item =>
        (parseFloat(item.jingkaiqu) || 0) +
        (parseFloat(item.linshuigongchang) || 0) +
        (parseFloat(item.sanshekou) || 0) +
        (parseFloat(item.jxdz) || 0) +
        (parseFloat(item.jinzewei) || 0) +
        (parseFloat(item.xz) || 0) +
        (parseFloat(item.zhuchequ) || 0) +
        (parseFloat(item.xiangzhen) || 0)
      )

      this.chartVisible = true
      this.$nextTick(() => {
        const ctx = document.getElementById('targetChart').getContext('2d')
        if (this.chart) {
          this.chart.destroy()
        }

        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: '总计（m³）',
              data: values,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false
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
                  text: '供水总量（m³）'
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

<style scoped>
#targetChart {
  max-width: 100%;
  height: 400px;
  margin: 0 auto;
}
</style>
