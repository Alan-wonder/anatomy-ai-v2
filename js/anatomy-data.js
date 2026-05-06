// ═══════════ 解剖学知识图谱数据 ═══════════
// 包含9大人体系统、60+解剖结构的完整信息

const ANATOMY_SYSTEMS = [
  { id: 'skeletal', name: '运动系统', icon: '🦴', nameEn: 'Skeletal System', color: '#F5F5DC', colorLight: '#FFFEF0' },
  { id: 'muscular', name: '肌肉系统', icon: '💪', nameEn: 'Muscular System', color: '#DC143C', colorLight: '#FFE4E1' },
  { id: 'nervous', name: '神经系统', icon: '🧠', nameEn: 'Nervous System', color: '#9370DB', colorLight: '#E6E6FA' },
  { id: 'cardiovascular', name: '心血管系统', icon: '❤️', nameEn: 'Cardiovascular System', color: '#DC143C', colorLight: '#FFE4E1' },
  { id: 'respiratory', name: '呼吸系统', icon: '🫁', nameEn: 'Respiratory System', color: '#87CEEB', colorLight: '#F0FFFF' },
  { id: 'digestive', name: '消化系统', icon: '🍽️', nameEn: 'Digestive System', color: '#FF8C00', colorLight: '#FFF8DC' },
  { id: 'urinary', name: '泌尿系统', icon: '💧', nameEn: 'Urinary System', color: '#FFD700', colorLight: '#FFFACD' },
  { id: 'reproductive', name: '生殖系统', icon: '🌸', nameEn: 'Reproductive System', color: '#FF69B4', colorLight: '#FFF0F5' },
  { id: 'endocrine', name: '内分泌系统', icon: '⚗️', nameEn: 'Endocrine System', color: '#20B2AA', colorLight: '#F0FFFF' },
];

const ANATOMY_STRUCTURES = [
  // ═══════════ 运动系统 ═══════════
  { id: 1, system: 'skeletal', name: '颅骨', nameEn: 'Skull', location: '头部', description: '颅骨由23块骨组成，分为脑颅和面颅两部分。保护大脑和感觉器官。', function: '保护脑组织，支撑面部结构，参与咀嚼运动', neighbors: '上方连接颈椎，下方与下颌骨形成颞颚关节', nerveSupply: '面神经、三叉神经', bloodSupply: '颈内动脉、颞浅动脉' },
  { id: 2, system: 'skeletal', name: '颈椎', nameEn: 'Cervical Vertebrae', location: '颈部，共7节', description: '颈椎共7节，第1、2颈椎形态特殊（寰椎、枢椎），参与头部运动。', function: '支撑头部，允许前后左右活动，保护颈段脊髓', neighbors: '上方与颅骨相连，下方连接胸椎', nerveSupply: '颈神经(C1-C8)', bloodSupply: '椎动脉、颈升动脉' },
  { id: 3, system: 'skeletal', name: '胸椎', nameEn: 'Thoracic Vertebrae', location: '胸部，共12节', description: '胸椎共12节，每节与肋骨形成关节，参与呼吸运动。', function: '支撑胸廓，保护胸段脊髓，参与呼吸运动', neighbors: '上方连接颈椎，下方连接腰椎', nerveSupply: '胸神经(T1-T12)', bloodSupply: '肋间动脉' },
  { id: 4, system: 'skeletal', name: '腰椎', nameEn: 'Lumbar Vertebrae', location: '腰部，共5节', description: '腰椎共5节，是脊柱最粗大的部分，承受身体大部分重量。', function: '支撑躯干重量，允许前屈后伸，参与弯腰动作', neighbors: '上方连接胸椎，下方连接骶骨', nerveSupply: '腰神经(L1-L5)', bloodSupply: '腰动脉' },
  { id: 5, system: 'skeletal', name: '锁骨', nameEn: 'Clavicle', location: '胸部上方，左右各一', description: '锁骨呈S形，是连接肩胛骨与胸骨的桥梁性骨骼。', function: '支撑肩部，使上肢远离躯干，保护下方血管神经', neighbors: '内侧连接胸骨，外侧连接肩胛骨', nerveSupply: '锁骨上神经', bloodSupply: '胸肩峰动脉' },
  { id: 6, system: 'skeletal', name: '肩胛骨', nameEn: 'Scapula', location: '背部上方，左右各一', description: '肩胛骨呈三角形，参与组成肩关节，是上肢与躯干连接的关键。', function: '为肌肉提供附着点，扩大上肢运动范围', neighbors: '后上方与锁骨形成肩锁关节，前方与肱骨形成盂肱关节', nerveSupply: '胸背神经、肩胛上神经', bloodSupply: '肩胛上动脉、肩胛下动脉' },
  { id: 7, system: 'skeletal', name: '肱骨', nameEn: 'Humerus', location: '上臂', description: '肱骨是上肢最长的骨骼，上端与肩胛骨形成肩关节，下端与尺桡骨形成肘关节。', function: '支撑和移动上臂，参与肩、肘关节运动', neighbors: '上方连接肩胛骨盂窝，下方连接尺骨和桡骨', nerveSupply: '肌皮神经、桡神经、正中神经', bloodSupply: '肱动脉、肱深动脉' },
  { id: 8, system: 'skeletal', name: '桡骨', nameEn: 'Radius', location: '前臂外侧', description: '桡骨位于前臂外侧，上端参与形成肘关节，下端参与形成腕关节。', function: '与尺骨共同支撑前臂，参与前臂旋转和手腕运动', neighbors: '上端连接肱骨小头，下端连接腕骨', nerveSupply: '桡神经、正中神经', bloodSupply: '桡动脉' },
  { id: 9, system: 'skeletal', name: '尺骨', nameEn: 'Ulna', location: '前臂内侧', description: '尺骨位于前臂内侧，上端形成肘突，下端参与腕关节组成。', function: '与桡骨共同构成前臂骨架，稳定肘关节', neighbors: '上端连接肱骨滑车，下端连接腕骨', nerveSupply: '尺神经、骨间前神经', bloodSupply: '尺动脉' },
  { id: 10, system: 'skeletal', name: '骨盆', nameEn: 'Pelvis', location: '躯干下端', description: '骨盆由髂骨、坐骨、耻骨和骶尾骨组成，是躯干与下肢的连接枢纽。', function: '支撑躯干重量，保护盆腔脏器，传递上下肢力量', neighbors: '上方连接腰椎，下方连接股骨', nerveSupply: '腰骶干、骶神经', bloodSupply: '髂内动脉、髂外动脉' },
  { id: 11, system: 'skeletal', name: '股骨', nameEn: 'Femur', location: '大腿', description: '股骨是人体最长、最强的骨骼，上端与髋骨形成髋关节，下端与胫骨形成膝关节。', function: '支撑体重，参与行走、跑步和跳跃', neighbors: '上端连接髋骨，下端连接胫骨和髌骨', nerveSupply: '股神经、坐骨神经', bloodSupply: '股动脉、旋股内动脉' },
  { id: 12, system: 'skeletal', name: '胫骨', nameEn: 'Tibia', location: '小腿内侧', description: '胫骨是小腿的主要承重骨，上端参与膝关节，下端参与踝关节。', function: '支撑体重传递，参与膝关节和踝关节运动', neighbors: '上端连接股骨，下端连接距骨', nerveSupply: '腓总神经、胫神经', bloodSupply: '胫前动脉、胫后动脉' },
  { id: 13, system: 'skeletal', name: '腓骨', nameEn: 'Fibula', location: '小腿外侧', description: '腓骨位于小腿外侧，不直接参与膝关节，但下端参与踝关节组成。', function: '为肌肉提供附着点，增强踝关节稳定性', neighbors: '上端位于胫骨外侧，下端参与踝关节', nerveSupply: '腓浅神经、腓深神经', bloodSupply: '腓动脉' },

  // ═══════════ 肌肉系统 ═══════════
  { id: 14, system: 'muscular', name: '胸大肌', nameEn: 'Pectoralis Major', location: '胸部浅层', description: '胸大肌是人体最大的扁肌，覆盖胸廓前壁，参与多种肩关节运动。', function: '内收、内旋、屈曲肩关节，参与深呼吸', neighbors: '起于锁骨、胸骨、肋软骨，止于肱骨大结节嵴', nerveSupply: '胸外侧神经、胸内侧神经(C5-T1)', bloodSupply: '胸肩峰动脉胸肌支、胸廓内动脉穿支' },
  { id: 15, system: 'muscular', name: '背阔肌', nameEn: 'Latissimus Dorsi', location: '背部浅层', description: '背阔肌是人体最宽的肌肉，参与肩关节的内收、内旋和后伸。', function: '内收、内旋、后伸肩关节，参与引体向上', neighbors: '起于胸腰筋膜、髂嵴、胸椎棘突，止于肱骨小结节嵴', nerveSupply: '胸背神经(C6-C8)', bloodSupply: '胸背动脉' },
  { id: 16, system: 'muscular', name: '三角肌', nameEn: 'Deltoid', location: '肩部', description: '三角肌呈三角形，覆盖肩关节，分为前、中、后三部分。', function: '前部屈曲、中部外展、后部后伸肩关节', neighbors: '起于锁骨外侧、肩峰、肩胛冈，止于肱骨三角肌粗隆', nerveSupply: '腋神经(C5-C6)', bloodSupply: '旋肱前动脉、旋肱后动脉' },
  { id: 17, system: 'muscular', name: '肱二头肌', nameEn: 'Biceps Brachii', location: '上臂前面', description: '肱二头肌是上臂最显眼的肌肉，有两个头，分为长头和短头。', function: '屈肘、前臂旋后，辅助肩关节屈曲', neighbors: '长头起于盂上结节，短头起于喙突，止于桡骨粗隆', nerveSupply: '肌皮神经(C5-C6)', bloodSupply: '肱动脉肌支' },
  { id: 18, system: 'muscular', name: '股四头肌', nameEn: 'Quadriceps Femoris', location: '大腿前侧', description: '股四头肌由四块肌肉组成：股直肌、股外侧肌、股内侧肌、股中间肌。', function: '伸膝关节，是人体最强壮的肌肉之一', neighbors: '起于髂骨和股骨，止于髌骨，通过髌韧带止于胫骨粗隆', nerveSupply: '股神经(L2-L4)', bloodSupply: '股动脉穿支' },
  { id: 19, system: 'muscular', name: '腓肠肌', nameEn: 'Gastrocnemius', location: '小腿后侧浅层', description: '腓肠肌是小腿最浅层的肌肉，与比目鱼肌合称"小腿三头肌"。', function: '跖屈踝关节，屈膝关节，参与行走和跑步', neighbors: '起于股骨内、外侧髁，止于跟骨（通过跟腱）', nerveSupply: '胫神经(S1-S2)', bloodSupply: '腓肠动脉' },
  { id: 20, system: 'muscular', name: '膈肌', nameEn: 'Diaphragm', location: '胸腹腔之间', description: '膈肌是主要的呼吸肌，呈穹隆状分隔胸腔和腹腔。', function: '收缩时降低穹隆，增加胸腔容积，引起吸气', neighbors: '周围附着于剑突、肋骨下缘、腰椎椎体', nerveSupply: '膈神经(C3-C5)', bloodSupply: '膈动脉' },

  // ═══════════ 神经系统 ═══════════
  { id: 21, system: 'nervous', name: '大脑', nameEn: 'Cerebrum', location: '颅腔上部', description: '大脑是中枢神经系统最高级部分，分为左右两个半球，表面覆盖大脑皮层。', function: '高级神经活动，思维、记忆、语言、意识、情感', neighbors: '下方连接间脑和小脑，外侧被颅骨保护', nerveSupply: '大脑中动脉、大脑前动脉、大脑后动脉', bloodSupply: '颈内动脉、椎基底动脉' },
  { id: 22, system: 'nervous', name: '小脑', nameEn: 'Cerebellum', location: '颅腔后下方', description: '小脑位于大脑后下方，主要功能是协调运动、维持平衡。', function: '协调随意运动，维持身体平衡，调节肌张力', neighbors: '后方邻大脑枕叶，下方邻脑干', nerveSupply: '小脑上、中、下动脉', bloodSupply: '椎基底动脉' },
  { id: 23, system: 'nervous', name: '脑干', nameEn: 'Brain Stem', location: '颅腔中心', description: '脑干包括中脑、脑桥和延髓，是生命中枢所在。', function: '控制心跳、呼吸、血压等生命体征，是上下行传导通路', neighbors: '上方连接大脑，下方连接脊髓', nerveSupply: '椎动脉、脑桥动脉、基底动脉', bloodSupply: '椎基底动脉系统' },
  { id: 24, system: 'nervous', name: '脊髓', nameEn: 'Spinal Cord', location: '椎管内', description: '脊髓是中枢神经系统的低级部分，位于椎管内，上连脑干，下至L1-L2水平。', function: '传导感觉和运动信号，完成简单反射', neighbors: '上接脑干，下端终于第1-2腰椎水平', nerveSupply: '31对脊神经根', bloodSupply: '脊髓前动脉、脊髓后动脉' },
  { id: 25, system: 'nervous', name: '坐骨神经', nameEn: 'Sciatic Nerve', location: '下肢后面', description: '坐骨神经是人体最粗大的神经，从臀部下行至大腿后面。', function: '支配大腿后群肌和小腿、足部肌肉，感觉支配广泛', neighbors: '经梨状肌下孔出骨盆，沿大腿后正中线下行', nerveSupply: '腰神经(L4-L5)、骶神经(S1-S3)', bloodSupply: '臀下动脉的分支' },
  { id: 26, system: 'nervous', name: '正中神经', nameEn: 'Median Nerve', location: '上肢前面', description: '正中神经是上肢重要的感觉和运动混合神经。', function: '支配前臂前群大部分肌，手掌桡侧感觉', neighbors: '沿上臂内侧下行，进入前臂', nerveSupply: '臂丛内侧束和外侧束(C6-T1)', bloodSupply: '尺侧上副动脉' },

  // ═══════════ 心血管系统 ═══════════
  { id: 27, system: 'cardiovascular', name: '心脏', nameEn: 'Heart', location: '胸腔纵隔', description: '心脏是循环系统的动力器官，位于两肺之间，略偏左侧，重约250-350g。', function: '泵血功能，推动血液循环，供应全身组织代谢需求', neighbors: '前方邻胸骨体和肋骨，后方邻食管和胸主动脉', nerveSupply: '心丛（交感神经和副交感神经）', bloodSupply: '左、右冠状动脉' },
  { id: 28, system: 'cardiovascular', name: '主动脉', nameEn: 'Aorta', location: '胸腔和腹腔', description: '主动脉是人体最粗大的动脉，从左心室发出，分为升主动脉、主动脉弓和降主动脉。', function: '将含氧血液从心脏输送至全身', neighbors: '升主动脉起于左心室，弓部向后弯曲，降主动脉沿脊柱下行', nerveSupply: '主动脉神经丛', bloodSupply: '自身管壁血管' },
  { id: 29, system: 'cardiovascular', name: '肺动脉', nameEn: 'Pulmonary Artery', location: '胸腔', description: '肺动脉干分为左、右肺动脉，将脱氧血液输送至肺部进行气体交换。', function: '输送静脉血至肺进行氧合', neighbors: '起于右心室肺动脉口，分为左右两支入肺', nerveSupply: '肺神经丛', bloodSupply: '支气管动脉' },
  { id: 30, system: 'cardiovascular', name: '肺静脉', nameEn: 'Pulmonary Vein', location: '胸腔', description: '肺静脉共4条，将含氧血液从肺输送回左心房。', function: '输送氧合血液至左心房', neighbors: '左右各2条，从肺门汇入左心房', nerveSupply: '迷走神经分支', bloodSupply: '自身管壁' },
  { id: 31, system: 'cardiovascular', name: '颈总动脉', nameEn: 'Common Carotid Artery', location: '颈部两侧', description: '颈总动脉左右各一，分为颈内动脉和颈外动脉。', function: '供应头部血液，颈内动脉供应脑和眼', neighbors: '起于主动脉弓（右侧起于头臂干），上行至颈部分为颈内、外动脉', nerveSupply: '颈动脉窦神经', bloodSupply: '自身体系' },
  { id: 32, system: 'cardiovascular', name: '股动脉', nameEn: 'Femoral Artery', location: '大腿前面', description: '股动脉是髂外动脉的延续，是下肢主要的动脉干。', function: '供应大腿血液，是介入诊疗常用穿刺部位', neighbors: '从腹股沟韧带中点深面进入大腿，下行至腘窝移行为腘动脉', nerveSupply: '股神经分支', bloodSupply: '旋股内动脉、旋股外动脉' },

  // ═══════════ 呼吸系统 ═══════════
  { id: 33, system: 'respiratory', name: '鼻腔', nameEn: 'Nasal Cavity', location: '面部中央', description: '鼻腔是呼吸系统的起始部分，具有加温、加湿和过滤空气的功能。', function: '嗅觉、通气、加温、加湿空气，防御功能', neighbors: '上方邻颅底，下方邻口腔，前方开口于外鼻', nerveSupply: '嗅神经、三叉神经眼支和上颌支', bloodSupply: '蝶腭动脉、面动脉、眼动脉' },
  { id: 34, system: 'respiratory', name: '喉', nameEn: 'Larynx', location: '颈前部', description: '喉是呼吸通道和发音器官，由软骨、韧带、肌肉和粘膜构成。', function: '呼吸通道，发音功能，吞咽时防止食物误入气管', neighbors: '上方连接咽，下方连接气管，前方被甲状腺覆盖', nerveSupply: '喉上神经、喉返神经（迷走神经分支）', bloodSupply: '甲状腺上动脉、甲状腺下动脉' },
  { id: 35, system: 'respiratory', name: '气管', nameEn: 'Trachea', location: '颈部和胸部', description: '气管是连接喉与支气管的管道，由16-20个C形软骨环支撑。', function: '通气通道，加湿和清除异物', neighbors: '上端连接喉，下端在胸骨角水平分为左、右主支气管', nerveSupply: '迷走神经、喉返神经', bloodSupply: '甲状腺下动脉、支气管动脉' },
  { id: 36, system: 'respiratory', name: '左主支气管', nameEn: 'Left Main Bronchus', location: '胸部', description: '左主支气管细长，走向较水平，是异物容易坠入的部位。', function: '通气通道，引导气体进入左肺', neighbors: '从气管分叉向左下行，进入左肺门', nerveSupply: '迷走神经支气管支', bloodSupply: '支气管动脉' },
  { id: 37, system: 'respiratory', name: '右主支气管', nameEn: 'Right Main Bronchus', location: '胸部', description: '右主支气管粗短，走向较垂直，异物更容易进入右肺。', function: '通气通道，引导气体进入右肺', neighbors: '从气管分叉向右下行，进入右肺门', nerveSupply: '迷走神经支气管支', bloodSupply: '支气管动脉' },
  { id: 38, system: 'respiratory', name: '肺', nameEn: 'Lungs', location: '胸腔，左右各一', description: '肺是气体交换的场所，左肺2叶，右肺3叶，总重量约1000g。', function: '气体交换，O2和CO2的交换，免疫防御功能', neighbors: '左右各一，外被胸膜，内侧邻心脏和大血管', nerveSupply: '肺丛（交感神经和迷走神经）', bloodSupply: '肺动脉、肺静脉、支气管动脉' },

  // ═══════════ 消化系统 ═══════════
  { id: 39, system: 'digestive', name: '口腔', nameEn: 'Oral Cavity', location: '面部下方', description: '口腔是消化系统的起始部分，包括唇、颊、舌、牙和唾液腺。', function: '咀嚼，吞咽初始，言语，味觉', neighbors: '前方为唇，后方连接咽，上方为硬腭和软腭', nerveSupply: '三叉神经、面神经、舌下神经', bloodSupply: '面动脉、舌动脉、上颌动脉' },
  { id: 40, system: 'digestive', name: '食管', nameEn: 'Esophagus', location: '颈、胸、腹', description: '食管是连接咽和胃的肌性管道，长约25cm，有三个生理性狭窄。', function: '推送食物进入胃部', neighbors: '上接咽，沿脊柱前方下行，穿过膈肌食管裂孔进入腹腔', nerveSupply: '迷走神经、交感神经', bloodSupply: '甲状腺下动脉、支气管动脉、胸主动脉分支' },
  { id: 41, system: 'digestive', name: '胃', nameEn: 'Stomach', location: '左上腹', description: '胃是消化管最膨大的部分，成人胃容量约1000-1500ml。', function: '储存食物，机械消化，化学消化（胃酸和胃蛋白酶）', neighbors: '上方连接食管，下方连接十二指肠，左侧邻脾', nerveSupply: '迷走神经、内脏神经', bloodSupply: '胃左动脉、胃右动脉、胃网膜动脉' },
  { id: 42, system: 'digestive', name: '肝脏', nameEn: 'Liver', location: '右上腹', description: '肝脏是人体最大的实质性器官，重约1200-1500g，具有代谢、解毒等多重功能。', function: '代谢、解毒、合成蛋白质和凝血因子、分泌胆汁', neighbors: '大部分位于右季肋区，上邻膈肌，下邻胃和十二指肠', nerveSupply: '肝丛（交感神经和迷走神经）', bloodSupply: '肝固有动脉、肝门静脉' },
  { id: 43, system: 'digestive', name: '胆囊', nameEn: 'Gallbladder', location: '肝脏下面', description: '胆囊是储存和浓缩胆汁的囊性器官，长约8-12cm。', function: '储存和浓缩胆汁，进食后收缩排入十二指肠', neighbors: '位于肝脏脏面的胆囊窝内，前方邻腹前壁', nerveSupply: '肝丛分支', bloodSupply: '胆囊动脉（肝固有动脉分支）' },
  { id: 44, system: 'digestive', name: '胰腺', nameEn: 'Pancreas', location: '胃后方', description: '胰腺是腹膜后器官，分为头、体、尾三部，具有外分泌和内分泌功能。', function: '外分泌：分泌胰液消化食物；内分泌：分泌胰岛素和胰高血糖素', neighbors: '头被十二指肠曲包绕，体部横跨下腔静脉和腹主动脉前方', nerveSupply: '腹腔丛、脾丛', bloodSupply: '胰十二指肠动脉、脾动脉分支' },
  { id: 45, system: 'digestive', name: '小肠', nameEn: 'Small Intestine', location: '腹腔中部', description: '小肠长约5-7m，分为十二指肠、空肠和回肠，是消化吸收的主要场所。', function: '消化和吸收营养物质', neighbors: '上接胃，下连大肠，盘曲于腹腔中部', nerveSupply: '腹腔丛、肠系膜上下神经丛', bloodSupply: '肠系膜上动脉分支' },
  { id: 46, system: 'digestive', name: '大肠', nameEn: 'Large Intestine', location: '腹腔周围', description: '大肠长约1.5m，分为盲肠、结肠和直肠，主要功能是吸收水分和形成粪便。', function: '吸收水分和电解质，形成和储存粪便', neighbors: '围绕空回肠排列，包括升结肠、横结肠、降结肠、乙状结肠', nerveSupply: '肠系膜上下神经丛', bloodSupply: '肠系膜上动脉、肠系膜下动脉分支' },

  // ═══════════ 泌尿系统 ═══════════
  { id: 47, system: 'urinary', name: '肾脏', nameEn: 'Kidney', location: '腰部，脊柱两侧', description: '肾脏是成对的实质性器官，位于腹膜后，每侧重约120-150g。', function: '生成尿液，排泄代谢废物，调节水电解质和酸碱平衡，内分泌功能', neighbors: '左右各一，上方邻肾上腺，内侧邻大血管', nerveSupply: '肾丛（交感神经和迷走神经）', bloodSupply: '肾动脉、肾静脉' },
  { id: 48, system: 'urinary', name: '输尿管', nameEn: 'Ureter', location: '腹膜后', description: '输尿管是连接肾脏和膀胱的管道，长约25-30cm，有三个生理性狭窄。', function: '输送尿液从肾脏至膀胱', neighbors: '起于肾盂，沿腰大肌前面下行，斜穿膀胱壁', nerveSupply: '肾丛、肠系膜下丛', bloodSupply: '肾动脉、髂总动脉、膀胱上动脉分支' },
  { id: 49, system: 'urinary', name: '膀胱', nameEn: 'Bladder', location: '盆腔', description: '膀胱是储存尿液的肌性器官，成人容量约300-500ml。', function: '储存尿液，排尿反射', neighbors: '男性邻前列腺、精囊、直肠；女性邻子宫和阴道前壁', nerveSupply: '膀胱丛（交感神经和副交感神经）', bloodSupply: '膀胱上动脉、膀胱下动脉' },
  { id: 50, system: 'urinary', name: '尿道', nameEn: 'Urethra', location: '盆腔和会阴', description: '尿道是排出尿液的管道，男性尿道长约18-20cm，女性约3-5cm。', function: '排尿通道，女性尿道也是分娩通道', neighbors: '男性穿过前列腺和生殖膈，女性位于阴道前方', nerveSupply: '阴部神经', bloodSupply: '阴部内动脉' },

  // ═══════════ 生殖系统 ═══════════
  { id: 51, system: 'reproductive', name: '睾丸', nameEn: 'Testis', location: '阴囊内', description: '睾丸是男性生殖腺，左右各一，产生精子和雄激素。', function: '产生精子，分泌雄激素', neighbors: '位于阴囊内，左右各一', nerveSupply: '精索神经丛', bloodSupply: '睾丸动脉（精索内动脉）' },
  { id: 52, system: 'reproductive', name: '前列腺', nameEn: 'Prostate', location: '盆腔深部', description: '前列腺是男性特有的性腺器官，重约20g，包围尿道起始部。', function: '分泌前列腺液，参与精液构成', neighbors: '上方邻膀胱，下方邻尿生殖膈，前方邻耻骨联合，后方邻直肠', nerveSupply: '前列腺丛', bloodSupply: '前列腺动脉（膀胱下动脉分支）' },
  { id: 53, system: 'reproductive', name: '卵巢', nameEn: 'Ovary', location: '盆腔侧壁', description: '卵巢是女性生殖腺，左右各一，产生卵子和雌激素、孕激素。', function: '产生卵子，分泌雌激素和孕激素', neighbors: '位于子宫两侧，借卵巢悬韧带连于骨盆壁', nerveSupply: '卵巢丛', bloodSupply: '卵巢动脉、子宫动脉卵巢支' },
  { id: 54, system: 'reproductive', name: '子宫', nameEn: 'Uterus', location: '盆腔中央', description: '子宫是孕育胎儿的肌性器官，成年女性子宫重约50-70g。', function: '孕育胎儿，周期性月经', neighbors: '前方邻膀胱，后方邻直肠，上方连接输卵管和卵巢', nerveSupply: '子宫丛', bloodSupply: '子宫动脉（髂内动脉分支）' },

  // ═══════════ 内分泌系统 ═══════════
  { id: 55, system: 'endocrine', name: '垂体', nameEn: 'Pituitary Gland', location: '颅底蝶鞍', description: '垂体是人体最重要的内分泌腺，分为腺垂体和神经垂体两部。', function: '调节其他内分泌腺分泌，生长激素、催乳素等', neighbors: '位于蝶鞍垂体窝内，上方邻视交叉', nerveSupply: '颈内动脉海绵窦支', bloodSupply: '垂体上下动脉' },
  { id: 56, system: 'endocrine', name: '甲状腺', nameEn: 'Thyroid Gland', location: '颈前部', description: '甲状腺是最大的内分泌腺，H形，重约25-30g。', function: '调节代谢率，促进生长发育，调节钙磷代谢', neighbors: '位于颈前部，喉和气管两侧，被颈深筋膜覆盖', nerveSupply: '喉上神经、喉返神经', bloodSupply: '甲状腺上动脉、甲状腺下动脉' },
  { id: 57, system: 'endocrine', name: '甲状旁腺', nameEn: 'Parathyroid Gland', location: '甲状腺背面', description: '甲状旁腺是4个米粒大小的内分泌腺，位于甲状腺背面。', function: '调节钙磷代谢，维持血钙平衡', neighbors: '上下各一对，贴附于甲状腺背面', nerveSupply: '甲状腺下动脉分支', bloodSupply: '甲状腺下动脉' },
  { id: 58, system: 'endocrine', name: '肾上腺', nameEn: 'Adrenal Gland', location: '肾脏上方', description: '肾上腺左右各一，呈三角形，分为皮质和髓质两部分。', function: '皮质：调节代谢和水电解质；髓质：分泌肾上腺素和去甲肾上腺素', neighbors: '左右各一，位于对应肾脏的上内方', nerveSupply: '腹腔丛、肾丛', bloodSupply: '肾上腺上动脉、肾上腺中动脉、肾上腺下动脉' },
  { id: 59, system: 'endocrine', name: '胰岛', nameEn: 'Islets of Langerhans', location: '胰腺内', description: '胰岛是散布在胰腺中的内分泌细胞群，主要位于胰体和胰尾部。', function: '分泌胰岛素和胰高血糖素，调节血糖', neighbors: '位于胰腺腺泡之间', nerveSupply: '腹腔丛', bloodSupply: '胰十二指肠动脉、脾动脉分支' },
  { id: 60, system: 'endocrine', name: '松果体', nameEn: 'Pineal Gland', location: '间脑背面', description: '松果体是小的锥形腺体，位于大脑两半球之间。', function: '分泌褪黑素，调节昼夜节律和性成熟', neighbors: '位于胼胝体压部下方，第三脑室顶', nerveSupply: '大脑后动脉分支', bloodSupply: '大脑后动脉分支' },
];

// ═══════════ 学习进度数据 ═══════════
function getLearningProgress() {
  const data = localStorage.getItem('anatomy_progress_v2');
  return data ? JSON.parse(data) : {
    visitedStructures: [],
    quizResults: {},
    bookmarks: [],
    lastStudyDate: null,
    streakDays: 0,
    totalStudyTime: 0,
  };
}

function saveLearningProgress(progress) {
  localStorage.setItem('anatomy_progress_v2', JSON.stringify(progress));
}

// ═══════════ 遗忘曲线计算 ═══════════
const LEARNING_INTERVALS = [1, 2, 4, 7, 15, 30];

function calculateNextReview(lastReviewDate, reviewCount) {
  if (!lastReviewDate) return new Date();
  const interval = LEARNING_INTERVALS[Math.min(reviewCount, LEARNING_INTERVALS.length - 1)];
  const nextDate = new Date(lastReviewDate);
  nextDate.setDate(nextDate.getDate() + interval);
  return nextDate;
}

function isDueForReview(nextReviewDate) {
  return new Date() >= new Date(nextReviewDate);
}

// ═══════════ 推荐学习算法 ═══════════
function getRecommendedStructures(count = 5) {
  const progress = getLearningProgress();
  const masteryScores = {};
  
  ANATOMY_STRUCTURES.forEach(structure => {
    const quizResult = progress.quizResults[structure.id] || { correct: 0, wrong: 0 };
    const totalAttempts = quizResult.correct + quizResult.wrong;
    
    if (totalAttempts === 0) {
      masteryScores[structure.id] = { score: 0, reason: '未学习', structure };
    } else {
      const accuracy = quizResult.correct / totalAttempts;
      masteryScores[structure.id] = { 
        score: accuracy * 100 - (totalAttempts * 5),
        reason: `正确率${(accuracy * 100).toFixed(0)}%`,
        structure 
      };
    }
  });
  
  return Object.values(masteryScores)
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

// ═══════════ 导出 ═══════════
window.AnatomyData = {
  systems: ANATOMY_SYSTEMS,
  structures: ANATOMY_STRUCTURES,
  getLearningProgress,
  saveLearningProgress,
  calculateNextReview,
  isDueForReview,
  getRecommendedStructures,
};
