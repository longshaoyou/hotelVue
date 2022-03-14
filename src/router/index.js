import Vue from 'vue'
import VueRouter from 'vue-router'
// 静态引入
const RoomInquire = () => import('/src/views/backstage/RoomInquire')
const ResidentInfo = () => import('/src/views/backstage/ResidentInfo')
const RoomManage = () => import('/src/views/backstage/RoomManage')
const StaffManagemen = () => import('/src/views/backstage/StaffManagement')
const Backstage = () => import('/src/views/backstage/BackstageApp')
const LoginApp = () => import('/src/views/login/LoginApp')
Vue.use(VueRouter)
const routes = [
  // 登录界面
  {
    path: '/login',
    name: 'backstageApp',
    component: LoginApp
  },
  // 主页
  {
    path: '/',
    name: 'backstageApp',
    component: Backstage,
    children: [{
        path: 'room/inquire',
        name: "roomInquire",
        component: RoomInquire,
      },
      {
        path: 'room/manage',
        name: 'roomManage',
        component: RoomManage,
      },
      {
        path: 'resident/inquire',
        name: 'ResidentInfo',
        component: ResidentInfo,
      },
      {
        path: 'staff/manage',
        name: 'StaffManagemen',
        component: StaffManagemen,
      },
      {
        // 其他界面默认跳转到信息查询界面
        path: '*',
        redirect: '/room/inquire'
      }
    ]
  },
];

const router = new VueRouter({
  mode: 'history',
  routes
})
router.beforeEach((to, from, next) => {
  // 如果打开登录界面，有token直接跳转
  if (to.path == '/login') {
    if (window.localStorage.token) {
      next('/')
      return;
    }
    next()
    return;
  } else {
    // 如果部署登录界面，检查token，不存在就跳转去登录
    if (window.localStorage.token) {
      next()
      return;
    }
    next('/login');
    return
  }
  next()
})
export default router