import React, { useRef, useState, Fragment } from "react";
import "./TodoList.css";
import TodoItem from "./TodoItem/TodoItem";
import TodoListSettings from "./TodoListSettings/TodoListSettings";

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

  const {
    data: getTodoListData,
    error: getTodoListError,
    loading: getTodoListLoading
  } = useQuery(getTodoListQueryString, {
    onCompleted({ getTodoList }) {
      console.log(getTodoList);
      setTodoListData(getTodoList);
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
      console.log(data.todoItemCreated._id);
      setTodoListData({
        ...todoListData,
        todoItems: [...todoListData.todoItems, data.todoItemCreated._id]
      });
    }
  });

  const todoItems = todoListData.todoItems.map(id => {
    return <TodoItem _id={id} />;
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
      {settingsVisible && <TodoListSettings listname={todoListData.name} />}
      <div className="todolist">
        <i
          onClick={() => {
            toggleListSettingsHandler();
          }}
          className="fas fa-cog"
        ></i>
        <h2>{todoListData.name}</h2>
        {/* {todoItems} */}
        {todoItems}
        <form
          className="newTodoForm"
          onSubmit={event => createTodoItemHandler(event)}
          action=""
        >
          <div className="newTodoForm-control">
            <input ref={newTodoInput} type="text" placeholder="New todo" />
            <button type="submit">+</button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default TodoList;
