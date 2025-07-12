<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>劳保费用</h5>" customHeader settings close>
          <xlsx-table
            :columns="columns"
            :table-data.sync="tableData"
            :form-fields="formFields"
            storage-key="labor_protection"
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
  name: 'LaborProtection',
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
        { prop: 'name', label: '用品名称' },
        { prop: 'price', label: '单价（元）', type: 'number' },
        { prop: 'danwei', label: '单位' },
        { prop: 'quantity', label: '数量', type: 'number' },
        {
          prop: 'jine',
          label: '金额（元）',
          type: 'variable',
          calculate: row => {
            const price = parseFloat(row.price) || 0
            const qty = parseFloat(row.quantity) || 0
            return (price * qty).toFixed(2)
          }
        },
        { prop: 'beizhu', label: '备注' }
      ],
      formFields: {
        id: null,
        date: null,
        name: '',
        price: '',
        danwei: '',
        quantity: '',
        jine: '',
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
