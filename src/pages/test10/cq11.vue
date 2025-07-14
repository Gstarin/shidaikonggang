<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>人员管理</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'cq11'"
            :showExcelHandler="true"
            :customFilter1="filterByYearMonth"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-filter1>
              <el-date-picker
                v-model="selectedYearMonth"
                type="month"
                placeholder="选择年月"
                value-format="yyyy-MM"
                :clearable="true"
                @change="handleMonthChange"
                style="width: 150px; margin-right: 15px;"
              />
              <el-button 
                v-if="selectedYearMonth"
                @click="clearMonthFilter"
                size="small"
                icon="el-icon-close"
                circle
              />
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
  name: 'StaffManager',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectMonth: null,
      tableData: [],
      tableColumns: [
        { prop: 'id', label: '序号', type: 'number' },
        { prop: 'name', label: '姓名' },
        { prop: 'hetong', label: '合同编号' },
        { prop: 'date1', label: '入职日期', type: 'date' },
        { prop: 'date2', label: '离职日期', type: 'date' },
        { prop: 'states', label: '状态' },
        { prop: 'pos', label: '职位' },
        { prop: 'id_number', label: '身份证号' },
        { prop: 'sex', label: '性别' },
        { prop: 'age', label: '年龄', type: 'number' },
        { prop: 'card', label: '银行卡号' },
        { prop: 'address', label: '住址' },
        { prop: 'lxfs', label: '联系方式' },
        { prop: 'person', label: '紧急联系人' },
        { prop: 'beizhu', label: '备注' }
      ],
      formFields: {
        id: null,
        name: '',
        hetong: '',
        date1: null,
        date2: null,
        states: '',
        pos: '',
        id_number: '',
        sex: '',
        age: '',
        card: '',
        address: '',
        lxfs: '',
        person: '',
        beizhu: ''
      }
    }
  },

  methods: {
    updateTableData(newData) {
      this.tableData = newData
      // 重新编号
      this.tableData.forEach((item, index) => {
        item.id = index + 1
      })
    },
  
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true
      
      if (!item.date1) return false
      
      const date = new Date(item.date1)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      return `${year}-${month}` === this.selectedYearMonth
    },
    
    handleMonthChange() {
      // 过滤逻辑由模板自动处理
    },
    
    clearMonthFilter() {
      this.selectedYearMonth = ''
    }
  }
}
</script>