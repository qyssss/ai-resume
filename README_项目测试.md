## 使用vitest进行项目测试

### 简历相关（resume）
1. 表单填写测试，主要是信息修改，增加删除工作经历什么的
2. 功能测试（actions：保存，删除，加载，重置）

### 登录注册 （login）
1. 测试登录认证的情况，发现执行登出时用户token没清空，修改logout逻辑
2. 登录页面的错误提示是中文的进行翻译，输入框提示是浏览器默认的，如要显示英文，修改浏览器语言为英语
### 模拟面试 （Interview）
1. PDF 文件上传功能
测试上传支持的 PDF 文件
模拟用户上传一个 PDF 文件。
mock 后端 /api/upload-resume 接口返回提取的简历内容。
断言页面出现“File uploaded successfully”提示，说明上传和解析成功。
测试上传不支持的文件类型
模拟用户上传一个非 PDF 文件（如 JPG）。
断言页面出现“Only PDF format is supported”或类似的错误提示，说明类型校验和错误提示正常。
2. AI 问答流程
完整流程测试
先 mock PDF 上传成功（后端返回简历内容）。
mock AI 问答接口 /api/generate-question，依次返回“First AI question?”、“Second AI question?”。
模拟用户上传简历、点击“Start Mock Interview”，断言页面出现欢迎语。
模拟用户输入答案并点击“Send”，断言页面出现“First AI question?”，即 AI 问题生成和对话流程正常。

### AI Agent 页面（agent）
简历优化核心功能进行自动化测试
1. AI 问答流程：用户输入内容后，AI 返回优化建议，历史消息正确渲染。
2. 快捷操作按钮：点击如"Optimize Skills"按钮后，自动发送预设内容，AI 返回对应建议。
3. 测试流程：
- 挂载组件时注入 Pinia，保证 store 可用。
- mock sendToQwenAIDialogue，分别返回不同的 AI 响应内容。
- 模拟用户输入、点击按钮等操作，断言页面正确渲染 AI 建议。

### Job Center工作中心
#### JD分析
测试用例:
✓ JobAnalysis.vue > 表单校验：未输入岗位描述时点击分析弹警告 77ms
✓ JobAnalysis.vue > 正常分析流程：渲染分析结果 17ms
✓ JobAnalysis.vue > 加载状态：分析时按钮禁用，分析后恢复 15ms
✓ JobAnalysis.vue > 异常处理：分析接口报错弹出错误提示 25ms

1. 表单校验：未输入岗位描述时点击分析弹警告
目的：确保用户未填写岗位描述时，点击“分析”按钮会弹出警告。
做法：直接点击按钮，断言 ElMessage.warning 被调用。
2. 正常分析流程：渲染分析结果
目的：验证输入岗位描述后，API 返回 mock 结果，页面能正确渲染分析内容。
做法：
mock jobApi.analyzeJobFit 返回模拟分析结果。
输入岗位描述，点击按钮，等待异步完成。
断言页面渲染了 strengths、gaps、summary、matchScore 等内容。
3. 加载状态：分析时按钮禁用，分析后恢复
目的：确保分析过程中按钮处于 loading/禁用状态，分析结束后恢复可用。
做法：
mock API 返回一个可控的 Promise。
触发分析后，断言按钮 disabled 属性存在。
手动 resolve Promise，等待异步完成，断言按钮恢复可用。
4. 异常处理：分析接口报错弹出错误提示
目的：确保分析接口报错时，页面会弹出错误提示。
做法：
mock jobApi.analyzeJobFit 抛出异常。
输入岗位描述，点击按钮，等待异步完成。
断言 ElMessage.error 被调用。

### JobRecommend.vue 组件测试内容总结

1. **岗位推荐接口正常返回时的渲染**
   - 模拟接口返回岗位数据，断言页面能正确渲染出岗位卡片，并且内容正确。

2. **岗位推荐接口返回空数组时的处理**
   - 模拟接口返回空数组，断言页面会显示空状态(el-empty)，并且会弹出提示信息。

3. **岗位推荐接口报错时的处理**
   - 模拟接口报错，断言页面会弹出错误提示，并且不会渲染任何岗位卡片。

4. **加载状态下的UI展示**
   - 模拟接口一直处于加载状态，断言页面会显示“正在生成个性化岗位推荐”的提示文本。

5. **岗位卡片内容和数量的渲染**
   - 模拟接口返回岗位数据，断言页面渲染出正确数量的岗位卡片，并且每个卡片的内容（如岗位名、公司、地点、薪资、匹配度等）都正确显示。

6. **点击岗位卡片弹出抽屉的交互**
   - 模拟用户点击岗位卡片，断言页面会弹出岗位详情抽屉，并且抽屉内容正确显示岗位信息。
