<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>青清水务</b-breadcrumb-item>
      <b-breadcrumb-item active>入库单</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>入库单</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'waterStock'"
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
  name: 'WaterStock',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: '',
      tableData: [],
      // 表格列配置
      tableColumns: [
        { prop: 'index', label: '序号', width: 80 },
        { prop: 'materialName', label: '物料名称', width: 150 },
        { prop: 'specModel', label: '规格型号', width: 150 },
        { prop: 'unit', label: '单位', width: 100 },
        { prop: 'requestQuantity', label: '申请数量', width: 120, type: 'number' },
        { prop: 'receivedQuantity', label: '实收数量', width: 120, type: 'number' },
        { prop: 'stockQuantity', label: '入库数量', width: 120, type: 'number' },
        { prop: 'stockTime', label: '入库时间', width: 180, type: 'date' },
        { prop: 'kucun', label: '库存剩余量', width: 120, type: 'number' },
        { prop: 'sunhao', label: '损耗数量', width: 120, type: 'number' },
        { 
          prop: 'inventory', 
          label: '库存数量', 
          width: 120,
          formatter: (row) => row.kucun - row.sunhao 
        },
        { prop: 'jine', label: '金额', width: 120, type: 'number' },
        { prop: 'note', label: '备注', width: 200 }
      ],
      // 表单字段配置
      formFields: {
        index: '',
        materialName: '',
        specModel: '',
        unit: '',
        requestQuantity: 0,
        receivedQuantity: 0,
        stockQuantity: 0,
        stockTime: new Date().toISOString().slice(0, 10),
        kucun: 0,
        sunhao: 0,
        jine: 0,
        note: ''
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData
    },
    
    filterByMonth(item) {
      if (!this.selectedYearMonth) return true
      
      const itemDate = item.stockTime
      if (!itemDate) return false
      
      // 处理不同日期格式
      const itemYearMonth = itemDate.length > 7 ? itemDate.substr(0, 7) : itemDate
      return itemYearMonth === this.selectedYearMonth
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectedYearMonth)
    },
    
    clearMonthFilter() {
      this.selectedYearMonth = ''
    }
  },

}
</script>
