<template>
  <div class="tables-basic">
      <b-breadcrumb>
          <b-breadcrumb-item>房地产公司</b-breadcrumb-item>
          <b-breadcrumb-item active>档案资料管理系统</b-breadcrumb-item>
      </b-breadcrumb>
      <!-- <h2 class="page-title">市政公司支出信息</h2> -->
      <b-row>
          <b-col>
              <Widget title="<h5>档案资料</h5>" customHeader settings close>
                  <div class="table-header"
                      style="width: 100%;display: flex;justify-content: center;margin-bottom: 15px;">
                      <b-input type="text" v-model="search" style="width: 360px;height: 35px;margin:0 15px;"
                          placeholder="Search..." />
                      <b-button variant="default" class="mr-3" size="sm" @click="dialogVisible = true"
                          style="width: 110px;height: 35px;">增加</b-button>
                      <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"
                      @click="handleDelete">删除</b-button>

                  </div>
                  <div id="table" >
                      <el-table :data="current" style="width: 100%"  @selection-change="handleSelectionChange"   @cell-dblclick="handleCellDblclick" >
                          <el-table-column type="selection" label="编号" width="80">
                          </el-table-column>
                          <el-table-column prop="material" label="材料名称" width="180">
                          </el-table-column>
                          <el-table-column prop="borrow" label="借出时间" width="100">               
                          </el-table-column>                     
                           <el-table-column prop="return" label="归还时间">
                          </el-table-column>

                          <el-table-column prop="name" label="借阅人">
                          </el-table-column>
                          <el-table-column prop="status" label="状态">
                          </el-table-column>
                          <el-table-column prop="fuijian" label="附件">
                            <template slot-scope="scope">  
                            <b-button variant="default" class="mr-3" size="sm" @click="upload_pdf(scope.row.id)"
                          style="width: 110px;height: 35px;">上传</b-button>
                          <br> <br>
                         
                      <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"
                          @click="download_pdf(scope.row.id)">查看</b-button>
                            </template >  
                          </el-table-column>
                       

                      </el-table>
                  </div>
        <el-dialog :visible.sync="dialogVisible" title="上传信息">
              <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="材料名称">
                  <el-input v-model="form.materiall" ></el-input>
                </el-form-item>
                <el-form-item label="借出时间">
                  <el-input v-model="form.borroww" ></el-input>
                </el-form-item>
              
                <el-form-item label="归还时间">
                  <el-input  v-model="form.returnn"></el-input>
                </el-form-item>

                <el-form-item label="借阅人">
                  <el-input  v-model="form.namee"></el-input>
                </el-form-item>

                <el-form-item label="状态" >
                  <el-input  v-model="form.statuss" ></el-input>
                </el-form-item>
                





              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
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
      :visible.sync="dialogVisible2"  
      width="30%"  
      @close="dialogVisible2 = false"  
    >  
      <el-input v-model="editingValue" placeholder="请输入新值"></el-input>  
      <span slot="footer" class="dialog-footer">  
        <el-button @click="dialogVisible2 = false">取 消</el-button>  
        <el-button type="primary" @click="updateValue">确 定</el-button>  
      </span>  
    </el-dialog>  
  </div>
</template>

<script>

import Widget from '@/components/Widget/Widget';
import Sparklines from '../../components/Sparklines/Sparklines'
import * as XLSX from 'xlsx/xlsx.mjs'
import axios from '@/utils/axios.js'

export default {
  name: 'dazl',
  components: { Widget, Sparklines },
  data() {
      return {
        multipleSelection : [],
    dialogVisible: false,
    dialogVisible2: false,
    editingRow: null, // 当前编辑的行数据  
      editingValue: '', // 输入框中的值  
      editingcolumn: null,
    form: {
      idd:"",
      materiall:"",
      borroww:"",
      returnn:"",
      namee:"",
      statuss:"",
      
    },
          file: null,
          currentPage: 1,
          search: "",
          tableData: [],
          project_id:1
    
      };
  },
  mounted() {
      axios.get('/api/data/dazl').then(response => {
          // console.log('Fetched JSON:', response.data);
          this.tableData = response.data
      }).catch(error => {
          console.error('Error fetching JSON:', error);
      });
  },
  beforeDestroy() {
      if (this.tableData.length > 0) {
          axios.post('/api/save/dazl', this.tableData, {
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
  },
  computed: {
      filteredItems() {
          if (this.search != "") {
              return this.tableData.filter(item => {
                  return ((item.xiangguandanwei != undefined && item.xiangguandanwei.includes(this.search)) ||
                      (item.xiangmumingcheng != undefined && item.xiangmumingcheng.includes(this.search)));
              });
          } else {
              return this.tableData
          }
      },
      current() {
          const start = (this.currentPage - 1) * 20;
          const end = start + 20;
          console.log(this.filteredItems.slice(start, end))
          return this.filteredItems.slice(start, end);
      },
      rows() {
          return this.filteredItems.length
      },
  },
  methods: {
    handleCellDblclick(row, column, cell, event) {  
      this.editingRow = row.id; // 保存当前编辑的行数据 
      this.editingcolumn= column.property;
    
      this.editingValue = row[column.property]; // 设置输入框的初始值为当前单元格的值  
      this.dialogVisible2 = true; // 显示对话框  
    },  

    isNumeric(str) {  
    return !isNaN(parseFloat(str)) && isFinite(str);  
},  

    updateValue() {  
      if (this.editingRow && this.editingValue !== this.editingRow.value) {  

       
        if(!this.isNumeric(this.editingValue)){
        this.tableData[this.editingRow-1][this.editingcolumn] = this.editingValue;  
    }
    else
     this.tableData[this.editingRow-1][this.editingcolumn] = Number(this.editingValue);  
      }  
      this.dialogVisible2 = false; // 关闭对话框  
      
    },  


    upload_pdf(id) {
      console.log(id);
      
      var that = this;
      const vm=this;
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/pdf";
      input.addEventListener("change", function () {
        const formData = new FormData();
        formData.append("pdf", input.files[0]);
        formData.append("projectName", that.project_id);
        formData.append("pdfName", id);
        axios
          .post("/api/save/pdf", formData)
          .then((response) => {
            //  vm.tableData[id-1].status="已上传"
            that.$message({
              message: "PDF上传成功",
              type: "success",
              
            });
          })
          .catch((error) => {
            console.error("上传 PDF 文件时出错：", error);
          });
      });
      input.click();
    },
    download_pdf(id) {
      var that = this;
      axios
        .get(
          `/api/data/pdf?projectName=${that.project_id}&&pdfName=${id}`
        )
        .then((response) => {
          const url = "http://8.130.106.134:5000/" + response.data;
          window.open(url, "_blank");
        })
        .catch((error) => {
          that.$message({
            message: "PDF暂为上传",
            type: "error",
          });
        });
    },


  resetForm() {
    this.form = {
      idd:"",
      materiall:"",
      borroww:"",
      returnn:"",
      namee:"",
      statuss:"",
    }
  },
  handleFileChange(file, fileList) {
        // 由于 Element UI 的上传组件会将文件转换为 Blob，这里我们直接使用文件对象
      console.log(typeof file)
        this.form.file = file.raw;
  },
  handleSelectionChange(val) {  
      this.multipleSelection = val; 
        
    },  
    handleDelete() {  
     
      
      const set = new Set(this.multipleSelection);  
      this.tableData = this.tableData.filter(item => !set.has(item));  
     
      this.multipleSelection = [];  
      let i=0;
      for(i=0;i<this.tableData.length;i++) this.tableData[i].id=(i+1);
       
  
    },  

  submitForm() {
 
    const newRow = {
    id: this.tableData.length + 1,
      material:this.form.materiall,
      borrow:this.form.borroww,
      return:this.form.returnn,
      name:this.form.namee,
      status:this.form.statuss,
   
    };

    // 将新行添加到表格数据数组中
    this.tableData.push(newRow);

    // 重置表单
    this.resetForm();
    let i=0;
    for(i=0;i<this.tableData.length;i++) this.tableData[i].id=(i+1);

    // 关闭对话框
    this.dialogVisible = false;
  },
      parsePrice(price) {
          // 将数字转换为字符串，并固定两位小数
          if (price === undefined) {
              return price
          }
          else {
              price = Number(price)
              const priceStr = price.toFixed(2);
              // 使用正则表达式将字符串中的数字每三位一组，并用逗号分隔
              const formattedPrice = priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              return formattedPrice;
          }
      },
      handlePictureChange(event, item) {
          const file = event.target.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                  item.picture = e.target.result; // 设置图片预览
                  item.isEditing = false; // 完成上传后关闭编辑状态
              };
              reader.readAsDataURL(file);
          }
      },
      toggleEditing(item) {
          console.log(item)
          item.isEditing = true;
      },
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
                  const title = ["xiangguandanwei", "xiangmumingcheng", "hetongjine_", "hetongjine", "jiesuanjine", "progress", "yingshoukuan", "shishoukuan", "yingshouweishou", "zaicishoukuan", "yingshouweishou2"]
                  // 解析工作表数据
                  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                  console.log('解析后的数据为：', jsonData)
                  for (let i = 4; i < jsonData.length; i++) {
                      let obj = {};
                      if (jsonData[i].length == 0) {
                          continue
                      }
                      for (let j = 0; j < jsonData[i].length; j++) {
                          if (typeof jsonData[i][j] === 'number') {
                              obj[title[j]] = jsonData[i][j].toFixed(2);
                          } else {
                              obj[title[j]] = jsonData[i][j];
                          }

                      }
                      obj["isEditing"] = false
                      that.tableData.push(obj)
                  }

              };
          }
      },

  },
};
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