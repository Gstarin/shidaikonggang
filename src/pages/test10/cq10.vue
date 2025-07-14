<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>收入情况</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'cq10'"
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
  name: 'IncomeAnalysis',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: '',
      tableData: [],
      tableColumns: [
        { prop: 'id', label: '序号', width: 55 },
        { 
          prop: 'name', 
          label: '客户名称', 
          width: 150,
          editable: true
        },
        { 
          prop: 'date1', 
          label: '开始时间', 
          width: 180,
          type: 'date'
        },
        { 
          prop: 'date2', 
          label: '结束时间', 
          width: 180,
          type: 'date'
        },
        { 
          prop: 'jzfs', 
          label: '结账方式', 
          width: 180,
          editable: true
        },
        { 
          prop: 'jine', 
          label: '实收金额', 
          width: 180,
          type: 'number'
        },
        { 
          prop: 'beizhu', 
          label: '备注', 
          editable: true
        }
      ],
      formFields: {
        id: 0,
        name: '',
        date1: null,
        date2: null,
        jzfs: '',
        jine: 0,
        beizhu: ''
      }
    }
  },

  methods: {
    updateTableData(newData) {
      this.tableData = newData
      // 重新编号
      this.tableData.forEach((item, index) => {
        item.id = index + 1
      })
    },
  
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true
      
      if (!item.date1) return false
      
      const date = new Date(item.date1)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      return `${year}-${month}` === this.selectedYearMonth
    },
    
    handleMonthChange() {
      // 过滤逻辑由模板自动处理
    },
    
    clearMonthFilter() {
      this.selectedYearMonth = ''
    }
  }
}
</script>
