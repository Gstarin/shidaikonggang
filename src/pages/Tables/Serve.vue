<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>成本中心</b-breadcrumb-item>
      <b-breadcrumb-item active>咨询服务类</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>咨询服务价格库</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="items"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'consultingServices'"
            @update:tableData="updateTableData"
            @save-success="handleSaveSuccess"
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
  name: 'ConsultingServices',
  components: { Widget, TableTemplate },
  data() {
    return {
      items: [],
      project_id: 4,
      // 表格列配置
      tableColumns: [
        { prop: 'name', label: '项目名称', width: 200 },
        { prop: 'class', label: '费用类别', width: 150 },
        { 
          prop: 'contract', 
          label: '合同', 
          width: 250,
          type: 'file',
          accept: '.pdf,.docx'
        },
        { prop: 'num', label: '合同金额(元)', width: 150, type: 'number' },
        { prop: 'institution', label: '服务单位', width: 200 },
        { prop: 'agent', label: '经办人', width: 150 }
      ],
      // 表单字段配置
      formFields: {
        name: '',
        class: '',
        contract: null,
        num: '',
        institution: '',
        agent: ''
      }
    }
  },
  methods: {
    updateTableData(newData) {
      this.items = newData
    },
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
    color: #9f9fad;
  }

  ::v-deep .el-table__header th {
    padding: 0;
    height: 50px;
    line-height: 50px;
  }

  ::v-deep .el-table__body tr,
  ::v-deep .el-table__body td {
    padding: 5px 0;
    height: 50px;
    line-height: 50px;
  }

  ::v-deep .el-table {
    background-color: transparent !important;
  }

  ::v-deep .el-table__expanded-cell {
    background-color: transparent !important;
  }

  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table td {
    background-color: transparent;
  }
  
  .file-cell {
    display: flex;
    flex-direction: column;
    padding: 8px 0;
    
    .uploaded-files {
      margin-bottom: 8px;
      word-break: break-all;
    }
    
    button {
      margin: 2px 0;
      width: 100%;
    }
  }
}
</style>