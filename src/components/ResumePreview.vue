<template>
    <div ref="draggableBox" :style="boxStyle" class="fixed z-50 cursor-move" @mousedown="onMouseDown">
        <div ref="pdfContent" class="w-[794px] bg-white rounded-2xl shadow-2xl border border-gray-200 px-12 py-4">
            <!-- 顶部信息 -->
            <div class="flex items-center mb-8">
                <img v-if="resume.personal.photo" :src="resume.personal.photo"
                    class="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow mr-8" />
                <div>
                    <h1 class="text-4xl font-extrabold text-gray-900 mb-2 tracking-wide">{{ resume.personal.name || '姓名'
                        }}</h1>
                    <div class="text-gray-700 text-lg mb-1">
                        {{ resume.personal.degree || '学历' }} | {{ resume.personal.gender || '性别' }} | {{
                            resume.personal.age || '年龄' }}
                    </div>
                    <div class="text-gray-700 text-base">
                        {{ resume.personal.phone || '电话' }} | {{ resume.personal.email || '邮箱' }}
                    </div>
                </div>
            </div>

            <hr class="my-6 border-gray-200" />

            <!-- IT技能 -->
            <section class="mb-6">
                <h2 class="text-xl font-bold text-blue-700 mb-2">IT技能</h2>
                <div class="mb-1"><span class="font-medium text-gray-800">熟练掌握：</span><span class="text-gray-800">{{
                    resume.skills.proficient.join('，') || '无' }}</span></div>
                <div><span class="font-medium text-gray-800">熟悉：</span><span class="text-gray-800">{{
                    resume.skills.familiar.join('，')
                    || '无' }}</span></div>
            </section>
            <hr class="my-6 border-gray-200" />

            <!-- 教育背景 -->
            <section class="mb-6">
                <h2 class="text-xl font-bold text-blue-700 mb-2">教育背景</h2>
                <div v-for="(edu, idx) in resume.education" :key="idx" class="mb-1 text-gray-800">
                    <span class="font-semibold">{{ edu.school || '学校' }}</span> | {{ edu.major || '专业' }} | {{
                        edu.degree || '学历' }} <span v-if="edu.score">| 绩点：{{ edu.score }}</span>
                </div>
            </section>
            <hr class="my-6 border-gray-200" />

            <!-- 项目/实习经历 -->
            <section class="mb-6">
                <h2 class="text-xl font-bold text-blue-700 mb-2">项目/实习经历</h2>
                <div v-for="(exp, idx) in resume.experiences" :key="idx" class="mb-3">
                    <div class="font-semibold text-gray-900">{{ exp.type }}：{{ exp.name || '名称' }} <span
                            class="text-gray-500 text-sm">({{ exp.period || '时间' }})</span></div>
                    <div class="text-gray-700 text-sm mb-1">{{ exp.company || '公司' }}</div>
                    <div class="text-gray-800 text-sm whitespace-pre-line">{{ exp.content }}</div>
                </div>
            </section>
            <hr class="my-6 border-gray-200" />

            <!-- 竞赛/获奖/论文 -->
            <section class="mb-6">
                <h2 class="text-xl font-bold text-blue-700 mb-2">竞赛/获奖/论文</h2>
                <div v-for="(honor, idx) in resume.honors" :key="idx" class="mb-2">
                    <span class="font-semibold text-gray-900">{{ honor.type || '类型' }}</span> - <span
                        class="text-gray-800">{{ honor.title || '名称' }}</span>
                    <span class="text-gray-500 text-sm">({{ honor.date || '时间' }})</span>
                    <div class="text-gray-800 text-sm whitespace-pre-line">{{ honor.description }}</div>
                </div>
            </section>
            <hr class="my-6 border-gray-200" />

            <!-- 自我评价 -->
            <section>
                <h2 class="text-xl font-bold text-blue-700 mb-2">自我评价</h2>
                <div class="text-gray-800 whitespace-pre-line">{{ resume.selfEvaluation || '...' }}</div>
            </section>
        </div>
        <div class="w-[794px] flex justify-end mt-6">
            <el-button type="primary" @click="exportPDF">导出PDF</el-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'
import { ref, reactive, onMounted } from 'vue'
import html2pdf from 'html2pdf.js'
import type { CSSProperties } from 'vue'

const resume = useResumeStore()
const pdfContent = ref<HTMLElement | null>(null)

const draggableBox = ref<HTMLElement | null>(null)
const boxStyle = reactive<CSSProperties>({
    left: '0px',
    top: '110px',
    position: 'fixed',
    zIndex: 50,
})

onMounted(() => {
    // 让盒子靠左
    const width = 10
    const left = (window.innerWidth - width) / 2
    boxStyle.left = `${left}px`
})

let startX = 0
let startY = 0
let startLeft = 0
let startTop = 0

const onMouseDown = (e: MouseEvent) => {
    startX = e.clientX
    startY = e.clientY
    startLeft = parseInt(boxStyle.left as string)
    startTop = parseInt(boxStyle.top as string)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    boxStyle.left = `${startLeft + dx}px`
    boxStyle.top = `${startTop + dy}px`
}

const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
}

const exportPDF = () => {
    if (!pdfContent.value) return
    html2pdf()
        .set({
            margin: 0,
            filename: `${resume.personal.name || '简历'}.pdf`,
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(pdfContent.value)
        .save()
}
</script>
