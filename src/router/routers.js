const Home = () => import('@/views/Home'); // 首页 
const Login = () => import('@/views/Login'); // 登录页面
const UserCenter = () => import('@/views/UserCenter'); // 用户中心页面
const NotFound = () => import('@/views/NotFound') // 没有找到页面
const Products = () => import('@/views/Products') // 产品页面
const Download = () => import('@/views/Download') // 下载专区
const Beagent = () => import('@/views/BeAgent') // 成为代理商
const FeedBack = () => import('@/views/Feedback') // 反馈
const AgnetProductManage = () => import('@/views/AgentProductManage') // 代理产品管理
const FeedBackManage = () => import('@/views/FeedbackManage') // 反馈工单管理
const RechargeRefund = () => import('@/views/RechargeRefund') // 充值与退款
const AdminManage = () => import('@/views/AdminManage') // 管理员管理
const AgentQualification = () => import('@/views/AdminManage/AgentQualification') // 代理商资质审核
const AgentInfoManage = () => import('@/views/AdminManage/AgentInfoManage') // 代理商信息管理
const CustomerInfoManage = () => import('@/views/AdminManage/CustomerInfoManage') // 客户信息管理
const RefundOnline = () => import('@/views/AdminManage/RefundOnline') // 在线退款
const CooperationRules = () => import('@/views/AdminManage/CooperationRules') // 渠道合作规则设置
const AgentFeedBackManage = () => import('@/views/AdminManage/AgentFeedBackManage') // 处理工单
const NotifyInfo = () => import('@/views/AdminManage/NotifyInfo') // 通知信息

const routes = [{
    name: 'home',
    path: '/',
    component: Home,
    meta: {
      requiresAuth: false,
    },
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      hideMenu: true,
      requiresAuth: false,
    },
  },
  {
    name: 'userc',
    path: '/userc',
    component: UserCenter,
    meta: {
      requiresAuth: true,
      roles: ['*']
    }
  },
  {
    name: 'products',
    path: '/products',
    component: Products,
    meta: {
      requiresAuth: false,
      roles: ['*']
    }
  },
  {
    name: 'download',
    path: '/download',
    component: Download,
    meta: {
      requiresAuth: true,
      roles: ['*']
    }
  },
  {
    name: 'beAgent',
    path: '/beAgent',
    component: Beagent,
    meta: {
      requiresAuth: true,
      roles: ['*']
    }
  },
  {
    name: 'feedback',
    path: '/feedback',
    component: FeedBack,
    meta: {
      requiresAuth: true,
      roles: ['*']
    }
  },
  {
    name: 'agnetproductmanage',
    path: '/agent_product_manage',
    component: AgnetProductManage,
    meta: {
      requiresAuth: true,
      roles: ['*']
    }
  },
  {
    name: 'feedbackmanage',
    path: '/feedbackmanage',
    component: FeedBackManage,
    meta: {
      requiresAuth: true,
      roles: ['*']
    }
  },
  {
    name: 'rechargerefund',
    path: '/recharge_refund',
    component: RechargeRefund,
    meta: {
      requiresAuth: true,
      roles: ['*']
    }
  },
  {
    name: 'adminManage',
    path: '/adminManage',
    component: AdminManage,
    redirect: '/adminManage/agentQualification',
    meta: {
      requiresAuth: true,
      roles: ['*']
    },
    children: [{
        name: 'agentQualification',
        path: 'agentQualification',
        component: AgentQualification,
        meta: {
          requiresAuth: true,
          roles: ['*']
        }
      },
      {
        name: 'agentInfoManage',
        path: 'agentInfoManage',
        component: AgentInfoManage,
        meta: {
          requiresAuth: true,
          roles: ['*']
        }
      },
      {
        name: 'customerInfoManage',
        path: 'customerInfoManage',
        component: CustomerInfoManage,
        meta: {
          requiresAuth: true,
          roles: ['*']
        }
      },
      {
        name: 'refundOnline',
        path: 'refundOnline',
        component: RefundOnline,
        meta: {
          requiresAuth: true,
          roles: ['*']
        }
      },
      {
        name: 'cooperationRules',
        path: 'cooperationRules',
        component: CooperationRules,
        meta: {
          requiresAuth: true,
          roles: ['*']
        }
      },
      {
        name: 'agentFeedBackManage',
        path: 'agentFeedBackManage',
        component: AgentFeedBackManage,
        meta: {
          requiresAuth: true,
          roles: ['*']
        }
      },
      {
        name: 'notifyInfo',
        path: 'notifyInfo',
        component: NotifyInfo,
        meta: {
          requiresAuth: true,
          roles: ['*']
        }
      },
    ]
  },
  {
    name: 'notfound',
    path: '/notfound',
    component: NotFound,
    meta: {
      requiresAuth: false,
    },
  }
];

export default routes;