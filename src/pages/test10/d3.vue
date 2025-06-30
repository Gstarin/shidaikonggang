<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>投资发展部</b-breadcrumb-item>
      <b-breadcrumb-item active>抄表电费</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>抄表电费</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'electricityFee'"
            :showExcelHandler="true"
            :customFilter1="filterByYearMonth"
            @update:tableData="updateTableData"
            @save-success="handleSaveSuccess"
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
  name: 'ElectricityFee',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      selectedYearMonth: null,
      // 表格列配置
      tableColumns: [
        { prop: 'id', label: '序号', width: 55 },
        { 
          prop: 'date', 
          label: '日期', 
          width: 180, 
          type: 'date',
          formatter: this.formatDate
        },
        { 
          prop: 'name', 
          label: '名称', 
          width: 120,
          editable: true
        },
        { 
          prop: 'money', 
          label: '金额', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'number', 
          label: '票号', 
          width: 150,
          editable: true
        }
      ],
      // 表单字段配置
      formFields: {
        id: 0,
        date: '',
        name: '',
        money: '',
        number: ''
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
      if (!this.selectedYearMonth) return true; // 如果没有选择年月，显示所有数据
      
      // 假设你的数据中有日期字段 'date'，格式为 "YYYY-MM-DD"
      const itemDate = item.date; 
      if (!itemDate) return false;
      
      // 提取年月部分进行比较
      return itemDate.substr(0, 7) === this.selectedYearMonth;
    },
    handleMonthChange() {
      // 可以在这里添加额外的处理逻辑
      console.log('当前筛选月份:', this.selectedYearMonth);
    },
    clearMonthFilter() {
      this.selectedYearMonth = '';
    },
  }
}
</script>
