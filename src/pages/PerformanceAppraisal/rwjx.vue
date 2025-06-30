<template>
    <div class="tables-basic">
      <b-breadcrumb>
        <b-breadcrumb-item>绩效考核</b-breadcrumb-item>
        <b-breadcrumb-item active>任务绩效</b-breadcrumb-item>
      </b-breadcrumb>
      <!-- <h2 class="page-title">市政公司支出信息</h2> -->
      <b-row>
        <b-col>
          <Widget title="<h5>任务绩效</h5>" customHeader settings close>
            <div class="table-header">
              <b-form-file v-model="file" placeholder="请选择一个Excel文件" style="margin-right: 15px; width:300px"></b-form-file>
              <el-date-picker v-model="selectMonth" type="month" placeholder="选择年月"    @change="handleChange" value-format="yyyy-MM" style="margin-right: 15px"></el-date-picker>
              <b-input type="text" v-model="search" style="width: 360px;height: 35px;margin:0 15px;"
              placeholder="Search..." />
            </div>
            <div class="table-header">
              <b-button variant="default" class="mr-3" size="sm" @click="parseExcel"
                style="width: 110px;height: 35px;">解析Excel</b-button>
                <b-button variant="default" class="mr-3" size="sm"
                style="width: 110px;height: 35px;" @click="handleExportTable('PerformanceTable1')">下载模板</b-button>
                <b-button variant="default" class="mr-3" size="sm"
                style="width: 110px;height: 35px;" @click="handleExportTable('Table')">导出文件</b-button>
              <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="dialogVisible = true">增加</b-button>
              <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="handleDelete" >删除</b-button>
                <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="save" >保存</b-button>
                <el-select v-model="selectedbumen" placeholder="选择部门" style="width: 120px; margin-right: 15px;">
              <el-option
                value=""
                label="全部">
              </el-option>
              <el-option
                v-for="year in availableYears"
                :key="year"
                :label="year"
                :value="year">
              </el-option>
            </el-select>
            </div>

            <el-dialog :visible.sync="dialogVisible" title="上传">
					      <el-form ref="form" :model="form" label-width="140px">
					        <el-form-item label="部门">
					          <el-input v-model="form.bumen" ></el-input>
					        </el-form-item>
                  <el-form-item label="日期">
					          <el-input v-model="form.time" ></el-input>
					        </el-form-item>
					        <el-form-item label="项目">
					          <el-input v-model="form.xmm" ></el-input>
					        </el-form-item>
					        <el-form-item label="项目定义">
                                <el-input v-model="form.xmdyy" ></el-input>
					        </el-form-item>
					        <el-form-item label="直接负责人">
					          <el-input type="input" v-model="form.namee"></el-input>
					        </el-form-item>
                            <el-form-item label="完成标志">
                                <el-input v-model="form.signall" ></el-input>
					        </el-form-item>
                            <el-form-item label="完成时限/频次">
                                <el-input v-model="form.shixiann" ></el-input>
					        </el-form-item>
                            <el-form-item label="当前完成进度">
                                <el-input v-model="form.jinduu" ></el-input>
					        </el-form-item>
                            <el-form-item label="是否按目标时限/记录次数完成（是、否、暂停、持续推进）">
                                <el-input v-model="form.shifouu" ></el-input>
					        </el-form-item>
                            <el-form-item label="未完成原因（主观）">
                                <el-input v-model="form.positivee" ></el-input>
					        </el-form-item>
                            <el-form-item label="未完成原因（客观）">
                                <el-input v-model="form.objectivee" ></el-input>
					        </el-form-item>
                            <el-form-item label="延期天数">
                                <el-input v-model="form.dayy" ></el-input>
					        </el-form-item>
                            <el-form-item label="预计完成日期">
                                <el-input v-model="form.dayy" ></el-input>
					        </el-form-item>

                            <el-form-item label="完成结果证明材料">
                                <el-input v-model="form.dayy" ></el-input>
					        </el-form-item>






					      </el-form>
					      <span slot="footer" class="dialog-footer">
					        <el-button @click="dialogVisible = false" >取 消</el-button>
					        <el-button type="primary" @click="submitForm">确 定</el-button>
					      </span>
					</el-dialog>


            <div id="table">
              <el-table :data="current" style="width: 100%"  @selection-change="handleSelectionChange" id="Table">
                <el-table-column type="selection" label="序号">
  
                </el-table-column>
                <el-table-column prop="bumen" label="部门">
  
</el-table-column>
<el-table-column prop="time" label="日期">
  
</el-table-column>
                <el-table-column prop="xm" label="项目">
  
                </el-table-column>
                <el-table-column prop="xmdy" label="项目定义">
  
                </el-table-column>
                <el-table-column prop="name" label="直接负责人">
  
                </el-table-column>
                <el-table-column prop="signal" label="完成标志">
  
                </el-table-column>
                <el-table-column prop="shixian" label="完成时限/频次">
  
                </el-table-column>
                <el-table-column prop="jindu" label="当前完成进度">
  
                </el-table-column>
                <el-table-column prop="shifou" label="是否按目标时限/记录次数完成（是、否、暂停、持续推进）">
  
                </el-table-column>

                
            <el-table-column label="未完成原因">
             
                <el-table-column prop="positive" label="主观原因">
  
                </el-table-column>
                <el-table-column prop="objective" label="客观原因">
  
                </el-table-column>
                
            </el-table-column>

            <el-table-column label="延期完成情况">
                <el-table-column prop="day" label="延期天数">
  
                </el-table-column>
                <el-table-column prop="estimate" label="预计完成日期">
  
                </el-table-column>
                
            </el-table-column>
                <el-table-column prop="file" label="完成结果证明材料" width="90">
                  <template slot-scope="scope">  
                            <!-- <b-button variant="default" class="mr-3" size="sm" @click="upload_pdf(scope.row.id)"
                          style="width: 70px;height: 35px;">上传</b-button>
                          <br> <br> -->
                         
                      <b-button variant="default" class="mr-3" size="sm" style="width: 70px;height: 35px;"
                          @click="edit(scope.row.xm)">查看</b-button>
                            </template >  
                </el-table-column>
               
  
              </el-table>
              <el-table  style="display: none;width: 100%"  @selection-change="handleSelectionChange" id="PerformanceTable1" >
            
                
                <el-table-column prop="bumen" label="部门">
  
</el-table-column>
                <el-table-column prop="time" label="日期">
  
</el-table-column>
<el-table-column prop="xm" label="项目">
  
</el-table-column>
                <el-table-column prop="xmdy" label="项目定义">
  
                </el-table-column>
                <el-table-column prop="name" label="直接负责人">
  
                </el-table-column>
                <el-table-column prop="signal" label="完成标志">
  
                </el-table-column>
                <el-table-column prop="shixian" label="完成时限/频次">
  
                </el-table-column>
                <el-table-column prop="jindu" label="当前完成进度">
  
                </el-table-column>
                <el-table-column prop="shifou" label="是否按目标时限/记录次数完成（是、否、暂停、持续推进）">
  
                </el-table-column>

                
            <el-table-column >
          
                <el-table-column prop="positive" label="主观原因">
  
                </el-table-column>
                <el-table-column prop="objective" label="客观原因">
  
                </el-table-column>
           
            </el-table-column>

            <el-table-column label="延期完成情况">
                <el-table-column prop="day" label="延期天数">
  
                </el-table-column>
                <el-table-column prop="estimate" label="预计完成日期">
  
                </el-table-column>
                
            </el-table-column>
                <el-table-column prop="file" label="完成结果证明材料" width="90">
                  <template slot-scope="scope">  
                            <!-- <b-button variant="default" class="mr-3" size="sm" @click="upload_pdf(scope.row.id)"
                          style="width: 70px;height: 35px;">上传</b-button>
                          <br> <br> -->
                         
                      <b-button variant="default" class="mr-3" size="sm" style="width: 70px;height: 35px;"
                          @click="download_pdf(scope.row.id)">查看</b-button>
                            </template >  
                </el-table-column>
               
  
              </el-table>
            </div>
  
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
  import {export_excel} from '@/utils/exportExcel.js'
  export default {
    name: 'rwjx',
    components: { Widget, Sparklines },
    data() {
      return {
        selectedbumen:"",
        selectMonth:'',
        path:"",
        search:"",
        file: null,
        currentPage: 1,
        tableData: [],
        dialogVisible: false,
        project_id:2,
        multipleSelection : [],  
			form: {
        time:"",
			  bumen:"",
              xmm:"",
              xmdyy:"",
              namee:"",
              signall:"",
              shixiann:"",
              jinduu:"",
              shifouu:"",
              positivee:"",
              objectivee:"",
              dayy:"",
              estimatee:"",
              filee:"",
			
			},
      };
    },
    // mounted() {
    //   axios.get('/api/data/rwjx').then(response => {
    //     // console.log('Fetched JSON:', response.data);
    //     this.tableData = response.data
    //   }).catch(error => {
    //     console.error('Error fetching JSON:', error);
    //   });
    // },
    beforeDestroy() {
      axios.post('/api/save/rwjx',  [this.tableData, this.path], {
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
      availableYears() {
      const years =new Set([...this.tableData.map(item => item.bumen)].filter(Boolean));
      return Array.from(years).sort();
    },
      filteredItems() {
            return this.tableData.filter(item => {
                const matchesSearch = this.search === "" || 
                    (item.bumen && String(item.bumen).includes(this.search)) ;
                    const matchesYear = this.selectedbumen === '' || item.bumen === this.selectedbumen 
             
                 

                return matchesSearch&&matchesYear ;
            });
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
      
      handleExportTable(table_id) {
            this.$nextTick(function () {
                export_excel(table_id)
            })

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
             vm.tableData[id-1].status="已上传"
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


      handleSelectionChange(val) {  
      this.multipleSelection = val; 
        
    },  
    save(){
      axios.post('/api/save/rwjx',  [this.tableData, this.path], {
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
    handleDelete() {  
     
     
       
      const set = new Set(this.multipleSelection);  
      this.tableData = this.tableData.filter(item => !set.has(item));  
     
      this.multipleSelection = [];  
      let i=0;
        for(i=0;i<this.tableData.length;i++) this.tableData[i].id=(i+1);
  
    },  

        handleChange() {  
      // 处理值的变化，如果需要的话  
      if (this.selectMonth) {
        const [year, month] = this.selectMonth.split('-');
        this.path = `${year}-${month}`;
        // this.fetchDataForMonth();  // 调用获取数据的方法
        console.log(this.path)
        axios.post('/api/data/rwjx', { iddd: this.path }, {
        headers: { 'Content-Type': 'application/json' },
      }).then(response => {
        this.tableData = response.data ;
        if(this.tableData.length==undefined) this.tableData=[]
       
      }).catch(error => {
        console.error('Error fetching data:', error);
      });
      }
    },  

        resetForm() {
		  this.form = {
            bumen:"",
              xmm:"",
              xmdyy:"",
              namee:"",
              signall:"",
              shixiann:"",
              jinduu:"",
              shifouu:"",
              positivee:"",
              objectivee:"",
              dayy:"",
              estimatee:"",
              filee:"",
		  }
		},

        submitForm() {
		  console.log(typeof this.form.file)
		  const newRow = {
			id: this.tableData.length + 1,
      time:this.form.time,
			bumen:this.form.bumen,
			xm: this.form.xmm,
            xmdy: this.form.xmdyy,
            name: this.form.namee,
            signal: this.form.signall,
            shixian: this.form.shixiann,
            jindu: this.form.jinduu,
            shifou: this.form.shifouu,
            positive: this.form.positivee,
            objective: this.form.objectivee,
            day: this.form.dayy,
            estimate: this.form.estimatee,
            file: this.form.filee
		  };
      let i=0;
        for(i=0;i<this.tableData.length;i++) this.tableData[i].id=(i+1);
	
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
      edit(name) {
        // this.dialogVisible1=true,
        // this.choice=id-1;

        this.$router.push({
          path:"/app/PerformanceAppraisal/zhengming?name=" + name,
          query: {  
    name: name  
  }  
      })
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
            const title = ["bumen","time","xm","xmdy","name","signal","shixian","jindu","shifou","positive","objective","day","estimate"]
            // 解析工作表数据
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            // console.log('解析后的数据为：', jsonData)
            for (let i = 2; i < jsonData.length; i++) {
              let obj = {};
              if (jsonData[i].length == 0) {
                continue
              }
              for (let j = 0; j < jsonData[i].length; j++) {
              
                if(title[j]=="time"||title[j]=="estimate"||title[j]=="shixian"){
                  const epoch =  new Date(Date.UTC(1899, 11, 30));  
    const offset = jsonData[i][j] ; // 1904年模式需要额外减去2天，因为Excel错误地将1900年视为闰年  
    obj[title[j]]=new Date(epoch.getTime() + (offset * 24 * 60 * 60 * 1000)).toLocaleDateString();  

                  // obj[title[j]]= moment(jsonData[i][j ])
                }
              else{
                  obj[title[j]] = jsonData[i][j]
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