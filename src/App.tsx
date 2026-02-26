import { useState } from "react";
import Grid from "@mui/material/Grid"
import SearchAppBar from "./components/SearchAppBar"
import TaskListContainer from "./components/TaskListContainer"
import TaskItem from "./components/TaskItem"
import { Typography, CircularProgress, Alert } from "@mui/material";
import { useTasks, useUpdateTask, useDeleteTask } from "./hook/tasks";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";
import type { Task } from "./types";

function App() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { mutate: updateTask } = useUpdateTask();

  const columns = [
    { title: "Backlog", key: "backlog", color: "#1976d2", bg: "#e7f1ff" },
    { title: "In Progress", key: "in_progress", color: "#ff9800", bg: "#fff3e0" },
    { title: "Review", key: "review", color: "#4c4eaf", bg: "#f3e8ff" },
    { title: "Done", key: "done", color: "#4caf50", bg: "#e8f5e9" },
  ] as const;

  const tasksQuery = useTasks();

  const handleDeleteClick = (id: number) => {
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleSaveClick = (id: number, updatedTask: Omit<Task, "id">) => {
    updateTask(
      {
        id,
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        column: updatedTask.column,
      },
      {
        onSuccess: () => {
          console.log("Task updated successfully");
        },
        onError: () => {
          console.error("Failed to update task");
        }
      }
    );
  };

  const confirmDelete = () => {
    if (!taskToDelete) return;
    deleteTask(taskToDelete, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setTaskToDelete(null);
      }
    });
  };

  return (
    <>
      <SearchAppBar />

      <Grid container spacing={2} sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
        {columns.map(col => {
          const columnTasks = tasksQuery.data?.filter(t => t.column === col.key) ?? [];

          return (
            <TaskListContainer
              key={col.key}
              title={col.title}
              taskCount={columnTasks.length}
              pointColor={col.color}
              countColor={{ bgColor: col.bg, color: '#222' }}
            >
              {tasksQuery.isLoading ? (
                <CircularProgress size={28} sx={{ m: 'auto', display: 'block' }} />
              ) : tasksQuery.isError ? (
                <Alert severity="error">Failed to load tasks</Alert>
              ) : columnTasks.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  No tasks
                </Typography>
              ) : (
                columnTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    {...task}
                    onDelete={() => handleDeleteClick(task.id)}
                    onSave={(updatedTask) => handleSaveClick(task.id, updatedTask)}
                  />
                ))
              )}
            </TaskListContainer>
          );
        })}
      </Grid>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        loading={isDeleting}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}

export default App;