// ═══════════ 解剖通Pro — 主应用逻辑 ═══════════

// ═══════════ 全局状态 ═══════════
const AppState = {
  currentPage: 'home',
  currentModel: 'deepseek',
  currentSystem: 'all',
  chatHistory: [],
  isLoading: false,
  learningProgress: null,
};

// ═══════════ 常量配置 ═══════════
const CONFIG = {
  API_BASE: '/api/ai-proxy',
  STORAGE_KEY: 'anatomy_progress_v2',
  MODELS: [
    { id: 'deepseek', name: 'DeepSeek', desc: '推荐，推理能力强' },
    { id: 'siliconflow', name: '硅基流动', desc: '免费额度充足' },
    { id: 'qwen', name: '通义千问', desc: '中文理解优秀' },
  ],
};

// ═══════════ 路由初始化 ═══════════
function initRouter() {
  const hash = location.hash.slice(1) || 'home';
  if (['home', 'chat', 'scan', 'model', 'path', 'quiz', 'settings'].includes(hash)) {
    navigate(hash);
  }
  window.addEventListener('hashchange', initRouter);
}

// ═══════════ 页面导航 ═══════════
function navigate(page) {
  AppState.currentPage = page;
  location.hash = page;
  
  // 更新页面显示
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const targetPage = document.getElementById('page-' + page);
  if (targetPage) targetPage.classList.add('active');
  
  // 更新Tab状态
  document.querySelectorAll('.tab-item').forEach(t => {
    const isActive = t.dataset.page === page;
    t.classList.toggle('active', isActive);
  });
  
  // 触发页面特定初始化
  onPageEnter(page);
}

// ═══════════ 页面进入事件 ═══════════
function onPageEnter(page) {
  switch(page) {
    case 'home':
      updateHomeStats();
      renderRecommended();
      break;
    case 'chat':
      renderChatSystemBar();
      break;
    case 'scan':
      initScanPage();
      break;
    case 'model':
      init3DViewer();
      break;
    case 'path':
      renderLearningPath();
      break;
    case 'quiz':
      initQuizPage();
      break;
  }
}

// ═══════════ 首页统计 ═══════════
function updateHomeStats() {
  const progress = AnatomyData.getLearningProgress();
  const totalStructures = AnatomyData.structures.length;
  const learnedCount = progress.visitedStructures.length;
  const quizTotal = Object.values(progress.quizResults).reduce((sum, r) => sum + r.correct + r.wrong, 0);
  const quizCorrect = Object.values(progress.quizResults).reduce((sum, r) => sum + r.correct, 0);
  const accuracy = quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : 0;
  
  document.getElementById('stat-total').textContent = totalStructures;
  document.getElementById('stat-learned').textContent = learnedCount;
  document.getElementById('stat-accuracy').textContent = accuracy + '%';
  document.getElementById('stat-streak').textContent = progress.streakDays;
  
  // 更新进度条
  const progressPercent = Math.round((learnedCount / totalStructures) * 100);
  document.getElementById('home-progress-fill').style.width = progressPercent + '%';
  document.getElementById('home-progress-text').textContent = progressPercent + '%';
}

// ═══════════ 推荐学习 ═══════════
function renderRecommended() {
  const recommendations = AnatomyData.getRecommendedStructures(5);
  const container = document.getElementById('recommended-list');
  
  if (!container) return;
  
  container.innerHTML = recommendations.map(rec => {
    const sys = AnatomyData.systems.find(s => s.id === rec.structure.system);
    return `
      <div class="learning-card" onclick="showKnowledgeDetail(${rec.structure.id})">
        <div class="learning-card-icon">${sys?.icon || '📚'}</div>
        <div class="learning-card-content">
          <div class="learning-card-title">${rec.structure.name}</div>
          <div class="learning-card-desc">${rec.reason}</div>
        </div>
        <span class="learning-card-badge ${rec.score === 0 ? 'badge-new' : 'badge-review'}">
          ${rec.score === 0 ? 'NEW' : '复习'}
        </span>
      </div>
    `;
  }).join('');
}

// ═══════════ 系统选择栏 ═══════════
function renderChatSystemBar() {
  const bar = document.getElementById('chat-system-bar');
  if (!bar) return;
  
  bar.innerHTML = `
    <button class="system-tab active" data-system="all" onclick="selectChatSystem('all', this)">
      🏠 全部系统
    </button>
    ${AnatomyData.systems.map(s => `
      <button class="system-tab" data-system="${s.id}" onclick="selectChatSystem('${s.id}', this)">
        ${s.icon} ${s.name}
      </button>
    `).join('')}
  `;
}

function selectChatSystem(system, el) {
  AppState.currentSystem = system;
  document.querySelectorAll('.system-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  
  // 更新系统上下文提示
  const systemInfo = system === 'all' ? '全部系统' : 
    (AnatomyData.systems.find(s => s.id === system)?.name || '');
  const systemHint = document.getElementById('chat-system-hint');
  if (systemHint) {
    systemHint.textContent = systemInfo;
  }
}

// ═══════════ 知识详情 ═══════════
function showKnowledgeDetail(id) {
  const structure = AnatomyData.structures.find(s => s.id === id);
  if (!structure) return;
  
  const system = AnatomyData.systems.find(s => s.id === structure.system);
  
  // 更新学习进度
  const progress = AnatomyData.getLearningProgress();
  if (!progress.visitedStructures.includes(id)) {
    progress.visitedStructures.push(id);
    AnatomyData.saveLearningProgress(progress);
  }
  
  // 渲染详情
  const modal = document.getElementById('knowledge-modal');
  const body = document.getElementById('knowledge-modal-body');
  
  body.innerHTML = `
    <div class="knowledge-detail">
      <div class="knowledge-header">
        <div class="knowledge-icon">${system?.icon || '📚'}</div>
        <div>
          <div class="knowledge-title">${structure.name}</div>
          <div class="knowledge-subtitle">${system?.name || ''} · ${structure.nameEn}</div>
        </div>
      </div>
      
      <div class="detail-section">
        <div class="detail-label">📍 位置</div>
        <div class="detail-value">${structure.location}</div>
      </div>
      
      <div class="detail-section">
        <div class="detail-label">📋 描述</div>
        <div class="detail-value">${structure.description}</div>
      </div>
      
      <div class="detail-section">
        <div class="detail-label">⚙️ 功能</div>
        <div class="detail-value">${structure.function}</div>
      </div>
      
      <div class="detail-section">
        <div class="detail-label">🔗 毗邻关系</div>
        <div class="detail-value">${structure.neighbors}</div>
      </div>
      
      <div class="detail-section">
        <div class="detail-label">⚡ 神经支配</div>
        <div class="detail-value">${structure.nerveSupply}</div>
      </div>
      
      <div class="detail-section">
        <div class="detail-label">🩸 血液供应</div>
        <div class="detail-value">${structure.bloodSupply}</div>
      </div>
      
      <div class="flex gap-4 mt-4">
        <button class="btn btn-primary btn-full" onclick="askAIAbout(${structure.id})">
          🤖 向AI提问
        </button>
        <button class="btn btn-secondary" onclick="bookmarkStructure(${structure.id})">
          ${isBookmarked(id) ? '★ 已收藏' : '☆ 收藏'}
        </button>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
}

function isBookmarked(id) {
  const progress = AnatomyData.getLearningProgress();
  return progress.bookmarks.includes(id);
}

function bookmarkStructure(id) {
  const progress = AnatomyData.getLearningProgress();
  const index = progress.bookmarks.indexOf(id);
  if (index === -1) {
    progress.bookmarks.push(id);
    showToast('已添加到收藏', 'success');
  } else {
    progress.bookmarks.splice(index, 1);
    showToast('已取消收藏', 'success');
  }
  AnatomyData.saveLearningProgress(progress);
  showKnowledgeDetail(id); // 刷新UI
}

function askAIAbout(id) {
  const structure = AnatomyData.structures.find(s => s.id === id);
  if (!structure) return;
  
  closeModal('knowledge-modal');
  navigate('chat');
  
  // 自动填入问题并发送
  const system = AnatomyData.systems.find(s => s.id === structure.system);
  const question = `请详细讲解${structure.name}（${structure.nameEn}）的解剖学知识，包括：\n1. 解剖位置和形态特征\n2. 重要毗邻关系\n3. 主要生理功能\n4. 神经支配和血液供应\n5. 临床意义和常见疾病`;
  
  document.getElementById('chat-input').value = question;
  sendMessage();
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove('active');
}

// ═══════════ Toast 提示 ═══════════
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = 'toast ' + type;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ═══════════ Markdown 渲染 ═══════════
function renderMarkdown(text) {
  // 简单Markdown解析
  let html = text
    // 标题
    .replace(/^### (.+)$/gm, '<h3 style="font-size:18px;font-weight:700;margin:16px 0 8px">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:20px;font-weight:700;margin:20px 0 12px">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:22px;font-weight:700;margin:24px 0 16px">$1</h1>')
    // 粗体和斜体
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:600">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 列表
    .replace(/^- (.+)$/gm, '<li style="margin:4px 0 4px 20px">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li style="margin:4px 0 4px 20px;list-style:decimal">$2</li>')
    // 换行
    .replace(/\n\n/g, '</p><p style="margin:12px 0">')
    .replace(/\n/g, '<br>');
  
  // 包裹段落
  if (!html.startsWith('<')) {
    html = '<p style="margin:12px 0">' + html + '</p>';
  }
  
  return html;
}

// ═══════════ 滚动到底部 ═══════════
function scrollChatToBottom() {
  const container = document.querySelector('.chat-messages');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

// ═══════════ 模型选择 ═══════════
function selectModel(modelId, el) {
  AppState.currentModel = modelId;
  localStorage.setItem('anatomy_model', modelId);
  
  document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  
  showToast(`已切换到 ${CONFIG.MODELS.find(m => m.id === modelId)?.name}`, 'success');
}

// ═══════════ 设置面板 ═══════════
function toggleSettings() {
  const modal = document.getElementById('settings-modal');
  if (modal) {
    modal.classList.toggle('active');
    
    // 如果打开，渲染当前设置
    if (modal.classList.contains('active')) {
      renderSettings();
    }
  }
}

function renderSettings() {
  const modelBtns = document.getElementById('settings-model-btns');
  if (modelBtns) {
    const savedModel = localStorage.getItem('anatomy_model') || 'deepseek';
    modelBtns.innerHTML = CONFIG.MODELS.map(m => `
      <button class="model-btn ${m.id === savedModel ? 'active' : ''}" 
              onclick="selectModel('${m.id}', this)">
        ${m.name}
      </button>
    `).join('');
  }
}

// ═══════════ 初始化 ═══════════
document.addEventListener('DOMContentLoaded', () => {
  // 加载保存的模型选择
  const savedModel = localStorage.getItem('anatomy_model');
  if (savedModel) AppState.currentModel = savedModel;
  
  // 初始化路由
  initRouter();
  
  // 初始化所有Tab点击事件
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', () => {
      const page = tab.dataset.page;
      if (page) navigate(page);
    });
  });
  
  // 初始化模态框关闭
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
  
  // Modal关闭按钮
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });
  
  console.log('🫀 解剖通Pro 已加载');
});

// ═══════════ 导出 ═══════════
window.App = {
  state: AppState,
  config: CONFIG,
  navigate,
  showToast,
  renderMarkdown,
  scrollChatToBottom,
  showKnowledgeDetail,
  closeModal,
};
