"use client"; // This is a client component
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs, { Dayjs } from 'dayjs';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import { Clusters } from '@/components/dashboard/route/clusters';
import {Optimize} from '@/components/dashboard/route/optimize';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { set } from 'react-hook-form';
import { useEffect } from 'react';
import { array } from 'zod';
import CircularProgress from '@mui/material/CircularProgress';


export default function Page(): React.JSX.Element {
  const [deliveries, setDeliveries] = React.useState<{ [key: string]: any }[]>([]);
  const [drivers, setDrivers] = React.useState<any[]>([]);
  const [isloadingdeliveries, setIsLoadingDeliveries] = React.useState(true);
  const [isloadingdrivers, setIsLoadingDrivers] = React.useState(true);
  const [isloadingroute, setIsLoadingRoute] = React.useState(true);
  const [date, setDate] = React.useState<Dayjs | null>(dayjs('2024-03-27'));
  const [route, setRoute] = React.useState<{ [key: string]: any }>({});
  const [deliveryMap, setDeliveryMap] = React.useState<{ [key: string]: any }>({});
  const [isloading, setIsLoading] = React.useState(true);

  //Fetch the deliveries data here and update the state using setDeliveries
  useEffect(() => {
    // Fetch the deliveries data here and update the state using setDeliveries
      const fetchDeliveries = async () => {
        //convert date to string
        const date_string = date?.format('YYYY-MM-DD');
        try {
          const response = await fetch(`http://127.0.0.1:5000/order_shipping/get_shipping_info_by_delivery_date/?start_date=${date_string}&end_date=${date_string}`,
          {method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          }});
          const data = await response.json();
          console.log(data);
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
        const date_string = date?.format('YYYY-MM-DD');
        try {
          const response = await fetch(`http://localhost:5000/delivery/get_delivery/?delivery_date=${date_string}`,
          {method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          }});
          const data = await response.json();
          console.log(data);
          setRoute(data["delivery_map"]);
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
            const response = await fetch('http://localhost:5000/auth/get_all_drivers',
            {method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            }});
            const data = await response.json();
            setDrivers(data["drivers"]);
            console.log(data);
        } catch (error) {
            console.error('Error fetching deliveries:', error);
        }
        finally {
          setIsLoadingDrivers(false);
      }
      };
      fetchDrivers();
  }, []);

  //Assign drivers to deliveries and routes
  /*
  deliveryMap = {
    "alan":[
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
    jack: [
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
    unassigned:[
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
  }
  */
  useEffect(() => {
    if (!isloadingdeliveries && !isloadingdrivers && !isloadingroute && deliveries.length > 0 && drivers.length > 0 && Object.keys(route).length > 0){
      //reset delivery map
      setDeliveryMap({});
      //Set routed deliveries first
      Object.keys(route).forEach((user) => {
        var driverName = ''
        if (user === "00-unassigned"){
          driverName = "unassigned";
        }
        else{driverName = drivers.find((driver) => driver.user_id === user).name;}
        const driverDeliveries = route[user];
        const deliveriesAssigned = Array();
        driverDeliveries.forEach((shipping_id: any) => {
          const delivery = deliveries.find((delivery) => delivery.shipping_id === shipping_id);
          deliveriesAssigned.push(delivery);
        });
        setDeliveryMap((prev) => {
          return {
            ...prev,
            [driverName]: deliveriesAssigned
          };
        });
      });
      console.log(deliveryMap);
      console.log(route);
      console.log('here')
    }
    if (Object.keys(deliveryMap).length > 0){
      setIsLoading(false);
    }
  }, [route, deliveries, drivers, isloadingdeliveries, isloadingdrivers, isloadingroute]);

  //Change tabs
  const [direction, setDirection] = React.useState('clustering');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setDirection(newValue);
  };

  //Assign drivers to deliveries
  function handleAssignDrivers(shipping_id: string, driver_id: string) {
    const assignDrivers = async () => {
      try {
          const response = await fetch('http://localhost:5000/shipping/update_shipping_driver/',
          {method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          },
          body: JSON.stringify({
            "shipping_id": shipping_id,
            "driver_id": driver_id,
            "shipping_status": "In_Progress"
          })});
      } catch (error) {
          console.error('Error assigning driver to deliveries:', error);
      }
    };
    assignDrivers();
  }
    
  return (
    //load below if finish loaded
    <div>
      {!isloading ? <Grid container spacing={3}>
      <Grid xs={12}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={direction} onChange={handleChange} >
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
                            onChange={(newValue) => setDate(newValue)}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </Grid>
      {direction === 'clustering' && <Clusters deliveryMap = {deliveryMap} route = {route} setRoute = {setRoute} setDirection = {setDirection} drivers = {drivers} assignDrivers={handleAssignDrivers}/>}
      {direction === 'optimize' && <Optimize deliveries={deliveries}   deliveryMap = {deliveryMap} route = {route} setRoute = {setRoute} setDeliveries={setDeliveries} setDirection = {setDirection}  drivers = {drivers} assignDrivers={handleAssignDrivers}/>}
    </Grid> : 
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
      }
    </div>
  );
    }

