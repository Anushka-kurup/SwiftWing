import * as React from 'react';
import dayjs from 'dayjs';

import type { Delivery } from '@/types/types';

const api = 'http://localhost:5000';

function createRequestOptions(method: string, body: unknown): unknown {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  };

  if (method === 'POST' || method === 'PUT') {
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
export async function updateOrder(delivery: Delivery): Promise<boolean> {
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

// editOrderDeliveryDate & updateDeliveryDate must be used in conjunction with each other to update delivery date
// if not, just use updateShippingDate
export async function updateShippingDate(delivery: Delivery, oldDate: string): Promise<boolean> {
  const requestOptions = createRequestOptions('PUT', {});
  const route = `${api}/order_shipping/update_shipping_date/?order_id=${delivery.shipping_id}&delivery_date=${oldDate}&new_delivery_date=${delivery.delivery_date}`;

  try {
    const response = await fetch(route, requestOptions);
    const result: unknown = await response.json();
    return result as boolean;
  } catch (error) {
    console.error('Error edit delivery date:', error);
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

// update delivery date
export async function updateDeliveryDate(delivery: Delivery): Promise<boolean> {
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
    console.error('Error complete delivery:', error);
  }
  return false;
}

// completeOrder and completeDelivery are the same in completing delivery
// complete order
export async function completeOrder(delivery: Delivery): Promise<boolean> {
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

// complete delivery
export async function completeDelivery(delivery: Delivery): Promise<boolean> {
  const requestOptions = createRequestOptions('POST', {
    shipping_id: delivery.shipping_id,
    shipping_status: 'Delivered',
    driver_id: delivery.driver_id,
  });
  const route = `${api}/shipping/update_shipping_status`;

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
export async function uploadProof(delivery: Delivery, proofImage: File): Promise<boolean> {
  const convertedImage = await ConvertImageToBase64(proofImage);
  const requestOptions = createRequestOptions('POST', {
    base64_image: convertedImage,
    user_id: 'alice',
    shipping_id: delivery.shipping_id,
    date: dayjs(delivery.delivery_date).format('YYYY-MM-DD'),
  });

  const route = `${api}/order/upload_to_s3/`;
  try {
    const response = await fetch(route, requestOptions);
    const result: unknown = await response.json();
    return result as boolean;
  } catch (error) {
    console.error('Error complete delivery:', error);
  }
  return false;
}

// update delivery timestamp
export async function updateDeliveryTimeStamp(delivery: Delivery, date: string): Promise<boolean> {
  const requestOptions = createRequestOptions('PUT', {
    order_id: delivery.shipping_id,
    delivery_timestamp: date,
  });
  const route = `${api}/order/update_delivery_timestamp`;

  try {
    const response = await fetch(route, requestOptions);
    const result: unknown = await response.json();
    return result as boolean;
  } catch (error) {
    console.error('Error complete delivery:', error);
  }
  return false;
}

export async function ConvertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
