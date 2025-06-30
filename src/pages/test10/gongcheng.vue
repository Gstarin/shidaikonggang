<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>维护</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'repairing'"
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

export default {
  name: 'repairing',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      selectedYearMonth: null,
      // 表格列配置
      tableColumns: [
        { 
          prop: 'date', 
          label: '缴费日期', 
          width: 180, 
          type: 'date',
          format: 'yyyy-MM-dd'
        },
        { 
          prop: 'mzwcs', 
          label: '每周完成数', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'place', 
          label: '地点', 
          width: 120,
          editable: true
        },
        { 
          prop: 'xinxi', 
          label: '内容信息简要', 
          width: 300, 
          editable: true
        },
        { 
          prop: 'name', 
          label: '维修人', 
          width: 120,
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
        date:'',
        mzwcs:'',
        place:'',
        xinxi:'',
        name:'',
        beizhu:'',

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
      }));
    },
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true
      
      if (!item.date) return false
      
      const date = new Date(item.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const formattedMonth = month < 10 ? `0${month}` : month
      
      return `${year}-${formattedMonth}` === this.selectedYearMonth
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectedYearMonth);
    },
    
  }
}
</script>
