<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>瑞景园林</b-breadcrumb-item>
      <b-breadcrumb-item active>企业拜访</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>企业拜访记录表</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="columns"
            :formFields="formFields"
            :storageKey="'qybf'"
            :apiEndpoint="'/api/data/qybf'"
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
import Widget from '@/components/Widget/Widget';
import TableTemplate from '@/components/Template/xlsxTable'
import axios from '@/utils/axios.js'

export default {
  name: 'qybf',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectMonth: null,
      path: '',
      tableData: [],
      columns: [
        { prop: 'xz', label: '乡镇', width: 180, editable: true },
        { prop: 'qymc', label: '企业名称', width: 100, editable: true },
        { prop: 'date', label: '拜访日期', width: 120, editable: true ,type: 'date'},
        { prop: 'name', label: '拜访人', width: 120, editable: true },
        { prop: 'yx', label: '有无意向合作', width: 120, editable: true },
        { prop: 'bz', label: '备注', editable: true }
      ],
      formFields: {
        xz: '',
        qymc: '',
        date: '',
        name: '',
        yx: '',
        bz: ''
      }
    }
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectMonth)
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

<style lang="scss" scoped>
@import '../../styles/app';
</style>