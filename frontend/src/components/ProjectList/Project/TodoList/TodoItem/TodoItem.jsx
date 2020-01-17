import React, { useState, useEffect, Fragment } from "react";
import "./TodoItem.css";
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import TodoItemDetails from "./TodoItemDetails/TodoItemDetails";

const TodoItem = props => {
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

  return (
    <Fragment>
      <div
        onClick={() => toggleTodoItemDetails()}
        className="newdesign-todoitem"
      >
        <div className="name">{todoItemData.name}</div>
        <div className="status">Status: {todoItemData.status}</div>
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
