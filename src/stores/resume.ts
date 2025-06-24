import { defineStore } from 'pinia'

export function getInitialState() {
    // Personal Information
    const personal = {
        name: 'Backend Developer',
        gender: 'Male',
        age: '28',
        degree: 'Master of Science',
        phone: '852-6666-6666',
        email: 'john.doe@google.com',
        photo: 'https://s2.loli.net/2022/09/13/PeC3yo16vgpu52j.jpg'
    }
    // IT Skills
    const skills = {
        proficient: [
            'Java',
            'Spring Boot',
            'Python',
            'Django',
            'PostgreSQL',
            'Docker',
            'Kubernetes'
        ],
        familiar: [
            'Go',
            'gRPC',
            'AWS',
            'Redis',
            'Kafka'
        ]
    }
    // Education
    const education = [
        {
            school: 'The University of Hong Kong',
            major: 'Computer Science',
            degree: 'Master',
            score: 'GPA: 3.9/4.0'
        },
        {
            school: 'MIT',
            major: 'Computer Engineering',
            degree: 'Bachelor',
            score: 'GPA: 3.8/4.0'
        }
    ]
    // Work Experience / Projects
    const experiences = [
        {
            type: 'Work Experience',
            name: 'Backend Software Engineer',
            company: 'Google',
            period: '2025.06 - Present',
            content: 'Developed and maintained microservices for a large-scale distributed system using Java and Spring Boot. Designed and implemented RESTful APIs for core product features.',
            result: 'Improved API response time by 40% through query optimization and caching strategies. Led a project to containerize services using Docker and Kubernetes, reducing deployment time by 50%.'
        },
        {
            type: 'Project',
            name: 'Distributed E-commerce Platform',
            company: 'Personal Project',
            period: '2024.09 - 2025.05',
            content: 'Built a backend system for an e-commerce platform with features like user authentication, product management, and order processing, using Python and Django.',
            result: 'Implemented a message queue using RabbitMQ for asynchronous order handling. The project is open-sourced on GitHub with 200+ stars.'
        }
    ]
    // Competitions / Awards / Publications
    const honors = [
        {
            type: 'Competition',
            title: 'ACM Contest',
            date: '2024.05',
            description: 'Won a silver medal in the regional finals, solving complex algorithmic problems under pressure.'
        },
        {
            type: 'Publication',
            title: 'A Scalable Architecture for Real-time Data Processing',
            date: '2024.03',
            description: 'Published a paper in a university journal detailing a system built with Kafka and Flink.'
        },
        {
            type: 'Award',
            title: 'Dean\'s List for Academic Excellence',
            date: '2024.12',
            description: 'Recognized for outstanding academic performance in the Computer Science department.'
        }
    ]
    // Self-Evaluation
    const selfEvaluation = 'A passionate backend developer with a strong interest in building scalable and reliable distributed systems. Proficient in Java, Python, and modern backend frameworks. Experienced in microservices architecture, containerization, and cloud technologies. A quick learner and a collaborative team player, eager to tackle challenging problems and contribute to innovative projects.'

    return {
        personal,
        skills,
        education,
        experiences,
        honors,
        selfEvaluation
    }
}

function getEmptyState() {
    return {
        personal: {
            name: '',
            gender: '',
            email: '',
            age: '',
            phone: '',
            degree: '',
            photo: ''
        },
        skills: {
            proficient: [],
            familiar: []
        },
        education: [],
        experiences: [],
        honors: [],
        selfEvaluation: ''
    }
}

export const useResumeStore = defineStore('resume', {
    state: () => getInitialState(),
    getters: {
        getResume(state): ReturnType<typeof getInitialState> {
            return state;
        }
    },
    actions: {
        updateResume(newResume: any) {
            Object.assign(this, newResume)
        },
        clearResumeData() {
            Object.assign(this, structuredClone(getEmptyState()));
        },
        resetResumeToInitial() {
            Object.assign(this, structuredClone(getInitialState()));
        },
        addEducation() {
            this.education.push({ school: '', major: '', degree: '', score: '' });
        },
        removeEducation(idx: number) {
            this.education.splice(idx, 1);
        },

        addExperience() {
            this.experiences.push({ type: 'Internship', name: '', company: '', period: '', content: '', result: '' });
        },
        removeExperience(idx: number) {
            this.experiences.splice(idx, 1);
        },

        addHonor() {
            this.honors.push({ type: '', title: '', date: '', description: '' });
        },
        removeHonor(idx: number) {
            this.honors.splice(idx, 1);
        },


    }
})

async function translateBatch(texts: string[], target = 'en'): Promise<string[]> {
    const apiKey = 'AIzaSyD0XBD2m-vvfmpl4UhZdt9lk2rHCxfRHrQ';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: texts, target })
    });
    const data = await res.json();
    return data.data.translations.map((t: any) => t.translatedText);
}

