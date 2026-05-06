const https = require('https');

// ═══════════ 模型路由配置 ═══════════
const MODEL_CONFIG = {
  deepseek: {
    host: 'api.deepseek.com',
    path: '/chat/completions',
    envKey: 'DEEPSEEK_API_KEY',
    defaultModel: 'deepseek-chat',
  },
  siliconflow: {
    host: 'api.siliconflow.cn',
    path: '/v1/chat/completions',
    envKey: 'SILICONFLOW_API_KEY',
    defaultModel: 'deepseek-ai/DeepSeek-V3',
  },
  qwen: {
    host: 'dashscope.aliyuncs.com',
    path: '/compatible-mode/v1/chat/completions',
    envKey: 'DASHSCOPE_API_KEY',
    defaultModel: 'qwen-turbo',
  },
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body);
    const { model, messages, image_base64 } = body;
    const provider = model || 'deepseek';

    const config = MODEL_CONFIG[provider];
    if (!config) {
      return { statusCode: 400, body: JSON.stringify({ error: `不支持的模型: ${provider}` }) };
    }

    const apiKey = process.env[config.envKey];
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: `未配置 ${provider} 的 API Key` }) };
    }

    // 构建请求体
    const requestBody = {
      model: config.defaultModel,
      messages: JSON.parse(JSON.stringify(messages)),
      stream: true,
      max_tokens: 4096,
      temperature: 0.7,
    };

    // 图片处理
    if (image_base64 && requestBody.messages.length > 0) {
      const lastMsg = requestBody.messages[requestBody.messages.length - 1];
      const textContent = typeof lastMsg.content === 'string' ? lastMsg.content : '请识别这张图片';
      lastMsg.content = [
        { type: 'text', text: textContent },
        { type: 'image_url', image_url: { url: image_base64 } },
      ];
    }

    const postData = JSON.stringify(requestBody);

    return new Promise((resolve, reject) => {
      const options = {
        hostname: config.host,
        port: 443,
        path: config.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        const headers = {
          'Content-Type': res.headers['content-type'] || 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        };

        if (res.statusCode !== 200) {
          let errData = '';
          res.on('data', (chunk) => { errData += chunk; });
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ error: `模型 API 错误 (${res.statusCode}): ${errData.substring(0, 200)}` }),
            });
          });
          return;
        }

        resolve({
          statusCode: 200,
          headers,
          body: res,
          isBase64Encoded: false,
        });
      });

      req.on('error', reject);
      req.setTimeout(60000, () => {
        req.destroy();
        reject(new Error('请求超时'));
      });

      req.write(postData);
      req.end();
    });

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
