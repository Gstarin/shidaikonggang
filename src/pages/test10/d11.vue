<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>投资发展部</b-breadcrumb-item>
      <b-breadcrumb-item active>业主报账</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>业主报账</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'ownerReimbursement'"
            :showExcelHandler="true"
            :customFilter1="filterByDateRange"
            @update:tableData="updateTableData"
          >
            <!-- 自定义筛选插槽 - 日期范围筛选 -->
            <template v-slot:custom-filter1>
              <el-date-picker 
                v-model="startDate" 
                type="date" 
                placeholder="起始时间" 
                value-format="yyyy-MM-dd"
                style="margin-right: 15px"
              ></el-date-picker>
              <el-date-picker 
                v-model="endDate" 
                type="date" 
                placeholder="结束时间" 
                value-format="yyyy-MM-dd"
                style="margin-right: 15px"
              ></el-date-picker>
            </template>
            
            <!-- 自定义表格模板 -->
            <template v-slot:custom-table>
              <el-table style="display: none;width: 100%" id="DisburseTable1">
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
import * as XLSX from 'xlsx/xlsx.mjs'
import { export_excel } from '@/utils/exportExcel.js'

export default {
  name: 'OwnerReimbursement',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      startDate: null,
      endDate: null,
      // 表格列配置
      tableColumns: [
        { prop: 'id', label: '序号', width: 55 },
        { 
          prop: 'date', 
          label: '报账时间', 
          width: 180, 
          type: 'date',
          format: 'yyyy-MM-dd'
        },
        { 
          prop: 'jkxm', 
          label: '业主身份证信息', 
          width: 180,
          editable: true
        },
        { 
          prop: 'money', 
          label: '报账项目', 
          width: 150,
          editable: true
        },
        { 
          prop: 'name', 
          label: '报账金额', 
          width: 150,
          editable: true
        },
        { 
          prop: 'beizhu', 
          label: '备注',
          editable: true
        }
      ],
      // 表单字段配置
      formFields: {
        id: 0,
        date: '',
        jkxm: '',
        money: '',
        name: '',
        beizhu: ''
      }
    }
  },
  methods: {
    updateTableData(newData) {
      // 更新ID
      newData.forEach((item, index) => {
        item.id = index + 1
      })
      this.tableData = newData
    },
    
    filterByDateRange(item) {
      if (!this.startDate && !this.endDate) return true
      
      const itemDate = item.date ? new Date(item.date).getTime() : null
      if (!itemDate) return false
      
      const startTime = this.startDate ? new Date(this.startDate).getTime() : 0
      const endTime = this.endDate ? new Date(this.endDate).getTime() : Infinity
      
      return itemDate >= startTime && itemDate <= endTime
    },
  }
}
</script>

