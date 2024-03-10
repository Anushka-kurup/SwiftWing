import React, { useState, useEffect } from 'react';
import DeliveryStatusDropdown from './DeliveryStatusDropdown';


const mockParcels = [
    { id: 'P001', recipient: 'Alice Chen', address: '123 Main Street, Anytown', status: 'Unassigned' },
    { id: 'P002', recipient: 'Bob Johnson', address: '45 Oak Avenue, Somecity', status: 'Unassigned' },
    { id: 'P003', recipient: 'Sarah Lee', address: '789 Elm Street, Bigville', status: 'Assigned' }, // Include a variety of statuses
];


function ParcelsTable() {
    const [parcels, setParcels] = useState([]);

    // Fetch unassigned parcels from your data source (API)
    useEffect(() => {
        const fetchParcels = async () => {
            //const response = await fetch('/api/parcels/unassigned');  // Adjust your API endpoint
            //const data = await response.json();
            //setParcels(data);
            setParcels(mockParcels);
        }; 
        fetchParcels();
    }, []);

    const handleStatusChange = async (parcelId, newStatus) => {
        try {
            // Make a request to update the parcel status on your server (API)
            // const response = await fetch(`/api/parcels/${parcelId}/status`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ status: newStatus })
            // });

            if (true) {
                // Update the status of the parcel in the local state
                const updatedParcels = parcels.map(parcel => {
                    if (parcel.id === parcelId) {
                        return { ...parcel, status: newStatus };
                    }
                    return parcel;
                });
                setParcels(updatedParcels);
            } else {
                // Handle error response from the server
                console.error('Failed to update parcel status');
            }
        } catch (error) {
            // Handle any network or other errors
            console.error('Failed to update parcel status', error);
        }
    };

    console.log(parcels);

    return (
        <div className="container mx-auto p-4">  
            <table className="w-full min-w-max table-auto border-collapse border border-slate-400">
                <thead>
                    <tr className="bg-gray-100"> 
                        <th className="border border-slate-300 p-2">Parcel ID</th>
                        <th className="border border-slate-300 p-2">Recipient</th>
                        <th className="border border-slate-300 p-2">Address</th>
                        <th className="border border-slate-300 p-2">Status</th>
                        <th className="border border-slate-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {parcels.map((parcel) => (
                        <tr key={parcel.id} className="odd:bg-white even:bg-gray-50"> 
                            <td className="border border-slate-300 p-2">{parcel.id}</td>
                            <td className="border border-slate-300 p-2">{parcel.recipient}</td>
                            <td className="border border-slate-300 p-2">{parcel.address}</td>
                            <td className="border border-slate-300 p-2">{parcel.status}</td>
                            <td className="border border-slate-300 p-2">
                                <DeliveryStatusDropdown 
                                    onStatusChange={(newStatus) => handleStatusChange(parcel.id, newStatus)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ParcelsTable;
