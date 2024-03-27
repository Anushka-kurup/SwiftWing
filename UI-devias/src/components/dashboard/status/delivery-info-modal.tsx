import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { type Delivery } from '@/types/types';
import { editOrderDeliveryDate, editOrderInfo } from '@/components/dashboard/status/api';

export function DeliveryInfoModal({
  deliveryModalInfo,
  deliveryInfoModalOpen,
  onClickDeliveryInfo,
  fetchDeliveriesByDate,
  date,
}: {
  deliveryModalInfo: Delivery | null;
  deliveryInfoModalOpen: boolean;
  onClickDeliveryInfo: React.MouseEventHandler;
  fetchDeliveriesByDate: (date: Date) => void;
  date: Date;
}): React.JSX.Element {
  const [copiedDeliveryInfo, setCopiedDeliveryInfo] = React.useState<Delivery | null>();
  const [submitLoading, setSubmitLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setCopiedDeliveryInfo(deliveryModalInfo);
  }, [deliveryModalInfo]);

  const onChangeDeliveryInfo = (event: React.ChangeEvent<HTMLInputElement>, info: string): void => {
    setCopiedDeliveryInfo((prev) => {
      if (prev) {
        if (info === 'recipeint_name' || info === 'phone_no') {
          // recipient name and phone number
          return { ...prev, recipient: { ...prev.recipient, [info]: event.target.value } };
        } else if (info === 'S' || info === 'M' || info === 'L' || info === 'Pallet') {
          // package dimensions
          const value = event.target.value.toString() === '' ? '0' : event.target.value.toString();
          return { ...prev, package_dimension: { ...prev.package_dimension, [info]: value } };
        } else if (info === 'postal_code') {
          // attach postal code to the address
          const address = prev.destination?.split(' ');
          address?.pop();
          return { ...prev, destination: `${address?.join(' ')} ${event.target.value}` };
        }
        return { ...prev, [info]: event.target.value };
      }
      return prev;
    });
  };

  const onChangeDeliveryDate = (newDeliveryDate: Date | null): void => {
    setCopiedDeliveryInfo((prev) => {
      if (prev && dayjs(newDeliveryDate).isValid()) {
        return { ...prev, delivery_date: dayjs(newDeliveryDate).format('YYYY-MM-DDTHH:mm:ss') };
      }
      return prev;
    });
  };

  const submitDeliveryInfo = async (deliveryInfo: Delivery | null): Promise<void> => {
    if (deliveryInfo) {
      setSubmitLoading(true);
      void ((await editOrderInfo(deliveryInfo)) && editOrderDeliveryDate(deliveryInfo));
      fetchDeliveriesByDate(date);
      setSubmitLoading(false);
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
              label="Customer Address"
              placeholder="Insert Address Here"
              helperText="Customer Address"
              value={copiedDeliveryInfo?.destination}
              InputLabelProps={{
                shrink: Boolean(copiedDeliveryInfo?.destination && copiedDeliveryInfo.destination !== ''),
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChangeDeliveryInfo(event, 'destination');
              }}
            />
          </Stack>

          <Stack direction="row">
            <TextField
              sx={{ m: 1, width: '70%' }}
              required
              fullWidth
              label="Postal Code"
              placeholder="Insert Postal Code Here"
              helperText="Postal Code"
              value={populatePostal(copiedDeliveryInfo?.destination ?? '')}
              InputLabelProps={{
                shrink: Boolean(populatePostal(copiedDeliveryInfo?.destination ?? '') !== null),
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChangeDeliveryInfo(event, 'postal_code');
              }}
            />
            <DatePicker
              label="Date"
              sx={{ m: 1, width: '30%' }}
              format="YYYY-MM-DD"
              value={dayjs(copiedDeliveryInfo?.delivery_date)}
              slotProps={{
                textField: {
                  required: true,
                  helperText: 'Delivery Date',
                  fullWidth: true,
                },
              }}
              onChange={(newDate: Date | null) => {
                onChangeDeliveryDate(newDate);
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
              value={copiedDeliveryInfo?.recipient.recipeint_name}
              InputLabelProps={{
                shrink: Boolean(
                  copiedDeliveryInfo?.recipient.recipeint_name && copiedDeliveryInfo.recipient.recipeint_name !== ''
                ),
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChangeDeliveryInfo(event, 'recipeint_name');
              }}
            />
            <TextField
              sx={{ m: 1 }}
              required
              fullWidth
              label="Phone Number"
              placeholder="Insert Phone Number Here"
              helperText="Customer's Phone Number"
              value={copiedDeliveryInfo?.recipient.phone_no}
              InputLabelProps={{
                shrink: Boolean(copiedDeliveryInfo?.recipient.phone_no && copiedDeliveryInfo.recipient.phone_no !== ''),
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChangeDeliveryInfo(event, 'phone_no');
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
              value={parseInt(copiedDeliveryInfo?.package_dimension.S ?? '')}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChangeDeliveryInfo(event, 'S');
              }}
            />
            <TextField
              sx={{ m: 1 }}
              label="M"
              type="number"
              placeholder="Insert Number"
              helperText="Items M"
              value={parseInt(copiedDeliveryInfo?.package_dimension.M ?? '')}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChangeDeliveryInfo(event, 'M');
              }}
            />
            <TextField
              sx={{ m: 1 }}
              label="L"
              type="number"
              placeholder="Insert Number"
              helperText="Items L"
              value={parseInt(copiedDeliveryInfo?.package_dimension.L ?? '')}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChangeDeliveryInfo(event, 'L');
              }}
            />
            <TextField
              sx={{ m: 1 }}
              label="Pallet"
              type="number"
              placeholder="Insert Number"
              helperText="Pallets"
              value={parseInt(copiedDeliveryInfo?.package_dimension.Pallet ?? '')}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChangeDeliveryInfo(event, 'Pallet');
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
              value={copiedDeliveryInfo?.special_handling_instruction}
              InputLabelProps={{ shrink: Boolean(copiedDeliveryInfo?.special_handling_instruction) }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChangeDeliveryInfo(event, 'special_handling_instruction');
              }}
            />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={12} justifyContent="center" alignItems="center">
          <LoadingButton
            variant="contained"
            sx={{ width: 100 }}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              onClickDeliveryInfo(event);
            }}
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            variant="contained"
            type="submit"
            sx={{ width: 100 }}
            onClick={() => {
              submitDeliveryInfo(copiedDeliveryInfo);
            }}
            loading={submitLoading}
          >
            Save
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

// Postal code helper function
export function populatePostal(address: string | null): string | null {
  const postalCode = address?.split(' ').pop();
  return typeof postalCode === 'string' && !isNaN(parseInt(postalCode)) ? postalCode : null;
}
