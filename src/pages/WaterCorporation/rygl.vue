<template>
    <div>
      <b-breadcrumb>
        <b-breadcrumb-item>水务公司</b-breadcrumb-item>
        <b-breadcrumb-item active>人员管理</b-breadcrumb-item>
      </b-breadcrumb>
  
      <el-tabs id="tabs" v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="地表水厂在职" name="p1">
          <p1 v-if="activeName == 'p1'" ref="p1"></p1>
        </el-tab-pane>
        <el-tab-pane label="地表水厂离职" name="p2">
          <p2 v-if="activeName == 'p2'" ref="p2"></p2>
        </el-tab-pane>
        <el-tab-pane label="污水处理厂在职" name="p3">
          <p3 v-if="activeName == 'p3'" ref="p3"></p3>
        </el-tab-pane>
        <el-tab-pane label="污水处理厂离职" name="p4">
          <p4 v-if="activeName == 'p4'" ref="p4"></p4>
        </el-tab-pane>
      
      </el-tabs>
    </div>
  </template>
  
  <script>
  import Widget from '@/components/Widget/Widget';

  import p1 from "../WaterCorporation/sc_zaizhi";
  import p2 from "../WaterCorporation/sc_lizhi";
  import p3 from "../WaterCorporation/wsc_zaizhi";
  import p4 from "../WaterCorporation/wsc_lizhi";
  
  
  
  export default {
    name: 'WaterCorporation',
    components: { Widget, p1, p2, p3, p4,  },
    data() {
      return {
        activeName: 'p1'
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