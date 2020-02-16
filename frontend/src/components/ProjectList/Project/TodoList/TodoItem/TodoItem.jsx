import React, { useState, useEffect, Fragment, useRef } from "react";
import "./TodoItem.css";
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import TodoItemDetails from "./TodoItemDetails/TodoItemDetails";
import { useProjectData } from "../../Project";
import MemberSelection from "./MemberSelection/MemberSelection";
import Checklist from "./Checklist/Checklist";
import Comments from "./Comments/Comments";
import flatpicker from "flatpickr";

const TodoItem = props => {
  const nameInput = useRef();
  const statusInput = useRef();

  const [todoItemData, setTodoItemData] = useState({
    name: "",
    checklist: [],
    comments: []
  });
  const { _id } = props;
  const [isAssigningUser, setIsAssigningUser] = useState(false);
  const [isViewingChecklist, setIsViewingChecklist] = useState(false);
  const [isViewingComments, setIsViewingComments] = useState(false);

  const getTodoItemQueryString = gql`
    {
      getTodoItem(id: "${_id}") {
        _id
        name
        checklist {
          name
          completed
          _id
        }
        assignedTo {
          username
          _id
        }
        comments {
          author {
            username
          }
          _id
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
    mutation updateTodoItem(
      $todoItemId: ID
      $name: String
      $status: String
      $assignedTo: ID
    ) {
      updateTodoItem(
        todoItemId: $todoItemId
        name: $name
        status: $status
        assignedTo: $assignedTo
      ) {
        _id
        name
        status
      }
    }
  `;

  const todoItemUpdatedSubscriptionString = gql`
    subscription todoItemUpdated($todoItemId: ID) {
      todoItemUpdated(todoItemId: $todoItemId) {
        _id
        name
        checklist {
          name
          completed
          _id
        }
        assignedTo {
          username
          _id
        }
        comments {
          _id
          author {
            username
          }
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
      setTodoItemData(getTodoItem);
    }
  });

  const [updateTodoItem, dataErrorLoading] = useMutation(
    updateTodoItemMutationString
  );

  const {
    data: todoItemUpdatedData,
    loading: todoItemUpdatedLoading,
    error: todoItemUpdatedError
  } = useSubscription(todoItemUpdatedSubscriptionString, {
    variables: {
      todoItemId: _id
    },
    onSubscriptionData({
      subscriptionData: {
        data: { todoItemUpdated }
      }
    }) {
      console.log(todoItemUpdated);
      setTodoItemData(todoItemUpdated);
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

  const updateTodoItemHandler = () => {
    // setTodoItemData({
    //   ...todoItemData,
    //   name: nameInput.current.value,
    //   status: statusInput.current.value
    // });
    updateTodoItem({
      variables: {
        todoItemId: todoItemData._id,
        //TODO Maybe spreading here will result in bugs
        ...todoItemData,
        assignedTo: todoItemData.assignedTo
          ? todoItemData.assignedTo._id
          : null,
        name: nameInput.current.value,
        status: statusInput.current.value
      }
    })
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };

  //====== STATE TOGGLERS ========
  const toggleIsAssigningUser = () => {
    setIsAssigningUser(!isAssigningUser);
  };

  const toggleIsViewingChecklist = () => {
    setIsViewingChecklist(!isViewingChecklist);
  };

  const toggleIsViewingComments = () => {
    setIsViewingComments(!isViewingComments);
  };

  //====================================

  const assignUserHandler = userId => {
    console.log(`assignUserhandler fired, Userid ${userId}`);
    updateTodoItem({
      variables: {
        todoItemId: todoItemData._id,
        ...todoItemData,
        assignedTo: userId
      }
    })
      .then(() => {
        console.log("assigned");
        toggleIsAssigningUser();
      })
      .catch(err => console.log(err));
  };

  const unassignUserHandler = () => {
    console.log("unassigned fired");
    //Only execute if todo is currently assigned to prevent unneccesary api calls
    if (todoItemData.assignedTo) {
      updateTodoItem({
        variables: {
          ...todoItemData,
          todoItemId: todoItemData._id,
          assignedTo: null
        }
      })
        .catch(err => console.log(err))
        .then(() => toggleIsAssigningUser());
    } else {
      toggleIsAssigningUser();
    }
  };

  const openDatepicker = () => {
    console.log("openDatepicker fired");
  };

  // flatpicker("#datepickerinput", { wrap: true });

  return (
    <Fragment>
      <div className="newdesign-todoitem">
        <div className="name">
          <input
            onBlur={() => updateTodoItemHandler()}
            ref={nameInput}
            className="hidden-input"
            type="text"
            required
            defaultValue={todoItemData.name}
          />
        </div>

        <div className="flex">
          <div status={todoItemData.status} className="status">
            <select
              value={todoItemData.status}
              className={todoItemData.status}
              ref={statusInput}
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
          <div
            className={
              isAssigningUser
                ? "assignedUser mg-left-05 "
                : "assignedUser mg-left-05"
            }
          >
            {todoItemData.assignedTo ? (
              // <button className="btn" onClick={() => toggleIsAssigningUser()}>
              //   {todoItemData.assignedTo.username.substring(0, 5) + ".."}
              // </button>
              <div className="user" onClick={() => toggleIsAssigningUser()}>
                {todoItemData.assignedTo.username.length > 10
                  ? todoItemData.assignedTo.username.substring(0, 8) + ".."
                  : todoItemData.assignedTo.username}
              </div>
            ) : (
              <i
                onClick={() => toggleIsAssigningUser()}
                className="fas fa-user-plus"
              >
                {" "}
              </i>
            )}
            {isAssigningUser && (
              <MemberSelection
                unassignUser={unassignUserHandler}
                assignUser={assignUserHandler}
                closeMemberSelection={toggleIsAssigningUser}
              />
            )}
          </div>
        </div>
        <div className="flex">
          <div className="date">
            {/* TODO braucht man ein Start Datum fuer todos? */}
            {/* {todoItemData.startDate ? (
              todoItemData.startDate
            ) : (
              <i className="far fa-calendar-plus"></i>
            )}{" "} */}
            {todoItemData.dueDate ? (
              <div className="">
                <i className="far fa-calendar-times"></i> {todoItemData.dueDate}
              </div>
            ) : (
              <i onClick={openDatepicker} className="far fa-calendar-times"></i>
            )}
          </div>
          <div className="checklist">
            {todoItemData.checklist.length > 0 && (
              <div className="">
                <span>
                  {todoItemData.checklist.filter(item => item.completed).length}
                  /
                </span>
                <span>{todoItemData.checklist.length}</span>
              </div>
            )}
            <i
              onClick={() => toggleIsViewingChecklist()}
              className="fas fa-tasks mg-left-02"
            ></i>
            {isViewingChecklist && (
              <Checklist
                closeChecklist={toggleIsViewingChecklist}
                todoItemId={todoItemData._id}
                checklistData={todoItemData.checklist}
              />
            )}
          </div>
          <div className="comments">
            <span
              className={
                todoItemData.comments.length > 9
                  ? "comments-count-over9"
                  : "comments-count"
              }
            >
              {todoItemData.comments.length > 0 && todoItemData.comments.length}
            </span>
            <i
              onClick={() => toggleIsViewingComments()}
              className="far fa-comments"
            ></i>
            {isViewingComments && (
              <Comments
                todoItemId={todoItemData._id}
                closeComments={toggleIsViewingComments}
                commentsData={todoItemData.comments}
              />
            )}
          </div>
        </div>

        {/* TODO IF user already assigned, show assigned user and on click show selection field */}
        <div className="checklist-status">
          {/* Completed: {checklistStatus.completed} / {checklistStatus.length} */}
        </div>
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
