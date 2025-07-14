import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/components/Layout/Layout';
import Login from '@/pages/Login/Login';
import ErrorPage from '@/pages/Error/Error';

Vue.use(Router);

// 模块配置
const moduleConfigs = [
  {
    prefix: 'zhgl',
    components: ['jygl', 'nbzl', 'xmdangan', 'nbzhiliao']
  },
  {
    prefix: 'tzfz', 
    components: ['xmda', 'xmlx', 'xmzx', 'Project', 'htdaa', 'zlda', 'kjds', 'hetong']
  },
  {
    prefix: 'test8',
    components: ['feiyong', 'biaoge', 'htda', 'qybf', 'rubbish', 'renyuan', 'cheliang']
  },
  {
    prefix: 'test10',
    components: ['kefu', 'gongcheng', 'huanwei']
  },
  {
    prefix: 'test11',
    components: ['jiage', 'jjzb', 'gccl', 'zxfw']
  },
  {
    prefix: 'test12',
    components: ['dazl', 'xmjd', 'xmjd2']
  },
  {
    prefix: 'test13',
    components: ['gc', 'jg', 'zx']
  },
  {
    prefix: 'ProjectManagement',
    components: ['ProjectManagement1', 'Project', 'FileManagement']
  },
  {
    prefix: 'MunicipalCorporation',
    components: ['Disburse', 'Income','total']
  },
  {
    prefix: 'szgs',
    components: ['Disburse', 'Income', 'total']
  },
  {
    prefix: 'PerformanceAppraisal',
    components: ['gcxm', 'zhengming', 'gcxm_', 'grxx', 'rwjx', 'Performance', 'YuanGong']
  },
  {
    prefix: 'Tables',
    components: ['Daily', 'Project', 'Serve']
  },
  {
    prefix: 'WaterCorporation',
    components: ['churuku', 'gongshui', 'sc2', 'chengben', 'guanli', 'guanli2', 'Cost', 'PayProcess', 'rygl', 'szjc']
  },
  {
    prefix: 'search',
    components: ['sousuo']
  },
  {
    prefix: 'dgy',
    components: ['dgy']
  }
];

// 特殊路由 - 不需要模块前缀的路由
const specialRoutes = [
  { path: 'dashboard', name: 'Dashboard', component: () => import('@/pages/Visits/Visits') },
  { path: 'typography', name: 'Typography', component: () => import('@/pages/Typography/Typography') },
  { path: 'notifications', name: 'Notifications', component: () => import('@/pages/Notifications/Notifications') },
  { path: 'components/icons', name: 'Icons', component: () => import('@/pages/Icons/Icons') },
  { path: 'components/charts', name: 'Charts', component: () => import('@/pages/Charts/Charts') },
  { 
    path: 'MunicipalCorporation/contract-payment/:contractId', 
    name: 'contract-payment-details', 
    component: () => import('@/pages/MunicipalCorporation/detail'),
  },
  {
  path: '/expense-contract/:contractId',
  name: 'expense-contract-details',
  component: () => import('@/pages/MunicipalCorporation/detail1')
  }
];

// 生成路由
const generateRoutes = () => {
  const children = [];
  
  moduleConfigs.forEach(config => {
    config.components.forEach(comp => {
      children.push({
        path: `${config.prefix}/${comp}`,
        name: comp,
        component: () => import(`@/pages/${config.prefix}/${comp}`)
      });
    });
  });
  
  // 添加特殊路由
  children.push(...specialRoutes);
  
  // 处理 WaterCorporation/churuku 的子路由
  const churukuIndex = children.findIndex(route => route.path === 'WaterCorporation/churuku');
  if (churukuIndex !== -1) {
    children[churukuIndex].children = [
      { path: 'chukudan', name: 'chukudan', component: () => import('@/pages/WaterCorporation/chukudan') },
      { path: 'rukudan', name: 'rukudan', component: () => import('@/pages/WaterCorporation/rukudan') },
      { path: 'shicaichuku', name: 'shicaichuku', component: () => import('@/pages/WaterCorporation/shicaichuku') },
      { path: 'shicairuku', name: 'shicairuku', component: () => import('@/pages/WaterCorporation/shicairuku') },
      { path: 'PACchuruku', name: 'PACchuruku', component: () => import('@/pages/WaterCorporation/PACchuruku') }
    ];
  }
  
  return [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/error',
      name: 'Error',
      component: ErrorPage,
    },
    {
      path: '/app',
      name: 'Layout',
      component: Layout,
      children,
    },
    {
      path: '*',
      redirect: '/error',
    }
  ];
};

export default new Router({
  mode: 'hash',
  routes: generateRoutes(),
});