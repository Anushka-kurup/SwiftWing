import React from 'react';

function DeliveryStatusDropdown({ currentStatus, onStatusChange }) {
    const statusOptions = ['Unassigned', 'Assigned', 'In Transit', 'Delivered'];
    return (
        <select value={currentStatus} onChange={(e) => onStatusChange(e.target.value)}>
            {statusOptions.map((status, index) => (
                <option key={index} value={status}>
                    {status}
                </option>
            ))}
        </select>
    );
}

export default DeliveryStatusDropdown;
