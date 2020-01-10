import React, { useState, useEffect, Fragment } from "react";
import "./TodoItem.css";
import TodoItemDetails from "./TodoItemDetails/TodoItemDetails";

const TodoItem = props => {
  const [onTodoItemDetails, setOnTodoItemDetails] = useState(false);
  const [checklistStatus, setChecklistStatus] = useState({
    completed: null,
    notcompleted: null,
    length: null
  });

  useEffect(() => {
    getCompletedChecklist();
  }, []);

  const getCompletedChecklist = () => {
    let completed = props.todoItem.checklist.filter(item => item.completed);
    let notcompleted = props.todoItem.checklist.filter(item => !item.completed);
    setChecklistStatus({
      completed: completed.length,
      notcompleted: notcompleted.length,
      length: props.todoItem.checklist.length
    });
  };

  const toggleTodoItemDetails = () => {
    setOnTodoItemDetails(!onTodoItemDetails);
  };

  return (
    <Fragment>
      <div
        onClick={() => toggleTodoItemDetails()}
        className="newdesign-todoitem"
      >
        <div className="name">{props.todoItem.title}</div>
        <div className="status">Status: {props.todoItem.status}</div>
        <div className="checklist-status">
          Completed: {checklistStatus.completed} / {checklistStatus.length}
        </div>
        {props.todoItem.assignedTo && (
          <div className="assignedTo">
            <i className="fas fa-user"></i>
            <p>{props.todoItem.assignedTo.username}</p>
          </div>
        )}
      </div>

      {onTodoItemDetails && (
        <TodoItemDetails
          closeDetails={() => toggleTodoItemDetails()}
          todoItem={props.todoItem}
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
