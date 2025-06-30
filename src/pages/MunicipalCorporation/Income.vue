<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>市政公司</b-breadcrumb-item>
      <b-breadcrumb-item active>收入信息</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>市政公司项目收入情况统计表</h5>" customHeader settings close>
          <div class="table-header d-flex align-items-center mb-3">
            <b-form-file v-model="file" placeholder="请选择一个Excel文件" class="mr-3 mb-2" style="max-width: 360px;"></b-form-file>
            <b-button variant="default" class="mr-3 mb-2" size="sm" @click="parseExcel">解析Excel</b-button>
            <b-button variant="default" class="mr-3 mb-2" size="sm" @click="handleExportTable('DisburseTable1')">下载模板</b-button>
            <b-button variant="primary" class="mr-3 mb-2 custom-btn" size="sm" @click="save">保存</b-button>
            <b-form-select v-model="selectedUnit" :options="units" class="mr-3 mb-2 select-small" placeholder="选择相关单位"></b-form-select>
            <div class="alert alert-info mb-0 ml-3">
              注意：所有数据请在"合同收款细表"中录入，此表将自动汇总显示。
            </div>
          </div>

          <!-- 添加Tab切换 -->
          <el-tabs v-model="activeTab">
            <el-tab-pane label="收入明细表" name="main">
              <!-- Table -->
              <div id="table">
                <el-table :data="current" style="width: 100%" id="DisburseTable" @selection-change="handleSelectionChange" height="500"  @cell-dblclick="handleCellDblclick">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column prop="xiangguandanwei" label="相关单位" width="150"></el-table-column>
                  <el-table-column prop="xiangmumingcheng" label="项目名称" width="200">
                    <template slot-scope="scope">
                      <span @click="goToDetailPage(scope.row)" style="cursor: pointer;text-decoration: underline; color:white">{{ scope.row.xiangmumingcheng }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="hetongduifang" label="合同相对人" width="150"></el-table-column>
                  <el-table-column prop="hetongjine" label="合同金额" width="100">
                    <template slot="header">
                      <span>合同金额<br/>(万元)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="jiesuanjine" label="结算金额" width="100">
                    <template slot="header">
                      <span>结算金额<br/>(万元)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="xiangmujindu" label="项目进度" width="100">
                    <template slot="header">
                      <span>项目进度<br/>(百分比)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="yingshoukuan" label="应收款" width="100">
                    <template slot="header">
                      <span>应收款<br/>(万元)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="shishoukuan" label="实收款" width="100">
                    <template slot="header">
                      <span>实收款<br/>(万元)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="yingshouwushou" label="应收未收" width="100">
                    <template slot="header">
                      <span>应收未收<br/>(万元)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="beizhu" label="备注" width="200"></el-table-column>
                </el-table>
                <el-table :data=[] style="display:none;width: 100%" id="DisburseTable1" @selection-change="handleSelectionChange" height="500"  @cell-dblclick="handleCellDblclick">
                  <el-table-column prop="xiangguandanwei" label="相关单位" width="150"></el-table-column>
                  <el-table-column prop="xiangmumingcheng" label="项目名称" width="200">
                    <template slot-scope="scope">
                      <span @click="goToDetailPage(scope.row)" style="cursor: pointer;text-decoration: underline; color:blue">{{ scope.row.xiangmumingcheng }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="hetongduifang" label="合同相对人" width="150"></el-table-column>
                  <el-table-column prop="hetongjine" label="合同金额" width="100">
                    <template slot="header">
                      <span>合同金额<br/>(万元)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="jiesuanjine" label="结算金额" width="100">
                    <template slot="header">
                      <span>结算金额<br/>(万元)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="xiangmujindu" label="项目进度" width="100">
                    <template slot="header">
                      <span>项目进度<br/>(百分比)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="yingshoukuan" label="应收款" width="100">
                    <template slot="header">
                      <span>应收款<br/>(万元)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="shishoukuan" label="实收款" width="100">
                    <template slot="header">
                      <span>实收款<br/>(万元)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="yingshouwushou" label="应收未收" width="100">
                    <template slot="header">
                      <span>应收未收<br/>(万元)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="beizhu" label="备注" width="200"></el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="合同收款细表" name="detail">
              <!-- 新增表格 -->
              <div class="table-header d-flex align-items-center mb-3">
                <b-button variant="danger" class="mr-3 mb-2 custom-btn" size="sm" @click="deleteDetailSelectedRows">删除选中行</b-button>
                <b-button variant="default" class="mr-3 mb-2 custom-btn" size="sm" @click="dialogVisible = true">新增条目</b-button>
              </div>
              <div id="detailTable">
                <el-table :data="detailTableData" style="width: 100%" id="DetailTable" @selection-change="handleDetailSelectionChange" height="500" @cell-dblclick="handleDetailCellDblclick">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column prop="xuhao" label="序号" width="80"></el-table-column>
                  <el-table-column prop="hetongmingcheng" label="合同名称" width="200"></el-table-column>
                  <el-table-column prop="hetongduifang" label="合同相对人" width="150"></el-table-column>
                  <el-table-column prop="kaipiaoriqi" label="开票/收款日期" width="150"></el-table-column>
                  <el-table-column prop="kaipiaojine" label="开票金额" width="150">
                    <template slot="header">
                      <span>开票金额<br/>(不含税)<br/>(万元)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="shuie" label="进项税额" width="120">
                    <template slot="header">
                      <span>进项税额<br/>(万元)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="kaipiaojinehanshui" label="开票金额" width="150">
                    <template slot="header">
                      <span>开票金额<br/>(含税)<br/>(万元)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="shoukuanjine" label="收款金额" width="120">
                    <template slot="header">
                      <span>收款金额<br/>(万元)</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="piaohao" label="凭证编号" width="120"></el-table-column>
                  <el-table-column prop="beizhu" label="备注" width="200"></el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>

          <!-- Add Contract Dialog -->
          <el-dialog :visible.sync="dialogVisible" title="新增合同">
            <el-form ref="form" :model="detailForm" label-width="140px">
              <el-form-item label="序号">
                <el-input v-model="detailForm.xuhao"></el-input>
              </el-form-item>
              <el-form-item label="合同名称">
                <el-input v-model="detailForm.hetongmingcheng"></el-input>
              </el-form-item>
              <el-form-item label="合同相对人">
                <el-input v-model="detailForm.hetongduifang"></el-input>
              </el-form-item>
              <el-form-item label="开票/收款日期">
                <el-input v-model="detailForm.kaipiaoriqi"></el-input>
              </el-form-item>
              <el-form-item label="开票金额（不含税）">
                <el-input v-model="detailForm.kaipiaojine"></el-input>
              </el-form-item>
              <el-form-item label="进项税额">
                <el-input v-model="detailForm.shuie"></el-input>
              </el-form-item>
              <el-form-item label="开票金额（含税）">
                <el-input v-model="detailForm.kaipiaojinehanshui"></el-input>
              </el-form-item>
              <el-form-item label="收款金额">
                <el-input v-model="detailForm.shoukuanjine"></el-input>
              </el-form-item>
              <el-form-item label="凭证编号">
                <el-input v-model="detailForm.piaohao"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="detailForm.beizhu"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitDetailForm">确定</el-button>
            </span>
          </el-dialog>

          <!-- Pagination -->
          <div class="table-footer">
            <b-pagination v-model="currentPage" :total-rows="rows" size="lg"></b-pagination>
          </div>
        </Widget>
      </b-col>
    </b-row>
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

  </div>



</template>

<script>
import Widget from '@/components/Widget/Widget';
import axios from '@/utils/axios';
import * as XLSX from 'xlsx/xlsx.mjs'
import {export_excel} from '@/utils/exportExcel.js'
import { saveData, getData } from '@/utils/dataStorage';

export default {
  name: 'Income',
  components: { Widget },
  data() {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      editingRow: null, // 当前编辑的行数据  
      editingValue: '', // 输入框中的值  
      editingcolumn: null,
      file: null,
      currentPage: 1,
      tableData: [],
      selectedRows: [],
      selectedUnit: "", // Selected unit dropdown value
      selectedProject: "", // Selected project dropdown value
      selectedDepartment: "",
      units: ["全部"], // Options for 相关单位 dropdown
      projects: ["全部"], // Options for 项目名称 dropdown
      department: ["市政公司", "博泰酒店", "房地产", "建设统筹部", "时代空港", "青清水务", "瑞景园林", "首钢", "投资发展部", "物业公司"],
      form: {
        xiangguandanwei: "",
        xiangmumingcheng: "",
        hetongduifang: "",
        hetongjine: "",
        jiesuanjine: "",
        xiangmujindu: "",
        yingshoukuan: "",
        shishoukuan: "",
        yingshouwushou: "",
        beizhu: ""
      },
      activeTab: 'main',
      detailTableData: [], // 新增表格数据
      detailSelectedRows: [], // 新增表格选中行
      detailForm: {
        xuhao: '',
        hetongmingcheng: '',
        hetongduifang: '',
        kaipiaoriqi: '',
        kaipiaojine: '',
        shuie: '',
        kaipiaojinehanshui: '',
        shoukuanjine: '',
        piaohao: '',
        beizhu: ''
      }
    };
  },
  mounted() {
    this.fetchData();
    this.fetchDetailData();
    // 添加定时刷新
    this.refreshInterval = setInterval(() => {
      if (this.activeTab === 'main') {
        this.fetchData();
      } else {
        this.fetchDetailData();
      }
    }, 300000); // 每5分钟刷新一次
  },
  beforeDestroy() {
      if (this.tableData.length > 0) {
          axios.post('/upload_income', this.tableData, {
              headers: {
                  'Content-Type': 'application/json',
              },
          })
              .then(response => {
                  console.log('市政公司收入表上传成功');
              })
              .catch(error => {
                  console.error('市政公司收入表文件时出错：', error);
              });
      }
      // 清除定时器
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
      // 保存数据
      this.save();
  },

  computed: {
    // 聚合后的主表数据
    aggregatedData() {
      const aggregated = {};
      
      this.detailTableData.forEach(detail => {
        if (!aggregated[detail.hetongmingcheng]) {
          aggregated[detail.hetongmingcheng] = {
            xiangguandanwei: detail.xiangguandanwei,
            xiangmumingcheng: detail.xiangmumingcheng,
            hetongmingcheng: detail.hetongmingcheng,
            hetongduifang: detail.hetongduifang,
            hetongjine: 0,
            jiesuanjine: 0,
            xiangmujindu: 0,
            yingshoukuan: 0,
            shishoukuan: 0,
            yingshouwushou: 0,
            beizhu: '',
            recordCount: 0
          };
        }
        
        const current = aggregated[detail.hetongmingcheng];
        current.recordCount++;
        
        // 累加金额
        ['kaipiaojine', 'shoukuanjine'].forEach(field => {
          if (detail[field] && !isNaN(parseFloat(detail[field]))) {
            current.shishoukuan += parseFloat(detail[field]);
          }
        });
        
        // 更新其他字段
        if (detail.kaipiaojinehanshui && !isNaN(parseFloat(detail.kaipiaojinehanshui))) {
          current.hetongjine = parseFloat(detail.kaipiaojinehanshui);
        }
        
        // 计算应收未收
        current.yingshouwushou = current.hetongjine - current.shishoukuan;
      });
      
      return Object.values(aggregated);
    },
    
    // 过滤后的数据
    filteredItems() {
      let filteredData = this.aggregatedData;
      if (this.selectedUnit && this.selectedUnit !== "全部") {
        filteredData = filteredData.filter(item => item.xiangguandanwei === this.selectedUnit);
      }
      if (this.selectedProject && this.selectedProject !== "全部") {
        filteredData = filteredData.filter(item => item.xiangmumingcheng === this.selectedProject);
      }
      return filteredData;
    },
    
    current() {
      const start = (this.currentPage - 1) * 20;
      const end = start + 20;
      return this.filteredItems.slice(start, end);
    },
    
    rows() {
      return this.filteredItems.length;
    },
  },
  methods: {
    parseExcel() {
        if (this.file) {
          let that = this
          that.tableData = []
          const reader = new FileReader();
          reader.readAsArrayBuffer(this.file);
          reader.onload = function (e) {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            // 获取第一个工作表
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const title = ["xiangguandanwei", "xiangmumingcheng",  "hetongduifang", "hetongjine", "jiesuanjine", "xiangmujindu", "yingshoukuan","shishoukuan","yingshouweishou",  "beizhu"]
            // 解析工作表数据
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            // console.log('解析后的数据为：', jsonData)
            for (let i = 2; i < jsonData.length; i++) {
              let obj = {};
              if (jsonData[i].length == 0) {
                continue
              }
              for (let j = 0; j < jsonData[i].length; j++) {
                if (typeof jsonData[i][j + 1] === 'number') {
                  obj[title[j]] = jsonData[i][j + 1].toFixed(2);
                } else {
                  obj[title[j]] = jsonData[i][j + 1];
                }
  
              }
              obj["isEditing"] = false
              that.tableData.push(obj)
            }
  
          };
        }
      },

    resetForm() {
		  this.form = { 
        xiangguandanwei: "",
        xiangmumingcheng: "",
        hetongduifang: "",
        hetongjine: "",
        jiesuanjine: "",
        xiangmujindu: "",
        yingshoukuan: "",
        shishoukuan: "",
        yingshouwushou: "",
        beizhu: ""
		  }
		},

    submitForm() {
		  console.log(typeof this.form.file)
		  const newRow = {
			xuhao: this.tableData.length + 1,
		  xiangguandanwei:this.form.xiangguandanwei,
      xiangmumingcheng:this.form.xiangmumingcheng,
      hetongmingcheng:this.form.hetongmingcheng,
      hetongduifang:this.form.hetongduifang,
      hetongjine:this.form.hetongjine,
   
      xiangmujindu:this.form.xiangmujindu,
      yingshoukuan:this.form.yingshoukuan,
      shishoukuan:this.form.shishoukuan,
    
      yingshouwushou:this.form.yingshouwushou,
      beizhu:this.form.beizhu

		  };
	
		  // 将新行添加到表格数据数组中
		  this.tableData.push(newRow);
	
		  // 重置表单
		  this.resetForm();
	
		  // 关闭对话框
		  this.dialogVisible = false;
		},

    handleCellDblclick(row, column, cell, event) {  
      this.editingRow = row.xuhao; // 保存当前编辑的行数据 
      this.editingcolumn= column.property;
    
      this.editingValue = row[column.property]; // 设置输入框的初始值为当前单元格的值  
      this.dialogVisible1 = true; // 显示对话框  
    },  

    isNumeric(str) {  
    return !isNaN(parseFloat(str)) && isFinite(str);  
},  

    updateValue() {  
      if (this.editingRow && this.editingValue !== this.editingRow.value) {  
        if (this.shouldValidateNumeric(this.editingcolumn) && !this.isNumeric(this.editingValue)) {
          this.$message.error('请输入有效的数字');
          return;
        }

        if (this.activeTab === 'main') {
          this.tableData[this.editingRow][this.editingcolumn] = this.isNumeric(this.editingValue) ? 
            Number(this.editingValue) : this.editingValue;
        } else {
          const index = this.detailTableData.indexOf(this.editingRow);
          if (index > -1) {
            this.detailTableData[index][this.editingcolumn] = this.isNumeric(this.editingValue) ? 
              Number(this.editingValue) : this.editingValue;
          }
        }
      }  
      this.dialogVisible1 = false;
    },  
    handleExportTable(table_id) {
            this.$nextTick(function () {
                export_excel(table_id)
            })

        },

    // Handle selection change
    handleSelectionChange(val) {
      this.selectedRows = val;
      let i=0;
      for(i=0;i<this.tableData.length;i++) this.tableData[i].xuhao=i;
    },
    goToDetailPage(row) {
      this.$router.push({ name: 'detail1', params: { contract: row } });
    },
    deleteSelectedRows() {
      if (this.selectedRows.length > 0) {
        this.selectedRows.forEach(row => {
          const index = this.tableData.indexOf(row);
          if (index > -1) {
            this.tableData.splice(index, 1);
          }
        });
        this.selectedRows = [];
      }
    },
    getDropdownOptions(field) {
      const options = new Set();
      this.tableData.forEach(item => {
        options.add(item[field]);
      });
      return Array.from(options);
    },
    async fetchData() {
      try {
        const data = await getData('income');
        this.tableData = data;
        let i = 0;
        for(i = 0; i < this.tableData.length; i++) {
          this.tableData[i].xuhao = i;
        }
        this.units = ["全部", ...this.getDropdownOptions('xiangguandanwei')];
        this.projects = ["全部", ...this.getDropdownOptions('xiangmumingcheng')];
      } catch (error) {
        console.error('获取数据失败:', error);
        this.$message.error('获取数据失败');
      }
    },
    handleDetailSelectionChange(val) {
      this.detailSelectedRows = val;
    },
    handleDetailCellDblclick(row, column, cell, event) {
      this.editingRow = row;
      this.editingColumn = column.property;
      this.editingValue = row[column.property];
      this.dialogVisible1 = true;
    },
    async save() {
      try {
        await saveData('income', this.tableData);
        await saveData('income_detail', this.detailTableData);
        this.$message.success('数据保存成功');
      } catch (error) {
        console.error('保存数据失败:', error);
        this.$message.error('保存数据失败');
      }
    },
    // 添加数值字段验证方法
    shouldValidateNumeric(field) {
      const numericFields = [
        'hetongjine', 'jiesuanjine', 'xiangmujindu', 'yingshoukuan', 
        'shishoukuan', 'yingshouwushou',
        'kaipiaojine', 'shuie', 'kaipiaojinehanshui', 'shoukuanjine'
      ];
      return numericFields.includes(field);
    },
    deleteDetailSelectedRows() {
      if (this.detailSelectedRows.length > 0) {
        this.detailSelectedRows.forEach(row => {
          const index = this.detailTableData.indexOf(row);
          if (index > -1) {
            this.detailTableData.splice(index, 1);
          }
        });
        this.detailSelectedRows = [];
      }
    },
    submitDetailForm() {
      // 将新增的明细数据添加到表格数据中
      this.detailTableData.push(this.detailForm);
      // 重置新增表单
      this.detailForm = {
        xuhao: '',
        hetongmingcheng: '',
        hetongduifang: '',
        kaipiaoriqi: '',
        kaipiaojine: '',
        shuie: '',
        kaipiaojinehanshui: '',
        shoukuanjine: '',
        piaohao: '',
        beizhu: ''
      };
      // 关闭新增对话框
      this.dialogVisible = false;
    },
    async fetchDetailData() {
      try {
        const data = await getData('income_detail');
        this.detailTableData = data || [];
        this.units = ["全部", ...new Set(this.aggregatedData.map(item => item.xiangguandanwei))];
        this.projects = ["全部", ...new Set(this.aggregatedData.map(item => item.xiangmumingcheng))];
      } catch (error) {
        console.error('获取明细数据失败:', error);
        this.$message.error('获取明细数据失败');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.table-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  margin-bottom: 15px;
}

.table-footer {
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#table{
  color:rgb(255, 255, 255) !important;
  font-weight: 600;
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
    padding: 0;
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

  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table td {
    background-color: transparent;
  }
}

.clickable {
  cursor: pointer;
  color: #9f9fad;
  text-decoration: underline;
}

.select-small {
  max-width: 180px;
}

#detailTable {
  ::v-deep .cell {
    color: white !important;
    white-space: pre-line;
  }

  ::v-deep .el-table__header th {
    padding: 8px 0;
    height: 60px;
    line-height: 20px;
    color: white !important;
    .cell {
      white-space: pre-line;
    }
  }

  ::v-deep .el-table__body tr,
  ::v-deep .el-table__body td {
    padding: 0;
    height: 50px;
    line-height: 50px;
    color: white !important;
  }

  ::v-deep .el-table {
    background-color: transparent !important;
    color: white !important;
  }

  ::v-deep .el-table__expanded-cell {
    background-color: transparent !important;
  }

  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table td {
    background-color: transparent;
    color: white !important;
  }
}

// 添加Tabs文字样式
::v-deep .el-tabs__item {
  color: white !important;
  &.is-active {
    color: #409EFF !important;
  }
}
</style>
