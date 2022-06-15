export type Task = {
  id: number;
  content: string;
};

export type TaskMap = {
  [key: string]: Task[];
};

export type Tasks = {
  columns: TaskMap;
  ordered: string[];
};
