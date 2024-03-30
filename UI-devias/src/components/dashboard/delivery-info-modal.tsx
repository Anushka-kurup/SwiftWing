import * as React from 'react';
import { useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';

import { UserContext } from '@/contexts/user-context';

import { createOrderShipping, getLatLong } from './api';

export interface Order {
  sender_id: string;
  order_id: string;
  warehouse: string;
  destination: string;
  package_dimension: {
    S: string;
    L: string;
    M: string;
    Pallet: string;
  };
  package_weight: number;
  special_handling_instruction: string;
  latitude: number;
  longitude: number;
  recipient: { phone_no: string; recipeint_name: string };
  created_date: Date;
  delivery_date?: Date;
  delivery_timestamp?: Date | null;
}

export function DeliveryInfoModal({
  deliveryInfoModalOpen,
  onClickDeliveryInfo,
}: {
  deliveryInfoModalOpen: boolean;
  onClickDeliveryInfo: () => void;
}): React.JSX.Element {
  const [address, setAddress] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [recipientName, setRecipientName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [s, setS] = React.useState('');
  const [m, setM] = React.useState('');
  const [l, setL] = React.useState('');
  const [pallet, setPallet] = React.useState('');
  const [specialInstructions, setSpecialInstructions] = React.useState('');

  const userContext = useContext(UserContext);
  const { user } = userContext!;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const fullAddress = `${address} ${postalCode}`;
    const { latitude, longitude } = await getLatLong(postalCode);
    const packageWeight = Math.floor(Math.random() * 15) + 1;
    const order: Order = {
      sender_id: user?.id ?? '',
      order_id: '',
      warehouse: '313@Somerset, 313 Orchard Road, Singapore 238895',
      destination: fullAddress,
      package_dimension: {
        S: s,
        L: l,
        M: m,
        Pallet: pallet,
      },
      package_weight: packageWeight,
      special_handling_instruction: specialInstructions,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      recipient: {
        recipeint_name: recipientName,
        phone_no: phoneNumber,
      },
      created_date: new Date(),
      delivery_date: date ? date.toDate() : undefined,
      delivery_timestamp: null,
    };
    const result = await createOrderShipping(order);
    if (result) {
      setAddress('');
      setPostalCode('');
      setDate(dayjs());
      setRecipientName('');
      setPhoneNumber('');
      setS('');
      setM('');
      setL('');
      setPallet('');
      setS('');
      setSpecialInstructions('');
      onClickDeliveryInfo();
    }
  };

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
              value={address}
              onChange={(e) => { setAddress(e.target.value); }}
            />
          </Stack>

          <Stack direction="row">
            <TextField
              sx={{ m: 1 }}
              required
              fullWidth
              label="Postal Code"
              placeholder="Insert Postal Code Here"
              helperText="Postal Code"
              value={postalCode}
              onChange={(e) => {
                setPostalCode(e.target.value);
              }}
            />
            <DatePicker
              sx={{ m: 1 }}
              format="YYYY-MM-DD"
              defaultValue={date}
              slotProps={{
                textField: {
                  required: true,
                  helperText: 'Delivery Date',
                  fullWidth: true,
                },
              }}
              label="Date"
              onChange={(newDate) => {
                setDate(newDate);
              }}
            />
          </Stack>

          <Stack direction="row">
            <TextField
              sx={{ m: 1 }}
              required
              fullWidth
              label="Recipient Name"
              placeholder="Insert Recipient Name Here"
              helperText="Recipient Name"
              value={recipientName}
              onChange={(e) => {
                setRecipientName(e.target.value);
              }}
            />
            <TextField
              sx={{ m: 1 }}
              required
              fullWidth
              label="Phone Number"
              placeholder="Insert Phone Number Here"
              helperText="Customer's Phone Number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
          </Stack>

          <Divider variant="middle" sx={{ marginTop: 3, marginBottom: 3 }} />

          <Stack direction="row" justifyContent="space-between">
            <TextField
              sx={{ m: 1 }}
              label="S"
              type="number"
              placeholder="Insert Number"
              helperText="Item S"
              value={s}
              onChange={(e) => { setS(e.target.value); }}
            />
            <TextField
              sx={{ m: 1 }}
              label="M"
              type="number"
              placeholder="Insert Number"
              helperText="Items M"
              value={m}
              onChange={(e) => {
                setM(e.target.value);
              }}
            />
            <TextField
              sx={{ m: 1 }}
              label="L"
              type="number"
              placeholder="Insert Number"
              helperText="Items L"
              value={l}
              onChange={(e) => {
                setL(e.target.value);
              }}
            />
            <TextField
              sx={{ m: 1 }}
              label="Pallet"
              type="number"
              placeholder="Insert Number"
              helperText="Pallets"
              value={pallet}
              onChange={(e) => {
                setPallet(e.target.value);
              }}
            />
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
              value={specialInstructions}
              onChange={(e) => {
                setSpecialInstructions(e.target.value);
              }}
            />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={12} justifyContent="center" alignItems="center">
          <Button variant="contained" sx={{ width: 100 }} onClick={onClickDeliveryInfo}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" sx={{ width: 100 }} onClick={handleSubmit}>
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
