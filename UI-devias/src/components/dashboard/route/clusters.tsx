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
    deliveryUser: any;
    setDeliveryUser: any;
    sx?: any;
    setRoute: any;
    setDeliveries: any;
    setDirection: any;
    drivers: Array<any>;
    assignDrivers: any;
    setIsLoading : any;
}

export function Clusters(props: any): JSX.Element {
    //flatten nested list, converting [[{test:string}],[{test:string}]] to [{test:string},{test:string}]
    function flatten(deliveryMap: any) {
      return deliveryMap.reduce((acc: string | any[], val: any) => acc.concat(val), []);
    }

    // Cluster function
  const cluster = async () => {
    const flattened = flatten(props.deliveryMap);
    console.log(flattened);
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
    // Create payload
    const payload = {
      "coordinates": coords,
      //"round_trip": false,
      "coords_names": coords_id,
      //"pickups_deliveries": links,
      "num_drivers": parseInt(input.value)
    };

    console.log(payload);

    // Call API
    await fetch('http://backend:5000/optimize/cluster', {
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
      /*
      data = [
        [
            "a7796404-9da0-4feb-861e-70df3ec1511d",
            "23df9700-edc1-4b54-9848-dd27946f5f8e",
            "ff37d01a-6040-4bd1-a48d-bf5a8d6e5d5d",
            "c9e1b151-b5d2-4917-b80a-16aa8ef0184d",
            "e3eb754e-7a7b-4329-bf15-d0f3f15775e6",
            "45b72b87-0758-46fe-86de-0ebcc4e20645"
        ]
    ]
      */
      // Set each data cluster to route
      props.setRoute(data);
      // Set each data cluster to deliveryUser
      props.setDeliveryUser(data.map((cluster: any) => "00-unassigned"));
      console.log("set?")
      console.log(props.route);
      console.log(props.deliveryUser);


      //WHY DOES THE SET NOT WORK?

    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
    //Confirm cluster
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        props.setDirection("optimize");
      };

    console.log(props.deliveryMap);

    //Assign drivers to deliveries and routes
  /*
  deliveryUser = ['Adam', 'Jack', 'Unassigned']
  route = [
    ['1', '2'],
    ['3', '4'],
    ['5', '6']
  ]
  deliveryMap = [
    [
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
    [
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
    [
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
  ]
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
                {props.deliveryMap.map((cluster: any, index: number) => (
                    <Orders
                        key = {index}
                        indexer={index}
                        orders={cluster.map((order: any) => ({
                            ...order,
                            status: order.shipping_status as "Awaiting Assignment" | "Delivered" | "Failed" | "In_Progress" | "On_Hold",
                            driver: props.deliveryUser[index]
                        }))}
                        sx={{ marginBottom: '20px' }}
                        drivers={props.drivers}
                        assignDrivers={props.assignDrivers}
                        setRoute={props.setRoute}
                        route={props.route}
                        deliveryUser={props.deliveryUser}
                        setDeliveryUser={props.setDeliveryUser}
                    />
                ))}
            </Grid>
        </Grid>
    );
}

