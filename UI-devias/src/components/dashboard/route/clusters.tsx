"use client"; // This is a client component
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Orders } from '@/components/dashboard/route/orders';

export interface ClustersProps {
    deliveries?: any[];
    sx?: any;
}

export function Clusters(props: ClustersProps): JSX.Element {
    const [orders, setOrders] = React.useState(props.deliveries ?? []);

    const handleInputChange = () => {
        // Create length number of orders based on input 
        const input = document.getElementById('clusters') as HTMLInputElement;
        const value = input.value;
        const newOrders = [];
        for (let i = 0; i < parseInt(value); i++) {
            newOrders.push([
                {
                    id: `ORD-${i + 1}`,
                    customer: { name: 'New Customer' },
                    amount: 0,
                    status: 'New',
                    createdAt: new Date(),
                    deliveryAddress: '',
                },
            ]);
        }
        setOrders(newOrders);
    };
    //Cluster function
    const cluster = async () => {
        const coords = orders[0].map((delivery: any) => [delivery.latitude, delivery.longitude]);
        const coords_names = orders[0].map((delivery: any) => delivery.destination);
        //Add pickup to both lists
        coords.unshift([1.3245706, 103.8773117]);
        coords_names.unshift("313@Somerset, 313 Orchard Road, Singapore 238895");
        //set links pickup location to delivery locations in the form [[1,2],[1,3],[1,4],[1,5],[6,7],[1,8]]
        const links = [];
        for (let i = 0; i < coords.length; i++) {
        for (let j = 0; j < coords.length; j++) {
            if (i !== j) {
            links.push([i, j]);
            }
        }
        }
        const input = document.getElementById('clusters') as HTMLInputElement;
        //Create payload
        const payload = {
        "coordinates": coords,
        //"round_trip": false,
        "coords_names": coords_names,
        //"pickups_deliveries": links,
        "num_drivers": parseInt(input.value)
        };
        console.log(payload);


        //Call API
        await fetch('http://127.0.0.1:5000/optimize/cluster', { 
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
            //Set new orders
            //setOrders(data);
        })
    };

    return (
        <Grid container spacing={3}>
            <Grid lg={12} style={{ position: 'sticky' }}>
                <label htmlFor="numberOfOrders">Clusters:</label>
                <input type="number" id="clusters" defaultValue={1} />
                <Button
                    style={{ margin: "20px" }}
                    startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
                    onClick={cluster}
                    variant="contained"
                >
                    Create Clusters
                </Button>
                <Button
                    style={{ margin: "20px", color: "red" }}
                    onClick={handleInputChange}
                    variant="outlined"
                >
                    Confirm Clusters
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


