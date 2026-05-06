// ═══════════ 解剖通Pro — 智能学习路径模块 ═══════════

// ═══════════ 学习路径状态 ═══════════
const LearningPathState = {
  currentPhase: 'overview', // overview, system, structure
  currentSystemId: null,
  currentStructureId: null,
  recommendedQueue: [],
  reviewQueue: [],
};

// ═══════════ 初始化学习路径页面 ═══════════
function renderLearningPath() {
  const progress = AnatomyData.getLearningProgress();
  const total = AnatomyData.structures.length;
  const learned = progress.visitedStructures.length;
  const quizTotal = Object.values(progress.quizResults).reduce((sum, r) => sum + r.correct + r.wrong, 0);
  const quizCorrect = Object.values(progress.quizResults).reduce((sum, r) => sum + r.correct, 0);
  
  // 渲染概览
  renderPathOverview(progress, total, learned, quizTotal, quizCorrect);
  
  // 渲染推荐列表
  renderRecommendations();
  
  // 渲染复习队列
  renderReviewQueue();
  
  // 渲染收藏夹
  renderBookmarks();
}

// ═══════════ 渲染学习路径概览 ═══════════
function renderPathOverview(progress, total, learned, quizTotal, quizCorrect) {
  const accuracy = quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : 0;
  const masteryLevel = calculateMasteryLevel(progress);
  
  const container = document.getElementById('path-overview');
  if (!container) return;
  
  container.innerHTML = `
    <!-- 学习进度环形图 -->
    <div class="path-progress-ring">
      <svg viewBox="0 0 120 120" class="progress-ring-svg">
        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" stroke-width="8"/>
        <circle cx="60" cy="60" r="54" fill="none" stroke="url(#progressGradient)" stroke-width="8"
                stroke-linecap="round"
                stroke-dasharray="${(learned / total) * 339.3} 339.3"
                transform="rotate(-90 60 60)"
                style="transition: stroke-dasharray 0.5s ease"/>
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#0A84FF"/>
            <stop offset="100%" style="stop-color:#00C9B7"/>
          </linearGradient>
        </defs>
      </svg>
      <div class="progress-ring-text">
        <div class="progress-ring-percent">${Math.round((learned / total) * 100)}%</div>
        <div class="progress-ring-label">总进度</div>
      </div>
    </div>
    
    <!-- 统计卡片 -->
    <div class="path-stats-grid">
      <div class="path-stat-card">
        <div class="path-stat-icon">📚</div>
        <div class="path-stat-value">${learned}/${total}</div>
        <div class="path-stat-label">已学习</div>
      </div>
      <div class="path-stat-card">
        <div class="path-stat-icon">🎯</div>
        <div class="path-stat-value">${accuracy}%</div>
        <div class="path-stat-label">正确率</div>
      </div>
      <div class="path-stat-card">
        <div class="path-stat-icon">🔥</div>
        <div class="path-stat-value">${progress.streakDays}</div>
        <div class="path-stat-label">连续天数</div>
      </div>
      <div class="path-stat-card">
        <div class="path-stat-icon">⭐</div>
        <div class="path-stat-value">${progress.bookmarks.length}</div>
        <div class="path-stat-label">收藏</div>
      </div>
    </div>
    
    <!-- 掌握度指示 -->
    <div class="mastery-indicator">
      <div class="mastery-label">学习状态</div>
      <div class="mastery-bar">
        <div class="mastery-fill ${getMasteryClass(masteryLevel)}" 
             style="width: ${masteryLevel}%"></div>
      </div>
      <div class="mastery-text">${getMasteryText(masteryLevel)}</div>
    </div>
  `;
}

// ═══════════ 计算掌握度等级 ═══════════
function calculateMasteryLevel(progress) {
  const total = AnatomyData.structures.length;
  const learned = progress.visitedStructures.length;
  const quizTotal = Object.values(progress.quizResults).reduce((sum, r) => sum + r.correct + r.wrong, 0);
  const quizCorrect = Object.values(progress.quizResults).reduce((sum, r) => sum + r.correct, 0);
  
  if (total === 0) return 0;
  
  // 综合得分：学习进度占60%，答题正确率占40%
  const learnScore = (learned / total) * 60;
  const quizScore = quizTotal > 0 ? (quizCorrect / quizTotal) * 40 : 0;
  
  return Math.round(learnScore + quizScore);
}

function getMasteryClass(level) {
  if (level < 25) return 'beginner';
  if (level < 50) return 'elementary';
  if (level < 75) return 'intermediate';
  if (level < 90) return 'advanced';
  return 'master';
}

function getMasteryText(level) {
  if (level < 25) return '🌱 初学者 - 继续加油！';
  if (level < 50) return '📖 学习者 - 稳步前进！';
  if (level < 75) return '📈 进阶级 - 即将突破！';
  if (level < 90) return '🎓 高阶级 - 精益求精！';
  return '👑 大师级 - 解剖学专家！';
}

// ═══════════ 渲染推荐列表 ═══════════
function renderRecommendations() {
  const container = document.getElementById('recommendations-list');
  if (!container) return;
  
  const recommendations = AnatomyData.getRecommendedStructures(6);
  
  if (recommendations.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎉</div>
        <div class="empty-text">太棒了！已完成所有推荐学习</div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = recommendations.map(rec => {
    const sys = AnatomyData.systems.find(s => s.id === rec.structure.system);
    const isNew = rec.score === 0;
    
    return `
      <div class="learning-card" onclick="App.showKnowledgeDetail(${rec.structure.id})">
        <div class="learning-card-icon" style="background: ${sys?.colorLight || 'rgba(10,132,255,0.1)'}">
          ${sys?.icon || '📚'}
        </div>
        <div class="learning-card-content">
          <div class="learning-card-title">${rec.structure.name}</div>
          <div class="learning-card-desc">
            ${sys?.name || ''} · ${rec.reason}
          </div>
        </div>
        <span class="learning-card-badge ${isNew ? 'badge-new' : 'badge-review'}">
          ${isNew ? 'NEW' : '复习'}
        </span>
      </div>
    `;
  }).join('');
}

// ═══════════ 渲染复习队列 ═══════════
function renderReviewQueue() {
  const container = document.getElementById('review-queue-list');
  if (!container) return;
  
  const progress = AnatomyData.getLearningProgress();
  const reviewStructures = [];
  
  // 找出需要复习的结构
  progress.visitedStructures.forEach(id => {
    const quizResult = progress.quizResults[id];
    if (quizResult) {
      const accuracy = quizResult.correct / (quizResult.correct + quizResult.wrong);
      if (accuracy < 0.8) { // 正确率低于80%需要复习
        reviewStructures.push({
          id,
          accuracy,
          urgency: getUrgency(quizResult),
        });
      }
    }
  });
  
  // 按紧急程度排序
  reviewStructures.sort((a, b) => b.urgency - a.urgency);
  
  if (reviewStructures.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 30px;">
        <div class="empty-icon">✅</div>
        <div class="empty-text">暂无紧急复习内容</div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = reviewStructures.slice(0, 5).map(item => {
    const structure = AnatomyData.structures.find(s => s.id === item.id);
    const sys = AnatomyData.systems.find(s => s.id === structure?.system);
    
    return `
      <div class="review-card" onclick="App.showKnowledgeDetail(${item.id})">
        <div class="review-urgency urgency-${item.urgency}"></div>
        <div class="review-icon">${sys?.icon || '📚'}</div>
        <div class="review-content">
          <div class="review-name">${structure?.name || ''}</div>
          <div class="review-accuracy">正确率: ${Math.round(item.accuracy * 100)}%</div>
        </div>
      </div>
    `;
  }).join('');
}

// ═══════════ 计算复习紧急程度 ═══════════
function getUrgency(quizResult) {
  const total = quizResult.correct + quizResult.wrong;
  const accuracy = quizResult.correct / total;
  
  if (accuracy < 0.5) return 3; // 高紧急
  if (accuracy < 0.7) return 2; // 中紧急
  return 1; // 低紧急
}

// ═══════════ 渲染收藏夹 ═══════════
function renderBookmarks() {
  const container = document.getElementById('bookmarks-list');
  if (!container) return;
  
  const progress = AnatomyData.getLearningProgress();
  
  if (progress.bookmarks.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 30px;">
        <div class="empty-icon">☆</div>
        <div class="empty-text">暂无收藏内容</div>
        <div class="empty-text" style="font-size: 12px; margin-top: 8px;">
          在知识详情页点击"收藏"添加
        </div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = progress.bookmarks.map(id => {
    const structure = AnatomyData.structures.find(s => s.id === id);
    const sys = AnatomyData.systems.find(s => s.id === structure?.system);
    
    if (!structure) return '';
    
    return `
      <div class="bookmark-card" onclick="App.showKnowledgeDetail(${id})">
        <div class="bookmark-icon">${sys?.icon || '📚'}</div>
        <div class="bookmark-content">
          <div class="bookmark-name">${structure.name}</div>
          <div class="bookmark-system">${sys?.name || ''}</div>
        </div>
        <button class="bookmark-remove" onclick="event.stopPropagation(); removeBookmark(${id})">
          ×
        </button>
      </div>
    `;
  }).join('');
}

// ═══════════ 移除收藏 ═══════════
function removeBookmark(id) {
  const progress = AnatomyData.getLearningProgress();
  const index = progress.bookmarks.indexOf(id);
  if (index !== -1) {
    progress.bookmarks.splice(index, 1);
    AnatomyData.saveLearningProgress(progress);
    renderBookmarks();
    App.showToast('已取消收藏', 'success');
  }
}

// ═══════════ 按系统筛选学习 ═══════════
function filterBySystem(systemId) {
  LearningPathState.currentSystemId = systemId;
  
  // 更新按钮状态
  document.querySelectorAll('.system-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.system === systemId);
  });
  
  // 重新渲染推荐
  const container = document.getElementById('recommendations-list');
  if (!container) return;
  
  let structures = AnatomyData.structures;
  if (systemId !== 'all') {
    structures = structures.filter(s => s.system === systemId);
  }
  
  const recommendations = structures
    .map(s => ({
      score: getStructureScore(s.id),
      reason: getStructureReason(s.id),
      structure: s,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 6);
  
  container.innerHTML = recommendations.map(rec => {
    const sys = AnatomyData.systems.find(s => s.id === rec.structure.system);
    const isNew = rec.score === 0;
    
    return `
      <div class="learning-card" onclick="App.showKnowledgeDetail(${rec.structure.id})">
        <div class="learning-card-icon" style="background: ${sys?.colorLight || 'rgba(10,132,255,0.1)'}">
          ${sys?.icon || '📚'}
        </div>
        <div class="learning-card-content">
          <div class="learning-card-title">${rec.structure.name}</div>
          <div class="learning-card-desc">${rec.reason}</div>
        </div>
        <span class="learning-card-badge ${isNew ? 'badge-new' : 'badge-review'}">
          ${isNew ? 'NEW' : '复习'}
        </span>
      </div>
    `;
  }).join('');
}

// ═══════════ 获取结构得分 ═══════════
function getStructureScore(id) {
  const progress = AnatomyData.getLearningProgress();
  
  if (!progress.visitedStructures.includes(id)) return 0;
  
  const quizResult = progress.quizResults[id];
  if (!quizResult) return 10;
  
  const total = quizResult.correct + quizResult.wrong;
  const accuracy = quizResult.correct / total;
  
  return accuracy * 100 - (total * 5);
}

// ═══════════ 获取结构学习原因 ═══════════
function getStructureReason(id) {
  const progress = AnatomyData.getLearningProgress();
  
  if (!progress.visitedStructures.includes(id)) return '未学习';
  
  const quizResult = progress.quizResults[id];
  if (!quizResult) return '已浏览';
  
  const total = quizResult.correct + quizResult.wrong;
  const accuracy = quizResult.correct / total;
  
  return `正确率${Math.round(accuracy * 100)}%`;
}

// ═══════════ 学习路径：下一步 ═══════════
function nextInLearningPath() {
  const recommendations = AnatomyData.getRecommendedStructures(1);
  
  if (recommendations.length > 0) {
    App.showKnowledgeDetail(recommendations[0].structure.id);
  } else {
    App.showToast('太棒了！已完成所有学习任务', 'success');
  }
}

// ═══════════ 开始学习路径 ═══════════
function startLearningPath() {
  navigate('chat');
  
  const question = `请为我制定一个系统的解剖学学习计划，从基础开始，循序渐进。我想要系统地学习人体解剖学。`;
  
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = question;
    sendMessage();
  }
}

// ═══════════ 更新学习天数 ═══════════
function updateStreakDays() {
  const progress = AnatomyData.getLearningProgress();
  const today = new Date().toDateString();
  const lastDate = progress.lastStudyDate;
  
  if (lastDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastDate === yesterday.toDateString()) {
      progress.streakDays++;
    } else if (lastDate !== today) {
      progress.streakDays = 1;
    }
    
    progress.lastStudyDate = today;
    AnatomyData.saveLearningProgress(progress);
  }
}

// ═══════════ 初始化 ═══════════
document.addEventListener('DOMContentLoaded', () => {
  updateStreakDays();
});
