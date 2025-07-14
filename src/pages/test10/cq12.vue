<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>车辆管理</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'vehicleManagement'"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-table>
              <el-table style="display: none;width: 100%" id="DisburseTable1">
                <el-table-column prop="id" label="序号" width="55"></el-table-column>
                <el-table-column prop="car" label="车辆类型"></el-table-column>
                <el-table-column prop="car_id" label="车牌号"></el-table-column>
                <el-table-column prop="driver" label="驾驶员"></el-table-column>
                <el-table-column prop="phone" label="联系电话"></el-table-column>
                <el-table-column prop="beizhu" label="备注"></el-table-column>
              </el-table>
            </template>
          </TableTemplate>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import TableTemplate from '@/components/Template/xlsxTable'
import axios from '@/utils/axios.js'

export default {
  name: 'VehicleManagement',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      tableColumns: [
        { prop: 'id', label: '序号', width: 55 },
        { prop: 'car', label: '车辆类型', editable: true },
        { prop: 'car_id', label: '车牌号', editable: true },
        { prop: 'driver', label: '驾驶员', editable: true },
        { prop: 'phone', label: '联系电话', editable: true },
        { prop: 'beizhu', label: '备注', editable: true }
      ],
      formFields: {
        id: 0,
        car: '',
        car_id: '',
        driver: '',
        phone: '',
        beizhu: ''
      }
    }
  },
  methods: {
    
    updateTableData(newData) {
      // 确保ID连续
      this.tableData = newData.map((item, index) => ({
        ...item,
        id: index + 1
      }))
    }
  }
}
</script>
