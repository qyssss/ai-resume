<template>
    <div class="bg-gray-900 text-gray-100 min-h-screen">
        <div class="gradient-bg absolute top-0 left-0 w-full h-[500px] -z-10"></div>
        <main class="pt-24 pb-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center py-12">
                    <h1 class="text-5xl md:text-6xl font-bold leading-tight mb-4">
                        <span class="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">Job
                            Center</span>
                    </h1>
                    <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                        Your hub for career opportunities and resume analysis.
                    </p>
                </div>

                <el-tabs v-model="activeTab" type="border-card" class="job-center-tabs">
                    <el-tab-pane label="Job Recommendations" name="recommend">
                        <JobRecommend />
                    </el-tab-pane>
                    <el-tab-pane label="JD Fit Analysis" name="analysis">
                        <JobAnalysis />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import JobRecommend from '@/components/JobRecommend.vue';
import JobAnalysis from '@/components/JobAnalysis.vue';

const activeTab = ref('recommend');
</script>

<style>
.job-center-tabs {
    background-color: #1f2937 !important;
    /* bg-gray-800 */
    border: 1px solid #374151 !important;
    /* border-gray-700 */
    border-radius: 1rem;
}

.job-center-tabs .el-tabs__header {
    background-color: #111827 !important;
    /* bg-gray-900 */
    border-bottom: 1px solid #374151 !important;
    /* border-gray-700 */
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
}

.job-center-tabs .el-tabs__item {
    color: #d1d5db;
    /* text-gray-300 */
    border: none !important;
}

.job-center-tabs .el-tabs__item.is-active {
    color: #a78bfa !important;
    /* text-purple-400 */
    background-color: #1f2937 !important;
    /* bg-gray-800 */
}

.job-center-tabs .el-tabs__nav-wrap {
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
}

.job-center-tabs .el-tabs__content {
    padding: 2rem;
    color: #d1d5db;
    background-color: #1f2937;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
}

.gradient-bg {
    background: linear-gradient(-45deg, #111827, #14532d, #1e3a8a);
    background-size: 200% 200%;
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>