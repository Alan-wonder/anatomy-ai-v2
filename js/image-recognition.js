// ═══════════ 解剖通Pro — 图片识别模块 ═══════════

// ═══════════ 状态 ═══════════
let scanFileData = null;
let scanAnnotations = [];

// ═══════════ 初始化扫描页面 ═══════════
function initScanPage() {
  const uploadArea = document.getElementById('upload-area');
  if (!uploadArea) return;
  
  // 点击上传
  uploadArea.addEventListener('click', () => {
    document.getElementById('scan-input')?.click();
  });
  
  // 拖拽上传
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  });
}

// ═══════════ 处理文件 ═══════════
function handleFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    scanFileData = e.target.result;
    showImagePreview(scanFileData);
  };
  reader.readAsDataURL(file);
}

// ═══════════ 显示图片预览 ═══════════
function showImagePreview(dataUrl) {
  const container = document.getElementById('image-preview-container');
  const preview = document.getElementById('image-preview');
  const uploadArea = document.getElementById('upload-area');
  const resultPanel = document.getElementById('scan-result-panel');
  
  if (preview) {
    preview.src = dataUrl;
    preview.style.display = 'block';
  }
  
  if (uploadArea) {
    uploadArea.style.display = 'none';
  }
  
  if (container) {
    container.style.display = 'block';
  }
  
  if (resultPanel) {
    resultPanel.style.display = 'none';
  }
  
  // 清空之前的标注
  scanAnnotations = [];
  clearAnnotations();
}

// ═══════════ 清空图片 ═══════════
function clearScan() {
  scanFileData = null;
  scanAnnotations = [];
  
  const uploadArea = document.getElementById('upload-area');
  const container = document.getElementById('image-preview-container');
  const resultPanel = document.getElementById('scan-result-panel');
  const input = document.getElementById('scan-input');
  
  if (uploadArea) uploadArea.style.display = 'block';
  if (container) container.style.display = 'none';
  if (resultPanel) resultPanel.style.display = 'none';
  if (input) input.value = '';
  
  clearAnnotations();
}

// ═══════════ 开始识别 ═══════════
async function recognizeImage() {
  if (!scanFileData) return;
  
  const loadingEl = document.getElementById('scan-loading');
  const resultPanel = document.getElementById('scan-result-panel');
  const resultBody = document.getElementById('scan-result-body');
  
  if (loadingEl) loadingEl.style.display = 'block';
  if (resultPanel) resultPanel.style.display = 'block';
  if (resultBody) resultBody.innerHTML = '<div class="loading-spinner"></div>';
  
  try {
    const response = await fetch(App.config.API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: App.state.currentModel,
        messages: [
          {
            role: 'system',
            content: `你是专业的人体解剖学图像识别专家。请仔细分析图片中的解剖学结构，并按以下JSON格式返回结果：

{
  "structures": [
    {
      "id": 1,
      "name": "结构名称",
      "nameEn": "English Name",
      "description": "简要描述",
      "position": { "x": 0.3, "y": 0.4 }  // 图片中的相对坐标（0-1）
    }
  ],
  "summary": "整体描述总结",
  "clinical": "临床意义简述"
}

请尽量识别3-8个主要结构，并给出准确的相对位置坐标。`
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: '请识别这张解剖学图片中的所有结构，按指定格式返回结果。' },
              { type: 'image_url', image_url: { url: scanFileData } }
            ]
          }
        ]
      }),
    });
    
    if (!response.ok) {
      throw new Error(`请求失败 (${response.status})`);
    }
    
    // 读取流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        
        const dataStr = trimmed.slice(6);
        if (dataStr === '[DONE]') break;
        
        try {
          const data = JSON.parse(dataStr);
          const delta = data.choices?.[0]?.delta?.content;
          if (delta) {
            fullText += delta;
          }
        } catch (e) {}
      }
    }
    
    // 解析结构标注
    await parseAndDisplayResults(fullText);
    
  } catch (error) {
    if (resultBody) {
      resultBody.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">❌</div>
          <div class="empty-text">识别失败：${error.message}</div>
        </div>
      `;
    }
  } finally {
    if (loadingEl) loadingEl.style.display = 'none';
  }
}

// ═══════════ 解析并显示结果 ═══════════
async function parseAndDisplayResults(text) {
  const resultBody = document.getElementById('scan-result-body');
  if (!resultBody) return;
  
  // 尝试从文本中提取JSON
  let structures = [];
  let summary = '';
  let clinical = '';
  
  // 尝试多种方式提取JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[0]);
      structures = data.structures || [];
      summary = data.summary || '';
      clinical = data.clinical || '';
    } catch (e) {
      // JSON解析失败，使用文本描述
      structures = [];
    }
  }
  
  // 如果没有结构数据，生成通用描述
  if (structures.length === 0) {
    // 从AI回复中提取结构名称
    const lines = text.split('\n').filter(l => l.trim());
    const structureNames = [];
    
    lines.forEach(line => {
      // 匹配常见模式
      const patterns = [
        /^[一二三四五六七八九十\d+[\.、)](.+?)[\(（]/,
        /结构[一二三四五六七八九十\d+](.+?)[：:]/,
      ];
      
      patterns.forEach(pattern => {
        const match = line.match(pattern);
        if (match) {
          structureNames.push(match[1].trim());
        }
      });
    });
    
    // 生成简要描述
    resultBody.innerHTML = `
      <div class="scan-result-section">
        <h3 style="font-size:16px;font-weight:600;margin-bottom:12px">🔍 识别结果</h3>
        <div style="line-height:1.8;white-space:pre-wrap">${App.renderMarkdown(text)}</div>
      </div>
    `;
    
    App.showToast('已识别到相关结构，请查看结果', 'success');
    return;
  }
  
  // 显示结构标注
  displayAnnotations(structures);
  
  // 渲染结果面板
  resultBody.innerHTML = `
    <div class="scan-result-section">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:12px">🔬 已识别结构</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px">
        ${structures.map((s, i) => `
          <div class="structure-tag" onclick="highlightAnnotation(${i})" 
               style="padding:8px 16px;background:rgba(10,132,255,0.1);border-radius:20px;cursor:pointer;transition:all 0.2s">
            <span style="display:inline-flex;width:24px;height:24px;background:#0A84FF;color:white;border-radius:50%;align-items:center;justify-content:center;font-size:12px;font-weight:700;margin-right:8px">${i + 1}</span>
            <strong>${s.name}</strong>
            ${s.nameEn ? `<span style="color:#64748B;font-size:13px">${s.nameEn}</span>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
    
    ${summary ? `
      <div class="scan-result-section">
        <h3 style="font-size:16px;font-weight:600;margin-bottom:12px">📋 结构概述</h3>
        <div style="line-height:1.8">${App.renderMarkdown(summary)}</div>
      </div>
    ` : ''}
    
    ${clinical ? `
      <div class="scan-result-section">
        <h3 style="font-size:16px;font-weight:600;margin-bottom:12px">💡 临床意义</h3>
        <div style="line-height:1.8">${App.renderMarkdown(clinical)}</div>
      </div>
    ` : ''}
    
    <div style="margin-top:20px">
      <button class="btn btn-primary btn-full" onclick="askAboutAllStructures()">
        🤖 向AI详细提问
      </button>
    </div>
  `;
  
  App.showToast(`已识别到 ${structures.length} 个解剖结构`, 'success');
}

// ═══════════ 显示标注 ═══════════
function displayAnnotations(structures) {
  const overlay = document.getElementById('annotation-overlay');
  if (!overlay) return;
  
  overlay.innerHTML = '';
  scanAnnotations = structures;
  
  structures.forEach((structure, index) => {
    if (!structure.position) return;
    
    const marker = document.createElement('div');
    marker.className = 'annotation-marker';
    marker.style.left = (structure.position.x * 100) + '%';
    marker.style.top = (structure.position.y * 100) + '%';
    marker.textContent = index + 1;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'annotation-tooltip';
    tooltip.innerHTML = `<strong>${structure.name}</strong>${structure.nameEn ? '<br>' + structure.nameEn : ''}`;
    
    marker.appendChild(tooltip);
    marker.addEventListener('click', () => {
      askAboutStructure(structure);
    });
    
    overlay.appendChild(marker);
  });
}

// ═══════════ 清除标注 ═══════════
function clearAnnotations() {
  const overlay = document.getElementById('annotation-overlay');
  if (overlay) {
    overlay.innerHTML = '';
  }
}

// ═══════════ 高亮标注 ═══════════
function highlightAnnotation(index) {
  const markers = document.querySelectorAll('.annotation-marker');
  markers.forEach((m, i) => {
    m.style.transform = i === index ? 'translate(-50%, -50%) scale(1.3)' : 'translate(-50%, -50%) scale(1)';
    m.style.zIndex = i === index ? '10' : '1';
  });
}

// ═══════════ 询问特定结构 ═══════════
function askAboutStructure(structure) {
  navigate('chat');
  
  const question = `请详细讲解"${structure.name}"（${structure.nameEn || ''}）：
1. 解剖位置和形态特征
2. 与相邻结构的关系
3. 主要功能和生理作用
4. 神经支配和血液供应
5. 临床意义和常见疾病`;
  
  document.getElementById('chat-input').value = question;
  sendMessage();
}

// ═══════════ 询问所有结构 ═══════════
function askAboutAllStructures() {
  navigate('chat');
  
  const names = scanAnnotations.map(s => s.name).join('、');
  const question = `请详细讲解以下解剖结构的完整知识：${names}
每个结构请按以下框架讲解：
1. 解剖位置与形态特征
2. 重要毗邻关系
3. 主要功能
4. 神经血管支配
5. 临床意义`;
  
  document.getElementById('chat-input').value = question;
  sendMessage();
}

// ═══════════ 切换标注显示 ═══════════
function toggleAnnotations() {
  const overlay = document.getElementById('annotation-overlay');
  if (overlay) {
    overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
  }
}

// ═══════════ 初始化 ═══════════
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('scan-input');
  if (input) {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleFile(file);
    });
  }
});
