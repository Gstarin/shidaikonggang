<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>瑞景园林</b-breadcrumb-item>
      <b-breadcrumb-item active>合同档案</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>合同档案</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'htda'"
            :showExcelHandler="true"
            @update:tableData="updateTableData"
            @save-success="handleSaveSuccess"
            @load-success="handleLoadSuccess"
          >
            <template v-slot:custom-table>
              <el-table style="display: none;width: 100%" id="HtdaTable">
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
import Widget from '@/components/Widget/Widget';
import TableTemplate from '@/components/Template/xlsxTable'
import axios from '@/utils/axios.js';

export default {
  name: 'Htda',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      tableColumns: [
        { prop: 'htmc', label: '合同名称', width: 120 },
        { prop: 'xgdw', label: '相关单位', width: 180 },
        { prop: 'begin', label: '签订日期', width: 120, type: 'date' },
        { prop: 'end', label: '结束日期', width: 120, type: 'date' },
        { 
          prop: 'money', 
          label: '合同金额', 
          width: 120,
          type: 'number',
          formatter: (row) => this.parsePrice(row.money)
        },
        { 
          prop: 'pdf', 
          label: 'PDF材料', 
          width: 200,
          type: 'file',
          fileType: 'pdf',
          accept: 'application/pdf'
        },
        { prop: 'name', label: '负责人', width: 120 }
      ],
      formFields: {
        htmc: "",
        xgdw: "",
        begin: '',
        end: "",
        money: "",
        pdf: null,
        name: ""
      },
      project_id: 0
    }
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData
    },

    
    parsePrice(price) {
      if (price === undefined || price === null) return ''
      const priceNum = typeof price === 'string' ? parseFloat(price) : price
      const priceStr = priceNum.toFixed(2)
      return priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.tables-basic {
  .table-container {
    background-color: transparent;
  }
  
  ::v-deep .el-table {
    background-color: transparent !important;
    color: #9f9fad !important;
    
    .cell {
      color: #9f9fad;
    }
  }
}
</style>