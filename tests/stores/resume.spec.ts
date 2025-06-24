// 简历表单测试
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useResumeStore } from '../../src/stores/resume'
import { getInitialState } from '../../src/stores/resume'

describe('resumeStore', () => {
    let resume: ReturnType<typeof useResumeStore>

    // 每个测试前都重置 Pinia 和 resumeStore，保证测试互不影响
    beforeEach(() => {
        setActivePinia(createPinia())
        resume = useResumeStore()
        // 保证每次测试都是初始状态
        resume.resetResumeToInitial()
    })

    it('should initialize with default values', () => {
        // 检查初始化时各字段与 initial state 一致
        const initial = getInitialState();
        expect(resume.personal.name).toBe(initial.personal.name)
        expect(resume.education.length).toBe(initial.education.length)
        expect(resume.experiences.length).toBe(initial.experiences.length)
        expect(resume.honors.length).toBe(initial.honors.length)
    })

    it('should add and remove education', () => {
        // 测试添加和删除教育经历
        const initial = getInitialState();
        resume.addEducation()
        expect(resume.education.length).toBe(initial.education.length + 1)
        resume.removeEducation(0)
        expect(resume.education.length).toBe(initial.education.length)
    })

    it('should clear resume data to empty', () => {
        // 测试清空简历数据
        resume.clearResumeData()
        expect(resume.personal.name).toBe('')
        expect(resume.education.length).toBe(0)
        expect(resume.experiences.length).toBe(0)
        expect(resume.honors.length).toBe(0)
    })

    it('should reset resume to initial values', () => {
        // 测试重置为初始模版
        resume.clearResumeData()
        expect(resume.education.length).toBe(0)
        resume.resetResumeToInitial()
        // 动态获取 initial state 的 education 数量
        const initial = getInitialState();
        expect(resume.education.length).toBe(initial.education.length)
        expect(resume.personal.name).toBe(initial.personal.name)
    })

    it('should update personal info', () => {
        // 测试个人信息的修改
        resume.personal.name = 'Alice'
        resume.personal.email = 'alice@example.com'
        expect(resume.personal.name).toBe('Alice')
        expect(resume.personal.email).toBe('alice@example.com')
    })
})
