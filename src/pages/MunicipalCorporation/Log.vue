<template>
    <div class="tables-basic">
        <b-breadcrumb>
            <b-breadcrumb-item>市政公司</b-breadcrumb-item>
            <b-breadcrumb-item active>日志信息</b-breadcrumb-item>
        </b-breadcrumb>
        <!-- <h2 class="page-title">市政公司支出信息</h2> -->
        <b-row>
            <b-col>
                <Widget title="<h5>日志信息</h5>" customHeader settings close>
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

                            <el-table-column type="selection"width="80">

                            </el-table-column>
                            <el-table-column prop="date" label="时间" width="180">

                            </el-table-column>
                            <el-table-column prop="name" label="操作人" width="100">

                            </el-table-column>
                            <el-table-column prop="img" label="图片" width="120">
                                <template slot-scope="scope">
                                    <el-image style="width: 80px; height: 80px" :src="scope.row.img.url"
                                        :fit="scope.row.img.fit" :preview-src-list="scope.row.img.preview">
                                    </el-image>
                                </template>
                            </el-table-column>
                            <el-table-column prop="log" label="日志内容">

                            </el-table-column>

                        </el-table>
                    </div>
					<el-dialog :visible.sync="dialogVisible" title="上传日志">
					      <el-form ref="form" :model="form" label-width="120px">
					        <el-form-item label="当前日期">
					          <el-input v-model="form.date" readonly></el-input>
					        </el-form-item>
					        <el-form-item label="操作人">
					          <el-input v-model="form.operator" readonly></el-input>
					        </el-form-item>
					        <el-form-item label="上传图片">
					          <el-upload
					            action="#"
					            :on-change="handleFileChange"
					            :file-list="form.fileList"
					            :auto-upload="false"
					          >
					            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
					          </el-upload>
					        </el-form-item>
					        <el-form-item label="日志内容">
					          <el-input type="textarea" v-model="form.text"></el-input>
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
    name: 'Log',
    components: { Widget, Sparklines },
    data() {
        return {
			dialogVisible: false,
            multipleSelection : [],  
			form: {
			  date: new Date().toISOString().slice(0,10), // 当前日期
			  operator: '张三', // 操作人
			  fileList: [], // 文件列表
			  text: '' // 文字内容
			},
            file: null,
            currentPage: 1,
            search: "",
            tableData: [{
                id: 1,
                date: '2024-01-01 12:00:48',
                name:'张三',
                img: {
                    fit: 'fill',
                    url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                    preview: ['https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg']
                },
                log: '更新了hello world'
                
            }]
			
        };
    },
    mounted() {
      axios.get('/api/data/log').then(response => {
          // console.log('Fetched JSON:', response.data);
          this.tableData = response.data
      }).catch(error => {
          console.error('Error fetching JSON:', error);
          // 如果数据不存在，初始化为默认数组
          this.tableData = [{
              id: 1,
              date: '2024-01-01 12:00:48',
              name:'张三',
              img: {
                  fit: 'fill',
                  url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                  preview: ['https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg']
              },
              log: '更新了hello world'
          }];
      });
  },
  beforeDestroy() {
      if (this.tableData.length > 0) {
          axios.post('/api/save/log', this.tableData, {
              headers: {
                  'Content-Type': 'application/json',
              },
          })
              .then(response => {
                  console.log('日志信息保存成功');
              })
              .catch(error => {
                  console.error('日志信息保存失败：', error);
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
        handleSelectionChange(val) {  
      this.multipleSelection = val; 
        
    },  
    handleDelete() {  
     
     
       
      const set = new Set(this.multipleSelection);  
      this.tableData = this.tableData.filter(item => !set.has(item));  
     
      this.multipleSelection = [];  
  
    },  
		resetForm() {
		  this.form = {
			date: new Date().toISOString().slice(0, 10),
			operator: '',
			fileList: [],
			text: ''
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
			date: this.form.date,
			name: this.form.operator,
			img: {
			    fit: 'fill',
			    url: this.form.file ? URL.createObjectURL(this.form.file) : '',
			    preview: this.form.file ? [URL.createObjectURL(this.form.file)] : []
			},
			log: this.form.text
		  };
	
		  // 将新行添加到表格数据数组中
		  this.tableData.push(newRow);

		  // 立即保存
		  axios.post('/api/save/log', this.tableData, {
			  headers: {
				  'Content-Type': 'application/json',
			  },
		  })
		  .then(response => {
			  console.log('日志信息保存成功');
			  this.$message({
				  message: '日志添加成功',
				  type: 'success',
			  });
		  })
		  .catch(error => {
			  console.error('日志信息保存失败：', error);
			  this.$message({
				  message: '日志保存失败，请重试',
				  type: 'error',
			  });
		  });
	
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