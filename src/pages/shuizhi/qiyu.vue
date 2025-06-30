<template>
    <div class="tables-basic">
      <b-breadcrumb>
        <b-breadcrumb-item>污水处理厂</b-breadcrumb-item>
        <b-breadcrumb-item active>其余水样</b-breadcrumb-item>
      </b-breadcrumb>
      <b-row>
        <b-col>
          <Widget title="<h5>其余水样</h5>" customHeader settings close>
            <div class="table-header">
              <el-date-picker v-model="selectMonth" style="width: 600px; height: 65px; margin-left: 10px;" placeholder="选择日期" @change="handle"></el-date-picker>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b-button variant="default" class="mr-3" size="sm" style="width: 110px; height: 35px;" @click="save">保存</b-button>
            </div>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>备注</th>

                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in items" :key="index">
                    <td>{{ row.location }}</td>
                    <td class="text"><b-form-textarea style="height:300px" v-model="row.value" /></td>
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
  import axios from '@/utils/axios.js';
  
  export default {
    name: 'PHTable',
    components: { Widget },
    data() {
      return {
        selectMonth: null,
        items: [
          { location: "其余水样", value: "" },
       
        ],
        yy: 0,
        mm: 0,
        dd: 0,
        path: ""
      };
    },
    methods: {
      handle() {
        const datee = new Date(this.selectMonth);
        this.yy = datee.getFullYear();
        this.mm = datee.getMonth() + 1;
        this.dd = datee.getDate();
        this.path = this.yy + "-" + this.mm + "-" + this.dd;
        axios.post('/api/data/qiyu', { iddd: this.path }, {
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(response => {
          console.log('Fetched JSON:', response.data);
          if(response.data.length > 0)
            this.items = response.data;
          else
          this.items= [
          { location: "其余水样", value: "" },

        ]
        }).catch(error => {
          console.error('Error fetching JSON:', error);
        });
      },
      save() {
        axios.post('/api/save/qiyu', [this.items, this.path], {
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
      }
    }
  };
  </script>
  <style lang="scss" scoped>
  @import '../../styles/app';
  .small-text {  
    font-size: 0.6em;  
    color: #888; /* 浅灰色字体 */  
    font-weight: normal; /* 正常字体粗细 */  
    /* 可以添加更多样式 */  
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
  .text
  {
    height: 300px;
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
    ::v-deep .el-table__body td  {
      padding: 0;
      height: 550px !important;
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
  .form-control {  
  background-color: white !important; /* 使用 !important 确保覆盖其他样式 */  
}
  </style>
        