<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>劳保费用</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'cq7'"
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
  name: 'LaborProtection',
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
          prop: 'name', 
          label: '用品名称', 
          width: 150,
          editable: true
        },
        { 
          prop: 'price', 
          label: '单价（元）', 
          width: 100,
          type: 'number',
          editable: true
        },
        { 
          prop: 'danwei', 
          label: '单位', 
          width: 100,
          editable: true
        },
        { 
          prop: 'quantity', 
          label: '数量', 
          width: 100,
          type: 'number',
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
          prop: 'beizhu', 
          label: '备注', 
          width: 180,
          editable: true
        }
      ],
      formFields: {
        id: 0,
        date: null,
        name: '',
        price: 0,
        danwei: '',
        quantity: 0,
        jine: 0,
        beizhu: ''
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData
      // 更新序号
      this.tableData.forEach((item, index) => {
        item.id = index + 1
      })
    },
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true
      if (!item.date) return false
      
      const date = new Date(item.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const formattedMonth = month < 10 ? `0${month}` : month
      const itemYearMonth = `${year}-${formattedMonth}`
      
      return itemYearMonth === this.selectedYearMonth
    },
    
    handleMonthChange() {
      // 可以在这里添加额外的处理逻辑
      console.log('当前筛选月份:', this.selectedYearMonth)
    },
    
    clearMonthFilter() {
      this.selectedYearMonth = ''
    },
    
  }
}
</script>
