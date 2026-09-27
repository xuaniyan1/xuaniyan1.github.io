---
layout: page
title: 总导航
permalink: /navigation/
description: xuaniyan1 的全部文章与复习入口。
---

<p class="navigation-intro">从这里进入全部内容。文章用于理解，复习卡片用于快速回忆。</p>

## 专题入口

<div class="topic-grid">
  <a class="topic-card" href="#算法">
    <span>01</span>
    <strong>算法</strong>
    <small>DFS · 回溯 · 二分</small>
  </a>
  <a class="topic-card" href="#组成与汇编">
    <span>02</span>
    <strong>组成与汇编</strong>
    <small>MIPS · Logisim · 状态机</small>
  </a>
  <a class="topic-card" href="#全部文章">
    <span>03</span>
    <strong>全部文章</strong>
    <small>按发布时间排列</small>
  </a>
</div>

## 算法

- [DFS：参数、vis 与 path]({{ '/2026/09/26/understanding-dfs-state/' | relative_url }})
- [二分：check、边界与答案]({{ '/2026/09/27/thinking-in-binary-search/' | relative_url }})

## 组成与汇编

- [MIPS 递归、宏与 Logisim 周期]({{ '/2026/09/28/mips-recursion-macros-and-logisim-cycles/' | relative_url }})
- [MIPS 与 Logisim 一页复习卡]({{ '/review/mips-logisim/' | relative_url }})
- [状态机与自动售货机复习卡]({{ '/review/fsm-vending-machine/' | relative_url }})

## 全部文章

{% for post in site.posts %}
- `{{ post.date | date: "%Y-%m-%d" }}` [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}
