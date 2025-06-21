<template>
    <div class="job-analysis-container">
        <el-input v-model="jobDescription" type="textarea" :rows="10"
            placeholder="Paste the full job description here to analyze it against your saved resume." class="mb-4" />
        <el-button type="primary" size="large" @click="analyzeJob" :loading="loading" class="w-full">
            Analyze Job Fit
        </el-button>

        <div v-if="analysisResult" class="mt-8 result-container">
            <el-descriptions title="Analysis Report" :column="2" border>
                <el-descriptions-item label="Overall Match Score" label-align="right" align="center"
                    label-class-name="my-label" class-name="my-content" width="150px">
                    <el-progress type="dashboard" :percentage="analysisResult.matchScore" :color="progressColors" />
                </el-descriptions-item>
                <el-descriptions-item label="AI Summary" label-align="right" align="left">
                    <p>{{ analysisResult.summary }}</p>
                </el-descriptions-item>

                <el-descriptions-item label="Strengths (Resume Highlights)" label-align="right" align="left">
                    <ul class="list-disc pl-5">
                        <li v-for="strength in analysisResult.strengths" :key="strength">{{ strength }}</li>
                    </ul>
                </el-descriptions-item>
                <el-descriptions-item label="Areas for Improvement" label-align="right" align="left">
                    <ul class="list-disc pl-5">
                        <li v-for="gap in analysisResult.gaps" :key="gap">{{ gap }}</li>
                    </ul>
                </el-descriptions-item>
            </el-descriptions>
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

<style>
.result-container .el-descriptions__label {
    color: #a78bfa !important;
    font-weight: bold;
}

.el-textarea__inner {
    background-color: #374151;
    color: #e5e7eb;
    border-color: #4b5563;
}
</style>