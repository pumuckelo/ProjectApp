import React, { useRef, useState } from "react";
import { useMutation, gql } from "@apollo/client";
import ConfirmationPopup from "../../../../Utils/ConfirmationPopup/ConfirmationPopup";
import "./TodoListSettings.css";

const TodoListSettings = props => {
  //Add DOM references to the input fields
  const nameInput = useRef("");
  const descriptionInput = useRef("");
  const startDateInput = useRef("");
  const dueDateInput = useRef("");

  //Create State for the ConfirmationPopup, so we can handle if it
  //should be displayed or not
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  //This is the updateTodoList Mutation String
  // $todoListId, $name etc are variables that can be used in the function below
  // Take a look at updateTodoListHandler below for better understanding
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

  const deleteTodoListMutationString = gql`
    mutation deleteTodoList($todoListId: ID) {
      deleteTodoList(todoListId: $todoListId) {
        _id
        name
      }
    }
  `;

  //Apollo Use Mutation Hook for the updateTodoList Mutation
  // Creates the function 'updateTodoList' that can take variables as parameters
  const [
    updateTodoList,
    {
      data: updateTodoListData,
      error: updateTodoListError,
      loading: updateTodoListLoading
    }
  ] = useMutation(updateTodoListMutationString);

  //Apollo Use Mutation Hook for the deleteTodoList Mutation
  //Creates the function deleteTodoList that requires todoListId as parameter

  const [
    deleteTodoList,
    {
      data: deleteTodoListData,
      error: deleteTodoListError,
      loading: deleteTodoListLoading
    }
  ] = useMutation(deleteTodoListMutationString);

  //This function will send a mutation with the data from the inputs, to update the todolist
  // the default value of the inputs is the current data so if someone doesnt change the title, it wont be seen as empty title
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
      props.closeSettings();
    });
    // .catch(err => console.log(err));
    console.log(startDateInput.current.value);
    console.log(dueDateInput.current.value);
  };

  const deleteTodoListHandler = () => {
    deleteTodoList({
      variables: {
        todoListId: props.todoListData._id
      }
    }).then(data => {
      console.log("TodoList Deleted");
      console.log(data);
      toggleConfirmationPopup();
      props.closeSettings();
    });
  };

  //This function will show/close the popup that will be displayed when user clicks delete
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
              type="button"
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

            {/* If user clicks on Delete, Popup should display */}
            {showConfirmationPopup && (
              <ConfirmationPopup
                confirm={() => deleteTodoListHandler()}
                cancel={() => toggleConfirmationPopup()}
                message="Are you sure you want to delete this List?"
                style="danger"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoListSettings;
