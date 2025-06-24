<template>
    <div class="bg-gray-900 text-gray-100 min-h-screen">
        <div class="gradient-bg absolute top-0 left-0 w-full h-[500px] -z-10"></div>
        <main class="pt-24 pb-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center py-16">
                    <h1 class="text-5xl md:text-6xl font-bold leading-tight mb-6">
                        <span
                            class="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Application
                            Features</span>
                    </h1>
                    <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                        We provide a complete set of tools to help you build the perfect resume and land your dream job.
                    </p>
                </div>

                <!-- Detailed Features Section -->
                <section class="py-20">
                    <div class="space-y-24">
                        <div v-for="(feature, index) in detailedFeatures" :key="feature.title"
                            class="flex flex-col md:flex-row items-center gap-16"
                            :class="[index % 2 !== 0 ? 'md:flex-row-reverse' : '']">
                            <div class="md:w-5/12">
                                <div class="w-16 h-16 rounded-lg mb-6 flex items-center justify-center"
                                    :class="feature.bgColor">
                                    <component :is="feature.icon" class="h-8 w-8" :class="feature.iconColor" />
                                </div>
                                <h2 class="text-3xl font-bold mb-4">{{ feature.title }}</h2>
                                <p class="text-gray-400 mb-6">{{ feature.description }}</p>
                                <ul class="space-y-3">
                                    <li v-for="point in feature.points" :key="point" class="flex items-center">
                                        <svg class="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{{ point }}</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="md:w-7/12">
                                <div
                                    class="bg-gray-800/50 rounded-2xl p-4 border border-gray-700 transition duration-300 transform hover:scale-105">
                                    <img :src="feature.image" :alt="feature.title" class="rounded-lg shadow-2xl">
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CTA Section -->
                <section class="text-center py-20">
                    <h2 class="text-4xl font-bold mb-4">Ready to Get Started?</h2>
                    <p class="text-gray-400 max-w-xl mx-auto mb-8">
                        Create a professional resume that stands out from the crowd.
                    </p>
                    <button @click="navigateToResume"
                        class="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-xl hover:shadow-purple-500/30 transition transform hover:-translate-y-1">
                        Create Your Resume Now →
                    </button>
                </section>
            </div>
        </main>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { SparklesIcon, PencilIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const detailedFeatures = [
    {
        icon: SparklesIcon,
        title: 'Resume Generation',
        description: 'Fill out the form to generate a polished resume with one click, supporting PDF export.',
        points: [
            "Enter information and export PDF",
            "AI-powered content suggestions for job descriptions and skills.",
            "Professionally designed templates.",
            "Generate a resume in minutes, not hours."
        ],
        image: 'https://s2.loli.net/2025/06/24/hvLXGHbQSIKWk5M.png',
        bgColor: 'bg-purple-500/20',
        iconColor: 'text-purple-400'
    },
    {
        icon: PencilIcon,
        title: 'AI Enhancement & Polishing',
        description: 'Enhance your resume with AI-powered suggestions. Our tool analyzes your content and provides targeted improvements to help optimize different sections, strengthen your phrasing, and maintain consistent formatting.',
        points: [
            "Support optimizing different resume parts.",
            "Action verb suggestions to make your achievements sound more impactful.",
            "Improve format and tone with one click.",
            "Ensure consistency in formatting and tone."
        ],
        image: 'https://s2.loli.net/2025/06/21/NEtndoHXCyeKiJg.png',
        bgColor: 'bg-blue-500/20',
        iconColor: 'text-blue-400'

    },
    {
        icon: ChatBubbleLeftEllipsisIcon,
        title: 'Mock Interview',
        description: 'Practice makes perfect. Our AI interviewer asks relevant questions based on your resume and the target job, giving you feedback on your answers.',
        points: [
            "Support uploading your resume PDF.",
            "Huge library of questions for various roles and industries.",
            "Real-time feedback on answer clarity, confidence, and keyword usage.",
            "Practice both behavioral and technical questions."
        ],
        image: 'https://s2.loli.net/2025/06/21/kyljdATpUXQL7fS.png',
        bgColor: 'bg-green-500/20',
        iconColor: 'text-green-400'
    }
]

const navigateToResume = () => {
    router.push('/resume')
}
</script>

<style scoped>
.gradient-bg {
    background: linear-gradient(-45deg, #111827, #1f2937, #374151);
    background-size: 200% 200%;
    animation: gradient 10s ease infinite;
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

img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
}
</style>