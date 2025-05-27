<template>
    <el-row :gutter="32" class="pt-8">
        <el-col :span="12">
            <div class="bg-white rounded-2xl shadow-2xl p-10 min-h-[800px] w-full border border-gray-200">
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
                                    <el-upload class="avatar-uploader" action="" :show-file-list="false"
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
import { ref } from 'vue'
import ResumePreview from '@/components/ResumePreview.vue'

const resume = useResumeStore()

const skillOptions = [
    'C/C++', 'Python', 'TensorFlow', 'Office', 'Linux', 'MATLAB', 'Caffe', 'Vue', 'JavaScript', 'TypeScript', 'Element Plus', 'TailwindCSS'
]

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

const beforePhotoUpload = (file: any) => {
    const reader = new FileReader()
    reader.onload = (e: any) => {
        resume.personal.photo = e.target.result
    }
    reader.readAsDataURL(file)
    // 阻止自动上传
    return false
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