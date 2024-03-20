"use client"; // This is a client component
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Orders } from '@/components/dashboard/route/orders';

export interface OptimizeProps {
    deliveries?: Array<any>;
    sx?: any;
    setDeliveries: any;
    setDirection: any;
    pickup_location:[string, string];
}

export function Optimize(props: OptimizeProps): JSX.Element {

    const optimize = async () => {
        const optimized_deliveries = Array();
        //for each delivery group
        for (let i = 0; i < props.deliveries.length; i++) {
            //Get the coords of the deliveries in that group
            const coords = props.deliveries[i].map((delivery: any) => [delivery.latitude, delivery.longitude]);
            const coords_id = props.deliveries[i].map((delivery: any) => delivery.order_id);
            //set links pickup location to delivery locations in the form [[1,2],[1,3],[1,4],[1,5],[6,7],[1,8]]
            const links = [];
            for (let i = 1; i < coords.length; i++) {
                links.push([0+1, i+1]);
            }

            //Create payload
            const payload = {
                "coordinates": coords,
                "coords_names": coords_id,
                "pickups_deliveries": [],
                "num_drivers": 1,
                "round_trip": false,
            };
            await fetch('http://127.0.0.1:5000/optimize/optimizeroute', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            },
            body: JSON.stringify(payload),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                //Set the deliveries to the optimized route
                //Set new orders
                for (let x = 0; x < data.length; x++) {
                    const clusterDel = Array();
                    const clust = data[x];
                    for (let j = 0; j < clust.length; j++) {
                        const id = clust[j];
                        const delivery_obj = props.deliveries[i].find((delivery: any) => delivery.order_id === id);
                        clusterDel.push(delivery_obj);
                    }
                    optimized_deliveries.push(clusterDel);
                }
                console.log(optimized_deliveries);
            });
        }
        props.setDeliveries(optimized_deliveries);
    };

    return (
        <Grid container spacing={3}>
            <Grid lg={12} style={{ position: 'sticky' }}>
                <label >Ready to optimize?</label>
                <Button
                    style={{ margin: "20px", color: "red" }}
                    onClick={optimize}
                    variant="outlined"
                >
                    Optimize Route
                </Button>
            </Grid>
            <Grid lg={12} md={12} xs={12}>
                {props.deliveries.map((nestedList, index) => (
                    <Orders
                        type='Optimized'
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


