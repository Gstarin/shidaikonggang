<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>其他费用</b-breadcrumb-item>
      <b-breadcrumb-item active>其他费用</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>费用明细</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="storageKey"
            @update:tableData="updateTableData"
          />
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
  name: 'OtherExpenses',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      tableColumns: [
        { prop: 'xmmc', label: '费用类型', width: 200 },
        { prop: 'time', label: '金额', width: 200, type: 'number' }
      ],
      formFields: {
        xmmc: '',
        time: 0
      },
      parentMonth: '' // 从父页面获取的月度参数
    }
  },
  computed: {
    storageKey() {
      // 根据父页面的月度参数前7个字符生成storageKey
      return `otherExpenses_${this.parentMonth.substring(0, 7)}`
    }
  },
  mounted() {
    // 从路由参数获取父页面的月度参数
    this.parentMonth = this.$route.query.name || ''
    console.log('Parent month:', this.parentMonth)
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData
    },
    
  },
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';
</style>