# Zenith Blog Engine 使用说明

这是一个基于 Python 和 React 的现代博客系统。它将 Markdown 文档转化为美观的响应式博客网站。

## 📁 目录结构

在使用之前，请确保你的项目根目录包含以下关键文件夹：

```text
根目录/
├── posts/                  <--- 这里存放你的原始 Markdown (.md) 文件 (源)
├── public/                 <--- 网站静态资源目录
│   ├── blog_data.json      <--- Python 生成的博客数据 (不要手动修改)
│   └── images/             <--- Python 自动处理后的图片存放处
├── scripts/
│   └── blog_generator.py   <--- 核心生成脚本
└── src/                    <--- React 源代码
```

## 🚀 快速开始

### 1. 准备环境
确保你安装了 Python 3 和 Node.js。

### 2. 放置文章
将你的 Markdown 文件放入 `posts/` 文件夹中。

### 3. 生成博客数据
每次添加或修改文章后，运行 Python 脚本来更新网站内容：

```bash
python scripts/blog_generator.py
```
*脚本会自动解析 markdown，处理图片，并生成 `public/blog_data.json`。*

### 4. 启动网站
```bash
npm start
```

---

## ✍️ 写作规范 (Writing Guide)

为了让博客正确解析标题、标签和分类，请遵循以下格式：

### 1. 头部元数据 (Metadata)
程序会扫描文档的 **前 5 行** 来获取分类和标签。

*   **分类 (Category)**: 使用 `@` 或 `＠` 符号。例如：`@技术` 或 `＠生活`。
*   **标签 (Tags)**: 使用 `#` 或 `＃` 符号。例如：`#Python` 或 `＃学习笔记`。
*   **标题 (Title)**: 程序会自动抓取文中第一个 一级标题 (`#`) 或 二级标题 (`##`) 作为文章标题。

**示例文件内容：**

```markdown
@编程开发 #React #教程
# 如何使用 React Hooks
这里是正文的第一句话...
```

### 2. 图片插入规则
为了支持自动化图片管理，请遵循 **"文档名作为文件夹名"** 的规则。

假设你的文档名为 `my-trip.md`：
1. 在 `posts/` 下创建一个名为 `my-trip` 的文件夹。
2. 把图片放在里面，例如 `photo.jpg`。
3. 在 Markdown 中这样引用：

```markdown
![风景图](my-trip/photo.jpg)
```

**原理**：Python 脚本会自动将 `posts/my-trip/photo.jpg` 复制到 `public/images/`，并重命名为 `my-trip_photo.jpg` 防止冲突，同时自动修改最终生成的 HTML 链接。

---

## ⚙️ 功能特性

*   **智能关联**：文章底部会自动显示“上一篇”和“下一篇”。逻辑优先跳转同分类下的文章，如果没有则跳转时间线上的相邻文章。
*   **增量更新**：Python 脚本会检查文件修改时间，只有当 Markdown 文件比数据文件新时才会重新生成，加快速度。
*   **中英文兼容**：标签和分类符号支持全角 (＠＃) 和半角 (@#)。
*   **预览优化**：首页预览会自动过滤掉开头的标签行和图片代码，只显示纯文本摘要。
