import React from "react";
import { Fragment } from "react";

import "./TodoItemDetails.css";

const TodoItemDetails = props => {
  const checklistItems = props.todoItem.checklist.map(checklistItem => {
    return (
      <div className="checklistItem">
        <i className="far fa-circle"></i>
        {checklistItem.name}
      </div>
    );
  });
  return (
    <Fragment>
      <div className="dark-bg-100"></div>
      <div className="todoDetails">
        <i onClick={props.closeDetails} className="fas fa-window-close"></i>
        <div className="name">Todoname</div>
        <div className="notes">
          Notizen: Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Voluptatum placeat ab a autem magnam eos explicabo est. Molestias,
          pariatur? Culpa accusamus quo omnis odit, sapiente tempore deserunt
          vel nulla minima!
        </div>
        <div className="checklist">
          Checklist: {checklistItems}
          <input type="text" placeholder="Add" />
        </div>
        <div className="comments">Kommentare</div>
      </div>
    </Fragment>
  );
};

export default TodoItemDetails;
