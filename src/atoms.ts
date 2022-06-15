import { Tasks } from './types/index';
import { atom } from 'recoil';

export const tasksState = atom<Tasks>({
  key: 'tasksState',
  default: {
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
