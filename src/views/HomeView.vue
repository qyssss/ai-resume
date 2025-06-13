<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 font-sans overflow-x-hidden">
    <!-- 炫彩导航栏 -->
    <nav class="fixed w-full z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <svg class="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span
                class="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                ResumeAI
              </span>
            </router-link>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <router-link v-for="nav in navigation" :key="nav.name" :to="nav.path"
                class="px-3 py-2 rounded-md text-sm font-medium transition"
                :class="[currentRoute === nav.path ? 'text-white bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800']">
                {{ nav.name }}
              </router-link>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <!-- 登录/注册按钮 -->
            <button v-if="!userStore.isLoggedIn" @click="openAuthModal"
              class="px-4 py-2 rounded-full bg-gray-800 text-white font-medium hover:bg-gray-700 transition">
              登录/注册
            </button>
            <!-- 用户信息 -->
            <div v-else class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <span class="text-sm font-medium">{{ userStore.userInitial }}</span>
              </div>
              <span class="text-sm text-gray-300">{{ userStore.userInfo.username }}</span>
              <button @click="handleLogout" class="text-gray-400 hover:text-white transition">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
            <button @click="startExperience"
              class="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition">
              立即体验
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主视觉区域 -->
    <main class="pt-24 pb-12">
      <!-- 动态渐变背景 -->
      <div class="gradient-bg absolute top-0 left-0 w-full h-[600px] -z-10"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 英雄区域 -->
        <section class="flex flex-col md:flex-row items-center justify-between py-20">
          <div class="md:w-1/2 mb-12 md:mb-0">
            <h1 class="text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">AI智能简历</span>
              <br>让HR一眼相中你
            </h1>
            <p class="text-xl text-gray-300 mb-8">
              基于大语言模型的智能简历优化系统，通过率提升<span class="text-purple-400 font-bold">300%</span>
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button @click="startCreating"
                class="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-xl hover:shadow-purple-500/30 transition transform hover:-translate-y-1">
                开始创建 →
              </button>
              <button
                class="px-8 py-4 rounded-xl bg-gray-800 text-white font-bold border border-gray-700 hover:bg-gray-700 transition">
                观看演示
              </button>
            </div>
            <div class="mt-8 flex items-center space-x-4">
              <div class="flex -space-x-2">
                <img v-for="(avatar, index) in userAvatars" :key="index" :src="avatar"
                  class="w-10 h-10 rounded-full border-2 border-gray-800" />
              </div>
              <span class="text-gray-400 text-sm">已有 <span class="text-white">12,853</span> 位用户使用</span>
            </div>
          </div>

          <div class="md:w-1/2 relative">
            <div class="relative w-full max-w-lg">
              <!-- 3D简历卡片 -->
              <div class="absolute top-0 left-0 w-full h-full bg-purple-500/20 rounded-2xl -rotate-6"></div>
              <div class="absolute top-0 left-0 w-full h-full bg-blue-500/20 rounded-2xl rotate-6"></div>
              <div
                class="relative bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-700 transform transition duration-500 hover:rotate-0"
                :class="{ 'animate-float': isHovering }" @mouseenter="isHovering = true"
                @mouseleave="isHovering = false">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-xl font-bold">AI优化简历</h3>
                  <span class="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-xs">通过率92%</span>
                </div>
                <div class="space-y-4">
                  <div v-for="item in resumePreview" :key="item.title" class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                      <div class="h-2 w-2 rounded-full" :class="item.color"></div>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium">{{ item.title }}</p>
                      <p class="text-xs text-gray-400">{{ item.content }}</p>
                    </div>
                  </div>
                </div>
                <div class="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-xs text-gray-400">AI建议</p>
                      <p class="text-sm font-medium">添加项目数据</p>
                    </div>
                  </div>
                  <button class="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition">
                    立即优化
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 核心功能展示 -->
        <section class="py-20">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold mb-4">打造完美简历的<span class="text-purple-400">全流程解决方案</span></h2>
            <p class="text-gray-400 max-w-2xl mx-auto">从简历创建到面试准备，AI助手全程陪伴</p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <div v-for="(feature, index) in features" :key="index"
              class="bg-gray-800/50 hover:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border border-gray-700 transition transform hover:-translate-y-2 hover:shadow-xl">
              <div class="w-12 h-12 rounded-lg mb-6 flex items-center justify-center" :class="feature.bgColor">
                <component :is="feature.icon" class="h-6 w-6" :class="feature.iconColor" />
              </div>
              <h3 class="text-xl font-bold mb-3">{{ feature.title }}</h3>
              <p class="text-gray-400 mb-4">{{ feature.description }}</p>
              <button class="text-sm flex items-center text-purple-400 hover:text-purple-300 transition">
                了解更多
                <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        <!-- 动态数据展示 -->
        <section class="py-16 bg-gray-800/30 rounded-3xl mb-20">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8 text-center">
              <div v-for="stat in stats" :key="stat.id" class="p-6">
                <div class="text-4xl font-bold mb-2" :class="stat.color">
                  <span v-if="stat.plus">+</span>{{ stat.value }}<span v-if="stat.percent">%</span>
                </div>
                <p class="text-gray-400 text-sm">{{ stat.label }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- 登录注册模态框 -->
    <AuthModal :is-visible="showAuthModal" :external-error-message="authErrorMessage" @close="closeAuthModal"
      @login="handleLogin" @register="handleRegister" />

    <!-- 成功消息提示 -->
    <div v-if="showSuccessMessage"
      class="fixed top-0 left-0 right-0 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
      role="alert">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthModal from '@/components/AuthModal.vue'
import { useUserStore } from '@/stores/user'
import {
  SparklesIcon,
  PencilIcon,
  ChatBubbleLeftEllipsisIcon,
  BoltIcon,
  DocumentIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

const currentRoute = ref('/')
const isHovering = ref(false)
const showAuthModal = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')
const authErrorMessage = ref('')

// 路由相关
const route = useRoute()
const router = useRouter()

// 使用用户store
const userStore = useUserStore()

const navigation = [
  { name: '产品功能', path: '/features' },
  { name: '案例展示', path: '/cases' },
  { name: '定价方案', path: '/pricing' }
]

const userAvatars = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/75.jpg'
]

const resumePreview = [
  { title: '工作经历', content: '腾讯 · 高级前端工程师', color: 'bg-blue-400' },
  { title: '教育背景', content: '清华大学 · 计算机科学', color: 'bg-purple-400' },
  { title: '技术栈', content: 'Vue, React, Node.js', color: 'bg-green-400' },
  { title: '项目经验', content: '3个完整项目经历', color: 'bg-yellow-400' }
]

const features = [
  {
    icon: SparklesIcon,
    title: '智能生成',
    description: '上传现有简历或空白创建，AI自动生成专业简历内容',
    bgColor: 'bg-purple-500/20',
    iconColor: 'text-purple-400'
  },
  {
    icon: PencilIcon,
    title: 'AI润色',
    description: '根据目标职位智能优化内容，突出核心竞争力',
    bgColor: 'bg-blue-500/20',
    iconColor: 'text-blue-400'
  },
  {
    icon: ChatBubbleLeftEllipsisIcon,
    title: '模拟面试',
    description: '行业专属面试题库，AI模拟真实面试场景',
    bgColor: 'bg-green-500/20',
    iconColor: 'text-green-400'
  }
]

const stats = [
  { id: 1, value: '300', plus: true, percent: true, label: '简历通过率提升', color: 'text-purple-400' },
  { id: 2, value: '12', label: '行业模板选择', color: 'text-blue-400' },
  { id: 3, value: '98', percent: true, label: '用户满意度', color: 'text-green-400' },
  { id: 4, value: '5', label: '分钟快速生成', color: 'text-yellow-400' }
]

const startCreating = () => {
  // 跳转到简历创建页
  console.log('开始创建简历')
}

const startExperience = () => {
  // 跳转到体验页
  console.log('开始体验')
}

// 显示成功消息
const showSuccess = (message) => {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

// 关闭认证模态框
const closeAuthModal = () => {
  showAuthModal.value = false
  authErrorMessage.value = '' // 清除错误信息

  // 检查是否有重定向参数，登录成功后跳转
  if (route.query.redirect) {
    const redirectPath = String(route.query.redirect)
    router.push(redirectPath)
  }
}

// 打开认证模态框
const openAuthModal = () => {
  authErrorMessage.value = '' // 清除之前的错误信息
  showAuthModal.value = true
}

// 登录处理
const handleLogin = async (loginData) => {
  // 清除之前的错误信息
  authErrorMessage.value = ''

  const result = await userStore.login(loginData)
  if (result.success) {
    showAuthModal.value = false
    showSuccess('登录成功！欢迎回来')
    console.log('登录成功')

    // 登录成功后，如果有重定向参数，跳转到目标页面
    if (route.query.redirect) {
      const redirectPath = String(route.query.redirect)
      router.push(redirectPath)
    }
  } else {
    console.error('登录失败:', result.error)
    // 设置新的错误信息
    authErrorMessage.value = result.error
  }
}

// 注册处理
const handleRegister = async (registerData) => {
  // 清除之前的错误信息
  authErrorMessage.value = ''

  const result = await userStore.register(registerData)
  if (result.success) {
    showAuthModal.value = false
    showSuccess('注册成功！欢迎加入我们')
    console.log('注册成功')

    // 注册成功后，如果有重定向参数，跳转到目标页面
    if (route.query.redirect) {
      const redirectPath = String(route.query.redirect)
      router.push(redirectPath)
    }
  } else {
    console.error('注册失败:', result.error)
    // 设置新的错误信息
    authErrorMessage.value = result.error
  }
}

// 登出处理
const handleLogout = async () => {
  const result = await userStore.logout()
  if (result.success) {
    showSuccess('已成功登出')
    console.log('登出成功')
  } else {
    console.error('登出失败:', result.error)
  }
}

// 监听路由参数变化
watch(() => route.query, (newQuery) => {
  if (newQuery.showLogin === 'true' && !userStore.isLoggedIn) {
    // 显示登录提示
    showSuccess('请先登录后访问该页面')
    // 自动打开登录模态框
    openAuthModal()
  }
}, { immediate: true })

// 组件挂载时检查登录状态
onMounted(() => {
  userStore.checkLoginStatus()
})
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(-45deg, #6d28d9, #4338ca, #2563eb, #7c3aed);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}
</style>