// ═══════════ 解剖通Pro — AI对话模块 ═══════════

// ═══════════ 系统提示词 ═══════════
const SYSTEM_PROMPTS = {
  all: `你是「解剖通Pro」AI助手，一位专业的人体解剖学教师。你的特点：
1. 专业严谨：解剖学术语准确，描述详尽
2. 结构清晰：善于用分层列表和表格组织信息
3. 临床结合：适当联系临床应用和常见疾病
4. 图文并茂：用ASCII图表和结构示意图辅助说明
5. 循循善诱：用提问引导思考，不直接给答案

请用中文回答，如果涉及英文解剖学名词，请同时标注中文。`,

  skeletal: `你是运动系统（骨骼系统）专家。请详细讲解骨骼的结构、功能、骨连接和常见疾病。
可参考的讲解框架：
- 解剖位置与形态特征
- 组织结构（骨膜、骨质、骨髓）
- 重要毗邻结构
- 功能作用
- 神经血管支配
- 临床意义（骨折、好发部位等）`,

  muscular: `你是肌肉系统专家。请详细讲解肌肉的起止点、功能、神经支配和常见疾病。
可参考的讲解框架：
- 解剖位置与形态特征
- 起止点与作用
- 拮抗肌与协同肌
- 神经支配与血液供应
- 临床意义（损伤、麻痹等）`,

  nervous: `你是神经系统专家。请详细讲解神经元的结构、神经传导通路和常见疾病。
可参考的讲解框架：
- 神经系统的分区（中枢/周围）
- 神经元的结构与功能
- 重要传导通路
- 神经丛与主要神经分支
- 临床意义（损伤表现等）`,

  cardiovascular: `你是心血管系统专家。请详细讲解心脏的解剖、血管的分布和常见疾病。
可参考的讲解框架：
- 解剖位置与形态
- 心脏的四个腔室与瓣膜
- 冠脉循环
- 主要血管分支
- 临床意义（心梗好发部位等）`,

  respiratory: `你是呼吸系统专家。请详细讲解呼吸道的结构、肺泡的气体交换原理。
可参考的讲解框架：
- 呼吸道的分段（上下呼吸道）
- 肺叶与肺段
- 气体交换原理
- 胸膜与纵隔
- 临床意义（肺炎、肺癌好发部位等）`,

  digestive: `你是消化系统专家。请详细讲解消化道的分段、消化腺的功能和常见疾病。
可参考的讲解框架：
- 消化道的分段与功能
- 消化腺的位置与分泌
- 肝胆系统的结构
- 腹膜与系膜
- 临床意义（溃疡、结石好发部位等）`,

  urinary: `你是泌尿系统专家。请详细讲解肾脏的滤过功能、尿路结石和常见疾病。
可参考的讲解框架：
- 肾脏的位置与结构（皮质、髓质、肾单位）
- 输尿管的三个狭窄
- 膀胱的神经支配
- 排尿反射
- 临床意义（结石、炎症好发部位等）`,

  reproductive: `你是生殖系统专家。请详细讲解生殖器官的结构、受精过程和常见疾病。
可参考的讲解框架：
- 男/女性生殖器官的位置与结构
- 生殖细胞的产生与成熟
- 生殖周期（如月经周期）
- 临床意义（肿瘤、好发部位等）`,

  endocrine: `你是内分泌系统专家。请详细讲解内分泌腺的位置、激素功能和常见疾病。
可参考的讲解框架：
- 内分泌腺的位置与结构
- 主要激素及其功能
- 反馈调节机制
- 临床意义（甲亢、糖尿病等）`,
};

// ═══════════ 当前对话上下文 ═══════════
let chatMessages = [];

// ═══════════ 发送消息 ═══════════
async function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  
  const content = input.value.trim();
  if (!content) return;
  
  // 清空输入框
  input.value = '';
  
  // 添加用户消息
  addMessage('user', content);
  
  // 构建消息历史
  const systemPrompt = SYSTEM_PROMPTS[App.state.currentSystem] || SYSTEM_PROMPTS.all;
  
  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatMessages.slice(-10).map(m => ({
      role: m.role,
      content: m.content,
    })),
    { role: 'user', content: content },
  ];
  
  // 显示加载状态
  showTypingIndicator();
  
  try {
    await streamAIResponse(messages);
  } catch (error) {
    hideTypingIndicator();
    addMessage('assistant', `❌ ${error.message}\n\n请检查网络连接或稍后再试。`);
  }
}

// ═══════════ 流式AI响应 ═══════════
async function streamAIResponse(messages) {
  const response = await fetch(App.config.API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: App.state.currentModel,
      messages: messages,
    }),
  });
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `请求失败 (${response.status})`);
  }
  
  hideTypingIndicator();
  
  // 创建助手消息元素
  const assistantMsg = createMessageElement('assistant', '');
  let fullText = '';
  
  // 读取SSE流
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      
      const dataStr = trimmed.slice(6);
      if (dataStr === '[DONE]') break;
      
      try {
        const data = JSON.parse(dataStr);
        const delta = data.choices?.[0]?.delta?.content;
        if (delta) {
          fullText += delta;
          updateMessageContent(assistantMsg, App.renderMarkdown(fullText));
          App.scrollChatToBottom();
        }
      } catch (e) {
        // 忽略解析错误
      }
    }
  }
  
  // 保存到历史
  chatMessages.push({ role: 'user', content: messages[messages.length - 1].content });
  chatMessages.push({ role: 'assistant', content: fullText });
  
  if (!fullText) {
    updateMessageContent(assistantMsg, '⚠️ 未能获取到回复，请稍后再试。');
  }
}

// ═══════════ 添加消息 ═══════════
function addMessage(role, content) {
  const messagesContainer = document.querySelector('.chat-messages');
  if (!messagesContainer) return;
  
  const msg = createMessageElement(role, App.renderMarkdown(content));
  messagesContainer.appendChild(msg);
  App.scrollChatToBottom();
  
  return msg;
}

function createMessageElement(role, content) {
  const div = document.createElement('div');
  div.className = `message message-${role}`;
  
  const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  
  div.innerHTML = `
    <div class="message-content">${content}</div>
    <div class="message-time">${time}</div>
  `;
  
  return div;
}

function updateMessageContent(element, content) {
  const contentDiv = element.querySelector('.message-content');
  if (contentDiv) {
    contentDiv.innerHTML = content;
  }
}

// ═══════════ 加载指示器 ═══════════
function showTypingIndicator() {
  const messagesContainer = document.querySelector('.chat-messages');
  if (!messagesContainer) return;
  
  const indicator = document.createElement('div');
  indicator.id = 'typing-indicator';
  indicator.className = 'message message-assistant';
  indicator.innerHTML = `
    <div class="message-content">
      <div class="message-typing">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  
  messagesContainer.appendChild(indicator);
  App.scrollChatToBottom();
}

function hideTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

// ═══════════ 清空对话 ═══════════
function clearChat() {
  chatMessages = [];
  const messagesContainer = document.querySelector('.chat-messages');
  if (messagesContainer) {
    messagesContainer.innerHTML = '';
    
    // 添加欢迎消息
    const welcome = `
      <div class="empty-state" style="padding: 40px 20px;">
        <div class="empty-icon">🫀</div>
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">
          欢迎使用解剖通Pro AI助手
        </div>
        <div class="empty-text">
          选择左侧系统，开始你的解剖学学习之旅
        </div>
      </div>
    `;
    messagesContainer.innerHTML = welcome;
  }
  App.showToast('对话已清空', 'success');
}

// ═══════════ 输入框事件 ═══════════
function initChatInput() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  
  // 自动调整高度
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 150) + 'px';
  });
  
  // 回车发送
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

// ═══════════ 初始化 ═══════════
document.addEventListener('DOMContentLoaded', () => {
  initChatInput();
  
  // 发送按钮事件
  const sendBtn = document.getElementById('chat-send-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
  
  // 清空按钮事件
  const clearBtn = document.getElementById('chat-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearChat);
  }
});
