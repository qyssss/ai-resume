1. HomeView 页面按钮“有时弹出有时不弹出登录框”
问题表现：
在未登录情况下，点击 HomeView 页面的 “Try Now” 和底部的 “Learn More” 等按钮，理论上都应该弹出登录框，但实际有时弹出，有时没有。
原因分析：
这些按钮的点击事件直接用 router.push 跳转到需要登录的页面（如 /resume、/interview），
路由守卫检测到未登录后会重定向到首页，并通过 query 参数（如 showLogin=true）提示弹出登录框。
HomeView 组件通过监听路由参数变化（watch route.query）来弹出登录框。
但由于 Vue 组件的挂载/卸载和路由变化的时机问题，watch 有时会被触发，有时不会，导致弹窗行为不一致。
修复方法：
移除 HomeView 中对路由参数的监听（watch），改为在按钮点击时直接判断登录状态并弹出登录框，保证每次点击都能弹出。
路由守卫只做重定向，不再依赖 query 参数触发弹窗。
2. 登录弹窗重复弹出（弹两次）
问题表现：
修复后发现有时会弹出两个登录框，用户需要关闭两次。
原因分析：
既有按钮点击时手动弹出登录框，又有路由守卫重定向到首页并通过参数触发登录框，两处逻辑叠加导致重复弹出。
修复方法：
只保留按钮点击时的弹窗逻辑，路由守卫只做重定向，不再设置 showLogin 参数，彻底避免重复弹窗。
3. 顶部导航栏按钮未登录时不弹出登录框
问题表现：
点击导航栏“Resume”、“AI Agent”、“Interview”、“Job Center”等按钮，未登录时不会弹出登录框，而是直接跳转后被重定向回首页。
原因分析：
导航栏用的是 <router-link>，它不会做登录状态检查，也不会弹出登录框。
修复方法：
将 <router-link> 改为 <a> 标签，绑定 @click 事件，点击时先检查登录状态。
未登录时弹出登录框并设置重定向参数，已登录则正常跳转。
4. 登录弹窗逻辑复用与统一
问题表现：
HomeView 和 MainLayout 需要统一登录弹窗的逻辑，否则体验不一致。
修复方法：
在 MainLayout.vue 中引入 <AuthModal />，并实现 showAuthModal、authErrorMessage、openAuthModal、closeAuthModal、handleLogin、handleRegister 等逻辑，与 HomeView 保持一致。

5. 部署修复: 进入路由，比如/jobs,刷新后页面404，配置vercel.json文件

6. 简历页面滑动，预览的简历不跟着下滑，进行修复

7. 工作推荐点击同个工作不弹出抽屉（具体描述）：
问题本质：watch 只在 selectedJob 变化时触发，点同一个 job 不会触发。
解决办法：点击时直接设置 drawerVisible = true，不依赖 selectedJob 的变化。