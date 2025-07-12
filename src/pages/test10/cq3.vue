<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>车辆保养费用</h5>" customHeader settings close>
          <xlsx-table
            :columns="columns"
            :table-data.sync="tableData"
            :form-fields="formFields"
            storage-key="vehicle_maintenance"
            :custom-filter1="monthFilter"
          >
            <template #custom-filter1>
              <div class="d-flex align-items-center mr-3 mb-2">
                <el-date-picker
                  v-model="selectMonth"
                  type="month"
                  placeholder="选择月份"
                  value-format="yyyy-MM"
                  style="max-width: 200px"
                ></el-date-picker>
              </div>
            </template>
          </xlsx-table>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import XlsxTable from '@/components/Template/xlsxTable.vue'

export default {
  name: 'VehicleMaintenance',
  components: {
    Widget,
    XlsxTable
  },
  data() {
    return {
      selectMonth: null,
      tableData: [],
      columns: [
        { prop: 'id', label: '序号', type: 'number' },
        { prop: 'car_id', label: '车牌号码' },
        { prop: 'car', label: '车型' },
        { prop: 'miles1', label: '上次保养里程' },
        { prop: 'date1', label: '上次保养日期', type: 'date' },
        { prop: 'miles2', label: '本次保养里程' },
        { prop: 'date2', label: '本次保养日期', type: 'date' },
        { prop: 'xm', label: '保养项目' },
        { prop: 'quantity', label: '数量', type: 'number' },
        { prop: 'jine', label: '金额（元）', type: 'number' },
        {
          prop: 'total',
          label: '费用合计',
          type: 'variable',
          calculate: row => {
            const q = parseFloat(row.quantity) || 0
            const j = parseFloat(row.jine) || 0
            return (q * j).toFixed(2)
          }
        },
        { prop: 'person', label: '维保人' }
      ],
      formFields: {
        id: null,
        car_id: '',
        car: '',
        miles1: '',
        date1: null,
        miles2: '',
        date2: null,
        xm: '',
        quantity: '',
        jine: '',
        total: '',
        person: ''
      }
    }
  },
  methods: {
    monthFilter(row) {
      if (!this.selectMonth) return true
      if (!row.date2) return false
      const d = new Date(row.date2)
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return month === this.selectMonth
    }
  }
}
</script>
