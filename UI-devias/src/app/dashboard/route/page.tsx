'use client';

// This is a client component
import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { type Dayjs } from 'dayjs';

import { RouteAPIReturn, type DriverAPIReturn } from '@/types/api-return-types';
import type { Delivery, Driver, Route } from '@/types/types';
import { Clusters } from '@/components/dashboard/route/clusters';
import { Optimize } from '@/components/dashboard/route/optimize';
import { getDeliveriesByDate } from '@/components/dashboard/status/api';

export default function Page(): React.JSX.Element {
  const [deliveries, setDeliveries] = React.useState<Delivery[]>([]); // Change this to the correct type
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [isloadingdeliveries, setIsLoadingDeliveries] = React.useState(true);
  const [isloadingdrivers, setIsLoadingDrivers] = React.useState(true);
  const [isloadingroute, setIsLoadingRoute] = React.useState(true);
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [route, setRoute] = React.useState<Route[]>([]);
  const [deliveryMap, setDeliveryMap] = React.useState<any[]>([]);
  const [deliveryUser, setDeliveryUser] = React.useState<any[]>([]);
  const [isloading, setIsLoading] = React.useState(true);

  //Fetch the deliveries data here and update the state using setDeliveries
  useEffect(() => {
    // Fetch the deliveries data here and update the state using setDeliveries
    const fetchDeliveries = async () => {
      //convert date to string
      const dateString = date?.format('YYYY-MM-DD') ?? '';
      try {
        const data = await getDeliveriesByDate(dateString, dateString);
        setDeliveries(data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      } finally {
        setIsLoadingDeliveries(false);
      }
    };
    fetchDeliveries();
  }, [date]);

  //Fetch the route
  useEffect(() => {
    const fetchRoute = async () => {
      //convert date to string
      const dateString = date?.format('YYYY-MM-DD');
      try {
        const response = await fetch(`http://localhost:5000/delivery/get_delivery/?delivery_date=${dateString}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          },
        });
        const data = (await response.json()) as RouteAPIReturn;
        console.log(data);
        setRoute([]); // Clear the route array before setting new values
        setDeliveryUser([]); // Clear the deliveryUser array before setting new values
        Object.keys(data['delivery_map']).forEach((key) => {
          const deliveries = data['delivery_map'][key];
          setRoute((prev) => [...prev, deliveries]);
          setDeliveryUser((prev) => [...prev, key]);
        });
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      } finally {
        setIsLoadingRoute(false);
      }
    };
    fetchRoute();
  }, [date]);

  //Get Drivers
  useEffect(() => {
    // Fetch the deliveries data here and update the state using setDeliveries
    // Example:
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/get_all_drivers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          },
        });
        const data = (await response.json()) as DriverAPIReturn;
        setDrivers(data['drivers']);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      } finally {
        setIsLoadingDrivers(false);
      }
    };
    fetchDrivers();
  }, []);

  //Assign drivers to deliveries and routes
  /*
  deliveryUser = ['Adam', 'Jack', 'Unassigned']
  route = [
    ['1', '2'],
    ['3', '4'],
    ['5', '6']
  ]
  deliveryMap = [
    [
      {
        "shipping_id": "1",
        "delivery_address": "1234 Main St",
        "delivery_date": "2022-10-10",
        "delivery_time": "12:00:00",
        "driver_id": "1",
        "shipping_status": "In_Progress"
      },
      {
        "shipping_id": "2",
        "delivery_address": "1234 Main St",
        "delivery_date": "2022-10-10",
        "delivery_time": "12:00:00",
        "driver_id": "1",
        "shipping_status": "In_Progress"
      }
    ],
    [
      {
        "shipping_id": "3",
        "delivery_address": "1234 Main St",
        "delivery_date": "2022-10-10",
        "delivery_time": "12:00:00",
        "driver_id": "2",
        "shipping_status": "In_Progress"
      },
      {
        "shipping_id": "4",
        "delivery_address": "1234 Main St",
        "delivery_date": "2022-10-10",
        "delivery_time": "12:00:00",
        "driver_id": "2",
        "shipping_status": "In_Progress"
      }
    ],
    [
      {
        "shipping_id": "5",
        "delivery_address": "1234 Main St",
        "delivery_date": "2022-10-10",
        "delivery_time": "12:00:00",
        "driver_id": "3",
        "shipping_status": "In_Progress"
      },
      {
        "shipping_id": "6",
        "delivery_address": "1234 Main St",
        "delivery_date": "2022-10-10",
        "delivery_time": "12:00:00",
        "driver_id": "3",
        "shipping_status": "In_Progress"
      }
    ]
  ]
  */
  useEffect(() => {
    if (
      !isloadingdeliveries &&
      !isloadingdrivers &&
      !isloadingroute &&
      deliveries.length > 0 &&
      drivers.length > 0 &&
      Object.keys(route).length > 0
    ) {
      //reset delivery map
      setDeliveryMap([]);
      console.log('running');
      console.log(deliveryUser);
      //Set routed deliveries first
      for (let i = 0; i < deliveryUser.length; i++) {
        let driverName = '';
        const user = deliveryUser[i];
        if (user === '00-unassigned') {
          driverName = 'unassigned';
        } else {
          driverName = drivers.find((driver) => driver.user_id === user).name;
        }
        const driverDeliveries = route[i];
        const deliveriesAssigned = Array();
        driverDeliveries.forEach((shippingId: any) => {
          const delivery = deliveries.find((delivery) => delivery.shipping_id === shippingId);
          deliveriesAssigned.push(delivery);
        });
        setDeliveryMap((prev) => [...prev, deliveriesAssigned]);
      }
    }
    if (Object.keys(deliveryMap).length > 0) {
      setIsLoading(false);
    }
    console.log('running');
    console.log(deliveryMap);
    console.log(route);
    console.log(deliveryUser);
  }, [route, deliveries, drivers, isloadingdeliveries, isloadingdrivers, isloadingroute]);

  //Change tabs
  const [direction, setDirection] = React.useState('clustering');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setDirection(newValue);
  };

  //Assign drivers to deliveries
  function handleAssignDrivers(shippingId: string, driverId: string): void {
    const assignDrivers = async () => {
      try {
        const response = await fetch('http://localhost:5000/shipping/update_shipping_driver/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          },
          body: JSON.stringify({
            shipping_id: shippingId,
            driver_id: driverId,
            shipping_status: 'In_Progress',
          }),
        });
      } catch (error) {
        console.error('Error assigning driver to deliveries:', error);
      }
    };
    assignDrivers();
  }

  return (
    //load below if finish loaded
    <div>
      {!isloading ? (
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={direction} onChange={handleChange}>
                <Tab label="Clusters" value="clustering" />
                <Tab label="Route Optimization" value="optimize" />
              </Tabs>
            </Box>
          </Grid>
          <Grid xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker', 'DatePicker']}>
                <DatePicker
                  label="Date Select"
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          {direction === 'clustering' && (
            <Clusters
              deliveryMap={deliveryMap}
              route={route}
              setRoute={setRoute}
              deliveryUser={deliveryUser}
              setDeliveryUser={setDeliveryUser}
              setDirection={setDirection}
              drivers={drivers}
              assignDrivers={handleAssignDrivers}
            />
          )}
          {direction === 'optimize' && (
            <Optimize
              deliveryMap={deliveryMap}
              route={route}
              setRoute={setRoute}
              deliveryUser={deliveryUser}
              setDeliveryUser={setDeliveryUser}
              setDeliveries={setDeliveries}
              setDirection={setDirection}
              drivers={drivers}
              assignDrivers={handleAssignDrivers}
            />
          )}
        </Grid>
      ) : (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}
