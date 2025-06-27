import http from 'k6/http';
import { sleep, check } from 'k6';


export const options = {
  vus: 100,
  duration: '30s',
  // iterations: 1
};

export default function() {
  const credentials = `admin:123`;
  const url = `http://${credentials}@localhost:8000`

    let responses = http.batch([`${url}/api/store/1/stock`,
      `${url}/api/store/2/stock`,
      `${url}/api/store/3/stock`,
      `${url}/api/store/4/stock`,
      `${url}/api/store/5/stock`,
    ]);
    
    responses.forEach(res => {
      check(res, { "status is 200": (res) => res.status === 200 });
    })

    // responses = http.batch([`${url}/api/store/1/sales-report`,
    //   `${url}/api/store/2/sales-report`,
    //   `${url}/api/store/3/sales-report`,
    //   `${url}/api/store/4/sales-report`,
    //   `${url}/api/store/5/sales-report`
    // ])

    // responses.forEach(res => {
    //   check(res, { "status is 200": (res) => res.status === 200 });
    // })

  for (let i = 0; i < 10; i++) {
    const response = http.put(`${url}/api/product/1`, JSON.stringify({
      name: `product:${i}`,
      category: `category:${i}`,
      price: i
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    })

      check(response, { "status is 200": (response) => response.status === 204 });
    }

    // sleep(1);
  }
  