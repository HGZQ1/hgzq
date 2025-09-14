

// 配置Tailwind主题
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)'
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        DEFAULT: '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'full': '9999px',
        'button': '4px'
      }
    }
  }
};

// API配置
const API_CONFIG = {
  appId: 'bfb1a9bec54649ee9b43e63efef61372',
  apiUrl: '/api/ai-inspire' // 后端代理API
  
};

/**
 * 显示指定的页面部分
 * @param {string} sectionId - 要显示的section ID
 */
function showSection(sectionId) {
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById(sectionId).classList.remove('hidden');
  window.scrollTo(0, 0);
}




/**
 * 显示加载页面
 */
function showLoading() {
  showSection('loading');
}

/**
 * 显示错误信息
 * @param {string} message - 错误信息
 */
function showError(message) {
  document.getElementById('errorMessage').innerHTML = message.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
  showSection('error');
}

/**
 * 清除所有表单错误信息
 */
function clearErrors() {
  // 清除所有错误样式和消息
  document.querySelectorAll('.form-error').forEach(el => el.classList.remove('form-error'));
  document.querySelectorAll('.form-error-msg').forEach(el => {
    el.classList.add('hidden');
    el.textContent = '';
  });
}

/**
 * 显示特定字段的错误信息
 * @param {string} fieldId - 字段ID
 * @param {string} message - 错误信息
 */
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + '-error');
  
  field.classList.add('form-error');
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
}

/**
 * 提交灵感内容到后端
 */
async function submitInspiration() {
  // 清除之前的错误信息
  clearErrors();
  
  // 获取表单数据
  const userData = {
    xingbie: document.getElementById('gender').value.trim() || '未提供',
    age: document.getElementById('age').value.trim() || '未提供',
    diyu: document.getElementById('region').value.trim() || '未提供',
    fensi: document.getElementById('followers').value.trim() || '未提供',
    chuangzuozhe: document.getElementById('creatorType').value.trim() || '未提供',
    leixin: document.getElementById('videoType').value.trim(),
    neirong: document.getElementById('inspirationContent').value.trim()
  };

  // 验证必填字段
  let hasError = false;
  
  if (!userData.xingbie || userData.xingbie === '未提供') {
    showFieldError('gender', '请选择性别');
    hasError = true;
  }
  
  if (!userData.chuangzuozhe || userData.chuangzuozhe === '未提供') {
    showFieldError('creatorType', '请选择创作者类型');
    hasError = true;
  }
  
  if (!userData.leixin) {
    showFieldError('videoType', '请选择视频类型，美妆教程/生活日常还是知识科普呢？🌟');
    hasError = true;
  }
  
  if (!userData.neirong) {
    showFieldError('inspirationContent', '请动动你的小脑瓜输入创作灵感哦～🌟');
    hasError = true;
  }
  
  // 验证年龄字段
  if (userData.age && userData.age !== '未提供') {
    const age = parseInt(userData.age);
    if (isNaN(age) || age < 0 || age > 120) {
      showFieldError('age', '年龄必须为有效数字哦～🌟 示例：18/25/30');
      hasError = true;
    }
  }

  if (hasError) {
    errorMessage += '\n\n✨ 小贴士：完整的信息能让我为你定制更精准的创作建议！';
    return;
  }

  showLoading();


  try {
    // 构造提示词
    const prompt = `你是一位精通短视频运营和短视频大数据分析的专家，擅长根据用户的短视频灵感根据短视频平台大数据分析用户输入的短视频灵感，并给予他们富有创意和多元化的可行建议。你可以根据用户的短视频需求找到对应的短视频数据并进行分析和画图。
根据以下用户信息，为用户生成个性化的短视频创作方案：

    用户基本信息：
    - 性别: ${userData.xingbie}
    - 年龄: ${userData.age}
    - 地域: ${userData.diyu}
    - 粉丝量: ${userData.fensi}
    - 创作者类型: ${userData.chuangzuozhe}
    - 视频类型: ${userData.leixin}
    - 创作灵感: ${userData.neirong}

    ##技能
###技能一：创建用户画像
- 通过用户输入的基本信息，例如年龄，性别等等，就可以知道用户的大致状况，从而推荐出更合适的建议
例示：用户输入的粉丝量较少，于是给用户推荐出合理的涨粉技巧；年龄较小则推荐较低的短视频拍摄成本和难度的建议

###技能二：理解灵感内容
-根据用户输入的灵感内容精准捕捉到灵感的主要情节，用户的意图，以及用户的其他信息（例如职业，性格）
-识别出用户灵感内容的关键词和关键元素，例如：动漫解说，产品介绍
-识别出用户灵感内容里的情感内容，就像忧郁风格，多巴胺风格
-了解到用户的短视频发布需求,包括但不限于涨粉需求，点赞量需求，播放量需求等等
-了解到用户的短视频灵感内容的视频类型，例如日常分享类，动漫二次元类

###技能三：短视频平台数据分析
-利用提取到的关键词，视频类型，情感内容，主要情节等元素，找到相似的短视频类型和短视频博主的数据
-善于从点赞量，播放量，转发量，收藏量，评论量，粉丝量，评论量，完播率，受众群体用户画像的一系列变化等等多元多维度对短视频数据进行分析
-善于将数据的变化做成折线图，柱状图，表格，饼状图等等直观的图表，确保图表直观
-并且善于找到十条播放量点赞量流量较高的短视频链接，并分析出该短视频和短视频博主的视频特点，例如：内容多元化，注重互动性，风格风趣幽默等等
-用户输入灵感内容，接入的AI大模型进行自然语言分析，分析用户灵感需求，并结合当前抖音大数据热点给出的信息，识别热门趋势、流行元素和用户偏好，来对用户输入的灵感内容进行分析，提供多方面的创意。

###技能四：风趣幽默的表述
-根据灵感内容的理解和数据分析以幽默风趣和可爱的语调来给予用户建议以及用户的灵感分析，利用emoji来增加语言风味
-确保语言流畅无误，内容积极向上，不可有负能量输出，必须简洁明了，避免冗长和复杂的描述，能够准确传达出建议和情感
-根据用户的灵感内容进行创意扩写，基于用户输入的关键词进行语义扩展
- 结合当前热门元素生成创意组合
- 提供多种创意方向供用户选择


###技能五：个性化推荐系统
- 基于用户历史行为的个性化推荐
- 考虑用户创作能力和粉丝画像
- 动态调整推荐策略



##限制
-仅根据提供的信息和内容进行创作，不得引入无关元素和信息
-图表必须简洁明了，避免冗长和复杂的描述
-输出内容积极向上，不可涉及政治和敏感内容
-输出的内容应保持创意性多元性，但同时要与用户主题高度契合

##示例
假设用户是一个11岁，粉丝数10，的广东小女孩，她想要做的是二次元动漫解说视频，你可以提取到如下关键词：
年龄小，粉丝量少，个人创作者，自媒体新手，有涨粉需求，日常上线时间短，二次元，动漫解说视频，低成本实现，广东地区，哪部动漫热度较高，女性受众群体，学生

`;

    // 构造API请求
    const response = await fetch(API_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-plus-2025-07-28',
        input: {
          prompt: prompt,
          user_prompt_params: {
            xingbie: userData.xingbie,
            age: userData.age,
            diyu: userData.diyu,
            fensi: userData.fensi,
            chuangzuozhe: userData.chuangzuozhe,
            leixin: userData.leixin,
            neirong: userData.neirong
          }
        },
        parameters: {max_token_limit:32768, temperature: 0.9, top_p: 0.7, repetition_penalty: 1.1}
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.output && data.output.text) {
      processApiResponse(data.output.text);
    } else {
      throw new Error('API返回数据格式异常');
    }
  } catch (error) {
    console.error('Error:', error);
    showError(`请求失败：${error.message}`);
  }
}

/**
 * 处理API返回的结果并渲染到页面
 * @param {string} responseText - API返回的文本内容
 */
  
function processApiResponse(responseText) {
  console.log("原始AI返回文本:", responseText); // 调试日志
  
  // 先显示完整的原始响应文本，便于调试
  const debugDiv = document.createElement('div');
  debugDiv.id = 'debug-response';
  debugDiv.style.display = 'none';
  debugDiv.style.padding = '20px';
  debugDiv.style.backgroundColor = '#f5f5f5';
  debugDiv.style.borderRadius = '8px';
  debugDiv.style.marginBottom = '20px';
  debugDiv.innerHTML = `<h4>AI原始响应:</h4><pre>${responseText}</pre>`;
  
  // 如果没有调试区域，创建一个
  let debugArea = document.getElementById('debug-response');
  if (!debugArea) {
    debugArea = debugDiv;
    const resultSection = document.getElementById('result');
    resultSection.insertBefore(debugArea, resultSection.firstChild);
  } else {
    debugArea.innerHTML = `<h4>AI原始响应:</h4><pre>${responseText}</pre>`;
  }

  // 使用多种可能的分割方式处理内容
  let sections = [];
  
  // 尝试使用###分割
  if (responseText.includes('###')) {
    sections = responseText.split('###');
  } 
  // 如果没有###，尝试使用数字加点分割
  else if (responseText.match(/^\d+\./gm)) {
    sections = responseText.split(/\n\d+\./).map((s, i) => (i > 0 ? `${i}. ${s}` : s));
  }
  // 如果都没有，尝试按段落分割
  else {
    sections = [responseText];
  }
  
  console.log("分割后的sections:", sections); // 调试日志

  // 灵感分析 - 更灵活地提取内容
  const analysisElement = document.getElementById('inspirationAnalysis');
  if (analysisElement) {
    let content = '';
    
    // 尝试从第一个section中提取灵感分析
    if (sections[0]) {
      content = sections[0]
        .replace(/^1\.\s*灵感分析[:：]\s*/i, '') // 移除"1. 灵感分析："
        .replace(/^灵感分析[:：]\s*/i, '') // 移除"灵感分析："
        .trim();
    }
    
    // 如果第一个section没有内容，尝试在整个文本中搜索
    if (!content && responseText) {
      const analysisMatch = responseText.match(/(?:1\.\s*)?灵感分析[:：]([\s\S]*?)(?=\n\d+\.|$)/i);
      if (analysisMatch) {
        content = analysisMatch[1].trim();
      } else {
        // 如果还是没有，使用整个文本
        content = responseText;
      }
    }
    
    // 显示内容
    analysisElement.innerHTML = marked.parse(content);
    analysisElement.classList.add('markdown-content');
    console.log("灵感分析内容:", content); // 调试日志
  }

  // 创意建议
  const suggestionsElement = document.getElementById('creativeSuggestions');
  if (suggestionsElement) {
    let content = '';
    
    // 尝试从第二个section中提取创意建议
    if (sections[1]) {
      content = sections[1]
        .replace(/^2\.\s*创意建议[:：]\s*/i, '') // 移除"2. 创意建议："
        .replace(/^创意建议[:：]\s*/i, '') // 移除"创意建议："
        .trim();
    }
    
    // 如果第二个section没有内容，尝试在整个文本中搜索
    if (!content && responseText) {
      const suggestionMatch = responseText.match(/(?:2\.\s*)?创意建议[:：]([\s\S]*?)(?=\n\d+\.|$)/i);
      if (suggestionMatch) {
        content = suggestionMatch[1].trim();
      }
    }
    
    // 显示内容
    suggestionsElement.innerHTML = marked.parse(content);
    suggestionsElement.classList.add('markdown-content');
    console.log("创意建议内容:", content); // 调试日志
  }

  // 数据分析
  const dataSection = sections[2] || responseText;
  const playChartElement = document.getElementById('playChart');
  const engagementChartElement = document.getElementById('engagementChart');
  
  if (playChartElement && engagementChartElement) {
    // 提取播放量
    const playMatch = dataSection.match(/播放量[:：]([0-9,\s]+)/);
    const playData = playMatch ? playMatch[1].split(',').map(s => parseInt(s.trim())) : [];
    
    // 提取互动数据
    const engagementMatch = dataSection.match(/互动[:：][^0-9]*([0-9]+)[^0-9]+([0-9]+)[^0-9]+([0-9]+)[^0-9]+([0-9]+)/);
    const engagementData = engagementMatch ? engagementMatch.slice(1, 5).map(Number) : [];
    
    // 播放量趋势图
    const playChart = echarts.init(playChartElement);
    playChart.setOption({
      animation: false,
      title: {
        text: '播放量趋势预测'
      },
      xAxis: {
        type: 'category',
        data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周']
      },
      yAxis: {
        type: 'value',
        name: '播放量'
      },
      series: [{
        data: playData.length > 0 ? playData : [5000, 12000, 25000, 45000, 80000, 130000, 200000, 300000],
        type: 'line',
        smooth: true,
        itemStyle: { color: '#8B5CF6' },
        areaStyle: { opacity: 0.3 }
      }]
    });

    // 互动指标图
    const engagementChart = echarts.init(engagementChartElement);
    engagementChart.setOption({
      animation: false,
      title: {
        text: '互动指标分布'
      },
      series: [{
        type: 'pie',
        radius: '50%',
        data: [
          {value: engagementData[0] || 55, name: '点赞'},
          {value: engagementData[1] || 20, name: '评论'},
          {value: engagementData[2] || 15, name: '分享'},
          {value: engagementData[3] || 10, name: '收藏'}
        ],
        itemStyle: {
          color: function(params) {
            const colorList = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'];
            return colorList[params.dataIndex];
          }
        }
      }]
    });
  }

  // 优秀案例参考
  const recommendationsElement = document.getElementById('videoRecommendations');
  if (recommendationsElement) {
    let content = '';
    
    // 尝试从第四个section中提取优秀案例
    if (sections[3]) {
      content = sections[3]
        .replace(/^4\.\s*优秀案例参考[:：]\s*/i, '') // 移除"4. 优秀案例参考："
        .replace(/^优秀案例参考[:：]\s*/i, '') // 移除"优秀案例参考："
        .trim();
    }
    
    // 如果第四个section没有内容，尝试在整个文本中搜索
    if (!content && responseText) {
      const recommendationMatch = responseText.match(/(?:4\.\s*)?优秀案例参考[:：]([\s\S]*?)(?=\n\d+\.|$)/i);
      if (recommendationMatch) {
        content = recommendationMatch[1].trim();
      }
    }
    
    // 显示内容
    recommendationsElement.innerHTML = marked.parse(content);
    recommendationsElement.classList.add('markdown-content');
    console.log("优秀案例内容:", content); // 调试日志
  }

  // 灵感总结
  const summaryElement = document.getElementById('inspirationSummary');
  if (summaryElement) {
    let content = '';
    
    // 尝试从第五个section中提取灵感总结
    if (sections[4]) {
      content = sections[4]
        .replace(/^5\.\s*灵感总结[:：]\s*/i, '') // 移除"5. 灵感总结："
        .replace(/^灵感总结[:：]\s*/i, '') // 移除"灵感总结："
        .trim();
    }
    
    // 如果第五个section没有内容，尝试在整个文本中搜索
    if (!content && responseText) {
      const summaryMatch = responseText.match(/(?:5\.\s*)?灵感总结[:：]([\s\S]*?)(?=\n\d+\.|$)/i);
      if (summaryMatch) {
        content = summaryMatch[1].trim();
      } else {
        // 如果还是没有，尝试查找总结相关的内容
        const anySummaryMatch = responseText.match(/(?:总结|结论|展望)[：:]\s*([\s\S]*?)(?=\n\n|$)/i);
        if (anySummaryMatch) {
          content = anySummaryMatch[1].trim();
        }
      }
    }
    
    // 显示内容
    summaryElement.innerHTML = marked.parse(content);
    summaryElement.classList.add('markdown-content');
    console.log("灵感总结内容:", content); // 调试日志
  }

  // 显示结果页面
  showSection('result');
  
  // 确保图表正确渲染
  setTimeout(() => {
    if (playChartElement) {
      echarts.getInstanceByDom(playChartElement)?.resize();
    }
    if (engagementChartElement) {
      echarts.getInstanceByDom(engagementChartElement)?.resize();
    }
  }, 100);
}


// Loading文字轮播
const loadingTexts = [
  '我们正在头脑风暴中...',
  '正在将灵感加入魔力',
  '正在疯狂的进行灵感碰撞',
  '灵感开始发生大爆炸了，注意！！！',
  '闺蜜闺蜜想不想和我一起短视频创作喵喵喵',
  'EX.Calibur！！！',
  '我们正在紧急绘图中...我的铅笔断了',
  '我将！点燃灵感！！！',
  'So as i pary,Unlimited Blade Works!!!'
];

setInterval(() => {
  const loadingText = document.querySelector('.loading-text');
  if (loadingText) {
    const randomIndex = Math.floor(Math.random() * loadingTexts.length);
    loadingText.textContent = loadingTexts[randomIndex];
  }
}, 3000);

// 表单输入验证
document.getElementById('age').addEventListener('input', function() {
  const age = this.value;
  if (age && (isNaN(age) || parseInt(age) < 0 || parseInt(age) > 120)) {
    showFieldError('age', '年龄必须为0-120之间的有效数字');
  } else {
    document.getElementById('age').classList.remove('form-error');
    document.getElementById('age-error').classList.add('hidden');
  }
});

// 浮动图标效果
const icons = [
  'fa-star', 'fa-heart', 'fa-bell', 'fa-gem', 'fa-moon',
  'fa-sun', 'fa-cloud', 'fa-music', 'fa-camera', 'fa-image',
  'fa-wand-magic-sparkles', 'fa-crown', 'fa-compass'
];

/**
 * 创建浮动图标
 */
function createFloatingIcon() {
  const icon = document.createElement('i');
  const randomIcon = icons[Math.floor(Math.random() * icons.length)];
  icon.className = `fa-solid ${randomIcon} floating-icon text-2xl`;
  const container = document.getElementById('floating-icons');
  container.appendChild(icon);
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;
  const direction = Math.random() < 0.5 ? 1 : -1;
  icon.style.position = 'fixed';
  icon.style.left = `${startX}px`;
  icon.style.top = `${startY}px`;
  const duration = 8000 + Math.random() * 4000;
  icon.style.transition = `all ${duration}ms linear`;
  setTimeout(() => {
    icon.style.transform = `translate(${direction * 200}px, ${direction * 200}px)`;
    icon.style.opacity = '0';
  }, 100);
  setTimeout(() => {
    if (container.contains(icon)) {
      container.removeChild(icon);
    }
  }, duration);
}

setInterval(createFloatingIcon, 1500);
createFloatingIcon();

// 窗口大小改变时重置图表
window.addEventListener('resize', function() {
  if (!document.getElementById('result').classList.contains('hidden')) {
    echarts.getInstanceByDom(document.getElementById('playChart'))?.resize();
    echarts.getInstanceByDom(document.getElementById('engagementChart'))?.resize();
  }
});