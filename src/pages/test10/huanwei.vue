<template>
    <div>
      <b-breadcrumb>
        <b-breadcrumb-item>城区环卫</b-breadcrumb-item>
        <b-breadcrumb-item active>收费表</b-breadcrumb-item>
      </b-breadcrumb>
     
      <el-tabs id="tabs" v-model="activeName" type="border-card" @tab-click="handleClick" >
    <el-tab-pane label="加油费用" name="cq1">    <cq1  v-if="activeName == 'cq1'" ref="cq1"></cq1>     </el-tab-pane>
    <el-tab-pane label="用电费用" name="cq2">    <cq2  v-if="activeName == 'cq2'" ref="cq2"></cq2>     </el-tab-pane>
    <el-tab-pane label="车辆保养费用" name="cq3">    <cq3  v-if="activeName == 'cq3'" ref="cq3"></cq3>     </el-tab-pane>
    <el-tab-pane label="车辆保险费用" name="cq4">    <cq4  v-if="activeName == 'cq4'" ref="cq4"></cq4>     </el-tab-pane>
    <el-tab-pane label="车辆年审费用" name="cq5">    <cq5  v-if="activeName == 'cq5'" ref="cq5"></cq5>     </el-tab-pane>
    <el-tab-pane label="车辆维修" name="cq6">    <cq6  v-if="activeName == 'cq6'" ref="cq6"></cq6>     </el-tab-pane>
    <el-tab-pane label="劳保费用" name="cq7">    <cq7  v-if="activeName == 'cq7'" ref="cq7"></cq7>     </el-tab-pane>
    <el-tab-pane label="其他费用" name="cq8">    <cq8  v-if="activeName == 'cq8'" ref="cq8"></cq8>     </el-tab-pane>
    <el-tab-pane label="合同档案" name="cq9">    <cq9  v-if="activeName == 'cq9'" ref="cq9"></cq9>     </el-tab-pane>
    <el-tab-pane label="收入情况" name="cq10">    <cq10  v-if="activeName == 'cq10'" ref="cq10"></cq10>     </el-tab-pane>
    <el-tab-pane label="人员管理" name="cq11">    <cq11  v-if="activeName == 'cq11'" ref="cq11"></cq11>     </el-tab-pane>
    <el-tab-pane label="车辆管理" name="cq12">    <cq12  v-if="activeName == 'cq12'" ref="cq12"></cq12>     </el-tab-pane>

  
  </el-tabs>
    </div>
  </template>
  
  <script>
  import Widget from '@/components/Widget/Widget';
  import cq1 from "./cq1";
  import cq2 from "./cq2";
  import cq3 from "./cq3";
  import cq4 from "./cq4";
  import cq5 from "./cq5";
  import cq6 from "./cq6";
  import cq7 from "./cq7";
  import cq8 from "./cq8";
  import cq9 from "./cq9";
  import cq10 from "./cq10";
  import cq11 from "./cq11";
  import cq12 from "./cq12";
  import cq13 from "./cq13";
  
  
  export default {
    name: 'huanwei',
    components: { Widget ,cq1,cq2,cq3,cq4,cq5,cq6,cq7,cq8,cq9,cq10,cq11,cq12,cq13},
    data() {
      return {
        activeName: 'cq1'
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
  
  
  <style >
  #tabs{
  background-color:lightsteelblue;
  }
  </style>