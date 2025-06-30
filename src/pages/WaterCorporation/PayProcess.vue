<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>水务公司</b-breadcrumb-item>
      <b-breadcrumb-item active>供水排水信息</b-breadcrumb-item>
    </b-breadcrumb>

    <el-tabs id="tabs" v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="地表水厂" name="gongshui">
        <gongshui v-if="activeName == 'gongshui'" ref="gongshui"></gongshui>
      </el-tab-pane>
      <el-tab-pane label="污水处理厂" name="paishui">
        <paishui v-if="activeName == 'paishui'" ref="paishui"></paishui>


      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import gongshui from "../WaterCorporation/gongshui";
import paishui from "../WaterCorporation/completionStatus";




export default {
  name: 'WaterCorporation',
  components: { Widget, gongshui, paishui },
  data() {
    return {
      activeName: 'gongshui'
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