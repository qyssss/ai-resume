<template>
    <div class="w-full min-h-screen">
        <!-- 顶部导航栏 -->
        <nav class="w-full bg-gray-800 text-white shadow fixed top-0 left-0 z-50">
            <!-- 只让导航栏内容居中，不影响主内容区 -->
            <div class="max-w-7xl mx-auto flex items-center justify-center h-16 px-6">
                <div class="flex space-x-8">
                    <router-link v-for="item in navs" :key="item.path" :to="item.path"
                        class="hover:text-green-400 px-3 py-2 rounded text-lg font-medium"
                        :class="{ 'text-green-400 font-bold': $route.path === item.path }">
                        {{ item.label }}
                    </router-link>
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
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const $route = useRoute()
const navs = [
    { label: 'Home', path: '/' },
    { label: 'Resume', path: '/resume' },
    { label: 'AI Agent', path: '/ai-agent' },
    { label: 'Interview', path: '/interview' }
]
</script>