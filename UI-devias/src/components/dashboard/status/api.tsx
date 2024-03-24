import type { Delivery } from '@/types/types';

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

// get all drivers - may wanna change this to get all drivers that are assigned to delivery
export async function getDrivers(): Promise<unknown> {
  const requestOptions = createRequestOptions('GET', null);
  try {
    const response = await fetch(api + '/auth/get_all_drivers', requestOptions);
    const result: unknown = await response.json();
    return result;
  } catch (error) {
    console.error('Error get drivers:', error);
  }
  return [];
}

// get orders by date
export async function getOrdersByDate(startDate: string, endDate: string): Promise<unknown> {
  const requestOptions = createRequestOptions('GET', null);
  const route = `${api}/order/get_all_order_by_delivery_date?start_date=${startDate}&end_date=${endDate}`;
  try {
    const response = await fetch(route, requestOptions);
    const result: unknown = await response.json();
    return result;
  } catch (error) {
    console.error('Error get deliveries:', error);
  }
  return [];
}

// get deliveries by date
export async function getDeliveriesByDate(startDate: string, endDate: string): Promise<Delivery[]> {
  const requestOptions = createRequestOptions('GET', null);
  const route = `${api}/order_shipping/get_shipping_info_by_delivery_date?start_date=${startDate}&end_date=${endDate}`;
  try {
    const response = await fetch(route, requestOptions);
    const result: unknown = await response.json();
    return result;
  } catch (error) {
    console.error('Error get deliveries:', error);
  }
  return [];
}
