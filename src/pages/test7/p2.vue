<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>车辆管理</b-breadcrumb-item>
      <b-breadcrumb-item active>充电费用</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">充电费用</h1>
    <b-row>
      <b-col>
        <Widget title="<h5>充电<span class='fw-semi-bold'>费用</span></h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="chargingData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'charging_fees'"
            :showExcelHandler="true"
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
                style="margin-right: 15px;"
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
  name: 'ChargingFees',
  components: { Widget, TableTemplate },
  data() {
    return {
      chargingData: [],
      selectMonth: null,
      path: '',
      tableColumns: [
        { prop: 'xuhao', label: '序号', width: 100, type: 'number' },
        { prop: 'number', label: '车牌号', width: 150 },
        { prop: 'gendeer', label: '所属车队', width: 150 },
        { prop: 'nation', label: '充电信息', width: 180 },
        { prop: 'id', label: '充电类型', width: 150 },
        { prop: 'birthday', label: '加油型号', width: 150 },
        { 
          prop: 'age', 
          label: '充电费用', 
          width: 150,
          type: 'number'
        },
        { 
          prop: 'PoliticalStatus', 
          label: '当前里程', 
          width: 150,
          type: 'number'
        },
        { prop: 'phone2', label: '充电地点', width: 180 },
        { prop: 'address', label: '备注', width: 200 },
        { 
          prop: 'time2', 
          label: '仪表台照片', 
          width: 180,
          type: 'file'
        },
        { 
          prop: 'satus', 
          label: '票据照片', 
          width: 180,
          type: 'file'
        }
      ],
      formFields: {
        xuhao: '',
        number: '',
        gendeer: '',
        nation: '',
        id: '',
        birthday: '',
        age: '',
        PoliticalStatus: '',
        phone2: '',
        address: '',
        time2: null,
        satus: null
      }
    }
  },

  methods: {
    updateTableData(newData) {
      this.chargingData = newData
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
