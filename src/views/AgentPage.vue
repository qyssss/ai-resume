<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <!-- 动态渐变背景 -->
        <div class="gradient-bg absolute top-0 left-0 w-full h-full -z-10"></div>

        <!-- 页面头部 -->
        <div class="relative pt-8 pb-6">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- 标题区域 -->
                <div class="text-center mb-8">
                    <h1 class="text-4xl md:text-5xl font-bold mb-4">
                        <span class="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                            AI Assistant
                        </span>
                    </h1>
                    <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                        Let AI optimize your resume content or conduct professional mock interviews.
                    </p>
                </div>

                <!-- 功能选择区域 -->
                <div class="flex justify-center mb-8">
                    <div class="bg-gray-800/50 backdrop-blur-sm p-2 rounded-2xl border border-gray-700">
                        <button :class="[
                            'px-8 py-3 rounded-xl font-medium transition-all duration-300',
                            currentMode === 'resume'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                                : 'text-gray-600 hover:text-white hover:bg-gray-700/50',
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        ]" @click="switchMode('resume')" :disabled="isLoading">
                            <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Resume Optimization</span>
                            </div>
                        </button>
                        <button :class="[
                            'px-8 py-3 rounded-xl font-medium transition-all duration-300',
                            currentMode === 'interview'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                                : 'text-gray-600 hover:text-white hover:bg-gray-700/50',
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        ]" @click="switchMode('interview')" :disabled="isLoading">
                            <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>Mock Interview</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 聊天区域 -->
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
                <!-- 聊天消息区域 -->
                <div ref="messageHistory"
                    class="h-[60vh] overflow-y-auto p-6 bg-gradient-to-b from-gray-900/50 to-gray-800/50">
                    <div v-for="(message, index) in messages" :key="index" :class="[
                        'mb-6 flex',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                    ]">
                        <div :class="[
                            'max-w-[80%] lg:max-w-[70%]',
                            message.role === 'user' ? 'order-2' : 'order-1'
                        ]">
                            <!-- 用户头像 -->
                            <div v-if="message.role === 'assistant'" class="flex items-center mb-2">
                                <div
                                    class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-3">
                                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <span class="text-sm text-gray-400">{{ (isLoading && index === messages.length - 1) ?
                                    'Generating...' : 'AI Assistant' }}</span>
                            </div>

                            <!-- 消息内容 -->
                            <div :class="[
                                'px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm',
                                message.role === 'user'
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                    : 'bg-gray-700/80 text-gray-100 border border-gray-600'
                            ]">
                                <Markdown :source="message.content" class="prose prose-invert max-w-none" />

                                <!-- loading animation -->
                                <div v-if="isLoading && index === messages.length - 1 && !message.content" class="mt-2">
                                    <div class="flex space-x-2">
                                        <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                        <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                                            style="animation-delay: 0.1s"></div>
                                        <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                            style="animation-delay: 0.2s"></div>
                                    </div>
                                </div>

                                <!-- AI建议区域 -->
                                <div v-if="message.role === 'assistant' && message.suggestions"
                                    class="mt-4 pt-4 border-t border-gray-600 space-y-3">
                                    <div v-for="(suggestion, idx) in message.suggestions" :key="idx"
                                        class="flex items-center space-x-3 p-3 bg-gray-600/50 rounded-xl">
                                        <button
                                            class="px-3 py-1.5 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md"
                                            @click="applySuggestion(suggestion)">
                                            Apply Suggestion
                                        </button>
                                        <span class="text-sm text-gray-200">{{ suggestion }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 用户标识 -->
                            <div v-if="message.role === 'user'" class="flex items-center justify-end mt-2">
                                <span class="text-sm text-gray-400 mr-3">You</span>
                                <div
                                    class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 输入区域 -->
                <div class="p-6 bg-gray-800/80 border-t border-gray-700">
                    <!-- 快速操作按钮 -->
                    <div v-if="currentMode === 'resume'" class="flex flex-wrap gap-3 mb-4">
                        <button v-for="action in resumeQuickActions" :key="action.key" @click="quickAction(action.key)"
                            class="px-4 py-2 text-sm bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 rounded-xl border border-gray-600 hover:border-gray-500 transition-all duration-200 hover:shadow-md">
                            {{ action.label }}
                        </button>
                    </div>
                    <div v-if="currentMode === 'interview'" class="flex flex-wrap gap-3 mb-4">
                        <button v-for="action in interviewQuickActions" :key="action.key"
                            @click="quickAction(action.key)"
                            class="px-4 py-2 text-sm bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 rounded-xl border border-gray-600 hover:border-gray-500 transition-all duration-200 hover:shadow-md">
                            {{ action.label }}
                        </button>
                    </div>

                    <!-- 输入框和发送按钮 -->
                    <div class="flex space-x-4">
                        <div class="flex-1 relative">
                            <input v-model="userInput" @keyup.enter="sendMessage"
                                :placeholder="currentMode === 'resume' ? 'Enter the resume content you want to optimize...' : 'Answer the interview question...'"
                                :disabled="isLoading"
                                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50" />
                        </div>
                        <button @click="sendMessage" :disabled="isLoading || !userInput.trim()"
                            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                            <div class="flex items-center space-x-2">
                                <svg v-if="!isLoading" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
import { ref, onMounted, nextTick } from 'vue';
import type { DialogueHistory } from '../types/aiDialogue';
import { sendToQwenAIDialogue } from '../api/qWen';
import { useResumeStore } from '../stores/resume';
import Markdown from 'vue3-markdown-it'

const resumeStore = useResumeStore();
const resumeMessages = ref<DialogueHistory>([{
    role: 'assistant',
    content: 'I am your resume optimization assistant. What part of your resume would you like to optimize?'
}]);
const interviewMessages = ref<DialogueHistory>([{
    role: 'assistant',
    content: 'I am your interviewer. Are you ready to start the interview?'
}]);
const messages = ref<DialogueHistory>(resumeMessages.value);
const userInput = ref('');
const isLoading = ref(false);
const messageHistory = ref<HTMLElement | null>(null);
const currentMode = ref<'resume' | 'interview'>('resume');

// 快速操作配置
const resumeQuickActions = [
    { key: 'optimizeSkills', label: 'Optimize Skills' },
    { key: 'optimizeExperience', label: 'Optimize Experience' },
    { key: 'optimizeSelfEval', label: 'Optimize Self-Evaluation' },
    { key: 'addKeywords', label: 'Add Keywords' },
    { key: 'improveFormat', label: 'Improve Formatting' }
];

const interviewQuickActions = [
    { key: 'startInterview', label: 'Start Interview' },
    { key: 'nextQuestion', label: 'Next Question' },
    { key: 'endInterview', label: 'End Interview' },
    { key: 'practiceBehavioral', label: 'Behavioral Questions' },
    { key: 'technicalQuestions', label: 'Technical Questions' }
];

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
            userInput.value = 'Optimize my skills description';
            break;
        case 'optimizeExperience':
            userInput.value = 'Optimize my project experience';
            break;
        case 'optimizeSelfEval':
            userInput.value = 'Optimize my self-evaluation';
            break;
        case 'addKeywords':
            userInput.value = 'Add relevant keywords to my resume';
            break;
        case 'improveFormat':
            userInput.value = 'Improve my resume\'s format and layout';
            break;
        case 'startInterview':
            userInput.value = 'Start the mock interview';
            break;
        case 'nextQuestion':
            userInput.value = 'Next question';
            break;
        case 'endInterview':
            userInput.value = 'End the interview';
            break;
        case 'practiceBehavioral':
            userInput.value = 'I want to practice behavioral interview questions';
            break;
        case 'technicalQuestions':
            userInput.value = 'I want to practice technical interview questions';
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

const typewriterEffect = (text: string, targetIndex: number) => {
    let currentIndex = 0;
    const interval = setInterval(() => {
        if (currentIndex < text.length) {
            messages.value[targetIndex].content = text.slice(0, currentIndex + 1);
            currentIndex++;
            scrollToBottom();
        } else {
            clearInterval(interval);
        }
    }, 30); // 调整速度
};

const sendMessage = async () => {
    if (!userInput.value.trim() || isLoading.value) return;

    // 只在 prompt 里拼接简历信息，不在 UI 显示
    let prompt = userInput.value.trim();
    if (currentMode.value === 'resume') {
        // 针对自我评价优化
        if (userInput.value.toLowerCase().includes('self-evaluation')) {
            prompt = `
Here are some examples of how to optimize a self-evaluation:

Example 1:
Original: I am hardworking and responsible.
Analysis: The statement is too general and lacks specific achievements.
Improved: I am a dedicated software engineer with a proven track record of delivering high-quality projects on time. My strong problem-solving skills and attention to detail have contributed to successful team outcomes.

Example 2:
Original: I have good communication skills.
Analysis: The statement is vague and does not provide evidence.
Improved: I have demonstrated excellent communication skills by leading cross-functional meetings and presenting project results to stakeholders.

Now, here is my self-evaluation: ${resumeStore.selfEvaluation}
Please analyze it and provide an improved version in English, following the example above.
            `.trim();
        } else if (userInput.value.toLowerCase().includes('skills')) {
            // 针对技能优化
            prompt = `
Here is my skills section: ${JSON.stringify(resumeStore.skills)}

Please analyze the strengths and weaknesses of my skills section, and then provide an improved version in English. 
First, list the strengths and weaknesses. 
Then, suggest specific improvements. 
Finally, provide the improved skills section.
            `.trim();
        } else if (userInput.value.toLowerCase().includes('experience')) {
            // 针对项目/经历优化
            prompt = `
Here is my experience section: ${JSON.stringify(resumeStore.experiences)}

Please analyze the strengths and weaknesses of my experience section, and then provide an improved version in English. 
First, list the strengths and weaknesses. 
Then, suggest specific improvements. 
Finally, provide the improved experience section.
            `.trim();
        } else {
            // 默认COT
            prompt = `Here is my resume information:\n` +
                `Personal Information: ${JSON.stringify(resumeStore.personal)}\n` +
                `Skills: ${JSON.stringify(resumeStore.skills)}\n` +
                `Education: ${JSON.stringify(resumeStore.education)}\n` +
                `Experience: ${JSON.stringify(resumeStore.experiences)}\n` +
                `Self-evaluation: ${resumeStore.selfEvaluation}\n` +
                `Based on the resume information above, please analyze the strengths and weaknesses step by step, and then provide specific suggestions for improvement. Please reply in English.`;
        }
    } else if (currentMode.value === 'interview') {
        // 面试模式可加COT
        prompt = `You are now an interviewer. The candidate's resume information is as follows:\n` +
            `Personal Information: ${JSON.stringify(resumeStore.personal)}\n` +
            `Skills: ${JSON.stringify(resumeStore.skills)}\n` +
            `Education: ${JSON.stringify(resumeStore.education)}\n` +
            `Experience: ${JSON.stringify(resumeStore.experiences)}\n` +
            `Self-evaluation: ${resumeStore.selfEvaluation}\n` +
            `Please ask interview questions one by one, and after each answer, provide feedback and suggestions for improvement. Please reply in English.`;
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
        const hiddenMessages = messages.value
            .map(({ role, content }) => ({ role, content }))
            .slice(0, -1)
            .concat([{ role: 'user' as const, content: prompt }]);

        // 添加一个临时的 assistant 消息用于流式显示
        const tempMessageIndex = messages.value.length;
        messages.value.push({
            role: 'assistant',
            content: '',
            suggestions: undefined
        });

        await sendToQwenAIDialogue(
            hiddenMessages,
            (responseText, isComplete) => {
                // 直接更新内容，不使用打字机效果
                messages.value[tempMessageIndex].content = responseText;
                if (isComplete) {
                    messages.value[tempMessageIndex].suggestions = extractSuggestions(responseText);
                    isLoading.value = false;
                }
                scrollToBottom();
            }
        );
    } catch (error) {
        const errorIndex = messages.value.length - 1;
        messages.value[errorIndex] = {
            role: 'assistant',
            content: 'Sorry, an error occurred while processing your request.'
        };
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

/* 自定义滚动条样式 */
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

/* 消息动画 */
.mb-6 {
    animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 按钮悬停效果 */
button:hover {
    transform: translateY(-1px);
}

/* 禁用状态样式 */
button:disabled {
    transform: none !important;
    pointer-events: none;
}

button:disabled:hover {
    transform: none !important;
}

/* 输入框焦点效果 */
input:focus {
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
    .max-w-\[80\%\] {
        max-width: 90%;
    }

    .lg\:max-w-\[70\%\] {
        max-width: 90%;
    }
}
</style>