import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Box } from '@mui/material';
import Spinner from '../spinner/Spinner';

const ConfirmationDialog = ({ open, onClose, onConfirm, loading }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        {"Confirm Delete"}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <DialogContentText id="confirmation-dialog-description">
            Are you sure you want to delete the selected items? This action cannot be undone.
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={onConfirm} color="primary" autoFocus disabled={loading}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
