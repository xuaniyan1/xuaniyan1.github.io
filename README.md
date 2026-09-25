# 玄一言的博客

这是一个可直接作为 Obsidian Vault 使用的 GitHub Pages 博客。

## 写文章

1. 在 Obsidian 中打开本目录。
2. 在 `_posts` 新建文件，命名为 `YYYY-MM-DD-英文短标题.md`。
3. 复制下面的头部，填写后直接写 Markdown：

```yaml
---
layout: post
title: "文章标题"
date: 2026-09-25 20:00:00 +0800
description: "一句简短的文章介绍"
tags: [随笔, 技术]
---
```

4. 用 Obsidian Git 插件提交并推送，或在终端运行：

```powershell
git add .
git commit -m "发布：文章标题"
git push
```

> 推荐使用普通 Markdown 链接 `[文字](地址)`；Obsidian 的 `[[双链]]` 不会自动变成网页链接。

## 第一次发布到 GitHub Pages

1. 在 GitHub 创建一个**公开**仓库，名称必须为 `xuaniyan1.github.io`。
2. 在本目录执行：

```powershell
git init
git branch -M main
git add .
git commit -m "初始化个人博客"
git remote add origin https://github.com/xuaniyan1/xuaniyan1.github.io.git
git push -u origin main
```

3. 打开仓库的 **Settings → Pages**，将 **Build and deployment / Source** 选择为 **GitHub Actions**。
4. 等待 Actions 完成，访问 <https://xuaniyan1.github.io>。

以后每次推送新文章，网站会自动更新。

## 本地预览（可选）

安装 Ruby 与 Bundler 后：

```powershell
bundle install
bundle exec jekyll serve
```

然后打开 `http://localhost:4000`。
