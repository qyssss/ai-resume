import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomeView from '@/views/HomeView.vue'
/* 暂时开放路由守卫，用于测试，后续需要关闭 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: false // home页面不需要认证
      }
    },
    {
      path: '/resume',
      name: 'resume',
      component: () => import('../views/ResumeForm.vue'),
      meta: {
        requiresAuth: false // 需要登录才能访问
      }
    },
    {
      path: '/ai-agent',
      name: 'ai-agent',
      component: () => import('../views/AgentPage.vue'),
      meta: {
        requiresAuth: true // 需要登录才能访问
      }
    },
    {
      path: '/interview',
      name: 'interview',
      component: () => import('../views/InterviewPage.vue'),
      meta: {
        requiresAuth: true // 需要登录才能访问
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        requiresAuth: false // 登录页面不需要认证
      }
    },
    {
      path: '/features',
      name: 'features',
      component: () => import('../views/FeaturesView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/cases',
      name: 'cases',
      component: () => import('../views/CaseStudiesView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('../views/JobCenter.vue'),
      meta: {
        requiresAuth: true  // 需要登录才能访问
      }
    }
  ]
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 获取用户store
  const userStore = useUserStore()

  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    // 检查用户是否已登录
    if (!userStore.isLoggedIn) {
      // 检查localStorage中是否有登录信息
      const savedLoginStatus = localStorage.getItem('isLoggedIn')
      const savedUserInfo = localStorage.getItem('userInfo')
      const savedToken = localStorage.getItem('authToken')

      if (savedLoginStatus === 'true' && savedUserInfo && savedToken) {
        // 尝试恢复登录状态
        try {
          await userStore.checkLoginStatus()
          if (userStore.isLoggedIn) {
            next() // 登录状态恢复成功，允许访问
            return
          }
        } catch (error) {
          console.error('恢复登录状态失败:', error)
        }
      }

      // 未登录，重定向到首页
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
      return
    }
  }

  // 如果已登录用户访问登录页面，重定向到首页
  if (to.name === 'login' && userStore.isLoggedIn) {
    next({ path: '/' })
    return
  }

  // 其他情况正常通过
  next()
})
// 切换页面后保持滚动到顶部
router.afterEach((to, from) => {
  window.scrollTo(0, 0);
});
export default router
