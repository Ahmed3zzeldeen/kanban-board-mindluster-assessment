import { Box, Button, Chip, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useState } from 'react';
import type { Task, Column } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskItemProps {
  id: string;
  title: string;
  description: string;
  priority?: "Low" | "Medium" | "High";
  column: Column;
  onDelete: () => void;
  onSave?: (updatedTask: Omit<Task, "id">) => void;
}


export default function TaskItem({ id, title, description, priority, column, onDelete, onSave }: TaskItemProps) {
  const [taskTitle, setTaskTitle] = useState(title || "Task Title Placeholder");
  const [taskDescription, setTaskDescription] = useState(description || "Task description placeholder. This is where the details of the task will be displayed.");
  const [taskPriority, setTaskPriority] = useState(priority || "High");
  const [taskStatus, setTaskStatus] = useState(column || "backlog");

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const priorityColor = taskPriority === 'High' ? 'error' : taskPriority === 'Medium' ? 'warning' : 'success';
  const priorityText = taskPriority || "High";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'item',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const handleEditClick = () => {
    setMode('edit');
  }

  const handleSaveClick = () => {
    setMode('view');
    if (onSave) {
      onSave({
        title: taskTitle,
        description: taskDescription,
        column: taskStatus,
        priority: taskPriority
      });
    }
  }

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete();
    }
  }

  return (
    <Box 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      sx={{ backgroundColor: '#fff', padding: '12px', borderRadius: '4px', marginBottom: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', cursor: 'grab' }}
    >
      {mode === 'view' ? (
        <>
          <Typography variant="body1" sx={{ color: '#555', fontWeight: 'bold' }}>
            {taskTitle}
          </Typography>

          <Typography variant="body2" sx={{ color: '#777' }}>
            {taskDescription}
          </Typography>
        </>

      ) : (
        <>
          <TextField fullWidth label="Task Title" variant="outlined" size="small" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} sx={{ marginBottom: '8px' }} />
          <TextField fullWidth label="Task Description" variant="outlined" size="small" multiline rows={3} value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} sx={{ marginBottom: '8px' }} />
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px'
          }}>
            <Select
              labelId="priority-select-label"
              variant='standard'
              id="priority-select"
              value={taskPriority}
              label="Priority"
              onChange={(e) => setTaskPriority(e.target.value as 'Low' | 'Medium' | 'High')}
              size="small"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={taskStatus}
              label="Status"
              onChange={(e) => setTaskStatus(e.target.value)}
              size="small"
            >
              <MenuItem value="backlog">Backlog</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="review">In Review</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </Box>
        </>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <Chip variant="outlined" label={priorityText} color={priorityColor} size="small" sx={{ marginTop: '8px', borderRadius: '8px', backgroundColor: priorityColor === 'error' ? '#ffebee' : priorityColor === 'warning' ? '#fff3e0' : '#e8f5e9' }} />
        <Box sx={{ display: 'flex', gap: '8px' }}>
          {
            mode === 'edit' ? (
              <>
                <Button variant="contained" size="small" color="primary" onClick={handleSaveClick}>
                  Save
                </Button>
                <IconButton size="small" sx={{ color: '#d32f2f' }} onClick={handleDeleteClick}>
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton size="small" sx={{ color: '#1976d2' }} onClick={handleEditClick}>
                  <EditNoteOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: '#d32f2f' }} onClick={handleDeleteClick}>
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </>
            )
          }
        </Box>
      </Box>
    </Box>
  )
}
