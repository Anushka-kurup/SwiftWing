'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';

import { type Delivery } from '@/types/types';
import { useSelection } from '@/hooks/use-selection';

interface StatusBoardProps {
  count?: number;
  page?: number;
  rows?: Delivery[];
  rowsPerPage?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  setRowsPerPage?: React.Dispatch<React.SetStateAction<number>>;
  onClickModal?: React.MouseEventHandler;
  setDeliveryModalInfo?: React.Dispatch<React.SetStateAction<Delivery | null>>;
}

export function StatusBoard({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  setPage,
  setRowsPerPage,
  onClickModal,
  setDeliveryModalInfo,
}: StatusBoardProps): React.JSX.Element {
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    if (setPage) {
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowIds = React.useMemo(() => {
    return rows.map((delivery) => delivery.shipping_id);
  }, [rows]);

  // Selection table rows
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const onClickTableRow = (delivery: Delivery): void => {
    if (setDeliveryModalInfo) {
      setDeliveryModalInfo(delivery);
      onClickModal();
    }
  };

  const statusBackgroundColor = (status: string): string => {
    if (status.toLowerCase() === 'awaiting assignment') {
      return '#8590C8';
    } else if (status.toLowerCase() === 'in_progress') {
      return '#FEAE36';
    } else if (status.toLowerCase() === 'delivered') {
      return '#5DDB6A';
    } else if (status.toLowerCase() === 'failed') {
      return '#FF7F7F';
    } else if (status.toLowerCase() === 'on hold') {
      return '#EA4CE4';
    }
    return 'white';
  };

  const statusLabel = (status: string): string => {
    if (status.toLowerCase() === 'awaiting assignment') {
      return 'Awaiting Assignment';
    } else if (status.toLowerCase() === 'in_progress') {
      return 'In Progress';
    } else if (status.toLowerCase() === 'delivered') {
      return 'Delivered';
    } else if (status.toLowerCase() === 'failed') {
      return 'Failed';
    } else if (status.toLowerCase() === 'on_hold') {
      return 'On Hold';
    }
    return '';
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Delivery Number</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Delivery Address</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length !== 0 ? (
              rows.map((row) => {
                const isSelected = selected?.has(row.shipping_id);
                const deliveryDate = dayjs(row.delivery_date).format('YYYY-MM-DD');

                return (
                  <TableRow hover key={row.shipping_id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            selectOne(row.shipping_id);
                          } else {
                            deselectOne(row.shipping_id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        onClickTableRow(row);
                      }}
                    >
                      {deliveryDate}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        onClickTableRow(row);
                      }}
                    >
                      {row.shipping_id}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        onClickTableRow(row);
                      }}
                    >
                      {row.recipient.recipeint_name}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        onClickTableRow(row);
                      }}
                    >
                      {row.destination}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        onClickTableRow(row);
                      }}
                    >
                      <Chip
                        sx={{ bgcolor: statusBackgroundColor(row.shipping_status), color: 'white' }}
                        label={statusLabel(row.shipping_status)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center' }}>
                  No Deliveries
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={handleChangePage}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
