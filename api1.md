我的应用id：bfb1a9bec54649ee9b43e63efef61372
DASHSCOPE_API_KEY：sk-2e8b849b6c124469ae3441686c1deee4

下面是请求代码


curl -X POST https://dashscope.aliyuncs.com/api/v1/apps/YOUR_APP_ID/completion \
--header "Authorization: Bearer $DASHSCOPE_API_KEY" \
--header 'Content-Type: application/json' \
--data '{
    "input": {
        "prompt": "你是谁？"
    },
    "parameters":  {},
    "debug": {}
}' 
YOUR_APP_ID替换为实际的应用 ID。
响应示例

 
{"output":{"finish_reason":"stop",
"session_id":"232ea2e9e6ef448db6b14465c06a9a56",
"text":"我是来自阿里云的超大规模语言模型，我叫通义千问。我是一个能够回答问题、创作文字，还能表达观点、撰写代码的AI助手。如果您有任何问题或需要帮助，请随时告诉我，我会尽力为您提供帮助。"},
"usage":{"models":[{"output_tokens":51,"model_id":"qwen-max","input_tokens":121}]},
"request_id":"661c9cad-e59c-9f78-a262-78eff243f151"}% 



