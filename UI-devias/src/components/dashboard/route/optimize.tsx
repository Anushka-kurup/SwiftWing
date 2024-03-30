"use client"; // This is a client component
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Orders } from '@/components/dashboard/route/orders';

export interface OptimizeProps {
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
}

export function Optimize(props: OptimizeProps): JSX.Element {
    const optimizer = async () => {
        //for each delivery group
        for (let i = 0; i < props.deliveryMap.length; i++) {
            //Get the coords of the deliveries in that group
            const coords = props.deliveryMap[i].map((delivery: any) => [delivery.latitude, delivery.longitude]);
            const coords_id = props.deliveryMap[i].map((delivery: any) => delivery.shipping_id);
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
                // Replace cluster of route at each index
                props.setRoute((prevRoute: any) => {
                    const newRoute = [...prevRoute]; // Create a copy of the state
                    console.log("before: ", newRoute)
                    newRoute[i] = data[0]
                    console.log("after: ", newRoute)
                    return newRoute; // Set the state with the modified copy
                });              
            });
        }

    };

    const pushOptimized = async () => {
        const deliveryDate = props.deliveryMap[0][0].delivery_date;    

        //Delivery Map
        const outputMap: { [key: string]: any } = {}; // Define the type of outputMap
        for (let i = 0; i < props.deliveryUser.length; i++) {
            if(props.deliveryUser[i] == "00-unassigned"){
                if ("00-unassigned" in outputMap) {
                    outputMap["00-unassigned"] = [...outputMap["00-unassigned"], ...props.route[i]]
                }
                else{
                    outputMap["00-unassigned"] = props.route[i];
                }
            }
            else{
                outputMap[props.deliveryUser[i]] = props.route[i];
            }
        }
        console.log(outputMap);
        //Create payload
        const payload = {
            "delivery_date": deliveryDate.slice(0, 10),
            "delivery_map": outputMap,
        };
        console.log(payload);
        await fetch('http://127.0.0.1:5000/delivery/update_delivery/', { 
        method: 'PUT',
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
        });

        //Update delivery status
        for (let i = 0; i < props.deliveryUser.length; i++) {
            if(props.deliveryUser[i] != "00-unassigned"){
                const driver = props.deliveryUser[i];
                const delivery_ids = props.route[i];
                //Update delivery status and driver 
                for (let j = 0; j < delivery_ids.length; j++) {
                    const payload = {
                        "shipping_id": delivery_ids[j],
                        "shipping_status": "In_Progress",
                        "driver_id": driver,
                    };
                    console.log(payload);
                    await fetch('http://127.0.0.1:5000/shipping/update_shipping_status_and_driver/',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                        },
                        body: JSON.stringify(payload),
                    })
                    }
                }
            }
    };
    return (
        <Grid container spacing={3}>
            <Grid lg={12} style={{ position: 'sticky' }}>
                <label >Ready to optimize?</label>
                <Button
                    style={{ margin: "20px", color: "red" }}
                    onClick={optimizer}
                    variant="outlined"
                >
                    Optimize Route
                </Button>
                <Button
                    style={{ margin: "20px", color: "white" }}
                    onClick={pushOptimized}
                    variant='contained'
                    color="success"
                >
                    Confirm Routes
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


