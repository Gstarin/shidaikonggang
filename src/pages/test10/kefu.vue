<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>物业公司</b-breadcrumb-item>
      <b-breadcrumb-item active>收费表</b-breadcrumb-item>
    </b-breadcrumb>
   
    <el-tabs id="tabs" v-model="activeName" type="border-card" @tab-click="handleClick" >
  <el-tab-pane label="每日物业费" name="d1">    <d1  v-if="activeName == 'd1'" ref="d1"></d1>     </el-tab-pane>
  <el-tab-pane label="每日车位费" name="d2">    <d2  v-if="activeName == 'd2'" ref="d2"></d2>     </el-tab-pane>
  <el-tab-pane label="抄表电费" name="d3">    <d3  v-if="activeName == 'd3'" ref="d3"></d3>     </el-tab-pane>
  <el-tab-pane label="补电卡收费" name="d4">    <d4  v-if="activeName == 'd4'" ref="d4"></d4>     </el-tab-pane>
  <el-tab-pane label="环卫收费" name="d5">    <d5  v-if="activeName == 'd5'" ref="d5"></d5>     </el-tab-pane>
  <el-tab-pane label="其他收费" name="d6">    <d6  v-if="activeName == 'd6'" ref="d6"></d6>     </el-tab-pane>
  <el-tab-pane label="房租费" name="d7">    <d7  v-if="activeName == 'd7'" ref="d7"></d7>     </el-tab-pane>
  <el-tab-pane label="合同" name="d9">    <d9  v-if="activeName == 'd9'" ref="d9"></d9>     </el-tab-pane>
  <el-tab-pane label="报销记录" name="d10">    <d10  v-if="activeName == 'd10'" ref="d10"></d10>     </el-tab-pane>
  <el-tab-pane label="业主报账" name="d11">    <d11  v-if="activeName == 'd11'" ref="d11"></d11>     </el-tab-pane>

</el-tabs>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import d1 from "./d1";
import d2 from "./d2";
import d3 from "./d3";
import d4 from "./d4";
import d5 from "./d5";
import d6 from "./d6";
import d7 from "./d7";
// import d8 from "./d8";
import d9 from "./d9";
import d10 from "./d10";
import d11 from "./d11";


export default {
  name: 'gongcheng',
  components: { Widget ,d1,d2,d3,d4,d5,d6,d7,d9,d10,d11},
  data() {
    return {
      activeName: 'd1'
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