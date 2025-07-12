<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>车辆保险费用</h5>" customHeader settings close>
          <xlsx-table
            :columns="columns"
            :table-data.sync="tableData"
            :form-fields="formFields"
            storage-key="car_insurance"
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
  name: 'CarInsurance',
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
        { prop: 'car', label: '车辆类型' },
        { prop: 'car_id', label: '车牌号' },
        { prop: 'jq', label: '交强', type: 'number' },
        { prop: 'syx', label: '商业险', type: 'number' },
        { prop: 'ccs', label: '车船税', type: 'number' },
        {
          prop: 'zbf',
          label: '总保费',
          type: 'variable',
          calculate: row => {
            const jq = parseFloat(row.jq) || 0
            const syx = parseFloat(row.syx) || 0
            const ccs = parseFloat(row.ccs) || 0
            return (jq + syx + ccs).toFixed(2)
          }
        },
        { prop: 'date', label: '保险日期', type: 'date' }
      ],
      formFields: {
        id: null,
        car: '',
        car_id: '',
        jq: '',
        syx: '',
        ccs: '',
        zbf: '',
        date: null
      }
    }
  },
  methods: {
    monthFilter(row) {
      if (!this.selectMonth) return true
      if (!row.date) return false
      const d = new Date(row.date)
      const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return formatted === this.selectMonth
    }
  }
}
</script>
