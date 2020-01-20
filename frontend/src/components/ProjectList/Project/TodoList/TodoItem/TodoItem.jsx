import React, { useState, useEffect, Fragment, useRef } from "react";
import "./TodoItem.css";
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import TodoItemDetails from "./TodoItemDetails/TodoItemDetails";

const TodoItem = props => {
  const nameInput = useRef();
  const statusInput = useRef();

  const [todoItemData, setTodoItemData] = useState({
    name: "",
    checklist: []
  });
  const { _id } = props;
  console.log(_id);
  const getTodoItemQueryString = gql`
    {
      getTodoItem(id: "${_id}") {
        _id
        name
        checklist {
          name
          completed
        }
        assignedTo {
          username
        }
        comments {
          content
          created
        }
        status
        notes
        startDate
        dueDate
        todoList
      }
    }
  `;

  const updateTodoItemMutationString = gql`
    mutation updateTodoItem($todoItemId: ID, $name: String, $status: String) {
      updateTodoItem(todoItemId: $todoItemId, name: $name, status: $status) {
        _id
        name
        status
      }
    }
  `;

  const {
    data: getTodoItemData,
    loading: getTodoItemLoading,
    error: getTodoItemError
  } = useQuery(getTodoItemQueryString, {
    onCompleted({ getTodoItem }) {
      console.log("getTodoItemData");
      console.log(getTodoItem);
      setTodoItemData(getTodoItem);
    }
  });

  const [updateTodoItem, dataErrorLoading] = useMutation(
    updateTodoItemMutationString
  );

  const [onTodoItemDetails, setOnTodoItemDetails] = useState(false);
  const [checklistStatus, setChecklistStatus] = useState({
    completed: null,
    notcompleted: null,
    length: null
  });

  // useEffect(() => {
  //   getCompletedChecklist();
  // }, []);

  // const getCompletedChecklist = () => {
  //   let completed = props.todoItem.checklist.filter(item => item.completed);
  //   let notcompleted = props.todoItem.checklist.filter(item => !item.completed);
  //   setChecklistStatus({
  //     completed: completed.length,
  //     notcompleted: notcompleted.length,
  //     length: props.todoItem.checklist.length
  //   });
  // };

  const toggleTodoItemDetails = () => {
    setOnTodoItemDetails(!onTodoItemDetails);
  };

  const updateTodoItemHandler = () => {
    console.log(`Status Input ${statusInput.current.value}`);
    updateTodoItem({
      variables: {
        todoItemId: todoItemData._id,
        name: nameInput.current.value,
        status: statusInput.current.value
      }
    })
      .then(data => console.log(data))
      .catch(err => console.log(err));
    console.log("tried to update todo");
  };

  return (
    <Fragment>
      <div className="newdesign-todoitem">
        <div className="name">
          <input
            onBlur={() => updateTodoItemHandler()}
            ref={nameInput}
            className="hidden-input"
            type="text"
            defaultValue={todoItemData.name}
          />
        </div>

        {todoItemData.status && (
          <div className="status">
            Status:{"  "}
            <select
              ref={statusInput}
              defaultValue={todoItemData.status}
              onChange={() => {
                updateTodoItemHandler();
              }}
              className="form-input"
              name=""
              id=""
            >
              <option value="notstarted">Not started</option>
              <option value="progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}
        <div className="checklist-status">
          {/* Completed: {checklistStatus.completed} / {checklistStatus.length} */}
        </div>
        {todoItemData.assignedTo && (
          <div className="assignedTo">
            <i className="fas fa-user"></i>
            <p>{todoItemData.assignedTo.username}</p>
          </div>
        )}
      </div>

      {onTodoItemDetails && (
        <TodoItemDetails
          closeDetails={() => toggleTodoItemDetails()}
          todoItem={todoItemData}
        />
      )}
    </Fragment>

    // <div
    //   className={props.todoItem.completed ? "todoitem completed" : "todoitem"}
    // >
    //   <p onClick={props.toggleCompleted}>{props.todoItem.title}</p>

    //   <i onClick={props.deleteTodo} className="fas fa-trash-alt"></i>
    // </div>
  );
};

export default TodoItem;
