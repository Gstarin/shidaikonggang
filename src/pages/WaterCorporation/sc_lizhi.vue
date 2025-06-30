<template>
    <div class="tables-basic">
      <b-breadcrumb>
        <b-breadcrumb-item>青清水务</b-breadcrumb-item>
        <b-breadcrumb-item active>地表水厂离职人员</b-breadcrumb-item>
      </b-breadcrumb>
      <b-row>
        <b-col>
          <Widget title="<h5>地表水厂离职人员</h5>" customHeader settings close>
            <div class="table-header">
              <b-form-file v-model="file" style="width: 50%;height: 65px;margin-left: 10px;" accept=".xlsx, .xls" placeholder="请选择一个Excel文件" class="mr-3"></b-form-file>
              <b-button variant="primary" style="width: 310px;height: 40px;margin-left: 10px;" @click="parseExcel">上传并解析</b-button>
              <!-- <b-button variant="default"  style="width: 310px;height: 40px;margin-left: 10px;"  @click="handleExportTable('DisburseTable')">导出Excel</b-button> -->
              <!-- <b-button variant="default"  style="width: 310px;height: 40px;margin-left: 10px;"  @click="handleExportTable('DisburseTable1')">下载模板</b-button> -->
              <b-button variant="default"  style="width: 310px;height: 40px;margin-left: 10px;"@click="addRecord">增加</b-button>
              <b-button variant="danger" style="width: 310px;height: 40px;margin-left: 10px;" @click="deleteSelectedRecords">删除</b-button>
              <!-- <el-date-picker v-model="selectMonth"  style="width: 600px;height: 65px;margin-left: 10px;"   type="month" placeholder="选择年月"    @change="handle" value-format="yyyy-MM" ></el-date-picker> -->
            </div>
            <div class="table-responsive" style="height: 500px; overflow-y: auto">
              <table class="table table-bordered" id="DisburseTable" style="width:2000px; ">
                <thead  id="DisburseTable1">
                  <tr>
                    <th><b-form-checkbox v-model="selectAll" @change="selectAllRecords"></b-form-checkbox></th>
                    <th>序号</th>
                    <th>姓名</th>
                    <th>性别</th>
                    <th>年龄</th>
                    <th>出生日期</th>
                    <th>身份证号</th>
                    <th>电话</th>
                    <th>岗位</th>
                    <th>入职时间</th>
                    <th>离职时间</th>
                    <th>劳动关系</th>
                    <th>工作地点</th>
                    <th>备注</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in items" :key="index" v-if="isMonthsEqual(row.time2)">
                    <td><b-form-checkbox v-model="row.selected"></b-form-checkbox></td>
                    <td><b-form-input v-model="row.time" /></td>
                    <td><b-form-input v-model="row.name" /></td>
                    <td><b-form-input v-model="row.danwei" /></td>
                    <td><b-form-input v-model="row.number" /></td>
                    <td>  <el-date-picker
        v-model="row.remaining"
        type="date"
        placeholder="选择日期" 
        style="width:150px" >
        
      
      </el-date-picker></td>
                    <td><b-form-input v-model="row.sunhao" /></td>
                    <td><b-form-input v-model="row.phone" /></td>
                    <td><b-form-input v-model="row.job" /></td>
                    <td>  <el-date-picker
        v-model="row.time2"
        type="date"
        placeholder="选择日期"  
        style="width:150px">
        
      
      </el-date-picker></td>
      <td>  <el-date-picker
        v-model="row.lizhi"
        type="date"
        placeholder="选择日期" 
        style="width:150px"  >
        
      
      </el-date-picker></td>
                    <td><b-form-input v-model="row.people" /></td>
                    <td><b-form-input v-model="row.jine" /></td>
                    <td><b-form-input v-model="row.note" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Widget>
        </b-col>
      </b-row>
    </div>
  </template>
  <script>
  import Vue from 'vue';
  import Widget from '@/components/Widget/Widget';
  import * as XLSX from 'xlsx/xlsx.mjs';
  import axios from '@/utils/axios.js';
  import { number } from '@amcharts/amcharts4/core';
    import {export_excel2} from '@/utils/exportExcel2.js'
  export default {
    name: 'WaterPacTable',
    components: { Widget },
    data() {
      return {
        selectMonth:null,
        file: null,
        items: [],
        selectAll: false,
      };
    },
    beforeDestroy() {
      axios.post('/api/save/sclizhi', this.items, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          console.log('记录上传成功:', response.data);
        }).catch(error => {
          console.error('记录上传出错:', error);
        });
    },
    mounted() {
      axios.get('/api/data/sclizhi').then(response => {
            // console.log('Fetched JSON:', response.data);
            this.items = response.data
        }).catch(error => {
            console.error('Error fetching JSON:', error);
        });
    },
  
  
    methods: {
      isMonthsEqual(x) {  
        // 确保两个值都有效  
        if(this.selectMonth==null) return true
     
        const datee = new Date(x); 
           let yy=datee.getFullYear();
           let mm=datee.getMonth()+1;
           let t=""
           if(mm<10)
           {
           t=yy+"-"+"0"+mm;
           }
          else
          {
         t=yy+"-"+mm;
          }
   if(this.selectMonth===t) return true;
   else return false;
          
      },  
  
      handleExportTable(table_id) {
              this.$nextTick(function () {
                  export_excel2(table_id)
              })
  
          },
  
          
      parseExcel() {
        if (this.file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
            // 解析Excel数据
            const parsedData = jsonData.slice(1).map(row => ({
              time: row[0],
              name: row[1],
              danwei: row[2],
              number: row[3],
              remaining: row[4],
              sunhao: row[5],
              phone: row[6],
              job: row[7],
              time2: row[8],
              lizhi: row[9],
              people: row[10],
              jine:row[11],
              note: row[12],
              selected: false
            }));
  
            this.items = parsedData;
  
          };
          reader.readAsArrayBuffer(this.file);
        }
      },
     
      addRecord() {
        this.items.push({
        //   time: '',
        //   name: '',
        //   danwei: '',
        //   number: '',
        //   remaining: '',
        //   sunhao:"",
        //   time2: '',
        //   people: '',
        //   jine:"",
        //   note: '',
        //   selected: false
        });
      },
      deleteSelectedRecords() {
        this.items = this.items.filter(item => !item.selected);
      },
      selectAllRecords() {
        this.items.forEach(item => {
          item.selected = this.selectAll;
        });
      }
    }
  };
  </script>
  <style lang="scss" scoped>
  @import '../../styles/app';
  .form-control {  
  background-color: white !important; /* 使用 !important 确保覆盖其他样式 */  
}
  .table-header {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;
  }
  .table-footer {
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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
  </style>
  