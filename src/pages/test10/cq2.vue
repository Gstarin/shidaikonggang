<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>用电费用</h5>" customHeader settings close>
          <xlsx-table
            :columns="columns"
            :table-data.sync="tableData"
            :form-fields="formFields"
            storage-key="electricity_costs"
            :show-excel-handler="true"
          />
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import XlsxTable from '@/components/Template/xlsxTable.vue' // 你的 TableTemplate.vue 别名为 xlsxTable

export default {
  name: 'ElectricityCosts',
  components: {
    Widget,
    XlsxTable
  },
  data() {
    return {
      tableData: [],
      columns: [
        { prop: 'id', label: '序号', type: 'number' },
        { prop: 'date', label: '月份', type: 'date' },
        { prop: 'bumen', label: '用电部门' },
        { prop: 'price', label: '单价', type: 'number' },
        { prop: 'elec', label: '总用电量', type: 'number' },
        {
          prop: 'money',
          label: '总金额',
          type: 'variable',
          calculate: row => {
            const price = parseFloat(row.price) || 0
            const elec = parseFloat(row.elec) || 0
            return (price * elec).toFixed(2)
          }
        }
      ],
      formFields: {
        id: null,
        date: null,
        bumen: '',
        price: '',
        elec: '',
        money: ''
      }
    }
  },
}
</script>
