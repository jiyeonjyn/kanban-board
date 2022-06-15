import styled from 'styled-components';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import { tasksState } from './atoms';
import Column from './components/column';
import TrashCan from './components/trash_can';
import AddForm from './components/add_form';
import { useEffect } from 'react';

const Container = styled.div`
  min-height: 100vh;
  background-image: radial-gradient(at 0% 100%, rgb(115, 118, 214) 0px, transparent 50%),
    radial-gradient(at 0% 0%, rgb(191, 152, 249) 0px, transparent 50%),
    radial-gradient(at 50% 20%, rgb(241, 102, 153) 0px, transparent 40%),
    radial-gradient(at 30% 0%, rgb(182, 62, 195) 0px, transparent 40%),
    radial-gradient(at 0% 50%, rgb(167, 150, 228) 0px, transparent 50%),
    radial-gradient(at 80% 50%, rgb(249, 155, 186) 0px, transparent 50%),
    radial-gradient(at 80% 100%, rgb(246, 110, 189) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgb(255, 135, 205) 0px, transparent 50%),
    radial-gradient(at 40% 90%, rgb(169, 146, 230) 0px, transparent 50%);
`;

const Header = styled.header`
  background-color: rgba(0, 0, 0, 0.2);
  text-align: center;
  padding: 23px;
  font-family: 'Amaranth', sans-serif;
  font-size: 1.8rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  user-select: none;
  line-height: 0;
  span {
    margin-left: 10px;
  }
`;

const Board = styled.section`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
`;

function App() {
  const [tasks, setTasks] = useRecoilState(tasksState);
  useEffect(() => window.localStorage.setItem('board', JSON.stringify(tasks)), [tasks]);

  const onDragEnd = (result: DropResult) => {
    // console.log(result);
    const { destination, source } = result;
    if (!destination?.droppableId) return;
    if (
      destination.droppableId === 'TRASH_COLUMN_DROPPABLE' ||
      destination.droppableId === 'TRASH_TASK_DROPPABLE'
    ) {
      source.droppableId === 'board'
        ? // delete column
          setTasks((currVal) => {
            const ordered = [...currVal.ordered];
            const columnKey = ordered[source.index];
            const columns = { ...currVal.columns };
            delete columns[columnKey];
            ordered.splice(source.index, 1);
            return { columns, ordered };
          })
        : // delete task
          setTasks((currVal) => {
            const list = [...currVal.columns[source.droppableId]];
            list.splice(source.index, 1);
            return {
              ...currVal,
              columns: {
                ...currVal.columns,
                [source.droppableId]: list,
              },
            };
          });
    } else if (destination.droppableId === 'board') {
      // column movement
      setTasks((currVal) => {
        const ordered = [...currVal.ordered];
        const columnKey = ordered[source.index];
        ordered.splice(source.index, 1);
        ordered.splice(destination.index, 0, columnKey);
        return { ...currVal, ordered };
      });
    } else if (destination.droppableId === source.droppableId) {
      // same column movement
      setTasks((currVal) => {
        const list = [...currVal.columns[source.droppableId]];
        const task = list[source.index];
        list.splice(source.index, 1);
        list.splice(destination.index, 0, task);
        return {
          ...currVal,
          columns: {
            ...currVal.columns,
            [source.droppableId]: list,
          },
        };
      });
    } else {
      // cross column movement
      setTasks((currVal) => {
        const sourceList = [...currVal.columns[source.droppableId]];
        const destinationList = [...currVal.columns[destination.droppableId]];
        const task = sourceList[source.index];
        sourceList.splice(source.index, 1);
        destinationList.splice(destination.index, 0, task);
        return {
          ...currVal,
          columns: {
            ...currVal.columns,
            [source.droppableId]: sourceList,
            [destination.droppableId]: destinationList,
          },
        };
      });
    }
  };

  return (
    <Container>
      <Header>
        <i className="fa-solid fa-table-list"></i>
        <span>Task Board</span>
      </Header>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="COLUMN">
          {(provided, snapshot) => (
            <Board ref={provided.innerRef} {...provided.droppableProps}>
              {tasks.ordered.map((key, index) => (
                <Column key={key} title={key} index={index} />
              ))}
              {!snapshot.isDraggingOver && <AddForm formType="COLUMN" />}
              {provided.placeholder}
            </Board>
          )}
        </Droppable>
        <TrashCan />
      </DragDropContext>
    </Container>
  );
}

export default App;
