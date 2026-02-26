import { useState } from "react";
import Grid from "@mui/material/Grid"
import SearchAppBar from "./components/SearchAppBar"
import TaskListContiner from "./components/TaskListContiner"
import TaskItem from "./components/TaskItem"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

function App() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      console.log(`Task with ID ${taskToDelete} deleted.`);
      setTaskToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <SearchAppBar />
      <Grid container spacing={2} sx={{ backgroundColor: '#f5f5f5', padding: '16px' }}>
        <TaskListContiner 
          title="Backlog"
          taskCount={5}
          pointColor="#1976d2"
          countColor={{ bgColor: '#e7e7e7', color: '#222' }}
        >
          <TaskItem onDelete={() => handleDeleteTask("task1")} />
          <TaskItem onDelete={() => handleDeleteTask("task2")} />
          <TaskItem onDelete={() => handleDeleteTask("task3")} />
        </TaskListContiner>
        <TaskListContiner 
          title="In Progress"
          taskCount={3}
          pointColor="#ff9800"
          countColor={{ bgColor: '#fff3e0', color: '#222' }}
        >
          <TaskItem />
          <TaskItem />
        </TaskListContiner> 
        <TaskListContiner 
          title="In Review"
          taskCount={2}
          pointColor="#4c4eaf"
          countColor={{ bgColor: '#e8f5e9', color: '#222' }}
        >
          <TaskItem />
        </TaskListContiner>
        <TaskListContiner 
          title="Done"
          taskCount={8}
          pointColor="#4caf50"
          countColor={{ bgColor: '#e8f5e9', color: '#222' }}
        >
          <TaskItem />
          <TaskItem />
          <TaskItem />
        </TaskListContiner>
      </Grid>
      <DeleteConfirmationDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={confirmDeleteTask } />
    </>
  )
}

const DeleteConfirmationDialog = ({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this task?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export default App
