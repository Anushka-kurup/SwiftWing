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

const statusMap = {
  Received: { label: 'Received', color: 'info' },
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
  package_dimension: number[];
  package_weight: number;
  time_constraint: Date;
  special_handling_instruction: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  shipping_status: 'Awaiting Assignment' | 'In_Progress' | 'Delivered' | 'Failed' | 'On_Hold';
  customer: string;
}

export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
  type?: string;
  drivers: Array<any>;
  assignDrivers: any;
}

export function Orders({ orders = [], sx , type, drivers, assignDrivers}: LatestOrdersProps): React.JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(true);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [driver, setDriver] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setDriver(event.target.value);
    setIsButtonCompleted(false);
  };
  
  const [isButtonRunning, setIsButtonRunning] = React.useState(false);
  const [isButtonCompleted, setIsButtonCompleted] = React.useState(false);

  const handleAssignDriver = async () => {
    setIsButtonRunning(true);
    try {
      const selectedDriver = drivers.find((driver_info: any) => driver_info.name === driver);
      if (selectedDriver) {
        const driverKey = selectedDriver.user_id;
        await assignDrivers(orders[0].shipping_id, driverKey);
        setIsButtonCompleted(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsButtonRunning(false);
    }
  };

  return (
    <Card sx={{
      alignItems: 'center',
      border: '1px solid var(--mui-palette-neutral-700)',
      borderRadius: '12px',
      cursor: 'pointer',
      p: '4px 12px',
      margin: '20px',
    }}>
      <CaretUpDownIcon onClick={handleDropdownToggle} />
      {isDropdownOpen && (
        <>
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ Width: 500 }}>
          <TableHead>
            <TableRow>
              {type === 'Optimized' && <TableCell>Order</TableCell>}
              <TableCell>Date</TableCell>
              <TableCell>Delivery Number</TableCell>
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
              const { label, color } = statusMap[order.shipping_status] ?? { color: 'default', label: 'Unknown'};
              return (
                <TableRow hover key={order.shipping_id}>
                  {type === 'Optimized' && <TableCell>{orders.indexOf(order) + 1}</TableCell>}
                  <TableCell>{dayjs(order.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{order.shipping_id}</TableCell>
                  <TableCell>{order.destination}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                  <TableCell>{order.package_dimension}</TableCell>
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
