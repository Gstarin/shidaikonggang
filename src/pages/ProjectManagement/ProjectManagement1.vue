<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>投资发展部</b-breadcrumb-item>
      <b-breadcrumb-item active>项目管理</b-breadcrumb-item>
    </b-breadcrumb>

    <b-row>
      <b-col>
        <Widget title="<h5>项目管理</h5>" customHeader settings close>
          <xlsx-table
            :columns="columns"
            :table-data.sync="tableData"
            :form-fields="formFields"
            :filters="filters"
            :clickable-columns="['htmc']"
            @cell-click="handleCellClick"
            storage-key="project_manage"
          />
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import XlsxTable from '@/components/Template/xlsxTable.vue'
import axios from '@/utils/axios.js'

export default {
  name: 'ProjectManage',
  components: { Widget, XlsxTable },
  data() {
    return {
      tableData: [],
      columns: [
        { prop: 'id', label: '序号', type: 'number' },
        { prop: 'htmc', label: '项目名称', click: true },
        { prop: 'date', label: '创建日期' },
        { prop: 'name', label: '项目状态' }
      ],
      formFields: {
        id: null,
        htmc: '',
        date: new Date().toISOString().slice(0, 10),
        name: ''
      },
      filters: [
        { type: 'input', label: '搜索状态', key: 'name' }
      ]
    }
  },
  mounted() {
    axios.get('/api/data/zlda')
      .then(res => {
        this.tableData = res.data.map((item, i) => ({
          ...item,
          id: i + 1
        }))
      }).catch(() => {
        this.tableData = []
      })
  },
  beforeDestroy() {
    if (this.tableData.length > 0) {
      axios.post('/api/save/zlda', this.tableData, {
        headers: { 'Content-Type': 'application/json' }
      }).then(() => {
        console.log('项目管理数据保存成功')
      }).catch(err => {
        console.error('项目管理保存失败', err)
      })
    }
  },
  methods: {
    handleCellClick({ row, column }) {
      if (column.property === 'htmc') {
        this.$router.push({
          path: '/app/ProjectManagement/Project',
          query: { id: row.htmc }
        })
      }
    }
  }
}
</script>
