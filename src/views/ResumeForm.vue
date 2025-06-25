<template>
    <div class="min-h-screen bg-gray-900 font-sans p-8 relative">
        <!-- 动态渐变背景 -->
        <div class="gradient-bg absolute top-0 left-0 w-full h-full -z-10"></div>
        <el-row :gutter="32">
            <el-col :span="12" class="pt-14">
                <div class="bg-white rounded-2xl shadow-2xl p-10 min-h-[800px] w-full border border-gray-200">
                    <!-- 保存按钮区域 -->

                    <div class="mb-6 flex flex-col gap-4">
                        <!-- 标题和AI优化按钮同一行 -->
                        <div class="flex items-center gap-4 justify-center">
                            <h1 class="text-2xl font-bold text-gray-800">Edit Resume</h1>
                            <el-button type="primary" plain size="large" @click="handleOptimize" :loading="optimizing"
                                :disabled="!isLoggedIn">
                                <el-icon>
                                    <MagicStick />
                                </el-icon>
                                {{ optimizing ? 'Optimizing...' : 'AI Optimize' }}
                            </el-button>
                        </div>
                        <!-- 其他操作按钮一行 -->
                        <div class="flex flex-wrap gap-4 justify-center">
                            <el-button type="primary" size="large" :loading="saving" @click="saveResume"
                                :disabled="!isLoggedIn">
                                <el-icon v-if="!saving">
                                    <Document />
                                </el-icon>
                                {{ saving ? 'Saving...' : 'Save Resume' }}
                            </el-button>
                            <el-button type="success" size="large" :loading="loading" @click="loadResume"
                                :disabled="!isLoggedIn">
                                <el-icon v-if="!loading">
                                    <Download />
                                </el-icon>
                                {{ loading ? 'Loading...' : 'Load Resume' }}
                            </el-button>
                            <el-button type="danger" size="large" :loading="clearing" @click="clearResume"
                                :disabled="!isLoggedIn">
                                <el-icon v-if="!clearing">
                                    <Delete />
                                </el-icon>
                                {{ clearing ? 'Clearing...' : 'Clear Resume' }}
                            </el-button>
                            <el-button type="warning" size="large" @click="resetToInitial" :disabled="!isLoggedIn">
                                <el-icon>
                                    <Refresh />
                                </el-icon>
                                Reset to Example
                            </el-button>
                        </div>
                    </div>

                    <!-- 未登录提示 -->
                    <el-alert v-if="!isLoggedIn" title="Please log in first"
                        description="You must be logged in to save and load resume information" type="warning"
                        :closable="false" class="mb-6" />

                    <el-form :model="resume" label-width="100px" class="space-y-8">
                        <!-- 个人信息 -->
                        <el-card header="Personal Info" class="mb-6">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="Name">
                                        <el-input v-model="resume.personal.name" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="Gender">
                                        <el-select v-model="resume.personal.gender">
                                            <el-option label="Male" value="Male" />
                                            <el-option label="Female" value="Female" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="Email">
                                        <el-input v-model="resume.personal.email" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="Age">
                                        <el-input v-model="resume.personal.age" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="Phone">
                                        <el-input v-model="resume.personal.phone" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="Degree">
                                        <el-input v-model="resume.personal.degree" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-form-item label="Photo">
                                        <el-upload class="avatar-uploader" :show-file-list="false"
                                            :before-upload="beforePhotoUpload">
                                            <img v-if="resume.personal.photo" :src="resume.personal.photo"
                                                class="avatar" />
                                            <el-icon v-else>
                                                <Plus />
                                            </el-icon>
                                        </el-upload>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-card>

                        <!-- IT技能 -->
                        <el-card header="IT Skills">
                            <h2 class="font-semibold text-lg border-l-4 border-blue-400 pl-2 mb-2 text-gray-900">IT
                                Skills
                            </h2>
                            <el-form-item label="Proficient">
                                <el-select v-model="resume.skills.proficient" multiple placeholder="Please select">
                                    <el-option v-for="item in skillOptions" :key="item" :label="item" :value="item" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Familiar">
                                <el-select v-model="resume.skills.familiar" multiple placeholder="Please select">
                                    <el-option v-for="item in skillOptions" :key="item" :label="item" :value="item" />
                                </el-select>
                            </el-form-item>
                        </el-card>

                        <!-- 教育背景 -->
                        <el-card header="Education">
                            <div v-for="(edu, idx) in resume.education" :key="idx" class="mb-4">
                                <el-row :gutter="20">
                                    <el-col :span="12"><el-form-item label="School"><el-input
                                                v-model="edu.school" /></el-form-item></el-col>
                                    <el-col :span="10"><el-form-item label="Degree"><el-input
                                                v-model="edu.degree" /></el-form-item></el-col>
                                    <el-col :span="12"><el-form-item label="Major"><el-input
                                                v-model="edu.major" /></el-form-item></el-col>

                                    <el-col :span="10"><el-form-item label="Score"><el-input
                                                v-model="edu.score" /></el-form-item></el-col>
                                </el-row>
                                <el-button type="danger" size="small" @click="resume.removeEducation(idx)"
                                    v-if="resume.education.length > 1">Delete</el-button>
                            </div>
                            <el-button type="primary" size="small" @click="resume.addEducation">Add
                                Education</el-button>
                        </el-card>

                        <!-- 项目/实习经历 -->
                        <el-card header="Project/Internship Experience">
                            <div v-for="(exp, idx) in resume.experiences" :key="idx" class="mb-4">
                                <el-row :gutter="20">
                                    <el-col :span="12"><el-form-item label="Type"><el-select v-model="exp.type">
                                                <el-option label="Internship" value="Internship" />
                                                <el-option label="Project" value="Project" />
                                            </el-select></el-form-item></el-col>
                                    <el-col :span="12"><el-form-item label="Name"><el-input
                                                v-model="exp.name" /></el-form-item></el-col>
                                    <el-col :span="12"><el-form-item label="Company"><el-input
                                                v-model="exp.company" /></el-form-item></el-col>
                                    <el-col :span="12"><el-form-item label="Period"><el-input
                                                v-model="exp.period" /></el-form-item></el-col>
                                </el-row>
                                <el-form-item label="Content"><el-input v-model="exp.content"
                                        type="textarea" /></el-form-item>
                                <el-button type="danger" size="small" @click="resume.removeExperience(idx)"
                                    v-if="resume.experiences.length > 1">Delete</el-button>
                            </div>
                            <el-button type="primary" size="small" @click="resume.addExperience">Add
                                Experience</el-button>
                        </el-card>

                        <!-- 竞赛/获奖/论文 -->
                        <el-card header="Competitions/Awards/Publications">
                            <div v-for="(honor, idx) in resume.honors" :key="idx" class="mb-4">
                                <el-row :gutter="20">
                                    <el-col :span="12"><el-form-item label="Type"><el-input
                                                v-model="honor.type" /></el-form-item></el-col>
                                    <el-col :span="12"><el-form-item label="Name"><el-input
                                                v-model="honor.title" /></el-form-item></el-col>
                                    <el-col :span="14"><el-form-item label="Date"><el-input
                                                v-model="honor.date" /></el-form-item></el-col>
                                </el-row>
                                <el-form-item label="Description"><el-input v-model="honor.description"
                                        type="textarea" /></el-form-item>
                                <el-button type="danger" size="small" @click="resume.removeHonor(idx)"
                                    v-if="resume.honors.length > 1">Delete</el-button>
                            </div>
                            <el-button type="primary" size="small" @click="resume.addHonor">Add</el-button>
                        </el-card>

                        <!-- 自我评价 -->
                        <el-card header="Self-Evaluation">
                            <el-form-item>
                                <el-input v-model="resume.selfEvaluation" type="textarea" rows="4" />
                            </el-form-item>
                        </el-card>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="12" class="sticky-preview pt-14">
                <ResumePreview />
            </el-col>
        </el-row>

        <OptimizeModal v-model="showOptimizeModal" :original="originalResumeState" :optimized="optimizedResumeState"
            @accept="handleAcceptOptimization" />
    </div>
</template>

<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'
import { useUserStore } from '@/stores/user'
import { resumeApi } from '@/services/resume'
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Download, Delete, MagicStick, Refresh } from '@element-plus/icons-vue'
import ResumePreview from '@/components/ResumePreview.vue'
import OptimizeModal from '@/components/OptimizeModal.vue'
import axios from 'axios'
import { API_BASE_URL } from '@/utils/config';
const resume = useResumeStore()
const userStore = useUserStore()

// 响应式状态
const saving = ref(false)
const loading = ref(false)
const clearing = ref(false)
const optimizing = ref(false)
const showOptimizeModal = ref(false)
const originalResumeState = ref({})
const optimizedResumeState = ref({})

// 计算属性
const isLoggedIn = computed(() => !!userStore.authToken)

const skillOptions = [
    'Java', 'Spring Boot', 'Python', 'Django', 'PostgreSQL', 'Docker', 'Kubernetes',
    'Go', 'gRPC', 'AWS', 'Redis', 'Kafka', 'C/C++', 'TensorFlow', 'Office',
    'Linux', 'MATLAB', 'Caffe', 'Vue', 'JavaScript', 'TypeScript', 'Element Plus', 'TailwindCSS'
]

const SMMS_TOKEN = 'IFBldSrcoBITPadg7v6HSJfw3RekT6Am'
// 保存简历
const saveResume = async () => {
    if (!isLoggedIn.value) {
        ElMessage.warning('Please log in first')
        return
    }

    try {
        saving.value = true

        // 验证必填字段
        if (!resume.personal.name || !resume.personal.email) {
            ElMessage.error('Please fill in your name and email')
            return
        }
        // 调用API保存简历
        await resumeApi.saveResume({
            personal: resume.personal,
            skills: resume.skills,
            education: resume.education,
            experiences: resume.experiences,
            honors: resume.honors,
            selfEvaluation: resume.selfEvaluation
        })

        ElMessage.success('Resume saved successfully!')
    } catch (error: any) {
        console.error('Failed to save resume:', error)

        // 显示具体错误信息
        let errorMessage = 'Save failed, please try again'
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message
        } else if (error.message) {
            errorMessage = error.message
        }

        ElMessage.error(errorMessage)
    } finally {
        saving.value = false
    }
}

// 加载简历
const loadResume = async () => {
    if (!isLoggedIn.value) {
        ElMessage.warning('Please log in first')
        return
    }

    try {
        loading.value = true

        const resumeData = await resumeApi.getResume()

        // 更新store中的数据
        resume.updateResume(resumeData);

        ElMessage.success('Resume loaded successfully!')
    } catch (error: any) {
        console.error('Failed to load resume:', error)

        // 如果是404错误，说明用户还没有保存过简历
        if (error.response?.status === 404) {
            ElMessage.info('You have not saved a resume yet. Please fill it out and save.')
        } else {
            let errorMessage = 'Load failed, please try again'
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error.message) {
                errorMessage = error.message
            }
            ElMessage.error(errorMessage)
        }
    } finally {
        loading.value = false
    }
}

// 清空简历
const clearResume = async () => {
    if (!isLoggedIn.value) {
        ElMessage.warning('Please log in first')
        return
    }

    try {
        await ElMessageBox.confirm(
            'This will clear the form and delete your saved resume from the server. The form will be cleared immediately.',
            'Are you sure?',
            {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning',
                center: true,
            }
        )

        clearing.value = true;

        // 1. 立即清空前端数据
        resume.clearResumeData();
        ElMessage.success('Your form has been cleared.');

        // 2. 尝试在后台删除后端数据
        try {
            await resumeApi.deleteResume();
            console.log('Resume data successfully deleted from server.');
        } catch (serverError: any) {
            console.error('Failed to delete resume from server:', serverError);
            const errorMessage = serverError.response?.data?.message || 'You have already deleted the resume from the server. Please save a new resume.';
            ElMessage.error(errorMessage);
        } finally {
            clearing.value = false;
        }

    } catch (error) {
        if (error === 'cancel') {
            ElMessage.info('Clear action canceled');
        } else {
            console.error('An unexpected error occurred during the clear process:', error);
        }
    }
}

// 照片上传（这里只做本地预览）
const handlePhotoChange = (file: any) => {
    const reader = new FileReader()
    reader.onload = (e: any) => {
        resume.personal.photo = e.target.result
    }
    reader.readAsDataURL(file.raw)
}

const beforePhotoUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file) // 这里用 file 字段，后端也用 file 字段接收
    try {
        // 假设你的后端接口为 /api/upload
        const res = await axios.post(`${API_BASE_URL}/api/resume/photoUpload`, formData, {
            headers: {
                // 不要加 Content-Type，axios 会自动设置 multipart/form-data
            }
        })
        // 假设后端返回 { url: '图片地址' }
        if (res.data && res.data.url) {
            resume.personal.photo = res.data.url
            ElMessage.success('图片上传成功！')
        } else {
            ElMessage.error(res.data.message || '图片上传失败')
        }
    } catch (err: any) {
        ElMessage.error('图片上传失败: ' + (err?.message || '未知错误'))
    }
    return false // 阻止 element-plus 自动上传
}

const handleOptimize = async () => {
    if (!isLoggedIn.value) {
        ElMessage.warning('Please log in before using the AI optimization feature.');
        return;
    }
    optimizing.value = true;
    try {
        // 1. 创建优化任务，拿到task_id
        const startRes = await resumeApi.optimizeResumeStart();
        console.log('optimizeResumeStart 返回：', startRes);
        const taskId = startRes?.task_id;
        if (!taskId) throw new Error('Failed to get task_id, response: ' + JSON.stringify(startRes));
        // 2. 轮询获取优化结果
        let pollCount = 0;
        const maxPoll = 60; // 最多轮询60次（约1分钟）
        let pollResult = null;
        while (pollCount < maxPoll) {
            await new Promise(r => setTimeout(r, 1500));
            const pollRes = await resumeApi.optimizeResumePoll(taskId);
            if (pollRes.status === 'done') {
                pollResult = pollRes.result;
                break;
            } else if (pollRes.status === 'failed') {
                throw new Error('AI optimization failed.');
            }
            pollCount++;
        }
        if (!pollResult) throw new Error('AI optimization timed out. Please try again later.');

        // 展示优化结果
        originalResumeState.value = JSON.parse(JSON.stringify(resume.$state));
        optimizedResumeState.value = pollResult;
        showOptimizeModal.value = true;
    } catch (error: any) {
        ElMessage.error(error.message || 'Failed to get AI optimization suggestions. Please try again later.');
        console.error('Error occurred while requesting resume optimization suggestions:', error);
    } finally {
        optimizing.value = false;
        ElMessage.success('AI optimization completed!');
    }
}

const handleAcceptOptimization = async (optimizedData: any) => {
    resume.updateResume(optimizedData);
    // Ask user if they want to save the optimized resume
    try {
        await ElMessageBox.confirm(
            'Do you want to save the optimized resume?',
            'Save Optimized Resume',
            {
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel',
                type: 'info',
                center: true,
            }
        );
        await saveResume();
    } catch (error) {
        if (error === 'cancel') {
            ElMessage.info('Save action canceled');
        } else {
            console.error('An unexpected error occurred during the save process:', error);
        }
    }
    ElMessage.success('Resume updated with AI optimizations!');
}

const resetToInitial = () => {
    resume.resetResumeToInitial();
    ElMessage.success('Resume reset to initial values!');
}

</script>

<style scoped>
.gradient-bg {
    background: linear-gradient(-45deg, #6d28d9, #4338ca, #2563eb, #7c3aed);
    background-size: 400% 400%;
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

.avatar-uploader .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
}
</style>