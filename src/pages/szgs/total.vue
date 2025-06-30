<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>市政公司</b-breadcrumb-item>
      <b-breadcrumb-item active>收支汇总表</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>市政公司项目收支情况统计表</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :units="units"
            :formFields="formFields"
            :storageKey="'summaryData'"
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
import TableTemplate from '@/components/Template/xlsxTable'

export default {
  name: 'Summary',
  components: { Widget, TableTemplate },
  data() {
    return {
      dialogVisible1: false,
      editingValue: '',
      editingRow: null,
      editingcolumn: null,
      tableData: [],
      // 表格列配置
      tableColumns: [
        { prop: 'xiangmumingcheng', label: '项目名称', width: 200 },
        { prop: 'xiangguandanwei', label: '建设单位', width: 150 },
        { prop: 'yingshoukuan', label: '应收款(万元)', width: 150, type: 'number' },
        { prop: 'shishoukuan', label: '实收款(万元)', width: 100, type: 'number' },
        { prop: 'yingshouweishou', label: '应收未收(万元)', width: 100, type: 'number' },
        { prop: 'yingfukuan', label: '应付款(万元)', width: 100, type: 'number' },
        { prop: 'shifukuan', label: '实付款(万元)', width: 100, type: 'number' },
        { prop: 'yingfuweifu', label: '应付未付(万元)', width: 100, type: 'number' },
        { prop: 'beizhu', label: '备注', width: 200 }
      ],
      // 表单字段配置
      formFields: {
        xiangmumingcheng: "",
        xiangguandanwei: "",
        yingshoukuan: "",
        shishoukuan: "",
        yingshouweishou: "",
        yingfukuan: "",
        shifukuan: "",
        yingfuweifu: "",
        beizhu: ""
      },
      department: ["市政公司", "博泰酒店", "房地产", "建设统筹部", "时代空港", "青清水务", "瑞景园林", "首钢", "投资发展部", "物业公司"]
    }
  },

  methods: {
    updateTableData(newData) {
      this.tableData = newData
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