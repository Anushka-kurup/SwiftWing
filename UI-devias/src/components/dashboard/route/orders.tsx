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
  id: string;
  customer: { name: string };
  amount: number;
  status: 'Received' | 'In_Progress' | 'Delivered'| 'Failed' | 'On_Hold' ;
  createdAt: Date;
  deliveryAddress: string;
}

export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
}

export function Orders({ orders = [], sx }: LatestOrdersProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="Group" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Delivery Number</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Delivery Address</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={order.id}>
                  <TableCell>{dayjs(order.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{order.deliveryAddress}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
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
