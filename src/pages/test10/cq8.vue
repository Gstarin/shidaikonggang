<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>其他费用</h5>" customHeader settings close>
          <xlsx-table
            :columns="columns"
            :table-data.sync="tableData"
            :form-fields="formFields"
            storage-key="other_expense"
          />
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import XlsxTable from '@/components/Template/xlsxTable.vue'

export default {
  name: 'OtherExpense',
  components: {
    Widget,
    XlsxTable
  },
  data() {
    return {
      tableData: [],
      columns: [
        { prop: 'id', label: '序号', type: 'number' },
        { prop: 'name', label: '名称' },
        { prop: 'price', label: '单价（元）', type: 'number' },
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
        name: '',
        price: '',
        quantity: '',
        jine: '',
        beizhu: ''
      }
    }
  }
}
</script>
