// 简历表单测试（测试功能按钮）
import { mount, flushPromises } from '@vue/test-utils'
import ResumeForm from '../../src/views/ResumeForm.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ElMessage } from 'element-plus'
import { createPinia } from 'pinia'
import * as ElementPlus from 'element-plus'

// mock ElMessage 和 ElMessageBox
vi.mock('element-plus', () => {
    const successMock = vi.fn()
    const errorMock = vi.fn()
    const warningMock = vi.fn()
    return {
        ElMessage: {
            success: successMock,
            error: errorMock,
            warning: warningMock
        },
        ElMessageBox: {
            confirm: vi.fn().mockResolvedValue(true) // 模拟 confirm 总是点"确定"
        }
    }
})

// mock resumeApi
vi.mock('@/services/resume', () => {
    // 在工厂函数内部定义 mock
    const saveResumeMock = vi.fn().mockResolvedValue({})
    const getResumeMock = vi.fn().mockResolvedValue({
        personal: { name: 'Test', email: 'test@test.com', gender: '', age: '', degree: '', phone: '', photo: '' },
        skills: { proficient: [], familiar: [] },
        education: [],
        experiences: [],
        honors: [],
        selfEvaluation: ''
    })
    const deleteResumeMock = vi.fn().mockResolvedValue({})

    // 返回 mock 对象
    return {
        resumeApi: {
            saveResume: saveResumeMock,
            getResume: getResumeMock,
            deleteResume: deleteResumeMock
        }
    }
})

// 在测试用例中通过 import 获取 mock
import { resumeApi } from '../../src/services/resume'

describe('ResumeForm.vue methods', () => {
    let wrapper: any
    let pinia

    beforeEach(() => {
        vi.clearAllMocks()
        pinia = createPinia()
        // 挂载组件时注入 Pinia
        wrapper = mount(ResumeForm, {
            global: {
                plugins: [pinia]
            }
        })
        // 设置为"已登录"状态
        wrapper.vm.userStore.authToken = 'mock-token'
    })

    it('should save resume and show success message', async () => {
        // 测试保存简历功能
        wrapper.vm.resume.personal.name = 'Test'
        wrapper.vm.resume.personal.email = 'test@test.com'
        await wrapper.vm.saveResume()
        expect(resumeApi.saveResume).toHaveBeenCalled()
        expect(ElMessage.success).toHaveBeenCalledWith('Resume saved successfully!')
    })

    it('should load resume and update state', async () => {
        // 测试加载简历功能
        await wrapper.vm.loadResume()
        expect(resumeApi.getResume).toHaveBeenCalled()
        expect(wrapper.vm.resume.personal.name).toBe('Test')
        expect(ElMessage.success).toHaveBeenCalledWith('Resume loaded successfully!')
    })

    it('should clear resume and show success message', async () => {
        // 测试清空简历功能
        await wrapper.vm.clearResume()
        expect(resumeApi.deleteResume).toHaveBeenCalled()
        expect(ElMessage.success).toHaveBeenCalledWith('Your form has been cleared.')
    })

    it('should warn if not logged in when saving', async () => {
        // 测试未登录时保存简历的提示
        wrapper.vm.userStore.authToken = ''
        await wrapper.vm.saveResume()
        expect(ElMessage.warning).toHaveBeenCalled()
    })
})
