import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export interface TasksProgressProps {
  sx?: SxProps;
  value: number;
}

export function DeliveredDeliveries({ value, sx }: TasksProgressProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4">{value}</Typography>
              <Typography color="text.secondary" gutterBottom variant="overline">
                Delivered
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
