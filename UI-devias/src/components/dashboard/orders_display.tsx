"use client"; // This is a client component
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Orders } from '@/components/dashboard/orders';
import { ObjectKeys } from 'react-hook-form/dist/types/path/common';

export interface ClustersProps {
    deliveries?: Array<any>;
    sx?: any;
    setDeliveries: any;
    setDirection: any;
    drivers: Array<any>;
    assignDrivers: any;
}

export function Clusters(props: any): JSX.Element {
    return (
        <Grid lg={12} md={12} xs={12}>
            {props.deliveries.map((nestedList: any, index: number) => (
                <Orders
                    key={index}
                    orders={nestedList.map((order: any) => ({ // Explicitly define the type of 'order' as any[]
                        ...order,
                        status: order.status as "Received" | "Delivered" | "Failed" | "In_Progress" | "On_Hold",
                    }))}
                    sx={{ marginBottom: '20px' }}
                    drivers={props.drivers}
                    assignDrivers={props.assignDrivers}
                />
            ))}
        </Grid>
    );
}

