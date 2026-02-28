import { taskApi } from "../lib/api";
import type { TaskCreate, TaskSearchParams, TaskUpdate } from "../types/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const TASKS_KEY = "tasks";

export function useTasks(params?: Record<string, TaskSearchParams>) {
  return useQuery({
    queryKey: [TASKS_KEY, params],
    queryFn: () => taskApi.getAll(params),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (task: TaskCreate) => taskApi.create(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: TaskUpdate) => taskApi.update(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}