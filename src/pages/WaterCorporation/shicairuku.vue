<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>青清水务</b-breadcrumb-item>
      <b-breadcrumb-item active>食材出库单</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>食材出库单</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'foodDisburse'"
            :customFilter1="filterByMonth"
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
                  style="width: 200px; margin-right: 15px;"
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
  name: 'FoodDisburse',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: '',
      tableData: [],
      // 表格列配置
      tableColumns: [
        { prop: 'date', label: '日期', width: 150, type: 'date' },
        { prop: 'productName', label: '品名', width: 150 },
        { prop: 'unit', label: '单位', width: 100 },
        { prop: 'disburseQuantity', label: '出库数量', width: 120, type: 'number' },
        { prop: 'unitPrice', label: '单价', width: 120, type: 'number' },
        { 
          prop: 'amount', 
          label: '金额', 
          width: 120,
          type: 'number',
          formatter: (row) => row.disburseQuantity * row.unitPrice || 0
        },
        { prop: 'recipient', label: '领用人', width: 120 },
        { prop: 'note', label: '备注', width: 200 }
      ],
      // 表单字段配置
      formFields: {
        date: new Date().toISOString().slice(0, 10),
        productName: '',
        unit: '',
        disburseQuantity: 0,
        unitPrice: 0,
        amount: 0,
        recipient: '',
        note: ''
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    
    // 按月筛选
    filterByMonth(item) {
      if (!this.selectedYearMonth) return true
      
      const itemDate = item.date
      if (!itemDate) return false
      
      // 处理不同日期格式
      const itemYearMonth = itemDate.length > 7 ? itemDate.substr(0, 7) : itemDate
      return itemYearMonth === this.selectedYearMonth
    },
    
    // 月份选择变化处理
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectedYearMonth)
    },
    
    // 清除月份筛选
    clearMonthFilter() {
      this.selectedYearMonth = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.table-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
}

.table-footer {
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.clickable {
  cursor: pointer;
  color: #9f9fad;
  text-decoration: underline;
}
</style>