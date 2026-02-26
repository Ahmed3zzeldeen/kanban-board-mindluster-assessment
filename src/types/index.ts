export type Column = "backlog" | "in_progress" | "review" | "done";

export interface Task {
  id: number;
  title: string;
  description: string;
  column: Column;
  priority?: "Low" | "Medium" | "High";
}

export type TaskCreate = Omit<Task, "id">;
export type TaskUpdate = Partial<TaskCreate> & { id: number };

export interface TaskSearchParams {
  title?: string;
  description?: string;
  column?: Column;
  priority?: "Low" | "Medium" | "High";
}