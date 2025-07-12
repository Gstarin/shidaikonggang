<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>车辆管理</h5>" customHeader settings close>
          <xlsx-table
            :columns="columns"
            :table-data.sync="tableData"
            :form-fields="formFields"
            storage-key="vehicle_manager"
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
  name: 'VehicleManager',
  components: {
    Widget,
    XlsxTable
  },
  data() {
    return {
      tableData: [],
      columns: [
        { prop: 'id', label: '序号', type: 'number' },
        { prop: 'car', label: '车辆类型' },
        { prop: 'car_id', label: '车牌号' },
        { prop: 'driver', label: '驾驶员' },
        { prop: 'phone', label: '联系电话' },
        { prop: 'beizhu', label: '备注' }
      ],
      formFields: {
        id: null,
        car: '',
        car_id: '',
        driver: '',
        phone: '',
        beizhu: ''
      }
    }
  }
}
</script>
