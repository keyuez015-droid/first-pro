/**
 * 本地测试硅基流动 API（仅命令行使用，勿把 Key 写进小程序前端）
 *
 * 用法（PowerShell）：
 *   $env:SILICONFLOW_API_KEY="你的sk-密钥"
 *   node scripts/test-siliconflow.js
 */
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions'
const MODEL = 'deepseek-ai/DeepSeek-V4-Flash'

async function main() {
  const apiKey = process.env.SILICONFLOW_API_KEY
  if (!apiKey) {
    console.error('请先设置环境变量 SILICONFLOW_API_KEY')
    process.exit(1)
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: '你好，请用一句话回复' }],
      temperature: 0.7,
      max_tokens: 64
    })
  })

  const data = await res.json()
  console.log('HTTP', res.status)
  if (data.choices?.[0]?.message?.content) {
    console.log('回复:', data.choices[0].message.content)
  } else {
    console.log(JSON.stringify(data, null, 2))
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
