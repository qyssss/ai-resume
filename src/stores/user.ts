import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { currentAuthAPI } from '@/api/auth'

export interface UserInfo {
    username: string
    email: string
    id?: string
    avatar?: string
}

export interface LoginData {
    email: string
    password: string
    remember: boolean
}

export interface RegisterData {
    username: string
    email: string
    password: string
}

export const useUserStore = defineStore('user', () => {
    // 状态
    const isLoggedIn = ref(false)
    const userInfo = ref<UserInfo>({
        username: '',
        email: ''
    })
    const isLoading = ref(false)
    const authToken = ref<string>('')

    // 计算属性
    const userInitial = computed(() => {
        return userInfo.value.username?.charAt(0) || 'U'
    })

    const isAuthenticated = computed(() => {
        return isLoggedIn.value && userInfo.value.email && authToken.value
    })

    // 方法
    const login = async (loginData: LoginData) => {
        isLoading.value = true

        try {
            const result = await currentAuthAPI.login(loginData)

            if (result.success && result.user && result.token) {
                isLoggedIn.value = true
                userInfo.value = result.user
                authToken.value = result.token

                // 保存到localStorage
                if (loginData.remember) {
                    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
                    localStorage.setItem('authToken', authToken.value)
                    localStorage.setItem('isLoggedIn', 'true')
                }

                return { success: true }
            } else {
                // 返回具体的错误信息
                return { success: false, error: result.error || 'Login failed, please check your email and password' }
            }
        } catch (error) {
            console.error('登录失败:', error)
            // 根据错误类型返回具体的错误信息
            let errorMessage = 'Login failed, please try again'
            if (error instanceof Error) {
                if (error.message.includes('Invalid credentials')) {
                    errorMessage = 'Incorrect email or password'
                } else if (error.message.includes('Email and password required')) {
                    errorMessage = 'Please enter your email and password'
                } else if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Network connection failed, please check your network settings'
                } else {
                    errorMessage = error.message
                }
            }
            return { success: false, error: errorMessage }
        } finally {
            isLoading.value = false
        }
    }

    const register = async (registerData: RegisterData) => {
        isLoading.value = true

        try {
            const result = await currentAuthAPI.register(registerData)

            if (result.success) {
                // 注册成功后自动登录
                const loginResult = await login({
                    email: registerData.email,
                    password: registerData.password,
                    remember: true
                })

                return loginResult
            } else {
                // 返回具体的错误信息
                return { success: false, error: result.error || 'Registration failed, please try again' }
            }
        } catch (error) {
            console.error('注册失败:', error)
            // 根据错误类型返回具体的错误信息
            let errorMessage = 'Registration failed, please try again'
            if (error instanceof Error) {
                if (error.message.includes('Email already exists')) {
                    errorMessage = 'This email has already been registered, please use another email or log in directly'
                } else if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Network connection failed, please check your network settings'
                } else {
                    errorMessage = error.message
                }
            }
            return { success: false, error: errorMessage }
        } finally {
            isLoading.value = false
        }
    }

    const logout = async () => {
        try {
            await currentAuthAPI.logout()

            isLoggedIn.value = false
            userInfo.value = {
                username: '',
                email: ''
            }
            authToken.value = ''

            // 清除 localStorage
            localStorage.removeItem('authToken')
            localStorage.removeItem('userInfo')
            localStorage.removeItem('isLoggedIn')

            return { success: true }
        } catch (error) {
            console.error('登出失败:', error)
            return { success: false, error: error instanceof Error ? error.message : 'Logout failed' }
        }
    }

    const checkLoginStatus = async () => {
        try {
            const result = await currentAuthAPI.getCurrentUser()

            if (result.success && result.user) {
                isLoggedIn.value = true
                userInfo.value = result.user

                // 从localStorage获取token
                const savedToken = localStorage.getItem('authToken')
                if (savedToken) {
                    authToken.value = savedToken
                }
            } else {
                // 清除无效的登录状态
                logout()
            }
        } catch (error) {
            console.error('检查登录状态失败:', error)
            logout()
        }
    }

    const updateUserInfo = (newUserInfo: Partial<UserInfo>) => {
        userInfo.value = { ...userInfo.value, ...newUserInfo }

        // 更新localStorage
        if (isLoggedIn.value) {
            localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        }
    }

    const getAuthToken = () => {
        return authToken.value
    }

    const setAuthToken = (token: string) => {
        authToken.value = token
        localStorage.setItem('authToken', token)
    }

    return {
        // 状态
        isLoggedIn,
        userInfo,
        isLoading,
        authToken,

        // 计算属性
        userInitial,
        isAuthenticated,

        // 方法
        login,
        register,
        logout,
        checkLoginStatus,
        updateUserInfo,
        getAuthToken,
        setAuthToken
    }
}) 