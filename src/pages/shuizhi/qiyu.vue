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
import db from '@/database/db.js';

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
      path: "",
      hasUnsavedChanges: false
    };
  },
  created() {
    // 初始化时自动加载当前日期的数据
    this.selectMonth = new Date(); // 默认选择当前日期
    this.handle(); // 触发加载数据
  },
  beforeDestroy() {
    // 组件销毁前自动保存数据
    if (this.hasUnsavedChanges && this.path) {
      this.save(true); // 传递true表示是自动保存
    }
  },
  methods: {
    async handle() {
      const datee = new Date(this.selectMonth);
      this.yy = datee.getFullYear();
      this.mm = datee.getMonth() + 1;
      this.dd = datee.getDate();
      this.path = this.yy + "-" + this.mm + "-" + this.dd;
      
      try {
        const data = await db.load('qiyu_' + this.path);
        if (data && data.length > 0) {
          this.items = data;
        } else {
          this.items = [
            { location: "其余水样", value: "" },
          ];
        }
        this.hasUnsavedChanges = false;
        console.log('数据加载成功');
      } catch (error) {
        console.error('数据加载失败:', error);
        this.items = [
          { location: "其余水样", value: "" },
        ];
      }
    },
    async save(isAutoSave = false) {
      if (!this.path) {
        alert('请先选择日期');
        return;
      }
      
      try {
        await db.save('qiyu_' + this.path, this.items);
        this.hasUnsavedChanges = false;
        console.log('数据保存成功');
        if (!isAutoSave) {
          alert('保存成功');
        }
      } catch (error) {
        console.error('数据保存失败:', error);
        if (!isAutoSave) {
          alert('保存失败');
        }
      }
    }
  },
  watch: {
    items: {
      deep: true,
      handler() {
        this.hasUnsavedChanges = true;
      }
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
.text {
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