
<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>投资发展部</b-breadcrumb-item>
      <b-breadcrumb-item active>项目管理</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>项目管理</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :units="units"
            :formFields="formFields"
            :storageKey="'touzifazhanbu_xiangmuguanli_Data'"
            :showExcelHandler="false"
            @update:tableData="updateTableData"
            @row-click="goToDetailPage"
          />
          
          <!-- 编辑对话框 -->
          <el-dialog  
            title="修改值"  
            :visible.sync="dialogVisible1"  
            width="30%"  
            @close="dialogVisible1 = false"  
          >  
            <el-input v-model="editingValue" placeholder="请输入新值"></el-input>  
            <span slot="footer" class="dialog-footer">  
              <el-button @click="dialogVisible1 = false">取 消</el-button>  
              <el-button type="primary" @click="updateValue">确 定</el-button>  
            </span>  
          </el-dialog>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import axios from '@/utils/axios.js'
import TableTemplate from '@/components/Template/xlsxTable'
import FormDialog from '@/components/Template/FormDialog'

export default {
  name: 'jygl',
  components: { Widget, TableTemplate, FormDialog },
  data() {
    return {
      dialogVisible1: false,
      editingValue: '',
      editingRow: null,
      editingcolumn: null,
      tableData: [],
      // 表格列配置
      tableColumns: [
        { prop: 'xuhao', label: '序号', width: 100 },
        { prop: 'xiangmumingcheng', label: '项目名称', width: 300, slot: true },
        { prop: 'chuangjianriqi', label: '创建日期', width: 300 ,type:'date'},
        { prop: 'xiangmuzhuangtai', label: '项目状态', width: 300 },
      ],
      // 表单字段配置
      formFields: {
        xuhao: "",
        xiangmumingcheng: "",
        chuangjianriqi: "",
        xiangmuzhuangtai: "",
      }
    }
  },

  methods: {
    updateTableData(newData) {
      this.tableData = newData
    },
    goToDetailPage(row) {
      // 根据原程序中的路由跳转逻辑实现
      this.$router.push({
        path: "/app/tzfz/Project",
        query: {
          hetong: row.xiangmumingcheng
        }
      });
    },
    getDropdownOptions(field) {
      const options = new Set()
      this.tableData.forEach(item => {
        options.add(item[field])
      })
      return Array.from(options)
    },
    
  }
}
</script>
