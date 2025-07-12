<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>车辆维修</h5>" customHeader settings close>
          <xlsx-table
            :columns="columns"
            :table-data.sync="tableData"
            :form-fields="formFields"
            storage-key="car_repair"
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
  name: 'CarRepair',
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
        { prop: 'date', label: '日期', type: 'date' },
        { prop: 'car', label: '车辆类型' },
        { prop: 'car_id', label: '车牌号' },
        { prop: 'driver', label: '司机' },
        { prop: 'xm', label: '维修项目' },
        { prop: 'jine', label: '金额（元）', type: 'number' },
        { prop: 'gongshi', label: '工时费（元）', type: 'number' },
        {
          prop: 'total',
          label: '费用合计（元）',
          type: 'variable',
          calculate: row => {
            const jine = parseFloat(row.jine) || 0
            const gongshi = parseFloat(row.gongshi) || 0
            return (jine + gongshi).toFixed(2)
          }
        },
        { prop: 'wxdw', label: '维修单位' },
        { prop: 'beizhu', label: '备注' }
      ],
      formFields: {
        id: null,
        date: null,
        car: '',
        car_id: '',
        driver: '',
        xm: '',
        jine: '',
        gongshi: '',
        total: '',
        wxdw: '',
        beizhu: ''
      }
    }
  },
  methods: {
    monthFilter(row) {
      if (!this.selectMonth || !row.date) return true
      const d = new Date(row.date)
      const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return formatted === this.selectMonth
    }
  }
}
</script>
