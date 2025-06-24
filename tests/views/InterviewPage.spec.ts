// 面试页面测试
import { mount, flushPromises } from '@vue/test-utils'
import InterviewPage from '../../src/views/InterviewPage.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

const mockedAxios = vi.mocked(axios, true)

const mockPdfFile = () => new File(['dummy'], 'resume.pdf', { type: 'application/pdf' })
const mockJpgFile = () => new File(['dummy'], 'resume.jpg', { type: 'image/jpeg' })

describe('InterviewPage.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('上传支持的PDF文件成功', async () => {
        // mock 后端解析 PDF 返回内容
        vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: { message: 'mock resume content' } })
        const wrapper = mount(InterviewPage)
        const file = mockPdfFile()
        const input = wrapper.find('input[type="file"]')
        // 直接设置 input 的 files 属性
        Object.defineProperty(input.element, 'files', {
            value: [file],
            writable: false
        })
        await input.trigger('change')
        // 断言页面出现"File uploaded successfully"或文件名
        await flushPromises()
        expect(wrapper.text()).toContain('File uploaded successfully')
    })

    it('上传不支持的文件类型提示错误', async () => {
        const wrapper = mount(InterviewPage)
        const file = mockJpgFile()
        const input = wrapper.find('input[type="file"]')
        Object.defineProperty(input.element, 'files', {
            value: [file],
            writable: false
        })
        await input.trigger('change')
        await flushPromises()
        // 断言页面出现 PDF 格式错误提示
        expect(wrapper.text()).toMatch(/Only PDF format is supported|PDF/) // 具体提示可根据实现微调
    })

    it('AI 问答流程', async () => {
        // mock PDF上传
        vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: { message: 'mock resume content' } })
        // mock AI 问题
        vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: { message: 'First AI question?' } })
        vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: { message: 'Second AI question?' } })
        const wrapper = mount(InterviewPage)
        // 推荐：直接模拟上传 PDF 文件
        const file = mockPdfFile()
        const input = wrapper.find('input[type="file"]')
        Object.defineProperty(input.element, 'files', {
            value: [file],
            writable: false
        })
        await input.trigger('change')
        await flushPromises()
        // 点击"Start Mock Interview"
        const startBtn = wrapper.find('button')
        await startBtn.trigger('click')
        await flushPromises()
        // 断言欢迎语出现
        expect(wrapper.text()).toContain("Hello! Thank you for participating in this mock interview")
        // 用户输入答案
        const textarea = wrapper.find('textarea')
        await textarea.setValue('My answer')
        const sendBtn = wrapper.findAll('button').find(btn => btn.text().includes('Send'))
        expect(sendBtn).toBeTruthy()
        await sendBtn?.trigger('click')
        await flushPromises()
        // 断言AI问题出现
        expect(wrapper.text()).toContain('First AI question?')
    })
}) 