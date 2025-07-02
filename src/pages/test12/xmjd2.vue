<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>项目</b-breadcrumb-item>
      <b-breadcrumb-item active>项目节点 - {{ projectName }}</b-breadcrumb-item>
    </b-breadcrumb>
    
    <b-row>
      <b-col>
        <Widget title="<h5>项目节点</h5>" customHeader settings close>
          <TableTemplate
            ref="logTable"
            :tableData="logData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="`xmjd_logs_${projectId}`"
            :apiEndpoint="'/api/project/logs'"
            @update:tableData="updateLogData"
          >
            <template v-slot:custom-filter1>
              <b-form-input
                v-model="projectName"
                readonly
                class="mr-3"
                style="width: 200px;"
                placeholder="当前项目"
              ></b-form-input>
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
  name: 'ProjectLogs',
  components: { Widget, TableTemplate },
  data() {
    return {
      projectId: '',
      projectName: '',
      logData: [],
      tableColumns: [
        { prop: 'xmmc', label: '项目名称', width: 180 },
        { 
          prop: 'time', 
          label: '时间', 
          width: 100,
          type: 'date',
          editable: true
        },
        { 
          prop: 'jindu', 
          label: '完成进度', 
          width: 120,
          editable: true,
 
        },
        { 
          prop: 'name', 
          label: '负责人', 
          width: 120,
          editable: true
        },
        { 
          prop: 'beizhu', 
          label: '备注', 
          width: 120,
          editable: true
        },
        { 
          prop: 'pizhu', 
          label: '留言批注', 
          editable: true,
        }
      ],
      formFields: {
        xmmc: '',
        time: new Date().toISOString().split('T')[0],
        jindu: '0%',
        name: '',
        beizhu: '',
        pizhu: ''
      }
    }
  },

  methods: {

  }
}
</script>
