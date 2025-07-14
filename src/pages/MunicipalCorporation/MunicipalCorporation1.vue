<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>模板</b-breadcrumb-item>
      <b-breadcrumb-item active>市政公司</b-breadcrumb-item>
    </b-breadcrumb>
    <!-- <h2 class="page-title">市政公司支出信息</h2> -->
    <b-row>
      <b-col>
        <Widget title="<h5>市政公司支出信息</h5>" customHeader settings close>
          <div class="table-header">
            <b-form-file v-model="file" placeholder="请选择一个Excel文件" style="margin-right: 15px;"></b-form-file>
            <b-button variant="default" class="mr-3" size="sm" @click="parseExcel"
              style="width: 110px;height: 35px;">解析Excel</b-button>
            <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;">导出Excel</b-button>
          </div>
          <div id="table">
            <el-table :data="current" style="width: 100%" >
              <el-table-column prop="xiangguandanwei" label="相关单位" width="180">

              </el-table-column>
              <el-table-column prop="xiangmumingcheng" label="项目名称" width="200">

              </el-table-column>
              <el-table-column prop="hetongmingcheng" label="合同名称" width="300">

              </el-table-column>
              <el-table-column prop="hetongjine" label="合同金额(万元)">

              </el-table-column>
              <el-table-column prop="jiesuanjine" label="结算金额(万元)">

              </el-table-column>
              <el-table-column prop="start_date" label="2023年12月31日">
                <el-table-column prop="yingfukuan" label="应付款">

                </el-table-column>
                <el-table-column prop="shifukuan" label="实付款">

                </el-table-column>
                <el-table-column prop="yingfuweifu" label="应付未付">

                </el-table-column>
                <el-table-column prop="guazhangjine" label="挂账金额">

                </el-table-column>
              </el-table-column>
              <el-table-column prop="end_date" label="截止2024年3月31日">
                <el-table-column prop="fukuanjine" label="付款金额">

                </el-table-column>
                <el-table-column prop="yingfuweifu2" label="应付未付">

                </el-table-column>
                <el-table-column prop="guazhangjine2" label="挂账金额">

                </el-table-column>

              </el-table-column>
            </el-table>
          </div>

          <div class="table-footer">
            <b-pagination v-model="currentPage"  :total-rows="rows" size="lg"
              ></b-pagination>
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
  name: 'MunicipalCorporation1',
  components: { Widget, Sparklines },
  data() {
    return {
      file: null,
      currentPage: 1,
      tableData: [],
    };
  },
  mounted() {
    axios.get('http://localhost:5000/get_disburse').then(response => {
      // console.log('Fetched JSON:', response.data);
      this.tableData = response.data
    }).catch(error => {
      console.error('Error fetching JSON:', error);
    });
  },
  beforeDestroy() {
    axios.post('http://localhost:5000/upload_disburse', this.tableData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('市政公司支出表上传成功');
      })
      .catch(error => {
        console.error('市政公司支出表文件时出错：', error);
      });
  },
  computed: {
    current() {
      const start = (this.currentPage - 1) * 20;
      const end = start + 20;
      console.log(this.tableData.slice(start, end))
      return this.tableData.slice(start, end);
    },
    rows() {
      return this.tableData.length
    },
  },
  methods: {


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
          const title = ["xiangguandanwei", "xiangmumingcheng", "hetongmingcheng", "hetongjine_", "hetongjine", "jiesuanjine", "progress", "yingfukuan", "yingfukuan_", "shifukuan", "shifukuan_", "yingfuweifu", "guazhangjine", "fukuanjine", "yingfuweifu2", "guazhangjine2"]
          // 解析工作表数据
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          // console.log('解析后的数据为：', jsonData)
          for (let i = 2; i < jsonData.length; i++) {
            let obj = {};
            if (jsonData[i].length == 0) {
              continue
            }
            for (let j = 0; j < jsonData[i].length; j++) {
              if (typeof jsonData[i][j + 1] === 'number') {
                obj[title[j]] = jsonData[i][j + 1].toFixed(2);
              }else{
                obj[title[j]] = jsonData[i][j + 1];
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
.table-footer{
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
