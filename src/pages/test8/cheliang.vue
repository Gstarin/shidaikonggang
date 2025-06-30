<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>瑞景园林</b-breadcrumb-item>
      <b-breadcrumb-item active>人员管理</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>人员管理</h5>" customHeader settings close>
          <div class="table-header">
            <b-form-file v-model="file" accept=".xlsx, .xls" placeholder="请选择一个Excel文件" class="mr-3"></b-form-file>
            <b-button variant="primary" @click="parseExcel">上传并解析</b-button>
            <b-button variant="default" class="mr-3" size="sm" @click="addRecord" style="width: 110px;height: 35px;">增加</b-button>
            <b-button variant="danger" class="mr-3" size="sm" @click="deleteSelectedRecords" style="width: 110px;height: 35px;">删除</b-button>
            <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"
          @click="saveData">保存</b-button>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead id="DisburseTable1">
                <tr>
                  <th><b-form-checkbox v-model="selectAll" @change="selectAllRecords"></b-form-checkbox></th>
                  <th>工作性质</th>
                  <th>岗位</th>
                  <th>序号</th>
                  <th>姓名</th>
                  <th>性别</th>
                  <th>身份证号</th>
                  <th>联系电话</th>
                  <th>岗位职责</th>
                  <th>是否缴纳保险</th>
                  <th>是否劳务派遣</th>
                  <th>工作区域</th>
                  <th>驾驶工作车类型</th>
                  <th>工作车车号</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in items" :key="index">
                  <td><b-form-checkbox v-model="row.selected"></b-form-checkbox></td>
                  <td><b-form-input v-model="row.cheliang" class="white-input" /></td>
                  <td><b-form-input v-model="row.id" class="white-input" /></td>
                  <td><b-form-input v-model="row.number" class="white-input" /></td>
                  <td><b-form-input v-model="row.driver" class="white-input" /></td>
                  <td><b-form-input v-model="row.phone" class="white-input" /></td>
                  <td><b-form-input v-model="row.xiangzhen" class="white-input" /></td>
                  <td><b-form-input v-model="row.quyu" class="white-input" /></td>
                  <td><b-form-input v-model="row.beizhu" class="white-input" /></td>
                  <td><b-form-input v-model="row.baoxian" class="white-input" /></td>
                  <td><b-form-input v-model="row.paiqian" class="white-input" /></td>
                  <td><b-form-input v-model="row.gzqy" class="white-input" /></td>
                  <td><b-form-input v-model="row.leixing" class="white-input" /></td>
                  <td><b-form-input v-model="row.chehao" class="white-input" /></td>
                  <td><b-form-input v-model="row.note" class="white-input" /></td>
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
import { export_excel } from '@/utils/exportExcel.js';

export default {
  name: 'sc',
  components: { Widget },
  data() {
    return {
      file: null,
      items: [
        { cheliang: "三吨", id: "1", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "三吨", id: "2", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "三吨", id: "3", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "三吨", id: "4", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "三吨", id: "5", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "八吨", id: "1", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "八吨", id: "2", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "八吨", id: "3", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "八吨", id: "4", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "八吨", id: "5", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "大勾臂", id: "1", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "大勾臂", id: "2", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "大勾臂", id: "3", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "大勾臂", id: "4", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "大勾臂", id: "5", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "小勾臂", id: "1", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false },
        { cheliang: "小水车", id: "1", number: "", driver: "", phone: "", xiangzhen: "", quyu: "", beizhu: "", baoxian: "", paiqian: "", gzqy: "", leixing: "", chehao: "", note: "", selected: false }
      ],
      selectAll: false,
    };
  },
  beforeDestroy() {
    axios.post('/api/save/renyuan', this.items, {
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
    axios.get('/api/data/renyuan').then(response => {
      this.items = response.data;
    }).catch(error => {
      console.error('Error fetching JSON:', error);
    });
  },
  methods: {
    handleExportTable(table_id) {
      this.$nextTick(function () {
        export_excel(table_id);
      });
    },
    saveData() {
        axios.post('/api/save/renyuan', this.items, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            console.log('保存成功');
            this.$message.success('保存成功');
        })
        .catch(error => {
            console.error('保存时出错：', error);
            this.$message.error('保存失败，请重试');
        });
    },
    edit(name) {
      this.$router.push({
        path: "/app/WaterCorporation/sc2?name=" + name,
        query: { name: name }
      });
    },
    parseExcel() {
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          let parsedData = jsonData.slice(1).map(row => ({
            number: row[2],
            driver: row[3],
            phone: row[4],
            xiangzhen: row[5],
            quyu: row[6],
            beizhu: row[7],
            baoxian: row[8],
            paiqian: row[9],
            gzqy: row[10],
            leixing: row[11],
            chehao: row[12],
            note: row[13],
            selected: false
          }));
          let i = 0;
          for (i = 0; i < parsedData.length; i++) {
            parsedData[i].cheliang = this.items[i].cheliang;
            parsedData[i].id = this.items[i].id;
            parsedData[i].number = this.items[i].number;
          }
          this.items = parsedData;
        };
        reader.readAsArrayBuffer(this.file);
      }
    },
    addRecord() {
      this.items.push({
        cheliang: "",
        id: "",
        number: "",
        driver: "",
        phone: "",
        xiangzhen: "",
        quyu: "",
        beizhu: "",
        baoxian: "",
        paiqian: "",
        gzqy: "",
        leixing: "",
        chehao: "",
        note: "",
        selected: false
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

.white-input .b-form-input {
  background-color: white !important; 
  color: #01010d !important;
}

.clickable {
  cursor: pointer;
  color: #9f9fad;
  text-decoration: underline;
}
</style>
