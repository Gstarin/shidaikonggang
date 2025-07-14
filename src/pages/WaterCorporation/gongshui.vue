<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>水务公司</b-breadcrumb-item>
      <b-breadcrumb-item active>地表水厂</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>地表水厂</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'gongshui'"
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
            
            <template v-slot:custom-table>
              <el-table style="display:none;width: 100%" id="DisburseTable1">
                <el-table-column prop="riqi" label="日期" width="100"></el-table-column>
                <el-table-column prop="jinshuizongliang" label="进水总量（m³）" width="150"></el-table-column>
                <el-table-column prop="zhishuizongliang" label="制水总量（m³）" width="150"></el-table-column>
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
                <el-table-column prop="shengtaishui" label="生态水（m³）" width="140"></el-table-column>
                <el-table-column prop="total" label="供水量总计（m³）" width="140"></el-table-column>
                <el-table-column prop="target" label="生产目标（m³）" width="140"></el-table-column>
              </el-table>
            </template>
          </TableTemplate>
          
          <!-- 添加折线图按钮 -->
          <div class="table-footer">
            <b-button variant="success" @click="generateChart">生成折线图</b-button>
          </div>

          <!-- 添加折线图的 canvas -->
          <div v-if="chartVisible" style="margin-top: 20px;">
            <canvas id="targetChart"></canvas>
          </div>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import TableTemplate from '@/components/Template/xlsxTable';
import { Chart } from 'chart.js';

export default {
  name: 'gongshui',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: '',
      tableData: [],
      chartVisible: false,
      chart: null,
      formFields: {
        riqi: '',
        jinshuizongliang: 0,
        zhishuizongliang: 0,
        zhuchequ: 0,
        xiangzhen: 0,
        jingkaiqu: 0,
        xz: 0,
        linshuigongchang: 0,
        sanshekou: 0,
        jxdz: 0,
        jinzewei: 0,
        shengtaishui: 0,
        target: 0,
        qitayonghu: 0,
      },
      tableColumns: [
        { prop: 'riqi', label: '日期', width: 170, type: 'date' },
        { prop: 'jinshuizongliang', label: '进水总量（m³）', width: 150, type: 'number' },
        { prop: 'zhishuizongliang', label: '制水总量（m³）', width: 150, type: 'number' },
        { 
              label: '1#管网',
              children: [
                { prop: 'zhuchequ', label: '主城区（m³）', width: 140, type: 'number' },
                { prop: 'xiangzhen', label: '乡镇（m³）', width: 140, type: 'number' },
                { 
                  prop: 'zongji', 
                  label: '总计（m³）', 
                  width: 140,
                  type: 'variable',
                  calculate: (row) => (parseFloat(row.zhuchequ) || 0) + (parseFloat(row.xiangzhen) || 0)
                }
              ]
            },
            { 
              label: '2#, 3#管网',
              children: [
                { prop: 'jingkaiqu', label: '经开区（m³）', width: 140, type: 'number' },
                { prop: 'xz', label: '乡镇（m³）', width: 140, type: 'number' },
                { prop: 'linshuigongchang', label: '临空水厂（m³）', width: 140, type: 'number' },
                { prop: 'sanshekou', label: '三圣口（m³）', width: 140, type: 'number' },
                { prop: 'jxdz', label: '津兴东站（m³）', width: 140, type: 'number' },
                { prop: 'jinzewei', label: '金泽水厂（m³）', width: 140, type: 'number' },
                { prop: 'qitayonghu', label: '其它用户（m³）', width: 140, type: 'number' },
                { 
                  prop: 'zongji2', 
                  label: '总计（m³）', 
                  width: 140,
                  type: 'variable',
                  calculate: (row) => (parseFloat(row.jingkaiqu) || 0) + 
                                   (parseFloat(row.linshuigongchang) || 0) + 
                                   (parseFloat(row.sanshekou) || 0) + 
                                   (parseFloat(row.jinzewei) || 0) +
                                   (parseFloat(row.xz) || 0) +
                                   (parseFloat(row.qitayonghu) || 0) +
                                   (parseFloat(row.jxdz) || 0)
                }
              ]
            },
        { prop: 'shengtaishui', label: '生态水（m³）', width: 140, type: 'number' },
        { 
          prop: 'total', 
          label: '供水量总计（m³）', 
          width: 140,
          type: 'variable',
          calculate: (row) => (parseFloat(row.zhuchequ) || 0) + 
                             (parseFloat(row.xiangzhen) || 0) +
                             (parseFloat(row.jingkaiqu) || 0) + 
                             (parseFloat(row.linshuigongchang) || 0) + 
                             (parseFloat(row.sanshekou) || 0) + 
                             (parseFloat(row.jinzewei) || 0) +
                             (parseFloat(row.xz) || 0) +
                             (parseFloat(row.qitayonghu) || 0) +
                             (parseFloat(row.jxdz) || 0)
        },
        { prop: 'target', label: '生产目标（m³）', width: 140, type: 'number' }
      ]
    }
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData
    },
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true
      const itemDate = item.riqi
      if (!itemDate) return false
      return itemDate.substr(0, 7) === this.selectedYearMonth
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectedYearMonth)
    },
    
    clearMonthFilter() {
      this.selectedYearMonth = ''
    },
    
    handleRowClick(row) {
      console.log('行点击:', row)
    },
    
    generateChart() {
      const labels = this.tableData.map(item => item.riqi)
      const targetData = this.tableData.map(item => 
        (parseFloat(item.jingkaiqu) || 0) + 
        (parseFloat(item.linshuigongchang) || 0) + 
        (parseFloat(item.sanshekou) || 0) + 
        (parseFloat(item.jinzewei) || 0) + 
        (parseFloat(item.zhuchequ) || 0) + 
        (parseFloat(item.xiangzhen) || 0) + 
        (parseFloat(item.shengtaishui) || 0) + 
        (parseFloat(item.zhishuizongliang) || 0) + 
        (parseFloat(item.jinshuizongliang) || 0)
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
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.table-footer {
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#targetChart {
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