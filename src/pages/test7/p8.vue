<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>其他费用</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">其他费用管理</h1>
    <b-row>
      <b-col>
        <Widget title="<h5>其他<span class='fw-semi-bold'>费用</span></h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'other_expenses'"
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
  name: 'OtherExpenses',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      selectMonth: null,
      path: '',
      formFields: {
        xuhao: 0,
        name: '',
        gendeer: '',
        nation: '',
        id: 0,
        birthday: '',
        age: '',
        selected: false
      },
      tableColumns: [
        { prop: 'xuhao', label: '序号', width: 100, type: 'number' },
        { prop: 'name', label: '车牌号', width: 150 },
        { prop: 'gendeer', label: '所属车队', width: 150 },
        { prop: 'nation', label: '费用信息', width: 200 },
        { 
          prop: 'id', 
          label: '金额（元）', 
          width: 150,
          type: 'number'
        },
        { prop: 'birthday', label: '备注', width: 200 },
        { 
          prop: 'age', 
          label: '图片', 
          width: 200,
          type: 'file'
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
