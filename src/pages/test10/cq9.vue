<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>合同档案</h5>" customHeader settings close>
          <xlsx-table
            :columns="columns"
            :table-data.sync="tableData"
            :form-fields="formFields"
            storage-key="contract_archive"
            :custom-filter1="monthFilter"
          >
            <template #custom-filter1>
              <div class="d-flex align-items-center mr-3 mb-2">
                <el-date-picker
                  v-model="selectMonth"
                  type="month"
                  placeholder="按签订日期筛选"
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
  name: 'ContractArchive',
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
        { prop: 'danwei1', label: '我方单位' },
        { prop: 'danwei2', label: '对方单位' },
        { prop: 'date1', label: '签订日期', type: 'date' },
        { prop: 'date2', label: '结束日期', type: 'date' },
        { prop: 'jine', label: '合同金额', type: 'number' },
        { prop: 'beizhu', label: '备注' }
      ],
      formFields: {
        id: null,
        danwei1: '',
        danwei2: '',
        date1: null,
        date2: null,
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
