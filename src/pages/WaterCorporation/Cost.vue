<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>水务公司</b-breadcrumb-item>
      <b-breadcrumb-item active>水厂生产、排水情况</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>水厂生产、排水情况</h5>" customHeader settings close>
          <div class="table-header">
            <b-form-file v-model="file" placeholder="请选择一个Excel文件" style="margin-right: 15px;"></b-form-file>
            <b-button variant="default" class="mr-3" size="sm" @click="parseExcel" style="width: 160px;height: 35px;">解析Excel</b-button>
            <b-button variant="default" style="width: 160px;height: 35px;"  @click="handleExportTable('DisburseTable1')">下载模板</b-button>&nbsp;&nbsp;&nbsp;
            <b-button variant="default" class="mr-3" size="sm" @click="uploadData" style="width: 120px;height: 35px;">上传</b-button>
          </div>
          <div id="table">
            <el-table :data="current" style="width: 100%">
              <el-table-column prop="riqi" label="日期" width="100"></el-table-column>
              <el-table-column prop="jinshuizongliang" label="排水总量（m³）" width="150"></el-table-column>
              <el-table-column prop="zhishuizongliang" label="制水总量（m³）" width="150"></el-table-column>
              
              <el-table-column label="排水量">
                <el-table-column label="1#管网">
                  <el-table-column prop="zhuchequ" label="主城区（m³）" width="140"></el-table-column>
                  <el-table-column prop="xiangzhen" label="乡镇（m³）" width="140"></el-table-column>
                  <el-table-column prop="zongji" label="总计（m³）" width="140"></el-table-column>
                 
                </el-table-column>
                
                <el-table-column label="2#, 3#管网">
                  <el-table-column prop="jingkaiqu" label="经开区（m³）" width="140"></el-table-column>
                  <el-table-column prop="linshuigongchang" label="临空水厂（m³）" width="140"></el-table-column>
                  <el-table-column prop="sanshekou" label="三舍口（m³）" width="140"></el-table-column>
                  <el-table-column prop="jinzewei" label="金泽水厂（m³）" width="140"></el-table-column>
                  <el-table-column prop="zongji2" label="总计（m³）" width="140"></el-table-column>
                </el-table-column>
              </el-table-column>
              
              <el-table-column prop="shengtaishui" label="生态水（m³）" width="140"></el-table-column>
              <el-table-column prop="total" label="总计（m³）" width="140"></el-table-column>
              <el-table-column prop="target" label="生产目标（m³）" width="140"></el-table-column>
              
            </el-table>

            <el-table style="display: none;width: 100%" id="DisburseTable1">
              <el-table-column prop="riqi" label="日期" width="100"></el-table-column>
              <el-table-column prop="jinshuizongliang" label="排水总量（m³）" width="150"></el-table-column>
              <el-table-column prop="zhishuizongliang" label="制水总量（m³）" width="150"></el-table-column>
              
              <el-table-column label="排水量">
                <el-table-column label="1#管网">
                  <el-table-column prop="zhuchequ" label="主城区（m³）" width="140"></el-table-column>
                  <el-table-column prop="xiangzhen" label="乡镇（m³）" width="140"></el-table-column>
                  <el-table-column prop="zongji" label="总计（m³）" width="140"></el-table-column>
                 
                </el-table-column>
                
                <el-table-column label="2#, 3#管网">
                  <el-table-column prop="jingkaiqu" label="经开区（m³）" width="140"></el-table-column>
                  <el-table-column prop="linshuigongchang" label="临空水厂（m³）" width="140"></el-table-column>
                  <el-table-column prop="sanshekou" label="三舍口（m³）" width="140"></el-table-column>
                  <el-table-column prop="jinzewei" label="金泽水厂（m³）" width="140"></el-table-column>
                  <el-table-column prop="zongji2" label="总计（m³）" width="140"></el-table-column>
                </el-table-column>
              </el-table-column>
              
              <el-table-column prop="shengtaishui" label="生态水（m³）" width="140"></el-table-column>
              <el-table-column prop="total" label="总计（m³）" width="140"></el-table-column>
              <el-table-column prop="target" label="生产目标（m³）" width="140"></el-table-column>
              
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
import Sparklines from '../../components/Sparklines/Sparklines';
import * as XLSX from 'xlsx/xlsx.mjs';
import axios from '@/utils/axios.js';
import {export_excel} from '@/utils/exportExcel.js'

export default {
  name: 'paishui',
  components: { Widget, Sparklines },
  data() {
    return {
      file: null,
      currentPage: 1,
      tableData: [],
    };
  },
  mounted() {
    axios.get('/api/data/paishui').then(response => {
      // if(this.tableData.length>0)
      this.tableData = response.data || [];
    }).catch(error => {
      console.error('Error fetching JSON:', error);
      this.tableData = [];
      this.$bvToast.toast('数据加载失败，请刷新页面重试', {
        title: '错误',
        variant: 'warning',
        solid: true
      });
    });
  },
  beforeDestroy() {
    this.uploadData();
  },
  computed: {
    current() {
      const start = (this.currentPage - 1) * 20;
      const end = start + 20;
      return this.tableData.slice(start, end);
    },
    rows() {
      return this.tableData.length;
    },
  },
  methods: {
    handleExportTable(table_id) {
            this.$nextTick(function () {
                export_excel(table_id)
            })

        },
        
    parseExcel() {
      if (this.file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(this.file);
        reader.onload = (e) => {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const title = ["riqi", "jinshuizongliang", "zhishuizongliang", "zhuchequ", "xiangzhen", "zongji", "jingkaiqu", "linshuigongchang", "sanshekou", "jinzewei", "zongji2", "shengtaishui","total","target"];
          
          this.tableData = jsonData.slice(1).map(row => {
            const obj = {};
            row.forEach((cell, index) => {
              obj[title[index]] = typeof cell === 'number' ? cell.toFixed(2) : cell;
            });
            return obj;
          });
        };
      }
    },
    uploadData() {
      axios.post('/api/save/paishui', this.tableData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          console.log('数据上传成功');
          this.$bvToast.toast('数据保存成功', {
            title: '成功',
            variant: 'success',
            solid: true
          });
        })
        .catch(error => {
          console.error('数据上传出错：', error);
          this.$bvToast.toast('数据保存失败，请重试', {
            title: '错误',
            variant: 'danger',
            solid: true
          });
        });
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
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#table {
  ::v-deep .cell {
    color: white;
  }

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

  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table td {
    background-color: transparent;
  }
}
</style>
