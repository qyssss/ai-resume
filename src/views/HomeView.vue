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
              Login/Register
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
              Try Now
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
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">AI Smart
                Resume</span>
              <br>Make HR Notice You at First Sight
            </h1>
            <p class="text-xl text-gray-300 mb-8">
              AI-powered resume optimization system based on large language models, increasing success rate by <span
                class="text-purple-400 font-bold">300%</span>
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button @click="startCreating"
                class="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-xl hover:shadow-purple-500/30 transition transform hover:-translate-y-1">
                Start Creating →
              </button>
              <button @click="watchDemo"
                class="px-8 py-4 rounded-xl bg-gray-800 text-white font-bold border border-gray-700 hover:bg-gray-700 transition">
                Watch Demo
              </button>
            </div>
            <div class="mt-8 flex items-center space-x-4">
              <div class="flex -space-x-2">
                <img v-for="(avatar, index) in userAvatars" :key="index" :src="avatar"
                  class="w-10 h-10 rounded-full border-2 border-gray-800" />
              </div>
              <span class="text-gray-400 text-sm">Already used by <span class="text-white">12,853</span> users</span>
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
                  <h3 class="text-xl font-bold">AI Optimized Resume</h3>
                  <span class="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-xs">92% Success Rate</span>
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
                      <p class="text-xs text-gray-400">AI Suggestion</p>
                      <p class="text-sm font-medium">Add project metrics</p>
                    </div>
                  </div>
                  <button @click="navigateToOptimize"
                    class="text-xs bg-gray-300 hover:bg-gray-600 px-3 py-1 rounded-full transition">
                    Optimize Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 核心功能展示 -->
        <section class="py-20">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold mb-4">Complete Solution for <span class="text-purple-400">Perfect
                Resume</span></h2>
            <p class="text-gray-400 max-w-2xl mx-auto">From resume creation to interview preparation, AI assistant
              accompanies you throughout</p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <div v-for="(feature, index) in features" :key="index"
              class="bg-gray-800/50 hover:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border border-gray-700 transition transform hover:-translate-y-2 hover:shadow-xl">
              <div class="w-12 h-12 rounded-lg mb-6 flex items-center justify-center" :class="feature.bgColor">
                <component :is="feature.icon" class="h-6 w-6" :class="feature.iconColor" />
              </div>
              <h3 class="text-xl font-bold mb-3">{{ feature.title }}</h3>
              <p class="text-gray-400 mb-4">{{ feature.description }}</p>
              <button @click="navigateToFeature(feature.title)"
                class="text-sm flex items-center text-purple-500 hover:text-purple-800 transition">
                Learn More
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
            <div class="grid md:grid-cols-3 gap-8 text-center">
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
import { ref, onMounted, watch, computed } from 'vue'
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
  { name: 'Features', path: '/features' },
  { name: 'Case Studies', path: '/cases' },
]

const userAvatars = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/75.jpg'
]

const resumePreview = [
  { title: 'Work Experience', content: 'Google · Backend Software Engineer', color: 'bg-blue-400' },
  { title: 'Education', content: 'The University of Hong Kong · Computer Science', color: 'bg-purple-400' },
  { title: 'Tech Stack', content: 'Java, Spring Boot, Django, PostgreSQL, Docker, Kubernetes', color: 'bg-green-400' },
  { title: 'Projects', content: '1 Complete Project Experiences', color: 'bg-yellow-400' }
]

const features = [
  {
    icon: SparklesIcon,
    title: 'Resume Generation',
    description: 'Fill out the form to generate a polished resume with one click, supporting PDF export.',
    bgColor: 'bg-purple-500/20',
    iconColor: 'text-purple-400'
  },
  {
    icon: PencilIcon,
    title: 'AI Enhancement',
    description: 'Intelligently optimize content based on target position, highlighting core competitiveness',
    bgColor: 'bg-blue-500/20',
    iconColor: 'text-blue-400'
  },
  {
    icon: ChatBubbleLeftEllipsisIcon,
    title: 'Mock Interview',
    description: 'Industry-specific interview question bank, AI simulates real interview scenarios',
    bgColor: 'bg-green-500/20',
    iconColor: 'text-green-400'
  }
]

const stats = [
  { id: 1, value: '300', plus: true, percent: true, label: 'Resume Success Rate Increase', color: 'text-purple-400' },
  { id: 2, value: '98', percent: true, label: 'User Satisfaction', color: 'text-green-400' },
  { id: 3, value: '5', label: 'Minutes to Generate', color: 'text-yellow-400' }
]

const startCreating = () => {
  // 跳转到简历创建页
  router.push('/resume')
}

const startExperience = () => {
  // 跳转到AI助手页面
  router.push('/resume')
}

// 观看演示（暂时显示提示）
const watchDemo = () => {
  router.push('/features')
  showSuccess('Demo feature coming soon!')
}

// 功能卡片导航
const navigateToFeature = (featureType) => {
  switch (featureType) {
    case 'Smart Generation':
    case 'AI Enhancement':
      router.push('/resume')
      break
    case 'Mock Interview':
      router.push('/interview')
      break
    default:
      router.push('/resume')
  }
}

// 优化按钮导航
const navigateToOptimize = () => {
  router.push('/resume')
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
    showSuccess('Login successful! Welcome back')
    console.log('Login successful')

    // 登录成功后，如果有重定向参数，跳转到目标页面
    if (route.query.redirect) {
      const redirectPath = String(route.query.redirect)
      router.push(redirectPath)
    }
  } else {
    console.error('Login failed:', result.error)
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
    showSuccess('Registration successful! Welcome to join us')
    console.log('Registration successful')

    // 注册成功后，如果有重定向参数，跳转到目标页面
    if (route.query.redirect) {
      const redirectPath = String(route.query.redirect)
      router.push(redirectPath)
    }
  } else {
    console.error('Registration failed:', result.error)
    // 设置新的错误信息
    authErrorMessage.value = result.error
  }
}

// 登出处理
const handleLogout = async () => {
  const result = await userStore.logout()
  if (result.success) {
    showSuccess('Successfully logged out')
    console.log('Logout successful')
  } else {
    console.error('Logout failed:', result.error)
  }
}

// 监听路由参数变化
watch(() => route.query, (newQuery) => {
  if (newQuery.showLogin === 'true' && !userStore.isLoggedIn) {
    // 显示登录提示
    showSuccess('Please login first to access this page')
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