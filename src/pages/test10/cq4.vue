<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>车辆保险费用</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'cq4'"
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
            
            <template v-slot:custom-table>
              <el-table style="display: none;width: 100%" id="DisburseTable1">
                <el-table-column 
                  v-for="column in tableColumns" 
                  :key="column.prop"
                  :prop="column.prop" 
                  :label="column.label" 
                ></el-table-column>
              </el-table>
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
  name: 'CarInsurance',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: '',
      tableData: [],
      tableColumns: [
        { prop: 'id', label: '序号', width: 55 },
        { 
          prop: 'car', 
          label: '车辆类型', 
          width: 150,
          editable: true
        },
        { 
          prop: 'car_id', 
          label: '车牌号', 
          width: 100,
          editable: true
        },
        { 
          prop: 'jq', 
          label: '交强', 
          width: 100,
          type: 'number',
          editable: true
        },
        { 
          prop: 'syx', 
          label: '商业险', 
          width: 100,
          type: 'number',
          editable: true
        },
        { 
          prop: 'ccs', 
          label: '车船税', 
          width: 180,
          type: 'number',
          editable: true
        },
        { 
          prop: 'zbf', 
          label: '总保费', 
          width: 180,
          type: 'number',
          editable: true,
          calculate: (row) => {
            // 计算总保费 = 交强 + 商业险 + 车船税
            const jq = parseFloat(row.jq) || 0
            const syx = parseFloat(row.syx) || 0
            const ccs = parseFloat(row.ccs) || 0
            return (jq + syx + ccs).toFixed(2)
          }
        },
        { 
          prop: 'date', 
          label: '保险日期', 
          type: 'date',
          editable: true
        }
      ],
      formFields: {
        id: 0,
        car: '',
        car_id: '',
        jq: 0,
        syx: 0,
        ccs: 0,
        zbf: 0,
        date: new Date().toISOString().slice(0, 10)
      }
    }
  },

  methods: {
    updateTableData(newData) {
      // 确保每条数据都有id
      this.tableData = newData.map((item, index) => ({
        ...item,
        id: index + 1
      }))
    },
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true
      
      if (!item.date) return false
      
      // 提取年月部分进行比较
      const itemDate = new Date(item.date)
      const year = itemDate.getFullYear()
      const month = (itemDate.getMonth() + 1).toString().padStart(2, '0')
      return `${year}-${month}` === this.selectedYearMonth
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
