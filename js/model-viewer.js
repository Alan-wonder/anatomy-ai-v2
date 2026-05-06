// ═══════════ 解剖通Pro — 3D模型查看器 ═══════════
@import url('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js');

let scene, camera, renderer, controls;
let currentModel = 'heart';
let isAutoRotate = true;
let selectedStructure = null;

// ═══════════ 模型配置 ═══════════
const MODEL_CONFIGS = {
  heart: {
    name: '心脏模型',
    icon: '❤️',
    description: '人体心脏三维解剖模型，可交互查看各腔室和血管',
    structures: [
      { name: '左心房', nameEn: 'Left Atrium', position: [0.2, 0.3, 0] },
      { name: '右心房', nameEn: 'Right Atrium', position: [-0.2, 0.3, 0] },
      { name: '左心室', nameEn: 'Left Ventricle', position: [0.15, -0.2, 0] },
      { name: '右心室', nameEn: 'Right Ventricle', position: [-0.15, -0.2, 0] },
      { name: '主动脉', nameEn: 'Aorta', position: [0.1, 0.5, 0] },
      { name: '肺动脉', nameEn: 'Pulmonary Artery', position: [-0.1, 0.5, 0] },
      { name: '上腔静脉', nameEn: 'Superior Vena Cava', position: [-0.3, 0.4, 0] },
      { name: '下腔静脉', nameEn: 'Inferior Vena Cava', position: [-0.3, 0, 0] },
    ],
  },
  skeleton: {
    name: '骨骼系统',
    icon: '🦴',
    description: '人体全身骨骼结构，包含206块骨骼',
    structures: [
      { name: '颅骨', nameEn: 'Skull', position: [0, 0.8, 0] },
      { name: '颈椎', nameEn: 'Cervical Vertebrae', position: [0, 0.6, 0] },
      { name: '胸椎', nameEn: 'Thoracic Vertebrae', position: [0, 0.3, 0] },
      { name: '腰椎', nameEn: 'Lumbar Vertebrae', position: [0, 0, 0] },
      { name: '胸骨', nameEn: 'Sternum', position: [0, 0.2, 0.2] },
      { name: '锁骨', nameEn: 'Clavicle', position: [0.4, 0.35, 0] },
      { name: '肩胛骨', nameEn: 'Scapula', position: [0.5, 0.2, 0] },
      { name: '肱骨', nameEn: 'Humerus', position: [0.6, 0, 0] },
      { name: '骨盆', nameEn: 'Pelvis', position: [0, -0.2, 0] },
      { name: '股骨', nameEn: 'Femur', position: [0.2, -0.5, 0] },
    ],
  },
  brain: {
    name: '脑部模型',
    icon: '🧠',
    description: '大脑解剖模型，包含主要脑区',
    structures: [
      { name: '额叶', nameEn: 'Frontal Lobe', position: [0.3, 0.3, 0] },
      { name: '顶叶', nameEn: 'Parietal Lobe', position: [0, 0.4, 0.2] },
      { name: '颞叶', nameEn: 'Temporal Lobe', position: [0.3, 0, 0.2] },
      { name: '枕叶', nameEn: 'Occipital Lobe', position: [-0.3, 0.2, 0] },
      { name: '小脑', nameEn: 'Cerebellum', position: [-0.2, -0.2, 0] },
      { name: '脑干', nameEn: 'Brain Stem', position: [0, -0.3, 0] },
    ],
  },
  muscular: {
    name: '肌肉系统',
    icon: '💪',
    description: '人体主要肌群分布图',
    structures: [
      { name: '胸大肌', nameEn: 'Pectoralis Major', position: [0.3, 0.3, 0.2] },
      { name: '三角肌', nameEn: 'Deltoid', position: [0.5, 0.3, 0] },
      { name: '肱二头肌', nameEn: 'Biceps', position: [0.5, 0.1, 0] },
      { name: '腹肌', nameEn: 'Abdominals', position: [0, 0, 0.2] },
      { name: '股四头肌', nameEn: 'Quadriceps', position: [0.2, -0.3, 0.1] },
      { name: '腓肠肌', nameEn: 'Gastrocnemius', position: [0.2, -0.6, 0] },
    ],
  },
  digestive: {
    name: '消化系统',
    icon: '🍽️',
    description: '消化道及消化腺解剖模型',
    structures: [
      { name: '食管', nameEn: 'Esophagus', position: [0, 0.5, 0] },
      { name: '胃', nameEn: 'Stomach', position: [0.3, 0.2, 0] },
      { name: '肝脏', nameEn: 'Liver', position: [0.4, 0.15, 0] },
      { name: '胆囊', nameEn: 'Gallbladder', position: [0.5, 0.1, 0] },
      { name: '胰腺', nameEn: 'Pancreas', position: [0.2, 0, 0] },
      { name: '小肠', nameEn: 'Small Intestine', position: [0, -0.2, 0] },
      { name: '大肠', nameEn: 'Large Intestine', position: [0, -0.1, 0.2] },
    ],
  },
};

// ═══════════ 初始化3D查看器 ═══════════
function init3DViewer() {
  const container = document.getElementById('model-canvas');
  if (!container) return;
  
  // 如果已初始化，只需更新
  if (renderer) {
    updateModelDisplay();
    return;
  }
  
  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 3);
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  // 添加灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  const pointLight = new THREE.PointLight(0x4DA3FF, 0.5);
  pointLight.position.set(-5, 3, 5);
  scene.add(pointLight);
  
  // 添加鼠标控制
  setupControls(container);
  
  // 开始渲染循环
  animate();
  
  // 加载默认模型
  loadModel(currentModel);
  
  // 响应窗口大小变化
  window.addEventListener('resize', onWindowResize);
}

// ═══════════ 设置控制器 ═══════════
function setupControls(container) {
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
    container.style.cursor = 'grabbing';
  });
  
  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;
    
    if (scene.rotation) {
      scene.rotation.y += deltaX * 0.01;
      scene.rotation.x += deltaY * 0.01;
    }
    
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });
  
  container.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'grab';
  });
  
  container.addEventListener('mouseleave', () => {
    isDragging = false;
    container.style.cursor = 'grab';
  });
  
  // 触摸支持
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });
  
  container.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;
    
    if (scene.rotation) {
      scene.rotation.y += deltaX * 0.01;
      scene.rotation.x += deltaY * 0.01;
    }
    
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });
  
  container.addEventListener('touchend', () => {
    isDragging = false;
  });
  
  // 鼠标滚轮缩放
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.position.z = Math.max(1.5, Math.min(6, camera.position.z + e.deltaY * 0.005));
  });
  
  container.style.cursor = 'grab';
}

// ═══════════ 加载模型 ═══════════
function loadModel(modelType) {
  currentModel = modelType;
  
  // 清除现有模型
  while (scene.children.length > 0) {
    const obj = scene.children[0];
    if (obj.type !== 'AmbientLight' && obj.type !== 'DirectionalLight' && obj.type !== 'PointLight') {
      scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }
  }
  
  // 重新添加灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  // 根据模型类型创建不同的几何体
  switch (modelType) {
    case 'heart':
      createHeartModel();
      break;
    case 'skeleton':
      createSkeletonModel();
      break;
    case 'brain':
      createBrainModel();
      break;
    case 'muscular':
      createMuscularModel();
      break;
    case 'digestive':
      createDigestiveModel();
      break;
    default:
      createDefaultModel();
  }
  
  // 更新UI
  updateModelDisplay();
  
  // 高亮显示结构列表
  highlightStructures();
}

// ═══════════ 创建心脏模型 ═══════════
function createHeartModel() {
  const group = new THREE.Group();
  
  // 左心房 - 蓝色
  const leftAtriumGeo = new THREE.SphereGeometry(0.25, 32, 32);
  const leftAtriumMat = new THREE.MeshPhongMaterial({ 
    color: 0x0A84FF, 
    transparent: true, 
    opacity: 0.8,
    emissive: 0x0A84FF,
    emissiveIntensity: 0.2
  });
  const leftAtrium = new THREE.Mesh(leftAtriumGeo, leftAtriumMat);
  leftAtrium.position.set(0.15, 0.3, 0);
  leftAtrium.userData = { name: '左心房', nameEn: 'Left Atrium', index: 0 };
  group.add(leftAtrium);
  
  // 右心房 - 红色
  const rightAtriumGeo = new THREE.SphereGeometry(0.22, 32, 32);
  const rightAtriumMat = new THREE.MeshPhongMaterial({ 
    color: 0xDC143C, 
    transparent: true, 
    opacity: 0.8,
    emissive: 0xDC143C,
    emissiveIntensity: 0.2
  });
  const rightAtrium = new THREE.Mesh(rightAtriumGeo, rightAtriumMat);
  rightAtrium.position.set(-0.15, 0.3, 0);
  rightAtrium.userData = { name: '右心房', nameEn: 'Right Atrium', index: 1 };
  group.add(rightAtrium);
  
  // 左心室 - 深蓝色
  const leftVentricleGeo = new THREE.SphereGeometry(0.28, 32, 32);
  const leftVentricleMat = new THREE.MeshPhongMaterial({ 
    color: 0x003366, 
    transparent: true, 
    opacity: 0.85,
    emissive: 0x003366,
    emissiveIntensity: 0.15
  });
  const leftVentricle = new THREE.Mesh(leftVentricleGeo, leftVentricleMat);
  leftVentricle.position.set(0.12, -0.2, 0);
  leftVentricle.scale.set(0.9, 1.2, 0.8);
  leftVentricle.userData = { name: '左心室', nameEn: 'Left Ventricle', index: 2 };
  group.add(leftVentricle);
  
  // 右心室 - 深红色
  const rightVentricleGeo = new THREE.SphereGeometry(0.25, 32, 32);
  const rightVentricleMat = new THREE.MeshPhongMaterial({ 
    color: 0x8B0000, 
    transparent: true, 
    opacity: 0.85,
    emissive: 0x8B0000,
    emissiveIntensity: 0.15
  });
  const rightVentricle = new THREE.Mesh(rightVentricleGeo, rightVentricleMat);
  rightVentricle.position.set(-0.1, -0.2, 0);
  rightVentricle.scale.set(0.85, 1.1, 0.7);
  rightVentricle.userData = { name: '右心室', nameEn: 'Right Ventricle', index: 3 };
  group.add(rightVentricle);
  
  // 主动脉 - 红色管道
  const aortaGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16);
  const aortaMat = new THREE.MeshPhongMaterial({ color: 0xDC143C, emissive: 0xDC143C, emissiveIntensity: 0.3 });
  const aorta = new THREE.Mesh(aortaGeo, aortaMat);
  aorta.position.set(0.08, 0.55, 0);
  aorta.rotation.z = -0.3;
  aorta.userData = { name: '主动脉', nameEn: 'Aorta', index: 4 };
  group.add(aorta);
  
  // 肺动脉 - 蓝色管道
  const pulmonaryGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.5, 16);
  const pulmonaryMat = new THREE.MeshPhongMaterial({ color: 0x0A84FF, emissive: 0x0A84FF, emissiveIntensity: 0.3 });
  const pulmonary = new THREE.Mesh(pulmonaryGeo, pulmonaryMat);
  pulmonary.position.set(-0.05, 0.5, 0);
  pulmonary.rotation.z = 0.4;
  pulmonary.userData = { name: '肺动脉', nameEn: 'Pulmonary Artery', index: 5 };
  group.add(pulmonary);
  
  // 上腔静脉
  const svcGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 16);
  const svcMat = new THREE.MeshPhongMaterial({ color: 0x4169E1, emissive: 0x4169E1, emissiveIntensity: 0.2 });
  const svc = new THREE.Mesh(svcGeo, svcMat);
  svc.position.set(-0.25, 0.35, 0);
  svc.userData = { name: '上腔静脉', nameEn: 'Superior Vena Cava', index: 6 };
  group.add(svc);
  
  // 下腔静脉
  const ivcGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.35, 16);
  const ivcMat = new THREE.MeshPhongMaterial({ color: 0x4169E1, emissive: 0x4169E1, emissiveIntensity: 0.2 });
  const ivc = new THREE.Mesh(ivcGeo, ivcMat);
  ivc.position.set(-0.22, 0, 0);
  ivc.userData = { name: '下腔静脉', nameEn: 'Inferior Vena Cava', index: 7 };
  group.add(ivc);
  
  scene.add(group);
}

// ═══════════ 创建骨骼模型 ═══════════
function createSkeletonModel() {
  const group = new THREE.Group();
  const boneMat = new THREE.MeshPhongMaterial({ 
    color: 0xFFFACD, 
    emissive: 0xF5F5DC,
    emissiveIntensity: 0.1
  });
  
  // 颅骨
  const skullGeo = new THREE.SphereGeometry(0.15, 32, 32);
  const skull = new THREE.Mesh(skullGeo, boneMat);
  skull.position.set(0, 0.75, 0);
  skull.scale.set(1, 1.2, 1);
  skull.userData = { name: '颅骨', nameEn: 'Skull', index: 0 };
  group.add(skull);
  
  // 脊柱
  const spineGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 16);
  const spine = new THREE.Mesh(spineGeo, boneMat);
  spine.position.set(0, 0.3, 0);
  spine.userData = { name: '脊柱', nameEn: 'Spine', index: 1 };
  group.add(spine);
  
  // 胸骨
  const sternumGeo = new THREE.BoxGeometry(0.08, 0.25, 0.03);
  const sternum = new THREE.Mesh(sternumGeo, boneMat);
  sternum.position.set(0, 0.2, 0.12);
  sternum.userData = { name: '胸骨', nameEn: 'Sternum', index: 2 };
  group.add(sternum);
  
  // 锁骨
  [-1, 1].forEach((side, i) => {
    const clavicleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8);
    const clavicle = new THREE.Mesh(clavicleGeo, boneMat);
    clavicle.position.set(side * 0.2, 0.35, 0.05);
    clavicle.rotation.z = side * 0.3;
    clavicle.userData = { name: '锁骨', nameEn: 'Clavicle', index: 3 };
    group.add(clavicle);
  });
  
  // 肋骨（简化）
  for (let i = 0; i < 6; i++) {
    const ribGeo = new THREE.TorusGeometry(0.12, 0.015, 8, 16, Math.PI);
    const rib = new THREE.Mesh(ribGeo, boneMat);
    rib.position.set(0, 0.15 - i * 0.05, 0.05);
    rib.rotation.x = Math.PI / 2;
    rib.rotation.y = i % 2 === 0 ? 0 : Math.PI;
    group.add(rib);
  }
  
  // 骨盆
  const pelvisGeo = new THREE.TorusGeometry(0.15, 0.04, 16, 32, Math.PI);
  const pelvis = new THREE.Mesh(pelvisGeo, boneMat);
  pelvis.position.set(0, -0.1, 0);
  pelvis.rotation.x = Math.PI / 2;
  pelvis.rotation.z = Math.PI;
  pelvis.userData = { name: '骨盆', nameEn: 'Pelvis', index: 4 };
  group.add(pelvis);
  
  // 股骨
  [-1, 1].forEach((side) => {
    const femurGeo = new THREE.CylinderGeometry(0.03, 0.025, 0.4, 16);
    const femur = new THREE.Mesh(femurGeo, boneMat);
    femur.position.set(side * 0.1, -0.4, 0);
    femur.rotation.z = side * 0.1;
    femur.userData = { name: '股骨', nameEn: 'Femur', index: 5 };
    group.add(femur);
  });
  
  // 上肢
  [-1, 1].forEach((side) => {
    const humerusGeo = new THREE.CylinderGeometry(0.02, 0.018, 0.25, 12);
    const humerus = new THREE.Mesh(humerusGeo, boneMat);
    humerus.position.set(side * 0.35, 0.15, 0);
    humerus.rotation.z = side * 0.3;
    group.add(humerus);
    
    const forearmGeo = new THREE.CylinderGeometry(0.015, 0.012, 0.22, 12);
    const forearm = new THREE.Mesh(forearmGeo, boneMat);
    forearm.position.set(side * 0.5, -0.05, 0);
    forearm.rotation.z = side * 0.5;
    group.add(forearm);
  });
  
  scene.add(group);
}

// ═══════════ 创建大脑模型 ═══════════
function createBrainModel() {
  const group = new THREE.Group();
  
  // 大脑半球
  const colors = [0xFFB6C1, 0xE6E6FA, 0x98FB98, 0xFFE4B5];
  const positions = [
    [0.15, 0.2, 0], [0, 0.25, 0.1], [-0.15, 0.15, 0.05], [0.1, 0.1, -0.1]
  ];
  
  positions.forEach((pos, i) => {
    const lobeGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const lobeMat = new THREE.MeshPhongMaterial({ 
      color: colors[i % colors.length], 
      transparent: true, 
      opacity: 0.85,
      emissive: colors[i % colors.length],
      emissiveIntensity: 0.1
    });
    const lobe = new THREE.Mesh(lobeGeo, lobeMat);
    lobe.position.set(pos[0], pos[1], pos[2]);
    lobe.scale.set(1.2, 0.8, 0.9);
    lobe.userData = { 
      name: ['额叶', '顶叶', '颞叶', '枕叶'][i], 
      nameEn: ['Frontal', 'Parietal', 'Temporal', 'Occipital'][i] + ' Lobe',
      index: i 
    };
    group.add(lobe);
  });
  
  // 小脑
  const cerebellumGeo = new THREE.SphereGeometry(0.15, 32, 32);
  const cerebellumMat = new THREE.MeshPhongMaterial({ 
    color: 0xDDA0DD, 
    transparent: true, 
    opacity: 0.8,
    emissive: 0xDDA0DD,
    emissiveIntensity: 0.1
  });
  const cerebellum = new THREE.Mesh(cerebellumGeo, cerebellumMat);
  cerebellum.position.set(-0.15, -0.1, 0);
  cerebellum.scale.set(1, 0.7, 0.8);
  cerebellum.userData = { name: '小脑', nameEn: 'Cerebellum', index: 4 };
  group.add(cerebellum);
  
  // 脑干
  const brainstemGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.25, 16);
  const brainstemMat = new THREE.MeshPhongMaterial({ 
    color: 0xF0E68C, 
    transparent: true, 
    opacity: 0.8,
    emissive: 0xF0E68C,
    emissiveIntensity: 0.1
  });
  const brainstem = new THREE.Mesh(brainstemGeo, brainstemMat);
  brainstem.position.set(0, -0.2, -0.05);
  brainstem.userData = { name: '脑干', nameEn: 'Brain Stem', index: 5 };
  group.add(brainstem);
  
  scene.add(group);
}

// ═══════════ 创建肌肉模型 ═══════════
function createMuscularModel() {
  const group = new THREE.Group();
  
  const muscleMat = new THREE.MeshPhongMaterial({ 
    color: 0xDC143C, 
    transparent: true, 
    opacity: 0.85,
    emissive: 0xDC143C,
    emissiveIntensity: 0.15
  });
  
  // 胸大肌
  [-1, 1].forEach((side) => {
    const pecGeo = new THREE.BoxGeometry(0.15, 0.12, 0.05);
    const pec = new THREE.Mesh(pecGeo, muscleMat);
    pec.position.set(side * 0.15, 0.25, 0.1);
    pec.rotation.z = side * 0.2;
    pec.userData = { name: '胸大肌', nameEn: 'Pectoralis Major', index: 0 };
    group.add(pec);
  });
  
  // 腹肌
  for (let i = 0; i < 3; i++) {
    const absGeo = new THREE.BoxGeometry(0.12, 0.06, 0.04);
    const abs = new THREE.Mesh(absGeo, muscleMat.clone());
    abs.material.color.setHex(0xCD5C5C);
    abs.position.set(0, 0.05 - i * 0.07, 0.08);
    group.add(abs);
  }
  
  // 三角肌
  [-1, 1].forEach((side) => {
    const deltGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const delt = new THREE.Mesh(deltGeo, muscleMat.clone());
    delt.material.color.setHex(0xB22222);
    delt.position.set(side * 0.32, 0.2, 0);
    delt.scale.set(1.2, 0.8, 0.8);
    delt.userData = { name: '三角肌', nameEn: 'Deltoid', index: 1 };
    group.add(delt);
  });
  
  // 肱二头肌
  [-1, 1].forEach((side) => {
    const bicepGeo = new THREE.CapsuleGeometry(0.04, 0.12, 8, 16);
    const bicep = new THREE.Mesh(bicepGeo, muscleMat.clone());
    bicep.material.color.setHex(0x8B0000);
    bicep.position.set(side * 0.38, 0.05, 0);
    bicep.rotation.z = side * 0.3;
    bicep.userData = { name: '肱二头肌', nameEn: 'Biceps Brachii', index: 2 };
    group.add(bicep);
  });
  
  // 股四头肌
  [-1, 1].forEach((side) => {
    const quadGeo = new THREE.CapsuleGeometry(0.06, 0.2, 8, 16);
    const quad = new THREE.Mesh(quadGeo, muscleMat.clone());
    quad.material.color.setHex(0xA52A2A);
    quad.position.set(side * 0.1, -0.35, 0.05);
    quad.rotation.z = side * 0.05;
    quad.userData = { name: '股四头肌', nameEn: 'Quadriceps Femoris', index: 3 };
    group.add(quad);
  });
  
  // 腓肠肌
  [-1, 1].forEach((side) => {
    const calfGeo = new THREE.CapsuleGeometry(0.05, 0.15, 8, 16);
    const calf = new THREE.Mesh(calfGeo, muscleMat.clone());
    calf.material.color.setHex(0x800000);
    calf.position.set(side * 0.12, -0.6, 0);
    calf.userData = { name: '腓肠肌', nameEn: 'Gastrocnemius', index: 4 };
    group.add(calf);
  });
  
  scene.add(group);
}

// ═══════════ 创建消化系统模型 ═══════════
function createDigestiveModel() {
  const group = new THREE.Group();
  
  // 食管
  const esophagusGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.3, 16);
  const esophagusMat = new THREE.MeshPhongMaterial({ 
    color: 0xFFB6C1, 
    transparent: true, 
    opacity: 0.8
  });
  const esophagus = new THREE.Mesh(esophagusGeo, esophagusMat);
  esophagus.position.set(0, 0.5, 0);
  esophagus.userData = { name: '食管', nameEn: 'Esophagus', index: 0 };
  group.add(esophagus);
  
  // 胃
  const stomachGeo = new THREE.SphereGeometry(0.15, 32, 32);
  const stomachMat = new THREE.MeshPhongMaterial({ 
    color: 0xFFA07A, 
    transparent: true, 
    opacity: 0.85,
    emissive: 0xFFA07A,
    emissiveIntensity: 0.1
  });
  const stomach = new THREE.Mesh(stomachGeo, stomachMat);
  stomach.position.set(0.2, 0.2, 0);
  stomach.scale.set(1.2, 0.8, 0.7);
  stomach.userData = { name: '胃', nameEn: 'Stomach', index: 1 };
  group.add(stomach);
  
  // 肝脏
  const liverGeo = new THREE.SphereGeometry(0.12, 32, 32);
  const liverMat = new THREE.MeshPhongMaterial({ 
    color: 0x8B4513, 
    transparent: true, 
    opacity: 0.85,
    emissive: 0x8B4513,
    emissiveIntensity: 0.1
  });
  const liver = new THREE.Mesh(liverGeo, liverMat);
  liver.position.set(0.35, 0.15, 0.05);
  liver.scale.set(1.3, 0.6, 0.8);
  liver.userData = { name: '肝脏', nameEn: 'Liver', index: 2 };
  group.add(liver);
  
  // 小肠（卷曲管状）
  const smallIntestineMat = new THREE.MeshPhongMaterial({ 
    color: 0xFFB6C1, 
    transparent: true, 
    opacity: 0.7
  });
  for (let i = 0; i < 8; i++) {
    const loopGeo = new THREE.TorusGeometry(0.06, 0.015, 8, 16, Math.PI * 1.5);
    const loop = new THREE.Mesh(loopGeo, smallIntestineMat);
    loop.position.set(
      -0.1 + (i % 3) * 0.08,
      -0.1 - Math.floor(i / 3) * 0.08,
      0.1 + (i % 2) * 0.05
    );
    loop.rotation.x = Math.PI / 2;
    loop.rotation.z = (i % 2) * Math.PI;
    group.add(loop);
  }
  
  // 大肠（结肠）
  const largeIntestineMat = new THREE.MeshPhongMaterial({ 
    color: 0xDEB887, 
    transparent: true, 
    opacity: 0.75
  });
  const colonPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.2, 0, 0.15),
    new THREE.Vector3(-0.2, -0.15, 0.15),
    new THREE.Vector3(0, -0.25, 0.15),
    new THREE.Vector3(0.2, -0.15, 0.15),
    new THREE.Vector3(0.2, 0, 0.15),
  ]);
  const colonGeo = new THREE.TubeGeometry(colonPath, 32, 0.035, 16, false);
  const colon = new THREE.Mesh(colonGeo, largeIntestineMat);
  colon.userData = { name: '大肠', nameEn: 'Large Intestine', index: 3 };
  group.add(colon);
  
  scene.add(group);
}

// ═══════════ 创建默认模型 ═══════════
function createDefaultModel() {
  const geo = new THREE.DodecahedronGeometry(0.5);
  const mat = new THREE.MeshPhongMaterial({ 
    color: 0x0A84FF, 
    wireframe: true,
    emissive: 0x0A84FF,
    emissiveIntensity: 0.3
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
}

// ═══════════ 更新模型显示 ═══════════
function updateModelDisplay() {
  const config = MODEL_CONFIGS[currentModel];
  if (!config) return;
  
  // 更新模型名称
  const nameEl = document.getElementById('model-name');
  if (nameEl) nameEl.textContent = config.name;
  
  // 更新描述
  const descEl = document.getElementById('model-desc');
  if (descEl) descEl.textContent = config.description;
  
  // 更新结构列表
  highlightStructures();
}

// ═══════════ 高亮结构列表 ═══════════
function highlightStructures() {
  const listEl = document.getElementById('structure-list');
  if (!listEl) return;
  
  const config = MODEL_CONFIGS[currentModel];
  if (!config) return;
  
  listEl.innerHTML = config.structures.map((s, i) => `
    <div class="structure-item" onclick="selectStructure(${i})">
      <span class="structure-num">${i + 1}</span>
      <div class="structure-info">
        <div class="structure-name">${s.name}</div>
        ${s.nameEn ? `<div class="structure-name-en">${s.nameEn}</div>` : ''}
      </div>
    </div>
  `).join('');
}

// ═══════════ 选择结构 ═══════════
function selectStructure(index) {
  const config = MODEL_CONFIGS[currentModel];
  if (!config || !config.structures[index]) return;
  
  const structure = config.structures[index];
  
  // 显示详情
  showStructureDetail(structure);
  
  // 旋转到该结构
  if (scene) {
    const targetX = structure.position[0] * 2;
    const targetY = structure.position[1] * 2;
    animateRotation(targetX, targetY);
  }
}

// ═══════════ 动画旋转 ═══════════
function animateRotation(targetX, targetY) {
  const startX = scene.rotation.x;
  const startY = scene.rotation.y;
  const duration = 1000;
  const startTime = Date.now();
  
  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    
    scene.rotation.x = startX + (targetX - startX) * eased;
    scene.rotation.y = startY + (targetY - startY) * eased;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  animate();
}

// ═══════════ 显示结构详情 ═══════════
function showStructureDetail(structure) {
  // 找到对应的解剖学数据
  const allStructures = AnatomyData.structures;
  const match = allStructures.find(s => 
    s.name.includes(structure.name) || structure.name.includes(s.name)
  );
  
  if (match) {
    App.showKnowledgeDetail(match.id);
  } else {
    // 如果没有匹配，显示简要信息
    const modal = document.getElementById('knowledge-modal');
    const body = document.getElementById('knowledge-modal-body');
    
    if (modal && body) {
      body.innerHTML = `
        <div class="knowledge-detail">
          <div class="knowledge-header">
            <div class="knowledge-icon">${MODEL_CONFIGS[currentModel]?.icon || '📚'}</div>
            <div>
              <div class="knowledge-title">${structure.name}</div>
              <div class="knowledge-subtitle">${structure.nameEn || ''}</div>
            </div>
          </div>
          
          <div class="detail-section">
            <div class="detail-label">📍 位置</div>
            <div class="detail-value">三维坐标: (${structure.position.join(', ')})</div>
          </div>
          
          <div class="detail-section">
            <div class="detail-label">💡 提示</div>
            <div class="detail-value">点击"向AI提问"获取更详细的知识讲解</div>
          </div>
          
          <button class="btn btn-primary btn-full mt-4" onclick="askAIAboutStructure('${structure.name}')">
            🤖 向AI提问
          </button>
        </div>
      `;
      
      modal.classList.add('active');
    }
  }
}

// ═══════════ 向AI询问结构 ═══════════
function askAIAboutStructure(name) {
  App.closeModal('knowledge-modal');
  App.navigate('chat');
  
  document.getElementById('chat-input').value = `请详细讲解${name}的解剖学知识`;
  sendMessage();
}

// ═══════════ 切换模型 ═══════════
function switchModel(modelType) {
  // 更新按钮状态
  document.querySelectorAll('.model-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.model === modelType);
  });
  
  loadModel(modelType);
}

// ═══════════ 渲染循环 ═══════════
function animate() {
  requestAnimationFrame(animate);
  
  // 自动旋转
  if (isAutoRotate && scene && scene.children.length > 3) {
    scene.rotation.y += 0.003;
  }
  
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// ═══════════ 窗口大小变化 ═══════════
function onWindowResize() {
  const container = document.getElementById('model-canvas');
  if (!container || !camera || !renderer) return;
  
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// ═══════════ 控制函数 ═══════════
function toggleAutoRotate() {
  isAutoRotate = !isAutoRotate;
  const btn = document.getElementById('btn-rotate');
  if (btn) {
    btn.classList.toggle('active', isAutoRotate);
    btn.innerHTML = isAutoRotate ? '⏸️' : '▶️';
  }
}

function resetView() {
  if (scene) {
    scene.rotation.set(0, 0, 0);
    camera.position.set(0, 0, 3);
  }
}

function zoomIn() {
  if (camera) {
    camera.position.z = Math.max(1.5, camera.position.z - 0.3);
  }
}

function zoomOut() {
  if (camera) {
    camera.position.z = Math.min(6, camera.position.z + 0.3);
  }
}

// ═══════════ 初始化模型选择按钮 ═══════════
document.addEventListener('DOMContentLoaded', () => {
  const modelBtns = document.getElementById('model-select-btns');
  if (modelBtns) {
    modelBtns.innerHTML = Object.entries(MODEL_CONFIGS).map(([key, config]) => `
      <button class="model-btn ${key === currentModel ? 'active' : ''}" 
              data-model="${key}" onclick="switchModel('${key}')">
        ${config.icon} ${config.name}
      </button>
    `).join('');
  }
});
