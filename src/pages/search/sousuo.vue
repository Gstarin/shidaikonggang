<template>
    <div class="tables-basic">
        <b-breadcrumb>
            <b-breadcrumb-item>主页</b-breadcrumb-item>
            <b-breadcrumb-item active>全局搜索</b-breadcrumb-item>
        </b-breadcrumb>
        <!-- <h2 class="page-title">市政公司支出信息</h2> -->
        <b-row>
            <b-col>
                <Widget title="<h5>全局搜素</h5>" customHeader settings close>
                    <div class="table-header"
                        style="width: 100%;display: flex;justify-content: center;margin-bottom: 15px;">
                        <select id="selectLeo" class="form-control form-control-placeholder" v-model="select_" style="width: 20%;">
                          <option  :key="0" value=" " style="color: white;"></option>
              <option v-for="(item, index) in this.classs" :key="index+1" :value="item"  style="color: white;">{{item  }}</option>
             
          </select>
  
                        <b-input type="text" v-model="search" style="width: 80%;height: 35px;margin:0 15px;"
                            placeholder="Search..." />               
  
                    </div>
                    <div id="table" v-if="this.select_==='合同'">
                        <el-table :data="current" style="width: 100%" @cell-click="handleCellClick" class="custom-table"   >
  
                            <el-table-column prop="xiangguandanwei" label="相关单位" >

                            </el-table-column>
                            <el-table-column prop="xiangmumingcheng" label="项目名称" >

                            </el-table-column>
                            <el-table-column prop="hetongmingcheng" label="合同名称">

                            </el-table-column>
                            <el-table-column prop="hetongjine" label="合同金额(万元)">

                            </el-table-column>
                            <el-table-column prop="jiesuanjine" label="结算金额(万元)">

                            </el-table-column>
                            
                            <el-table-column prop="yingfukuan" label="应付款">

                            </el-table-column>
                            <el-table-column prop="shifukuan" label="实付款">

                            </el-table-column>
                            <el-table-column prop="yingfuweifu" label="应付未付">

                            </el-table-column>
                            <el-table-column prop="guazhangjine" label="挂账金额">

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
  
  export default {
    name: 'jygl',
    components: { Widget, Sparklines },
    data() {
        return {
          select_:" ",
        classs:["合同","其他"],
   
    
            file: null,
            currentPage: 1,
            search: "",
            tableData: [],
            multipleSelection: [] 
        };
    },
    mounted() {
        axios.get('/api/data/disburse').then(response => {
            console.log('Fetched JSON:', response.data);
            this.tableData = response.data
        }).catch(error => {
            console.error('Error fetching JSON:', error);
        });


//加入其他需要放到搜索的json
        // axios.get('/api/data/jygl').then(response => {
        //     console.log('Fetched JSON:', response.data);
        //     this.tableData.push(...response.data)

        // }).catch(error => {
        //     console.error('Error fetching JSON:', error);
        // });


        // axios.get('/api/data/jygl').then(response => {
        //     console.log('Fetched JSON:', response.data);
        //     this.tableData.push(...response.data)
        // }).catch(error => {
        //     console.error('Error fetching JSON:', error);
        // });



    },

    computed: {
        filteredItems() {
          let temp=[];
            if (this.search != "") {
                temp= this.tableData.filter(item => {
                    return ((item.hetongmingcheng != undefined && item.hetongmingcheng.includes(this.search)) )
                });

                return temp;
            } 
  
            else if(this.select_===" ")
            {
                return [];
            }
  
         
            else
             {
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
  
  #aaa :hover{
    cursor: pointer;
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