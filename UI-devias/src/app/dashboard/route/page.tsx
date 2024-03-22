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

// Since true randomness is tricky in pure frontend JavaScript, 
// we'll use a fixed list of locations.
const randomLocations = [
  "50 Pasir Panjang Road, Singapore 117439",
  "200 Pasir Panjang Road, Singapore 117600",
  "10 Tampines Street 93, Singapore 528817",
  "30 Bishan Street 12, Singapore 579773",
  "10 Paya Lebar Road, Singapore 408578",
  "15 Beach Road, Singapore 189670",
  "80 Robinson Road, Singapore 068898",
  "10 Collyer Quay, Singapore 049315",
];

const coordinates = [
  [
    "1.3245706",
    "103.8773117"
  ],
  [
    "1.400066",
    "103.906531"
  ],
  [
    "1.3720699",
    "103.969923"
  ],
  [
    "1.3318464",
    "103.9463496"
  ],
  [
    "1.2822323",
    "103.8592267"
  ],
  [
    "1.2896695",
    "103.7786133"
  ],
  [
    "1.3122508",
    "103.6971501"
  ],
  ["1.33164", "103.84834"],
  ["1.33649", "103.88413"]
];

// Generate 8 deliveries using the random locations
// deliveries is a nested array

const deliveries_list = Array();
const nested = Array();
for (let i = 0; i < randomLocations.length; i++) {
  const newOrder = 
    {
      order_id: `ORD-0000${i + 1}`,
      pickup_location: "313@Somerset, 313 Orchard Road, Singapore 238895",
      destination: randomLocations[i],
      package_dimension: [10.0 + i, 10.0 + i, 10.0 + i],
      package_weight: 5.0 + i,
      time_constraint: new Date(2024, 2, 17 + i, 10, 0), // Note: Month 2 = March
      special_handling_instruction: `Special Instruction ${i + 1}`,
      latitude: coordinates[i + 1][0],
      longitude: coordinates[i + 1][1],
      createdAt: dayjs().subtract(10, 'minutes').toDate(),
      status: ['Received', 'In_Progress', 'Delivered', 'Failed', 'On_Hold'][i % 5],
      customer: "Random name"
    }
  nested.push(newOrder);
}
deliveries_list.push(nested);
console.log(deliveries_list);


export default function Page(): React.JSX.Element {
  const [deliveries, setDeliveries] = React.useState<{ [key: string]: any }[]>([]);
  const [drivers, setDrivers] = React.useState<any[]>([]);
  const [isloadingdeliveries, setIsLoadingDeliveries] = React.useState(true);
  const [isloadingdrivers, setIsLoadingDrivers] = React.useState(true);


  //Fetch the deliveries data here and update the state using setDeliveries
  useEffect(() => {
      // Fetch the deliveries data here and update the state using setDeliveries
      // Example:
      const fetchDeliveries = async () => {
          try {
              const response = await fetch('http://127.0.0.1:5000/order_shipping/get_all_shipping_info/',
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
  }, []);

  // React.useEffect(() => {
  //   setDeliveries(deliveries_list);
  // }, []);

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

  //Change tabs
  const [direction, setDirection] = React.useState('clustering');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setDirection(newValue);
  };
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());

  return (
    //load below if finish loaded
    <div>
      {!isloadingdeliveries && !isloadingdrivers ? <Grid container spacing={3}>
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
      {direction === 'clustering' && <Clusters deliveries={deliveries} setDeliveries={setDeliveries} setDirection = {setDirection} drivers = {drivers}/>}
      {direction === 'optimize' && <Optimize deliveries={deliveries} setDeliveries={setDeliveries} setDirection = {setDirection}  drivers = {drivers}/>}
    </Grid> : 
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
      }
    </div>
  );
    }

