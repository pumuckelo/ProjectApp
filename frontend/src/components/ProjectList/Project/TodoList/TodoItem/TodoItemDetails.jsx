import React from "react";
import { Fragment } from "react";

const TodoDetails = props => {
  return (
    <Fragment>
      <div className="dark-bg-100"></div>
      <div className="todoDetails">
        <div className="name">Todoname</div>
        <div className="notes">
          Notizen: Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Voluptatum placeat ab a autem magnam eos explicabo est. Molestias,
          pariatur? Culpa accusamus quo omnis odit, sapiente tempore deserunt
          vel nulla minima!
        </div>
        <div className="checklist">Checklist</div>
        <div className="comments">Kommentare</div>
      </div>
    </Fragment>
  );
};

export default TodoDetails;
