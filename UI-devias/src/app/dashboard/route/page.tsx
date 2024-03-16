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


// const deliveries = [
//   [
//     {
//       id: 'ORD-007',
//       customer: { name: 'Ekaterina Tankova' },
//       amount: 30.5,
//       status: 'Received',
//       createdAt: dayjs().subtract(10, 'minutes').toDate(),
//       deliveryAddress: '123 Main St, New York, NY',
//     },
//     {
//       id: 'ORD-006',
//       customer: { name: 'Cao Yu' },
//       amount: 25.1,
//       status: 'Received',
//       createdAt: dayjs().subtract(10, 'minutes').toDate(),
//       deliveryAddress: '456 Elm St, Los Angeles, CA',
//     },
//     {
//       id: 'ORD-004',
//       customer: { name: 'Alexa Richardson' },
//       amount: 10.99,
//       status: 'In_Progress',
//       createdAt: dayjs().subtract(10, 'minutes').toDate(),
//       deliveryAddress: '789 Oak St, Chicago, IL',
//     },
//     {
//       id: 'ORD-003',
//       customer: { name: 'Anje Keizer' },
//       amount: 96.43,
//       status: 'Delivered',
//       createdAt: dayjs().subtract(10, 'minutes').toDate(),
//       deliveryAddress: '321 Pine St, San Francisco, CA',
//     },
//     {
//       id: 'ORD-002',
//       customer: { name: 'Clarke Gillebert' },
//       amount: 32.54,
//       status: 'Failed',
//       createdAt: dayjs().subtract(10, 'minutes').toDate(),
//       deliveryAddress: '987 Maple St, Seattle, WA',
//     },
//     {
//       id: 'ORD-001',
//       customer: { name: 'Adam Denisov' },
//       amount: 16.76,
//       status: 'On_Hold',
//       createdAt: dayjs().subtract(10, 'minutes').toDate(),
//       deliveryAddress: '654 Birch St, Boston, MA',
//     },
//   ],
// ];


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
const deliveries: any[]= [];
const nested = [];
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
deliveries.push(nested);

export default function Page(): React.JSX.Element {
  //Change tabs
  const [value, setValue] = React.useState('clustering');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());

  //Optimize funtion
  const optimize = () => {
    console.log('Optimize route');
  };
 
  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Clusters" value="clustering" />
            <Tab label="Route Optimization" value="optimize" />
            <Tab label="Assign Drivers" value="two" />
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
      {value === 'clustering' && <Clusters deliveries={deliveries}  />}
      {value === 'optimize' && <Optimize deliveries={deliveries} optimize={optimize} />}
    </Grid>
  );
    }

