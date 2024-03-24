import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField';

export function DeliveryInfoModal({
  deliveryInfoModalOpen,
  onClickDeliveryInfo,
}: {
  deliveryInfoModalOpen: boolean;
  onClickDeliveryInfo: React.MouseEventHandler;
}): React.JSX.Element {
  return (
    <Dialog open={deliveryInfoModalOpen} maxWidth="md">
      <DialogTitle>Delivery Info Modal</DialogTitle>
      <DialogContent>
        <Stack direction="column">
          <Stack direction="row">
            <TextField
              sx={{ m: 1 }}
              required
              fullWidth
              label="Address"
              placeholder="Insert Address Here"
              helperText="Customer Address"
            />
          </Stack>

          <Stack direction="row">
            <Stack direction="row" sx={{ width: '90%' }}>
              <TextField
                sx={{ m: 1 }}
                required
                fullWidth
                label="Postal Code"
                placeholder="Insert Postal Code Here"
                helperText="Postal Code"
              />
              <DatePicker
                sx={{ m: 1 }}
                format="YYYY-MM-DD"
                slotProps={{
                  textField: {
                    required: true,
                    helperText: 'Customer Address',
                    fullWidth: true,
                  },
                }}
                label="Date"
              />
            </Stack>

            <Stack direction="row">
              <TimeField
                label="From"
                sx={{ m: 1 }}
                slotProps={{
                  textField: {
                    helperText: 'Start Time',
                  },
                }}
              />
              <TimeField
                label="To"
                sx={{ m: 1 }}
                slotProps={{
                  textField: {
                    helperText: 'End Time',
                  },
                }}
              />
            </Stack>
          </Stack>

          <Stack direction="row">
            <TextField
              sx={{ m: 1 }}
              required
              fullWidth
              label="Recipient Name"
              placeholder="Insert Recipient Name Here"
              helperText="Recipient Name"
            />
            <TextField
              sx={{ m: 1 }}
              required
              fullWidth
              label="Phone Number"
              placeholder="Insert Phone Number Here"
              helperText="Customer's Phone Number"
            />
          </Stack>

          <Divider variant="middle" sx={{ marginTop: 3, marginBottom: 3 }} />

          <Stack direction="row" justifyContent="space-between">
            <TextField sx={{ m: 1 }} label="S" type="number" placeholder="Insert Number" helperText="Item S" />
            <TextField sx={{ m: 1 }} label="M" type="number" placeholder="Insert Number" helperText="Items M" />
            <TextField sx={{ m: 1 }} label="L" type="number" placeholder="Insert Number" helperText="Items L" />
            <TextField sx={{ m: 1 }} label="Pallet" type="number" placeholder="Insert Number" helperText="Pallets" />
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <TextField
              sx={{ m: 1 }}
              fullWidth
              multiline
              rows={5}
              label="Special Instructions"
              placeholder="Insert Any Special Instructions from the Customer"
              helperText="Customer Instructions"
            />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={12} justifyContent="center" alignItems="center">
          <Button variant="contained" sx={{ width: 100 }} onClick={onClickDeliveryInfo}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" sx={{ width: 100 }}>
            Save
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
