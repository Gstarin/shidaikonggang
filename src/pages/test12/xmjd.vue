<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>项目管理</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">项目管理</h1>
    <b-row>
      <b-col>
        <Widget title="<h5>项目<span class='fw-semi-bold'>列表</span></h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="projects"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'xmjd'"
            :apiEndpoint="'/api/data/xmjd'"
            @update:tableData="updateTableData"
            @row-click="handleRowClick"
          >
            <template v-slot:custom-filter1>
              <!-- 可以在这里添加自定义过滤器 -->
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
  name: 'XmjdManagement',
  components: { Widget, TableTemplate },
  data() {
    return {
      projects: [],
      tableColumns: [
        { prop: 'id', label: '序号', width: 80 },
        { 
          prop: 'name', 
          label: '项目名称', 
          width: 200,
          editable: true
        },
        { 
          prop: 'date', 
          label: '创建日期', 
          width: 150,
          type: 'date',
          editable: true
        },
        { 
          prop: 'status', 
          label: '项目状态', 
          width: 150,
          editable: true,
          options: [
            { label: '进行中', value: '进行中' },
            { label: '已完成', value: '已完成' },
            { label: '已暂停', value: '已暂停' }
          ]
        },
        { 
          prop: 'actions', 
          label: '操作', 
          width: 150,
          type: 'actions',
          actions: [
            {
              label: '查看日志',
              variant: 'success',
              size: 'sm',
              handler: (row) => this.viewProjectLog(row)
            }
          ]
        }
      ],
      formFields: {
        id: 0,
        name: '',
        date: new Date().toISOString().split('T')[0],
        status: '进行中',
        log: [],
        selected: false
      }
    }
  },

  methods: {

    updateTableData(newData) {
      this.projects = newData.map((item, index) => ({
        ...item,
        id: index
      }))
    },
    
    viewProjectLog(row) {
      this.$router.push({
        path: "/app/test12/xmjd2",
        query: { name: row.name }
      })
    },
    
    handleRowClick(row) {
      // 可以在这里处理行点击事件
      console.log('Row clicked:', row)
    }
  }
}
</script>
