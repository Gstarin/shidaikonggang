<template>
    <div class="tables-basic">
        <b-breadcrumb>
            <b-breadcrumb-item>投资发展部</b-breadcrumb-item>
            <b-breadcrumb-item active>合同档案</b-breadcrumb-item>
        </b-breadcrumb>
        <b-row>
            <b-col>
                <Widget title="<h5>合同内容</h5>" customHeader settings close>
                    <div class="table-header">
                        <!-- 搜索框 -->
                        <b-input v-model="search" placeholder="搜索相关单位、项目名称" style="width: 280px; margin-right: 15px;"></b-input>
                        <b-button variant="default" class="mr-3" size="sm" @click="parseExcel">解析Excel</b-button>
                        <b-button variant="default" class="mr-3" size="sm" @click="handleExportTable('DisburseTable1')">下载模板</b-button>
                        <b-button variant="danger" class="mr-3" size="sm" @click="deleteSelectedRows" style="width: 150px; height: 35px;">删除选中行</b-button>
                        <b-button variant="default" class="mr-3" size="sm" @click="dialogVisible = true" style="width: 150px; height: 35px;">增加条目</b-button>
                    </div>
                    <div id="table">
                        <el-table :data="current" style="width: 100%" id="DisburseTable" @selection-change="handleSelectionChange" height="500"  @cell-dblclick="handleCellDblclick">
                            <el-table-column type="selection" width="55"></el-table-column>
                              <el-table-column prop="xiangmumingcheng" label="项目名称" width="200"></el-table-column>
                            <el-table-column prop="xiangguandanwei" label="建设单位" width="150"></el-table-column>
                          
                            <el-table-column prop="yingshoukuan" label="应收款（万元）" width="150"></el-table-column>
                            <el-table-column prop="shishoukuan" label="实收款（万元）" width="100"></el-table-column>
                            <el-table-column prop="yingshouweishou" label="应收未收（万元）" width="100"></el-table-column>
                            <el-table-column prop="yingfukuan" label="应付款（万元）" width="100"></el-table-column>
                            <el-table-column prop="shifukuan" label="实付款（万元）" width="100"></el-table-column>
                            <el-table-column prop="yingfuweifu" label="应付未付（万元）" width="100"></el-table-column>
                            <el-table-column prop="beizhu" label="备注" width="200"></el-table-column>
                        </el-table>
                        <el-table :data=[]  style=" display: none;width: 100%" id="DisburseTable1" @selection-change="handleSelectionChange" height="500"  @cell-dblclick="handleCellDblclick">
                         
                              <el-table-column prop="xiangmumingcheng" label="项目名称" width="200"></el-table-column>
                            <el-table-column prop="xiangguandanwei" label="建设单位" width="150"></el-table-column>
                          
                            <el-table-column prop="yingshoukuan" label="应收款（万元）" width="150"></el-table-column>
                            <el-table-column prop="shishoukuan" label="实收款（万元）" width="100"></el-table-column>
                            <el-table-column prop="yingshouweishou" label="应收未收（万元）" width="100"></el-table-column>
                            <el-table-column prop="yingfukuan" label="应付款（万元）" width="100"></el-table-column>
                            <el-table-column prop="shifukuan" label="实付款（万元）" width="100"></el-table-column>
                            <el-table-column prop="yingfuweifu" label="应付未付（万元）" width="100"></el-table-column>
                            <el-table-column prop="beizhu" label="备注" width="200"></el-table-column>
                        </el-table>
                    </div>
            <el-dialog :visible.sync="dialogVisible" title="新增合同">
            <el-form ref="form" :model="form" label-width="140px">
              <el-form-item label="项目名称">
                <el-input v-model="form.xiangmumingcheng"></el-input>
              </el-form-item>
              <el-form-item label="建设单位">
                <el-input v-model="form.xiangguandanwei"></el-input>
              </el-form-item>
              <el-form-item label="应收款（万元）">
                <el-input v-model="form.yingshoukuan"></el-input>
              </el-form-item>
              <el-form-item label="实收款（万元）">
                <el-input v-model="form.shishoukuan"></el-input>
              </el-form-item>
              <el-form-item label="应收未收（万元）">
                <el-input v-model="form.yingshouweishou"></el-input>
              </el-form-item>
              <el-form-item label="应付款（万元）">
                <el-input v-model="form.yingfukuan"></el-input>
              </el-form-item>
              <el-form-item label="实付款（万元）">
                <el-input v-model="form.shifukuan"></el-input>
              </el-form-item>
                 <el-form-item label="应付未付（万元）">
                <el-input v-model="form.yingfuweifu"></el-input>
              </el-form-item>
    
              <el-form-item label="备注">
                <el-input v-model="form.beizhu"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitForm">确定</el-button>
            </span>
          </el-dialog>
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
import axios from '@/utils/axios.js';
import * as XLSX from 'xlsx/xlsx.mjs'
import {export_excel} from '@/utils/exportExcel.js'
export default {
    name: 'Disburse',
    components: { Widget },
    data() {
        return {
            hetong:"",
			selectedRows: [],
			selectedUnit: "", // Selected unit dropdown value
			selectedProject: "", // Selected project dropdown value
			selectedDepartment: "",
			units: ["全部"], // Options for 相关单位 dropdown
			projects: ["全部"], // Options for 项目名称 dropdown
			department: ["市政公司", "博泰酒店", "房地产", "建设统筹部", "时代空港", "青清水务", "瑞景园林", "生物质能源", "投资发展部", "物业公司"],
            dialogVisible: false,
            dialogVisible1: false,
            editingRow: null, // 当前编辑的行数据  
			editingValue: '', // 输入框中的值  
			editingcolumn: null,
            file: null,
            search: "", // 搜索关键词绑定
            currentPage: 1,
            tableData: [],
            tempData: [],
            selectedRows: [], // 选中的行
            form: {
                xiangguandanwei: "",
                xiangmumingcheng: "",
                // hetongduifang: "",
                // hetongjine: "",
                // jiesuanjine: "",
                // xiangmujindu: "",
                yingshoukuan: "",
                shishoukuan: "",
                yingshouwweishou: "",
                yingfukuan: "",
                shifukuan: "",
                yingfuweifu: "",
                beizhu: ""
            }
        };
    },
    mounted() {
        this.hetong = this.$route.query.htmc;
        console.log(this.hetong)  

      axios.get(`/api/data/hetong_${this.hetong}`).then(response => {
      this.tableData = response.data;
      let i=0;
      for(i=0;i<this.tableData.length;i++) this.tableData[i].xuhao=i;
    
     
    }).catch(error => {
      console.error('Error fetching JSON:', error);
      // 如果数据不存在，初始化为空数组
      this.tableData = [];
    });
       
    },

    beforeDestroy() {
      if (this.tableData.length > 0) {
          axios.post(`/api/save/hetong_${this.hetong}`, this.tableData, {
              headers: {
                  'Content-Type': 'application/json',
              },
          })
              .then(response => {
                  console.log('合同管理数据保存成功');
              })
              .catch(error => {
                  console.error('合同管理数据保存失败：', error);
              });
      }
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
            const title = ["xiangguandanwei", "xiangmumingcheng",  "yingshoukuan","shishoukuan","yingshouweishou",  "yingfukuan", "shifukuan","yingfuweifu",  "beizhu"]
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
        yingshoukuan: "",
        shishoukuan: "",
        yingshouwweishou:"",
        yingfukuan:"",
        shifukuan:"",
        yingfuweifu: "",

        beizhu: ""
		  }
		},

    submitForm() {
		  console.log(typeof this.form.file)
		  const newRow = {
			xuhao: this.tableData.length + 1,
		  xiangguandanwei:this.form.xiangguandanwei,
      xiangmumingcheng:this.form.xiangmumingcheng,

      yingshoukuan:this.form.yingshoukuan,
      shishoukuan:this.form.shishoukuan,
      yingshouweishou:this.form.yingshouwweishou,
      yingfukuan:this.form.yingfukuan,
      shifukuan:this.form.shifukuan,
      yingfuweifu:this.form.yingfuweifu,
   
      beizhu:this.form.beizhu

		  };
	
		  // 将新行添加到表格数据数组中
		  this.tableData.push(newRow);

      // 立即保存数据到本地API
      axios.post(`/api/save/hetong_${this.hetong}`, this.tableData, {
          headers: {
              'Content-Type': 'application/json',
          },
      })
      .then(response => {
          console.log('合同管理数据保存成功');
          this.$message({
              message: '合同添加成功',
              type: 'success',
          });
      })
      .catch(error => {
          console.error('合同管理数据保存失败：', error);
          this.$message({
              message: '合同保存失败，请重试',
              type: 'error',
          });
      });
	
		  // 重置表单
		  this.resetForm();
	
		  // 关闭对话框
		  this.dialogVisible = false;
		},
      handleSelectionChange(val) {
      this.selectedRows = val;
      let i=0;
      for(i=0;i<this.tableData.length;i++) this.tableData[i].xuhao=i;
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

        // 重新编号
        for(let i=0;i<this.tableData.length;i++) this.tableData[i].xuhao=i+1;

        // 立即保存数据到本地API
        axios.post(`/api/save/hetong_${this.hetong}`, this.tableData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            console.log('合同管理数据保存成功');
            this.$message({
                message: '合同删除成功',
                type: 'success',
            });
        })
        .catch(error => {
            console.error('合同管理数据保存失败：', error);
            this.$message({
                message: '删除失败，请重试',
                type: 'error',
            });
        });
      } else {
        this.$message({
            message: '请先选择要删除的合同',
            type: 'warning',
        });
      }
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

       
        if(!this.isNumeric(this.editingValue)){
        this.tableData[this.editingRow][this.editingcolumn] = this.editingValue;  
    }
    else
     this.tableData[this.editingRow][this.editingcolumn] = Number(this.editingValue);  

        // 立即保存数据到本地API
        axios.post(`/api/save/hetong_${this.hetong}`, this.tableData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            console.log('合同管理数据保存成功');
            this.$message({
                message: '数据修改成功',
                type: 'success',
            });
        })
        .catch(error => {
            console.error('合同管理数据保存失败：', error);
            this.$message({
                message: '修改保存失败，请重试',
                type: 'error',
            });
        });
      }  
      this.dialogVisible1 = false; // 关闭对话框  
      
    },  
      handleExportTable(table_id) {
            this.$nextTick(function () {
              // var that=this.tableData.slice()
              // this.tableData=[]
                export_excel(table_id)
                // this.tableData=that;
            })

        },

        // fetchData() {
        //     axios.get('/api/data/disburse')
        //         .then(response => {
        //             this.tableData = response.data.map(item => ({
        //                 ...item,
        //                 // hetongduifang: '相对人A', // 示例数据
        //                 // xiangmujindu: '50%', // 示例数据
        //                 yingshoukuan: 70, // 示例数据
        //                 shishoukuan: 70, // 示例数据
        //                 yingshouweishou: 0, // 示例数据
        //                 yingfukuan: 80,
        //                 shifukuan: 80,
        //                 yingfuweifu: 0,
        //             }));
        //         })
        //         .catch(error => {
        //             console.error('Error fetching JSON:', error);
        //         });
        // },
        // 其他方法保持不变
        // ...
    },
    computed: {
        filteredItems() {
            if (this.search !== "") {
                return this.tableData.filter(item => {
                    return (
                        (item.xiangguandanwei !== undefined && item.xiangguandanwei.includes(this.search)) ||
                        (item.xiangmumingcheng !== undefined && item.xiangmumingcheng.includes(this.search)) 
                        // (item.hetongduifang !== undefined && item.hetongduifang.includes(this.search))
                    );
                });
            } else {
                return this.tableData;
            }
        },
        current() {
            const start = (this.currentPage - 1) * 20;
            const end = start + 20;
            return this.filteredItems.slice(start, end);
        },
        rows() {
            return this.filteredItems.length;
        },
    }
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
</style>
