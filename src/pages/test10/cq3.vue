<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>车辆保养费用</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'vehicleMaintenance'"
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
  name: 'VehicleMaintenance',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: '',
      tableData: [],
      tableColumns: [
        { prop: 'id', label: '序号', width: 80 },
        { 
          prop: 'car_id', 
          label: '车牌号码', 
          width: 150,
          editable: true
        },
        { 
          prop: 'car', 
          label: '车型', 
          width: 120,
          editable: true
        },
        { 
          prop: 'miles1', 
          label: '上次保养里程', 
          width: 150,
          type: 'number',
          editable: true
        },
        { 
          prop: 'date1', 
          label: '上次保养日期', 
          width: 180,
          type: 'date',
          editable: true
        },
        { 
          prop: 'miles2', 
          label: '本次保养里程', 
          width: 150,
          type: 'number',
          editable: true
        },
        { 
          prop: 'date2', 
          label: '本次保养日期', 
          width: 180,
          type: 'date',
          editable: true
        },
        { 
          prop: 'xm', 
          label: '保养项目', 
          width: 180,
          editable: true
        },
        { 
          prop: 'quantity', 
          label: '数量', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'jine', 
          label: '金额(元)', 
          width: 150,
          type: 'number',
          editable: true
        },
        { 
          prop: 'total', 
          label: '费用合计', 
          width: 150,
          type: 'number',
          editable: true
        },
        { 
          prop: 'person', 
          label: '维保人', 
          width: 120,
          editable: true
        }
      ],
      formFields: {
        id: 0,
        car_id: '',
        car: '',
        miles1: 0,
        date1: new Date().toISOString().slice(0, 10),
        miles2: 0,
        date2: new Date().toISOString().slice(0, 10),
        xm: '',
        quantity: 0,
        jine: 0,
        total: 0,
=======
import XlsxTable from '@/components/Template/xlsxTable.vue'

export default {
  name: 'VehicleMaintenance',
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
        { prop: 'car_id', label: '车牌号码' },
        { prop: 'car', label: '车型' },
        { prop: 'miles1', label: '上次保养里程' },
        { prop: 'date1', label: '上次保养日期', type: 'date' },
        { prop: 'miles2', label: '本次保养里程' },
        { prop: 'date2', label: '本次保养日期', type: 'date' },
        { prop: 'xm', label: '保养项目' },
        { prop: 'quantity', label: '数量', type: 'number' },
        { prop: 'jine', label: '金额（元）', type: 'number' },
        {
          prop: 'total',
          label: '费用合计',
          type: 'variable',
          calculate: row => {
            const q = parseFloat(row.quantity) || 0
            const j = parseFloat(row.jine) || 0
            return (q * j).toFixed(2)
          }
        },
        { prop: 'person', label: '维保人' }
      ],
      formFields: {
        id: null,
        car_id: '',
        car: '',
        miles1: '',
        date1: null,
        miles2: '',
        date2: null,
        xm: '',
        quantity: '',
        jine: '',
        total: '',
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
        person: ''
      }
    }
  },
  methods: {
<<<<<<< HEAD

    
    updateTableData(newData) {
      this.tableData = newData
    },
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true
      
      if (!item.date2) return false
      
      const itemDate = moment(item.date2).format('YYYY-MM')
      return itemDate === this.selectedYearMonth
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectedYearMonth)
    },
    
    clearMonthFilter() {
      this.selectedYearMonth = ''
=======
    monthFilter(row) {
      if (!this.selectMonth) return true
      if (!row.date2) return false
      const d = new Date(row.date2)
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return month === this.selectMonth
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
    }
  }
}
</script>
<<<<<<< HEAD

=======
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
