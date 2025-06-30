<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>市政公司</b-breadcrumb-item>
      <b-breadcrumb-item active>支出信息</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>市政公司项目支出情况统计表</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :units="units"
            :formFields="formFields"
            :storageKey="'disburseData'"
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
  name: 'Disburse',
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
        { prop: 'xiangguandanwei', label: '相关单位', width: 100 },
        { prop: 'xiangmumingcheng', label: '项目名称', width: 180 },
        { prop: 'hetongmingcheng', label: '合同名称', width: 300, slot: true },
        { prop: 'hetongduifang', label: '合同相对人', width: 150 },
        { prop: 'hetongjine', label: '合同金额(万元)', width: 100, type: 'number' },
        { prop: 'jiesuanjine', label: '结算金额(万元)', width: 100, type: 'number' },
        { prop: 'xiangmujindu', label: '项目进度（百分比）', width: 100, type: 'number' },
        { prop: 'yingshoukuan', label: '项目产值', width: 100, type: 'number' },
        { prop: 'shishoukuan', label: '已开票', width: 100 },
        { prop: 'yifukuan', label: '已付款', width: 100 },
        { prop: 'yingfuweifu', label: '应付未付', width: 100 },
        { prop: 'guazhangjine', label: '挂账金额', width: 100 },
        { prop: 'beizhu', label: '备注', width: 200 }
      ],
      // 表单字段配置
      formFields: {
        xiangguandanwei: "",
        xiangmumingcheng: "",
        hetongmingcheng: "",
        hetongduifang: "",
        hetongjine: "",
        jiesuanjine: "",
        xiangmujindu: "",
        yingshoukuan: "",
        shishoukuan: "",
        yifukuan: "",
        yingfuweifu: "",
        guazhangjine: "",
        beizhu: ""
      }
    }
  },

  methods: {
    updateTableData(newData) {
      this.tableData = newData
    },
    goToDetailPage(row) {
      this.$router.push({ name: 'detail', params: { contract: row } })
    },
    getDropdownOptions(field) {
      const options = new Set()
      this.tableData.forEach(item => {
        options.add(item[field])
      })
      return Array.from(options)
    },
    // 以下方法可以移到 TableTemplate 中
    
  }
}
</script>
