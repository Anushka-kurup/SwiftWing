import dayjs from 'dayjs';

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
export async function getDrivers(): Promise<unknown[]> {
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
  const route = `${api}/order/get_order_by_delivery_date?start_date=${startDate}&end_date=${endDate}`;
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

// edit order info
export async function editOrderInfo(delivery: Delivery): Promise<boolean> {
  const newDelivery = { ...delivery, order_id: delivery.shipping_id };
  delete newDelivery?.shipping_id;
  delete newDelivery?.driver_id;
  delete newDelivery?.shipping_status;

  const requestOptions = createRequestOptions('PUT', newDelivery);
  const route = `${api}/order/update_order`;

  try {
    const response = await fetch(route, requestOptions);
    const result: unknown = await response.json();
    return result as boolean;
  } catch (error) {
    console.error('Error edit delivery:', error);
  }
  return false;
}

// edit order's delivery date
export async function editOrderDeliveryDate(delivery: Delivery): Promise<boolean> {
  const requestOptions = createRequestOptions('PUT', {
    order_id: delivery.shipping_id,
    delivery_date: delivery.delivery_date,
  });
  const route = `${api}/order/update_delivery_date`;

  try {
    const response = await fetch(route, requestOptions);
    const result: unknown = await response.json();
    return result as boolean;
  } catch (error) {
    console.error('Error edit delivery date:', error);
  }
  return false;
}

// complete delivery
export async function completeDelivery(delivery: Delivery): Promise<boolean> {
  const requestOptions = createRequestOptions('PUT', {
    order_id: delivery.shipping_id,
  });
  const route = `${api}/order_shipping/complete_delivery`;

  try {
    const response = await fetch(route, requestOptions);
    const result: unknown = await response.json();
    return result as boolean;
  } catch (error) {
    console.error('Error complete delivery:', error);
  }
  return false;
}

// update delivery date
export async function updateDeliveryDate(delivery: Delivery, date: string): Promise<boolean> {
  const requestOptions = createRequestOptions('PUT', {
    order_id: delivery.shipping_id,
    delivery_date: date,
  });
  const route = `${api}/order/update_delivery_date`;

  try {
    const response = await fetch(route, requestOptions);
    const result: unknown = await response.json();
    return result as boolean;
  } catch (error) {
    console.error('Error complete delivery:', error);
  }
  return false;
}

// upload proof of delivery
export async function uploadProof(delivery: Delivery, file: File): Promise<boolean> {
  const requestOptions = createRequestOptions('POST', {
    file,
    user_id: delivery.driver_id,
    shipping_id: delivery.shipping_id,
    date: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  });
  const route = `${api}/order/upload_to_s3`;

  try {
    const response = await fetch(route, requestOptions);
    const result: unknown = await response.json();
    return result as boolean;
  } catch (error) {
    console.error('Error complete delivery:', error);
  }
  return false;
}
