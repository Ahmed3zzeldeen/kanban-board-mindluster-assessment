import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from "@mui/material";

const DeleteConfirmationDialog = ({
  open,
  loading,
  onClose,
  onConfirm,
}: {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Delete Task?</DialogTitle>
    <DialogContent>
      <Typography>This action cannot be undone.</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={loading}>Cancel</Button>
      <Button
        onClick={onConfirm}
        color="error"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : undefined}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmationDialog;