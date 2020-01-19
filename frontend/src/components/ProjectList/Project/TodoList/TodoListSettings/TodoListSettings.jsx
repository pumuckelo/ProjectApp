import React, { useRef, useState } from "react";
import { useMutation, gql } from "@apollo/client";
import ConfirmationPopup from "../../../../Utils/ConfirmationPopup/ConfirmationPopup";
import "./TodoListSettings.css";

const TodoListSettings = props => {
  const nameInput = useRef("");
  const descriptionInput = useRef("");
  const startDateInput = useRef("");
  const dueDateInput = useRef("");

  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  const updateTodoListMutationString = gql`
    mutation updateTodoList(
      $todoListId: ID
      $name: String
      $description: String
      $startDate: String
      $dueDate: String
    ) {
      updateTodoList(
        todoListId: $todoListId
        name: $name
        description: $description
        startDate: $startDate
        dueDate: $dueDate
      ) {
        _id
        name
      }
    }
  `;

  const [
    updateTodoList,
    {
      data: updateTodoListData,
      error: updateTodoListError,
      loading: updateTodoListLoading
    }
  ] = useMutation(updateTodoListMutationString);

  const updateTodoListHandler = e => {
    e.preventDefault();
    updateTodoList({
      variables: {
        todoListId: props.todoListData._id,
        name: nameInput.current.value,
        description: descriptionInput.current.value,
        startDate: startDateInput.current.value,
        dueDate: dueDateInput.current.value
      }
    }).then(data => {
      console.log("updated todolist");
      console.log(data);
    });
    // .catch(err => console.log(err));
    console.log(startDateInput.current.value);
    console.log(dueDateInput.current.value);
  };

  const toggleConfirmationPopup = () => {
    setShowConfirmationPopup(!showConfirmationPopup);
  };

  return (
    <div className="todolistsettings_background">
      <div className="todolistsettings_modal">
        <i onClick={props.closeSettings} className="fas fa-window-close"></i>
        <h2>Edit TodoList</h2>
        <form onSubmit={e => updateTodoListHandler(e)} action="">
          <label htmlFor="">Name</label>
          <input
            ref={nameInput}
            name="name"
            type="text"
            defaultValue={props.todoListData.name}
            placeholder="Name"
            className="form-input"
          />
          <label htmlFor="">Description</label>
          <textarea
            ref={descriptionInput}
            defaultValue={props.todoListData.description}
            className="form-input"
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea>
          <label htmlFor="">Start Date</label>
          <input
            defaultValue={props.todoListData.startDate}
            ref={startDateInput}
            className="form-input"
            type="date"
            name=""
            id=""
          />
          <label htmlFor="">Due Date</label>
          <input
            defaultValue={props.todoListData.dueDate}
            ref={dueDateInput}
            className="form-input"
            type="date"
            name=""
            id=""
          />

          <div className="buttons">
            <button
              onClick={() => toggleConfirmationPopup()}
              className="btn btn-danger"
            >
              Delete
            </button>
            <button
              onClick={props.closeSettings}
              type="button"
              className="btn btn-secondary mg-right-05"
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Save
            </button>
            {showConfirmationPopup && (
              <ConfirmationPopup
                confirm={() => toggleConfirmationPopup()}
                cancel={() => toggleConfirmationPopup()}
                message="Do you want to create this List?"
                style="success"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoListSettings;
