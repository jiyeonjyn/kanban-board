import { memo } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { tasksState } from '../atoms';
import AddForm from './add_form';
import TaskItem from './task';

const Container = styled.section<{ isDragging: boolean }>`
  border-radius: 5px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin-right: 20px;
  margin-bottom: 20px;
  width: 330px;
  transition: background-color 0.3s;
  box-shadow: ${(props) =>
    props.isDragging ? '4px 4px 8px rgba(0, 0, 0, 0.1)' : '2px 2px 4px rgba(0, 0, 0, 0.1)'};
  background-color: ${(props) => (props.isDragging ? '#dcdcdcb7' : '#ebecef')};
`;

const Title = styled.h2`
  padding: 10px 20px;
  font-family: 'Amaranth', sans-serif;
`;

const List = styled.section<{ isDraggingFromThis: boolean; isDraggingOver: boolean }>`
  min-height: 250px;
  padding: 10px 20px;
  transition: background-color 0.2s;
  background-color: ${(props) =>
    props.isDraggingFromThis
      ? 'rgba(250, 223, 237, 0.5)'
      : props.isDraggingOver
      ? 'rgba(218, 250, 255, 0.5)'
      : 'transparent'};
`;

type Props = {
  title: string;
  index: number;
};

function Column({ title, index }: Props) {
  const tasks = useRecoilValue(tasksState);

  return (
    <Draggable draggableId={title} index={index}>
      {(provided, snapshot) => (
        <Container
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          {...provided.draggableProps}
        >
          <Title {...provided.dragHandleProps}>{title}</Title>
          <Droppable droppableId={title} type="TASK">
            {(provided2, snapshot2) => (
              <List
                ref={provided2.innerRef}
                isDraggingFromThis={Boolean(snapshot2.draggingFromThisWith)}
                isDraggingOver={snapshot2.isDraggingOver}
              >
                {tasks.columns[title].map((task, index) => (
                  <TaskItem key={task.id} task={task} index={index} />
                ))}
                {provided2.placeholder}
              </List>
            )}
          </Droppable>
          <AddForm formType="TASK" title={title} />
        </Container>
      )}
    </Draggable>
  );
}

export default memo(Column);
