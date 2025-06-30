<template>
    <div class="tables-basic">
        <b-breadcrumb>
            <b-breadcrumb-item>其他费用</b-breadcrumb-item>
            <b-breadcrumb-item active>其他费用</b-breadcrumb-item>
        </b-breadcrumb>
        <!-- <h2 class="page-title">市政公司支出信息</h2> -->
        <b-row>
            <b-col>
                <Widget title="<h5>费用明细</h5>" customHeader settings close>
                    <div class="table-header"
                        style="width: 100%;display: flex;justify-content: center;margin-bottom: 15px;">
                        <b-input type="text" v-model="search" style="width: 360px;height: 35px;margin:0 15px;"
                            placeholder="Search..." />
                        <b-button variant="default" class="mr-3" size="sm" @click="dialogVisible = true"
                            style="width: 110px;height: 35px;">增加</b-button>
                        <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"
                             @click="handleDelete">删除</b-button>

                    </div>
                    <div id="table">
                        <el-table :data="current" style="width: 100%"  @selection-change="handleSelectionChange">

                            <el-table-column type="selection" width="80">

                            </el-table-column>
                            <el-table-column prop="xmmc" label="费用类型" >

                            </el-table-column>
                            <el-table-column prop="time" label="金额">

                            </el-table-column>
                            


                        </el-table>
                    </div>
					<el-dialog :visible.sync="dialogVisible" title="上传日志">
					      <el-form ref="form" :model="form" label-width="120px">
                            <el-form-item label="费用类型">
					          <el-input v-model="form.xmmcc" ></el-input>
					        </el-form-item>
					        <el-form-item label="金额">
					          <el-input v-model="form.date" ></el-input>
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
    </div>
</template>

<script>

import Widget from '@/components/Widget/Widget';
import Sparklines from '../../components/Sparklines/Sparklines'
import * as XLSX from 'xlsx/xlsx.mjs'
import axios from '@/utils/axios.js'

export default {
    name: 'guanli2',
    components: { Widget, Sparklines },
    data() {
        return {
			dialogVisible: false,
            multipleSelection : [],  
			form: {
			  date:"", // 当前日期
			  namee: '', // 操作人
			  xmmcc:"",
              jinduu:"",
              beizhuu:"",
              pizhuu:"",
			},
            file: null,
            currentPage: 1,
            search: "",
            tableData: [],
			namee:""
        };
    },
    mounted() {


         this.namee = this.$route.query.name;  
    console.log(this.namee); // 输出从上一个页面传递过来的id值
        
    axios.post('/api/save/sc2', { "iddd": this.namee }, {
              headers: {
                  'Content-Type': 'application/json',
              },
          })
          .then(response => {
                  console.log('市政公司收入表上传成功');
                  this.tableData=response.data
              })
              .catch(error => {
                  console.error('市政公司收入表文件时出错：', error);
              });
      
        

      
  },
  beforeDestroy() {
   
    console.log(this.namee)
      if (this.tableData.length > 0) {
          axios.post('/api/save/sc22', [this.tableData,this.namee], {
              headers: {
                  'Content-Type': 'application/json',
              },
          })
              .then(response => {
                  console.log('已成功上传');
              })
              .catch(error => {
                  console.error('市政公司收入表文件时出错：', error);
              });
      }
  },
    computed: {
        filteredItems() {
            // if (this.search != "") {
            //     return this.tableData.filter(item => {
            //         return ((item.xiangguandanwei != undefined && item.xiangguandanwei.includes(this.search)) ||
            //             (item.xiangmumingcheng != undefined && item.xiangmumingcheng.includes(this.search)));
            //     });
            // } else {
            //     return this.tableData
            // }
            return this.tableData
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
        handleSelectionChange(val) {  
      this.multipleSelection = val; 
        
    },  
    handleDelete() {  
     
     
       
      const set = new Set(this.multipleSelection);  
      this.tableData = this.tableData.filter(item => !set.has(item));  
     
      this.multipleSelection = [];  
  
    },  
		resetForm() {
		  this.form= {
			  date: "", // 当前日期
			  namee: '', // 操作人
			  xmmcc:"",
              jinduu:"",
              beizhuu:"",
              pizhuu:""
			}
		},
		handleFileChange(file, fileList) {
		      // 由于 Element UI 的上传组件会将文件转换为 Blob，这里我们直接使用文件对象
			  console.log(typeof file)
		      this.form.file = file.raw;
		},
		submitForm() {
		  console.log(typeof this.form.file)
		  const newRow = {
			id: this.tableData.length + 1,
			time: this.form.date,
			name: this.form.namee,
            jindu:this.form.jinduu,
            beizhu:this.form.beizhuu,
            xmmc:this.form.xmmcc,
            pizhu:this.form.pizhuu
			
		  };
	
		  // 将新行添加到表格数据数组中
		  this.tableData.push(newRow);
	
		  // 重置表单
		  this.resetForm();
	
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
      

    },
};
</script>

<style lang="scss" scoped>
@import '../../styles/app';
.form-control {  
  background-color: white !important; /* 使用 !important 确保覆盖其他样式 */  
}
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



}
</style>