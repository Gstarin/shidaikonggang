<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>{{ config.factoryName }}</b-breadcrumb-item>
      <b-breadcrumb-item active>{{ config.reportName }}报表</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget :title="`<h5>${config.reportName}报表</h5>`" customHeader settings close>
          <div class="table-header">
            <el-date-picker 
              v-model="selectMonth" 
              style="width: 600px; height: 65px; margin-left: 10px;" 
              placeholder="选择日期" 
              @change="loadDataForDate"
              type="date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b-button variant="default" class="mr-3" size="sm" style="width: 110px; height: 35px;" @click="saveData">保存</b-button>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th v-for="(header, index) in config.tableHeaders" :key="index">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in items" :key="index">
                  <td v-for="(field, fieldIndex) in config.tableFields" :key="fieldIndex">
                    <template v-if="field.specialDisplay && field.specialDisplay(row[field.key])">
                      <span v-html="field.specialDisplay(row[field.key])"></span>
                    </template>
                    <template v-else-if="field.editable">
                      <b-form-input v-model="row[field.key]" />
                    </template>
                    <template v-else>
                      {{ row[field.key] }}
                    </template>
                  </td>
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
import Widget from '@/components/Widget/Widget';
import dbInstance from '@/database/db.js';

export default {
  name: 'WaterQualityReport',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectMonth: new Date().toISOString().substr(0, 10),
      items: JSON.parse(JSON.stringify(this.config.defaultItems))
    };
  },
  created() {
    this.loadDataForDate();
  },
  methods: {
    async loadDataForDate() {
      if (!this.selectMonth) return;
      
      try {
        const storageKey = `${this.config.storagePrefix}_${this.selectMonth}`;
        const savedData = await dbInstance.load(storageKey);
        
        if (savedData) {
          this.items = savedData;
        } else {
          this.items = JSON.parse(JSON.stringify(this.config.defaultItems));
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        this.$message.error('加载数据失败，请重试');
      }
    },
    
    async saveData() {
      if (!this.selectMonth) {
        this.$message.warning('请先选择日期');
        return;
      }
      
      try {
        const storageKey = `${this.config.storagePrefix}_${this.selectMonth}`;
        await dbInstance.save(storageKey, this.items);
        this.$message.success('数据保存成功');
      } catch (error) {
        console.error('保存数据失败:', error);
        this.$message.error('保存数据失败: ' + (error.message || '未知错误'));
      }
    }
  }
};
</script>