<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>投资发展部</b-breadcrumb-item>
      <b-breadcrumb-item active>合同管理</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>合同管理</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'contractManagement'"
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

export default {
  name: 'ContractManagement',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      selectedYearMonth: null,
      project_id: 5,
      // 表格列配置
      tableColumns: [
        { prop: 'id', label: '序号', width: 55 },
        { 
          prop: 'htmc', 
          label: '合同名称', 
          width: 180,
          editable: true
        },
        { 
          prop: 'date', 
          label: '日期', 
          width: 150, 
          type: 'date',
          format: 'yyyy-MM-dd'
        },
        { 
          prop: 'money', 
          label: '金额', 
          width: 120, 
          type: 'number',
          editable: true
        },
        { 
          prop: 'qixian', 
          label: '期限', 
          width: 120,
          editable: true
        },
        { 
          prop: 'pdf', 
          label: 'PDF文件', 
          width: 200,
          type: 'file',
          editable: true
        },
        { 
          prop: 'beizhu', 
          label: '备注',
          editable: true
        }
      ],
      // 表单字段配置
      formFields: {
        id: 0,
        htmc: '',
        date: '',
        money: '',
        qixian: '',
        pdf: null,
        beizhu: ''
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    updateTableData(newData) {
      // 更新ID
      newData.forEach((item, index) => {
        item.id = index + 1
      })
      this.tableData = newData
    },
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true
      
      const itemDate = item.date
      if (!itemDate) return false
      
      // 提取年月部分进行比较
      return itemDate.substr(0, 7) === this.selectedYearMonth
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectedYearMonth)
    },

    
  }
}
</script>
