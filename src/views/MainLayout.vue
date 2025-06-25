<template>
    <div class="w-full min-h-screen">
        <!-- 顶部导航栏 -->
        <nav class="w-full bg-gray-800 text-white shadow fixed top-0 left-0 z-50">
            <!-- 只让导航栏内容居中，不影响主内容区 -->
            <div class="max-w-7xl mx-auto flex items-center justify-center h-16 px-6">
                <div class="flex space-x-8">
                    <a v-for="item in navs" :key="item.path" href="javascript:void(0)"
                        class="hover:text-green-400 px-3 py-2 rounded text-lg font-medium"
                        :class="{ 'text-green-400 font-bold': $route.path === item.path }"
                        @click="handleNavClick(item)">
                        {{ item.label }}
                    </a>
                </div>
            </div>
        </nav>
        <!-- 主内容区 -->
        <main class="pt-20 pb-10 min-h-screen">
            <!-- 这里不要加 max-w-7xl mx-auto -->
            <div class="w-full px-8">
                <router-view />
            </div>
        </main>
        <!-- 登录注册模态框 -->
        <AuthModal :is-visible="showAuthModal" :external-error-message="authErrorMessage" @close="closeAuthModal"
            @login="handleLogin" @register="handleRegister" />
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import AuthModal from '@/components/AuthModal.vue'

const $route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const showAuthModal = ref(false)
const authErrorMessage = ref('')

const navs = [
    { label: 'Home', path: '/' },
    { label: 'Resume', path: '/resume' },
    { label: 'AI Agent', path: '/ai-agent' },
    { label: 'Interview', path: '/interview' },
    { label: 'Job Center', path: '/jobs' }
]

function openAuthModal() {
    authErrorMessage.value = ''
    showAuthModal.value = true
}

function closeAuthModal() {
    showAuthModal.value = false
    authErrorMessage.value = ''
    // 检查是否有重定向参数，登录成功后跳转
    const redirectPath = $route.query.redirect ? String($route.query.redirect) : ''
    if (redirectPath) {
        router.push({ path: redirectPath, replace: true })
    }
}

async function handleLogin(loginData: any) {
    authErrorMessage.value = ''
    const result = await userStore.login(loginData)
    if (result.success) {
        showAuthModal.value = false
        // 登录成功后，如果有重定向参数，跳转到目标页面
        const redirectPath = $route.query.redirect ? String($route.query.redirect) : ''
        if (redirectPath) {
            router.push({ path: redirectPath, replace: true })
        }
    } else {
        authErrorMessage.value = result.error || ''
    }
}

async function handleRegister(registerData: any) {
    authErrorMessage.value = ''
    const result = await userStore.register(registerData)
    if (result.success) {
        showAuthModal.value = false
        // 注册成功后，如果有重定向参数，跳转到目标页面
        const redirectPath = $route.query.redirect ? String($route.query.redirect) : ''
        if (redirectPath) {
            router.push({ path: redirectPath, replace: true })
        }
    } else {
        authErrorMessage.value = result.error || ''
    }
}

function handleNavClick(item: { label: string, path: string }) {
    // 需要登录的页面
    const needLogin = ['/resume', '/ai-agent', '/interview', '/jobs']
    if (needLogin.includes(item.path) && !userStore.isLoggedIn) {
        openAuthModal()
        router.push({ path: '/', query: { redirect: item.path } })
        return
    }
    router.push(item.path)
}
</script>