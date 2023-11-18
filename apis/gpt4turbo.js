import http from "k6/http";

export default function(
  timePerToken,
  tokensPerSecond,
  completionTokensMetric,
  secretKey) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const body = JSON.stringify({
    model: 'gpt-4-1106-preview',
    messages: [
      { role: 'user', content: 'What is the OpenAI mission?' },
    ],
  });
  const params = {
    headers: {
      'Authorization': 'Bearer ' + secretKey,
      'Content-Type': 'application/json',
    },
  };

  const resp = http.post(url, body, params);
  const { usage: { completion_tokens } } = JSON.parse(resp.body);

  const timeInMilliseconds = resp.timings.duration;

  timePerToken.add(resp.timings.duration / completion_tokens);
  tokensPerSecond.add(completion_tokens / (timeInMilliseconds / 1000));
  completionTokensMetric.add(completion_tokens);

  if (resp.status !== 200) {
    console.error('Unexpected status code: ' + resp.status);
  }
}
