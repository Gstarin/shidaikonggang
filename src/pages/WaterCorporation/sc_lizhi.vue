<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>青清水务</b-breadcrumb-item>
      <b-breadcrumb-item active>地表水厂离职人员</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">地表水厂离职人员</h1>
    <b-row>
      <b-col>
        <Widget title="<h5>地表水厂离职人员</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="employees"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'sclizhi'"
            :showExcelHandler="true"
            :customFilter1="filterByYearMonth"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-filter1>
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
  name: 'WaterPlantResignation',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: '',
      employees: [],
      tableColumns: [
        { prop: 'time', label: '序号', width: 80 },
        { prop: 'name', label: '姓名', width: 120 },
        { prop: 'danwei', label: '性别', width: 80 },
        { prop: 'number', label: '年龄', width: 80, type: 'number' },
        { prop: 'remaining', label: '出生日期', width: 150, type: 'date' },
        { prop: 'sunhao', label: '身份证号', width: 180 },
        { prop: 'phone', label: '电话', width: 120 },
        { prop: 'job', label: '岗位', width: 120 },
        { prop: 'time2', label: '入职时间', width: 150, type: 'date' },
        { prop: 'lizhi', label: '离职时间', width: 150, type: 'date' },
        { prop: 'people', label: '劳动关系', width: 120 },
        { prop: 'jine', label: '工作地点', width: 120 },
        { prop: 'note', label: '备注', width: 200 }
      ],
      formFields: {
        time: '',
        name: '',
        danwei: '',
        number: 0,
        remaining: '',
        sunhao: '',
        phone: '',
        job: '',
        time2: '',
        lizhi: '',
        people: '',
        jine: '',
        note: '',
        selected: false
      }
    }
  },
  methods: {
    updateTableData(newData) {
      this.employees = newData
    },
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth || !item.time2) return true
      
      const date = new Date(item.time2)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const itemYearMonth = `${year}-${month}`
      
      return itemYearMonth === this.selectedYearMonth
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectedYearMonth)
    },
    
    clearMonthFilter() {
      this.selectedYearMonth = ''
    }
  }
}
</script>

