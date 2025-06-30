<template>
    <div class="tables-basic">
      <b-row>
        <b-col>
          <Widget title="<h5>车辆管理</h5>" customHeader settings close>
            <div class="table-header">
              <b-form-file v-model="file" placeholder="请选择一个Excel文件" style="margin-right: 15px;width: 380px"></b-form-file>
              <div class="block" style="margin-right: 15px;">
                <!-- <el-date-picker v-model="selectMonth" type="month" placeholder="选择年月"    @change="handle" value-format="yyyy-MM" style="margin-right: 15px"></el-date-picker> -->
              </div>
              <b-button variant="default" class="mr-3" size="sm" @click="parseExcel"
                style="width: 110px;height: 35px;">解析Excel</b-button>
              <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="handleExportTable('DisburseTable1')">下载模板</b-button>
              <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"  @click="submitForm">增加</b-button>
              <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="handleDelete" >删除</b-button>
              <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="save" >保存</b-button>
              <!-- <b-input type="text" v-model="search" style="width: 360px;height: 35px;margin:0 15px;"
              placeholder="Search..." /> -->
            </div>
            <div id="table" style="width: 100%; overflow-x: auto;"  >
              <el-table :data="current"  @cell-dblclick="handleCellDblclick"  @selection-change="handleSelectionChange" class="custom-table">
                <el-table-column type="selection" label="序号" width="55">
                </el-table-column>
                <el-table-column prop="id" label="序号" width="55">
                </el-table-column>
              
                <el-table-column prop="car" label="车辆类型" >
                  <template slot-scope="scope">  
                    <el-input v-model="scope.row.car"></el-input>  
                  </template>
                </el-table-column>
          
                <el-table-column prop="car_id" label="车牌号"  >
                  <template slot-scope="scope">  
                    <el-input v-model="scope.row.car_id"></el-input>  
                  </template>
                </el-table-column>
                <el-table-column prop="driver" label="驾驶员"  >
                  <template slot-scope="scope">  
                    <el-input v-model="scope.row.driver"></el-input>  
                  </template>
                </el-table-column>
                <el-table-column prop="phone" label="联系电话"  >
                  <template slot-scope="scope">  
                    <el-input v-model="scope.row.phone"></el-input>  
                  </template>
                </el-table-column>
                <el-table-column prop="beizhu" label="备注" >
                  <template slot-scope="scope">  
                    <el-input v-model="scope.row.beizhu"></el-input>  
                  </template>
                </el-table-column>
               
              
              </el-table>
  
              <el-table  id="DisburseTable1" style="display: none;width: 100%" @cell-dblclick="handleCellDblclick"  @selection-change="handleSelectionChange" class="custom-table">
                <!-- DisburseTable1 的列定义与上面相同 -->
                
                <el-table-column prop="id" label="序号" width="55">
                </el-table-column>
              
                <el-table-column prop="car" label="车辆类型" >
                  <template slot-scope="scope">  
                    <el-input v-model="scope.row.car"></el-input>  
                  </template>
                </el-table-column>
          
                <el-table-column prop="car_id" label="车牌号"  >
                  <template slot-scope="scope">  
                    <el-input v-model="scope.row.car_id"></el-input>  
                  </template>
                </el-table-column>
                <el-table-column prop="driver" label="驾驶员"  >
                  <template slot-scope="scope">  
                    <el-input v-model="scope.row.driver"></el-input>  
                  </template>
                </el-table-column>
                <el-table-column prop="phone" label="联系电话"  >
                  <template slot-scope="scope">  
                    <el-input v-model="scope.row.phone"></el-input>  
                  </template>
                </el-table-column>
                <el-table-column prop="beizhu" label="备注" >
                  <template slot-scope="scope">  
                    <el-input v-model="scope.row.beizhu"></el-input>  
                  </template>
                </el-table-column>
               
              </el-table>
            </div>
  
            <el-dialog  
              title="修改值"  
              :visible.sync="dialogVisible"  
              width="30%"  
              @close="dialogVisible = false"  
            >  
              <el-input v-model="editingValue" placeholder="请输入新值"></el-input>  
              <span slot="footer" class="dialog-footer">  
                <el-button @click="dialogVisible = false">取 消</el-button>  
                <el-button type="primary" @click="updateValue">确 定</el-button>  
              </span>  
            </el-dialog>  
  
            <div class="table-footer">
              <b-pagination v-model="currentPage" :total-rows="rows" size="lg"></b-pagination>
            </div>
          </Widget>
        </b-col>
      </b-row>
    </div>
  </template>
    <script>
    import moment from 'moment';  
    import Widget from '@/components/Widget/Widget';
    import Sparklines from '../../components/Sparklines/Sparklines'
    import * as XLSX from 'xlsx/xlsx.mjs'
    import axios from '@/utils/axios.js'
      import {export_excel} from '@/utils/exportExcel.js'
    export default {
      name: 'd1',
      components: { Widget, Sparklines },
      data() {
        return {
          
          selectMonth:null,
          file: null,
          currentPage: 1,
          tableData: [],
          search:"",
          dialogVisible: false, // 控制对话框的显示与隐藏  
        editingRow: null, // 当前编辑的行数据  
        editingValue: '', // 输入框中的值  
        editingcolumn: null,
        multipleSelection : []
        };
      },
      mounted() {
        axios.get('/api/data/cq12').then(response => {
           console.log('Fetched JSON:', response.data);
          this.tableData = response.data
         
        }).catch(error => {
          console.error('Error fetching JSON:', error);
        });
  
       
      
        
      },
      beforeDestroy() {
        axios.post('/api/save/cq12', this.tableData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            console.log('上传成功');
          })
          .catch(error => {
            console.error('出错：', error);
          });
      },
      computed: {
        filteredItems() {
          let temp=[];
  
          if(this.selectMonth!=null )
          {
          
          let i=0;
          for(i=0;i<this.tableData.length;i++)
          {
           
            const datee = new Date(this.tableData[i].date1); 
           let yy=datee.getFullYear();
           let mm=datee.getMonth()+1;
           let t=0
           if(mm<10)
          t=yy+"-"+"0"+mm;
          else
          t=yy+"-"+mm;
          
        
          
            if(t===this.selectMonth)
            {
           
              temp.push(this.tableData[i])
            }
          }
          
          
        }
  
        else 
        {temp= this.tableData;}
  
  
  
        if (this.search != "") {
                temp= temp.filter(item => {
                    return ((item.number != undefined && String(item.number).includes(this.search))||
                    (item.name != undefined && String(item.name).includes(this.search)))
                });
            } 
  
  
  return temp;
            } ,
  
  
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
        save(){
            axios.post('/api/save/cq12', this.tableData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            console.log('上传成功');
          })
          .catch(error => {
            console.error('出错：', error);
          });
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
         id:this.tableData.length+1,date:null,louhao:"",name:"",money:"",time:"",number:"",beizhu:"",date2:null
           };
     
           
           this.tableData.push(newRow);
  
           let i=0;
           for(i=0;i<this.tableData.length;i++) this.tableData[i].id=(i+1);
         },
  
  
  
  handleCellDblclick(row, column, cell, event) {  
       this.editingRow = row.id; // 保存当前编辑的行数据 
       console.log(this.editingRow)
       this.editingcolumn= column.property;
     
       this.editingValue = row[column.property]; // 设置输入框的初始值为当前单元格的值  
       this.dialogVisible = true; // 显示对话框  
     },  
  
     isNumeric(str) {  
     return !isNaN(parseFloat(str)) && isFinite(str);  
  },  
  
     updateValue() {  
       if (this.editingRow && this.editingValue !== this.editingRow.value) {  
  
        
         if(!this.isNumeric(this.editingValue)){
         this.tableData[this.editingRow-1][this.editingcolumn] = this.editingValue;  }
     else
      this.tableData[this.editingRow-1][this.editingcolumn] = Number(this.editingValue);  
       }  
       this.dialogVisible = false; // 关闭对话框  }
     },  
  
     handleExportTable(table_id) {
              this.$nextTick(function () {
                  export_excel(table_id)
              })
  
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
              const title = ["id",
               "car",
               "car_id",
               "driver",
               "phone",
                "beizhu",
                
              ]
              // 解析工作表数据
              const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
              console.log('解析后的数据为：', jsonData)
              for (let i = 1; i < jsonData.length; i++) {
                let obj = {};
                if (jsonData[i].length == 0) {
                  continue
                }
                for (let j = 0; j < jsonData[i].length; j++) {
                  if(title[j]=="date1"||title[j]=='date2'){
                    const epoch =  new Date(Date.UTC(1899, 11, 30));  
      const offset = jsonData[i][j] ; // 1904年模式需要额外减去2天，因为Excel错误地将1900年视为闰年  
      obj[title[j]]=new Date(epoch.getTime() + (offset * 24 * 60 * 60 * 1000));  
  
                    // obj[title[j]]= moment(jsonData[i][j ])
                  }
                  else if (typeof jsonData[i][j] === 'number') {
                    obj[title[j]] = jsonData[i][j];
                  } else {
                    obj[title[j]] = jsonData[i][j];
                  }
    
                }
             obj.id=i;
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
  
    ::v-deep .el-input__inner {
        background-color: transparent !important;
         border:none;
         color: black;
        // box-shadow: 1px 1px 5px 1px  RGB(128,255,255,0.8) inset;
        // height: 30px;
      }
      .custom-table {
    width: 100%;
    table-layout: fixed;
      }
  
      .custom-table ::v-deep .el-table__header-wrapper th {
        text-align: center;
        background-color: #f5f7fa;
      }
  
      .custom-table ::v-deep .el-table__body td {
        text-align: center;
      }
  
      .custom-table ::v-deep .el-input__inner {
        text-align: center;
      }
  
      .custom-table ::v-deep .el-input {
        width: 100%;
      }
  
      .custom-table ::v-deep .el-date-editor.el-input {
        width: 100%;
      }
    .table-header {
      width: 100%;
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
        color: #01010d;
      }
    
      // 表头高度
      ::v-deep .el-table__header th {
        padding: 0;
        height: 50px;
        line-height: 50px;
    
      }
    
      ::v-deep .el-table__body tr,
      ::v-deep.el-table__body td {
        padding: 0;
        height: 50px;
        line-height: 50px;
      }
    
      ::v-deep .el-table {
        background-color: transparent !important;
        color: #9f9fad;
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