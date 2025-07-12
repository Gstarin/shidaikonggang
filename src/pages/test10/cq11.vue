<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>人员管理</h5>" customHeader settings close>
          <xlsx-table
            :columns="columns"
            :table-data.sync="tableData"
            :form-fields="formFields"
            storage-key="staff_manager"
            :custom-filter1="monthFilter"
          >
            <template #custom-filter1>
              <div class="d-flex align-items-center mr-3 mb-2">
                <el-date-picker
                  v-model="selectMonth"
                  type="month"
                  placeholder="按离职日期筛选"
                  value-format="yyyy-MM"
                  style="max-width: 200px"
                ></el-date-picker>
              </div>
            </template>
          </xlsx-table>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import XlsxTable from '@/components/Template/xlsxTable.vue'

export default {
  name: 'StaffManager',
  components: {
    Widget,
    XlsxTable
  },
  data() {
    return {
      selectMonth: null,
      tableData: [],
      columns: [
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
    monthFilter(row) {
      if (!this.selectMonth || !row.date2) return true
      const d = new Date(row.date2)
      const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return formatted === this.selectMonth
    }
  }
}
</script>
