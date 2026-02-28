import { http } from "./http";
import type { Task, TaskCreate, TaskSearchParams, TaskUpdate } from "../types/index";

const TASKS = "/tasks";

export const taskApi = {
  getAll: (params?: TaskSearchParams) =>
    http.get<Task[]>(TASKS, { params }).then(r => r.data),

  getById: (id: number) =>
    http.get<Task>(`${TASKS}/${id}`).then(r => r.data),

  create: (task: TaskCreate) =>
    http.post<Task>(TASKS, task).then(r => r.data),

  update: ({ id, ...data }: TaskUpdate) =>
    http.patch<Task>(`${TASKS}/${id}`, data).then(r => r.data),

  delete: (id: number) =>
    http.delete(`${TASKS}/${id}`).then(r => r.data),
};