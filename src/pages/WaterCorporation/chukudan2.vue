<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>青清水务</b-breadcrumb-item>
      <b-breadcrumb-item active>出库单</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>出库单</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="items"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'waterOutbound'"
            :customFilter1="filterByMonth"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-filter1>
              <div class="filter-container">
                <el-date-picker
                  v-model="selectMonth"
                  type="month"
                  placeholder="选择年月"
                  value-format="yyyy-MM"
                  :clearable="true"
                  @change="handleMonthChange"
                  style="width: 150px; margin-right: 15px;"
                />
                <el-button 
                  v-if="selectMonth"
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
  name: 'WaterOutbound',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectMonth: null,
      items: [],
      // 表格列配置
      tableColumns: [
        { prop: 'time', label: '序号', width: 80 },
        { prop: 'name', label: '物料名称', width: 150 },
        { prop: 'danwei', label: '单位', width: 100 },
        { prop: 'number', label: '领用数量', width: 120, type: 'number' },
        { prop: 'remaining', label: '库存剩余量', width: 120, type: 'number' },
        { prop: 'sunhao', label: '损耗数量', width: 120, type: 'number' },
        { 
          prop: 'inventory', 
          label: '库存数量', 
          width: 120,
          type: 'variable',
          calculate: (row) => (row.remaining || 0) - (row.sunhao || 0)
        },
        { prop: 'time2', label: '领用时间', width: 180, type: 'date' },
        { prop: 'people', label: '领用人', width: 120 },
        { prop: 'jine', label: '金额', width: 120, type: 'number' },
        { prop: 'note', label: '备注', width: 200 }
      ],
      // 表单字段配置
      formFields: {
        time: '',
        name: '',
        danwei: '',
        number: 0,
        remaining: 0,
        sunhao: 0,
        time2: new Date().toISOString().slice(0, 10),
        people: '',
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
      if (!this.selectMonth) return true
      
      const itemDate = item.time2
      if (!itemDate) return false
      
      // 处理不同日期格式
      const dateObj = new Date(itemDate)
      const year = dateObj.getFullYear()
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
      const itemYearMonth = `${year}-${month}`
      
      return itemYearMonth === this.selectMonth
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectMonth)
    },
    
    clearMonthFilter() {
      this.selectMonth = null
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.filter-container {
  display: flex;
  align-items: center;
  margin-left: 15px;
}
</style>