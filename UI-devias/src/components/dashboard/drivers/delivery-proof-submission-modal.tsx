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
import {
  completeDelivery,
  completeOrder,
  getProof,
  updateDeliveryTimeStamp,
  updateOrder,
  uploadProof,
} from '@/components/dashboard/status/api';

export function DeliveryProofSubmissionModal({
  deliveryInfo,
  modalOpen,
  onClickModal,
  fetchDeliveriesByDate,
  date,
  driverId,
}: {
  deliveryInfo: Delivery | null;
  modalOpen: boolean;
  onClickModal?: VoidFunction;
  fetchDeliveriesByDate: (unformattedDate: Dayjs) => Promise<void>;
  date: Dayjs | null;
  driverId: string;
}): React.JSX.Element {
  const [fileUploaded, setFileUploaded] = React.useState<boolean>(false);
  const [proof, setProof] = React.useState<File | null>(null);
  const [submitBtnLoading, setSubmitBtnLoading] = React.useState<boolean>(false);

  const handleFileUpload = (file: File): void => {
    if (file) {
      setProof(file);
      setFileUploaded(true);
    }
  };

  const onClickClose = (): void => {
    setFileUploaded(false);
    setProof(null);
    if (onClickModal) {
      onClickModal();
    }
  };

  const onClickSubmit = async (): Promise<void> => {
    setSubmitBtnLoading(true);
    if (fileUploaded && proof && deliveryInfo) {
      const uploadProofResult = await uploadProof(deliveryInfo, proof, driverId);

      if (uploadProofResult) {
        // Complete delivery status
        const completeOrderResult = await completeOrder(deliveryInfo);
        const completeDeliveryResult =
          completeOrderResult && (await completeDelivery(deliveryInfo, driverId, 'Delivered'));

        // Update delivery timestamp
        const nowTimeStamp = dayjs().format('YYYY-MM-DDTHH:mm:ss');
        const updateDeliveryTimeStampResult =
          completeDeliveryResult && (await updateDeliveryTimeStamp(deliveryInfo, nowTimeStamp));
        const updateOrderTimeStampResult =
          updateDeliveryTimeStampResult && (await updateOrder({ ...deliveryInfo, delivery_timestamp: nowTimeStamp }));

        void (updateOrderTimeStampResult && fetchDeliveriesByDate(date as Dayjs));
      }
    }
    setSubmitBtnLoading(false);

    // Close modal
    if (onClickModal) {
      onClickModal();
    }
  };

  const getOriginalProofLink = async (): Promise<string> => {
    if (deliveryInfo?.shipping_status === 'Delivered') {
      const proofImage = await getProof(deliveryInfo, driverId);
      if (typeof proofImage === 'string') {
        return proofImage;
      }
    }
    return '';
  };

  const onClickFailed = async (): Promise<void> => {
    if (deliveryInfo) {
      await completeDelivery(deliveryInfo, driverId, 'Failed');

      // Close modal
      if (onClickModal) {
        onClickModal();
      }
    }
  };

  return (
    <div>
      <Dialog open={modalOpen} maxWidth="md">
        <DialogTitle>Upload Proof of Delivery</DialogTitle>
        <DialogContent>
          <div style={{ padding: 50 }}>
            <DragDropFileUpload
              onFileUpload={handleFileUpload}
              file={proof}
              fileUploaded={fileUploaded}
              deliveryCurrentStatus={deliveryInfo?.shipping_status}
              getOriginalProofLink={getOriginalProofLink}
            />
          </div>
          <Stack direction="row" spacing={10} justifyContent="center" alignItems="center">
            <LoadingButton variant="contained" color="error" onClick={onClickClose} disabled={submitBtnLoading}>
              Cancel
            </LoadingButton>
            <LoadingButton variant="contained" color="error" onClick={onClickFailed}>
              Failed
            </LoadingButton>
            <LoadingButton variant="contained" color="primary" onClick={onClickSubmit} loading={submitBtnLoading}>
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
  file,
  deliveryCurrentStatus,
  getOriginalProofLink,
}: {
  onFileUpload: (file: File) => void;
  fileUploaded: boolean;
  file: File | null;
  deliveryCurrentStatus: Delivery['shipping_status'] | undefined;
  getOriginalProofLink: () => Promise<unknown>;
}): React.JSX.Element {
  const [dragOver, setDragOver] = React.useState<boolean>(false);
  const [proofLink, setProofLink] = React.useState<string>('');

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

  const getProofLink = React.useCallback(async () => {
    const link = await getOriginalProofLink() as Record<string, string>;
    setProofLink(link['URL']);
  }, [getOriginalProofLink]);

  React.useEffect(() => {
    void getProofLink();
  }, [getProofLink]);

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
        display: 'block',
        width: '620px',
      }}
    >
      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleChange} id="file-upload" />
      <label htmlFor="file-upload">
        <Box display="flex" flexDirection="column" alignItems="center" padding={20}>
          <IconButton color="primary" aria-label="upload picture" component="span">
            {fileUploaded ? <CloudDoneIcon /> : <CloudUploadIcon />}
          </IconButton>
          <Typography variant="body1">
            {deliveryCurrentStatus?.toLowerCase() === 'delivered' && !fileUploaded && proofLink !== '' ? (
              <div>
                <a href={proofLink} target="_blank" rel="noreferrer">
                  Click to view the original proof of delivery.
                  <br />
                </a>
                Or upload a new one.
              </div>
            ) : fileUploaded && file ? (
              file['name']
            ) : (
              'Drag and drop a file here or click to upload'
            )}
          </Typography>
        </Box>
      </label>
    </Paper>
  );
}
