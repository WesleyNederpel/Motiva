export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  deadline?: string | null;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  deadline?: string | null;
  reward?: string | null;
  points_awarded?: boolean;
  completed_at?: string | null;
  subtasks?: Subtask[];
}
