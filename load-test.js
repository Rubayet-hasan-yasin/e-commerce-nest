import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },  // ramp up to 10 users
    { duration: '30s', target: 50 },  // stay at 50 users
    { duration: '10s', target: 0 },   // ramp down
  ],
};

export default function () {
  // Example hitting your product API
  const res = http.get('http://localhost:8000/v1/product');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1); // wait before next request
}
