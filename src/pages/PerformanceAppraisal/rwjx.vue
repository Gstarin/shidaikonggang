<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>绩效考核</b-breadcrumb-item>
      <b-breadcrumb-item active>任务绩效</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>任务绩效</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'rwjx'"
            :apiEndpoint="'/api/data/rwjx'"
            @update:tableData="updateTableData"
            @row-click="handleRowClick"
          >
            <template v-slot:custom-filter1>
              <el-date-picker 
                v-model="selectMonth" 
                type="month" 
                placeholder="选择年月"    
                value-format="yyyy-MM"
                style="margin-right: 15px"
                @change="handleMonthChange"
              ></el-date-picker>
            </template>
            
            <template v-slot:custom-filter2>
              <el-select 
                v-model="selectedDepartment" 
                placeholder="选择部门" 
                style="width: 120px; margin-right: 15px;"
                clearable
              >
                <el-option
                  v-for="dept in availableDepartments"
                  :key="dept"
                  :label="dept"
                  :value="dept"
                ></el-option>
              </el-select>
            </template>
            
            <template v-slot:custom-table>
              <el-table style="display: none;width: 100%" id="PerformanceTable1">
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
  name: 'RwjxPerformance',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectMonth: '',
      selectedDepartment: '',
      tableData: [],
      path: '',
      formFields: {
        id: 0,
        bumen: '',
        time: '',
        xm: '',
        xmdy: '',
        name: '',
        signal: '',
        shixian: '',
        jindu: '',
        shifou: '',
        positive: '',
        objective: '',
        day: '',
        estimate: '',
        file: ''
      }
    }
  },
  computed: {
    tableColumns() {
      return [
        { prop: 'id', label: '序号', width: 80 },
        { prop: 'bumen', label: '部门', width: 120 },
        { prop: 'time', label: '日期', width: 120, type: 'date' },
        { prop: 'xm', label: '项目', width: 150 },
        { prop: 'xmdy', label: '项目定义', width: 200 },
        { prop: 'name', label: '直接负责人', width: 120 },
        { prop: 'signal', label: '完成标志', width: 150 },
        { prop: 'shixian', label: '完成时限/频次', width: 150 },
        { prop: 'jindu', label: '当前完成进度', width: 120 },
        { prop: 'shifou', label: '完成状态', width: 180 },
        { 
          label: '未完成原因', 
          children: [
            { prop: 'positive', label: '主观原因', width: 150 },
            { prop: 'objective', label: '客观原因', width: 150 }
          ]
        },
        { 
          label: '延期完成情况',
          children: [
            { prop: 'day', label: '延期天数', width: 100, type: 'number' },
            { prop: 'estimate', label: '预计完成日期', width: 120, type: 'date' }
          ]
        },
        { 
          prop: 'file', 
          label: '完成结果证明材料', 
          width: 180,
          type: 'file',
          actions: [
            {
              label: '查看',
              variant: 'success',
              size: 'sm',
              handler: (row) => this.viewFile(row)
            }
          ]
        }
      ]
    },
    
    availableDepartments() {
      const depts = new Set(this.tableData.map(item => item.bumen).filter(Boolean))
      return Array.from(depts).sort()
    },
    
    customFilter1() {
      return item => !this.selectMonth || item.time.includes(this.selectMonth)
    },
    
    customFilter2() {
      return item => !this.selectedDepartment || item.bumen === this.selectedDepartment
    }
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData
    },
    
    handleMonthChange() {
      if (this.selectMonth) {
        this.path = this.selectMonth
        this.loadData()
      }
    },
    
    async loadData() {
      try {
        const response = await axios.post('/api/data/rwjx', { iddd: this.path })
        this.tableData = Array.isArray(response.data) ? response.data : []
      } catch (error) {
        console.error('Error fetching data:', error)
        this.tableData = []
      }
    },
    
    handleRowClick(row) {
      this.$router.push({
        path: "/app/PerformanceAppraisal/zhengming",
        query: { name: row.xm }
      })
    },
    
    viewFile(row) {
      if (row.file) {
        window.open(row.file.url, '_blank')
      } else {
        this.$message.warning('没有可查看的文件')
      }
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>
