'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { type Dayjs } from 'dayjs';

import { type Delivery } from '@/types/types';
import { DeliveryInfoModal } from '@/components/dashboard/common/delivery-info-modal';
import { getDeliveriesByDate, getDrivers } from '@/components/dashboard/status/api';
import CircularWithValueLabel from '@/components/dashboard/status/circular-progress-bar';
import { CompletedDeliveries } from '@/components/dashboard/status/completed-deliveries';
import { Drivers } from '@/components/dashboard/status/drivers';
import { OnHoldDeliveries } from '@/components/dashboard/status/on-hold-deliveries';
import { ParcelInProgress } from '@/components/dashboard/status/parcel-in-progress';
import { StatusBoard } from '@/components/dashboard/status/status-board';

export default function Page(): React.JSX.Element {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [drivers, setDrivers] = React.useState<any[]>([]);
  const [deliveries, setDeliveries] = React.useState<Delivery[]>([]);

  const [receivedDeliveries, setReceivedDeliveries] = React.useState<number>(0);
  const [inProgressDeliveries, setInProgressDeliveries] = React.useState<number>(0);
  const [completedDeliveries, setCompletedDeliveries] = React.useState<number>(0);
  const [failedDeliveries, setFailedDeliveries] = React.useState<number>(0);
  const [onHoldDeliveries, setOnHoldDeliveries] = React.useState<number>(0);

  const paginatedDeliveries = applyPagination(deliveries, page, rowsPerPage);

  const onClickDeliveryInfo = (event: React.MouseEvent<HTMLElement>) => {
    console.log('Delivery Info Clicked');
  };

  const fetchDrivers = async (): unknown[] => {
    const data: any[] = await getDrivers();
    setDrivers(data['drivers']);
  };

  const fetchDeliveriesAndOrderByDate = async (unformattedDate: Dayjs): Promise<void> => {
    const formattedDate = unformattedDate?.format('YYYY-MM-DD');
    const deliveryData: Delivery[] = await getDeliveriesByDate(formattedDate, formattedDate);
    setDeliveries(deliveryData);
  };

  function countDeliveriesByStatus(deliveryList: Delivery[]): void {
    let received = 0;
    let inProgress = 0;
    let completed = 0;
    let failed = 0;
    let onHold = 0;

    deliveryList.forEach((delivery) => {
      switch (delivery.shipping_status) {
        case 'Received':
          received += 1;
          break;
        case 'In Progress':
          inProgress += 1;
          break;
        case 'Completed':
          completed += 1;
          break;
        case 'Failed':
          failed += 1;
          break;
        case 'Awaiting Assignment':
          onHold += 1;
          break;
        default:
          break;
      }
    });

    setReceivedDeliveries(received);
    setInProgressDeliveries(inProgress);
    setCompletedDeliveries(completed);
    setFailedDeliveries(failed);
    setOnHoldDeliveries(onHold);
  }

  React.useEffect(() => {
    void fetchDrivers();
    void fetchDeliveriesAndOrderByDate(date);
  }, [date, deliveries]);

  React.useEffect(() => {
    countDeliveriesByStatus(deliveries);
  }, [deliveries]);

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
        <Stack>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker
                label="Date Select"
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Stack>
        <Stack direction="row" spacing={3}>
          <CircularWithValueLabel type="Received" value={receivedDeliveries} total={deliveries.length} />
          <CircularWithValueLabel type="in progress" value={inProgressDeliveries} total={deliveries.length} />
          <CircularWithValueLabel type="completed" value={completedDeliveries} total={deliveries.length} />
          <CircularWithValueLabel type="failed" value={failedDeliveries} total={deliveries.length} />
          <CircularWithValueLabel type="on hold" value={onHoldDeliveries} total={deliveries.length} />
        </Stack>
      </Stack>
      <Stack>
        <Typography marginLeft={3} marginBottom={1} fontWeight={570}>
          Today's Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid lg={3} sm={6} xs={12} maxHeight={160}>
            <Drivers sx={{ height: '100%' }} value={drivers.length} />
          </Grid>
          <Grid lg={3} sm={6} xs={12} maxHeight={160}>
            <ParcelInProgress
              sx={{ height: '100%' }}
              deliveryNumber={inProgressDeliveries}
              totalDeliveryNumber={deliveries.length}
            />
          </Grid>
          <Grid lg={3} sm={6} xs={12} maxHeight={160}>
            <CompletedDeliveries sx={{ height: '100%' }} value={completedDeliveries} />
          </Grid>
          <Grid lg={3} sm={6} xs={12} maxHeight={160}>
            <OnHoldDeliveries sx={{ height: '100%' }} value={onHoldDeliveries} />
          </Grid>
        </Grid>
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
          onClickDeliveryInfo={onClickDeliveryInfo}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Stack>
    </Stack>
  );
}

function applyPagination(rows: Delivery[], page: number, rowsPerPage: number): Delivery[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
