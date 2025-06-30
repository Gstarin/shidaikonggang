<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>水务公司</b-breadcrumb-item>
      <b-breadcrumb-item active>出入库信息</b-breadcrumb-item>
    </b-breadcrumb>

    <el-tabs id="tabs" v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="污水厂出库单" name="p1">
        <p1 v-if="activeName == 'p1'" ref="p1"></p1>
      </el-tab-pane>
      <el-tab-pane label="污水厂入库单" name="p2">
        <p2 v-if="activeName == 'p2'" ref="p2"></p2>
      </el-tab-pane>
      <el-tab-pane label="食材入库单" name="p3">
        <p3 v-if="activeName == 'p3'" ref="p3"></p3>
      </el-tab-pane>
      <el-tab-pane label="食材出库单" name="p4">
        <p4 v-if="activeName == 'p4'" ref="p4"></p4>
      </el-tab-pane>
      <el-tab-pane label="PAC出入库" name="p5">
        <p5 v-if="activeName == 'p5'" ref="p5"></p5>
      </el-tab-pane>
      <el-tab-pane label="地表水厂出库单" name="p6">
        <p6 v-if="activeName == 'p6'" ref="p6"></p6>
      </el-tab-pane>
      <el-tab-pane label="地表水厂入库单" name="p7">
        <p7 v-if="activeName == 'p7'" ref="p7"></p7>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import p1 from "../WaterCorporation/chukudan";
import p2 from "../WaterCorporation/rukudan";
import p3 from "../WaterCorporation/shicaichuku";
import p4 from "../WaterCorporation/shicairuku";
import p5 from "../WaterCorporation/PACchuruku";
import p6 from "../WaterCorporation/chukudan2";
import p7 from "../WaterCorporation/rukudan2";



export default {
  name: 'WaterCorporation',
  components: { Widget, p1, p2, p3, p4, p5 ,p6,p7},
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