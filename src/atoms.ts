import { Tasks } from './types/index';
import { atom, selector } from 'recoil';

const defaultTasks = JSON.parse(window.localStorage.getItem('board') || '{}');

export const tasksState = atom<Tasks>({
  key: 'tasksState',
  default: defaultTasks.columns
    ? defaultTasks
    : {
        columns: {
          'To Do': [
            {
              id: 1,
              content: '🙆‍♀️ Stretching',
            },
            {
              id: 2,
              content: '🏃‍♀️ Running',
            },
          ],
          Doing: [
            {
              id: 3,
              content: '👩‍💻 Coding',
            },
          ],
          Done: [],
        },
        ordered: ['To Do', 'Doing', 'Done'],
      },
});

export const columnsState = selector<string[]>({
  key: 'columnsState',
  get: ({ get }) => {
    const tasks = get(tasksState);
    return tasks.ordered;
  },
});
