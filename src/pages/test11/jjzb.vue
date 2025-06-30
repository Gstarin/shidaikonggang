<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>博泰酒店</b-breadcrumb-item>
      <b-breadcrumb-item active>经济指标</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">经济指标</h1>
    <b-row>
      <b-col>
        <Widget title="<h5>指标<span class='fw-semi-bold'>分析</span></h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="projects"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'jjzb'"
            :showExcelHandler="false"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-table>
              <el-table style="display: none;width: 100%" id="JjzbTable">
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
  name: 'JjzbAnalysis',
  components: { Widget, TableTemplate },
  data() {
    return {
      projects: [],
      tableColumns: [
        { prop: 'id', label: '序号', width: 300 },
        { 
          prop: 'date', 
          label: '日期', 
          width: 500,
          editable: true
        },
        { 
          prop: 'actions', 
          label: '操作', 
          width: 300,
          type: 'actions',
          actions: [
            {
              label: '查看',
              variant: 'success',
              size: 'sm',
              handler: (row) => this.edit(row.date)
            }
          ]
        }
      ],
      formFields: {
        id: 0,
        date: '',
        selected: false
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      axios.get('/api/data/jjzb').then(response => {
        this.projects = response.data
      }).catch(error => {
        console.error('Error fetching data:', error)
      })
    },
    
    updateTableData(newData) {
      this.projects = newData
    },
    
    edit(date) {
      this.$router.push("/app/test11/jiage?date=" + date)
    }
  }
}
</script>