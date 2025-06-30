<template>
  <div class="page-container">
    <b-breadcrumb>
      <b-breadcrumb-item>YOU ARE HERE</b-breadcrumb-item>
      <b-breadcrumb-item active>Typography</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title">
      <span class="fw-semi-bold">斗拱云工程</span>
    </h1>

    <el-row class="tac full-height">
      <el-col :span="4" class="sidebar">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
          unique-opened
        >
          <el-menu-item index="0">
            <i class="el-icon-s-home"></i>
            <span class="menu-title">看板</span>
          </el-menu-item>

          <el-submenu index="1">
            <template #title>
              <i class="el-icon-location"></i>
              <span class="menu-title">项目管理</span>
            </template>
            
            <el-menu-item index="1-1">项目</el-menu-item>
            <el-menu-item index="1-2">项目期初</el-menu-item>
            <el-menu-item index="1-3">项目预算</el-menu-item>
            <el-menu-item index="1-4">用印申请</el-menu-item>
            <el-menu-item index="1-5">成本中心</el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template #title>
              <i class="el-icon-setting"></i>
              <span class="menu-title">合同管理</span>
            </template>
            
            <el-menu-item index="2-1">收入合同</el-menu-item>
            <el-menu-item index="2-2">收入合同签证</el-menu-item>
            <el-menu-item index="2-3">收入合同预算</el-menu-item>
            <el-menu-item index="2-4">支出合同</el-menu-item>
            <el-menu-item index="2-5">支出合同签字</el-menu-item>
            <el-menu-item index="2-6">支出合同执行</el-menu-item>
            <el-menu-item index="2-7">支出合同结算</el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template #title>
              <i class="el-icon-dish"></i>
              <span class="menu-title">物料管理</span>
            </template>
            
            <el-menu-item index="3-1">材料计划</el-menu-item>
            <el-menu-item index="3-2">采购申请</el-menu-item>
            <el-menu-item index="3-3">采购订单</el-menu-item>
            <el-menu-item index="3-4">入库单</el-menu-item>
            <el-menu-item index="3-5">退货单</el-menu-item>
            <el-menu-item index="3-6">材料结算单</el-menu-item>
            <el-menu-item index="3-7">出库单</el-menu-item>
            <el-menu-item index="3-8">调拨单</el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <template #title>
              <i class="el-icon-plus"></i>
              <span class="menu-title">费用管理</span>
            </template>
            
            <el-menu-item index="4-1">选项1</el-menu-item>
            <el-menu-item index="4-2">选项2</el-menu-item>
            <el-menu-item index="4-3">选项3</el-menu-item>
          </el-submenu>

          <el-submenu index="5">
            <template #title>
              <i class="el-icon-key"></i>
              <span class="menu-title">财务账款</span>
            </template>
            
            <el-menu-item index="5-1">选项1</el-menu-item>
            <el-menu-item index="5-2">选项2</el-menu-item>
            <el-menu-item index="5-3">选项3</el-menu-item>
          </el-submenu>

          <el-submenu index="6">
            <template #title>
              <i class="el-icon-user"></i>
              <span class="menu-title">用户管理</span>
            </template>
            
            <el-menu-item index="6-1">选项1</el-menu-item>
            <el-menu-item index="6-2">选项2</el-menu-item>
            <el-menu-item index="6-3">选项3</el-menu-item>
          </el-submenu>

          <el-submenu index="7">
            <template #title>
              <i class="el-icon-lock"></i>
              <span class="menu-title">施工管理</span>
            </template>
            
            <el-menu-item index="7-1">选项1</el-menu-item>
            <el-menu-item index="7-2">选项2</el-menu-item>
            <el-menu-item index="7-3">选项3</el-menu-item>
          </el-submenu>

          <el-submenu index="8">
            <template #title>
              <i class="el-icon-sunset"></i>
              <span class="menu-title">财务账款</span>
            </template>
            
            <el-menu-item index="8-1">选项1</el-menu-item>
            <el-menu-item index="8-2">选项2</el-menu-item>
            <el-menu-item index="8-3">选项3</el-menu-item>
          </el-submenu>

          <el-submenu index="9">
            <template #title>
              <i class="el-icon-timer"></i>
              <span class="menu-title">文档管理</span>
            </template>
            
            <el-menu-item index="9-1">选项1</el-menu-item>
            <el-menu-item index="9-2">选项2</el-menu-item>
            <el-menu-item index="9-3">选项3</el-menu-item>
          </el-submenu>
          
          <el-submenu index="10">
            <template #title>
              <i class="el-icon-crop"></i>
              <span class="menu-title">资金账户管理</span>
            </template>
            
            <el-menu-item index="10-1">选项1</el-menu-item>
            <el-menu-item index="10-2">选项2</el-menu-item>
            <el-menu-item index="10-3">选项3</el-menu-item>
          </el-submenu>
          
          <el-submenu index="11">
            <template #title>
              <i class="el-icon-bell"></i>
              <span class="menu-title">基础资料</span>
            </template>
            
            <el-menu-item index="11-1">选项1</el-menu-item>
            <el-menu-item index="11-2">选项2</el-menu-item>
            <el-menu-item index="11-3">选项3</el-menu-item>
          </el-submenu>
          
          <el-submenu index="12">
            <template #title>
              <i class="el-icon-bell"></i>
              <span class="menu-title">审批功能流</span>
            </template>
            
            <el-menu-item index="12-1">审批功能</el-menu-item>
          </el-submenu>

          <el-submenu index="13">
            <template #title>
              <i class="el-icon-postcard"></i>
              <span class="menu-title">统计分析</span>
            </template>
            
            <el-menu-item index="13-1">选项1</el-menu-item>
            <el-menu-item index="13-2">选项2</el-menu-item>
            <el-menu-item index="13-3">选项3</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      
      <el-col :span="19" class="main-content">
        <div v-if="activeIndex === '0'" class="dashboard">
          <!-- Row for My Approvals and Task Statistics -->
          <el-row gutter={20}>
            <el-col :span="12">
              <el-card class="dashboard-card">
                <div class="card-header">
                  <span class="section-title">我的审批</span>
                  <span class="warning-icon"><i class="el-icon-bell"></i>预警</span>
                </div>
                <div class="card-content">
                  <el-row gutter={10} type="flex" justify="space-around">
                    <el-col :span="24" class="approval-item">
                      <i class="el-icon-edit icon-large"></i>
                      <div class="text">  
                        <span>0</span>  
                        <span>待我审批</span>  
                      </div> 
                    </el-col>
                    <el-col :span="24" class="approval-item">
                      <i class="el-icon-share icon-large"></i>
                      <div class="text">  
                        <span>0</span>  
                        <span>我发起的</span>  
                      </div> 
                    </el-col>
                    <el-col :span="24" class="approval-item">
                      <i class="el-icon-delete icon-large"></i>
                      <div class="text">  
                        <span>0</span>  
                        <span>抄送我的</span>  
                      </div> 
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>

            <el-col :span="12">
              <el-card class="dashboard-card">
                <div class="card-header">
                  <span class="section-title">任务统计</span>
                </div>
                <div class="card-content">
                  <el-row gutter={10} type="flex" justify="space-around">
                    <el-col :span="12" class="task-stat-item">
                      <i class="el-icon-edit icon-small"></i>
                      <div class="text">  
                        <span>0</span>  
                        <span class="status unstarted">未开始</span>  
                      </div> 
                    </el-col>
                    <el-col :span="12" class="task-stat-item">
                      <i class="el-icon-share icon-small"></i>
                      <div class="text">  
                        <span>0</span>  
                        <span class="status in-progress">进行中</span>  
                      </div> 
                    </el-col>
                    <el-col :span="12" class="task-stat-item">
                      <i class="el-icon-delete icon-small"></i>
                      <div class="text">  
                        <span>0</span>  
                        <span class="status overdue">已逾期</span>  
                      </div> 
                    </el-col>
                    <el-col :span="12" class="task-stat-item">
                      <i class="el-icon-delete icon-small"></i>
                      <div class="text">  
                        <span>0</span>  
                        <span class="status completed">已完成</span>  
                      </div> 
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- Row for Common Applications -->
          <el-row gutter={20}>
            <el-col :span="24">
              <el-card class="dashboard-card">
                <div class="card-header">
                  <span class="section-title">常用应用</span>
                  <span class="section-action"><i class="el-icon-edit"></i>编辑</span>
                </div>
                <div class="card-content app-grid">
                  <div class="app-item">
                    <i class="el-icon-postcard app-icon"></i>
                    <span>项目</span>
                  </div>
                  <div class="app-item">
                    <i class="el-icon-postcard app-icon"></i>
                    <span>收入合同</span>
                  </div>
                  <div class="app-item">
                    <i class="el-icon-postcard app-icon"></i>
                    <span>支出合同</span>
                  </div>
                  <div class="app-item">
                    <i class="el-icon-postcard app-icon"></i>
                    <span>费用报销</span>
                  </div>
                  <div class="app-item">
                    <i class="el-icon-postcard app-icon"></i>
                    <span>收款登记</span>
                  </div>
                  <div class="app-item">
                    <i class="el-icon-postcard app-icon"></i>
                    <span>付款申请</span>
                  </div>
                  <div class="app-item">
                    <i class="el-icon-postcard app-icon"></i>
                    <span>付款登记</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- Row for Task Notifications -->
          <el-row gutter={20}>
            <el-col :span="12">
              <el-card class="dashboard-card">
                <div class="card-header">
                  <span class="section-title">我的任务</span>
                  <span class="section-action">更多 ></span>
                </div>
                <div class="card-content">
                  <button class="add-task-btn">+新增任务</button>
                  <span class="no-content">暂无内容</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="dashboard-card">
                <div class="card-header">
                  <span class="section-title">任务通知</span>
                  <span class="section-action">更多 ></span>
                </div>
                <div class="card-content">
                  <span class="no-content">暂无内容</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div v-else-if="activeIndex === '1-1'">
          <Income></Income>
        </div>
        <div v-else-if="activeIndex === '2-4'">
          <Disburse></Disburse>
        </div>
        <div v-else-if="activeIndex === '12-1'">
          <approval></approval>
        </div>
        <!-- Add other components based on activeIndex as needed -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import Income from "../MunicipalCorporation/Income.vue";
import Disburse from '../MunicipalCorporation/Disburse.vue';
import approval from './approval.vue'; 

export default {
  data() {  
    return {  
      activeIndex: '0',
    };      
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {  
      console.log('Selected menu item index:', key);  
      this.activeIndex = key;
    }  
  },
  name: 'AnotherPage',
  components: { Widget, Disburse, Income, approval },
};
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.page-title {
  margin: 20px 0;
  font-size: 24px;
  font-weight: 600;
}

.full-height {
  flex: 1;
  height: 0;
}

.sidebar {
  height: 100%;
  overflow-y: auto;
  background-color: #fff;
  border-right: 1px solid #ebeef5;
  padding: 10px 0;

  .el-menu-vertical-demo {
    height: 100%;
  }

  .menu-title {
    display: inline-block;
    max-width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .el-submenu__title {
    display: flex;
    align-items: center;
  }

  .el-submenu__title i {
    margin-right: 8px;
    font-size: 16px;
  }

  .el-menu-item, .el-submenu__title {
    font-size: 14px;
    line-height: 32px;
  }

  .el-menu-item:hover .menu-title,
  .el-submenu__title:hover .menu-title {
    white-space: normal;
    background-color: #f5f7fa;
    z-index: 1;
  }

  .el-menu-item {
    display: flex;
    align-items: center;
  }
}

.main-content {
  padding: 20px;
  overflow-y: auto;
  height: 100%;
}

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-card {
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.warning-icon {
  color: #f56c6c;
  display: flex;
  align-items: center;
}

.card-content {
  padding: 10px 0;
}

.approval-item, .task-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-large {
  font-size: 32px;
  color: #409EFF;
  margin-bottom: 10px;
}

.icon-small {
  font-size: 25px;
  color: #409EFF;
  margin-bottom: 5px;
}

.text span:first-child {
  font-size: 24px;
  font-weight: bold;
}

.text span:last-child {
  font-size: 14px;
  color: #666;
}

.status {
  font-weight: bold;
}

.status.unstarted {
  color: red;
}

.status.in-progress {
  color: purple;
}

.status.overdue {
  color: peru;
}

.status.completed {
  color: green;
}

.app-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.app-item:hover {
  background-color: #e6f7ff;
}

.app-icon {
  font-size: 24px;
  color: #409EFF;
  margin-bottom: 5px;
}

.task-notifications {
  display: flex;
  gap: 20px;
}

.task-box {
  flex: 1;
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.section-action {
  color: blue;
  cursor: pointer;
}

.add-task-btn {
  background-color: #409EFF;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s;
}

.add-task-btn:hover {
  background-color: #66b1ff;
}

.no-content {
  display: block;
  text-align: center;
  margin-top: 50px;
  color: #999;
}

@media (max-width: 1200px) {
  .app-item {
    width: 45%;
  }
}

@media (max-width: 768px) {
  .app-item {
    width: 100%;
  }
}

.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 10px;
  border: 2px solid #f1f1f1;
}
</style>
