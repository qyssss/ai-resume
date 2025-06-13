<template>
    <div v-if="isVisible" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>

        <!-- 模态框内容 -->
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-md">
                <!-- 关闭按钮 -->
                <button @click="closeModal"
                    class="absolute -top-4 -right-4 z-10 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition">
                    <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- 模态框主体 -->
                <div
                    class="bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                    <!-- 切换标签 -->
                    <div class="flex">
                        <button @click="activeTab = 'login'" :class="[
                            'flex-1 py-4 text-sm font-medium transition',
                            activeTab === 'login'
                                ? 'text-white bg-purple-600'
                                : 'text-gray-800 hover:text-white hover:bg-gray-700'
                        ]">
                            登录
                        </button>
                        <button @click="activeTab = 'register'" :class="[
                            'flex-1 py-4 text-sm font-medium transition',
                            activeTab === 'register'
                                ? 'text-white bg-purple-600'
                                : 'text-gray-800 hover:text-white hover:bg-gray-700'
                        ]">
                            注册
                        </button>
                    </div>

                    <!-- 登录表单 -->
                    <div v-if="activeTab === 'login'" class="p-8">
                        <div class="text-center mb-8">
                            <h2 class="text-2xl font-bold text-white mb-2">欢迎回来</h2>
                            <p class="text-gray-400">登录您的账户继续使用</p>
                        </div>

                        <!-- 错误提示 -->
                        <div v-if="errorMessage" class="mb-6 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
                            <p class="text-red-400 text-sm">{{ errorMessage }}</p>
                        </div>

                        <form @submit.prevent="handleLogin" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">邮箱地址</label>
                                <input v-model="loginForm.email" type="email" required
                                    class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="请输入邮箱地址" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">密码</label>
                                <div class="relative">
                                    <input v-model="loginForm.password" :type="showLoginPassword ? 'text' : 'password'"
                                        required
                                        class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-12"
                                        placeholder="请输入密码" />
                                    <button type="button" @click="showLoginPassword = !showLoginPassword"
                                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition">
                                        <svg v-if="showLoginPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                        <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div class="flex items-center justify-between">
                                <label class="flex items-center">
                                    <input type="checkbox" v-model="loginForm.remember"
                                        class="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2">
                                    <span class="ml-2 text-sm text-gray-300">记住我</span>
                                </label>
                                <!-- <a href="#" class="text-sm text-purple-400 hover:text-purple-300 transition">忘记密码？</a> -->
                            </div>

                            <button type="submit" :disabled="isLoading"
                                class="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                <span v-if="isLoading" class="flex items-center justify-center">
                                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    登录中...
                                </span>
                                <span v-else>登录</span>
                            </button>
                        </form>

                        <div class="mt-6 text-center">
                            <p class="text-gray-400 text-sm">
                                还没有账户？
                                <button @click="activeTab = 'register'"
                                    class="text-purple-400 hover:text-purple-300 transition">立即注册</button>
                            </p>
                        </div>
                    </div>

                    <!-- 注册表单 -->
                    <div v-if="activeTab === 'register'" class="p-8">
                        <div class="text-center mb-8">
                            <h2 class="text-2xl font-bold text-white mb-2">创建账户</h2>
                            <p class="text-gray-400">加入我们，开始您的AI简历之旅</p>
                        </div>

                        <!-- 错误提示 -->
                        <div v-if="errorMessage" class="mb-6 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
                            <p class="text-red-400 text-sm">{{ errorMessage }}</p>
                        </div>

                        <form @submit.prevent="handleRegister" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">用户名</label>
                                <input v-model="registerForm.username" type="text" required
                                    class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="请输入用户名" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">邮箱地址</label>
                                <input v-model="registerForm.email" type="email" required
                                    class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="请输入邮箱地址" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">密码</label>
                                <div class="relative">
                                    <input v-model="registerForm.password"
                                        :type="showRegisterPassword ? 'text' : 'password'" required
                                        class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-12"
                                        placeholder="请输入密码" />
                                    <button type="button" @click="showRegisterPassword = !showRegisterPassword"
                                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition">
                                        <svg v-if="showRegisterPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                        <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">确认密码</label>
                                <div class="relative">
                                    <input v-model="registerForm.confirmPassword"
                                        :type="showConfirmPassword ? 'text' : 'password'" required
                                        class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-12"
                                        placeholder="请再次输入密码" />
                                    <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition">
                                        <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                        <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div class="flex items-center">
                                <input type="checkbox" v-model="registerForm.agreeTerms" required
                                    class="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2">
                                <label class="ml-2 text-sm text-gray-300">
                                    我同意
                                    <a href="#" class="text-purple-400 hover:text-purple-300 transition">服务条款</a>
                                    和
                                    <a href="#" class="text-purple-400 hover:text-purple-300 transition">隐私政策</a>
                                </label>
                            </div>

                            <button type="submit" :disabled="isLoading || !isPasswordMatch"
                                class="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                <span v-if="isLoading" class="flex items-center justify-center">
                                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    注册中...
                                </span>
                                <span v-else>创建账户</span>
                            </button>
                        </form>

                        <div class="mt-6 text-center">
                            <p class="text-gray-400 text-sm">
                                已有账户？
                                <button @click="activeTab = 'login'"
                                    class="text-purple-400 hover:text-purple-300 transition">立即登录</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false
    },
    // 新增：外部错误信息
    externalErrorMessage: {
        type: String,
        default: ''
    }
})

// Emits
const emit = defineEmits(['close', 'login', 'register'])

// 响应式数据
const activeTab = ref('login')
const isLoading = ref(false)
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')

// 监听外部错误信息
watch(() => props.externalErrorMessage, (newError) => {
    if (newError) {
        errorMessage.value = newError
    }
})

// 表单数据
const loginForm = ref({
    email: '',
    password: '',
    remember: false
})

const registerForm = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
})

// 计算属性
const isPasswordMatch = computed(() => {
    return registerForm.value.password === registerForm.value.confirmPassword
})

// 方法
const closeModal = () => {
    emit('close')
    // 重置表单和错误信息
    loginForm.value = {
        email: '',
        password: '',
        remember: false
    }
    registerForm.value = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    }
    activeTab.value = 'login'
    errorMessage.value = ''
}

const showError = (message) => {
    errorMessage.value = message
    // 3秒后自动清除错误信息
    setTimeout(() => {
        errorMessage.value = ''
    }, 3000)
}

const handleLogin = async () => {
    if (!loginForm.value.email || !loginForm.value.password) {
        showError('请填写邮箱和密码')
        return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
        // 触发登录事件
        emit('login', {
            email: loginForm.value.email,
            password: loginForm.value.password,
            remember: loginForm.value.remember
        })

        // 注意：实际的登录结果处理在父组件中，这里只是触发事件
        // 如果登录失败，父组件会通过externalErrorMessage传递错误信息
    } catch (error) {
        console.error('登录失败:', error)
        showError('登录失败，请重试')
    } finally {
        isLoading.value = false
    }
}

const handleRegister = async () => {
    if (!registerForm.value.username || !registerForm.value.email || !registerForm.value.password || !registerForm.value.confirmPassword) {
        showError('请填写所有必填字段')
        return
    }

    if (!isPasswordMatch.value) {
        showError('两次输入的密码不一致')
        return
    }

    if (!registerForm.value.agreeTerms) {
        showError('请同意服务条款和隐私政策')
        return
    }

    if (registerForm.value.password.length < 6) {
        showError('密码长度至少6位')
        return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
        // 触发注册事件
        emit('register', {
            username: registerForm.value.username,
            email: registerForm.value.email,
            password: registerForm.value.password
        })

        // 注意：实际的注册结果处理在父组件中，这里只是触发事件
        // 如果注册失败，父组件会通过externalErrorMessage传递错误信息
    } catch (error) {
        console.error('注册失败:', error)
        showError('注册失败，请重试')
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>