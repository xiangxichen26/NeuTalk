import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage.vue'),
      redirect: '/postList',
      children: [
        {
          path:'/postList',
          name:'postList',
          component: () => import('../views/PostList.vue')
        },
        {
          path:'/postDetail/:id',
          name:'postDetail',
          component: () => import('../views/PostDetail.vue')
        },
        {
          path:'/myPostList',
          name:'myPostList',
          component: () => import('../views/MyPostList.vue')
        },
        {
          path:'/myCollectionList',
          name:'myCollectionList',
          component: () => import('../views/MyCollectionList.vue')
        },

      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
  ]
})

export default router
