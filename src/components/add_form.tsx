import { FormEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { columnsState, tasksState } from '../atoms';

type Props = {
  formType: 'COLUMN' | 'TASK';
  title?: string;
};

const Container = styled.section`
  width: 330px;
`;

const MainBtn = styled.div<Props>`
  padding: 10px;
  border-radius: 5px;
  font-size: 1rem;
  transition: background-color 0.2s;
  color: #6e6e6e;
  background-color: ${(props) =>
    props.formType === 'COLUMN' ? 'rgba(255, 255, 255, 0.3)' : 'transparent'};
  cursor: pointer;
  &:hover {
    background-color: ${(props) =>
      props.formType === 'COLUMN' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(203, 203, 203, 0.6)'};
  }
  span {
    margin-left: 10px;
  }
`;

const Form = styled.form<Props>`
  display: flex;
  padding: 10px;
  background-color: ${(props) => (props.formType === 'COLUMN' ? '#ebecef' : 'transparent')};
  border-radius: 5px;
`;

const TextInput = styled.input.attrs({ type: 'text' })<Props>`
  padding: 8px 10px;
  flex: 1 1 0;
  border: 0;
  font-size: 1rem;
  border-radius: 5px;
`;

const SubmitBtn = styled.button`
  padding: 0 15px;
  border: 0;
  background-color: #03c7e5;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 5px;
  &:hover {
    opacity: 0.8;
  }
`;

function AddForm({ formType, title }: Props) {
  const setTasks = useSetRecoilState(tasksState);
  const columns = useRecoilValue(columnsState);
  const [isActive, setIsActive] = useState(false);

  // 폼 활성화
  const onClick = useCallback(() => !isActive && setIsActive(true), [isActive]);

  const inputRef = useRef<HTMLInputElement>(null);
  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      const value = inputRef.current?.value;
      if (!value) return;
      if (formType === 'COLUMN') {
        if (columns.includes(value)) {
          alert('A list with the same name already exists.');
          return;
        }
        setTasks((currVal) => {
          const ordered = [...currVal.ordered, value];
          const columns = { ...currVal.columns, [value]: [] };
          return { columns, ordered };
        });
      } else {
        title &&
          setTasks((currVal) => {
            const newTask = { id: Date.now(), content: value };
            const columns = {
              ...currVal.columns,
              [title]: [...currVal.columns[title], newTask],
            };
            return { ...currVal, columns };
          });
      }
      e.currentTarget.reset();
      setIsActive(false);
    },
    [formType, columns, title, setTasks]
  );

  // 폼 비활성화
  const containerRef = useRef<HTMLTableSectionElement>(null);
  const handleClickOutside = useCallback(
    ({ target }: any) => {
      isActive &&
        !inputRef.current?.value &&
        !containerRef.current?.contains(target) &&
        setIsActive(false);
    },
    [isActive]
  );

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <Container ref={containerRef}>
      {isActive ? (
        <Form formType={formType} onSubmit={onSubmit}>
          <TextInput
            ref={inputRef}
            formType={formType}
            placeholder={`Enter ${formType === 'COLUMN' ? 'list title' : 'your content'}...`}
          ></TextInput>
          <SubmitBtn>Add</SubmitBtn>
        </Form>
      ) : (
        <MainBtn formType={formType} onClick={onClick}>
          <i className="fa-solid fa-plus"></i>
          <span>{`${formType === 'COLUMN' ? 'Add a list' : 'Add a card'}`}</span>
        </MainBtn>
      )}
    </Container>
  );
}

export default AddForm;
