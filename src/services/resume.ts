import { http } from '@/utils/http'

export interface ResumeData {
    personal: {
        name: string
        gender: string
        age: string
        degree: string
        phone: string
        email: string
        photo: string
    }
    skills: {
        proficient: string[]
        familiar: string[]
    }
    education: Array<{
        school: string
        major: string
        degree: string
        score: string
    }>
    experiences: Array<{
        type: string
        name: string
        company: string
        period: string
        content: string
        result: string
    }>
    honors: Array<{
        type: string
        title: string
        date: string
        description: string
    }>
    selfEvaluation: string
}

export const resumeApi = {
    // 保存简历信息
    async saveResume(resumeData: ResumeData) {
        try {
            const response: any = await http.post('/api/resume/save', {
                personal: resumeData.personal,
                skills: resumeData.skills,
                education: resumeData.education,
                experiences: resumeData.experiences,
                honors: resumeData.honors,
                selfEvaluation: resumeData.selfEvaluation
            })
            return response.data
        } catch (error) {
            console.error('保存简历失败:', error)
            throw error
        }
    },

    // 获取用户简历信息
    async getResume() {
        try {
            const response: any = await http.get('/api/resume/get')
            return response.data
        } catch (error) {
            console.error('获取简历失败:', error)
            throw error
        }
    },

    // 更新简历信息
    async updateResume(resumeData: ResumeData) {
        try {
            const response: any = await http.put('/api/resume/update', {
                personal: resumeData.personal,
                skills: resumeData.skills,
                education: resumeData.education,
                experiences: resumeData.experiences,
                honors: resumeData.honors,
                selfEvaluation: resumeData.selfEvaluation
            })
            return response.data
        } catch (error) {
            console.error('更新简历失败:', error)
            throw error
        }
    },

    // 删除简历信息
    async deleteResume() {
        try {
            const response: any = await http.delete('/api/resume/delete')
            return response.data
        } catch (error) {
            console.error('删除简历失败:', error)
            throw error
        }
    },

    // AI优化简历（新：异步任务模式）
    async optimizeResumeStart() {
        try {
            const response: any = await http.post('/api/resume/optimize/')
            return response
        } catch (error) {
            console.error('AI优化简历任务创建失败:', error)
            throw error
        }
    },

    async optimizeResumePoll(taskId: number) {
        try {
            const response: any = await http.get(`/api/resume/optimize/${taskId}/`)
            return response.data // 应返回 { status: ..., result: ... }
        } catch (error) {
            console.error('AI优化简历任务轮询失败:', error)
            throw error
        }
    }
}