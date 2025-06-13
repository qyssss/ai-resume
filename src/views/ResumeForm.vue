<template>
    <el-row :gutter="32" class="pt-8">
        <el-col :span="12">
            <div class="bg-white rounded-2xl shadow-2xl p-10 min-h-[800px] w-full border border-gray-200">
                <!-- 保存按钮区域 -->
                <div class="mb-6 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">简历编辑</h1>
                    <div class="flex gap-3">
                        <el-button type="primary" size="large" :loading="saving" @click="saveResume"
                            :disabled="!isLoggedIn">
                            <el-icon v-if="!saving">
                                <Document />
                            </el-icon>
                            {{ saving ? '保存中...' : '保存简历' }}
                        </el-button>
                        <el-button type="success" size="large" :loading="loading" @click="loadResume"
                            :disabled="!isLoggedIn">
                            <el-icon v-if="!loading">
                                <Download />
                            </el-icon>
                            {{ loading ? '加载中...' : '加载简历' }}
                        </el-button>
                    </div>
                </div>

                <!-- 未登录提示 -->
                <el-alert v-if="!isLoggedIn" title="请先登录" description="登录后才能保存和加载简历信息" type="warning" :closable="false"
                    class="mb-6" />

                <el-form :model="resume" label-width="100px" class="space-y-8">
                    <!-- 个人信息 -->
                    <el-card header="个人信息" class="mb-6">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="姓名">
                                    <el-input v-model="resume.personal.name" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="性别">
                                    <el-select v-model="resume.personal.gender">
                                        <el-option label="男" value="男" />
                                        <el-option label="女" value="女" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="邮箱">
                                    <el-input v-model="resume.personal.email" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="年龄">
                                    <el-input v-model="resume.personal.age" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="电话">
                                    <el-input v-model="resume.personal.phone" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="学历">
                                    <el-input v-model="resume.personal.degree" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="照片">
                                    <el-upload class="avatar-uploader" :show-file-list="false"
                                        :before-upload="beforePhotoUpload">
                                        <img v-if="resume.personal.photo" :src="resume.personal.photo" class="avatar" />
                                        <el-icon v-else>
                                            <Plus />
                                        </el-icon>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>

                    <!-- IT技能 -->
                    <el-card header="IT技能">
                        <h2 class="font-semibold text-lg border-l-4 border-blue-400 pl-2 mb-2 text-gray-900">IT技能</h2>
                        <el-form-item label="熟练掌握">
                            <el-select v-model="resume.skills.proficient" multiple placeholder="请选择">
                                <el-option v-for="item in skillOptions" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="熟悉">
                            <el-select v-model="resume.skills.familiar" multiple placeholder="请选择">
                                <el-option v-for="item in skillOptions" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-card>

                    <!-- 教育背景 -->
                    <el-card header="教育背景">
                        <div v-for="(edu, idx) in resume.education" :key="idx" class="mb-4">
                            <el-row :gutter="20">
                                <el-col :span="12"><el-form-item label="学校"><el-input
                                            v-model="edu.school" /></el-form-item></el-col>
                                <el-col :span="10"><el-form-item label="学历"><el-input
                                            v-model="edu.degree" /></el-form-item></el-col>
                                <el-col :span="12"><el-form-item label="专业"><el-input
                                            v-model="edu.major" /></el-form-item></el-col>

                                <el-col :span="10"><el-form-item label="绩点"><el-input
                                            v-model="edu.score" /></el-form-item></el-col>
                            </el-row>
                            <el-button type="danger" size="small" @click="removeEducation(idx)"
                                v-if="resume.education.length > 1">删除</el-button>
                        </div>
                        <el-button type="primary" size="small" @click="addEducation">添加教育经历</el-button>
                    </el-card>

                    <!-- 项目/实习经历 -->
                    <el-card header="项目/实习经历">
                        <div v-for="(exp, idx) in resume.experiences" :key="idx" class="mb-4">
                            <el-row :gutter="20">
                                <el-col :span="12"><el-form-item label="类型"><el-select v-model="exp.type"><el-option
                                                label="实习" value="实习" /><el-option label="项目"
                                                value="项目" /></el-select></el-form-item></el-col>
                                <el-col :span="12"><el-form-item label="名称"><el-input
                                            v-model="exp.name" /></el-form-item></el-col>
                                <el-col :span="12"><el-form-item label="公司"><el-input
                                            v-model="exp.company" /></el-form-item></el-col>
                                <el-col :span="12"><el-form-item label="时间"><el-input
                                            v-model="exp.period" /></el-form-item></el-col>
                            </el-row>
                            <el-form-item label="内容"><el-input v-model="exp.content" type="textarea" /></el-form-item>
                            <el-button type="danger" size="small" @click="removeExperience(idx)"
                                v-if="resume.experiences.length > 1">删除</el-button>
                        </div>
                        <el-button type="primary" size="small" @click="addExperience">添加经历</el-button>
                    </el-card>

                    <!-- 竞赛/获奖/论文 -->
                    <el-card header="竞赛/获奖/论文">
                        <div v-for="(honor, idx) in resume.honors" :key="idx" class="mb-4">
                            <el-row :gutter="20">
                                <el-col :span="12"><el-form-item label="类型"><el-input
                                            v-model="honor.type" /></el-form-item></el-col>
                                <el-col :span="12"><el-form-item label="名称"><el-input
                                            v-model="honor.title" /></el-form-item></el-col>
                                <el-col :span="14"><el-form-item label="时间"><el-input
                                            v-model="honor.date" /></el-form-item></el-col>
                            </el-row>
                            <el-form-item label="描述"><el-input v-model="honor.description"
                                    type="textarea" /></el-form-item>
                            <el-button type="danger" size="small" @click="removeHonor(idx)"
                                v-if="resume.honors.length > 1">删除</el-button>
                        </div>
                        <el-button type="primary" size="small" @click="addHonor">添加</el-button>
                    </el-card>

                    <!-- 自我评价 -->
                    <el-card header="自我评价">
                        <el-form-item>
                            <el-input v-model="resume.selfEvaluation" type="textarea" rows="4" />
                        </el-form-item>
                    </el-card>
                </el-form>
            </div>
        </el-col>
        <el-col :span="12">
            <ResumePreview />
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'
import { useUserStore } from '@/stores/user'
import { resumeApi } from '@/services/resume'
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Download } from '@element-plus/icons-vue'
import ResumePreview from '@/components/ResumePreview.vue'
import axios from 'axios'

const resume = useResumeStore()
const userStore = useUserStore()

// 响应式状态
const saving = ref(false)
const loading = ref(false)

// 计算属性
const isLoggedIn = computed(() => userStore.isLoggedIn)

const skillOptions = [
    'C/C++', 'Python', 'TensorFlow', 'Office', 'Linux', 'MATLAB', 'Caffe', 'Vue', 'JavaScript', 'TypeScript', 'Element Plus', 'TailwindCSS'
]

const SMMS_TOKEN = 'IFBldSrcoBITPadg7v6HSJfw3RekT6Am'
// 保存简历
const saveResume = async () => {
    if (!isLoggedIn.value) {
        ElMessage.warning('请先登录')
        return
    }

    try {
        saving.value = true

        // 验证必填字段
        if (!resume.personal.name || !resume.personal.email) {
            ElMessage.error('请填写姓名和邮箱')
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

        ElMessage.success('简历保存成功！')
    } catch (error: any) {
        console.error('保存简历失败:', error)

        // 显示具体错误信息
        let errorMessage = '保存失败，请重试'
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
        ElMessage.warning('请先登录')
        return
    }

    try {
        loading.value = true

        const resumeData = await resumeApi.getResume()

        // 更新store中的数据
        if (resumeData.personal) resume.personal = resumeData.personal
        if (resumeData.skills) resume.skills = resumeData.skills
        if (resumeData.education) resume.education = resumeData.education
        if (resumeData.experiences) resume.experiences = resumeData.experiences
        if (resumeData.honors) resume.honors = resumeData.honors
        if (resumeData.selfEvaluation) resume.selfEvaluation = resumeData.selfEvaluation

        ElMessage.success('简历加载成功！')
    } catch (error: any) {
        console.error('加载简历失败:', error)

        // 如果是404错误，说明用户还没有保存过简历
        if (error.response?.status === 404) {
            ElMessage.info('您还没有保存过简历，请先填写并保存')
        } else {
            let errorMessage = '加载失败，请重试'
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

// 动态增删
const addEducation = () => resume.education.push({ school: '', major: '', degree: '', score: '' })
const removeEducation = (idx: number) => resume.education.splice(idx, 1)

const addExperience = () => resume.experiences.push({ type: '实习', name: '', company: '', period: '', content: '', result: '' })
const removeExperience = (idx: number) => resume.experiences.splice(idx, 1)

const addHonor = () => resume.honors.push({ type: '', title: '', date: '', description: '' })
const removeHonor = (idx: number) => resume.honors.splice(idx, 1)

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
        const res = await axios.post('/api/upload', formData, {
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
</script>

<style scoped>
.avatar-uploader .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
}
</style>