import { taskApi } from "../lib/api";
import type { TaskCreate, TaskUpdate, Column, TaskSearchParams } from "../types/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const TASKS_KEY = "tasks";

interface UseTasksParams {
  search?: string;
  page?: number;
  limit?: number;
  column?: Column;
}

export function useTasks(params?: UseTasksParams) {
  const { search, page, limit, column } = params || {};

  const queryParams: TaskSearchParams = {};
  
  if (search) queryParams.q = search;
  if (page) queryParams._page = page;
  if (limit) queryParams._limit = limit;
  if (column) queryParams.column = column;

  return useQuery({
    queryKey: [TASKS_KEY, params],
    queryFn: () => taskApi.getAll(Object.keys(queryParams).length > 0 ? queryParams : undefined),
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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