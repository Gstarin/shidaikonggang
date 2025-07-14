<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>车辆维修</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'cq6'"
            :showExcelHandler="true"
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
              <el-table style="display: none;width: 100%" id="DisburseTable1">
                <el-table-column 
                  v-for="column in tableColumns" 
                  :key="column.prop"
                  :prop="column.prop" 
                  :label="column.label" 
                ></el-table-column>
              </el-table>
            </template>
          </TableTemplate>
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
import moment from 'moment'

export default {
  name: 'CarRepair',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: '',
      tableData: [],
      tableColumns: [
        { prop: 'id', label: '序号', width: 55 },
        { 
          prop: 'date', 
          label: '日期', 
          type: 'date',
          editable: true
        },
        { 
          prop: 'car', 
          label: '车辆类型', 
          width: 150,
          editable: true
        },
        { 
          prop: 'car_id', 
          label: '车牌号', 
          width: 100,
          editable: true
        },
        { 
          prop: 'driver', 
          label: '司机', 
          width: 100,
          editable: true
        },
        { 
          prop: 'xm', 
          label: '维修项目', 
          width: 100,
          editable: true
        },
        { 
          prop: 'jine', 
          label: '金额（元）', 
          width: 180,
          type: 'number',
          editable: true
        },
        { 
          prop: 'gongshi', 
          label: '工时费（元）', 
          width: 180,
          type: 'number',
          editable: true
        },
        { 
          prop: 'total', 
          label: '费用合计（元）', 
          width: 180,
          type: 'number',
          editable: true
        },
        { 
          prop: 'wxdw', 
          label: '维修单位', 
          width: 180,
          editable: true
        },
        { 
          prop: 'beizhu', 
          label: '备注', 
          width: 180,
          editable: true
        }
      ],
      formFields: {
        id: 0,
=======
import XlsxTable from '@/components/Template/xlsxTable.vue'

export default {
  name: 'CarRepair',
  components: {
    Widget,
    XlsxTable
  },
  data() {
    return {
      selectMonth: null,
      tableData: [],
      columns: [
        { prop: 'id', label: '序号', type: 'number' },
        { prop: 'date', label: '日期', type: 'date' },
        { prop: 'car', label: '车辆类型' },
        { prop: 'car_id', label: '车牌号' },
        { prop: 'driver', label: '司机' },
        { prop: 'xm', label: '维修项目' },
        { prop: 'jine', label: '金额（元）', type: 'number' },
        { prop: 'gongshi', label: '工时费（元）', type: 'number' },
        {
          prop: 'total',
          label: '费用合计（元）',
          type: 'variable',
          calculate: row => {
            const jine = parseFloat(row.jine) || 0
            const gongshi = parseFloat(row.gongshi) || 0
            return (jine + gongshi).toFixed(2)
          }
        },
        { prop: 'wxdw', label: '维修单位' },
        { prop: 'beizhu', label: '备注' }
      ],
      formFields: {
        id: null,
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
        date: null,
        car: '',
        car_id: '',
        driver: '',
        xm: '',
<<<<<<< HEAD
        jine: 0,
        gongshi: 0,
        total: 0,
=======
        jine: '',
        gongshi: '',
        total: '',
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
        wxdw: '',
        beizhu: ''
      }
    }
  },
<<<<<<< HEAD

  methods: {
    updateTableData(newData) {
      this.tableData = newData
    },
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true
      if (!item.date) return false
      
      const date = new Date(item.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const formattedMonth = month < 10 ? `0${month}` : month
      
      return `${year}-${formattedMonth}` === this.selectedYearMonth
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectedYearMonth)
    },
    
    clearMonthFilter() {
      this.selectedYearMonth = ''
=======
  methods: {
    monthFilter(row) {
      if (!this.selectMonth || !row.date) return true
      const d = new Date(row.date)
      const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return formatted === this.selectMonth
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
    }
  }
}
</script>
