<template>
  <div class="detail">
    <b-breadcrumb>
      <b-breadcrumb-item>市政公司</b-breadcrumb-item>
      <b-breadcrumb-item active>收入信息</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>合同收款细表</h5>" customHeader settings close>
          <div class="table-header">
            <b-form-file v-model="file" placeholder="请选择一个Excel文件"
              style="width: 500px; margin-right: 15px;"></b-form-file>
            <b-button variant="default" class="mr-3" size="sm" @click="parseExcel">解析Excel</b-button>
            <b-button variant="default" class="mr-3" size="sm" @click="handleExportTable('DisburseTable')">导出Excel</b-button>
            <b-button variant="default" class="mr-3" size="sm" @click="handleExportTable('DisburseTable1')">下载模板</b-button>
            <b-button variant="default" class="mr-3" size="sm" @click="dialogVisible = true"
              style="width: 100px; height: 35px;">增加合同</b-button>
            <b-button variant="danger" class="mr-3" size="sm" @click="deleteSelectedRows">删除条目</b-button>
          </div>
          <div id="table">
            <el-table :data="detailData" style="width: 100%" id="DisburseTable" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="xuhao" label="序号" width="50"></el-table-column>
              <el-table-column prop="hetongmingcheng" label="合同名称" width="200"></el-table-column>
              <el-table-column prop="hetongduifang" label="合同相对人" width="150"></el-table-column>
              <el-table-column prop="kaipiao_date" label="开票/核实日期" width="150"></el-table-column>
              <el-table-column prop="kaipiaojine_no_tax" label="开票金额（不含税）" width="150"></el-table-column>
              <el-table-column prop="zhuanxiangshuie" label="专项税额" width="100"></el-table-column>
              <el-table-column prop="kaipiaojine_with_tax" label="开票金额（含税）" width="150"></el-table-column>
              <el-table-column prop="shoukuanjine" label="收款金额" width="100"></el-table-column>
              <el-table-column prop="zhengju_bianhao" label="凭证编号" width="100"></el-table-column>
              <el-table-column prop="beizhu" label="备注" width="200"></el-table-column>
            </el-table>
            <el-table :data="[]" style="display:none;width: 100%" id="DisburseTable1">
              <el-table-column prop="xuhao" label="序号" width="50"></el-table-column>
              <el-table-column prop="hetongmingcheng" label="合同名称" width="200"></el-table-column>
              <el-table-column prop="hetongduifang" label="合同相对人" width="150"></el-table-column>
              <el-table-column prop="kaipiao_date" label="开票/核实日期" width="150"></el-table-column>
              <el-table-column prop="kaipiaojine_no_tax" label="开票金额（不含税）" width="150"></el-table-column>
              <el-table-column prop="zhuanxiangshuie" label="专项税额" width="100"></el-table-column>
              <el-table-column prop="kaipiaojine_with_tax" label="开票金额（含税）" width="150"></el-table-column>
              <el-table-column prop="shoukuanjine" label="收款金额" width="100"></el-table-column>
              <el-table-column prop="zhengju_bianhao" label="凭证编号" width="100"></el-table-column>
              <el-table-column prop="beizhu" label="备注" width="200"></el-table-column>
            </el-table>
          </div>
          <el-dialog :visible.sync="dialogVisible" title="新增收款信息">
            <el-form ref="form" :model="form" label-width="140px">
              <el-form-item label="合同名称">
                <el-input v-model="form.hetongmingcheng"></el-input>
              </el-form-item>
              <el-form-item label="合同相对人">
                <el-input v-model="form.hetongduifang"></el-input>
              </el-form-item>
              <el-form-item label="开票/核实日期">
                <el-date-picker v-model="form.kaipiao_date" type="date" placeholder="请选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="开票金额（不含税）">
                <el-input v-model.number="form.kaipiaojine_no_tax"></el-input>
              </el-form-item>
              <el-form-item label="专项税额">
                <el-input v-model.number="form.zhuanxiangshuie"></el-input>
              </el-form-item>
              <el-form-item label="开票金额（含税）">
                <el-input v-model.number="form.kaipiaojine_with_tax"></el-input>
              </el-form-item>
              <el-form-item label="收款金额">
                <el-input v-model.number="form.shoukuanjine"></el-input>
              </el-form-item>
              <el-form-item label="凭证编号">
                <el-input v-model="form.zhengju_bianhao"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="form.beizhu"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitForm">确定</el-button>
            </span>
          </el-dialog>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import axios from '@/utils/axios.js';
import * as XLSX from 'xlsx/xlsx.mjs';
import { export_excel } from '@/utils/exportExcel.js';

export default {
  name: 'Detail',
  components: { Widget },
  data() {
    return {
      detailData: [],
      dialogVisible: false,
      file: null,
      selectedRows: [],
      form: {
        hetongmingcheng: '',
        hetongduifang: '',
        kaipiao_date: '',
        kaipiaojine_no_tax: '',
        zhuanxiangshuie: '',
        kaipiaojine_with_tax: '',
        shoukuanjine: '',
        zhengju_bianhao: '',
        beizhu: ''
      }
    };
  },
  mounted() {
    if (this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData;
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const newContract = { ...this.form };
          newContract.xuhao = this.detailData.length + 1;
          this.detailData.push(newContract);
          this.resetForm();
          this.dialogVisible = false;
        }
      });
    },
    resetForm() {
      Object.keys(this.form).forEach(key => {
        this.form[key] = '';
      });
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    deleteSelectedRows() {
      if (this.selectedRows.length > 0) {
        this.selectedRows.forEach(row => {
          const index = this.detailData.findIndex(item => item.xuhao === row.xuhao);
          if (index > -1) {
            this.detailData.splice(index, 1);
          }
        });
        this.selectedRows = [];
        // 重新排序序号
        this.detailData.forEach((item, index) => {
          item.xuhao = index + 1;
        });
      }
    },
    parseExcel() {
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          this.detailData = jsonData.map((item, index) => ({
            xuhao: index + 1,
            ...item
          }));
        };
        reader.readAsArrayBuffer(this.file);
      }
    },
    handleExportTable(tableId) {
      this.$nextTick(() => {
        export_excel(tableId);
      });
    },
    save() {
      // 添加保存到后端的逻辑
      console.log('保存数据', this.detailData);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.table-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 15px;
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

 