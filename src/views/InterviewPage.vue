<template>
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <!-- 简历上传区域 -->
        <div v-if="!interviewStarted" class="upload-section">
            <h2 class="text-black">📝 第一步：上传简历</h2>
            <!-- 上传区域：仅在未上传成功时显示 -->
            <div v-if="!resumeText"
                class="border-2 border-dashed border-blue-400 rounded-lg py-12 my-6 cursor-pointer bg-blue-50 hover:bg-blue-100 transition"
                @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
                <input type="file" ref="fileInput" accept=".pdf" class="hidden" @change="handleFileUpload" />
                <div class="flex flex-col items-center gap-2">
                    <i class="text-5xl text-blue-500">📄</i>
                    <p class="text-lg font-semibold text-gray-900">点击或拖拽PDF文件到此处上传</p>
                    <p class="text-gray-900 text-sm">仅支持PDF格式</p>
                </div>
            </div>
            <div v-if="uploadError" class="error-message">
                {{ uploadError }}
            </div>
            <!-- 上传成功后显示文件信息 -->
            <div v-if="fileInfo && resumeText" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-green-800 font-medium">✅ 文件上传成功</p>
                <p class="text-sm text-green-700 mt-1">文件名：{{ fileInfo.name }}</p>
                <p class="text-sm text-green-700">文件大小：{{ fileInfo.size }}</p>
            </div>
            <button v-if="resumeText"
                class="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-bold text-lg mt-4 transition disabled:bg-gray-300"
                @click="startInterview" :disabled="!resumeText">
                🚀 开始模拟面试
            </button>
        </div>

        <!-- 面试对话区域 -->
        <div v-else class="interview-section">
            <div class="interview-header">
                <h2 class="text-black">💬 模拟面试进行中</h2>
                <button class="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-bold transition"
                    @click="endInterview">
                    结束面试
                </button>
            </div>

            <!-- 对话历史 -->
            <div class="flex-1 overflow-y-auto p-6 bg-gray-50 rounded-xl mb-5 h-[60vh]">
                <div v-for="(message, index) in conversation" :key="index" :class="[
                    'flex gap-3 mb-5',
                    message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                ]">
                    <div class="text-2xl w-10 h-10 flex items-center justify-center">
                        {{ message.role === 'assistant' ? '👔' : '👤' }}
                    </div>
                    <div :class="[
                        'px-5 py-3 rounded-xl max-w-[80%] shadow-sm break-words leading-relaxed',
                        message.role === 'assistant'
                            ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-500 font-medium'
                            : 'bg-gray-100 text-black border-r-4 border-blue-200 ml-auto'
                    ]">
                        {{ message.content }}
                    </div>
                </div>
            </div>

            <!-- 用户输入区域 -->
            <div v-if="conversation.length > 0 && conversation[conversation.length - 1].role === 'assistant'"
                class="flex gap-3 py-5">
                <textarea v-model="userInput" placeholder="在此输入你的回答..." @keydown.enter.prevent="handleUserInput"
                    :disabled="isLoading"
                    class="flex-1 p-3 border-2 border-blue-400 rounded-lg resize-none h-16 bg-blue-50 focus:border-blue-600 transition"></textarea>
                <button @click="handleUserInput" :disabled="!userInput.trim() || isLoading"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-lg font-bold transition disabled:bg-gray-300">
                    {{ isLoading ? '发送中...' : '发送' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import axios from 'axios'

// API 基础 URL
const API_BASE_URL = 'http://localhost:8000'

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
        uploadError.value = '只支持PDF文件'
        return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
        isLoading.value = true
        uploadError.value = ''
        const response = await axios.post(`${API_BASE_URL}/api/upload-resume`, formData)
        resumeText.value = response.data.message
        fileInfo.value = {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB'
        }
    } catch (error: any) {
        uploadError.value = error.response?.data?.detail || '上传失败，请重试'
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
        content: '你好！感谢参加本次模拟面试。我已看过你的简历，让我们开始吧。'
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
            content: '抱歉，生成问题时出错。请稍后再试。'
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
})

// 组件挂载时检查服务健康状态
onMounted(async () => {
    try {
        await axios.get(`${API_BASE_URL}/api/health`)
    } catch (error) {
        console.error('后端服务未响应，请确保服务已启动')
    }
})
</script>

<style scoped>
.interview-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.upload-section {
    text-align: center;
}

.upload-box {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 40px;
    margin: 20px 0;
    cursor: pointer;
    transition: all 0.3s ease;
}

.upload-box:hover {
    border-color: #666;
    background-color: #f9f9f9;
}

.upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.upload-icon {
    font-size: 48px;
}

.upload-hint {
    color: #666;
    font-size: 0.9em;
}

.error-message {
    color: #ff4444;
    margin: 10px 0;
}

.start-button,
.end-button {
    background-color: #4CAF50;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1em;
    transition: background-color 0.3s;
}

.start-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.end-button {
    background-color: #f44336;
}

.interview-section {
    display: flex;
    flex-direction: column;
    height: 80vh;
}

.interview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.conversation-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
    margin-bottom: 20px;
}

.message {
    display: flex;
    margin-bottom: 20px;
    gap: 12px;
}

.message-avatar {
    font-size: 24px;
    min-width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.message-content {
    background-color: white;
    padding: 12px 16px;
    border-radius: 8px;
    max-width: 80%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message.assistant .message-content {
    background-color: #e3f2fd;
}

.message.user .message-content {
    background-color: #f5f5f5;
    margin-left: auto;
}

.input-section {
    display: flex;
    gap: 10px;
    padding: 20px 0;
}

textarea {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: none;
    height: 60px;
    font-family: inherit;
}

.send-button {
    padding: 0 24px;
    background-color: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.send-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

@media (max-width: 600px) {
    .interview-container {
        padding: 10px;
    }

    .message-content {
        max-width: 90%;
    }
}
</style>
