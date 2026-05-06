# 解剖通Pro — 人体解剖学 AI 学习助手 V2

> 参赛作品：第二届AI赋能解剖学应用能力及场景创新大赛 · 第三赛道

## ✨ 核心功能

| 功能 | 说明 |
|------|------|
| 🤖 AI对话问答 | 多模型切换，系统专项问答，流式响应 |
| 📸 智能图片识别 | 解剖图谱结构标注，AI详细讲解 |
| 🫀 3D解剖可视化 | Three.js 可交互3D模型，点击即学 |
| 🎤 语音问答 | 语音输入问题，AI语音回答 |
| 📈 智能学习路径 | 知识图谱+遗忘曲线推荐，个性化学习 |

## 🛠️ 技术栈

- **前端**：HTML5 + CSS3 + ES6 JavaScript
- **3D渲染**：Three.js + GLTF
- **AI后端**：Netlify Functions（Node.js）
- **大模型**：DeepSeek V3 / 硅基流动 / 通义千问
- **部署**：GitHub + Netlify

## 🚀 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/YOUR_USERNAME/anatomy-ai-v2.git
cd anatomy-ai-v2

# 2. 安装 Netlify CLI
npm install -g netlify-cli

# 3. 启动本地开发
netlify dev

# 4. 访问 http://localhost:8888
```

## 🌐 部署说明

部署到 Netlify（免费）：

1. 将代码推送到 GitHub 仓库
2. 登录 [app.netlify.com](https://app.netlify.com)
3. "Add new site" → "Import an existing project"
4. 选择 GitHub 仓库
5. 在 Environment variables 中配置：
   - `DEEPSEEK_API_KEY`
   - `SILICONFLOW_API_KEY`
   - `DASHSCOPE_API_KEY`

## 📁 项目结构

```
anatomy-ai-v2/
├── index.html              # 主入口
├── css/
│   └── styles.css          # 样式系统
├── js/
│   ├── app.js              # 应用逻辑
│   ├── ai-chat.js          # AI对话
│   ├── image-recognition.js # 图片识别
│   ├── model-viewer.js     # 3D可视化
│   ├── voice-utils.js      # 语音交互
│   ├── learning-path.js    # 学习路径
│   └── anatomy-data.js     # 知识图谱
├── public/
│   └── models/             # 3D模型
├── netlify/
│   └── functions/
│       └── ai-proxy.js     # AI代理
├── netlify.toml
└── README.md
```

## 📝 参赛信息

- **赛道**：第三赛道 — AI辅助学习场景创新应用
- **作品名称**：解剖通Pro
- **开发者**：张涛
- **单位**：海南医学院

---

MIT License © 2026
