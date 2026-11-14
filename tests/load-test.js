import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Define the load profile (Ramp-up, Steady State, Ramp-down)
  stages: [
    { duration: '5s', target: 10 },  // Ramp up to 10 Virtual Users over 5 seconds
    { duration: '15s', target: 10 }, // Stay at 10 Virtual Users for 15 seconds
    { duration: '5s', target: 0 },   // Ramp down to 0 Virtual Users
  ],
  // Pass/Fail Quality Gates for the CI Pipeline
  thresholds: {
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
    http_req_duration: ['p(95)<250'], // 95% of requests must complete under 250ms
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/api/users`);

  // Functional validation during load
  check(res, {
    'status is 200': (r) => r.status === 200,
    'returned 2 users': (r) => r.json('count') === 2,
  });

  sleep(0.5); // Simulate user think-time (500ms between requests)
}
