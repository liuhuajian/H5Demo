import Vue from 'vue'
import Router from 'vue-router'
import BecomeVip from '@/components/BecomeVip.vue'
import topUp from '@/components/topUp.vue'
import repair from '@/components/repair.vue'
import refund from '@/components/refund.vue'
import coupon from '@/components/coupon.vue'
import AXIO from 'axios'

import ElemeUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Router)
Vue.use(AXIO)
Vue.use(ElemeUI)

export default new Router({
  base: '/wdb007',
  routes: [
    {
      path: '/vip/userid/:userId/token/:userToken',   
      name: 'VIP',
      component: BecomeVip
    },
    {
      path: '/topup/userid/:userId/token/:userToken',
      name: 'topUp',
      component: topUp
    },
    {
      path:"/repair",
      name: 'repair',
      component: repair
    },
    {
      path:"/refund",
      name: 'refund',
      component: refund
    },
    {
      path:"/coupon",
      name: 'coupon',
      component: coupon
    },
    
  ]
})
