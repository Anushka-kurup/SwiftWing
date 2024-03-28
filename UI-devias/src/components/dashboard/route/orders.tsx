import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import { CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';
import { any } from 'zod';
import CheckIcon from '@mui/icons-material/Check';
import { set } from 'react-hook-form';

const statusMap = {
  "Awaiting Assignment": { label: 'Received', color: 'info' },
  In_Progress: { label: 'In Progress', color: 'warning' },
  Delivered: { label: 'Delivered', color: 'success' },
  Failed: { label: 'Failed', color: 'error' },
  On_Hold: { label: 'On Hold', color: 'default' },
} as const;

export interface Order {
  shipping_id: string;
  sender_id: string;
  pickup_location: string;
  destination: string;
  package_dimension: Array<any>; // Fix: Specify the type argument for the Array generic.
  package_weight: number;
  time_constraint: Date;
  special_handling_instruction: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  shipping_status: 'Awaiting Assignment' | 'In_Progress' | 'Delivered' | 'Failed' | 'On_Hold';
  customer: string;
  driver: string;
}

export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
  type?: string;
  drivers: Array<any>;
  assignDrivers: any;
  setRoute: any;
  route: any;
  deliveryUser?: any;
  setDeliveryUser?: any; 
  indexer: number;
}

export function Orders({ orders = [], sx , type, drivers, assignDrivers, setRoute, route, setIsLoading, deliveryUser, setDeliveryUser, indexer}: LatestOrdersProps): React.JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(true);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Add a new state variable
const [selectLabel, setSelectLabel] = React.useState(indexer);

// Update the state variable whenever the label prop changes
  React.useEffect(() => {
    setSelectLabel(indexer);
  }, [indexer]);

  const handleChange = (event: SelectChangeEvent) => {
    const driver = event.target.value;
    console.log(indexer)
    console.log("driver: ", driver)


    var selectedDriver = ''
    if (driver === "unassigned") {
      selectedDriver = "00-unassigned";
    }
    else{
      selectedDriver = drivers.find((driver_info: any) => driver_info.name === driver).user_id;
    }
    const prevValue = orders[0].driver;
  
    // Update both deliveryUser and route
    var index = deliveryUser.indexOf(selectedDriver);
    var prevIndex = indexer
    console.log("index: ", index)
    console.log("prevIndex: ", prevIndex)
    
    if (index !== -1 && selectedDriver != "00-unassigned") { // selectedDriver is in deliveryUser but not unassigned
      //deliveries of new driver
      var deliveries = route[prevIndex]; 
      // Add to route at route[index] using setRoute
      setRoute((prevRoute: any) => {
        const newRoute = [...prevRoute]; // Create a copy of the state
        console.log("before: ", newRoute)
        newRoute[index] = newRoute[index].concat(deliveries);
        newRoute.splice(prevIndex, 1);
        console.log("after: ", newRoute)
        return newRoute; // Set the state with the modified copy
      });
      //delete from deliveryUser
      setDeliveryUser((prevDeliveryUser: any) => {
        const newDeliveryUser = [...prevDeliveryUser]; // Create a copy of the state
        console.log("before: ", newDeliveryUser)
        newDeliveryUser.splice(prevIndex, 1);
        console.log("after: ", newDeliveryUser)
        return newDeliveryUser; // Set the state with the modified copy
      });
    }
    else {
      // Add to deliveryUser
      setDeliveryUser((prevDeliveryUser: any) => {
        const newDeliveryUser = [...prevDeliveryUser]; // Create a copy of the state
        //newDeliveryUser.push(selectedDriver);
        //modify prevUser to new user
        newDeliveryUser[prevIndex] = selectedDriver;
        return newDeliveryUser; // Set the state with the modified copy
      });
      // // Add to route
      // setRoute((prevRoute: any) => {
      //   const newRoute = [...prevRoute]; // Create a copy of the state
      //   //newRoute.push(orders);
      //   newRoute[prevIndex] = orders;
      //   return newRoute; // Set the state with the modified copy
      // });
    }
    
    //stop here
    setIsButtonCompleted(false);
  };
  
  const [isButtonRunning, setIsButtonRunning] = React.useState(false);
  const [isButtonCompleted, setIsButtonCompleted] = React.useState(false);

  return (
    <Card sx={{
      alignItems: 'center',
      border: '1px solid var(--mui-palette-neutral-700)',
      borderRadius: '12px',
      cursor: 'pointer',
      p: '4px 12px',
      margin: '20px',
    }}>
      <Box>
        <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel sx={{ color: "var(--mui-palette-neutral-400)" }}>Driver</InputLabel>
          <Select
            id="simple_select"
            value={drivers.find((driver_info: any) => driver_info.user_id === orders[0].driver)?.name || 'unassigned'}
            label={indexer}
            onChange={handleChange}
          >
            <MenuItem value="unassigned">Unassigned</MenuItem>
            {drivers.map((driver) => (
              <MenuItem key={driver.user_id} value={driver.name} >{driver.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <CaretUpDownIcon onClick={handleDropdownToggle} />
      {isDropdownOpen && (
        <>
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ Width: 500 }}>
              <TableHead>
                <TableRow>
                  {type === 'Optimized' && <TableCell>Order</TableCell>}
                  <TableCell>Date Created</TableCell>
                  <TableCell>Delivery Number</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Delivery Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Package Dimensions</TableCell>
                  <TableCell>Special Handling Instructions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => {
                  const statusMap: {
                    [key in 'Delivered' | 'Failed' | 'Awaiting Assignment' | 'In_Progress' | 'On_Hold']: { label: string; color: "info" | "warning" | "success" | "error" | "default" | "primary" | "secondary" };
                  } = {
                    'Delivered': { label: 'Delivered', color: 'success' },
                    'Failed': { label: 'Failed', color: 'error' },
                    'Awaiting Assignment': { label: 'Awaiting Assignment', color: 'warning' },
                    'In_Progress': { label: 'In Progress', color: 'info' },
                    'On_Hold': { label: 'On Hold', color: 'primary' },
                  };
                  const { label, color } = statusMap[order.shipping_status] ?? { color: 'default', label: 'Unknown' };
                  return (
                    <TableRow hover key={order.shipping_id}>
                      {type === 'Optimized' && <TableCell>{orders.indexOf(order) + 1}</TableCell>}
                      <TableCell>{dayjs(order.createdAt).format('MMM D, YYYY')}</TableCell>
                      <TableCell>{order.shipping_id}</TableCell>
                      <TableCell>{order.sender_id}</TableCell>
                      <TableCell>{order.destination}</TableCell>
                      <TableCell>
                        <Chip color={color} label={label} size="small" />
                      </TableCell>
                      <TableCell>
                        {Object.entries(order.package_dimension).map(([key, value]) => (
                          <div key={key}>
                            {key}: {value}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>{order.special_handling_instruction}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
          <Divider />
        </>
      )}
    </Card>
  );
}
