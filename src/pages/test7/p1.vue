<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>车辆管理</b-breadcrumb-item>
      <b-breadcrumb-item active>加油费用</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">加油费用管理</h1>
    
    <b-row>
      <b-col>
        <Widget title="<h5>加油费用</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'refuel_records'"
            :showExcelHandler="true"
            :customFilter1="filterByMonth"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-filter1>
              <el-date-picker
                v-model="selectMonth"
                type="month"
                placeholder="选择年月"
                @change="handleMonthChange"
                value-format="yyyy-MM"
                style="margin-right: 15px;"
              ></el-date-picker>
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
  name: 'RefuelManagement',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      selectMonth: null,
      path: '',
      formFields: {
        xuhao: 0,
        date: '',
        oil_number: '',
        current_mileage: 0,
        unit_price: 0,
        refuel_quantity: 0,
        refuel_amount: 0,
        driver: '',
        license_plate: '',
        refuel_times: 0,
        card_number: '',
        town: '',
        remark: ''
      },
      tableColumns: [
        { prop: 'xuhao', label: '序号', width: 80, type: 'number' },
        { 
          prop: 'date', 
          label: '日期', 
          width: 120,
          type: 'date'
        },
        { 
          prop: 'oil_number', 
          label: '油号', 
          width: 100
        },
        { 
          prop: 'current_mileage', 
          label: '当前里程数', 
          width: 120,
          type: 'number'
        },
        { 
          prop: 'unit_price', 
          label: '单价(元)', 
          width: 100,
          type: 'number'
        },
        { 
          prop: 'refuel_quantity', 
          label: '加油升数', 
          width: 100,
          type: 'number'
        },
        { 
          prop: 'refuel_amount', 
          label: '加油金额(元)', 
          width: 120,
          type: 'number'
        },
        { 
          prop: 'driver', 
          label: '驾驶员', 
          width: 100
        },
        { 
          prop: 'license_plate', 
          label: '车牌号码', 
          width: 120
        },
        { 
          prop: 'refuel_times', 
          label: '加油次数', 
          width: 100,
          type: 'number'
        },
        { 
          prop: 'card_number', 
          label: '卡号', 
          width: 150
        },
        { 
          prop: 'town', 
          label: '乡镇', 
          width: 100
        },
        { 
          prop: 'remark', 
          label: '备注', 
          width: 150
        }
      ]
    }
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData
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

