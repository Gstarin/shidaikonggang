<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>生物质电厂</b-breadcrumb-item>
      <b-breadcrumb-item active>合同档案</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>合同档案</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'contractArchive'"
            @update:tableData="updateTableData"
            @row-click="goToDetailPage"
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
  name: 'ContractArchive',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      classs: ["aaa", "bbb", "ccc"],
      // 表格列配置
      tableColumns: [
        { prop: 'htmc', label: '合同名称', width: 100, slot: true },
        { prop: 'date', label: '创建时间', width: 200, type:'date' },
        { prop: 'name', label: '创建人', width: 200 },
        { prop: 'category', label: '类别' },
        { prop: 'fuijian', label: '附件', type: 'file',width: 250}
      ],
      // 表单字段配置
      formFields: {
        date: new Date().toISOString().slice(0, 10),
        name: '',
        htmc: '',
        category: '',
        fuijian: null
      },
      project_id: 7
    }
  },
  beforeDestroy() {
    this.$refs.tableTemplate.silentsave()
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData
    },
    goToDetailPage(row) {
      this.$router.push({
        path: "/app/tzfz/hetong?htmc=" + row.htmc,
        query: {
          hetong: row.htmc
        }
      })
    },
    
  }
}
</script>
  
  <style lang="scss" scoped>
  @import '../../styles/app';
  
  .table-header {
    width: 50%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;
  }
  
  .table-footer {
    // background-color: red;
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  #aaa :hover{
    cursor: pointer;
  }
  
  #table {
  
    //background-color: red;
    // 表格文字间距、颜色
    ::v-deep .cell {
        // padding: 0;
        color: #9f9fad;
    }
  
    // 表头高度
    ::v-deep .el-table__header th {
        padding: 0;
        height: 50px;
        line-height: 50px;
  
    }
  
    ::v-deep .el-table__body tr,
    ::v-deep.el-table__body td {
        padding: 5px 0;
        height: 50px;
        line-height: 50px;
    }
  
    ::v-deep .el-table {
        background-color: transparent !important;
        color: #9f9fad !important;
    }
  
    ::v-deep .el-table__expanded-cell {
        background-color: transparent !important;
    }
  
    // 透明背景
    ::v-deep .el-table th,
    ::v-deep .el-table tr,
    ::v-deep .el-table td {
        background-color: transparent;
    }
  
    // 下划线改成黑色
    // ::v-deep .el-table td,
    // ::v-deep .el-table th.is-leaf {
    //   border-bottom: 1px solid #000;
    // }
  
    // ::v-deep .el-table::before {
    //   //去掉最下面的那一条线
    //   height: 0px;
    // }
  
  
  }
  </style>