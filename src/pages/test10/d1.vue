<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>物业管理</b-breadcrumb-item>
      <b-breadcrumb-item active>物业费用</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>物业费用</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'propertyFees'"
            :showExcelHandler="true"
            :customFilter1="filterByYearMonth"
            @update:tableData="updateTableData"
          >
            <!-- 自定义筛选插槽 - 月份筛选 -->
            <template v-slot:custom-filter1>
              <el-date-picker 
                v-model="selectedYearMonth" 
                type="month" 
                placeholder="选择年月"
                value-format="yyyy-MM"
                @change="handleMonthChange"
                style="margin-right: 15px; width: 150px;"
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
import moment from 'moment'

export default {
  name: 'PropertyFees',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: null,
      tableData: [],
      // 表格列配置
      tableColumns: [
        { prop: 'id', label: '序号', width: 55 },
        { 
          prop: 'date', 
          label: '缴费日期', 
          width: 180,
          type: 'date'
        },
        { 
          prop: 'louhao', 
          label: '楼号', 
          width: 100 
        },
        { 
          prop: 'name', 
          label: '姓名', 
          width: 100 
        },
        { 
          prop: 'money', 
          label: '金额', 
          width: 100,
          type: 'number'
        },
        { 
          prop: 'date2', 
          label: '截止时间', 
          width: 180,
          type: 'date'
        },
        { 
          prop: 'number', 
          label: '票号', 
          width: 120 
        },
        { 
          prop: 'beizhu', 
          label: '备注' 
        }
      ],
      // 表单字段配置
      formFields: {
        id: 0,
        date: null,
        louhao: '',
        name: '',
        money: '',
        date2: null,
        number: '',
        beizhu: ''
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    updateTableData(newData) {
      // 更新数据时重新计算ID
      this.tableData = newData.map((item, index) => {
        return { ...item, id: index + 1 }
      })
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

<style lang="scss" scoped>
@import '../../styles/app';

.tables-basic {
  .custom-table ::v-deep .el-input__inner {
    background-color: transparent !important;
    border: none;
    color: black;
  }

  .custom-table {
    width: 100%;
    table-layout: fixed;
  }

  .custom-table ::v-deep .el-table__header-wrapper th {
    text-align: center;
    background-color: #f5f7fa;
  }

  .custom-table ::v-deep .el-table__body td {
    text-align: center;
  }

  .custom-table ::v-deep .el-input__inner {
    text-align: center;
  }

  .custom-table ::v-deep .el-input {
    width: 100%;
  }

  .custom-table ::v-deep .el-date-editor.el-input {
    width: 100%;
  }
}
</style>