<template>
  <div>

  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <el-submenu index="1">
      <template slot="title">地表水厂</template>
      <el-menu-item index="1-1">原水日报表</el-menu-item>
      <el-menu-item index="1-2">出厂水日报表</el-menu-item>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">污水处理厂</template>
      <el-menu-item index="2-1">MLSS</el-menu-item>
      <el-menu-item index="2-2">氨氮</el-menu-item>
      <el-menu-item index="2-3">总氮</el-menu-item>
      <el-menu-item index="2-4">总磷</el-menu-item>
      <el-menu-item index="2-5">硝态氮</el-menu-item>
      <el-menu-item index="2-6">COD</el-menu-item>
      <el-menu-item index="2-7">pH</el-menu-item>
     
    </el-submenu>
    <el-menu-item index="3">其他</el-menu-item>
    <el-menu-item index="4">其余水样</el-menu-item>
  
  </el-menu>
<br>
  <p1 v-if="page=='1-1'"></p1>
  <p2 v-if="page=='1-2'"></p2>
  <p3 v-if="page=='2-1'"></p3>
  <p4 v-if="page=='2-2'"></p4>
  <p5 v-if="page=='2-3'"></p5>
  <p6 v-if="page=='2-4'"></p6>
  <p7 v-if="page=='2-5'"></p7>
  <p8 v-if="page=='2-6'"></p8>
  <p9 v-if="page=='2-7'"></p9>
  <p10 v-if="page=='3'"></p10>
  <p11 v-if="page=='4'"></p11>

</div>
</template>


  <script>
  import Widget from '@/components/Widget/Widget';
import p1 from "../shuizhi/yuanshui";
import p2 from "../shuizhi/chuchangshui";
import p3 from "../shuizhi/mlss";
import p4 from "../shuizhi/andan";
import p5 from "../shuizhi/zongdan";
import p6 from "../shuizhi/zonglin";
import p7 from "../shuizhi/xiaotaidan";
import p8 from "../shuizhi/cod";
import p9 from "../shuizhi/ph";
import p10 from "../shuizhi/qita";
import p11 from "../shuizhi/qiyu";


    export default {
      components: { Widget, p1, p2, p3, p4, p5 ,p6,p7,p8,p9,p10,p11},
      data() {
        return {
          activeIndex: '1',
          page:""
        };
      },
      methods: {
        handleSelect(key, keyPath) {
          console.log(key);
          this.page=key;
        }
      }
    }
  </script>