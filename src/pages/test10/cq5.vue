<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>车辆年审费用</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'cq5'"
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
import moment from 'moment'

export default {
  name: 'CarAnnualReview',
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
          prop: 'date1', 
          label: '年审日期', 
          width: 180,
          type: 'date'
        },
        { 
          prop: 'date2', 
          label: '有效期至', 
          width: 180,
          type: 'date'
        },
        { 
          prop: 'total', 
          label: '年审费(元)', 
          width: 180,
          type: 'number'
        },
        { 
          prop: 'beizhu', 
          label: '备注',
          editable: true
        }
      ],
      formFields: {
        id: 0,
        car: '',
        car_id: '',
        date1: null,
        date2: null,
        total: 0,
        beizhu: ''
      }
    }
  },
  methods: {
    updateTableData(newData) {
      // 更新ID序号
      this.tableData = newData.map((item, index) => ({
        ...item,
        id: index + 1
      }))
    },
  
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true
      if (!item.date1) return false
      
      const itemDate = moment(item.date1).format('YYYY-MM')
      return itemDate === this.selectedYearMonth
    },
    
    handleMonthChange() {
      // 月份选择变化处理
      console.log('当前筛选月份:', this.selectedYearMonth)
    },
    
    clearMonthFilter() {
      this.selectedYearMonth = ''
    }
  }
}
</script>