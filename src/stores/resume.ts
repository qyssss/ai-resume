import { defineStore } from 'pinia'

export const useResumeStore = defineStore('resume', {
    state: () => ({
        // 个人信息
        personal: {
            name: '张三',
            gender: '男',
            age: '25',
            degree: '硕士',
            phone: '13800138000',
            email: 'zhangsan@example.com',
            photo: ''
        },
        // IT技能
        skills: {
            proficient: [
                'Vue.js',
                'TypeScript',
                'Node.js',
                'Git'
            ],
            familiar: [
                'React',
                'Python',
                'Docker',
                'MongoDB'
            ]
        },
        // 教育背景
        education: [
            {
                school: '香港大学',
                major: '计算机科学',
                degree: '硕士',
                score: 'GPA: 3.8/4.0'
            },
            {
                school: '北京大学',
                major: '软件工程',
                degree: '学士',
                score: 'GPA: 3.7/4.0'
            }
        ],
        // 项目/实习经历
        experiences: [
            {
                type: '实习',
                name: '前端开发工程师',
                company: '腾讯科技',
                period: '2023.06 - 2023.09',
                content: '负责公司核心产品的前端开发，使用 Vue.js 和 TypeScript 开发新功能，优化用户体验。',
                result: '成功优化了产品性能，页面加载速度提升 30%，获得团队优秀实习生称号。'
            },
            {
                type: '项目',
                name: '智能简历系统',
                company: '个人项目',
                period: '2023.03 - 2023.05',
                content: '使用 Vue 3 + TypeScript 开发的在线简历制作系统，支持 AI 辅助写作和智能排版。',
                result: '项目获得学校创新大赛二等奖，GitHub 获得 100+ stars。'
            }
        ],
        // 竞赛/获奖/论文
        honors: [
            {
                type: '竞赛',
                title: '全国大学生计算机设计大赛',
                date: '2023.05',
                description: '获得省级一等奖，负责前端开发部分。'
            },
            {
                type: '论文',
                title: '基于 Vue 3 的企业级应用开发实践',
                date: '2023.03',
                description: '发表在校级学术期刊，探讨了 Vue 3 在企业级应用中的最佳实践。'
            },
            {
                type: '获奖',
                title: '优秀学生干部',
                date: '2022.12',
                description: '因在学生会工作中的突出表现获得校级表彰。'
            }
        ],
        // 自我评价
        selfEvaluation: '热爱编程，对前端开发有浓厚兴趣。熟练掌握 Vue.js、TypeScript 等现代前端技术栈，具有良好的代码风格和团队协作能力。在校期间积极参与各类技术竞赛和项目开发，有较强的学习能力和解决问题的能力。期待在未来的工作中不断成长，为团队创造价值。'
    }),
    actions: {
        // 可根据需要添加增删改方法
    }
})