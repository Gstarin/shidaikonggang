<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>合同档案</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'cq9'"
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
  name: 'ContractArchive',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: '',
      tableData: [],
      tableColumns: [
        { prop: 'id', label: '序号', width: 55 },
        { 
          prop: 'danwei1', 
          label: '我方单位', 
          width: 150,
          editable: true
        },
        { 
          prop: 'danwei2', 
          label: '对方单位', 
          width: 100,
          editable: true
        },
        { 
          prop: 'date1', 
          label: '签订日期', 
          width: 180,
          type: 'date',
          editable: true
        },
        { 
          prop: 'date2', 
          label: '结束日期', 
          width: 180,
          type: 'date',
          editable: true
        },
        { 
          prop: 'jine', 
          label: '合同金额', 
          width: 180,
          type: 'number',
          editable: true
        },
        { 
          prop: 'beizhu', 
          label: '备注', 
          editable: true
        }
      ],
      formFields: {
        id: 0,
        danwei1: '',
        danwei2: '',
        date1: null,
        date2: null,
        jine: 0,
        beizhu: ''
      }
    }
  },

  methods: {
    updateTableData(newData) {
      this.tableData = newData
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
      // 可以在这里添加额外的处理逻辑
      console.log('当前筛选月份:', this.selectedYearMonth)
    },
    
    clearMonthFilter() {
      this.selectedYearMonth = ''
    }
  }
}
</script>
