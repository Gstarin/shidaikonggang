<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>绩效考核</b-breadcrumb-item>
      <b-breadcrumb-item active>个人绩效汇总</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>个人绩效汇总</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'performanceData'"
            :customFilter1="customFilter11"
            :customFilter2="customFilter22"
            :customFilter3="sortedData"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-filter1>
              <el-select v-model="selectedYear" placeholder="选择年份" style="width: 120px; margin-right: 15px;">
                <el-option v-for="year in years" :key="year" :label="year === 'all' ? '全部' : year" :value="year"></el-option>
              </el-select>
            </template>
            
            <template v-slot:custom-filter2>
              <el-select v-model="selectedMonth" placeholder="选择月份" style="width: 120px; margin-right: 15px;">
                <el-option v-for="month in months" :key="month" :label="month === 'all' ? '全部' : month" :value="month"></el-option>
              </el-select>
            </template>
            
            <!-- 添加排序按钮 -->
            <template v-slot:custom-filter3>
              <b-button 
                variant="success" 
                class="mr-3 mb-2" 
                size="sm" 
                @click="sortByScore"
                style="margin-left: 10px;"
              >
                排序
              </b-button>
            </template>
          </TableTemplate>
          
          <!-- 编辑对话框 -->
          <el-dialog  
            title="修改值"  
            :visible.sync="dialogVisible"  
            width="30%"  
            @close="dialogVisible = false"  
          >  
            <el-input v-model="editingValue" placeholder="请输入新值" @keydown.enter="updateValue"></el-input>  
            <span slot="footer" class="dialog-footer">  
              <el-button @click="dialogVisible = false">取 消</el-button>  
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
  name: 'Performance',
  components: { Widget, TableTemplate },
  data() {
    return {
      dialogVisible: false,
      editingValue: '',
      editingRow: null,
      editingcolumn: null,
      selectedYear: 'all',
      selectedMonth: 'all',
      years: ['all'],
      months: ['all', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      tableData: [],
      // 表格列配置
      tableColumns: [
        { 
          prop: 'date', 
          label: '日期', 
          width: 180,
          type: 'date'
        },
        { 
          prop: 'bumen', 
          label: '部门/子公司', 
          width: 160 
        },
        { 
          prop: 'xingming', 
          label: '姓名', 
          width: 120 
        },
        { 
          prop: 'zongfen', 
          label: '总分', 
          type: 'variable',
          calculate: (row) => this.calculateTotal(row)
        },
        { 
          prop: 'zongfenNoBonus', 
          label: '总分（不含加分项）', 
          type: 'variable',
          calculate: (row) => this.calculateTotalNoBonus(row)
        },
        { 
          prop: 'KPI', 
          label: 'KPI指标评分', 
          width: 120,
          type: 'number'
        },
        { 
          prop: 'koufen', 
          label: '负责人管理扣分', 
          width: 120,
          type: 'number'
        },
        { 
          prop: 'B1', 
          label: 'B 加分\n受到集团或上级通报表扬\n（范围:1-20分）', 
          width: 180,
          type: 'number'
        },
        { 
          prop: 'B1beizhu', 
          label: '备注' 
        },
        { 
          prop: 'B2', 
          label: 'B 加分\n除法定工作时间外，从事外业工作时间较长\n（范围:1-30分）', 
          width: 200,
          type: 'number'
        },
        { 
          prop: 'B2beizhu', 
          label: '备注' 
        },
        { 
          prop: 'B11', 
          label: 'B 减分\n被通报或批评，所负责工作，进度缓慢或严重影响公司形象\n（视具体情况而定）', 
          width: 240,
          type: 'number'
        },
        { 
          prop: 'B11beizhu', 
          label: '备注' 
        },
        { 
          prop: 'B22', 
          label: 'B 减分\n因工作发生重大失误，造成一定影响的\n（视具体情况而定）', 
          width: 180,
          type: 'number'
        },
        { 
          prop: 'B22beizhu', 
          label: '备注' 
        },
        { 
          prop: 'B33', 
          label: 'B 减分\n因个人原因，造成集团经济损失10000元（含）以下，且个人负主要责任的\n（出现一次，扣一半绩效）', 
          width: 220,
          type: 'number'
        },
        { 
          prop: 'B33beizhu', 
          label: '备注' 
        },
        { 
          prop: 'B44', 
          label: 'B 减分\n因个人原因，造成集团经济损失10000元以上，且个人负主要责任的\n（出现一次，扣全部绩效）', 
          width: 220,
          type: 'number'
        },
        { 
          prop: 'B44beizhu', 
          label: '备注' 
        },
        { 
          prop: 'C1', 
          label: 'C 通用项\n出勤管理评分', 
          width: 120,
          type: 'number'
        },
        { 
          prop: 'quekacishu', 
          label: '缺卡次数' 
        },
        { 
          prop: 'C2', 
          label: 'C 通用项\n员工请假评分', 
          width: 120,
          type: 'number'
        },
        { 
          prop: 'C2beizhu', 
          label: '备注' 
        },
        { 
          prop: 'C3', 
          label: 'C 通用项\n日志提交评分', 
          width: 120,
          type: 'number'
        },
        { 
          prop: 'rizhiweitijiaocishu', 
          label: '日志未提交次数' 
        },
        { 
          prop: 'C4', 
          label: 'C 通用项\n值班管理评分', 
          width: 120,
          type: 'number'
        },
        { 
          prop: 'weizhibancishu', 
          label: '未值班次数', 
          width: 120 
        },
        { 
          prop: 'C5', 
          label: 'C 通用项\n发现在岗期间做与工作无关的事评分', 
          width: 120,
          type: 'number'
        },
        { 
          prop: 'C5beizhu', 
          label: '备注' 
        },
        { 
          prop: 'C6', 
          label: 'C 通用项\n工作期间脱岗评分', 
          width: 140,
          type: 'number'
        },
        { 
          prop: 'C6beizhu', 
          label: '备注' 
        },
        { 
          prop: 'C7', 
          label: 'C 通用项\n管理评分', 
          width: 120,
          type: 'number'
        },
        { 
          prop: 'Skoufen', 
          label: '备注' 
        },
        { 
          prop: 'C8', 
          label: 'C 通用项\n其他应遵守项评分', 
          width: 140,
          type: 'number'
        },
        { 
          prop: 'C8beizhu', 
          label: '备注' 
        },
        { 
          prop: 'D1', 
          label: 'D 日常考核项1\n事假', 
          width: 120 
        },
        { 
          prop: 'D2', 
          label: 'D 日常考核项2\n病假', 
          width: 120 
        },
        { 
          prop: 'qingjiakouchufenshu', 
          label: '请假扣除分数', 
          width: 120 
        }
      ],
      // 表单字段配置
      formFields: {
        date: new Date().toISOString().split('T')[0],
        bumen: "",
        xingming: "",
        KPI: "0",
        koufen: "0",
        B1: "0", B1beizhu: "", B2: "0", B2beizhu: "", B11: "0", B11beizhu: "", B22: "0", B22beizhu: "",
        B33: "0", B33beizhu: "", B44: "0", B44beizhu: "",
        C1: "0", quekacishu: "", C2: "0", C2beizhu: "", C3: "0", rizhiweitijiaocishu: "", C4: "0",
        weizhibancishu: "", C5: "0", C5beizhu: "0", C6: "0", C6beizhu: "", C7: "0", Skoufen: "",
        C8: "0", C8beizhu: "0", D1: "0", D2: "0", qingjiakouchufenshu: "0"
      }
    }
  },

  methods: {
    updateTableData(newData) {
      this.tableData = newData
      this.updateYearOptions()
    },
    
    calculateTotalNoBonus(row) {  
      return (  
        (Number(row.KPI) || 0) -  
        (Number(row.B11) || 0) -  
        (Number(row.B22) || 0) -  
        (Number(row.B33) || 0) -  
        (Number(row.B44) || 0) +  
        (Number(row.C1) || 0) +  
        (Number(row.C2) || 0) +  
        (Number(row.C3) || 0) +  
        (Number(row.C4) || 0) +  
        (Number(row.C5) || 0) +  
        (Number(row.C6) || 0) +  
        (Number(row.C7) || 0) +  
        (Number(row.C8) || 0)
      );
    },
    
    calculateTotal(row) {  
      return (  
        this.calculateTotalNoBonus(row) +  
        (Number(row.B1) || 0) +
        (Number(row.B2) || 0)
      );
    },
    
    updateYearOptions() {
      const years = new Set(this.tableData
        .map(item => {
          const date = new Date(item.date);
          return isNaN(date.getTime()) ? null : date.getFullYear();
        })
        .filter(Boolean)
      );
      this.years = ['all', ...Array.from(years).sort()];
    },
    
    // 新增的排序方法
    sortByScore() {
      const tableTemplate = this.$refs.tableTemplate;
      tableTemplate.editMode = false; // 确保退出编辑模式
      
      const sortedData = [...this.tableData].sort((a, b) => {
        // 首先按总分排序（降序）
        const totalA = this.calculateTotal(a);
        const totalB = this.calculateTotal(b);
        if (totalB !== totalA) {
          return totalB - totalA;
        }
        
        // 如果总分相同，按不含加分项的总分排序（降序）
        const totalNoBonusA = this.calculateTotalNoBonus(a);
        const totalNoBonusB = this.calculateTotalNoBonus(b);
        if (totalNoBonusB !== totalNoBonusA) {
          return totalNoBonusB - totalNoBonusA;
        }
        
        // 如果都不含加分项的总分也相同，按姓名排序（升序）
        return a.xingming.localeCompare(b.xingming);
      });
      
      this.tableData = sortedData;
    },
    
    handleCellDblclick(row, column, cell, event) {  
      this.editingRow = row;
      this.editingcolumn = column.property;
      this.editingValue = row[column.property];
      this.dialogVisible = true;
    },
    
    updateValue() {  
      if (this.editingRow && this.editingcolumn) {
        if (this.isNumeric(this.editingValue)) {
          this.editingRow[this.editingcolumn] = Number(this.editingValue);
        } else {
          this.editingRow[this.editingcolumn] = this.editingValue;
        }
        
        if (this.editingcolumn === 'date') {
          this.updateYearOptions();
        }
      }
      this.dialogVisible = false;
    },
    
    isNumeric(str) {  
      return !isNaN(parseFloat(str)) && isFinite(str);  
    },
    
    customFilter11(item) {
      if (this.selectedYear === 'all') return true;
      
      const itemDate = new Date(item.date);
      const isValidDate = !isNaN(itemDate.getTime());
      
      return isValidDate && itemDate.getFullYear() === Number(this.selectedYear);
    },
    
    customFilter22(item) {
      if (this.selectedMonth === 'all') return true;
      
      const itemDate = new Date(item.date);
      const isValidDate = !isNaN(itemDate.getTime());
      
      return isValidDate && itemDate.getMonth() + 1 === Number(this.selectedMonth);
    }
  },
  
  watch: {
    selectedYear() {
      this.$refs.tableTemplate.currentPage = 1;
    },
    selectedMonth() {
      this.$refs.tableTemplate.currentPage = 1;
    }
  }
}
</script>