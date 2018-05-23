export default [
  {
    path: '/',
    component: require('./assets/vue/pages/home.vue')
  },
  {
    path: '/detail/:selection',
    component: require('./assets/vue/pages/detail.vue')
  },
  {
    path: '/menu/',
    component: require('./assets/vue/pages/menu.vue')
  },
]
