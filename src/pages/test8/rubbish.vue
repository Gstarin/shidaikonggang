shuizh<template>
    <div class="tables-basic">
     
 
      <b-row>
        <b-col>
          <Widget title="<h5>生活垃圾运输表</h5>" customHeader settings close>
            <div class="table-header">
           
              <div class="block" style="margin-right: 15px;">
  
                <el-date-picker v-model="selectMonth" type="month" placeholder="选择年月"    @change="handle" value-format="yyyy-MM" style="margin-right: 15px"></el-date-picker>
                <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"
                @click="save">保存</b-button>
  </div>
   
            </div>
            <div id="table">
                <div style=" display: flex;">
        <el-input   v-model="company[0]"  placeholder="输入公司1"></el-input>  &nbsp; &nbsp;
        <el-input   v-model="company[1]"  placeholder="输入公司2"></el-input>   &nbsp; &nbsp;
        <el-input   v-model="company[2]"  placeholder="输入公司3"></el-input>   &nbsp; &nbsp;
        <el-input   v-model="company[3]"  placeholder="输入公司4"></el-input>   &nbsp; &nbsp;
        <el-input   v-model="company[4]"  placeholder="输入公司5"></el-input>  
    </div>
              <el-table :data="current" style="width: 100%" >

                <el-table-column  label="公司名称" >
                    <el-table-column prop="date" label="日期" >
              
                     </el-table-column>
                </el-table-column>
                <el-table-column  :label="company[0]"  >
                    <el-table-column prop="car1" label="车数" >
                        <template slot-scope="scope">  
          <el-input type="number"  v-model.number="scope.row.car1" ></el-input>  
        </template>
                     </el-table-column>
                     <el-table-column prop="weight1" label="重量（吨）" >
                        <template slot-scope="scope">  
          <el-input   v-model="scope.row.weight1" ></el-input>  
        </template>
                     </el-table-column>
                </el-table-column>

                <el-table-column  :label="company[1]"  >
                    <el-table-column prop="car2" label="车数" >
                        <template slot-scope="scope">  
          <el-input   v-model="scope.row.car2" ></el-input>  
        </template>
                     </el-table-column>
                     <el-table-column prop="weight2" label="重量（吨）" >
                        <template slot-scope="scope">  
          <el-input   v-model="scope.row.weight2" ></el-input>  
        </template>
                     </el-table-column>
                </el-table-column>

                <el-table-column  :label="company[2]"  >
                    <el-table-column prop="car3" label="车数" >
                        <template slot-scope="scope">  
          <el-input   v-model="scope.row.car3" ></el-input>  
        </template>
                     </el-table-column>
                     <el-table-column prop="weight3" label="重量（吨）" >
                        <template slot-scope="scope">  
          <el-input   v-model="scope.row.weight3" ></el-input>  
        </template>
                     </el-table-column>
                </el-table-column>

                <el-table-column  :label="company[3]"  >
                    <el-table-column prop="car4" label="车数" >
                        <template slot-scope="scope">  
          <el-input   v-model="scope.row.car4" ></el-input>  
        </template>
                     </el-table-column>
                     <el-table-column prop="weight4" label="重量（吨）" >
                        <template slot-scope="scope">  
          <el-input   v-model="scope.row.weight4" ></el-input>  
        </template>
                     </el-table-column>
                </el-table-column>

                <el-table-column  :label="company[4]"  >
                    <el-table-column prop="car5" label="车数" >
                        <template slot-scope="scope">  
          <el-input   v-model="scope.row.car5" ></el-input>  
        </template>
                     </el-table-column>
                     <el-table-column prop="weight5" label="重量（吨）" >
                        <template slot-scope="scope">  
          <el-input   v-model="scope.row.weight5" ></el-input>  
        </template>
                     </el-table-column>
                </el-table-column>
            <el-table-column label="总车数" prop="car">
                <template slot-scope="scope">
<span>{{parseFloat(( Number(scope.row.car1)+Number(scope.row.car2)+Number(scope.row.car3)+Number(scope.row.car4)+Number(scope.row.car5)).toFixed(2)) }}</span>

                </template>
        </el-table-column>
        <el-table-column label="总重量（吨）" prop="weight">
<template slot-scope="scope">
  <span>{{parseFloat( (Number(scope.row.weight1)+Number(scope.row.weight2)+Number(scope.row.weight3)+Number(scope.row.weight4)+Number(scope.row.weight5)).toFixed(2) )}}</span>

</template>                
            </el-table-column>
              
           
  
              </el-table>
              <table v-if="this.selectMonth" style="width: 100%;border-collapse: separate;border-spacing: 55px;">
                <tr style="color: red;left: 55px;">
                  <td>总计</td>
                  <td>{{ (this.total[0]).toFixed(2) }}</td>
                  <td>{{ this.total[1].toFixed(2) }}</td>
                  <td>{{ this.total[2].toFixed(2) }}</td>
                  <td>{{ this.total[3].toFixed(2) }}</td>
                  <td>{{ this.total[4].toFixed(2) }}</td>
                  <td>{{ this.total[5].toFixed(2) }}</td>
                  <td>{{ this.total[6].toFixed(2) }}</td>
                  <td>{{ this.total[7].toFixed(2) }}</td>
                  <td>{{ this.total[8].toFixed(2) }}</td>
                  <td>{{ this.total[9].toFixed(2) }}</td>
                  <td>{{ (this.total[0]+this.total[2]+this.total[4]+this.total[6]+this.total[8]).toFixed(2) }}</td>
                  <td>{{ (this.total[1]+this.total[3]+this.total[5]+this.total[7]+this.total[9]).toFixed(2) }}</td>

                </tr>
              </table>
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
    name: 'rubbish',
    components: { Widget, Sparklines },
    data() {
      return {
        month:[31,28,31,30,31,30,31,31,30,31,30,31],
        // company1:"",
        // company2:"",
        // company3:"",
        // company4:"",
        // company5:"",
        company:["","","","",""],
        yy:0,
        mm:0,
        selectMonth:null,
        file: null,
        currentPage: 1,
        tableData: [],
        search:"",
        dialogVisible: false, // 控制对话框的显示与隐藏  
        path:"",
        total:[0,0,0,0,0,0,0,0,0,0,0,0]

      };
    },
    mounted() {
    

     
    
      
    },
    beforeDestroy() {
    
    },
    computed: {

         
    
        

      current() {
        
        const start = (this.currentPage - 1) * 20;
        const end = start + 20;
        
      
        return this.tableData.slice(start, end);
      },
      rows() {
        return this.tableData.length
      },
    },
    methods: {
      save(){
        let i=0;
        this.total=[0,0,0,0,0,0,0,0,0,0,0,0];
        for(i=0;i<this.tableData.length;i++)
        {
          this.total[0]+=Number(this.tableData[i].car1);
          

          this.total[1]+=Number(this.tableData[i].weight1);
          this.total[2]+=Number(this.tableData[i].car2);
          this.total[3]+=Number(this.tableData[i].weight2);
          this.total[4]+=Number(this.tableData[i].car3);
          this.total[5]+=Number(this.tableData[i].weight3);
          this.total[6]+=Number(this.tableData[i].car4);
          this.total[7]+=Number(this.tableData[i].weight4);
          this.total[8]+=Number(this.tableData[i].car5);
          this.total[9]+=Number(this.tableData[i].weight5);
          this.total[10]+=Number(this.tableData[i].car);
          this.total[11]+=Number(this.tableData[i].weight);

        }
        for(i=0;i<12;i++)
        {
          this.total[i]=parseFloat(this.total[i].toFixed(2))
        }
        axios.post('/api/save/rubbish',  [this.tableData,this.path], {
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

        axios.post('/api/save/company',  [this.company,this.path], {
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
        handle(){
          const datee = new Date(this.selectMonth); 
          this.yy=datee.getFullYear();
         this.mm=datee.getMonth()+1;
        let day=this.month[this.mm-1];
          this.path=this.yy+"-"+this.mm;

          axios.post('/api/data/company',{ iddd: this.path }, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
         console.log('Fetched JSON:', response.data);
        this.company = response.data
      })



          axios.post('/api/data/rubbish',{ iddd: this.path }, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
         console.log('Fetched JSON:', response.data);
        this.tableData = response.data
        console.log(this,this.tableData)
        if(this.tableData.length==undefined)
        this.tableData=[]
        console.log(this.tableData.length)
        if(this.tableData.length<2)
        {

          let i=0;
        for(i=0;i<day;i++)
        {
         this.tableData.push({date:this.yy+"-"+this.mm+"-"+(i+1),car1:"",weight1:"",car2:"",weight2:"",car3:"",weight3:"",car4:"",weight4:"",car5:"",weight5:""})   
        }
        }
       let i=0;
        this.total=[0,0,0,0,0,0,0,0,0,0,0,0];
        for(i=0;i<this.tableData.length;i++)
        {
          this.total[0]+=Number(this.tableData[i].car1);
          

          this.total[1]+=Number(this.tableData[i].weight1);
          this.total[2]+=Number(this.tableData[i].car2);
          this.total[3]+=Number(this.tableData[i].weight2);
          this.total[4]+=Number(this.tableData[i].car3);
          this.total[5]+=Number(this.tableData[i].weight3);
          this.total[6]+=Number(this.tableData[i].car4);
          this.total[7]+=Number(this.tableData[i].weight4);
          this.total[8]+=Number(this.tableData[i].car5);
          this.total[9]+=Number(this.tableData[i].weight5);
          this.total[10]+=Number(this.tableData[i].car);
          this.total[11]+=Number(this.tableData[i].weight);

        }
        for(i=0;i<12;i++)
        {
          this.total[i]=parseFloat(this.total[i].toFixed(2))
        }

      }).catch(error => {
        console.error('Error fetching JSON:', error);
        // console.log(this.path)
      });


        
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
            const title = ["id","date",
"louhao",
"name",
"money",
"date2",
"number",
"beizhu"]
            // 解析工作表数据
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            console.log('解析后的数据为：', jsonData)
            for (let i = 1; i < jsonData.length; i++) {
              let obj = {};
              if (jsonData[i].length == 0) {
                continue
              }
              for (let j = 0; j < jsonData[i].length; j++) {
                if(title[j]=="date"||title[j]=="date2"){
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
    //   background-color: transparent !important;
       border:none;
       color: black;
      // box-shadow: 1px 1px 5px 1px  RGB(128,255,255,0.8) inset;
      // height: 30px;
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
      color: white;
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
  
  
  }
  </style>