import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid"
import SearchAppBar from "./components/SearchAppBar"
import TaskListContainer from "./components/TaskListContainer"
import TaskItem from "./components/TaskItem"
import { Typography, CircularProgress, Alert } from "@mui/material";
import { useCreateTask, useTasks, useUpdateTask, useDeleteTask } from "./hook/tasks";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";
import type { Column, Task } from "./types";
import AddTaskDialog from "./components/AddTaskDialog";
import { DndContext, type DragEndEvent, type DragOverEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useQueryClient } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 5;
const TASKS_KEY = "tasks";

function App() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagePerColumn, setPagePerColumn] = useState<Record<Column, number>>({
    backlog: 1,
    in_progress: 1,
    review: 1,
    done: 1,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addColumn, setAddColumn] = useState<Column>("backlog");

  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: createTask } = useCreateTask();

  const columns = [
    { title: "Backlog", key: "backlog", color: "#1976d2", bg: "#e7f1ff" },
    { title: "In Progress", key: "in_progress", color: "#ff9800", bg: "#fff3e0" },
    { title: "Review", key: "review", color: "#4c4eaf", bg: "#f3e8ff" },
    { title: "Done", key: "done", color: "#4caf50", bg: "#e8f5e9" },
  ] as const;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 600);
    return () => clearTimeout(timer);
  }, [search]);

  const tasksQuery = useTasks({ search: debouncedSearch });

  const getPaginatedTasks = (allTasks: Task[], columnKey: Column) => {
    const columnTasks = allTasks.filter(t => t.column === columnKey);
    const start = (pagePerColumn[columnKey] - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return {
      tasks: columnTasks.slice(start, end),
      totalPages: Math.ceil(columnTasks.length / ITEMS_PER_PAGE),
      total: columnTasks.length
    };
  };

  const handlePageChange = (columnKey: Column, newPage: number) => {
    setPagePerColumn(prev => ({ ...prev, [columnKey]: newPage }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const findColumn = (id: string): Column | undefined => {
    return columns.find(c => c.key === id)?.key;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasksQuery.data?.find(t => t.id.toString() === activeId);
    if (!activeTask) return;

    const overColumn = findColumn(overId);
    
    if (!overColumn) return;

    if (activeTask.column !== overColumn) {
      queryClient.setQueryData<Task[]>([TASKS_KEY], (old = []) =>
        old?.map(t =>
          t.id.toString() === activeId ? { ...t, column: overColumn } : t
        ) ?? []
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeTask = tasksQuery.data?.find(t => t.id.toString() === active.id);
    if (!activeTask) return;

    const targetColumn = findColumn(over.id as string);

    if (!targetColumn) return;

    if (activeTask.column === targetColumn) return;

    updateTask(
      { id: activeTask.id, column: targetColumn },
      {
        onError: () => {
          queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
        }
      }
    );
  };

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

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    createTask(newTask, {
      onSuccess: () => {
        setAddDialogOpen(false);
      }
    });
  };

  return (
    <>
      <SearchAppBar 
        search={search} 
        onSearchChange={setSearch} 
        totalTasks={tasksQuery.data?.length ?? 0}
        isLoading={tasksQuery.isFetching}
      />

      <DndContext sensors={sensors} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <Grid container spacing={2} sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          {columns.map(col => {
            const { tasks: paginatedTasks, totalPages, total } = getPaginatedTasks(tasksQuery.data ?? [], col.key);

            return (
              <TaskListContainer
                key={col.key}
                title={col.title}
                taskCount={total}
                pointColor={col.color}
                countColor={{ bgColor: col.bg, color: '#222' }}
                columnKey={col.key}
                currentPage={pagePerColumn[col.key]}
                totalPages={totalPages}
                onPageChange={(newPage) => handlePageChange(col.key, newPage)}
                isLoading={tasksQuery.isLoading}
                taskIds={paginatedTasks.map(t => t.id.toString())}
                onAddClick={(colKey: Column) => {
                  setAddColumn(colKey);
                  setAddDialogOpen(true);
                }}
              >
                {tasksQuery.isLoading ? (
                  <CircularProgress size={28} sx={{ m: 'auto', display: 'block' }} />
                ) : tasksQuery.isError ? (
                  <Alert severity="error">Failed to load tasks</Alert>
                ) : paginatedTasks.length === 0 ? (
                  <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                    No tasks
                  </Typography>
                ) : (
                  paginatedTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      id={task.id.toString()}
                      title={task.title}
                      description={task.description}
                      priority={task.priority}
                      column={task.column}
                      onDelete={() => handleDeleteClick(task.id)}
                      onSave={(updatedTask) => handleSaveClick(task.id, updatedTask)}
                    />
                  ))
                )}
              </TaskListContainer>
            );
          })}
        </Grid>
      </DndContext>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        loading={isDeleting}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
      <AddTaskDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleAddTask}
        columnKey={addColumn}
      />
    </>
  );
}

export default App;
