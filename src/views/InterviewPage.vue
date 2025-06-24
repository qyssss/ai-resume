<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 font-sans p-8 relative">
        <!-- 动态渐变背景 -->
        <div class="gradient-bg absolute top-0 left-0 w-full h-full -z-10"></div>

        <!-- 页面头部 -->
        <div class="text-center mb-8">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                    AI Mock Interview
                </span>
            </h1>
            <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                Upload your resume, and the AI will conduct a highly customized mock interview based on your experience.
            </p>
        </div>

        <!-- 简历上传区域 -->
        <div v-if="!interviewStarted"
            class="max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700 shadow-2xl p-8 lg:p-12 text-center">
            <h2 class="text-2xl font-bold text-white mb-6">📝 Step 1: Upload Resume</h2>
            <!-- 上传区域 -->
            <div v-if="!resumeText"
                class="border-2 border-dashed border-gray-600 hover:border-purple-400 rounded-2xl py-12 my-6 cursor-pointer bg-gray-900/50 hover:bg-gray-800/70 transition-all duration-300"
                @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
                <input type="file" ref="fileInput" accept=".pdf" class="hidden" @change="handleFileUpload" />
                <div class="flex flex-col items-center gap-4">
                    <svg class="w-16 h-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                        </path>
                    </svg>
                    <p class="text-lg font-semibold text-gray-100">Click or drag a PDF file here to upload</p>
                    <p class="text-gray-400 text-sm">Only PDF format is supported</p>
                    <p class="text-red-400 text-sm mt-2">
                        Only text-based PDF resumes are supported. Scanned or image-based PDFs are not supported.
                    </p>
                </div>
            </div>
            <div v-if="uploadError" class="text-red-400 bg-red-900/50 p-3 rounded-lg my-4">
                {{ uploadError }}
            </div>
            <!-- 上传成功后显示文件信息 -->
            <div v-if="fileInfo && resumeText"
                class="mt-4 p-4 bg-green-900/50 border border-green-700 rounded-lg text-left">
                <p class="text-green-300 font-medium">✅ File uploaded successfully</p>
                <p class="text-sm text-green-400 mt-1">File name: {{ fileInfo.name }}</p>
                <p class="text-sm text-green-400">File size: {{ fileInfo.size }}</p>
            </div>
            <button v-if="resumeText"
                class="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-xl hover:shadow-purple-500/30 transition transform hover:-translate-y-1 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="startInterview" :disabled="!resumeText">
                🚀 Start Mock Interview
            </button>
        </div>

        <!-- 面试对话区域 -->
        <div v-else class="max-w-5xl mx-auto">
            <div class="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
                <!-- 头部 -->
                <div class="p-4 flex justify-between items-center border-b border-gray-700">
                    <h2 class="text-lg font-semibold text-white">💬 Mock Interview in Progress</h2>
                    <button
                        class="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200"
                        @click="endInterview">
                        End Interview
                    </button>
                </div>

                <!-- 对话历史 -->
                <div ref="conversationContainer"
                    class="h-[60vh] overflow-y-auto p-6 bg-gradient-to-b from-gray-900/50 to-gray-800/50">
                    <div v-for="(message, index) in conversation" :key="index" :class="[
                        'mb-6 flex',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                    ]">
                        <div :class="[
                            'max-w-[80%] lg:max-w-[70%]',
                            message.role === 'user' ? 'order-2' : 'order-1'
                        ]">
                            <!-- 头像 -->
                            <div :class="[
                                'flex items-center mb-2',
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                            ]">
                                <div v-if="message.role === 'assistant'"
                                    class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-3">
                                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                                        </path>
                                    </svg>
                                </div>
                                <span class="text-sm text-gray-400">{{ message.role === 'assistant' ? 'AI Interviewer' :
                                    'You'
                                    }}</span>
                                <div v-if="message.role === 'user'"
                                    class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center ml-3">
                                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                                        </path>
                                    </svg>
                                </div>
                            </div>

                            <!-- 消息内容 -->
                            <div :class="[
                                'px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm break-words leading-relaxed',
                                message.role === 'user'
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                    : 'bg-gray-700/80 text-gray-100 border border-gray-600'
                            ]">
                                {{ message.content }}
                            </div>
                        </div>
                    </div>
                    <!-- 加载状态 -->
                    <div v-if="isLoading" class="flex justify-start mb-6">
                        <div class="max-w-[80%] lg:max-w-[70%]">
                            <div class="flex items-center mb-2">
                                <div
                                    class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-3">
                                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                                        </path>
                                    </svg>
                                </div>
                                <span class="text-sm text-gray-400">AI Interviewer</span>
                            </div>
                            <div class="px-6 py-4 rounded-2xl bg-gray-700/80 border border-gray-600">
                                <div class="flex space-x-2">
                                    <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                    <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                                        style="animation-delay: 0.1s"></div>
                                    <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                        style="animation-delay: 0.2s"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 用户输入区域 -->
                <div v-if="conversation.length > 0 && conversation[conversation.length - 1].role === 'assistant'"
                    class="p-6 bg-gray-800/80 border-t border-gray-700">
                    <div class="flex space-x-4">
                        <div class="flex-1 relative">
                            <textarea v-model="userInput" placeholder="Enter your answer here..."
                                @keydown.enter.prevent="handleUserInput" :disabled="isLoading"
                                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 resize-none h-24"></textarea>
                        </div>
                        <button @click="handleUserInput" :disabled="!userInput.trim() || isLoading"
                            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                            <div class="flex items-center space-x-2">
                                <svg v-if="!isLoading" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                                <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                <span>{{ isLoading ? 'Sending...' : 'Send' }}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import axios from 'axios'

// API 基础 URL
import { API_BASE_URL } from '@/utils/config';

// 状态变量
const interviewStarted = ref(false)
const resumeText = ref('')
const uploadError = ref('')
const fileInfo = ref<{ name: string; size: string } | null>(null)
const conversation = ref<Array<{ role: string; content: string }>>([])
const userInput = ref('')
const isLoading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const conversationContainer = ref<HTMLElement | null>(null)

// 文件上传处理
const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileDrop = (event: DragEvent) => {
    const files = event.dataTransfer?.files
    if (files && files[0]) {
        handleFile(files[0])
    }
}

const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
        handleFile(input.files[0])
    }
}

const handleFile = async (file: File) => {
    if (!file.name.endsWith('.pdf')) {
        uploadError.value = 'Only PDF files are supported'
        return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
        isLoading.value = true
        uploadError.value = ''
        const response = await axios.post(`${API_BASE_URL}/api/upload-resume`, formData)
        if (!response.data.message || response.data.message.trim() === '') {
            uploadError.value = 'Failed to extract text. Please upload a text-based PDF. Scanned/image-based PDFs are not supported.'
            fileInfo.value = null
            resumeText.value = ''
            return
        }
        resumeText.value = response.data.message
        fileInfo.value = {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB'
        }
    } catch (error: any) {
        uploadError.value = error.response?.data?.detail || 'Upload failed, please try again'
        fileInfo.value = null
    } finally {
        isLoading.value = false
    }
}

// 面试控制
const startInterview = () => {
    interviewStarted.value = true
    conversation.value = [{
        role: 'assistant',
        content: 'Hello! Thank you for participating in this mock interview. I have reviewed your resume, let\'s get started.'
    }]
}

const endInterview = () => {
    interviewStarted.value = false
    conversation.value = []
    resumeText.value = ''
    userInput.value = ''
    fileInfo.value = null
}

// 对话处理
const handleUserInput = async () => {
    if (!userInput.value.trim() || isLoading.value) return

    const userMessage = userInput.value.trim()
    conversation.value.push({ role: 'user', content: userMessage })
    userInput.value = ''
    isLoading.value = true

    try {
        const response = await axios.post(`${API_BASE_URL}/api/generate-question`, {
            resume_text: resumeText.value,
            conversation: conversation.value
        })

        conversation.value.push({
            role: 'assistant',
            content: response.data.message
        })
    } catch (error: any) {
        conversation.value.push({
            role: 'assistant',
            content: 'Sorry, an error occurred while generating the question. Please try again later.'
        })
    } finally {
        isLoading.value = false
        await nextTick()
        scrollToBottom()
    }
}

// 自动滚动到底部
const scrollToBottom = () => {
    if (conversationContainer.value) {
        conversationContainer.value.scrollTop = conversationContainer.value.scrollHeight
    }
}

// 监听对话变化，自动滚动
watch(conversation, () => {
    nextTick(scrollToBottom)
}, { deep: true, immediate: true })


// 组件挂载时检查服务健康状态
onMounted(async () => {
    try {
        await axios.get(`${API_BASE_URL}/api/health`)
    } catch (error) {
        console.error('Backend service is not responding, please make sure it is running')
    }
})
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

/* Custom scrollbar for chat */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: rgba(55, 65, 81, 0.3);
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.5);
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.7);
}
</style>
