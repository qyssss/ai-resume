<template>
    <div class="max-w-3xl mx-auto p-6">
        <h1 class="text-2xl font-bold mb-4">AI 简历助手</h1>

        <!-- 功能选择区域 -->
        <div class="mode-selector">
            <button :class="['mode-btn', currentMode === 'resume' ? 'active' : '']" @click="switchMode('resume')">
                简历优化
            </button>
            <button :class="['mode-btn', currentMode === 'interview' ? 'active' : '']" @click="switchMode('interview')">
                模拟面试
            </button>
        </div>

        <!-- 聊天区域 -->
        <div class="flex flex-col h-[70vh] border rounded-lg overflow-hidden bg-white shadow">
            <div class="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div v-for="(message, index) in messages" :key="index" :class="[
                    'mb-4',
                    message.role === 'user' ? 'ml-auto' : 'mr-auto',
                    'max-w-60%]',
                    'break'
                ]">
                    <div :class="[
                        'px-4 py-2 rounded-2xl shadow',
                        message.role === 'user'
                            ? 'bg-blue-500 text-white text-left'
                            : 'bg-white text-gray-800 border border-gray-200 text-left'
                    ]">
                        <div v-if="message.role === 'assistant' && message.suggestions"
                            class="border-t pt-2 mt-2 space-y-2">
                            <div v-for="(suggestion, idx) in message.suggestions" :key="idx"
                                class="flex items-center space-x-2">
                                <button class="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                    @click="applySuggestion(suggestion)">
                                    应用建议
                                </button>
                                <span>{{ suggestion }}</span>
                            </div>
                        </div>
                        <Markdown :source="message.content" class="prose max-w-none" />
                    </div>
                </div>
            </div>

            <!-- 输入区域 -->
            <div class="p-4 border-t bg-white">
                <div class="quick-actions" v-if="currentMode === 'resume'">
                    <button @click="quickAction('optimizeSkills')">优化技能描述</button>
                    <button @click="quickAction('optimizeExperience')">优化项目经历</button>
                    <button @click="quickAction('optimizeSelfEval')">优化自我评价</button>
                </div>
                <div class="quick-actions" v-if="currentMode === 'interview'">
                    <button @click="quickAction('startInterview')">开始面试</button>
                    <button @click="quickAction('nextQuestion')">下一题</button>
                    <button @click="quickAction('endInterview')">结束面试</button>
                </div>
                <div class="flex space-x-2">
                    <input v-model="userInput" @keyup.enter="sendMessage"
                        :placeholder="currentMode === 'resume' ? '输入您想优化的简历内容...' : '回答面试问题...'" :disabled="isLoading"
                        class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" />
                    <button @click="sendMessage" :disabled="isLoading || !userInput.trim()"
                        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
                        {{ isLoading ? '发送中...' : '发送' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import type { DialogueHistory } from '../types/aiDialogue';
import { sendToQwenAIDialogue } from '../api/qWen';
import { useResumeStore } from '../stores/resume';
import Markdown from 'vue3-markdown-it'

const resumeStore = useResumeStore();
const resumeMessages = ref<DialogueHistory>([{
    role: 'assistant',
    content: '我是您的简历优化助手，请告诉我您想优化简历的哪个部分？'
}]);
const interviewMessages = ref<DialogueHistory>([{
    role: 'assistant',
    content: '我是您的面试官，准备好开始面试了吗？'
}]);
const messages = ref<DialogueHistory>(resumeMessages.value);
const userInput = ref('');
const isLoading = ref(false);
const messageHistory = ref<HTMLElement | null>(null);
const currentMode = ref<'resume' | 'interview'>('resume');

// 切换模式
const switchMode = (mode: 'resume' | 'interview') => {
    currentMode.value = mode;
    if (mode === 'resume') {
        messages.value = resumeMessages.value;
    } else {
        messages.value = interviewMessages.value;
    }
};

// 快速操作
const quickAction = async (action: string) => {
    switch (action) {
        case 'optimizeSkills':
            userInput.value = '优化技能描述';
            break;
        case 'optimizeExperience':
            userInput.value = '优化项目经历';
            break;
        case 'optimizeSelfEval':
            userInput.value = '优化自我评价';
            break;
        case 'startInterview':
            userInput.value = '开始模拟面试';
            break;
        case 'nextQuestion':
            userInput.value = '下一题';
            break;
        case 'endInterview':
            userInput.value = '结束面试';
            break;
    }
    await sendMessage();
};

// 应用 AI 建议
const applySuggestion = (suggestion: string) => {
    // 根据建议类型更新简历内容
    // 这里需要根据具体建议类型来实现
    console.log('Applying suggestion:', suggestion);
};

const scrollToBottom = async () => {
    await nextTick();
    if (messageHistory.value) {
        messageHistory.value.scrollTop = messageHistory.value.scrollHeight;
    }
};

const sendMessage = async () => {
    if (!userInput.value.trim() || isLoading.value) return;

    // 只在 prompt 里拼接简历信息，不在 UI 显示
    let prompt = userInput.value.trim();
    if (currentMode.value === 'resume') {
        prompt = `以下是我的简历信息：\n` +
            `个人信息：${JSON.stringify(resumeStore.personal)}\n` +
            `技能：${JSON.stringify(resumeStore.skills)}\n` +
            `教育背景：${JSON.stringify(resumeStore.education)}\n` +
            `经历：${JSON.stringify(resumeStore.experiences)}\n` +
            `自我评价：${resumeStore.selfEvaluation}\n` +
            `请根据上述简历信息，${userInput.value.trim()}`;
    } else if (currentMode.value === 'interview') {
        prompt = `你现在是面试官，面试者的简历信息如下：\n` +
            `个人信息：${JSON.stringify(resumeStore.personal)}\n` +
            `技能：${JSON.stringify(resumeStore.skills)}\n` +
            `教育背景：${JSON.stringify(resumeStore.education)}\n` +
            `经历：${JSON.stringify(resumeStore.experiences)}\n` +
            `自我评价：${resumeStore.selfEvaluation}\n` +
            `请根据这些信息，${userInput.value.trim()}`;
    }

    // UI 只显示用户输入
    const userMessage = {
        role: 'user' as const,
        content: userInput.value.trim()
    };
    messages.value.push(userMessage);
    userInput.value = '';
    await scrollToBottom();

    isLoading.value = true;

    try {
        // 只把 prompt 传给 AI，不显示在 UI
        const hiddenMessages = messages.value
            .map(({ role, content }) => ({ role, content })) // 只保留 role 和 content
            .slice(0, -1)
            .concat([{ role: 'user' as const, content: prompt }]);
        await sendToQwenAIDialogue(
            hiddenMessages,
            (responseText, isComplete) => {
                if (isComplete) {
                    const suggestions = extractSuggestions(responseText);
                    messages.value.push({
                        role: 'assistant',
                        content: responseText,
                        suggestions
                    });
                    isLoading.value = false;
                    scrollToBottom();
                }
            }
        );
    } catch (error) {
        messages.value.push({
            role: 'assistant',
            content: '抱歉，处理您的请求时出现错误。'
        });
        isLoading.value = false;
        await scrollToBottom();
    }
};

// 从 AI 响应中提取建议
const extractSuggestions = (text: string): string[] | undefined => {
    // 这里可以实现建议提取逻辑
    // 例如，查找特定格式的建议文本
    return undefined;
};

onMounted(() => {
    switchMode('resume');
});
</script>

<style scoped>
.agent-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.mode-selector {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: center;
}

.mode-btn {
    padding: 10px 20px;
    border: 2px solid #007bff;
    background: white;
    color: #007bff;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
}

.mode-btn.active {
    background: #007bff;
    color: white;
}

.chat-container {
    display: flex;
    flex-direction: column;
    height: 80vh;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
}

.message-history {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background-color: #f5f5f5;
}

.message {
    margin-bottom: 15px;
    max-width: 80%;
}

.user-message {
    margin-left: auto;
}

.ai-message {
    margin-right: auto;
}

.message-content {
    padding: 10px 15px;
    border-radius: 15px;
    background-color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.suggestions {
    margin-top: 10px;
    border-top: 1px solid #eee;
    padding-top: 10px;
}

.suggestion-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 5px 0;
}

.suggestion-item button {
    padding: 4px 8px;
    font-size: 12px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.quick-actions {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    flex-wrap: wrap;
}

.quick-actions button {
    padding: 5px 10px;
    font-size: 12px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.user-message .message-content {
    background-color: #007bff;
    color: white;
}

.input-area {
    display: flex;
    flex-direction: column;
    padding: 15px;
    background-color: white;
    border-top: 1px solid #ddd;
}

input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>