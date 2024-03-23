import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function CircularWithValueLabel(
  props: CircularProgressProps & { type: string; value: number; total: number }
) {
  const percentageProgress = props.total !== 0 ? Math.floor((props.value / props.total) * 100) : 0;
  const barThickness = 5;
  const barSize = 110;
  const textColour = '#383D54';
  const textWeight = 'bold';
  let mainColour = 'blue';
  let backgroundColour = 'lightgrey';

  if (props.type.toLowerCase() === 'received') {
    mainColour = '#8590C8';
    backgroundColour = '#C2CAF2';
  } else if (props.type.toLowerCase() === 'in progress') {
    mainColour = '#FEAE36';
    backgroundColour = '#FFCE86';
  } else if (props.type.toLowerCase() === 'completed') {
    mainColour = '#5DDB6A';
    backgroundColour = '#CEFFD3';
  } else if (props.type.toLowerCase() === 'failed') {
    mainColour = '#FF7F7F';
    backgroundColour = '#F2C2D9';
  } else if (props.type.toLowerCase() === 'on hold') {
    mainColour = '#EA4CE4';
    backgroundColour = '#FF97FB';
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content', alignItems: 'center' }}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          variant="determinate"
          sx={{
            color: mainColour,
            borderRadius: '50%',
            boxShadow: `inset 0px 0px 0px ${(barThickness / 44) * barSize}px ${backgroundColour}`,
          }}
          size={barSize}
          thickness={barThickness}
          value={percentageProgress}
        />
        <Box sx={{ alignItems: 'center', margin: 0, position: 'absolute' }}>
          <Typography sx={{ color: textColour, fontWeight: textWeight }}>{props.value}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: mainColour,
          marginTop: '4px',
          borderRadius: '11px',
          width: 'fit-content',
          minWidth: '80px',
          maxWidth: '120px',
          padding: '0px 4px',
        }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            color: 'white',
            fontSize: '12px',
            padding: '4px',
          }}
        >
          {props.type.toUpperCase()}
        </Typography>
      </Box>
    </Box>
  );
}
