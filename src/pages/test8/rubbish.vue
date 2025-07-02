<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>运输管理</b-breadcrumb-item>
      <b-breadcrumb-item active>生活垃圾运输表</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">生活垃圾运输表</h1>
    <b-row>
      <b-col>
        <Widget title="<h5>生活垃圾<span class='fw-semi-bold'>运输表</span></h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'rubbish-transport'"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-filter1>
              <el-date-picker 
                v-model="selectMonth" 
                type="month" 
                placeholder="选择年月" 
                value-format="yyyy-MM"
                @change="handleMonthChange"
                style="margin-right: 15px"
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
  name: 'RubbishTransport',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectMonth: null,
      companies: [],
      tableData: [],
      formFields: {
        date: '',
        company: '',
        cars: 0,
        weight: 0
      }
    }
  },
  computed: {
    tableColumns() {
      const baseColumns = [
        { 
          prop: 'date', 
          label: '日期', 
          width: 150,
          type: 'date'
        },
        { 
          prop: 'company', 
          label: '公司名称', 
          width: 200,
          editable: true
        },
        { 
          prop: 'cars', 
          label: '车数', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'weight', 
          label: '重量(吨)', 
          width: 150,
          type: 'number',
          editable: true
        }
      ]
      
      return baseColumns
    },
    
    companyTotals() {
      const totals = {}
      
      this.companies.forEach(company => {
        if (company) {
          totals[company] = {
            cars: 0,
            weight: 0
          }
        }
      })
      
      this.tableData.forEach(row => {
        if (row.company && totals[row.company]) {
          totals[row.company].cars += Number(row.cars) || 0
          totals[row.company].weight += Number(row.weight) || 0
        }
      })
      
      return totals
    },
    
    totalCars() {
      return Object.values(this.companyTotals).reduce((sum, item) => sum + (item.cars || 0), 0)
    },
    
    totalWeight() {
      return Object.values(this.companyTotals).reduce((sum, item) => sum + (item.weight || 0), 0)
    }
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData
      this.saveData()
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
    
  }
}
</script>

