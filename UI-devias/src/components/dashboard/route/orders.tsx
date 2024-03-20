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

const statusMap = {
  Received: { label: 'Received', color: 'info' },
  In_Progress: { label: 'In Progress', color: 'warning' },
  Delivered: { label: 'Delivered', color: 'success' },
  Failed: { label: 'Failed', color: 'error' },
  On_Hold: { label: 'On Hold', color: 'default' },
} as const;

export interface Order {
  order_id: string;
  pickup_location: string;
  destination: string;
  package_dimension: number[];
  package_weight: number;
  time_constraint: Date;
  special_handling_instruction: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  status: 'Received' | 'In_Progress' | 'Delivered' | 'Failed' | 'On_Hold';
  customer: string;
}

export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
  type?: string;
}

export function Orders({ orders = [], sx, type }: LatestOrdersProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="Group" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ Width: 500 }}>
          <TableHead>
            <TableRow>
              {type === 'Optimized' && <TableCell>Order</TableCell>}
              <TableCell>Date</TableCell>
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
              const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };
              return (
                <TableRow hover key={order.order_id}>
                  {type === 'Optimized' && <TableCell>{orders.indexOf(order) + 1}</TableCell>}
                  <TableCell>{dayjs(order.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
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
    </Card>
  );
}
