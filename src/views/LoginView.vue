<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div class="max-w-md w-full">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold mb-2">登录</h1>
                <p class="text-gray-400">请登录后继续访问</p>
            </div>

            <div class="bg-gray-800 p-8 rounded-lg shadow-lg">
                <p class="text-center text-gray-300 mb-6">
                    您需要登录后才能访问该页面
                </p>

                <div class="space-y-4">
                    <button @click="goToHome"
                        class="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition">
                        返回首页
                    </button>

                    <button @click="goToHomeAndLogin"
                        class="w-full py-3 px-4 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition">
                        去首页登录
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
    router.push('/')
}

const goToHomeAndLogin = () => {
    router.push({
        path: '/',
        query: { showLogin: 'true' }
    })
}
</script>