<template>
    <div>
      <b-breadcrumb>
        <b-breadcrumb-item>水务公司</b-breadcrumb-item>
        <b-breadcrumb-item active>经营成本统计表</b-breadcrumb-item>
      </b-breadcrumb>
  
      <el-tabs id="tabs" v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="水厂经营成本" name="sc">
          <sc v-if="activeName == 'sc'" ref="sc"></sc>
        </el-tab-pane>
        <el-tab-pane label="污水处理厂经营成本" name="wsc">
          <wsc v-if="activeName == 'wsc'" ref="wsc"></wsc>
  
  
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  
  <script>
  import Widget from '@/components/Widget/Widget';
  import sc from "../WaterCorporation/sc";
  import wsc from "../WaterCorporation/wsc";
  
  
  
  
  export default {
    name: 'WaterCorporation',
    components: { Widget, sc, wsc },
    data() {
      return {
        activeName: 'sc'
      };
    },
  
  
    methods: {
      handleClick(tab, event) {
        console.log(tab.name);
        this.activeName = tab.name;
      }
    }
  };
  </script>
  
  
  <style>
  #tabs {
    background-color: lightsteelblue;
  }
  </style>