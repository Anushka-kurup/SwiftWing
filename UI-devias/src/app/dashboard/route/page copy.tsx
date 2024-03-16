"use client"; // This is a client component
import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs, { Dayjs } from 'dayjs';
import Button from '@mui/material/Button';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { config } from '@/config';
import { Orders } from '@/components/dashboard/route/orders';
import Typography from '@mui/material/Typography';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const deliveries = [
  [
    {
      id: 'ORD-007',
      customer: { name: 'Ekaterina Tankova' },
      amount: 30.5,
      status: 'Received',
      createdAt: dayjs().subtract(10, 'minutes').toDate(),
      deliveryAddress: '123 Main St, New York, NY',
    },
    {
      id: 'ORD-006',
      customer: { name: 'Cao Yu' },
      amount: 25.1,
      status: 'Received',
      createdAt: dayjs().subtract(10, 'minutes').toDate(),
      deliveryAddress: '456 Elm St, Los Angeles, CA',
    },
    {
      id: 'ORD-004',
      customer: { name: 'Alexa Richardson' },
      amount: 10.99,
      status: 'In_Progress',
      createdAt: dayjs().subtract(10, 'minutes').toDate(),
      deliveryAddress: '789 Oak St, Chicago, IL',
    },
    {
      id: 'ORD-003',
      customer: { name: 'Anje Keizer' },
      amount: 96.43,
      status: 'Delivered',
      createdAt: dayjs().subtract(10, 'minutes').toDate(),
      deliveryAddress: '321 Pine St, San Francisco, CA',
    },
    {
      id: 'ORD-002',
      customer: { name: 'Clarke Gillebert' },
      amount: 32.54,
      status: 'Failed',
      createdAt: dayjs().subtract(10, 'minutes').toDate(),
      deliveryAddress: '987 Maple St, Seattle, WA',
    },
    {
      id: 'ORD-001',
      customer: { name: 'Adam Denisov' },
      amount: 16.76,
      status: 'On_Hold',
      createdAt: dayjs().subtract(10, 'minutes').toDate(),
      deliveryAddress: '654 Birch St, Boston, MA',
    },
  ],
];
export default function Page(): React.JSX.Element {
  const [orders, setOrders] = React.useState(deliveries);
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());

  const handleInputChange = () => {
    // Create length number of orders based on input 
    const input = document.getElementById('clusters') as HTMLInputElement;
    const value = input.value;
    const newOrders = [];
    for (let i = 0; i < parseInt(value); i++) {
      newOrders.push([
        {
          id: `ORD-${i + 1}`,
          customer: { name: 'New Customer' },
          amount: 0,
          status: 'New',
          createdAt: new Date(),
          deliveryAddress: '',
        },
      ]);
    }
    setOrders(newOrders);
  };

  
  return (
        <Grid container spacing={3}>
          <Grid  xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker
                label="Date Select"
                value={date}
                onChange={(newValue) => setDate(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
          </Grid>
          <Grid  lg={12} style={{position: 'sticky' }}>
          <label htmlFor="numberOfOrders">Clusters:</label>
            <input type="number" id="clusters" />
            <Button style={{margin:"20px"}} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} onClick={handleInputChange} variant="contained">
              Create Clusters
            </Button>
            <Button style={{margin:"20px",color:"red"}} onClick={handleInputChange} variant="outlined">
              Confirm Clusters
            </Button>
          </Grid> 
          <Grid lg={12} md={12} xs={12}>
            {orders.map((nestedList, index) => (
              <Orders
                key={index}
                orders={nestedList.map((order) => ({
                  ...order,
                  status: order.status as "Received" | "Delivered" | "Failed" | "In_Progress" | "On_Hold",
                }))}
                sx={{ marginBottom: '20px' }}
              />
            ))}
          </Grid>
        </Grid>
      );
    }

