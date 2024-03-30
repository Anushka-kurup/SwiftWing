'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { type Dayjs } from 'dayjs';

import type { Delivery, Driver } from '@/types/types';
import { getDeliveriesByDate, getDrivers } from '@/components/dashboard/status/api';
import CircularWithValueLabel from '@/components/dashboard/status/circular-progress-bar';
import { DeliveredDeliveries } from '@/components/dashboard/status/delivered-deliveries';
import { DeliveryInfoModal } from '@/components/dashboard/status/delivery-info-modal';
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

  const [awaitingAssignmentDeliveries, setAwaitingAssignmentDeliveries] = React.useState<number>(0);
  const [inProgressDeliveries, setInProgressDeliveries] = React.useState<number>(0);
  const [deliveredDeliveries, setDeliveredDeliveries] = React.useState<number>(0);
  const [failedDeliveries, setFailedDeliveries] = React.useState<number>(0);
  const [onHoldDeliveries, setOnHoldDeliveries] = React.useState<number>(0);
  const [deliveryModalInfo, setDeliveryModalInfo] = React.useState<Delivery | null>(null);
  const [deliveryInfoModalOpen, setDeliveryInfoModalOpen] = React.useState<boolean>(false);

  const paginatedDeliveries = applyPagination(deliveries, page, rowsPerPage);

  const fetchDrivers = async (): Promise<void> => {
    const data = await getDrivers();
    setDrivers(data as Driver[]);
  };

  const fetchDeliveriesByDate = async (unformattedDate: Dayjs | null): Promise<void> => {
    const formattedDate = unformattedDate?.format('YYYY-MM-DD') ?? '';
    const deliveryData: Delivery[] = await getDeliveriesByDate(formattedDate, formattedDate);
    setDeliveries(deliveryData);
    countDeliveriesByStatus(deliveryData);
  };

  function countDeliveriesByStatus(deliveryList: Delivery[]): void {
    let awaitingAssignment = 0;
    let inProgress = 0;
    let delivered = 0;
    let failed = 0;
    let onHold = 0;

    deliveryList.forEach((delivery) => {
      switch (delivery.shipping_status) {
        case 'Awaiting Assignment':
          awaitingAssignment += 1;
          break;
        case 'In_Progress':
          inProgress += 1;
          break;
        case 'Delivered':
          delivered += 1;
          break;
        case 'On_Hold':
          onHold += 1;
          break;
        case 'Failed':
          failed += 1;
          break;
        default:
          break;
      }
    });

    setAwaitingAssignmentDeliveries(awaitingAssignment);
    setInProgressDeliveries(inProgress);
    setDeliveredDeliveries(delivered);
    setFailedDeliveries(failed);
    setOnHoldDeliveries(onHold);
  }

  React.useEffect(() => {
    void fetchDrivers();
    void fetchDeliveriesByDate(date);
  }, [date]);

  return (
    <Stack spacing={3}>
      <DeliveryInfoModal
        deliveryModalInfo={deliveryModalInfo}
        deliveryInfoModalOpen={deliveryInfoModalOpen}
        onClickDeliveryInfoModal={() => DeliveryInfoModal}
        fetchDeliveriesByDate={fetchDeliveriesByDate}
        date={date as Dayjs}
      />
      <Stack
        direction="row"
        spacing={10}
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
                format="YYYY-MM-DD"
                onChange={(newValue) => {
                  setDate(newValue);
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Stack>
        <Stack direction="row" spacing={3}>
          <CircularWithValueLabel type="failed" value={failedDeliveries} total={deliveries.length} />
          <CircularWithValueLabel type="on hold" value={onHoldDeliveries} total={deliveries.length} />
          <CircularWithValueLabel
            type="awaiting assignment"
            value={awaitingAssignmentDeliveries}
            total={deliveries.length}
          />
          <CircularWithValueLabel type="in progress" value={inProgressDeliveries} total={deliveries.length} />
          <CircularWithValueLabel type="delivered" value={deliveredDeliveries} total={deliveries.length} />
        </Stack>
      </Stack>
      <Stack>
        <Typography marginLeft={3} marginBottom={1} fontWeight={570}>
          {date?.isSame(dayjs(), 'day') ? "Today's" : date?.format('YYYY-MM-DD')} Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid lg={3} sm={6} xs={12} maxHeight={160}>
            <Drivers sx={{ height: '100%' }} value={drivers?.length} />
          </Grid>
          <Grid lg={3} sm={6} xs={12} maxHeight={160}>
            <ParcelInProgress
              sx={{ height: '100%' }}
              deliveryNumber={inProgressDeliveries}
              totalDeliveryNumber={deliveries.length}
            />
          </Grid>
          <Grid lg={3} sm={6} xs={12} maxHeight={160}>
            <DeliveredDeliveries sx={{ height: '100%' }} value={deliveredDeliveries} />
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
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          onClickModal={() => DeliveryInfoModal} // Fix: Change the type of onClickModal prop
          setDeliveryModalInfo={setDeliveryModalInfo}
        />
      </Stack>
    </Stack>
  );
}

function applyPagination(rows: Delivery[], page: number, rowsPerPage: number): Delivery[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
