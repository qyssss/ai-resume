// 发送请求的worker
self.onmessage = async (event) => {
  const { taskId, messages, userApiKey, model, API_URL } = event.data;
  const requestData = {
    model,
    messages,
    stream: true, // 流式响应
  };
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userApiKey}`, // 认证信息
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    if (response.status === 401) {
      self.postMessage({ taskId, isComplete: true, result: '认证失败，请检查 API Key 是否正确' });
      return;
    } else if (!response.ok) {
      self.postMessage({ taskId, isComplete: true, result: `请求失败，错误码: ${response.status}` });
      return;
    }
    if (!response.body) {
      self.postMessage({ taskId, isComplete: true, result: '服务器未返回流数据' });
      return;
    }

    // 读取流式响应数据（sse）
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let currentText = '';  //存结果

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      // 流式响应数据：
      // {"id":"****","choices":[{"delta":{"content":"我是","function_call":null,"refusal":null,"role":null,"tool_calls":null},
      // "finish_reason":null,"index":0,"logprobs":null}],"created":1735113344,
      // "model":"qwen-plus","object":"chat.completion.chunk","service_tier":null,
      // "system_fingerprint":null,"usage":null}
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonLine = line.slice(6).trim();  // 移除 `data: ` 前缀
          if (jsonLine === '[DONE]') {
            // 响应：data: [DONE] ，则结束
            self.postMessage({ taskId, isComplete: true, result: currentText });
            return;
          }
          try {
            const parsedLine = JSON.parse(jsonLine);
            const deltaContent = parsedLine?.choices?.[0]?.delta?.content;
            if (deltaContent) {
              currentText += deltaContent;
              self.postMessage({ taskId, isComplete: false, result: currentText });
            }
          } catch (err) {
            self.postMessage({ taskId, result: '解析流数据时出错，请稍后重试' });
          }
        }
      }
    }
  } catch (error) {
    self.postMessage({ taskId, result: '请求失败，请稍后重试' });
  }
};
