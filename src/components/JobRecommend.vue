<template>
    <div class="job-recommend-container">
        <div v-if="loading" class="text-center py-10">
            <p class="mt-4 text-gray-400">Generating personalized job recommendations...</p>
        </div>

        <div v-if="!loading && recommendedJobs.length > 0" class="space-y-6">
            <el-alert title="Based on your resume, we recommend the following positions" type="success"
                :closable="false" class="mb-6" />
            <div v-for="job in recommendedJobs" :key="job.id" class="job-card" @click="selectedJob = job">
                <div class="flex-grow">
                    <div class="flex justify-between items-start">
                        <h3 class="text-xl font-bold text-purple-300">{{ job.title }}</h3>
                        <div class="text-lg font-semibold text-green-400">{{ job.matchScore }}% Match</div>
                    </div>
                    <p class="text-gray-400 mt-1">{{ job.company }} - {{ job.location }}</p>
                    <div class="mt-4 flex flex-wrap gap-2">
                        <el-tag v-for="tag in job.tags" :key="tag" type="info" size="small">{{ tag }}</el-tag>
                    </div>
                </div>
                <div class="text-gray-500 text-sm mt-4 pt-4 border-t border-gray-700">
                    Salary: {{ job.salary }}
                </div>
            </div>
        </div>

        <el-empty v-if="!loading && recommendedJobs.length === 0"
            description="Could not fetch recommendations. Please ensure your resume is saved."></el-empty>

        <el-drawer v-model="drawerVisible" :title="selectedJob?.title" size="40%">
            <div v-if="selectedJob" class="p-4">
                <h4 class="text-lg font-semibold">{{ selectedJob.company }} - {{ selectedJob.location }}</h4>
                <p class="text-md text-green-400 mt-2">{{ selectedJob.salary }}</p>
                <div class="mt-6">
                    <h5 class="font-bold mb-2">Why you're a good fit (AI Analysis):</h5>
                    <p class="text-gray-300 bg-gray-700 p-3 rounded-md">{{ selectedJob.reason }}</p>
                </div>
                <div class="mt-6">
                    <h5 class="font-bold mb-2">Full Job Description:</h5>
                    <p class="text-gray-400 whitespace-pre-wrap">{{ selectedJob.description }}</p>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { jobApi, type JobRecommendation } from '@/services/jobApi';

const loading = ref(true);
const recommendedJobs = ref<JobRecommendation[]>([]);
const selectedJob = ref<JobRecommendation | null>(null);
const drawerVisible = ref(false);

/**
 * @description 调用API获取岗位推荐数据
 */
const fetchRecommendations = async () => {
    loading.value = true;
    try {
        // 调用真实的API接口
        recommendedJobs.value = await jobApi.getJobRecommendations();
        if (recommendedJobs.value.length === 0) {
            ElMessage.info("暂无合适的岗位推荐，请先完善并保存您的简历。");
        }
    } catch (error) {
        console.error("获取岗位推荐失败:", error);
        ElMessage.error("获取岗位推荐失败，请稍后重试。");
        recommendedJobs.value = []; // 发生错误时清空列表
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchRecommendations();
});

watch(selectedJob, (newVal: JobRecommendation | null) => {
    drawerVisible.value = !!newVal;
})
</script>

<style scoped>
.job-card {
    background-color: rgba(31, 41, 55, 0.7);
    border: 1px solid #4b5563;
    padding: 1.5rem;
    border-radius: 0.75rem;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
}

.job-card:hover {
    transform: translateY(-5px);
    border-color: #a78bfa;
}
</style>