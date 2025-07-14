<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>投资发展部</b-breadcrumb-item>
      <b-breadcrumb-item active>报销记录</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>报销记录</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'reimbursementRecords'"
            :showExcelHandler="true"
            :customFilter1="filterByYearMonth"
            @update:tableData="updateTableData"
            @save-success="handleSaveSuccess"
            @load-success="handleLoadSuccess"
          >
            <!-- 自定义筛选插槽 - 月份筛选 -->
            <template v-slot:custom-filter1>
              <el-date-picker 
                v-model="selectedYearMonth" 
                type="month" 
                placeholder="选择年月" 
                value-format="yyyy-MM"
                @change="handleMonthChange"
                style="margin-right: 15px"
              ></el-date-picker>
            </template>
            
            <!-- 自定义表格模板 -->
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
import * as XLSX from 'xlsx/xlsx.mjs'

export default {
  name: 'ReimbursementRecords',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      selectedYearMonth: null,
      // 表格列配置
      tableColumns: [
        { prop: 'id', label: '序号', width: 55 },
        { 
          prop: 'jkxm', 
          label: '报销类型', 
          width: 150,
          editable: true
        },
        { 
          prop: 'money', 
          label: '开支项目和物品名', 
          width: 250,
          editable: true
        },
        { 
          prop: 'name', 
          label: '用途', 
          width: 200,
          editable: true
        },
        { 
          prop: 'number', 
          label: '金额', 
          width: 150, 
          type: 'number',
          editable: true
        },
        { 
          prop: 'beizhu', 
          label: '领取方式',
          width: 150,
          editable: true
        },
        { 
          prop: 'date', 
          label: '申请日期', 
          width: 200, 
          type: 'date',
          format: 'yyyy-MM-dd'
        }
      ],
      // 表单字段配置
      formFields: {
        id: 0,
        jkxm: '',
        money: '',
        name: '',
        number: '',
        beizhu: '',
        date: ''
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {

    updateTableData(newData) {
      // 更新ID
      this.tableData = newData.map((item, index) => ({
        ...item,
        id: index + 1
      }))
    },
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true; // 如果没有选择年月，显示所有数据
      
      // 假设你的数据中有日期字段 'date'，格式为 "YYYY-MM-DD"
      const itemDate = item.date; 
      if (!itemDate) return false;
      
      // 提取年月部分进行比较
      return itemDate.substr(0, 7) === this.selectedYearMonth;
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectedYearMonth)
    },

  }
}
</script>
