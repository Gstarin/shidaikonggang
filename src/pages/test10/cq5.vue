<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>车辆年审费用</h5>" customHeader settings close>
          <xlsx-table
            :columns="columns"
            :table-data.sync="tableData"
            :form-fields="formFields"
            storage-key="car_inspection"
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
  name: 'CarInspection',
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
        { prop: 'date1', label: '年审日期', type: 'date' },
        { prop: 'date2', label: '有效期至', type: 'date' },
        { prop: 'total', label: '年审费(元)', type: 'number' },
        { prop: 'beizhu', label: '备注' }
      ],
      formFields: {
        id: null,
        car: '',
        car_id: '',
        date1: null,
        date2: null,
        total: '',
        beizhu: ''
      }
    }
  },
  methods: {
    monthFilter(row) {
      if (!this.selectMonth || !row.date1) return true
      const d = new Date(row.date1)
      const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return formatted === this.selectMonth
    }
  }
}
</script>
