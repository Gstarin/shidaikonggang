<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>加油费用</h5>" customHeader settings close>
          <xlsx-table
            :columns="columns"
            :table-data.sync="tableData"
            :form-fields="formFields"
            storage-key="fuel_costs"
            :show-excel-handler="true"
          />
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import XlsxTable from '@/components/Template/xlsxTable.vue' // 即 TableTemplate.vue 重命名为 xlsxTable.vue 的组件
import axios from '@/utils/axios'

export default {
  name: 'FuelCosts',
  components: {
    Widget,
    XlsxTable
  },
  data() {
    return {
      tableData: [],
      columns: [
        { prop: 'id', label: '序号', type: 'number' },
        { prop: 'date', label: '日期', type: 'date' },
        { prop: 'driver', label: '驾驶员' },
        { prop: 'car_number', label: '车辆号码' },
        { prop: 'miles', label: '当前里程数' },
        { prop: 'youpin', label: '油品' },
        { prop: 'price', label: '单价（元）', type: 'number' },
        { prop: 'jyss', label: '加油升数', type: 'number' },
        {
          prop: 'money',
          label: '加油金额（元）',
          type: 'variable',
          calculate: row => {
            const price = parseFloat(row.price) || 0
            const qty = parseFloat(row.jyss) || 0
            return (price * qty).toFixed(2)
          }
        },
        { prop: 'beizhu', label: '备注' }
      ],
      formFields: {
        id: null,
        date: null,
        driver: '',
        car_number: '',
        miles: '',
        youpin: '',
        price: '',
        jyss: '',
        money: '',
        beizhu: ''
      }
    }
  },
  mounted() {
    axios.get('/api/data/cq1').then(res => {
      this.tableData = res.data || []
    })
  },
  beforeDestroy() {
    axios.post('/api/save/cq1', this.tableData, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      console.log('保存成功')
    }).catch(err => {
      console.error('保存失败', err)
    })
  }
}
</script>
