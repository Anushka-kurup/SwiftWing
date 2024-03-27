"use client"; // This is a client component
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Orders } from '@/components/dashboard/route/orders';
import { ObjectKeys } from 'react-hook-form/dist/types/path/common';

export interface ClustersProps {
    deliveryMap: any;
    route: any;
    sx?: any;
    setRoutes: any;
    setDeliveries: any;
    setDirection: any;
    drivers: Array<any>;
    assignDrivers: any;
    setIsLoading : any;
}

export function Clusters(props: any): JSX.Element {
    //flatten nested list, converting [[{test:string}],[{test:string}]] to [{test:string},{test:string}]
    function flatten(deliveryMap: any) {
        const return_list = Array();
        Object.keys(deliveryMap).forEach((key) => {
            return_list.push(...deliveryMap[key]);
        });
        return return_list;
    }

    //Cluster function
    const cluster = async () => {
        const flattened = flatten(props.deliveryMap);
        console.log(flattened)
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
                console.log(new_data);
                //assign to unassigned route
                props.setRoutes({ "unassigned": new_data });

            })
    };

    //Confirm cluster
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        props.setDirection("optimize");
      };

    console.log(props.deliveryMap);

    /*
  deliveryMap = {
    "alan":[
      {
        "shipping_id": "1",
        "delivery_address": "1234 Main St",
        "delivery_date": "2022-10-10",
        "delivery_time": "12:00:00",
        "driver_id": "1",
        "shipping_status": "In_Progress"
      },
      {
        "shipping_id": "2",
        "delivery_address": "1234 Main St",
        "delivery_date": "2022-10-10",
        "delivery_time": "12:00:00",
        "driver_id": "1",
        "shipping_status": "In_Progress"
      }
    ],
    jack: [
      {
        "shipping_id": "3",
        "delivery_address": "1234 Main St",
        "delivery_date": "2022-10-10",
        "delivery_time": "12:00:00",
        "driver_id": "2",
        "shipping_status": "In_Progress"
      },
      {
        "shipping_id": "4",
        "delivery_address": "1234 Main St",
        "delivery_date": "2022-10-10",
        "delivery_time": "12:00:00",
        "driver_id": "2",
        "shipping_status": "In_Progress"
      }
    ],
    unassigned:[
      {
        "shipping_id": "5",
        "delivery_address": "1234 Main St",
        "delivery_date": "2022-10-10",
        "delivery_time": "12:00:00",
        "driver_id": "3",
        "shipping_status": "In_Progress"
      },
      {
        "shipping_id": "6",
        "delivery_address": "1234 Main St",
        "delivery_date": "2022-10-10",
        "delivery_time": "12:00:00",
        "driver_id": "3",
        "shipping_status": "In_Progress"
      }
    ]
  }
  */

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
                {Object.keys(props.deliveryMap).map((key: string, index: number) => (
                    <Orders
                        key={index}
                        orders={props.deliveryMap[key].map((order: any) => ({
                            ...order,
                            status: order.shipping_status as "Awaiting Assignment" | "Delivered" | "Failed" | "In_Progress" | "On_Hold",
                            driver : key,
                        }))}
                        sx={{ marginBottom: '20px' }}
                        drivers={props.drivers}
                        assignDrivers={props.assignDrivers}
                        setRoute={props.setRoute}
                        route={props.route}
                        setIsLoading={props.setIsLoading}
                    />
                ))}
            </Grid>
        </Grid>
    );
}

