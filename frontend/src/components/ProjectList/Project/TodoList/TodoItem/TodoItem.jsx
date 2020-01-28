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

  const todoItemUpdatedSubscriptionString = gql`
    subscription todoItemUpdated($todoItemId: ID) {
      todoItemUpdated(todoItemId: $todoItemId) {
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
    setTodoItemData({
      ...todoItemData,
      name: nameInput.current.value,
      status: statusInput.current.value
    });
    updateTodoItem({
      variables: {
        todoItemId: todoItemData._id,
        name: nameInput.current.value,
        status: statusInput.current.value
      }
    })
      .then(data => console.log(data))
      .catch(err => console.log(err));
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
          <div status={todoItemData.status} className="status">
            Status:{"  "}
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
        )}
        {!todoItemData.assignedTo && (
          <div className="assignedUser">
            <i className="fas fa-user-plus"> </i>
            Unassigned
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
