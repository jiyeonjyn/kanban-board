import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const OuterCan = styled.div`
  position: fixed;
  right: 1.5rem;
  bottom: 1.7rem;
  width: 50px;
  height: 50px;
  color: white;
  font-size: 3rem;
`;

const InnerCan = styled(OuterCan)<{ isDraggingOver: boolean }>`
  transition: transform 0.3s;
  transform: scale(${(props) => (props.isDraggingOver ? 1.3 : 1)});
`;

function TrashCan() {
  return (
    <Droppable droppableId="TRASH_COLUMN_DROPPABLE" type="COLUMN">
      {(provided, snapshot) => (
        <OuterCan ref={provided.innerRef} {...provided.droppableProps}>
          <Droppable droppableId="TRASH_TASK_DROPPABLE" type="TASK">
            {(provided2, snapshot2) => (
              <InnerCan
                ref={provided2.innerRef}
                isDraggingOver={snapshot.isDraggingOver || snapshot2.isDraggingOver}
                {...provided2.droppableProps}
              >
                <i className="fa-solid fa-trash-can"></i>
                {provided2.placeholder}
              </InnerCan>
            )}
          </Droppable>
          {provided.placeholder}
        </OuterCan>
      )}
    </Droppable>
  );
}

export default TrashCan;
