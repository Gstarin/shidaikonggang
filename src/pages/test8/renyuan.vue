<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>瑞景园林</b-breadcrumb-item>
      <b-breadcrumb-item active>车辆管理</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">车辆管理</h1>
    <b-row>
      <b-col>
        <Widget title="<h5>车辆<span class='fw-semi-bold'>管理</span></h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="vehicles"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'cheliang'"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-table>
              <el-table style="display: none;width: 100%" id="CheliangTable">
                <el-table-column 
                  v-for="column in tableColumns" 
                  :key="column.prop"
                  :prop="column.prop" 
                  :label="column.label" 
                ></el-table-column>
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
      vehicles: [
        { cheliang: "三吨", id: "1", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "三吨", id: "2", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "三吨", id: "3", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "三吨", id: "4", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "三吨", id: "5", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "八吨", id: "1", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "八吨", id: "2", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "八吨", id: "3", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "八吨", id: "4", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "八吨", id: "5", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "大勾臂", id: "1", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "大勾臂", id: "2", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "大勾臂", id: "3", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "大勾臂", id: "4", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "大勾臂", id: "5", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "小勾臂", id: "1", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
        { cheliang: "小水车", id: "1", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", selected: false },
      ],
      tableColumns: [
        { prop: 'cheliang', label: '车辆类型', editable: true },
        { prop: 'id', label: '序号', editable: true },
        { prop: 'number', label: '车牌号', editable: true },
        { prop: 'driver', label: '驾驶员', editable: true },
        { prop: 'phone', label: '联系电话', editable: true },
        { prop: 'xiangzhen', label: '所属乡镇', editable: true },
        { prop: 'quyu', label: '负责区域', editable: true },
        { prop: 'beizhu', label: '备注', editable: true }
      ],
      formFields: {
        cheliang: '',
        id: '',
        number: '',
        driver: '',
        phone: '',
        xiangzhen: '',
        quyu: '',
        beizhu: '',
        selected: false
      }
    }
  },

  methods: {
    
    updateTableData(newData) {
      this.vehicles = newData
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.white-input .b-form-input {
  background-color: white !important; 
  color: #01010d !important;
}
</style>