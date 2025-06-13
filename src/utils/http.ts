import { useUserStore } from '@/stores/user'

// API基础配置
const API_BASE_URL = 'http://127.0.0.1:8000'

// 请求拦截器
function createRequestInterceptor() {
    return (url: string, options: RequestInit = {}) => {
        const userStore = useUserStore()
        const token = userStore.getAuthToken()

        // 添加认证头
        if (token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            }
        }

        return { url, options }
    }
}

// 响应拦截器
function createResponseInterceptor() {
    return async (response: Response) => {
        if (response.status === 401) {
            // Token过期或无效，清除用户状态
            const userStore = useUserStore()
            await userStore.logout()
            throw new Error('认证失败，请重新登录')
        }

        return response
    }
}

// HTTP客户端
export class HttpClient {
    private baseURL: string
    private requestInterceptor: (url: string, options: RequestInit) => { url: string; options: RequestInit }
    private responseInterceptor: (response: Response) => Promise<Response>

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL
        this.requestInterceptor = createRequestInterceptor()
        this.responseInterceptor = createResponseInterceptor()
    }

    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseURL}${endpoint}`

        // 应用请求拦截器
        const { url: finalUrl, options: finalOptions } = this.requestInterceptor(url, options)

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...finalOptions.headers,
            },
            ...finalOptions,
        }

        try {
            const response = await fetch(finalUrl, defaultOptions)

            // 应用响应拦截器
            const processedResponse = await this.responseInterceptor(response)

            if (!processedResponse.ok) {
                const errorData = await processedResponse.json().catch(() => ({ error: '请求失败' }))
                throw new Error(errorData.error || `HTTP error! status: ${processedResponse.status}`)
            }

            return await processedResponse.json()
        } catch (error) {
            console.error('API请求失败:', error)
            throw error
        }
    }

    async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' })
    }

    async post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        })
    }

    async put<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        })
    }

    async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' })
    }

    async patch<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        })
    }
}

// 创建默认HTTP客户端实例
export const httpClient = new HttpClient()

// 导出便捷方法
export const http = {
    get: <T>(endpoint: string, options?: RequestInit) => httpClient.get<T>(endpoint, options),
    post: <T>(endpoint: string, data?: any, options?: RequestInit) => httpClient.post<T>(endpoint, data, options),
    put: <T>(endpoint: string, data?: any, options?: RequestInit) => httpClient.put<T>(endpoint, data, options),
    delete: <T>(endpoint: string, options?: RequestInit) => httpClient.delete<T>(endpoint, options),
    patch: <T>(endpoint: string, data?: any, options?: RequestInit) => httpClient.patch<T>(endpoint, data, options),
} 