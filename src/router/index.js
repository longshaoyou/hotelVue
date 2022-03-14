import Vue from 'vue'
import VueRouter from 'vue-router'
const RoomInquire = () => import('/src/views/backstage/RoomInquire')
const ResidentInfo = () => import('/src/views/backstage/ResidentInfo')
const RoomManage = () => import('/src/views/backstage/RoomManage')
const StaffManagemen = () => import('/src/views/backstage/StaffManagement')
const Backstage = () => import('/src/views/backstage/BackstageApp')
const LoginApp = () => import('/src/views/login/LoginApp')
Vue.use(VueRouter)
const routes = [{
    path: '/login',
    name: 'backstageApp',
    component: LoginApp
  },
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
  if (to.path == '/login') {
    if (window.localStorage.token) {
      next('/')
      return;
    }
    next()
    return;
  } else {
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