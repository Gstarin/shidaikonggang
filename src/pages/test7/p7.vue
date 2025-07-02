<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>驾驶员管理</b-breadcrumb-item>
      <b-breadcrumb-item active>年审费用</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">驾驶员年审费用</h1>
    <b-row>
      <b-col>
        <Widget title="<h5>驾驶员年审费用</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'driverAnnualReview'"
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
  name: 'DriverAnnualReview',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      selectMonth: null,
      path: '',
      tableColumns: [
        { prop: 'xuhao', label: '序号', width: 80, type: 'number' },
        { prop: 'name', label: '驾驶员名称', width: 120 },
        { prop: 'gendeer', label: '驾驶证编号', width: 150 },
        { prop: 'nation', label: '身份证号', width: 180 },
        { prop: 'id', label: '驾驶类型', width: 120 },
        { prop: 'birthday', label: '领证日期', width: 120, type: 'date' },
        { prop: 'age', label: '年审单位', width: 150 },
        { prop: 'img', label: '年审日期', width: 120, type: 'date' },
        { 
          prop: 'height', 
          label: '审核费（元）', 
          width: 120,
          type: 'number'
        },
        { 
          prop: 'weight', 
          label: '图片', 
          width: 150,
          type: 'file'
        },
        { prop: 'health', label: '备注', width: 200 }
      ],
      formFields: {
        xuhao: 0,
        name: '',
        gendeer: '',
        nation: '',
        id: '',
        birthday: '',
        age: '',
        img: '',
        height: 0,
        weight: null,
        health: ''
      }
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
