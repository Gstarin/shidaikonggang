<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>车辆管理</b-breadcrumb-item>
      <b-breadcrumb-item active>维修费用</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">维修费用管理</h1>
    <b-row>
      <b-col>
        <Widget title="<h5>维修<span class='fw-semi-bold'>费用</span></h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'wxfy'"
            :apiEndpoint="'/api/data/wxfy'"
            :customFilter1="filterByMonth"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-filter1>
              <el-date-picker
                v-model="selectMonth"
                type="month"
                placeholder="选择年月"
                @change="handleMonthChange"
                value-format="yyyy-MM"
                class="mr-3 mb-2"
              ></el-date-picker>
            </template>
            
            <template v-slot:custom-table>
              <el-table style="display: none;width: 100%" id="WxfyTable">
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
  name: 'WxfyManagement',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      selectMonth: null,
      path: '',
      formFields: {
        xuhao: 0,
        name: '',
        phone: '',
          detailsnation: '',
          detailsid: '',
          detailsbirthday: '',
          detailsage: '',
          detailshealth: '',
          detailsPoliticalStatus: ''
      },
      tableColumns: [
        { prop: 'xuhao', label: '序号', width: 100, editable: true },
        { prop: 'name', label: '车牌号', width: 150, editable: true },
        { prop: 'phone', label: '日期', width: 150, editable: true, type: 'date' },
        { 
          label: '维修详情', 
          children: [
            { prop: 'detailsnation', label: '司机', width: 120, editable: true },
            { prop: 'detailsid', label: '项目', width: 150, editable: true },
            { 
              prop: 'detailsbirthday', 
              label: '材料费(元)', 
              width: 120, 
              editable: true,
              type: 'number',

            },
            { 
              prop: 'detailsage', 
              label: '工时费(元)', 
              width: 120, 
              editable: true,
              type: 'number',
            },
            { 
              prop: 'detailshealth', 
              label: '费用合计(元)', 
              width: 120, 
              editable: true,
            },
            { prop: 'detailsPoliticalStatus', label: '维修单位', width: 150, editable: true }
          ]
        }
      ]
    }
  },

  methods: {

    updateTableData(newData) {
      this.tableData = newData
    },
    filterByMonth(item) {
      if (!this.selectMonth) return true
      
      const itemDate = item.time2
      if (!itemDate) return false
      
      // 处理不同日期格式
      const dateObj = new Date(itemDate)
      const year = dateObj.getFullYear()
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
      const itemYearMonth = `${year}-${month}`
      
      return itemYearMonth === this.selectMonth
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectMonth)
    },
    
    clearMonthFilter() {
      this.selectMonth = null
    },
  }
}
</script>
