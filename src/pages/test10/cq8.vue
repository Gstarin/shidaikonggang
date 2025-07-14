<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>其他费用</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'cq8'"
            :showExcelHandler="true"
            @update:tableData="updateTableData"
          >
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

export default {
  name: 'OtherExpenses',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      tableColumns: [
        { prop: 'id', label: '序号', width: 80 },
        { prop: 'name', label: '名称', width: 150 },
        { prop: 'price', label: '单价（元）', width: 120, type: 'number' },
        { prop: 'quantity', label: '数量', width: 120, type: 'number' },
        { prop: 'jine', label: '金额（元）', width: 150, type: 'number' },
        { prop: 'beizhu', label: '备注', width: 200 }
      ],
      formFields: {
        id: 0,
        name: '',
        price: 0,
        quantity: 0,
        jine: 0,
        beizhu: ''
      }
    }
  },
  methods: {
    updateTableData(newData) {
      // 更新ID序号
      newData.forEach((item, index) => {
        item.id = index + 1
      })
      this.tableData = newData
    }
  }
}
</script>
