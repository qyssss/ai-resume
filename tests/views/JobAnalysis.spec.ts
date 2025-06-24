import { mount, flushPromises } from '@vue/test-utils'
import JobAnalysis from '../../src/components/JobAnalysis.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ElMessage } from 'element-plus'
import ElementPlus from 'element-plus'

// mock jobApi
vi.mock('../../src/services/jobApi', () => ({
    jobApi: {
        analyzeJobFit: vi.fn()
    }
}))
import { jobApi } from '../../src/services/jobApi'
const mockedJobApi = vi.mocked(jobApi, true)

// mock ElMessage
vi.spyOn(ElMessage, 'warning')
vi.spyOn(ElMessage, 'error')

function createWrapper() {
    return mount(JobAnalysis, {
        global: {
            plugins: [ElementPlus]
        }
    })
}

describe('JobAnalysis.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('表单校验：未输入岗位描述时点击分析弹警告', async () => {
        const wrapper = createWrapper()
        console.log(wrapper.html()) // 调试用
        const btn = wrapper.find('.el-button')
        expect(btn.exists()).toBe(true) // 先断言找到
        await btn.trigger('click')
        expect(ElMessage.warning).toHaveBeenCalled()
    })

    it('正常分析流程：渲染分析结果', async () => {
        const mockResult = {
            strengths: ['Good communication', 'Teamwork'],
            gaps: ['Lack of Python experience'],
            summary: 'You are a good fit, but need Python skills.',
            matchScore: 80
        }
        mockedJobApi.analyzeJobFit.mockResolvedValueOnce(mockResult)
        const wrapper = createWrapper()
        await wrapper.find('.el-textarea__inner').setValue('JD content here')
        const btn = wrapper.find('.el-button')
        await btn.trigger('click')
        await flushPromises()
        expect(wrapper.text()).toContain('Good communication')
        expect(wrapper.text()).toContain('Teamwork')
        expect(wrapper.text()).toContain('Lack of Python experience')
        expect(wrapper.text()).toContain('You are a good fit, but need Python skills.')
        expect(wrapper.text()).toContain('80') // 匹配分数
    })

    it('加载状态：分析时按钮禁用，分析后恢复', async () => {
        let resolvePromise: (value: import('../../src/services/jobApi').AnalysisReport) => void = () => { }
        const promise = new Promise<import('../../src/services/jobApi').AnalysisReport>(res => { resolvePromise = res })
        mockedJobApi.analyzeJobFit.mockReturnValueOnce(promise)
        const wrapper = createWrapper()
        await wrapper.find('.el-textarea__inner').setValue('JD content here')
        const btn = wrapper.find('.el-button')
        await btn.trigger('click')
        // 按钮应为 loading 状态
        expect(btn.attributes('disabled')).toBeDefined()
        // 结束 loading
        resolvePromise({ strengths: [], gaps: [], summary: '', matchScore: 0 })
        await flushPromises()
        expect(btn.attributes('disabled')).toBeUndefined()
    })

    it('异常处理：分析接口报错弹出错误提示', async () => {
        mockedJobApi.analyzeJobFit.mockRejectedValueOnce(new Error('API error'))
        const wrapper = createWrapper()
        await wrapper.find('.el-textarea__inner').setValue('JD content here')
        const btn = wrapper.find('.el-button')
        await btn.trigger('click')
        await flushPromises()
        expect(ElMessage.error).toHaveBeenCalled()
    })
}) 