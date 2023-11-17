import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  vus: 100,
  duration: '10s',
};

export default function() {
  http.get(`${__ENV.HOSTNAME}`);
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
