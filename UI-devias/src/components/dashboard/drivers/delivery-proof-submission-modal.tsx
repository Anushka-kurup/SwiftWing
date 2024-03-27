import * as React from 'react';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LoadingButton from '@mui/lab/LoadingButton';
import { Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs, { type Dayjs } from 'dayjs';

import type { Delivery } from '@/types/types';
import { completeDelivery, updateDeliveryDate, uploadProof } from '@/components/dashboard/status/api';

export function DeliveryProofSubmissionModal({
  deliveryInfo,
  modalOpen,
  onClickModal,
  fetchDeliveriesByDate,
  date,
}: {
  deliveryInfo: Delivery | null;
  modalOpen: boolean;
  onClickModal?: React.MouseEventHandler;
  fetchDeliveriesByDate: (unformattedDate: Dayjs) => Promise<void>;
  date: Dayjs;
}): React.JSX.Element {
  const [fileUploaded, setFileUploaded] = React.useState<boolean>(false);
  const [proof, setProof] = React.useState<File | null>(null);

  const handleFileUpload = (file: File): void => {
    if (file) {
      setProof(file);
      setFileUploaded(true);
    }
  };

  const onClickSubmit = async (): Promise<void> => {
    if (proof && deliveryInfo) {
      const uploadProofResult = await uploadProof(deliveryInfo, proof);
      if (uploadProofResult) {
        const completeDeliveryResult = await completeDelivery(deliveryInfo);
        const updateDeliveryDateResult = await updateDeliveryDate(deliveryInfo, dayjs().format('YYYY-MM-DDTHH:mm:ss'));
        void (completeDeliveryResult && updateDeliveryDateResult && fetchDeliveriesByDate(date));
      }
    }
  };

  return (
    <div>
      <Dialog open={modalOpen} maxWidth="md">
        <DialogTitle>Upload Proof of Delivery</DialogTitle>
        <DialogContent>
          <div style={{ padding: 50 }}>
            <DragDropFileUpload onFileUpload={handleFileUpload} fileUploaded={fileUploaded} />
          </div>
          <Stack direction="row" spacing={8} justifyContent="center" alignItems="center">
            <LoadingButton variant="contained" color="primary" onClick={onClickModal}>
              Cancel
            </LoadingButton>
            <LoadingButton variant="contained" color="error" onClick={onClickModal}>
              Failed
            </LoadingButton>
            <LoadingButton variant="contained" color="primary" onClick={onClickSubmit}>
              Submit
            </LoadingButton>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DragDropFileUpload({
  onFileUpload,
  fileUploaded,
}: {
  onFileUpload: (file: File) => void;
  fileUploaded: boolean;
}): React.JSX.Element {
  const [dragOver, setDragOver] = React.useState<boolean>(false);

  const handleDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragOver(false);
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        onFileUpload(event.dataTransfer.files[0]);
      }
    },
    [onFileUpload]
  );

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        onFileUpload(event.target.files[0]);
      }
    },
    [onFileUpload]
  );

  return (
    <Paper
      variant="outlined"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: dragOver ? '2px dashed #000' : '2px dashed #aaa',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragOver ? '#eee' : '#fafafa',
      }}
    >
      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleChange} id="file-upload" />
      <label htmlFor="file-upload">
        <Box display="flex" flexDirection="column" alignItems="center" padding={20}>
          <IconButton color="primary" aria-label="upload picture" component="span">
            {fileUploaded ? <CloudDoneIcon /> : <CloudUploadIcon />}
          </IconButton>
          <Typography variant="body1">Drag and drop a file here or click to upload</Typography>
        </Box>
      </label>
    </Paper>
  );
}
