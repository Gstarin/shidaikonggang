<template>
  <b-collapse class="sidebar-collapse" id="sidebar-collapse" :visible="sidebarOpened">
  <nav
    :class="{sidebar: true}"
  >
    <header class="logo">
      
    </header>

    <ul class="nav">
      <h5 class="navTitle">APP</h5>
      <NavLink 
        :activeItem="activeItem"
        header="主页"
        link="/app/dashboard"
        iconName="glyphicon glyphicon-home"
        index="dashboard"
        isHeader
      />
      <h5 class="navTitle">集团总部</h5>
      
      <NavLink 
        :activeItem="activeItem"
        header="综合管理部"
        link="/app/zhgl"
        iconName="fa fa-institution"
        index="zhgl"
        :childrenLinks="[
          { header: '项目档案', link: '/app/zhgl/jygl' },
          { header: '集团内部资料', link: '/app/zhgl/nbzl' },
        ]"
      />

      <NavLink
        :activeItem="activeItem"
        header="人力资源部"
        link="/app/PerformanceAppraisal"
        iconName="fa fa-institution"
        index="PerformanceAppraisal"
        :childrenLinks="[         
			{ header: '绩效考核', link: '/app/PerformanceAppraisal/Performance'},
			{ header: '个人信息', link: '/app/PerformanceAppraisal/grxx'},
			{ header: '人员展示', link: '/app/PerformanceAppraisal/yuanGong'},
			{ header: '部门绩效', link: '/app/PerformanceAppraisal/rwjx'},
			{ header: '工程项目绩效', link: '/app/PerformanceAppraisal/gcxm'}
        ]"
      />

      <NavLink
        :activeItem="activeItem"
        header="投资发展部"
        link="/app/tzfz"
        iconName="fa fa-institution"
        index="tzfz"
        :childrenLinks="[
          { header: '项目管理', link: '/app/tzfz/zlda' },
          { header: '合同管理', link: '/app/tzfz/htdaa' },
          // { header: '项目档案 ', link: '/app/tzfz/xmda' },
          { header: '跨境电商产业园 ', link: '/app/tzfz/kjds' }
        ]"
      />

      <NavLink
        :activeItem="activeItem"
        header="建设统筹部"
        link="/app/ProjectManagement"
        iconName="fa fa-institution"
        index="ProjectManagement"
        :childrenLinks="[
          { header: '项目管理', link: '/app/ProjectManagement/ProjectManagement1' },
          { header: '文件管理', link: '/app/ProjectManagement/FileManagement'}
        ]"
      />
      <NavLink
        :activeItem="activeItem"
        header="财务金融部"
        link="/app/MunicipalCorporation/total"
        iconName="fa fa-institution"
        index="test5"
        :childrenLinks="[  
			{header: '收支信息', link: '/app/MunicipalCorporation/total' },    
			{header: '支出信息', link: '/app/MunicipalCorporation/Disburse' },
			{header: '收入信息', link: '/app/MunicipalCorporation/Income' },
      //{header: '日志信息', link: '/app/MunicipalCorporation/Log' },
      //{header: '项目管理', link: '/app/MunicipalCorporation/xgdw' },
        ]"
      />
      <NavLink
        :activeItem="activeItem"
        header="成本管控中心"
        link="/app/Tables"
        iconName="fa fa-institution"
        index="Tables"
        :childrenLinks="[
			{ header: '日常用品类', link: '/app/Tables/Daily' },  
			{ header: '工程材料类', link: '/app/Tables/Project' },  
			{ header: '咨询服务类', link: '/app/Tables/Serve' },  
        ]"
      />
      <h5 class="navTitle">子公司</h5>

      <NavLink
        :activeItem="activeItem"
        header="时代空港市政"
        link="/app/szgs"
        iconName="fa fa-institution"
        index="szgs"
        :childrenLinks="[
			{header: '收支信息', link: '/app/szgs/total' },    
			{header: '支出信息', link: '/app/szgs/Disburse' },
			{header: '收入信息', link: '/app/szgs/Income' },
      //{header: '日志信息', link: '/app/MunicipalCorporation/Log' },
      //{header: '项目管理', link: '/app/MunicipalCorporation/xgdw' },

        ]"
      />
      <NavLink
        :activeItem="activeItem"
        header="瑞景园林绿化"
        link="/app/test8"
        iconName="fa fa-institution"
        index="test8"
        :childrenLinks="[
         
          { header: '费用管理', link: '/app/test8/feiyong' },
          { header: '企业拜访记录', link: '/app/test8/qybf' },
          { header: '合同档案', link: '/app/test8/htda' },
          { header: '收入记录', link: '/app/test8/biaoge' },
          { header: '人员管理', link: '/app/test8/cheliang' },
          { header: '车辆管理', link: '/app/test8/renyuan' },
          { header: '生活垃圾运输表', link: '/app/test8/rubbish' },


          
        ]"
      />
      <NavLink
        :activeItem="activeItem"
        header="青清水务"
        link="/app/WaterCorporation"
        iconName="fa fa-institution"
        index="WaterCorporation"
        :childrenLinks="[
         
          { header: '出入库与库存', link: '/app/WaterCorporation/churuku' },
          { header: '月度生产目标', link: '/app/WaterCorporation/PayProcess' },
          { header: '月经营成本统计表', link: '/app/WaterCorporation/chengben' },
          // { header: '成本管理', link: '/app/WaterCorporation/guanli' },
          { header: '人员管理', link: '/app/WaterCorporation/rygl' },
          { header: '水质检测', link: '/app/WaterCorporation/szjc' },
          //{ header: '合同款项支付进度', link: '/app/WaterCorporation/PayProcess' },
          //{ header: '生产成本支出情况', link: '/app/WaterCorporation/Cost' },
          
          
        ]"
      />
      <NavLink
        :activeItem="activeItem"
        header="时代空港物业"
        link="/app/test10"
        iconName="fa fa-institution"
        index="test10"
        :childrenLinks="[
          { header: '物业费用管理', link: '/app/test10/kefu' },
          { header: '城区环卫费用管理', link: '/app/test10/huanwei' },
          { header: '客服', link: '/app/test10/gongcheng' },
        ]"
      />
      <NavLink
        :activeItem="activeItem"
        header="博泰酒店"
        link="/app/test11"
        iconName="fa fa-institution"
        index="test11"
        :childrenLinks="[
          { header: '经济指标', link: '/app/test11/jjzb' },
          // { header: '价格库', link: '/app/test11/jiage' },
          //{ header: '工程材料类', link: '/app/test11/gccl' },
          //{ header: '咨询服务类', link: '/app/test11/zxfw' }
        ]"
      />
      <NavLink
        :activeItem="activeItem"
        header="时代空港房地产开发"
        link="/app/test12"
        iconName="fa fa-institution"
        index="test12"
        :childrenLinks="[
         
          { header: '档案资料管理系统', link: '/app/test12/dazl' },
          { header: '项目节点', link: '/app/test12/xmjd' },
          
        ]"
      />
      <NavLink
        :activeItem="activeItem"
        header="首钢盛业"
        link="/app/test13"
        iconName="fa fa-institution"
        index="test13"
        :childrenLinks="[
         
          { header: '数据看板', link: '/app/test13/jg' },
          //{ header: '工程材料类', link: '/app/test13/gc' },
          //{ header: '咨询服务类', link: '/app/test13/zx' }
        ]"
      />
      <h5 class="navTitle">项目管理</h5>
      <NavLink
        :activeItem="activeItem"
        header="项目管理"
        link="/app/tzfz"
        iconName="fa fa-institution"
        index="tzfz"
        :childrenLinks="[
          { header: '项目', link: '/app/tzfz/Project' },
      
        ]"
      />
      <NavLink
        :activeItem="activeItem"
        header="斗栱云工程"
        link="/app/dgy"
        iconName="fa fa-institution"
        index="dgy"
        :childrenLinks="[
          { header: '斗栱云工程', link: '/app/dgy/dgy' },
      
        ]"
      />
      <!--
      <NavLink
        :activeItem="activeItem"
        header="Components"
        link="/app/components"
        iconName="flaticon-network-1"
        index="components"
        :childrenLinks="[
          { header: 'Charts', link: '/app/components/charts' },
          { header: 'Icons', link: '/app/components/icons' },
          // { header: 'Maps', link: '/app/components/maps' },
        ]"
      />
      -->
      <!-- <NavLink
        header="Notifications"
        link="/app/notifications"
        iconName="flaticon-bell"
        index="notifications"
        isHeader
      />  -->
    </ul>


    <!-- <h5 class="navTitle d-sm-down-none">
      LABELS
    </h5>
    <ul class="sidebarLabels d-sm-down-none">
      <li>
        <a href="#">
          <i class="fa fa-circle text-success mr-3" />
          <span class="labelName">Core</span>
        </a>
      </li>
      <li>
        <a href="#">
          <i class="fa fa-circle text-primary mr-3" />
          <span class="labelName">UI Elements</span>
        </a>
      </li>
      <li>
        <a href="#">
          <i class="fa fa-circle text-danger mr-3" />
          <span class="labelName">Forms</span>
        </a>
      </li>
    </ul> -->

    <!-- <h5 class="navTitle d-sm-down-none mb-3">
      PROJECTS
    </h5>
    <div class="sidebarAlerts d-sm-down-none">
      <b-alert
        v-for="alert in alerts"
        :key="alert.id"
        class="sidebarAlert" variant="transparent"
        show dismissible
      >
        <span>{{alert.title}}</span><br />
        <b-progress class="sidebarProgress progress-xs mt-1"
          :variant="alert.color" :value="alert.value" :max="100" />
        <span>{{alert.footer}}</span>
      </b-alert>
    </div> -->
  </nav>
  </b-collapse>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import NavLink from './NavLink/NavLink';

export default {
  name: 'Sidebar',
  components: { NavLink },
  data() {
    return {
      alerts: [
        {
          id: 0,
          title: 'Sales Report',
          value: 15,
          footer: 'Calculating x-axis bias... 65%',
          color: 'primary',
        },
        {
          id: 1,
          title: 'Personal Responsibility',
          value: 20,
          footer: 'Provide required notes',
          color: 'danger',
        },
      ],
    };
  },
  methods: {
    ...mapActions('layout', ['changeSidebarActive', 'switchSidebar']),
    setActiveByRoute() {
      const paths = this.$route.fullPath.split('/');
      paths.pop();
      this.changeSidebarActive(paths.join('/'));
    
    },
  },
  created() {
    this.setActiveByRoute();
  },
  computed: {
    ...mapState('layout', {
      sidebarOpened: state => !state.sidebarClose,
      activeItem: state => state.sidebarActiveElement,
    }),
  },
};
</script>

<!-- Sidebar styles should be scoped -->
<style src="./Sidebar.scss" lang="scss" scoped/>
