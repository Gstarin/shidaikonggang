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
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'waterDisburse'"
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
import { export_excel2 } from '@/utils/exportExcel2.js'

export default {
  name: 'WaterDisburse',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: '',
      tableData: [],
      // 表格列配置
      tableColumns: [
        { prop: 'time', label: '序号', width: 100 },
        { prop: 'name', label: '物料名称', width: 150 },
        { prop: 'danwei', label: '单位', width: 100 },
        { prop: 'number', label: '领用数量', width: 120, type: 'number' },
        { prop: 'remaining', label: '库存剩余量', width: 120, type: 'number' },
        { prop: 'sunhao', label: '损耗数量', width: 120, type: 'number' },
        { 
          prop: 'inventory', 
          label: '库存数量', 
          width: 120,
          formatter: (row) => row.remaining - row.sunhao 
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
  mounted() {
    this.loadData()
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData
    },
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true; // 如果没有选择年月，显示所有数据
      
      // 假设你的数据中有日期字段 'date'，格式为 "YYYY-MM-DD"
      const itemDate = item.time2; 
      if (!itemDate) return false;
      
      // 提取年月部分进行比较
      return itemDate.substr(0, 7) === this.selectedYearMonth;
    },
    handleMonthChange() {
      // 可以在这里添加额外的处理逻辑
      console.log('当前筛选月份:', this.selectedYearMonth);
    },
    clearMonthFilter() {
      this.selectedYearMonth = '';
    },
    

  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.table-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
}

.table-footer {
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.clickable {
  cursor: pointer;
  color: #9f9fad;
  text-decoration: underline;
}
</style>