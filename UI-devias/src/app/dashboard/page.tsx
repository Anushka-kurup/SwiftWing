"use client"; // This is a client component
import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect } from 'react';


import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Clusters } from '@/components/dashboard/orders_display';


const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [deliveries, setDeliveries] = React.useState<{ [key: string]: any }[]>([]);
  const [isloadingdeliveries, setIsLoadingDeliveries] = React.useState(true);
  const [drivers, setDrivers] = React.useState<any[]>([]);



  useEffect(() => {
    // Fetch the orders data here and update the state using setDeliveries
      const fetchDeliveries = async () => {
        //convert date to string
        const date_string = date?.format('YYYY-MM-DD');
        const id_string = "Tiktok";
        try {
          const response = await fetch(`http://127.0.0.1:5000/order/get_order_by_user_id/?sender_id=${id_string}&start_date=${date_string}&end_date=${date_string}`,
          {method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          }});
          const data = await response.json();
          console.log(data);
          setDeliveries(Array(data));
        } catch (error) {
          console.error('Error fetching deliveries:', error);
      } finally {
          setIsLoadingDeliveries(false);
      }
    };
      fetchDeliveries();
  }, [date]);

  return (
    
    <Grid xs={12}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker', 'DatePicker']}>
          <DatePicker
            label="Date Select"
            value={date}
            onChange={(newValue) => setDate(newValue)} />
        </DemoContainer>
      </LocalizationProvider>
      <Clusters deliveries={deliveries} setDeliveries={setDeliveries} drivers = {drivers}/>
    </Grid>
  );
}
