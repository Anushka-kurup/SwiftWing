"use client"; // This is a client component
import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Orders } from '@/components/dashboard/route/orders';


const orders = [
  {
    id: 'ORD-007',
    customer: { name: 'Ekaterina Tankova' },
    amount: 30.5,
    status: 'pending',
    createdAt: dayjs().subtract(10, 'minutes').toDate(),
    deliveryAddress: '123 Main St, New York, NY',
  },
  {
    id: 'ORD-006',
    customer: { name: 'Cao Yu' },
    amount: 25.1,
    status: 'delivered',
    createdAt: dayjs().subtract(10, 'minutes').toDate(),
    deliveryAddress: '456 Elm St, Los Angeles, CA',
  },
  {
    id: 'ORD-004',
    customer: { name: 'Alexa Richardson' },
    amount: 10.99,
    status: 'refunded',
    createdAt: dayjs().subtract(10, 'minutes').toDate(),
    deliveryAddress: '789 Oak St, Chicago, IL',
  },
  {
    id: 'ORD-003',
    customer: { name: 'Anje Keizer' },
    amount: 96.43,
    status: 'pending',
    createdAt: dayjs().subtract(10, 'minutes').toDate(),
    deliveryAddress: '321 Pine St, San Francisco, CA',
  },
  {
    id: 'ORD-002',
    customer: { name: 'Clarke Gillebert' },
    amount: 32.54,
    status: 'delivered',
    createdAt: dayjs().subtract(10, 'minutes').toDate(),
    deliveryAddress: '987 Maple St, Seattle, WA',
  },
  {
    id: 'ORD-001',
    customer: { name: 'Adam Denisov' },
    amount: 16.76,
    status: 'delivered',
    createdAt: dayjs().subtract(10, 'minutes').toDate(),
    deliveryAddress: '654 Birch St, Boston, MA',
  },
]

export default function Page(): React.JSX.Element {
  const [numberOfOrders, setNumberOfOrders] = React.useState(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setNumberOfOrders(value);
  };

  return (
    <Grid container spacing={3}>
      add a number <input type="text" onChange={handleInputChange} />
      <Grid lg={8} md={12} xs={12}>
        {Array.from({ length: numberOfOrders }).map((_, index) => (
          <Orders
            key={index}
            orders={orders.map((order) => ({
              ...order,
              status: order.status as "pending" | "delivered" | "refunded",
            }))}
            sx={{ marginBottom: '20px' }}
          />
        ))}
      </Grid>
    </Grid>
  );
}

