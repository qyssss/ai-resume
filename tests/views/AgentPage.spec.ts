/*
AgentPage.spec.ts 测试内容与流程总结：

本文件主要针对 AI Agent 页面（简历优化/Mock Interview）的核心功能进行自动化测试，覆盖：
1. AI 问答流程：用户输入内容后，AI 返回优化建议，历史消息正确渲染。
2. 快捷操作按钮：点击如"Optimize Skills"按钮后，自动发送预设内容，AI 返回对应建议。

测试流程：
- 挂载组件时注入 Pinia，保证 store 可用。
- mock sendToQwenAIDialogue，分别返回不同的 AI 响应内容。
- 模拟用户输入、点击按钮等操作，断言页面正确渲染 AI 建议。
*/

import { mount, flushPromises } from '@vue/test-utils'
import AgentPage from '../../src/views/AgentPage.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import * as qwenApi from '../../src/api/qWen'

// mock axios，防止真实网络请求
vi.mock('axios')

// mock workerPool，防止 worker 报错
vi.mock('@/worker/workerPool', () => ({
    WorkerPool: class {
        execute() { }
    }
}))

// mock sendToQwenAIDialogue，默认返回"Optimized skills suggestion."
vi.mock('../../src/api/qWen', () => ({
    sendToQwenAIDialogue: (_messages, cb) => {
        cb('Optimized skills suggestion.', true)
        return Promise.resolve()
    }
}))


describe('AgentPage.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 工具函数：挂载组件并注入 Pinia
    function mountWithPinia() {
        const pinia = createPinia()
        setActivePinia(pinia)
        return mount(AgentPage, {
            global: {
                plugins: [pinia]
            }
        })
    }

    it('AI 问答流程：输入内容后AI返回建议', async () => {
        // 针对本用例，mock sendToQwenAIDialogue 返回不同内容
        vi.spyOn(qwenApi, 'sendToQwenAIDialogue').mockImplementation((_messages, cb) => {
            cb('AI optimized suggestion.', true)
            return Promise.resolve()
        })
        const wrapper = mountWithPinia()
        // 模拟用户输入内容
        const input = wrapper.find('input')
        await input.setValue('Please optimize my resume')
        // 点击"Send"按钮
        const sendBtn = wrapper.findAll('button').find(btn => btn.text().includes('Send'))
        expect(sendBtn).toBeTruthy()
        await sendBtn?.trigger('click')
        await flushPromises()
        // 断言页面出现 AI 返回的建议
        expect(wrapper.text()).toContain('AI optimized suggestion.')
    })

    it('快捷操作按钮：点击后输入框自动填充并AI响应', async () => {
        // 针对本用例，mock sendToQwenAIDialogue 返回不同内容
        vi.spyOn(qwenApi, 'sendToQwenAIDialogue').mockImplementation((_messages, cb) => {
            cb('Optimized skills suggestion.', true)
            return Promise.resolve()
        })
        const wrapper = mountWithPinia()
        // 点击"Optimize Skills"快捷按钮
        const btn = wrapper.findAll('button').find(btn => btn.text().includes('Optimize Skills'))
        expect(btn).toBeTruthy()
        await btn?.trigger('click')
        await flushPromises()
        // 断言页面出现 AI 返回的建议
        expect(wrapper.text()).toContain('Optimized skills suggestion.')
    })
}) 