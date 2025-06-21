<template>
    <div class="bg-gray-900 text-gray-100 min-h-screen">
        <div class="gradient-bg absolute top-0 left-0 w-full h-[500px] -z-10"></div>
        <main class="pt-24 pb-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center py-16">
                    <h1 class="text-5xl md:text-6xl font-bold leading-tight mb-6">
                        <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">Success
                            Stories</span>
                    </h1>
                    <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                        See how professionals from various fields transformed their careers with an AI-optimized resume.
                    </p>
                </div>

                <!-- Case Studies Grid -->
                <section class="py-20">
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div v-for="study in caseStudies" :key="study.name"
                            class="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 flex flex-col">
                            <div class="flex-grow">
                                <div class="flex items-center mb-4">
                                    <img :src="study.avatar" :alt="study.name"
                                        class="w-12 h-12 rounded-full mr-4 border-2 border-purple-400">
                                    <div>
                                        <h3 class="font-bold text-lg">{{ study.name }}</h3>
                                        <p class="text-sm text-gray-400">{{ study.role }}</p>
                                    </div>
                                </div>
                                <p class="text-gray-300 italic mb-6">"{{ study.quote }}"</p>
                                <div class="space-y-4">
                                    <div>
                                        <h4 class="font-semibold text-green-400 mb-1">Result</h4>
                                        <p class="text-gray-300">{{ study.result }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    </div>
</template>

<script setup>
const caseStudies = [
    {
        name: 'Sarah L.',
        role: 'Marketing Manager',
        avatar: 'https://randomuser.me/api/portraits/women/48.jpg',
        quote: 'The AI suggestions helped me highlight my achievements with data, which made a huge difference. I landed a senior role at a top tech company!',
        result: 'Increased interview callbacks by 400% and secured a Senior Marketing Manager position.'
    },
    {
        name: 'Michael B.',
        role: 'Software Engineer',
        avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
        quote: 'As a developer, I struggled with writing compelling job descriptions. ResumeAI translated my technical work into business impact perfectly.',
        result: 'Passed the ATS screening for 95% of applications and got a job at a FAANG company.'
    },
    {
        name: 'Jessica T.',
        role: 'Recent Graduate (UX Design)',
        avatar: 'https://randomuser.me/api/portraits/women/71.jpg',
        quote: 'I had no professional experience, but the AI helped me focus on my project work and skills. It gave me the confidence to apply for my dream internship.',
        result: 'Secured a competitive paid internship at a leading design agency.'
    },
];
</script>

<style scoped>
.gradient-bg {
    background: linear-gradient(-45deg, #111827, #164e63, #374151);
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
</style>