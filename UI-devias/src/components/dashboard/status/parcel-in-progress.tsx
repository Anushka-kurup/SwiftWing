import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export interface BudgetProps {
  diff?: number;
  trend: 'up' | 'down';
  sx?: SxProps;
  value: string;
}

export function ParcelInProgress({ sx, value }: BudgetProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4">{value}</Typography>
              <Typography color="text.secondary" variant="overline">
                Parcels in Progress
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
