<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>保险管理</b-breadcrumb-item>
      <b-breadcrumb-item active>保险费用</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">保险费用</h1>
    <b-row>
      <b-col>
        <Widget title="<h5>保险费用</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="insuranceData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'insuranceData'"
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
  name: 'InsuranceCost',
  components: { Widget, TableTemplate },
  data() {
    return {
      insuranceData: [],
      selectMonth: null,
      path: '',
      tableColumns: [
        { prop: 'sequenceNumber', label: '序号', width: 100, type: 'number' },
        { prop: 'vehicleType', label: '车辆类型', width: 150 },
        { prop: 'plateNumber', label: '车牌号', width: 150 },
        { prop: 'compulsoryInsurance', label: '交强', width: 120, type: 'number' },
        { prop: 'commercialInsurance', label: '商业险', width: 120, type: 'number' },
        { prop: 'vehicleTax', label: '车船税', width: 120, type: 'number' },
        { 
          prop: 'totalPremium', 
          label: '总保费', 
          width: 120, 
          type: 'number',
          calculate: (row) => {
            const compulsory = Number(row.compulsoryInsurance) || 0
            const commercial = Number(row.commercialInsurance) || 0
            const tax = Number(row.vehicleTax) || 0
            return compulsory + commercial + tax
          }
        },
        { prop: 'insurancePeriod', label: '保险日期', width: 150, type: 'date' },
        { prop: 'inconsistencyReason', label: '保费不一致原因', width: 200 }
      ],
      formFields: {
        sequenceNumber: 0,
        vehicleType: '',
        plateNumber: '',
        compulsoryInsurance: 0,
        commercialInsurance: 0,
        vehicleTax: 0,
        totalPremium: 0,
        insurancePeriod: '',
        inconsistencyReason: ''
      }
    }
  },

  methods: {
    
    updateTableData(newData) {
      this.insuranceData = newData
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

