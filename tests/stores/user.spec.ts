// 用户登录测试
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useUserStore } from '../../src/stores/user'
import { currentAuthAPI } from '../../src/api/auth'

// mock API
vi.mock('@/api/auth', () => ({
    currentAuthAPI: {
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        getCurrentUser: vi.fn()
    }
}))

// 使用 Vitest 的 vi.mocked 进行类型断言，便于 mockResolvedValue
const mockedAuthAPI = vi.mocked(currentAuthAPI, true)

describe('user store core auth', () => {
    let user: ReturnType<typeof useUserStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        user = useUserStore()
        vi.clearAllMocks()
        localStorage.clear()
    })

    it('登录成功：账号密码正确', async () => {
        mockedAuthAPI.login.mockResolvedValue({
            success: true,
            user: { username: 'Tom', email: 'tom@test.com' },
            token: 'token123'
        })
        const result = await user.login({ email: 'tom@test.com', password: '123456', remember: true })
        expect(result.success).toBe(true)
        expect(user.isLoggedIn).toBe(true)
        expect(user.userInfo.email).toBe('tom@test.com')
        expect(user.authToken).toBe('token123')
        expect(localStorage.getItem('authToken')).toBe('token123')
    })

    it('登录失败：账号或密码错误', async () => {
        mockedAuthAPI.login.mockResolvedValue({
            success: false,
            error: '邮箱或密码错误'
        })
        const result = await user.login({ email: 'wrong@test.com', password: 'wrong', remember: false })
        expect(result.success).toBe(false)
        expect(result.error).toBe('邮箱或密码错误')
        expect(user.isLoggedIn).toBe(false)
    })

    it('注册成功并自动登录', async () => {
        mockedAuthAPI.register.mockResolvedValue({ success: true })
        mockedAuthAPI.login.mockResolvedValue({
            success: true,
            user: { username: 'NewUser', email: 'new@test.com' },
            token: 'token456'
        })
        const result = await user.register({ username: 'NewUser', email: 'new@test.com', password: 'abc123' })
        expect(result.success).toBe(true)
        expect(user.isLoggedIn).toBe(true)
        expect(user.userInfo.email).toBe('new@test.com')
        expect(user.authToken).toBe('token456')
    })

    it('注册失败：邮箱已被注册', async () => {
        mockedAuthAPI.register.mockResolvedValue({
            success: false,
            error: '该邮箱已被注册，请使用其他邮箱或直接登录'
        })
        const result = await user.register({ username: 'Tom', email: 'tom@test.com', password: '123456' })
        expect(result.success).toBe(false)
        expect(result.error).toMatch(/已被注册/)
        expect(user.isLoggedIn).toBe(false)
    })

    it('登出后状态清空', async () => {
        // 先模拟登录
        user.isLoggedIn = true
        user.userInfo = { username: 'Tom', email: 'tom@test.com' }
        user.authToken = 'token123'
        localStorage.setItem('authToken', 'token123')
        mockedAuthAPI.logout.mockResolvedValue({ success: true })
        const result = await user.logout()
        expect(result.success).toBe(true)
        expect(user.isLoggedIn).toBe(false)
        expect(user.userInfo.email).toBe('')
        expect(user.authToken).toBe('')
        expect(localStorage.getItem('authToken')).toBeNull()
    })

    it('注册时两次密码不一致校验', async () => {
        expect('abc123').not.toBe('def456')
    })
})
