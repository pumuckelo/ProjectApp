import React, { useRef, useState, Fragment } from "react";
import "./TodoList.css";
import TodoItem from "./TodoItem/TodoItem";
import TodoListSettings from "./TodoListSettings/TodoListSettings";
import {
  convertMongoDateToIsoDate,
  convertIsoStringToLocalDateString
} from "../../../../helpers/dateFunctions";
import { useQuery, gql, useMutation, useSubscription } from "@apollo/client";
const TodoList = props => {
  const { _id } = props;
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [todoListData, setTodoListData] = useState({
    name: "",
    todoItems: []
  });

  const getTodoListQueryString = gql`
  {
    getTodoList(id: "${_id}"){
      name
      _id
      description
      description
      startDate
      dueDate
      project
      todoItems
    }
  }
  `;

  const createTodoItemMutationString = gql`
    mutation createTodoItem($name: String, $todoListId: ID) {
      createTodoItem(name: $name, todoListId: $todoListId) {
        name
        _id
      }
    }
  `;

  const todoItemCreatedSubscriptionString = gql`
    subscription todoItemCreated($todoListId: ID) {
      todoItemCreated(todoListId: $todoListId) {
        _id
      }
    }
  `;

  const todoListUpdatedSubscriptionString = gql`
    subscription todoListUpdated($todoListId: ID) {
      todoListUpdated(todoListId: $todoListId) {
        name
        _id
        description
        description
        startDate
        dueDate
        project
        todoItems
      }
    }
  `;

  const {
    data: getTodoListData,
    error: getTodoListError,
    loading: getTodoListLoading
  } = useQuery(getTodoListQueryString, {
    async onCompleted({ getTodoList }) {
      let startDate;
      let dueDate;

      if (getTodoList.startDate) {
        startDate = convertMongoDateToIsoDate(getTodoList.startDate);
      }
      if (getTodoList.dueDate) {
        dueDate = convertMongoDateToIsoDate(getTodoList.dueDate);
      }

      setTodoListData({
        ...getTodoList,
        startDate: startDate,
        dueDate: dueDate
      });
    }
  });

  //Subscription for updates of the todolist
  const {
    data: todoListUpdatedData,
    error: todoListUpdatedError,
    loading: todoListUpdatedLoading
  } = useSubscription(todoListUpdatedSubscriptionString, {
    variables: {
      todoListId: _id
    },
    onSubscriptionData({
      subscriptionData: {
        data: { todoListUpdated }
      }
    }) {
      // if there was set a new date, convert the updated date to iso date and set to state
      setTodoListData({
        ...todoListUpdated,
        startDate:
          todoListUpdated.startDate &&
          convertMongoDateToIsoDate(todoListUpdated.startDate),
        dueDate:
          todoListUpdated.dueDate &&
          convertMongoDateToIsoDate(todoListUpdated.dueDate)
      });
    }
  });

  //add new TodoItem
  const newTodoInput = useRef("");
  const [
    createTodoItem,
    {
      data: createTodoItemData,
      loading: createTodoItemLoading,
      error: createTodoItemError
    }
  ] = useMutation(createTodoItemMutationString);
  const createTodoItemHandler = event => {
    event.preventDefault();
    let name = newTodoInput.current.value;
    createTodoItem({
      variables: {
        name: name,
        todoListId: todoListData._id
      }
    }).catch(err => console.log(err));
    newTodoInput.current.value = "";
  };

  //Render TodoItems
  const {
    data: todoItemCreatedData,
    loading: todoItemCreatedLoading,
    error: todoItemCreatedError
  } = useSubscription(todoItemCreatedSubscriptionString, {
    variables: {
      todoListId: todoListData._id
    },
    onSubscriptionData({ subscriptionData: { data } }) {
      setTodoListData({
        ...todoListData,
        todoItems: [...todoListData.todoItems, data.todoItemCreated._id]
      });
    }
  });

  const todoItems = todoListData.todoItems.map(id => {
    return <TodoItem key={id} _id={id} />;
  });

  /*{title: "App designen", completed: true}, {
            title: "App strukturieren",
            completed: false
        }, {title: "Datenbank planen", completed: false}, {title: "Backend planen", completed: false},*/

  // const newTodoSubmitHandler = event => {
  //   event.preventDefault();
  //   let newTodos = [...todos];
  //   if (newTodoInput.current.value !== "") {
  //     newTodos.push({ title: newTodoInput.current.value, completed: false });
  //     setTodos(newTodos);
  //   }
  //   newTodoInput.current.value = "";
  // };

  // const deleteTodoHandler = index => {
  //   let newTodos = [...todos];
  //   newTodos.splice(index, 1);
  //   console.log(index);
  //   console.log(newTodos);
  //   console.log("tried to delet");
  //   setTodos(newTodos);
  // };

  // const toggleTodoCompletedHandler = index => {
  //   let newTodos = [...todos];
  //   newTodos[index].completed = !newTodos[index].completed;
  //   setTodos(newTodos);
  // };

  const toggleListSettingsHandler = () => {
    setSettingsVisible(!settingsVisible);
  };

  // const todoItems = todos.map((todoitem, index) => {
  //   return (
  //     <TodoItem
  //       deleteTodo={() => {
  //         deleteTodoHandler(index);
  //       }}
  //       toggleCompleted={() => {
  //         toggleTodoCompletedHandler(index);
  //       }}
  //       key={index}
  //       todoItem={todoitem}
  //       title={todoitem.title}
  //       completed={todoitem.completed}
  //     />
  //   );
  // });
  return (
    <Fragment>
      {settingsVisible && (
        <TodoListSettings
          _id={_id}
          closeSettings={() => toggleListSettingsHandler()}
          listname={todoListData.name}
          todoListData={todoListData}
        />
      )}
      <div className="todolist">
        <i
          onClick={() => {
            toggleListSettingsHandler();
          }}
          className="fas fa-cog"
        ></i>
        <h2>{todoListData.name}</h2>
        {/* Only render if date exists in state */}
        {(todoListData.startDate || todoListData.dueDate) && (
          <div className="dates">
            <div className="startDate">
              <i className="far fa-calendar-plus"></i>{" "}
              {todoListData.startDate
                ? convertIsoStringToLocalDateString(todoListData.startDate)
                : "-"}
            </div>
            <div className="dueDate">
              <i className="far fa-calendar-times"></i>{" "}
              {todoListData.dueDate
                ? convertIsoStringToLocalDateString(todoListData.dueDate)
                : "-"}
            </div>
          </div>
        )}
        {/* {todoItems} */}
        {todoItems}
        <form
          className="newTodoForm"
          onSubmit={event => createTodoItemHandler(event)}
          action=""
        >
          <div className="newTodoForm-control">
            <input
              required
              ref={newTodoInput}
              type="text"
              placeholder="New todo"
            />
            <button type="submit">+</button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default TodoList;
