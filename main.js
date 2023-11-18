import { Trend } from "k6/metrics";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import gpt3turbo from './apis/gpt3turbo.js';
import gpt4turbo from './apis/gpt4turbo.js';

export const options = {
  vus: 10,
  duration: '10s',
};

const timePerToken = Trend('time_per_token (ms)');
const tokensPerSecond = Trend('tokens_per_second');
const completionTokensMetric = Trend('completion_tokens');

export default function() {
  const target = `${__ENV.TARGET}`;
  if (target === 'gpt3turbo') {
    const secretKey = `${__ENV.OPENAI_SECRET_KEY}`;
    gpt3turbo(
      timePerToken,
      tokensPerSecond,
      completionTokensMetric,
      secretKey,
    );
  } else if (target === 'gpt4turbo') {
    const secretKey = `${__ENV.OPENAI_SECRET_KEY}`;
    gpt4turbo(
      timePerToken,
      tokensPerSecond,
      completionTokensMetric,
      secretKey,
    );
  }
}

export function handleSummary(data) {
  const name = `${__ENV.TARGET.replace(/\W/g, '_')}.html`;
  return {
    [name]: htmlReport(data),
  };
}
