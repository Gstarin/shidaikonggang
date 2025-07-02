<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>瑞景园林</b-breadcrumb-item>
      <b-breadcrumb-item active>人员管理</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">人员管理</h1>
    <b-row>
      <b-col>
        <Widget title="<h5>人员<span class='fw-semi-bold'>管理</span></h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="staffList"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'renyuan'"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-table>
              <el-table style="display: none;width: 100%" id="StaffTable">
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
  name: 'StaffManagement',
  components: { Widget, TableTemplate },
  data() {
    return {
      staffList: [
          { workType: "三吨", id: "1", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "三吨", id: "2", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "三吨", id: "3", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "三吨", id: "4", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "三吨", id: "5", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "八吨", id: "1", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "八吨", id: "2", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "八吨", id: "3", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "八吨", id: "4", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "八吨", id: "5", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "大勾臂", id: "1", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "大勾臂", id: "2", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "大勾臂", id: "3", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "大勾臂", id: "4", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "大勾臂", id: "5", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "小勾臂", id: "1", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" },
          { workType: "小水车", id: "1", name: "", phone: "", hasInsurance: "", isDispatch: "", workArea: "", vehicleType: "", vehicleNumber: "", note: "" }
        ],
      tableColumns: [
        { prop: 'workType', label: '工作性质', width: 120, editable: true },
        { prop: 'position', label: '岗位', width: 100, editable: true },
        { prop: 'id', label: '序号', width: 80, editable: true },
        { prop: 'name', label: '姓名', width: 100, editable: true },
        { prop: 'gender', label: '性别', width: 80, 
          options: [
            { label: '男', value: '男' },
            { label: '女', value: '女' }
          ],
          editable: true 
        },
        { prop: 'idNumber', label: '身份证号', width: 180, editable: true },
        { prop: 'phone', label: '联系电话', width: 120, editable: true },
        { prop: 'responsibility', label: '岗位职责', width: 150, editable: true },
        { prop: 'hasInsurance', label: '是否缴纳保险', width: 120, 
          options: [
            { label: '是', value: '是' },
            { label: '否', value: '否' }
          ],
          editable: true 
        },
        { prop: 'isDispatch', label: '是否劳务派遣', width: 120, 
          options: [
            { label: '是', value: '是' },
            { label: '否', value: '否' }
          ],
          editable: true 
        },
        { prop: 'workArea', label: '工作区域', width: 120, editable: true },
        { prop: 'vehicleType', label: '驾驶工作车类型', width: 150, editable: true },
        { prop: 'vehicleNumber', label: '工作车车号', width: 120, editable: true },
        { prop: 'note', label: '备注', width: 150, editable: true }
      ],
      formFields: {
        workType: '',
        position: '',
        id: '',
        name: '',
        gender: '',
        idNumber: '',
        phone: '',
        responsibility: '',
        hasInsurance: '',
        isDispatch: '',
        workArea: '',
        vehicleType: '',
        vehicleNumber: '',
        note: ''
      }
    }
  },
  methods: {
  
    updateTableData(newData) {
      this.staffList = newData
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.page-title {
  margin-bottom: 20px;
  color: #fff;
}
</style>