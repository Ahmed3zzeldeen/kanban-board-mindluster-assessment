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
  q?: string;
  _page?: number;
  _limit?: number;
  title?: string;
  description?: string;
  column?: Column;
  priority?: "Low" | "Medium" | "High";
}