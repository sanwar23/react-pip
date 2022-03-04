import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Notify({ message, isOpen = false, type = 'success' }) {
  const [open, setOpen] = useState(isOpen);

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  message =
    type == 'error'
      ? 'Something went wrong please try again'
      : `${message} Issues created sucessfully`;

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
