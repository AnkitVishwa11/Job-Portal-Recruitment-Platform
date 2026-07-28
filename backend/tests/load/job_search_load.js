import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 500 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% of requests must complete within 300ms
    http_req_failed: ['rate<0.01'],    // Error rate must be < 1%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:5000/api';

export default function () {
  // 1. Health check
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health status is 200': (r) => r.status === 200,
  });

  // 2. Search jobs
  const jobsRes = http.get(`${BASE_URL}/jobs?page=1&limit=10&workType=remote`);
  check(jobsRes, {
    'jobs status is 200': (r) => r.status === 200,
    'jobs returned data': (r) => JSON.parse(r.body).success === true,
  });

  sleep(1);
}
