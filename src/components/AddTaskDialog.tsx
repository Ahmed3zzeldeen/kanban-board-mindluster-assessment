import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { Task, Column } from '../types';

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => void;
  columnKey: Column;
}


export default function AddTaskDialog({
  open,
  onClose,
  onSave,
  columnKey,
}: AddTaskDialogProps) {
  const column = columnKey;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');

  const handleSave = () => {
    if (!title.trim()) return;
    console.log('Saving new task:', { title, description, priority, column }); // Debug log
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      column,
    });

    setTitle('');
    setDescription('');
    setPriority('Low');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('Low');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Task to {column.replace('_', ' ')} board</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Task Title"
          variant="outlined"
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 1, mb: 2 }}
        />

        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          size="small"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!title.trim()}
        >
          Add Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}