'use client';

import * as React from 'react';
import { useContext } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { type Dayjs } from 'dayjs';

import type { Delivery } from '@/types/types';
import { UserContext, type UserContextValue } from '@/contexts/user-context';
import { DeliveryProofSubmissionModal } from '@/components/dashboard/drivers/delivery-proof-submission-modal';
import { getDeliveriesByDateAndDriver } from '@/components/dashboard/status/api';
import { StatusBoard } from '@/components/dashboard/status/status-board';

export default function Page(): React.JSX.Element {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [deliveries, setDeliveries] = React.useState<Delivery[]>([]);

  const [deliveryModalInfo, setDeliveryModalInfo] = React.useState<Delivery | null>(null);
  const [submissionModalOpen, setSubmissionInfoModalOpen] = React.useState<boolean>(false);

  const userContext = useContext(UserContext);
  const { user } = userContext as UserContextValue;

  const paginatedDeliveries = applyPagination(deliveries, page, rowsPerPage);

  const onClickDeliveryProofSubmissionModal = (): void => {
    setSubmissionInfoModalOpen(!submissionModalOpen);
  };

  const fetchDeliveriesByDate = async (unformattedDate: Dayjs | null): Promise<void> => {
    const formattedDate = unformattedDate?.format('YYYY-MM-DD') ?? '';
    const deliveryData: Delivery[] = await getDeliveriesByDateAndDriver(formattedDate, formattedDate, user?.id);
    setDeliveries(deliveryData);
  };

  React.useEffect(() => {
    void fetchDeliveriesByDate(date);
  }, [date, submissionModalOpen]);

  return (
    <Stack spacing={3}>
      <DeliveryProofSubmissionModal
        deliveryInfo={deliveryModalInfo}
        modalOpen={submissionModalOpen}
        onClickModal={onClickDeliveryProofSubmissionModal}
        fetchDeliveriesByDate={fetchDeliveriesByDate}
        date={date}
        driverId={user?.id ?? ''}
      />
      <Stack
        direction="row"
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
      </Stack>
      <Stack>
        <Typography marginLeft={3} marginBottom={1} fontWeight={570}>
          My Deliveries
        </Typography>
        <StatusBoard
          count={deliveries.length}
          page={page}
          rows={paginatedDeliveries}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          onClickModal={onClickDeliveryProofSubmissionModal}
          setDeliveryModalInfo={setDeliveryModalInfo}
        />
      </Stack>
    </Stack>
  );
}

function applyPagination(rows: Delivery[], page: number, rowsPerPage: number): Delivery[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
