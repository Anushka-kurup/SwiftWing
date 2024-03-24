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
import dayjs from 'dayjs';

import { type Delivery } from '@/types/types';

export function DeliveryInfoModal({
  deliveryModalInfo,
  deliveryInfoModalOpen,
  onClickDeliveryInfo,
}: {
  deliveryModalInfo: Delivery | null;
  deliveryInfoModalOpen: boolean;
  onClickDeliveryInfo: React.MouseEventHandler;
}): React.JSX.Element {
  console.log(deliveryModalInfo);
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
              defaultValue={deliveryModalInfo?.destination}
              InputLabelProps={{ shrink: Boolean(deliveryModalInfo?.destination) }}
            />
          </Stack>

          <Stack direction="row">
            <Stack direction="row" sx={{ width: '70%' }}>
              <TextField
                sx={{ m: 1 }}
                required
                fullWidth
                label="Postal Code"
                placeholder="Insert Postal Code Here"
                helperText="Postal Code"
                defaultValue={populatePostal(deliveryModalInfo?.destination || '')}
                InputLabelProps={{ shrink: Boolean(deliveryModalInfo?.destination) }}
              />
              <DatePicker
                sx={{ m: 1 }}
                format="YYYY-MM-DD"
                defaultValue={dayjs(deliveryModalInfo?.delivery_date)}
                slotProps={{
                  textField: {
                    required: true,
                    helperText: 'Delivery Date',
                    fullWidth: true,
                  },
                }}
                label="Date"
              />
            </Stack>

            <Stack direction="row" sx={{ width: '30%' }}>
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
              defaultValue={deliveryModalInfo?.recipient.recipeint_name.S}
              InputLabelProps={{ shrink: Boolean(deliveryModalInfo?.recipient.recipeint_name.S) }}
            />
            <TextField
              sx={{ m: 1 }}
              required
              fullWidth
              label="Phone Number"
              placeholder="Insert Phone Number Here"
              helperText="Customer's Phone Number"
              defaultValue={deliveryModalInfo?.recipient.phone_no.S}
              InputLabelProps={{ shrink: Boolean(deliveryModalInfo?.recipient.phone_no.S) }}
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
              defaultValue={deliveryModalInfo?.special_handling_instruction}
              InputLabelProps={{ shrink: Boolean(deliveryModalInfo?.special_handling_instruction) }}
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

// Postal code helper function
export function populatePostal(address: string): string | null {
  return address.split(' ').pop() || null;
}
