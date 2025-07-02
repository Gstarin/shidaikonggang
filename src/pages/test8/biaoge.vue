<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5> 收入记录 </h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'test8'"
            :showExcelHandler="true"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-table>
              <el-table style="display: none;width: 100%" id="IncomeTable">
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
import axios from '@/utils/axios.js'

export default {
  name: 'IncomeRecord',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      formFields: {
        id: "",
        name1: "",
        begin: "",
        end: "",
        way: "",
        ...Array.from({length: 12}, (_, i) => i + 1).reduce((obj, month) => ({
          ...obj,
          [`yuji${month}`]: 0,
          [`shiji${month}`]: 0
        }), {})
      },
      tableColumns: [
        { 
          prop: 'id', 
          label: '序号', 
          width: 80,
          type: 'number'
        },
        { 
          prop: 'name1', 
          label: '合作客户', 
          width: 150,
          editable: true
        },
        { 
          prop: 'begin', 
          label: '开始时间', 
          width: 150,
          type: 'date'
        },
        { 
          prop: 'end', 
          label: '结束时间', 
          width: 150,
          type: 'date'
        },
        { 
          prop: 'way', 
          label: '结账方式', 
          width: 150,
          editable: true
        },
        // 动态生成12个月的列
        ...Array.from({length: 12}, (_, i) => i + 1).map(month => ({
          label: `${month}月份`,
          children: [
            {
              prop: `yuji${month}`,
              label: '预计收入',
              width: 100,
              type: 'number',
              calculate: (row) => parseFloat(row[`yuji${month}`]) || 0
            },
            {
              prop: `shiji${month}`,
              label: '实际收入',
              width: 100,
              type: 'number',
              calculate: (row) => parseFloat(row[`shiji${month}`]) || 0
            }
          ]
        })),
        { 
          prop: 'totalYuji', 
          label: '共计预计收入', 
          width: 150,
          type: 'variable',
          calculate: (row) => {
            return Array.from({length: 12}, (_, i) => i + 1)
              .reduce((sum, month) => sum + (parseFloat(row[`yuji${month}`]) || 0), 0)
              .toFixed(2)
          }
        },
        { 
          prop: 'totalShiji', 
          label: '共计实际收入', 
          width: 150,
          type: 'variable',
          calculate: (row) => {
            return Array.from({length: 12}, (_, i) => i + 1)
              .reduce((sum, month) => sum + (parseFloat(row[`shiji${month}`]) || 0), 0)
              .toFixed(2)
          }
        },
        { 
          prop: 'rate', 
          label: '达成率', 
          width: 150,
          type: 'variable',
          calculate: (row) => {
            const totalYuji = Array.from({length: 12}, (_, i) => i + 1)
              .reduce((sum, month) => sum + (parseFloat(row[`yuji${month}`]) || 0), 0)
            const totalShiji = Array.from({length: 12}, (_, i) => i + 1)
              .reduce((sum, month) => sum + (parseFloat(row[`shiji${month}`]) || 0), 0)
            return totalYuji ? ((totalShiji / totalYuji) * 100).toFixed(2) + '%' : '0.00%'
          }
        }
      ]
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      axios.get('/api/data/test8').then(response => {
        this.tableData = response.data.map((item, index) => ({
          ...item,
          id: (index + 1).toString()
        }))
      }).catch(error => {
        console.error('Error fetching data:', error)
      })
    },
    
    updateTableData(newData) {
      this.tableData = newData.map((item, index) => ({
        ...item,
        id: (index + 1).toString()
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.table-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
}

.table-footer {
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#table {
  ::v-deep .cell {
    color: white;
  }

  ::v-deep .el-table__header th {
    padding: 0;
    height: 50px;
    line-height: 50px;
  }

  ::v-deep .el-table__body tr,
  ::v-deep.el-table__body td {
    padding: 0;
    height: 50px;
    line-height: 50px;
  }

  ::v-deep .el-table {
    background-color: transparent !important;
    color: #9f9fad !important;
  }

  ::v-deep .el-table__expanded-cell {
    background-color: transparent !important;
  }

  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table td {
     background-color:rgb(48, 53, 59);
  }
}
</style>