<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>房地产公司</b-breadcrumb-item>
      <b-breadcrumb-item active>档案资料管理系统</b-breadcrumb-item>
    </b-breadcrumb>
    
    <b-row>
      <b-col>
        <Widget title="<h5>档案资料</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'dazl'"
            :showExcelHandler="false"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-table>
              <el-table style="display: none;width: 100%" id="DazlTable">
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
  name: 'DazlManagement',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      tableColumns: [
        { prop: 'id', label: '编号', width: 80 },
        { prop: 'material', label: '材料名称', width: 180 },
        { prop: 'borrow', label: '借出时间', width: 100 },
        { prop: 'return', label: '归还时间' },
        { prop: 'name', label: '借阅人' },
        { prop: 'status', label: '状态' },
        { 
          prop: 'fuijian', 
          label: '附件',
          type: 'file',
        }
      ],
      formFields: {
        id: 0,
        material: '',
        borrow: '',
        return: '',
        name: '',
        status: '',
        fuijian: null
      },
      project_id: 1
    }
  },

  methods: {
    
    updateTableData(newData) {
      // 确保ID连续
      this.tableData = newData.map((item, index) => ({
        ...item,
        id: index + 1
      }))
    },
    
  }
}
</script>
