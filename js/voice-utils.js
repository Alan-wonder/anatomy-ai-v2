// ═══════════ 解剖通Pro — 语音问答模块 ═══════════

// ═══════════ 语音状态 ═══════════
const VoiceState = {
  isRecording: false,
  isSpeaking: false,
  recognition: null,
  synthesis: window.speechSynthesis,
  recognitionLang: 'zh-CN',
};

// ═══════════ 检查浏览器支持 ═══════════
function checkVoiceSupport() {
  const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  const hasSpeechSynthesis = 'speechSynthesis' in window;
  
  return {
    speechRecognition: hasSpeechRecognition,
    speechSynthesis: hasSpeechSynthesis,
    fullSupport: hasSpeechRecognition && hasSpeechSynthesis,
  };
}

// ═══════════ 初始化语音识别 ═══════════
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.warn('当前浏览器不支持语音识别');
    return null;
  }
  
  const recognition = new SpeechRecognition();
  recognition.continuous = false;      // 单次识别
  recognition.interimResults = true;    // 返回临时结果
  recognition.lang = VoiceState.recognitionLang;
  
  recognition.onstart = () => {
    VoiceState.isRecording = true;
    updateVoiceButton();
    App.showToast('🎤 正在聆听...', '');
  };
  
  recognition.onresult = (event) => {
    const results = event.results;
    const transcript = Array.from(results)
      .map(result => result[0].transcript)
      .join('');
    
    // 显示临时结果
    const input = document.getElementById('chat-input');
    if (input && results[0].isFinal) {
      input.value = transcript;
      VoiceState.isRecording = false;
      updateVoiceButton();
    }
  };
  
  recognition.onerror = (event) => {
    console.error('语音识别错误:', event.error);
    VoiceState.isRecording = false;
    updateVoiceButton();
    
    if (event.error === 'no-speech') {
      App.showToast('未检测到语音，请重试', 'warning');
    } else if (event.error === 'not-allowed') {
      App.showToast('请允许麦克风权限', 'error');
    } else {
      App.showToast('语音识别出错', 'error');
    }
  };
  
  recognition.onend = () => {
    VoiceState.isRecording = false;
    updateVoiceButton();
  };
  
  return recognition;
}

// ═══════════ 开始录音 ═══════════
function startRecording() {
  if (VoiceState.isRecording) return;
  
  if (!VoiceState.recognition) {
    VoiceState.recognition = initSpeechRecognition();
  }
  
  if (!VoiceState.recognition) {
    App.showToast('浏览器不支持语音识别', 'error');
    return;
  }
  
  try {
    VoiceState.recognition.start();
  } catch (e) {
    // 如果已经在运行，先停止
    VoiceState.recognition.stop();
    setTimeout(() => {
      VoiceState.recognition.start();
    }, 100);
  }
}

// ═══════════ 停止录音 ═══════════
function stopRecording() {
  if (VoiceState.recognition && VoiceState.isRecording) {
    VoiceState.recognition.stop();
  }
}

// ═══════════ 切换录音状态 ═══════════
function toggleRecording() {
  if (VoiceState.isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

// ═══════════ 更新语音按钮状态 ═══════════
function updateVoiceButton() {
  const buttons = document.querySelectorAll('.voice-btn');
  buttons.forEach(btn => {
    btn.classList.toggle('recording', VoiceState.isRecording);
    btn.innerHTML = VoiceState.isRecording ? '🔴' : '🎤';
  });
}

// ═══════════ 语音合成（朗读） ═══════════
function speakText(text) {
  if (!VoiceState.synthesis) {
    console.warn('当前浏览器不支持语音合成');
    return;
  }
  
  // 取消之前的朗读
  VoiceState.synthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 1.0;      // 语速
  utterance.pitch = 1.0;     // 音调
  utterance.volume = 1.0;    // 音量
  
  // 选择中文语音
  const voices = VoiceState.synthesis.getVoices();
  const chineseVoice = voices.find(v => v.lang.includes('zh'));
  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }
  
  utterance.onstart = () => {
    VoiceState.isSpeaking = true;
    updateSpeakButton();
  };
  
  utterance.onend = () => {
    VoiceState.isSpeaking = false;
    updateSpeakButton();
  };
  
  utterance.onerror = (event) => {
    console.error('语音合成错误:', event.error);
    VoiceState.isSpeaking = false;
    updateSpeakButton();
  };
  
  VoiceState.synthesis.speak(utterance);
}

// ═══════════ 停止朗读 ═══════════
function stopSpeaking() {
  if (VoiceState.synthesis) {
    VoiceState.synthesis.cancel();
    VoiceState.isSpeaking = false;
    updateSpeakButton();
  }
}

// ═══════════ 切换朗读状态 ═══════════
function toggleSpeaking() {
  if (VoiceState.isSpeaking) {
    stopSpeaking();
  }
}

// ═══════════ 更新朗读按钮状态 ═══════════
function updateSpeakButton() {
  const buttons = document.querySelectorAll('.speak-btn');
  buttons.forEach(btn => {
    btn.classList.toggle('active', VoiceState.isSpeaking);
    btn.innerHTML = VoiceState.isSpeaking ? '⏹️' : '🔊';
  });
}

// ═══════════ 朗读AI回复 ═══════════
function speakLastMessage() {
  const messages = document.querySelectorAll('.message-assistant .message-content');
  if (messages.length === 0) {
    App.showToast('没有可朗读的消息', 'warning');
    return;
  }
  
  const lastMessage = messages[messages.length - 1];
  const text = lastMessage.textContent;
  
  if (text) {
    speakText(text);
    App.showToast('开始朗读', 'success');
  }
}

// ═══════════ 朗读知识详情 ═══════════
function speakKnowledgeDetail() {
  const detailEl = document.querySelector('.knowledge-detail .detail-value');
  if (detailEl) {
    const text = detailEl.textContent;
    if (text) {
      speakText(text);
    }
  }
}

// ═══════════ 设置语音语言 ═══════════
function setVoiceLanguage(lang) {
  VoiceState.recognitionLang = lang;
  
  if (VoiceState.recognition) {
    VoiceState.recognition.lang = lang;
  }
  
  App.showToast(`语音语言已切换`, 'success');
}

// ═══════════ 获取可用语音列表 ═══════════
function getAvailableVoices() {
  return new Promise((resolve) => {
    if (!VoiceState.synthesis) {
      resolve([]);
      return;
    }
    
    let voices = VoiceState.synthesis.getVoices();
    
    if (voices.length === 0) {
      VoiceState.synthesis.onvoiceschanged = () => {
        voices = VoiceState.synthesis.getVoices();
        resolve(voices);
      };
    } else {
      resolve(voices);
    }
  });
}

// ═══════════ 初始化 ═══════════
document.addEventListener('DOMContentLoaded', async () => {
  const support = checkVoiceSupport();
  
  if (!support.speechRecognition) {
    console.warn('浏览器不支持语音识别功能');
  }
  
  if (!support.speechSynthesis) {
    console.warn('浏览器不支持语音合成功能');
  }
  
  // 预加载语音列表
  if (support.speechSynthesis) {
    await getAvailableVoices();
  }
  
  // 初始化语音识别
  if (support.speechRecognition) {
    VoiceState.recognition = initSpeechRecognition();
  }
  
  // 添加全局键盘快捷键
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Shift + V: 语音输入
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
      e.preventDefault();
      toggleRecording();
    }
    // Ctrl/Cmd + Shift + S: 停止朗读
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      stopSpeaking();
    }
  });
  
  console.log('🎤 语音模块已加载');
});

// ═══════════ 导出 ═══════════
window.VoiceUtils = {
  state: VoiceState,
  support: checkVoiceSupport,
  startRecording,
  stopRecording,
  toggleRecording,
  speakText,
  stopSpeaking,
  toggleSpeaking,
  speakLastMessage,
  speakKnowledgeDetail,
  setVoiceLanguage,
  getAvailableVoices,
};
