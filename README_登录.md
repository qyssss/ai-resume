# 登录注册功能说明

## 功能概述

本项目已集成完整的用户认证系统，包括登录、注册、登出等功能，并与后端API进行对接。

## 功能特性

### 1. 用户注册
- 支持用户名、邮箱、密码注册
- 密码确认验证
- 服务条款同意确认
- 表单验证和错误提示

### 2. 用户登录
- 邮箱密码登录
- 记住登录状态
- 忘记密码链接（待实现）
- 表单验证和错误提示

### 3. 用户状态管理
- 使用Pinia进行状态管理
- 自动保存登录状态到localStorage
- Token管理和自动刷新
- 用户信息持久化

### 4. 安全特性
- HTTP请求拦截器自动添加认证头
- 响应拦截器处理401错误
- Token过期自动登出
- 密码输入框显示/隐藏切换

### 5. 错误处理系统
- 详细的错误信息显示
- 每次请求失败都会显示具体错误原因
- 支持多种错误类型的用户友好提示
- 错误信息自动清除机制

### 6. 路由守卫系统
- 自动保护需要登录的路由
- 未登录用户自动重定向到首页
- 登录成功后自动跳转到原目标页面
- 支持登录状态自动恢复

## 文件结构

```
src/
├── components/
│   └── AuthModal.vue          # 登录注册模态框组件
├── stores/
│   └── user.ts                # 用户状态管理
├── api/
│   └── auth.ts                # 认证API接口
├── utils/
│   └── http.ts                # HTTP客户端工具
├── router/
│   └── index.ts               # 路由配置和守卫
└── views/
    └── HomeView.vue           # 主页面（集成认证功能）
```

## 后端API接口

### 注册接口
- **URL**: `POST /users/register/`
- **请求体**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!",
    "username": "john_doe"
  }
  ```
- **成功响应** (`HTTP 201 Created`):
  ```json
  {
    "message": "User created successfully"
  }
  ```
- **错误响应**:
  - `HTTP 400 Bad Request`: 请求参数错误或邮箱已被注册
    ```json
    {
      "error": "Email already exists"
    }
    ```
  - `HTTP 500 Internal Server Error`: 服务器内部错误

---

### 登录接口
- **URL**: `POST /users/login/`
- **请求体**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!"
  }
  ```
- **成功响应** (`HTTP 200 OK`):
  ```json
  {
    "token": "eyJhbGciOiEF9.6OWYhg4vo2QX...",
    "user_id": "VP3PNEhWD7taXaghAbWk",
    "username": "testuser"
  }
  ```
- **错误响应**:
  - `HTTP 400 Bad Request`: 请求参数错误
    ```json
    {
      "error": "Email and password required"
    }
    ```
  - `HTTP 401 Unauthorized`: 密码错误或用户不存在
    ```json
    {
      "error": "Invalid credentials"
    }
    ```

## 错误处理机制

### 错误信息映射
系统会根据不同的错误情况显示具体的用户友好提示：

#### 登录错误：
- `Invalid credentials` → "邮箱或密码错误"
- `Email and password required` → "请填写邮箱和密码"
- `401` → "认证失败，请检查邮箱和密码"
- `400` → "请求参数错误，请检查输入信息"
- `Failed to fetch` → "网络连接失败，请检查网络设置"

#### 注册错误：
- `Email already exists` → "该邮箱已被注册，请使用其他邮箱或直接登录"
- `400` → "请求参数错误，请检查输入信息"
- `500` → "服务器内部错误，请稍后重试"
- `Failed to fetch` → "网络连接失败，请检查网络设置"

### 错误处理流程
1. **用户点击登录/注册按钮** → 清除之前的错误信息
2. **发送请求** → 在请求前清除错误信息
3. **请求失败** → 显示具体的错误信息
4. **用户再次尝试** → 清除错误信息，重新显示新结果

### 错误信息显示
- 错误信息显示在模态框顶部，用红色背景突出显示
- 错误信息会一直显示直到下次操作
- 每次新的请求都会清除之前的错误信息
- 支持表单验证错误和API错误两种类型

## 路由守卫机制

### 路由配置
系统为每个路由配置了认证要求：

```typescript
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: false // home页面不需要认证
    }
  },
  {
    path: '/resume',
    name: 'resume',
    component: ResumeForm,
    meta: {
      requiresAuth: true // 需要登录才能访问
    }
  }
]
```

### 守卫逻辑
1. **检查路由认证要求** → 如果路由需要认证
2. **验证用户登录状态** → 检查store中的登录状态
3. **尝试恢复登录状态** → 从localStorage恢复登录信息
4. **重定向处理** → 未登录用户重定向到首页
5. **登录后跳转** → 登录成功后跳转到原目标页面

### 重定向流程
```
用户访问 /resume (需要登录)
    ↓
检查登录状态
    ↓
未登录 → 重定向到 /?redirect=/resume&showLogin=true
    ↓
首页显示登录提示并自动打开登录模态框
    ↓
用户登录成功
    ↓
自动跳转到 /resume
```

### 登录状态恢复
- 检查localStorage中的登录信息
- 验证token有效性
- 自动恢复用户状态
- 失败时清除无效信息

## 使用方法

### 1. 在组件中使用认证功能

```vue
<template>
  <div>
    <!-- 登录/注册按钮 -->
    <button v-if="!userStore.isLoggedIn" @click="openAuthModal">
      登录/注册
    </button>
    
    <!-- 用户信息 -->
    <div v-else>
      <span>{{ userStore.userInfo.username }}</span>
      <button @click="handleLogout">登出</button>
    </div>
    
    <!-- 认证模态框 -->
    <AuthModal 
      :is-visible="showAuthModal"
      :external-error-message="authErrorMessage"
      @close="closeAuthModal"
      @login="handleLogin"
      @register="handleRegister"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import AuthModal from '@/components/AuthModal.vue'

const userStore = useUserStore()
const showAuthModal = ref(false)
const authErrorMessage = ref('')

const openAuthModal = () => {
  authErrorMessage.value = '' // 清除之前的错误信息
  showAuthModal.value = true
}

const closeAuthModal = () => {
  showAuthModal.value = false
  authErrorMessage.value = '' // 清除错误信息
}

const handleLogin = async (loginData) => {
  authErrorMessage.value = '' // 清除之前的错误信息
  
  const result = await userStore.login(loginData)
  if (result.success) {
    showAuthModal.value = false
    console.log('登录成功')
  } else {
    authErrorMessage.value = result.error // 设置错误信息
  }
}

const handleRegister = async (registerData) => {
  authErrorMessage.value = '' // 清除之前的错误信息
  
  const result = await userStore.register(registerData)
  if (result.success) {
    showAuthModal.value = false
    console.log('注册成功')
  } else {
    authErrorMessage.value = result.error // 设置错误信息
  }
}

const handleLogout = async () => {
  await userStore.logout()
  console.log('登出成功')
}
</script>
```

### 2. 使用HTTP客户端发送认证请求

```typescript
import { http } from '@/utils/http'

// 发送需要认证的请求
const response = await http.get('/api/protected-endpoint')
```

### 3. 检查用户认证状态

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 检查是否已登录
if (userStore.isAuthenticated) {
  console.log('用户已登录')
}

// 获取用户信息
console.log(userStore.userInfo)

// 获取认证token
const token = userStore.getAuthToken()
```

### 4. 路由守卫使用

```typescript
// 在路由配置中添加认证要求
{
  path: '/protected-page',
  name: 'protected',
  component: ProtectedComponent,
  meta: {
    requiresAuth: true // 需要登录才能访问
  }
}

// 在组件中处理重定向
const handleLogin = async (loginData) => {
  const result = await userStore.login(loginData)
  if (result.success) {
    // 登录成功后自动跳转到原目标页面
    if (route.query.redirect) {
      const redirectPath = String(route.query.redirect)
      router.push(redirectPath)
    }
  }
}
```

## 配置说明

### 1. 后端API地址配置

在 `src/utils/http.ts` 中修改API基础地址：

```typescript
const API_BASE_URL = 'http://127.0.0.1:8000' // 修改为你的后端地址
```

### 2. 环境变量配置

可以创建 `.env` 文件来配置环境变量：

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

然后在代码中使用：

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
```

## 错误处理

### 1. 表单验证错误
- 必填字段验证
- 邮箱格式验证
- 密码长度验证
- 密码确认匹配验证

### 2. API错误处理
- 网络错误
- 服务器错误
- 认证失败
- 用户已存在

### 3. 错误提示
- 模态框内错误提示
- 页面顶部成功提示
- 自动清除错误信息

### 4. 错误信息不显示
- 检查`authErrorMessage`是否正确传递
- 确认错误信息映射是否正确
- 验证API返回的错误格式

### 5. 路由守卫问题
- 检查路由meta配置是否正确
- 确认用户store状态是否正常
- 验证localStorage中的登录信息
- 检查重定向参数是否正确传递

## 安全注意事项

1. **Token管理**: Token存储在localStorage中，确保HTTPS环境
2. **密码安全**: 前端不存储明文密码
3. **请求拦截**: 自动添加认证头，处理token过期
4. **状态清理**: 登出时清除所有本地存储的用户信息

## 扩展功能

### 1. 添加更多认证方式
- 第三方登录（Google、GitHub等）
- 手机号登录
- 验证码登录

### 2. 用户信息管理
- 用户资料编辑
- 头像上传
- 密码修改

### 3. 权限管理
- 角色权限控制
- 路由守卫
- 功能权限控制

## 故障排除

### 1. CORS错误
确保后端已正确配置CORS，允许前端域名访问。

### 2. 认证失败
检查token格式和有效期，确保后端认证逻辑正确。

### 3. 状态不同步
检查localStorage中的数据完整性，必要时清除重新登录。

### 4. 错误信息不显示
- 检查`authErrorMessage`是否正确传递
- 确认错误信息映射是否正确
- 验证API返回的错误格式

### 5. 路由守卫问题
- 检查路由meta配置是否正确
- 确认用户store状态是否正常
- 验证localStorage中的登录信息
- 检查重定向参数是否正确传递

## 开发建议

1. 在生产环境中使用HTTPS
2. 实现token自动刷新机制
3. 添加请求重试机制
4. 实现用户会话超时处理
5. 添加操作日志记录
6. 定期清理过期的错误信息
7. 考虑添加错误上报机制

# 用户认证和简历管理功能

## 功能概述

本项目实现了完整的用户认证系统和简历管理功能，包括：

1. **用户认证**：登录、注册、登出
2. **路由保护**：未登录用户无法访问受保护页面
3. **简历管理**：在线编辑、保存、加载简历信息

## 用户认证功能

### 登录/注册模态框

- 位置：`src/components/AuthModal.vue`
- 功能：统一的登录和注册界面
- 特性：
  - 邮箱、用户名、密码输入
  - 密码可见性切换
  - 表单验证
  - 错误信息显示
  - 自动登录状态切换

### 用户状态管理

- 位置：`src/stores/user.ts`
- 功能：管理用户登录状态和用户信息
- 特性：
  - 登录状态持久化（localStorage）
  - 用户信息存储
  - 登录/注册/登出操作
  - 错误处理

### API服务

- 位置：`src/services/auth.ts`
- 功能：处理与后端的认证通信
- 特性：
  - 登录API调用
  - 注册API调用
  - 错误处理和消息传递

### HTTP客户端

- 位置：`src/services/http.ts`
- 功能：统一的HTTP请求处理
- 特性：
  - 请求/响应拦截器
  - 自动token管理
  - CORS处理
  - 错误统一处理

## 简历管理功能

### 简历编辑

- 位置：`src/views/ResumeForm.vue`
- 功能：在线简历编辑界面
- 特性：
  - 个人信息编辑
  - IT技能管理
  - 教育背景（支持多条记录）
  - 项目/实习经历（支持多条记录）
  - 竞赛/获奖/论文（支持多条记录）
  - 自我评价
  - 实时预览

### 简历数据管理

- 位置：`src/stores/resume.ts`
- 功能：管理简历数据状态
- 特性：
  - 响应式数据管理
  - 默认示例数据
  - 数据持久化

### 简历API服务

- 位置：`src/services/resume.ts`
- 功能：处理简历数据的保存和加载
- 特性：
  - 保存简历到数据库
  - 从数据库加载简历
  - 更新简历信息
  - 错误处理

### 简历预览组件

- 位置：`src/components/ResumePreview.vue`
- 功能：实时显示简历预览
- 特性：
  - 响应式布局
  - 美观的样式设计
  - 实时数据更新

## 路由保护

### 路由配置

- 位置：`src/router/index.ts`
- 功能：配置路由和访问权限
- 特性：
  - 路由元信息（requiresAuth）
  - 全局前置守卫
  - 自动重定向

### 路由守卫

- 功能：检查用户登录状态
- 特性：
  - 未登录用户重定向到首页
  - 自动显示登录模态框
  - 登录后自动跳转到目标页面

## 错误处理

### 登录错误

- 显示具体的错误信息（如"邮箱已存在"、"密码错误"等）
- 错误信息会在每次失败时重新显示
- 支持网络错误和服务器错误的区分

### 简历保存错误

- 表单验证（必填字段检查）
- 网络错误处理
- 服务器错误信息显示
- 用户友好的错误提示

## 使用方法

### 1. 用户登录

1. 访问首页，点击"登录"或"注册"按钮
2. 填写相应信息并提交
3. 登录成功后会自动更新用户状态

### 2. 简历编辑

1. 登录后访问简历编辑页面
2. 填写个人信息、技能、教育背景等
3. 点击"保存简历"按钮保存到数据库
4. 点击"加载简历"按钮从数据库加载之前保存的数据

### 3. 路由访问

- 未登录用户只能访问首页
- 登录用户可以访问所有页面
- 访问受保护页面时会自动重定向到首页并显示登录模态框

## API接口

### 认证接口

```
POST /api/auth/register - 用户注册
POST /api/auth/login - 用户登录
```

### 简历接口

```
POST /api/resume/save - 保存简历
GET /api/resume/get - 获取简历
PUT /api/resume/update - 更新简历
```

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **状态管理**：Pinia
- **路由管理**：Vue Router 4
- **UI组件库**：Element Plus
- **样式框架**：TailwindCSS
- **HTTP客户端**：Axios

## 注意事项

1. 确保后端API支持CORS跨域请求
2. 后端需要实现相应的认证和简历管理接口
3. 用户登录状态会保存在localStorage中
4. 简历数据会分块保存到数据库中
5. 所有API调用都包含错误处理和用户提示

## 故障排除

### 常见问题

1. **"Failed to fetch"错误**：通常是CORS配置问题
2. **登录失败**：检查邮箱和密码是否正确
3. **保存失败**：检查网络连接和必填字段
4. **路由跳转问题**：检查登录状态和路由配置

### 调试建议

1. 查看浏览器控制台的错误信息
2. 检查网络请求的状态码和响应
3. 确认后端API是否正常运行
4. 验证CORS配置是否正确 