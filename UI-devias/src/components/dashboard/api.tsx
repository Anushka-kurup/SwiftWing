import type { Delivery } from '@/types/types';
import { Order } from './delivery-info-modal';

const api = 'http://localhost:5000';

function createRequestOptions(method: string, body: unknown): unknown {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  };

  if (body) {
    return {
      method,
      headers,
      body: JSON.stringify(body),
    };
  }
  return {
    method,
    headers,
  };
}

// get deliveries by date and sender
export async function getDeliveriesByDateAndSender(sender_id: string, startDate: string, endDate: string): Promise<Delivery[]> {
  const requestOptions = createRequestOptions('GET', null);
  const route = `${api}/order_shipping/get_shipping_info_by_user_id/?sender_id=${sender_id}&start_date=${startDate}&end_date=${endDate}`;
  try {
    const response = await fetch(route, requestOptions);
    const result: unknown = await response.json();
    return result as Delivery[]; // Type assertion
  } catch (error) {
    console.error('Error get deliveries:', error);
  }
  return [];
}

// create delivery 
export async function createOrderShipping(order: Order): Promise<unknown> {
  const body = order;
  console.log(body);
  const requestOptions = createRequestOptions('POST', body);
  const route = `${api}/order_shipping/create_order_shipping/`;
  try {
    const response = await fetch(route, requestOptions);
    const result: unknown = await response.json();
    return result;
  } catch (error) {
    console.error('Error create delivery:', error);
  }
  return [];
}

export async function getLatLong(address : string): Promise<{latitude: string, longitude: string}> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(address)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`);
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        const response = JSON.parse(xhr.responseText);
        if (response.results && response.results.length > 0) {
          const { LATITUDE, LONGITUDE } = response.results[0];
          resolve({ latitude: LATITUDE, longitude: LONGITUDE });
        } else {
          reject('No results found');
        }
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = function() {
      reject(xhr.statusText);
    };
    xhr.send();
  });
}
