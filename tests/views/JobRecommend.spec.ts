import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import JobRecommend from '../../src/components/JobRecommend.vue';

// Mock ElMessage
vi.mock('element-plus', () => ({
    ElMessage: {
        info: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        success: vi.fn(),
    }
}));
import { ElMessage } from 'element-plus';

// mock resumeApi
vi.mock('../../src/services/resume', () => ({
    resumeApi: {
        getResume: vi.fn()
    }
}))
import { resumeApi } from '../../src/services/resume'
const mockedResumeApi = vi.mocked(resumeApi, true)

// mock fetch (for translateBatch)
globalThis.fetch = vi.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                data: {
                    translations: [
                        { translatedText: 'Frontend Developer' },
                        { translatedText: 'Tech Co' },
                        { translatedText: 'Shanghai' },
                        { translatedText: '20k-30k' },
                        { translatedText: 'You have strong Vue experience.' },
                        { translatedText: 'Develop frontend apps.' },
                        { translatedText: 'Vue' },
                        { translatedText: 'JavaScript' }
                    ]
                }
            })
    })
) as any;

// mock jobApi
vi.mock('../../src/services/jobApi', () => ({
    jobApi: {
        getJobRecommendations: vi.fn()
    }
}))
import { jobApi } from '../../src/services/jobApi'
const mockedJobApi = vi.mocked(jobApi, true)

describe('JobRecommend.vue', () => {
    const mockJobs = [
        {
            id: 1,
            title: 'Frontend Developer',
            company: 'Tech Co',
            location: 'Shanghai',
            salary: '20k-30k',
            matchScore: 90,
            tags: ['Vue', 'JavaScript'],
            reason: 'You have strong Vue experience.',
            description: 'Develop frontend apps.'
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        // 默认有简历
        mockedResumeApi.getResume.mockResolvedValue({ personal: { name: 'Tom' }, education: [{}], experiences: [{}] })
    });

    it('jobApi.getJobRecommendations 正常返回，断言 recommendedJobs', async () => {
        mockedJobApi.getJobRecommendations.mockResolvedValueOnce([...mockJobs]);
        const wrapper = mount(JobRecommend, {
            global: { plugins: [createTestingPinia({ stubActions: false, createSpy: vi.fn })] }
        });
        await flushPromises();
        expect(wrapper.findAll('.job-card')).toHaveLength(1);
        expect(wrapper.text()).toContain('Frontend Developer');
    });

    it('jobApi.getJobRecommendations 返回空数组，断言 UI 显示 el-empty', async () => {
        mockedJobApi.getJobRecommendations.mockResolvedValueOnce([]);
        const wrapper = mount(JobRecommend, {
            global: {
                plugins: [createTestingPinia({ stubActions: false, createSpy: vi.fn })],
                stubs: {
                    ElEmpty: {
                        template: '<div data-test="el-empty-stub"></div>'
                    }
                }
            }
        });
        await flushPromises();
        expect(wrapper.find('[data-test="el-empty-stub"]').exists()).toBe(true);
        expect(ElMessage.info).toHaveBeenCalled();
    });

    it('jobApi.getJobRecommendations 报错，断言 ElMessage.error 被调用，recommendedJobs 为空', async () => {
        mockedJobApi.getJobRecommendations.mockRejectedValueOnce(new Error('API Error'));
        const wrapper = mount(JobRecommend, {
            global: { plugins: [createTestingPinia({ stubActions: false, createSpy: vi.fn })] }
        });
        await flushPromises();
        expect(ElMessage.error).toHaveBeenCalled();
        expect(wrapper.findAll('.job-card')).toHaveLength(0);
    });

    it('loading 状态下 UI，断言 loading 时的提示文本', async () => {
        mockedJobApi.getJobRecommendations.mockImplementation(() => new Promise(() => { }));
        const wrapper = mount(JobRecommend, {
            global: { plugins: [createTestingPinia({ stubActions: false, createSpy: vi.fn })] }
        });
        expect(wrapper.text()).toContain('Generating personalized job recommendations...');
    });

    it('推荐岗位卡片渲染，断言岗位卡片内容、数量', async () => {
        mockedJobApi.getJobRecommendations.mockResolvedValueOnce([...mockJobs]);
        const wrapper = mount(JobRecommend, {
            global: { plugins: [createTestingPinia({ stubActions: false, createSpy: vi.fn })] }
        });
        await flushPromises();
        const cards = wrapper.findAll('.job-card');
        expect(cards).toHaveLength(1);
        expect(cards[0].text()).toContain('Frontend Developer');
        expect(cards[0].text()).toContain('Tech Co');
        expect(cards[0].text()).toContain('Shanghai');
        expect(cards[0].text()).toContain('20k-30k');
        expect(cards[0].text()).toContain('90% Match');
    });

    it('点击岗位卡片弹出抽屉，断言抽屉内容、visible 状态', async () => {
        mockedJobApi.getJobRecommendations.mockResolvedValueOnce([...mockJobs]);
        const wrapper = mount(JobRecommend, {
            global: { plugins: [createTestingPinia({ stubActions: false, createSpy: vi.fn })] }
        });
        await flushPromises();
        const card = wrapper.find('.job-card');
        await card.trigger('click');
        await flushPromises();
        expect(wrapper.text()).toContain('Frontend Developer');
    });

    it('无简历时提示保存简历', async () => {
        mockedResumeApi.getResume.mockResolvedValueOnce({});
        const wrapper = mount(JobRecommend, {
            global: { plugins: [createTestingPinia({ stubActions: false, createSpy: vi.fn })] }
        });
        await flushPromises();
        expect(ElMessage.warning).toHaveBeenCalledWith('Please save your resume first before getting job recommendations.');
        expect(wrapper.findAll('.job-card')).toHaveLength(0);
    });
});