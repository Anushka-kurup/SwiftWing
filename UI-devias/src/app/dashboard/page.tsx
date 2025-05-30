'use client';

import * as React from 'react';
import { useContext } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { type Dayjs } from 'dayjs';

import { type Delivery } from '@/types/types';
import { UserContext } from '@/contexts/user-context';
import { getDeliveriesByDateAndSender } from '@/components/dashboard/api';
import { DeliveryInfoModal } from '@/components/dashboard/delivery-info-modal';
import { StatusBoard } from '@/components/dashboard/status-board';

export default function Page(): React.JSX.Element | null {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [date, setDate] = React.useState<Dayjs>(dayjs());
  const [deliveries, setDeliveries] = React.useState<Delivery[]>([]);

  const [deliveryInfoModalOpen, setDeliveryInfoModalOpen] = React.useState<boolean>(false);

  const paginatedDeliveries = applyPagination(deliveries, page, rowsPerPage);

  const userContext = useContext(UserContext);
  const { user } = userContext!;
  if (user?.role !== 'client') {
    return null;
  }

  const onClickCreateDelivery = (): void => {
    setDeliveryInfoModalOpen(!deliveryInfoModalOpen);
  };

  const IdString = user.id;

  const fetchDeliveriesAndOrderByDate = async (unformattedDate: Dayjs, userId: string): Promise<void> => {
    const formattedDate = unformattedDate?.format('YYYY-MM-DD');
    const deliveryData: Delivery[] = await getDeliveriesByDateAndSender(userId, formattedDate, formattedDate);
    setDeliveries(deliveryData);
  };

  React.useEffect(() => {
    void fetchDeliveriesAndOrderByDate(date, IdString);
  }, [date, IdString]);

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        spacing={14}
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <DeliveryInfoModal
          deliveryInfoModalOpen={deliveryInfoModalOpen}
          onClickDeliveryInfo={onClickCreateDelivery}
        />
        <Stack>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker
                label="Date Select"
                value={date}
                format="YYYY-MM-DD"
                onChange={(newValue) => {
                  setDate(newValue || dayjs());
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Stack>
      </Stack>
      <Stack>
        <Stack direction="row" spacing={1} justifyContent="flex-end" marginRight={4} alignItems="center">
          <Typography>Create Delivery Request</Typography>
          <Fab color="primary" aria-label="add" size="small" onClick={onClickCreateDelivery}>
            <AddIcon />
          </Fab>
        </Stack>
        <Stack>
          <Typography marginLeft={3} marginBottom={1} fontWeight={570}>
            Status Board
          </Typography>
          <StatusBoard
            count={deliveries.length}
            page={page}
            rows={paginatedDeliveries}
            rowsPerPage={rowsPerPage}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

function applyPagination(rows: Delivery[], page: number, rowsPerPage: number): Delivery[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
