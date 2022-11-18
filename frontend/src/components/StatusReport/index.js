import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function StatusReport({ errorEmails, done, onClose }) {
  if (!done) {
    return null;
  }

  var handleClose = () => onClose();

  var content =
    errorEmails && errorEmails.length ? (
      <div>Error sending emails to: {errorEmails.join(", ")}</div>
    ) : (
      <div>Emails sent successfuly!</div>
    );

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            {content}
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
}

export default StatusReport;
