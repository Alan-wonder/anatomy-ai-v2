// ═══════════ 解剖通Pro — 自测题库模块 ═══════════

// ═══════════ 题库数据 ═══════════
const QUIZ_QUESTIONS = [
  { id: 1, system: 'skeletal', question: '成人的骨数量是多少？', options: ['196块', '206块', '216块', '226块'], correct: 1, explanation: '成人共有206块骨骼，包括躯干骨51块、上肢骨64块、下肢骨62块、颅骨29块。' },
  { id: 2, system: 'skeletal', question: '颈椎有多少节？', options: ['5节', '6节', '7节', '8节'], correct: 2, explanation: '颈椎共7节，第1、2颈椎形态特殊，分别称为寰椎和枢椎。' },
  { id: 3, system: 'skeletal', question: '人体最长的骨骼是？', options: ['肱骨', '胫骨', '股骨', '脊柱'], correct: 2, explanation: '股骨是大腿骨，长度约为身高的1/4，是人体最长的骨骼。' },
  { id: 4, system: 'skeletal', question: '脊柱共有多少个椎骨？', options: ['30节', '32节', '33节', '34节'], correct: 2, explanation: '脊柱由33节椎骨组成：颈椎7节、胸椎12节、腰椎5节、骶椎5节（融合）、尾椎4节（融合）。' },
  { id: 5, system: 'skeletal', question: '以下哪块骨不参与肘关节的组成？', options: ['肱骨', '桡骨', '尺骨', '锁骨'], correct: 3, explanation: '肘关节由肱骨下端和尺骨、桡骨上端构成，锁骨不参与肘关节组成。' },
  { id: 6, system: 'muscular', question: '肱二头肌的主要作用是？', options: ['伸肘关节', '屈肘关节', '内收肩关节', '外展肩关节'], correct: 1, explanation: '肱二头肌位于上臂前侧，主要功能是屈肘关节和前臂旋后。' },
  { id: 7, system: 'muscular', question: '股四头肌止于哪里？', options: ['胫骨粗隆', '腓骨头', '跟骨', '距骨'], correct: 0, explanation: '股四头肌通过髌韧带止于胫骨粗隆，是伸膝关节的主要肌肉。' },
  { id: 8, system: 'muscular', question: '膈肌的神经支配来自？', options: ['迷走神经', '膈神经', '肋间神经', '腰丛'], correct: 1, explanation: '膈神经(C3-C5)是膈肌的主要运动神经，同时传导感觉。' },
  { id: 9, system: 'muscular', question: '小腿三头肌包括？', options: ['腓肠肌、比目鱼肌', '腓肠肌、胫骨前肌', '比目鱼肌、腓骨长肌', '腓肠肌、腓骨短肌'], correct: 0, explanation: '小腿三头肌由腓肠肌和比目鱼肌组成，主要功能是跖屈踝关节。' },
  { id: 10, system: 'muscular', question: '胸大肌止于？', options: ['肱骨小结节', '肱骨大结节嵴', '喙突', '肩峰'], correct: 1, explanation: '胸大肌止于肱骨大结节嵴，主要功能是内收、内旋、屈曲肩关节。' },
  { id: 11, system: 'nervous', question: '大脑分为几个叶？', options: ['3叶', '4叶', '5叶', '6叶'], correct: 1, explanation: '大脑分为额叶、顶叶、颞叶、枕叶4个叶。' },
  { id: 12, system: 'nervous', question: '坐骨神经来自哪个神经丛？', options: ['颈丛', '臂丛', '腰丛', '骶丛'], correct: 3, explanation: '坐骨神经来自骶丛(L4-S3)，是人体最粗大的神经。' },
  { id: 13, system: 'nervous', question: '脑干包括？', options: ['间脑、中脑、脑桥', '中脑、脑桥、延髓', '中脑、间脑、小脑', '延髓、脑桥、小脑'], correct: 1, explanation: '脑干包括中脑、脑桥和延髓，是生命中枢所在。' },
  { id: 14, system: 'nervous', question: '正中神经损伤后可能出现？', options: ['爪形手', '猿掌', '垂腕', '足下垂'], correct: 1, explanation: '正中神经损伤导致鱼际肌萎缩，形成"猿掌"畸形。' },
  { id: 15, system: 'nervous', question: '小脑的主要功能是？', options: ['思维和意识', '协调运动', '视觉处理', '听觉处理'], correct: 1, explanation: '小脑主要功能是协调随意运动、维持身体平衡和调节肌张力。' },
  { id: 16, system: 'cardiovascular', question: '心脏位于哪个腔？', options: ['左侧胸腔', '右侧胸腔', '纵隔', '腹腔'], correct: 2, explanation: '心脏位于胸腔纵隔内，略偏左侧，约2/3在正中线左侧。' },
  { id: 17, system: 'cardiovascular', question: '左心室的出口是？', options: ['肺动脉口', '主动脉口', '左房室口', '右房室口'], correct: 1, explanation: '左心室出口为主动脉口，有主动脉瓣防止血液反流。' },
  { id: 18, system: 'cardiovascular', question: '冠状动脉供血给？', options: ['肺', '脑', '心脏', '肝脏'], correct: 2, explanation: '冠状动脉起于主动脉根部，分为左右冠状动脉，供血给心脏自身。' },
  { id: 19, system: 'cardiovascular', question: '肺循环的起点和终点是？', options: ['左心房-右心室', '右心室-左心房', '右心房-左心室', '左心室-左心房'], correct: 1, explanation: '肺循环：右心室→肺动脉→肺→肺静脉→左心房。' },
  { id: 20, system: 'cardiovascular', question: '下腔静脉收集哪里的静脉血？', options: ['上半身', '心', '肺', '下肢和盆部'], correct: 3, explanation: '下腔静脉收集下肢、盆部和腹部的静脉血，注入右心房。' },
  { id: 21, system: 'respiratory', question: '上呼吸道包括？', options: ['喉和气管', '鼻、咽、喉', '喉、气管、支气管', '鼻腔、喉、气管'], correct: 1, explanation: '上呼吸道包括鼻、咽、喉，是呼吸道的起始部分。' },
  { id: 22, system: 'respiratory', question: '右肺有几个肺叶？', options: ['1叶', '2叶', '3叶', '4叶'], correct: 2, explanation: '右肺分上、中、下三叶，左肺分上、下两叶。' },
  { id: 23, system: 'respiratory', question: '异物容易坠入哪侧支气管？', options: ['左侧', '右侧', '两侧机会均等', '取决于体位'], correct: 1, explanation: '右主支气管粗短，走向较垂直，异物更容易进入右肺。' },
  { id: 24, system: 'respiratory', question: '肺换气发生在？', options: ['呼吸道', '肺毛细血管', '肺泡', '支气管'], correct: 2, explanation: '肺泡是气体交换的场所，O2进入血液，CO2排出。' },
  { id: 25, system: 'respiratory', question: '胸膜腔的特点是？', options: ['与大气相通', '充满空气', '呈负压', '与腹膜相通'], correct: 2, explanation: '胸膜腔是密闭的潜在腔隙，呈负压，有利于肺扩张。' },
  { id: 26, system: 'digestive', question: '食管有几个生理性狭窄？', options: ['1个', '2个', '3个', '4个'], correct: 2, explanation: '食管有3个生理性狭窄：食管起始处、左主支气管跨越处、穿膈处。' },
  { id: 27, system: 'digestive', question: '胃的出口是？', options: ['贲门', '幽门', '胃底', '胃体'], correct: 1, explanation: '胃的出口为幽门，通向十二指肠，有幽门括约肌控制排空。' },
  { id: 28, system: 'digestive', question: '胆汁由哪个器官分泌？', options: ['胆囊', '胰', '肝', '胃'], correct: 2, explanation: '胆汁由肝细胞分泌，胆囊储存和浓缩胆汁。' },
  { id: 29, system: 'digestive', question: '小肠长约多少米？', options: ['1-2米', '3-4米', '5-7米', '8-10米'], correct: 2, explanation: '小肠长约5-7米，是消化吸收的主要场所。' },
  { id: 30, system: 'digestive', question: '阑尾开口于？', options: ['升结肠', '横结肠', '盲肠', '回肠'], correct: 2, explanation: '阑尾开口于盲肠后内侧壁，是盲肠的盲端突起。' },
  { id: 31, system: 'urinary', question: '肾门平对哪个椎体？', options: ['T12', 'L1', 'L2', 'L3'], correct: 1, explanation: '肾门平对第1腰椎体，是肾血管、肾盂等出入的部位。' },
  { id: 32, system: 'urinary', question: '输尿管有几个狭窄？', options: ['1个', '2个', '3个', '4个'], correct: 2, explanation: '输尿管有3个狭窄：肾盂输尿管移行处、跨过髂血管处、穿膀胱壁处。' },
  { id: 33, system: 'urinary', question: '膀胱三角位于哪里？', options: ['膀胱底', '膀胱体', '膀胱顶', '膀胱颈'], correct: 0, explanation: '膀胱三角位于膀胱底内面，是两输尿管口和尿道内口之间的三角形区域。' },
  { id: 34, system: 'urinary', question: '肾单位是？', options: ['肾小管', '肾小球', '肾单位和集合管', '肾小体和肾小管'], correct: 3, explanation: '肾单位是肾的基本功能单位，由肾小体和肾小管组成。' },
  { id: 35, system: 'endocrine', question: '垂体位于哪里？', options: ['颅中窝', '蝶鞍垂体窝', '颅后窝', '鼻腔后方'], correct: 1, explanation: '垂体位于颅底蝶鞍的垂体窝内，是最重要的内分泌腺。' },
  { id: 36, system: 'endocrine', question: '甲状腺分泌什么激素？', options: ['胰岛素', '甲状腺素', '肾上腺素', '生长抑素'], correct: 1, explanation: '甲状腺分泌甲状腺素(T3、T4)，调节基础代谢率。' },
  { id: 37, system: 'endocrine', question: '甲状旁腺位于？', options: ['甲状腺前面', '甲状腺侧面', '甲状腺背面', '气管前面'], correct: 2, explanation: '甲状旁腺贴附于甲状腺背面，调节钙磷代谢。' },
  { id: 38, system: 'endocrine', question: '胰岛素由哪种细胞分泌？', options: ['A细胞', 'B细胞', 'D细胞', 'PP细胞'], correct: 1, explanation: '胰岛B细胞分泌胰岛素，降低血糖；A细胞分泌胰高血糖素，升高血糖。' },
];

// ═══════════ 测验状态 ═══════════
const QuizState = {
  system: 'all',
  count: 5,
  questions: [],
  currentIndex: 0,
  score: 0,
  answers: [],
};

function initQuizPage() {
  renderQuizSystemSelect();
  renderQuizCountSelect();
}

function renderQuizSystemSelect() {
  const container = document.getElementById('quiz-system-select');
  if (!container) return;
  container.innerHTML = `
    <button class="quiz-system-btn active" data-system="all" onclick="selectQuizSystem('all', this)">
      📊 综合
    </button>
    ${AnatomyData.systems.map(s => `
      <button class="quiz-system-btn" data-system="${s.id}" onclick="selectQuizSystem('${s.id}', this)">
        ${s.icon} ${s.name}
      </button>
    `).join('')}
  `;
}

function renderQuizCountSelect() {
  const container = document.getElementById('quiz-count-select');
  if (!container) return;
  container.innerHTML = [5, 10, 20].map(count => `
    <button class="quiz-count-btn ${QuizState.count === count ? 'active' : ''}" 
            onclick="selectQuizCount(${count}, this)">
      ${count}题
    </button>
  `).join('');
}

function selectQuizSystem(system, el) {
  QuizState.system = system;
  document.querySelectorAll('.quiz-system-btn').forEach(btn => {
    btn.classList.toggle('active', btn === el);
  });
}

function selectQuizCount(count, el) {
  QuizState.count = count;
  document.querySelectorAll('.quiz-count-btn').forEach(btn => {
    btn.classList.toggle('active', btn === el);
  });
}

function startQuiz() {
  let questions = [...QUIZ_QUESTIONS];
  if (QuizState.system !== 'all') {
    questions = questions.filter(q => q.system === QuizState.system);
  }
  questions = shuffleArray(questions).slice(0, QuizState.count);
  
  if (questions.length === 0) {
    App.showToast('该系统暂无题目', 'warning');
    return;
  }
  
  QuizState.questions = questions;
  QuizState.currentIndex = 0;
  QuizState.score = 0;
  QuizState.answers = [];
  
  document.getElementById('quiz-start-panel').style.display = 'none';
  document.getElementById('quiz-active-panel').style.display = 'block';
  
  showQuestion();
}

function showQuestion() {
  const q = QuizState.questions[QuizState.currentIndex];
  const progress = QuizState.currentIndex + 1;
  const total = QuizState.questions.length;
  const sys = AnatomyData.systems.find(s => s.id === q.system);
  
  document.getElementById('quiz-progress').textContent = `${progress}/${total}`;
  document.getElementById('quiz-progress-bar').style.width = `${(progress / total) * 100}%`;
  
  const container = document.getElementById('quiz-question-container');
  container.innerHTML = `
    <div class="quiz-question-system">${sys?.icon || '📚'} ${sys?.name || ''}</div>
    <div class="quiz-question-text">${q.question}</div>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `
        <div class="quiz-option" onclick="selectAnswer(${i})">
          <div class="quiz-letter">${String.fromCharCode(65 + i)}</div>
          <div class="quiz-option-text">${opt}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function selectAnswer(index) {
  const q = QuizState.questions[QuizState.currentIndex];
  const isCorrect = index === q.correct;
  
  QuizState.answers.push({ questionId: q.id, selected: index, correct: q.correct, isCorrect });
  if (isCorrect) QuizState.score++;
  
  const options = document.querySelectorAll('.quiz-option');
  options.forEach((opt, i) => {
    opt.classList.remove('selected', 'correct', 'wrong');
    if (i === index) {
      opt.classList.add(isCorrect ? 'correct' : 'wrong');
    }
    if (i === q.correct && !isCorrect) {
      opt.classList.add('correct');
    }
    opt.style.pointerEvents = 'none';
  });
  
  setTimeout(() => { showExplanation(q); }, 500);
}

function showExplanation(question) {
  const container = document.getElementById('quiz-explanation');
  container.innerHTML = `
    <div class="quiz-explanation-box">
      <div class="quiz-explanation-text">${question.explanation}</div>
    </div>
    <button class="btn btn-primary" onclick="nextQuestion()">
      ${QuizState.currentIndex < QuizState.questions.length - 1 ? '下一题 →' : '查看结果'}
    </button>
  `;
  container.style.display = 'block';
}

function nextQuestion() {
  document.getElementById('quiz-explanation').style.display = 'none';
  if (QuizState.currentIndex < QuizState.questions.length - 1) {
    QuizState.currentIndex++;
    showQuestion();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  document.getElementById('quiz-active-panel').style.display = 'none';
  document.getElementById('quiz-result-panel').style.display = 'block';
  
  const score = QuizState.score;
  const total = QuizState.questions.length;
  const percentage = Math.round((score / total) * 100);
  
  document.getElementById('quiz-score').textContent = `${score}/${total}`;
  document.getElementById('quiz-percentage').textContent = `${percentage}%`;
  document.getElementById('quiz-score-bar').style.width = `${percentage}%`;
  document.getElementById('quiz-result-text').textContent = getResultText(percentage);
  
  saveQuizProgress();
}

function getResultText(percentage) {
  if (percentage >= 90) return '🎉 太棒了！掌握得非常扎实！';
  if (percentage >= 70) return '👍 不错！继续保持！';
  if (percentage >= 50) return '💪 还需努力，加油！';
  return '📚 建议重新复习相关知识点';
}

function saveQuizProgress() {
  const progress = AnatomyData.getLearningProgress();
  QuizState.answers.forEach(answer => {
    if (!progress.quizResults[answer.questionId]) {
      progress.quizResults[answer.questionId] = { correct: 0, wrong: 0 };
    }
    if (answer.isCorrect) {
      progress.quizResults[answer.questionId].correct++;
    } else {
      progress.quizResults[answer.questionId].wrong++;
    }
  });
  AnatomyData.saveLearningProgress(progress);
}

function resetQuiz() {
  QuizState.questions = [];
  QuizState.currentIndex = 0;
  QuizState.score = 0;
  QuizState.answers = [];
  
  document.getElementById('quiz-result-panel').style.display = 'none';
  document.getElementById('quiz-active-panel').style.display = 'none';
  document.getElementById('quiz-explanation').style.display = 'none';
  document.getElementById('quiz-start-panel').style.display = 'block';
}

function retryQuiz() {
  resetQuiz();
  startQuiz();
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

document.addEventListener('DOMContentLoaded', () => {
  initQuizPage();
});
