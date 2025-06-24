# 主要记录简历相关功能的实现和使用方法

# 简历保存功能实现

## 功能概述

本功能实现了用户登录后的简历编辑、保存和加载功能，将简历信息分块存储到数据库中。

## 实现的功能

### 1. 简历数据管理
- **数据结构**：完整的简历信息，包括个人信息、技能、教育背景、项目经历、获奖情况和自我评价
- **状态管理**：使用Pinia store管理简历数据状态
- **响应式更新**：实时更新简历预览

### 2. 保存功能
- **保存按钮**：在简历编辑页面顶部添加了"保存简历"按钮
- **表单验证**：检查必填字段（姓名、邮箱）
- **API调用**：发送POST请求到 `/api/resume/save` 端点
- **错误处理**：显示具体的错误信息
- **加载状态**：保存过程中显示加载动画

### 3. 加载功能
- **加载按钮**：添加了"加载简历"按钮
- **数据恢复**：从数据库加载之前保存的简历信息
- **错误处理**：处理404错误（用户首次使用）和其他错误
- **状态管理**：自动更新store中的数据

### 4. 用户权限控制
- **登录检查**：只有登录用户才能保存和加载简历
- **未登录提示**：显示警告信息引导用户登录
- **路由保护**：简历编辑页面需要登录才能访问

## 技术实现

### 1. API服务 (`src/services/resume.ts`)
```typescript
export const resumeApi = {
  // 保存简历信息
  async saveResume(resumeData: ResumeData) {
    const response = await http.post('/api/resume/save', resumeData)
    return response.data
  },

  // 获取用户简历信息
  async getResume() {
    const response = await http.get('/api/resume/get')
    return response.data
  },

  // 更新简历信息
  async updateResume(resumeData: ResumeData) {
    const response = await http.put('/api/resume/update', resumeData)
    return response.data
  }
}
```

### 2. 简历表单组件 (`src/views/ResumeForm.vue`)
- 添加了保存和加载按钮
- 实现了表单验证
- 集成了错误处理和用户提示
- 添加了登录状态检查

### 3. 路由配置 (`src/router/index.ts`)
- 简历编辑页面设置为需要登录访问
- 未登录用户会被重定向到首页并显示登录模态框

## 数据结构

### 简历数据接口
```typescript
export interface ResumeData {
  personal: {
    name: string
    gender: string
    age: string
    degree: string
    phone: string
    email: string
    photo: string
  }
  skills: {
    proficient: string[]
    familiar: string[]
  }
  education: Array<{
    school: string
    major: string
    degree: string
    score: string
  }>
  experiences: Array<{
    type: string
    name: string
    company: string
    period: string
    content: string
    result: string
  }>
  honors: Array<{
    type: string
    title: string
    date: string
    description: string
  }>
  selfEvaluation: string
}
```

## API接口规范

### 保存简历
```
POST /api/resume/save
Content-Type: application/json
Authorization: Bearer <token>

{
  "personal": { ... },
  "skills": { ... },
  "education": [ ... ],
  "experiences": [ ... ],
  "honors": [ ... ],
  "selfEvaluation": "..."
}
```

### 获取简历
```
GET /api/resume/get
Authorization: Bearer <token>
```

### 更新简历
```
PUT /api/resume/update
Content-Type: application/json
Authorization: Bearer <token>

{
  "personal": { ... },
  "skills": { ... },
  "education": [ ... ],
  "experiences": [ ... ],
  "honors": [ ... ],
  "selfEvaluation": "..."
}
```

## 使用方法

### 1. 用户登录
1. 访问首页，点击"登录"按钮
2. 填写邮箱和密码
3. 登录成功后可以访问简历编辑页面

### 2. 编辑简历
1. 点击导航栏中的"简历编辑"或直接访问 `/resume` 路径
2. 填写个人信息、技能、教育背景等
3. 实时查看右侧的简历预览

### 3. 保存简历
1. 确保填写了必填字段（姓名、邮箱）
2. 点击"保存简历"按钮
3. 等待保存完成，查看成功提示

### 4. 加载简历
1. 点击"加载简历"按钮
2. 系统会从数据库加载之前保存的数据
3. 如果是首次使用，会提示用户先保存简历

## 错误处理

### 常见错误及解决方案

1. **"请先登录"错误**
   - 原因：用户未登录
   - 解决：点击登录按钮完成登录

2. **"请填写姓名和邮箱"错误**
   - 原因：必填字段未填写
   - 解决：填写个人信息中的姓名和邮箱字段

3. **"保存失败"错误**
   - 原因：网络问题或服务器错误
   - 解决：检查网络连接，重试保存

4. **"您还没有保存过简历"提示**
   - 原因：用户首次使用
   - 解决：先填写简历信息并保存

## 后端实现建议

### 数据库设计
建议将简历数据分块存储：

1. **用户表**：存储用户基本信息
2. **简历个人信息表**：存储个人基本信息
3. **简历技能表**：存储技能信息
4. **简历教育表**：存储教育背景（一对多）
5. **简历经历表**：存储项目/实习经历（一对多）
6. **简历荣誉表**：存储获奖/论文信息（一对多）
7. **简历评价表**：存储自我评价

### API实现要点
1. 验证用户token
2. 实现数据分块存储
3. 提供完整的CRUD操作
4. 实现数据关联查询
5. 添加适当的错误处理

## 注意事项

1. **数据安全**：确保只有用户本人能访问自己的简历数据
2. **数据完整性**：保存时验证数据格式和必填字段
3. **用户体验**：提供清晰的错误提示和加载状态
4. **性能优化**：考虑大数据量时的分页加载
5. **数据备份**：考虑定期备份用户简历数据

## 扩展功能建议

1. **简历模板**：提供多种简历模板选择
2. **简历导出**：支持PDF、Word等格式导出
3. **简历分享**：生成分享链接
4. **版本管理**：支持简历版本历史
5. **AI优化**：提供简历内容优化建议

## 头像上传与展示（sm.ms 图床）

### 功能描述

- 用户可在简历编辑页面上传个人照片，照片将托管在 sm.ms 图床，并在简历预览中实时展示。

### 实现流程

1. **前端上传**：用户选择图片后，前端将图片文件通过 POST 请求上传到后端 `/api/upload` 接口。
2. **后端代理**：后端收到图片后，将其转发上传到 sm.ms 图床（需配置 sm.ms token），并将返回的图片 URL 传回前端。
3. **简历数据保存**：前端将图片 URL 存入简历数据的 `personal.photo` 字段，随简历一同保存。

### 前端代码片段

```typescript
// 上传图片到后端代理接口
async function uploadPhoto(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('smfile', file);
  const response = await http.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  // 返回图片 URL
  return response.data.data.url;
}
```

- 上传成功后，将图片 URL 赋值到 `resume.personal.photo` 字段，并在简历预览中通过 `<img :src="resume.personal.photo" />` 展示。

### 后端代理说明

- 由于 sm.ms 不支持浏览器直接跨域上传，需由后端实现 `/api/upload` 接口，将图片转发到 sm.ms 并返回图片 URL。
- 后端需配置 sm.ms token，并处理 sm.ms API 的响应和错误。

### 错误处理

- 上传失败时，前端会显示错误提示（如"图片上传失败，请重试"）。
- 后端需处理 sm.ms 返回的错误信息，并返回友好提示。 

const beforePhotoUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file) // 这里用 file 字段，后端也用 file 字段接收

    try {
        // 假设你的后端接口为 /api/upload
        const res = await axios.post('http://127.0.0.1:8000/api/resume/photoUpload', formData, {
            headers: {
                // 不要加 Content-Type，axios 会自动设置 multipart/form-data
            }
        })
        // 假设后端返回 { url: '图片地址' }
        if (res.data && res.data.url) {
            resume.personal.photo = res.data.url
            ElMessage.success('图片上传成功！')
        } else {
            ElMessage.error(res.data.message || '图片上传失败')
        }
    } catch (err: any) {
        ElMessage.error('图片上传失败: ' + (err?.message || '未知错误'))
    }
    return false // 阻止 element-plus 自动上传
}