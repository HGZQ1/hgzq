// 导入所需模块
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // 提供静态文件服务

// API路由 - 代理AI请求
app.post('/api/ai-inspire', async (req, res) => {
  try {
    // 从环境变量中获取API Key（安全存储）
    const API_KEY = process.env.DASHSCOPE_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ 
        error: '服务器配置错误：缺少API密钥' 
      });
    }

    // 构造请求到DashScope API
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'disable'
      },
      //body: JSON.stringify(req.body)
    
        

      
      body: JSON.stringify({
        ...req.body,
        model: req.body.model || "qwen-plus-2025-07-28" // 添加模型参数
})

    });

    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DashScope API Error:', errorText);
      return res.status(response.status).json({ 
        error: `AI服务错误: ${response.status} ${response.statusText}` 
      });
    }

    // 返回AI服务的响应
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      error: '服务器内部错误' 
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`访问地址: http://localhost:${PORT}`);
});