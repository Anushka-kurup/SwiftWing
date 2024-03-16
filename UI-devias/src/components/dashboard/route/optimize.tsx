"use client"; // This is a client component
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Orders } from '@/components/dashboard/route/orders';

export interface OptimizeProps {
    deliveries?: any[];
    sx?: any;
    optimize(): void;
}

export function Optimize(props: OptimizeProps): JSX.Element {
    const [orders, setOrders] = React.useState(props.deliveries ?? []);
    return (
        <Grid container spacing={3}>
            <Grid lg={12} style={{ position: 'sticky' }}>
                <label >Ready to optimize?</label>
                <Button
                    style={{ margin: "20px", color: "red" }}
                    onClick={props.optimize}
                    variant="outlined"
                >
                    Optimize Route
                </Button>
            </Grid>
            <Grid lg={12} md={12} xs={12}>
                {orders.map((nestedList, index) => (
                    <Orders
                        key={index}
                        orders={nestedList.map((order: any) => ({ // Explicitly define the type of 'order' as any[]
                            ...order,
                            status: order.status as "Received" | "Delivered" | "Failed" | "In_Progress" | "On_Hold",
                        }))}
                        sx={{ marginBottom: '20px' }}
                    />
                ))}
            </Grid>
        </Grid>
    );
}


