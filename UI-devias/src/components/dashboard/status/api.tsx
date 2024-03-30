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

// get orderID assigned to driver by date
export async function getRouteList(startDate: string): Promise<unknown[]> {
  const requestOptions = createRequestOptions('GET', null);
  try {
    const response = await fetch(api + '/delivery/get_delivery/?delivery_date=' + startDate, requestOptions);
    const result: unknown = await response.json();
    return result;
  } catch (error) {
    console.error('Error get drivers:', error);
  }
  return [];
}

// get deliveries by date
export async function getDeliveriesByDateAndDriver(
  startDate: string,
  endDate: string,
  driverID: string
): Promise<Delivery[]> {
  const requestOptions = createRequestOptions('GET', null);
  const route = `${api}/order_shipping/get_shipping_info_by_delivery_date?start_date=${startDate}&end_date=${endDate}`;
  try {
    const response = await fetch(route, requestOptions);
    const allOrders: unknown = await response.json();

    const routeList = await getRouteList(startDate);
    console.log(routeList);
    console.log(driverID);

    const driverRoute = routeList['delivery_map'][driverID];
    if (!driverRoute) {
      return [];
    }
    const deliveries: Delivery[] = allOrders
      .map((order: Delivery) => {
        if (driverRoute?.includes(order.shipping_id)) {
          return order;
        }
      })
      .filter((delivery) => delivery !== null && delivery !== undefined);
    console.log(deliveries);
    return deliveries;
  } catch (error) {
    console.error('Error get deliveries:', error);
  }
  return [];
}

export async function getProofById(delivery: Delivery, date: string): Promise<string> {
  // get list of route by date
  const routeList = await getRouteList(date);

  for (const driver in routeList['delivery_map']) {
    if (routeList['delivery_map'][driver].includes(delivery.shipping_id)) {
      const link = await getProof(delivery, driver);
      return link;
    }
  }
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
  delete newDelivery?.driver_id; // to be deleted
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
export async function completeDelivery(delivery: Delivery, driverId: string): Promise<boolean> {
  const requestOptions = createRequestOptions('POST', {
    shipping_id: delivery.shipping_id,
    shipping_status: 'Delivered',
    driver_id: driverId,
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
export async function uploadProof(delivery: Delivery, proofImage: File, driverId: string): Promise<boolean> {
  const formData = new FormData();
  formData.append('file', proofImage);
  formData.append('user_id', driverId);
  formData.append('shipping_id', delivery.shipping_id);
  formData.append('date', dayjs(delivery.delivery_date).format('YYYY-MM-DD'));

  const route = `${api}/order/upload_to_s3/`;
  try {
    const response = await fetch(route, { method: 'POST', body: formData });
    const result: unknown = await response.json();
    return result as boolean;
  } catch (error) {
    console.error('Error complete delivery:', error);
  }
  return false;
}

// get proof of delivery
export async function getProof(delivery: Delivery, driverId: string): Promise<string> {
  const fileName = `${driverId}$${delivery.shipping_id}$${dayjs(delivery.delivery_date).format('YYYY-MM-DD')}`;
  const route = `${api}/order/retrieve_S3_url/?file_name=${fileName}`;
  try {
    const response = await fetch(route, { method: 'GET', body: null });
    const result: unknown = await response.json();
    return result;
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
