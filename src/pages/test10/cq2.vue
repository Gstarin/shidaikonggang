<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>用电费用</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'electricityCost'"
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
              <el-table style="display: none;width: 100%" id="ElectricityCostTable">
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
  name: 'ElectricityCost',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: '',
      tableData: [],
      tableColumns: [
        { prop: 'id', label: '序号', width: 55 },
        { 
          prop: 'date', 
          label: '月份', 
          width: 180,
          type: 'date'
        },
        { 
          prop: 'bumen', 
          label: '用电部门', 
          width: 150,
          editable: true
        },
        { 
          prop: 'price', 
          label: '单价', 
          width: 100,
          type: 'number',
          editable: true
        },
        { 
          prop: 'elec', 
          label: '总用电量', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'money', 
          label: '总金额', 
          width: 120,
          type: 'number',
          editable: true
        }
      ],
      formFields: {
        id: 0,
        date: null,
        bumen: '',
        price: 0,
        elec: 0,
        money: 0
      }
    }
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData
      // 更新ID序列
      this.tableData.forEach((item, index) => {
        item.id = index + 1
      })
    },
    
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true
      
      if (!item.date) return false
      
      const date = new Date(item.date)
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
