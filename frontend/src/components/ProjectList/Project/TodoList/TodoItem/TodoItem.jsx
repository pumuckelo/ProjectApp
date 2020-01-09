import React, { useState, useEffect } from "react";
import "./TodoItem.css";

const TodoItem = props => {
  const [onTodoDetails, setOnTodoDetails] = useState(false);
  const [checklistStatus, setChecklistStatus] = useState({
    completed: null,
    notcompleted: null,
    length: null
  });

  let checklist = [
    {
      name: "Apfel",
      completed: false
    },
    {
      name: "Banane",
      completed: true
    },
    {
      name: "Birne",
      completed: false
    },
    {
      name: "Salat",
      completed: true
    }
  ];

  useEffect(() => {
    getCompletedChecklist();
  }, []);

  const getCompletedChecklist = () => {
    let completed = checklist.filter(item => item.completed);
    let notcompleted = checklist.filter(item => !item.completed);
    setChecklistStatus({
      completed: completed.length,
      notcompleted: notcompleted.length,
      length: checklist.length
    });
  };

  return (
    <div className="newdesign-todoitem">
      <div className="name">{props.todoItem.title}</div>
      <div className="status">Status: {props.todoItem.status}</div>
      <div className="checklist-status">
        Completed: {checklistStatus.completed} / {checklistStatus.length}
      </div>
      {props.todoItem.assignedTo && (
        <div className="assignedTo">
          <i class="fas fa-user"></i>
          <p>{props.todoItem.assignedTo.username}</p>
        </div>
      )}
    </div>
    // <div
    //   className={props.todoItem.completed ? "todoitem completed" : "todoitem"}
    // >
    //   <p onClick={props.toggleCompleted}>{props.todoItem.title}</p>

    //   <i onClick={props.deleteTodo} className="fas fa-trash-alt"></i>
    // </div>
  );
};

export default TodoItem;
