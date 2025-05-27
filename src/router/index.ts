import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/resume',
      name: 'resume',
      component: () => import('../views/ResumeForm.vue')
    },
    {
      path: '/ai-agent',
      name: 'ai-agent',
      component: () => import('../views/AgentPage.vue')
    }
  ]
})

export default router
