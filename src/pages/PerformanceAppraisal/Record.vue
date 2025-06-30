<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>绩效考核</b-breadcrumb-item>
      <b-breadcrumb-item active>档案</b-breadcrumb-item>
    </b-breadcrumb>
    <!-- <h2 class="page-title">市政公司支出信息</h2> -->
    <b-row>
      <b-col>
        <Widget title="<h5>档案信息</h5>" customHeader settings close>
          <div class="table-header">
            <b-form-file v-model="file" placeholder="请选择一个Excel文件" style="margin-right: 15px;"></b-form-file>
            <b-button variant="default" class="mr-3" size="sm" @click="parseExcel"
              style="width: 110px;height: 35px;">解析Excel</b-button>
            <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;">导出Excel</b-button>
            <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;">增加</b-button>
            <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;">删除</b-button>
          </div>
          <div id="table">
            <el-table :data="current" style="width: 100%">
              <el-table-column prop="name" label="姓别">

              </el-table-column>
              <el-table-column prop="name" label="姓名">

              </el-table-column>
              <el-table-column prop="gendeer" label="性别">

              </el-table-column>
              <el-table-column prop="nation" label="民族">

              </el-table-column>
              <el-table-column prop="id" label="身份证号">

              </el-table-column>
              <el-table-column prop="birthday" label="出生年月">

              </el-table-column>
              <el-table-column prop="age" label="年龄">

              </el-table-column>
              <el-table-column prop="img" label="照片">

              </el-table-column>
              <el-table-column prop="height" label="身高(cm)">

              </el-table-column>
              <el-table-column prop="weight" label="体重(kg)">

              </el-table-column>
              <el-table-column prop="health" label="健康状况">

              </el-table-column>
              <el-table-column prop="phone" label="联系方式">

              </el-table-column>
              <el-table-column prop="PoliticalStatus" label="政治面貌">

              </el-table-column>
              <el-table-column prop="phone2" label="紧急联系人">

              </el-table-column>
              <el-table-column prop="address" label="家庭住址(现住址)">

              </el-table-column>
              <el-table-column prop="address2" label="家庭住址(身份证)">

              </el-table-column>
              <el-table-column prop="time" label="最初合同签订时间">

              </el-table-column>
              <el-table-column prop="channel" label="招聘渠道">

              </el-table-column>
              <el-table-column prop="corporation" label="合同所属公司">

              </el-table-column>

              <el-table-column prop="time2" label="最新签订合同时间">

              </el-table-column>
              <el-table-column prop="satus" label="在职状态">

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
  name: 'Record',
  components: { Widget, Sparklines },
  data() {
    return {
      file: null,
      currentPage: 1,
      tableData: [],
    };
  },
  mounted() {
    axios.get('/api/data/record').then(response => {
      // console.log('Fetched JSON:', response.data);
      this.tableData = response.data
    }).catch(error => {
      console.error('Error fetching JSON:', error);
    });
  },
  beforeDestroy() {
    axios.post('/api/save/record', this.tableData, {
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
              } else {
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