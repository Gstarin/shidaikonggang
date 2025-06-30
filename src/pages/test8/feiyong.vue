<template>
    <div>
      <b-breadcrumb>
        <b-breadcrumb-item>瑞景园林</b-breadcrumb-item>
        <b-breadcrumb-item active>费用管理</b-breadcrumb-item>
      </b-breadcrumb>
     
      <el-tabs id="tabs" v-model="activeName" type="border-card" @tab-click="handleClick" >
    <el-tab-pane label="加油费用" name="p1">    <p1  v-if="activeName == 'p1'" ref="p1"></p1>     </el-tab-pane>
    <el-tab-pane label="充电费用" name="p2">    <p2  v-if="activeName == 'p2'" ref="p2"></p2>     </el-tab-pane>
    <el-tab-pane label="保险费用" name="p3">    <p3  v-if="activeName == 'p3'" ref="p3"></p3>     </el-tab-pane>
    <el-tab-pane label="交通费用" name="p4">    <p4  v-if="activeName == 'p4'" ref="p4"></p4>     </el-tab-pane>
    <el-tab-pane label="维修费用" name="p5">    <p5  v-if="activeName == 'p5'" ref="p5"></p5>     </el-tab-pane>
    <el-tab-pane label="车辆年审费用" name="p6">    <p6  v-if="activeName == 'p6'" ref="p6"></p6>     </el-tab-pane>
    <el-tab-pane label="驾驶员年审费用" name="p7">    <p7  v-if="activeName == 'p7'" ref="p7"></p7>     </el-tab-pane>
    <el-tab-pane label="其他费用" name="p8">    <p8  v-if="activeName == 'p8'" ref="p8"></p8>     </el-tab-pane>
  </el-tabs>
    </div>
  </template>
  
  <script>
  import Widget from '@/components/Widget/Widget';
  import p1 from "../test7/p1";
  import p2 from "../test7/p2";
  import p3 from "../test7/p3";
  import p4 from "../test7/p4";
  import p5 from "../test7/p5";
  import p6 from "../test7/p6";
  import p7 from "../test7/p7";
  import p8 from "../test7/p8";


  export default {
    name: 'test7',
    components: { Widget ,p1,p2,p3,p4,p5,p6,p7,p8},
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
  

  <style >
#tabs{
  background-color:lightsteelblue;
}
 </style>