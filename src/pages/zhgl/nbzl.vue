<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>综合管理部</b-breadcrumb-item>
      <b-breadcrumb-item active>集团内部资料</b-breadcrumb-item>
    </b-breadcrumb>

    <b-row>
      <b-col>
        <Widget title="<h5>内部资料</h5>" customHeader settings close>
          <xlsx-table
            :columns="columns"
            :table-data.sync="tableData"
            :form-fields="formFields"
            :filters="filters"
            :clickable-columns="['htmc']"
            @cell-click="handleCellClick"
            storage-key="internal_docs"
          />
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import XlsxTable from '@/components/Template/xlsxTable.vue'

export default {
  name: 'InternalDocs',
  components: { Widget, XlsxTable },
  data() {
    return {
      tableData: [],
      columns: [
        { prop: 'htmc', label: '项目名称', click: true },
        { prop: 'date', label: '创建时间' },
        { prop: 'name', label: '创建人' },
        { prop: 'category', label: '类别' }
      ],
      formFields: {
        htmc: '',
        date: new Date().toISOString().slice(0, 10),
        name: '',
        category: ''
      },
      filters: [
        { type: 'select', label: '类别', key: 'category', options: ['aaa', 'bbb', 'ccc'] },
        { type: 'input', label: '搜索', key: 'category' }
      ]
    }
  },
  methods: {
    handleCellClick({ row, column }) {
      if (column.property === 'htmc') {
        this.$router.push({
          path: '/app/zhgl/nbzhiliao',
          query: { hetong: row.htmc }
        })
      }
    }
  }
}
</script>
