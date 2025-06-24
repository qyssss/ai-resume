import type { LoginData, RegisterData, UserInfo } from '@/stores/user'
import { http } from '@/utils/http'

// 认证相关API
export const authAPI = {
    // 用户注册
    async register(registerData: RegisterData): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await http.post<{ message: string }>('/users/register/', {
                email: registerData.email,
                password: registerData.password,
                username: registerData.username
            })

            return {
                success: true,
                message: response.message,
            }
        } catch (error) {
            // 解析具体的错误信息
            let errorMessage = 'Registration failed'
            if (error instanceof Error) {
                // 尝试从错误信息中提取具体的错误
                if (error.message.includes('Email already exists')) {
                    errorMessage = 'This email has already been registered, please use another email or log in directly'
                } else if (error.message.includes('400')) {
                    errorMessage = 'Request parameter error, please check your input information'
                } else if (error.message.includes('500')) {
                    errorMessage = 'Internal server error, please try again later'
                } else if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Network connection failed, please check your network settings'
                } else {
                    errorMessage = error.message
                }
            }

            return {
                success: false,
                error: errorMessage,
            }
        }
    },

    // 用户登录
    async login(loginData: LoginData): Promise<{ success: boolean; user?: UserInfo; token?: string; error?: string }> {
        try {
            const response = await http.post<{ token: string; user_id: string; username: string }>('/users/login/', {
                email: loginData.email,
                password: loginData.password
            })

            // 构造用户信息
            const user: UserInfo = {
                username: response.username,
                email: loginData.email,
                id: response.user_id,
            }

            return {
                success: true,
                user,
                token: response.token,
            }
        } catch (error) {
            // 解析具体的错误信息
            let errorMessage = 'Login failed'
            if (error instanceof Error) {
                // 尝试从错误信息中提取具体的错误
                if (error.message.includes('Invalid credentials')) {
                    errorMessage = 'Incorrect email or password'
                } else if (error.message.includes('Email and password required')) {
                    errorMessage = 'Please enter your email and password'
                } else if (error.message.includes('401')) {
                    errorMessage = 'Authentication failed, please check your email and password'
                } else if (error.message.includes('400')) {
                    errorMessage = 'Request parameter error, please check your input information'
                } else if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Network connection failed, please check your network settings'
                } else {
                    errorMessage = error.message
                }
            }

            return {
                success: false,
                error: errorMessage,
            }
        }
    },

    // 登出（前端本地处理）
    async logout(): Promise<{ success: boolean; error?: string }> {
        try {
            // 清除本地存储的token和用户信息
            localStorage.removeItem('authToken')
            localStorage.removeItem('userInfo')
            localStorage.removeItem('isLoggedIn')

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Logout failed',
            }
        }
    },

    // 获取当前用户信息（从本地存储）
    async getCurrentUser(): Promise<{ success: boolean; user?: UserInfo; error?: string }> {
        try {
            const savedUserInfo = localStorage.getItem('userInfo')
            const savedToken = localStorage.getItem('authToken')

            if (savedUserInfo && savedToken) {
                try {
                    const user = JSON.parse(savedUserInfo)
                    return {
                        success: true,
                        user,
                    }
                } catch (error) {
                    return {
                        success: false,
                        error: 'Failed to parse user information',
                    }
                }
            }

            return {
                success: false,
                error: 'User not logged in',
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get user information',
            }
        }
    },
}

// 导出当前使用的API
export const currentAuthAPI = authAPI 