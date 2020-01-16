import React, { useState, useRef, Fragment } from "react";
import "./Project.css";
import TodoList from "./TodoList/TodoList";
import ProjectList from "../ProjectList";
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";

const Project = props => {
  const { projectid } = props.match.params;
  const [projectListEnabled, setProjectListEnabled] = useState(false);
  const [projectData, setProjectData] = useState({
    name: "",
    todoLists: []
  });

  //----- Query / Mutation Strings

  const getProjectQueryString = gql`
  {
    getProject(id:"${projectid}"){
      name
      startDate
      dueDate
      status
      todoLists
    }
  }
  `;

  const createTodoListMutationString = gql`
    mutation createTodoList($name: String, $projectId: ID) {
      createTodoList(name: $name, projectId: $projectId) {
        name
      }
    }
  `;

  const todoListCreatedSubscriptionString = gql`
    subscription todoListCreated($projectId: ID) {
      todoListCreated(projectId: $projectId) {
        _id
      }
    }
  `;
  //-----------

  const {
    data: getProjectData,
    error: getProjectError,
    loading: getProjectLoading
  } = useQuery(getProjectQueryString, {
    onCompleted(data) {
      setProjectData(data.getProject);
    }
  });

  if (getProjectError) {
    console.log(getProjectError);
  }

  let todoLists = projectData.todoLists.map(id => {
    return <TodoList key={id} _id={id} />;
  });

  // addTodoListHandler
  const newListInput = useRef("");
  const [
    createTodo,
    { data: createTodoData, loading: createTodoLoading, error: createTodoError }
  ] = useMutation(createTodoListMutationString);

  const createTodoListHandler = event => {
    let name = newListInput.current.value;
    event.preventDefault();
    createTodo({
      variables: {
        name: name,
        projectId: projectid
      }
    });
  };

  if (createTodoData) {
    console.log(createTodoData);
  }
  //TodoList Subscription for new added TodoLists
  const {
    data: todoListCreatedData,
    error: todoListCreatedError,
    loading: todoListCreatedLoading
  } = useSubscription(todoListCreatedSubscriptionString, {
    variables: {
      projectId: projectid
    },
    onSubscriptionData({ subscriptionData: { data } }) {
      console.log(data);
      setProjectData({
        ...projectData,
        todoLists: [...projectData.todoLists, data.todoListCreated._id]
      });
    }
  });

  if (todoListCreatedData) {
    // console.log(`Subcription`);
    // console.log(todoListCreatedData.todoListCreated._id);
  }

  if (todoListCreatedError) {
    console.log(todoListCreatedError);
  }

  const toggleProjectList = () => {
    setProjectListEnabled(!projectListEnabled);
  };
  // const addNewTodoListHandler = event => {
  //   event.preventDefault();
  //   let updatedTodoLists = [...todoLists];
  //   updatedTodoLists.push(newListInput.current.value);
  //   setTodoLists(updatedTodoLists);
  //   newListInput.current.value = "";
  // };

  // const todoListsComponents = todoLists.map((todoList, index) => {
  //   return <TodoList title={todoList} key={index} />;
  // });
  //graphql query to get infos about project with the id you get from props.projectid
  // then create array of todolists

  return (
    <Fragment>
      {projectListEnabled && (
        <ProjectList
          close={() => {
            toggleProjectList();
          }}
        />
      )}
      <div className="project">
        <div className="heading">
          <i
            onClick={() => {
              toggleProjectList();
            }}
            className="fas fa-ellipsis-v fa-lg"
          ></i>
          <h1>{projectData.name}</h1>
        </div>
        <div className="todolists">
          {/*Hier würden normalerweise die todolists von der datenbank hinkommen in einem array.map => todolist*/}
          {/* {todoListsComponents} */}
          {todoLists}
          <form onSubmit={event => createTodoListHandler(event)} action="">
            <div className="newListControl">
              <input ref={newListInput} type="text" placeholder="New List" />
              <button className="newList">
                Add <i className="fas fa-clipboard-list"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Project;
