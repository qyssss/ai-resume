<template>
    <div class="job-analysis-container">
        <el-input v-model="jobDescription" type="textarea" :rows="10"
            placeholder="Paste the full job description here to analyze it against your saved resume." class="mb-4 "
            style=" font-size: 18px;" />
        <el-button type="primary" size="large" @click="analyzeJob" :loading="loading" class="w-full text-lg">
            Analyze Job Fit
        </el-button>

        <div v-if="analysisResult" class="mt-8 result-container ">
            <el-card class="mb-6">
                <div class="text-2xl font-bold mb-4 text-blue-700">Analysis Report</div>
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="flex-1">
                        <div class="font-semibold text-purple-500 mb-2">Strengths (Resume Highlights)</div>
                        <ul class="list-disc pl-5">
                            <li v-for="strength in analysisResult.strengths" :key="strength">{{ strength }}</li>
                        </ul>
                    </div>
                    <div class="flex-1">
                        <div class="font-semibold text-purple-500 mb-2">Areas for Improvement</div>
                        <ul class="list-disc pl-5">
                            <li v-for="gap in analysisResult.gaps" :key="gap">{{ gap }}</li>
                        </ul>
                    </div>
                </div>
                <div class="mt-6">
                    <div class="font-semibold text-purple-500 mb-2">AI Summary</div>
                    <p>{{ analysisResult.summary }}</p>
                </div>
                <div class="mt-6">
                    <div class="font-semibold text-purple-500 mb-2">Overall Match Score</div>
                    <el-progress type="dashboard" :percentage="analysisResult.matchScore" :color="progressColors" />
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { jobApi, type AnalysisReport } from '@/services/jobApi';

const jobDescription = ref('');
const loading = ref(false);
const analysisResult = ref<AnalysisReport | null>(null);

const progressColors = [
    { color: '#f56c6c', percentage: 20 },
    { color: '#e6a23c', percentage: 40 },
    { color: '#5cb87a', percentage: 60 },
    { color: '#1989fa', percentage: 80 },
    { color: '#6f42c1', percentage: 100 },
];

/**
 * @description 调用API分析JD
 */
const analyzeJob = async () => {
    if (!jobDescription.value.trim()) {
        ElMessage.warning('请粘贴职位描述后再进行分析。');
        return;
    }
    loading.value = true;
    analysisResult.value = null;

    try {
        // 调用真实的API接口
        analysisResult.value = await jobApi.analyzeJobFit(jobDescription.value);
    } catch (error) {
        console.error("分析JD失败:", error);
        ElMessage.error("分析失败，请检查网络或稍后再试。");
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.result-container .el-descriptions__label {
    color: #a78bfa !important;
    font-weight: bold;
}

.el-textarea__inner {
    background-color: #374151;
    color: #e5e7eb;
    border-color: #4b5563;
}

.el-descriptions__title {
    color: #3366ff;
    /* 蓝色标题 */
}
</style>