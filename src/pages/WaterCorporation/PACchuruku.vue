<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>青清水务</b-breadcrumb-item>
      <b-breadcrumb-item active>PAC出入库表</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>PAC出入库表</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="items"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'pac'"
            :apiEndpoint="'/api/data/pac'"
            :customFilter1="filterByMonth"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-filter1>
              <div class="filter-container">
                <el-date-picker
                  v-model="selectedMonth"
                  type="month"
                  placeholder="选择年月"
                  value-format="yyyy-MM"
                  :clearable="true"
                  @change="handleMonthChange"
                  style="width: 150px; margin-right: 15px;"
                />
                <el-button 
                  v-if="selectedMonth"
                  @click="clearMonthFilter"
                  size="small"
                  icon="el-icon-close"
                  circle
                />
              </div>
            </template>
          </TableTemplate>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import TableTemplate from '@/components/Template/xlsxTable'
import axios from '@/utils/axios.js'

export default {
  name: 'WaterPacTable',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedMonth: '',
      items: [],
      // 表格列配置
      tableColumns: [
        { prop: 'time', label: '时间', width: 180, type: 'date' },
        { prop: 'in_stock', label: '入库量（袋）', width: 120, type: 'number' },
        { prop: 'out_stock', label: '出库量（袋）', width: 120, type: 'number' },
        { prop: 'remaining', label: '库存剩余量（袋）', width: 140, type: 'number' },
        { prop: 'sunhao', label: '损耗量（袋）', width: 120, type: 'number' },
        { 
          prop: 'inventory', 
          label: '库存数量（袋）', 
          width: 140,
          formatter: (row) => row.remaining - row.sunhao 
        },
        { prop: 'jine', label: '金额', width: 120, type: 'number' },
        { prop: 'note', label: '备注', width: 200 }
      ],
      // 表单字段配置
      formFields: {
        time: new Date().toISOString().slice(0, 10),
        in_stock: 0,
        out_stock: 0,
        remaining: 0,
        sunhao: 0,
        jine: 0,
        note: ''
      }
    }
  },
  methods: {
    updateTableData(newData) {
      this.items = newData
    },
    
    filterByMonth(item) {
      if (!this.selectedMonth) return true
      
      const itemDate = item.time
      if (!itemDate) return false
      
      // 处理不同日期格式
      const dateObj = new Date(itemDate)
      const year = dateObj.getFullYear()
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
      const itemYearMonth = `${year}-${month}`
      
      return itemYearMonth === this.selectedMonth
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectedMonth)
    },
    
    clearMonthFilter() {
      this.selectedMonth = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';
</style>