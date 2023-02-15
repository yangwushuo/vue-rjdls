const Home = () => import('@/views/Home'); // 首页 
const Login = () => import('@/views/Login'); // 登录页面
const UserCenter = () => import('@/views/UserCenter'); // 用户中心页面
const NotFound = () => import('@/views/NotFound') // 没有找到页面
const Products = () => import('@/views/Products') // 产品页面
const Download = () => import('@/views/Download') // 下载专区
const Beagent = () => import('@/views/BeAgent') // 成为代理商
const FeedBack = () => import('@/views/Feedback') // 反馈
const AgnetProductManage = () => import('@/views/AgentProductManage') // 代理产品管理
const AgentProductManage = () => import('@/views/AgentProductOrder') // 客户订单
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
const AdminProductManage = () => import('@/views/AdminManage/AdminProductManage') // 管理员产品管理

const routes = [{
    name: 'index',
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
      roles: ['1','2','3']
    }
  },
  {
    name: 'products',
    path: '/products',
    component: Products,
    meta: {
      requiresAuth: false,
      roles: ['1']
    }
  },
  {
    name: 'download',
    path: '/download',
    component: Download,
    meta: {
      requiresAuth: true,
      roles: ['1']
    }
  },
  {
    name: 'be_agent',
    path: '/be_agent',
    component: Beagent,
    meta: {
      requiresAuth: true,
      roles: ['1']
    }
  },
  {
    name: 'feedback',
    path: '/feedback',
    component: FeedBack,
    meta: {
      requiresAuth: true,
      roles: ['1']
    }
  },
  {
    name: 'agent_product_manage',
    path: '/agent_product_manage',
    component: AgnetProductManage,
    meta: {
      requiresAuth: true,
      roles: ['2']
    }
  },
  {
    name: 'feedback_manage',
    path: '/feedback_manage',
    component: FeedBackManage,
    meta: {
      requiresAuth: true,
      roles: ['2']
    }
  },
  {
    name: 'recharge_refund',
    path: '/recharge_refund',
    component: RechargeRefund,
    meta: {
      requiresAuth: true,
      roles: ['2']
    }
  },
  {
    name: 'agent_product_order',
    path: '/agent_product_order',
    component: AgentProductManage,
    meta: {
      requiresAuth: true,
      roles: ['2']
    }
  },
  {
    name: 'admin_manage',
    path: '/admin_manage',
    component: AdminManage,
    redirect: '/admin_manage/product_manage',
    meta: {
      requiresAuth: true,
      roles: ['3']
    },
    children: [{
        name: 'agent_qualification',
        path: 'agent_qualification',
        component: AgentQualification,
        meta: {
          requiresAuth: true,
          roles: ['3']
        }
      },
      {
        name: 'agent_info_manage',
        path: 'agent_info_manage',
        component: AgentInfoManage,
        meta: {
          requiresAuth: true,
          roles: ['3']
        }
      },
      {
        name: 'customer_info_manage',
        path: 'customer_info_manage',
        component: CustomerInfoManage,
        meta: {
          requiresAuth: true,
          roles: ['3']
        }
      },
      {
        name: 'refund_online',
        path: 'refund_online',
        component: RefundOnline,
        meta: {
          requiresAuth: true,
          roles: ['3']
        }
      },
      {
        name: 'cooperation_rules',
        path: 'cooperation_rules',
        component: CooperationRules,
        meta: {
          requiresAuth: true,
          roles: ['3']
        }
      },
      {
        name: 'agent_feedback_manage',
        path: 'agent_feedback_manage',
        component: AgentFeedBackManage,
        meta: {
          requiresAuth: true,
          roles: ['3']
        }
      },
      {
        name: 'notify_info',
        path: 'notify_info',
        component: NotifyInfo,
        meta: {
          requiresAuth: true,
          roles: ['3']
        }
      },
      {
        name: 'product_manage',
        path: 'product_manage',
        component: AdminProductManage,
        meta: {
          requiresAuth: true,
          roles: ['3']
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