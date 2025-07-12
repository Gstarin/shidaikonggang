<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>收入情况</h5>" customHeader settings close>
          <xlsx-table
            :columns="columns"
            :table-data.sync="tableData"
            :form-fields="formFields"
            storage-key="revenue"
            :custom-filter1="monthFilter"
          >
            <template #custom-filter1>
              <div class="d-flex align-items-center mr-3 mb-2">
                <el-date-picker
                  v-model="selectMonth"
                  type="month"
                  placeholder="按开始时间筛选"
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
  name: 'Revenue',
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
        { prop: 'name', label: '客户名称' },
        { prop: 'date1', label: '开始时间', type: 'date' },
        { prop: 'date2', label: '结束时间', type: 'date' },
        { prop: 'jzfs', label: '结账方式' },
        { prop: 'jine', label: '实收金额（元）', type: 'number' },
        { prop: 'beizhu', label: '备注' }
      ],
      formFields: {
        id: null,
        name: '',
        date1: null,
        date2: null,
        jzfs: '',
        jine: '',
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
