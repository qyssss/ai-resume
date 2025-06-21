// src/services/jobApi.ts   
import { http } from '@/utils/http';

/**
 * @file 包含所有求职相关功能的API请求
 */

// 定义"岗位推荐"接口返回的单个岗位数据结构
export interface JobRecommendation {
    id: number;
    title: string;
    company: string;
    location: string;
    salary: string;
    matchScore: number;
    tags: string[];
    reason: string;
    description: string;
}

// 定义"JD分析"接口返回的报告数据结构
export interface AnalysisReport {
    matchScore: number;
    summary: string;
    strengths: string[];
    gaps: string[];
}


export const jobApi = {
    /**
     * 获取AI岗位推荐
     * @description GET请求后端的 /api/jobs/recommend 路由
     * @returns Promise<JobRecommendation[]> - 返回岗位推荐列表
     */
    getJobRecommendations: (): Promise<JobRecommendation[]> => {
        return http.get('/api/jobs/recommend');
    },

    /**
     * 分析JD与简历的匹配度
     * @param jobDescription - 用户粘贴的职位描述文本
     * @description POST请求到后端的 /api/jobs/analyze，并附带JD文本
     * @returns Promise<AnalysisReport> - 返回分析报告
     */
    analyzeJobFit: (jobDescription: string): Promise<AnalysisReport> => {
        return http.post('/api/jobs/analyze', { jobDescription });
    }
}; 