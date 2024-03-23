"use client"; // This is a client component
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Orders } from '@/components/dashboard/route/orders';
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
    //flatten nested list, converting [[{test:string}],[{test:string}]] to [{test:string},{test:string}]
    function flatten(arrayobj: string | any[]) {
        const return_list = Array();
        if (arrayobj.length == 1) {
            return arrayobj[0];
        }
        else{
            for (let i = 0; i < arrayobj.length; i++) {
                console.log("Nested list"+arrayobj[i]);
                for (let j = 0; j < arrayobj[i].length; j++) {
                    return_list.push(arrayobj[i][j]);
                }
            }
        }
        return return_list;
    }
    //Cluster function
    const cluster = async () => {
        const flattened = flatten(props.deliveries);
        const coords = flattened.map((delivery: any) => [delivery.latitude, delivery.longitude]);
        const coords_id = flattened.map((delivery: any) => delivery.shipping_id);
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
        "coords_names": coords_id,
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
            const new_data = [];
            for (let i = 0; i < data.length; i++) {
                const clusterDel = [];
                const clust = data[i];
                for (let j = 0; j < clust.length; j++) {
                    const id = clust[j];
                    const delivery_obj = flattened.find((delivery: any) => delivery.shipping_id === id);
                    clusterDel.push(delivery_obj);
                }
                new_data.push(clusterDel);
            }
            props.setDeliveries(new_data);
        })
    };

    //Confirm cluster
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        props.setDirection("optimize");
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
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleChange(event, "newValue")}
                    variant="outlined"
                >
                    Confirm Clusters
                </Button>
            </Grid>
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
        </Grid>
    );
}

