# Code Atelier 离散数学 2｜启用登录与云端进度

当前网站已接入**可选**的 Supabase Auth + Postgres 进度保存代码。没有配置时，原来的本机游客刷题继续可用；网站不会自动上传游客数据。本文件是配置说明，尚未创建 Supabase 项目。

## 1. 创建项目

1. 打开 https://supabase.com/dashboard ，选择 New Project。
2. 从 Dashboard 复制 Project URL 和 publishable key（部分旧项目使用 anon public key）。
3. 千万不要把数据库密码、secret、service_role key、GitHub OAuth Client Secret 写进公开前端。

## 2. 创建进度表与安全策略

在 Supabase SQL Editor 中运行 [cloud-schema.sql](./cloud-schema.sql)。

脚本创建 dm2_progress 表，按 user_id + section 分开保存两种记录：
- homework：主作业题库的掌握状态、错题、收藏、笔记。
- exam：历年真题的作答、到期复习、收藏、笔记、模拟结果。

该表启用 Row Level Security，只允许已登录用户读写自己的行。写入时还使用 revision 版本校验，避免静默覆盖其他设备新进度。上线前要用测试用户 A、B 和匿名用户验证数据隔离，SQL 设置不能代替实际安全测试。

## 3. 邮箱免密登录

Supabase Dashboard → Authentication → Sign In / Providers：启用 Email。

Authentication → URL Configuration：设置以下允许的 Redirect URLs：

- https://xuaniyan1.github.io/code-atelier/discrete-math/
- https://xuaniyan1.github.io/code-atelier/discrete-math/index.html
- https://xuaniyan1.github.io/code-atelier/discrete-math/exam.html

Site URL 推荐设置为第一个。正式公开运营时还需核实邮件发送服务的速率限制与邮件服务配置。

## 4. 前端配置

编辑 [cloud-config.js](./cloud-config.js)：

    window.DM2_CLOUD_CONFIG = {
      url: "https://YOUR_PROJECT_REF.supabase.co",
      publishableKey: "sb_publishable_YOUR_PUBLIC_KEY",
      enableGitHub: false
    };

Project URL 和 publishable key 是设计给公开浏览器使用的。真正的数据访问限制依靠 Supabase Auth 身份验证与数据库 RLS；绝不能上传 secret、service_role key 或数据库密码。

提交 GitHub 后等待 GitHub Pages 部署。浏览器需要能加载 Supabase JS CDN 和项目域名；如果无法访问，游客模式仍能使用。

## 5. 现有进度怎样迁移？

1. 在已经做过题的原浏览器打开题库，先尽可能保留本机进度并做备份。
2. 点击邮箱登录，收取免密登录邮件并打开。
3. 登录后优先加载该账号的云端进度。**不会自动上传原游客记录。**
4. 确认登录的是自己的账号，点击“导入此设备游客进度”，阅读并确认合并规则。
5. 主作业题库中，相同题号的状态和草稿以游客记录优先、收藏合并去重，其他云端题目保留。历年真题的作答计数记录按最后作答时间选择较新的一份，不把重复记录相加。游客原始记录不会删除。
6. 历年真题使用另外一个记录分区，第一次使用时也要进入 /exam.html 页面选择导入游客进度。

如果存在设备进度冲突，界面会要求明确选择“使用云端版本”或“用本机版本覆盖云端”。未完成同步时会保留本机账号缓存，联网后可以重试。

## 6. 可选：GitHub 登录

1. 在 GitHub Developer Settings 新建 OAuth App。
2. GitHub OAuth App 的 Authorization callback URL 必须填 Supabase Dashboard 显示的回调地址，通常为 https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback 。
3. Supabase Authentication → Providers → GitHub：填写 Client ID、Client Secret（服务端设置）。
4. 网站自身的 GitHub Pages 地址仍需在 Supabase Redirect URLs 中。
5. 将 cloud-config.js 的 enableGitHub 改为 true。

GitHub OAuth Client Secret 绝不能写到公开的 GitHub Pages 文件里。

## 7. 验收测试

- 未配置时游客题库、旧记录都能继续使用。
- 用户 A 登录后手动导入旧记录，刷新页面和换设备能恢复。
- 用户 B 登录后无法看到用户 A 的任何记录。
- 主作业题库和历年真题的进度彼此独立。
- 离线时本机记录保留；回到联网状态能重新同步。
- 两设备同一分区修改造成版本冲突时，必须人工选择版本。
- 退出登录默认只退出当前设备，不删除云端数据。
- 公共电脑上登录可能留下本机缓存，应避免使用或主动清除站点数据。

## 官方文档

- https://supabase.com/docs/reference/javascript/installing
- https://supabase.com/docs/guides/auth/auth-email-passwordless
- https://supabase.com/docs/guides/auth/redirect-urls
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/auth/social-sign-in/auth-github
