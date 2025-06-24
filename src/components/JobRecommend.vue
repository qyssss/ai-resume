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
import { useResumeStore } from '@/stores/resume';

const loading = ref(true);
const recommendedJobs = ref<JobRecommendation[]>([]);
const selectedJob = ref<JobRecommendation | null>(null);
const drawerVisible = ref(false);

const resumeStore = useResumeStore();

// 批量翻译函数
async function translateBatch(texts: string[], target = 'en'): Promise<string[]> {
    const apiKey = 'AIzaSyD0XBD2m-vvfmpl4UhZdt9lk2rHCxfRHrQ';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: texts, target })
    });
    const data = await res.json();
    return data.data.translations.map((t: any) => t.translatedText);
}

function decodeHtmlEntities(str: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
}

const fetchRecommendations = async () => {
    loading.value = true;
    try {

        const jobs = await jobApi.getJobRecommendations();

        for (const job of jobs) {
            const fieldsToTranslate = [
                job.title,
                job.company,
                job.location,
                job.salary,
                job.reason,
                job.description,
                ...job.tags
            ];
            const translated = await translateBatch(fieldsToTranslate, 'en');
            job.title = decodeHtmlEntities(translated[0]);
            job.company = decodeHtmlEntities(translated[1]);
            job.location = decodeHtmlEntities(translated[2]);
            job.salary = decodeHtmlEntities(translated[3]);
            job.reason = decodeHtmlEntities(translated[4]);
            job.description = decodeHtmlEntities(translated[5]);
            job.tags = translated.slice(6).map(decodeHtmlEntities);
        }

        recommendedJobs.value = jobs;
        if (jobs.length === 0) {
            ElMessage.info("No suitable job recommendations. Please complete and save your resume first.");
        }
    } catch (error) {
        console.error("Failed to fetch job recommendations:", error);
        ElMessage.error("Failed to fetch job recommendations. Please try again later.");
        recommendedJobs.value = [];
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchRecommendations();
});

watch(selectedJob, (newVal: JobRecommendation | null) => {
    drawerVisible.value = !!newVal;
});
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