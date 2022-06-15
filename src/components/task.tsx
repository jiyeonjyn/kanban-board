import { memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Task } from '../types';

const Note = styled.div<{ isDragging: boolean }>`
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  font-size: 1.1rem;
  overflow: hidden;
  font-family: 'Bad Script', cursive;
  box-shadow: ${(props) => (props.isDragging ? '2px 2px 4px rgba(0, 0, 0, 0.1)' : 'none')};
  background-color: ${(props) => (props.isDragging ? '#FDD7E2' : '#fff')}; ;
`;

type Props = {
  task: Task;
  index: number;
};

function TaskItem({ task, index }: Props) {
  return (
    <Draggable draggableId={`${task.id}`} index={index}>
      {(provided, snapshot) => (
        <Note
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {task.content}
        </Note>
      )}
    </Draggable>
  );
}

export default memo(TaskItem);
