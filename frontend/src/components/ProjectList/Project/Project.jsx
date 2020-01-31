import React, {
  useState,
  useRef,
  Fragment,
  useEffect,
  useContext
} from "react";
import "./Project.css";
import TodoList from "./TodoList/TodoList";
import ProjectList from "../ProjectList";
import {
  gql,
  useQuery,
  useMutation,
  useSubscription,
  useApolloClient
} from "@apollo/client";
import ProjectSettings from "./ProjectSettings/ProjectSettings";
import ProjectMembersContext from "../../../context/projectMembers-context";

const Project = props => {
  const client = useApolloClient();
  const { projectid } = props.match.params;
  const [projectListEnabled, setProjectListEnabled] = useState(false);
  const [projectSettingsEnabled, setProjectSettingsEnabled] = useState(false);
  const [projectData, setProjectData] = useState({
    name: "",
    todoLists: []
  });
  const newListInput = useRef("");

  //----- Query / Mutation Strings

  // useEffect(() => {
  //   if (projectData) {
  //     setProjectData(getProjectData);
  //   }
  // }, []);

  const getProjectQueryString = gql`
  {
    getProject(id:"${projectid}"){
      _id
      name
      startDate
      dueDate
      status
      todoLists
      members {
        username
        _id
      }
      owners {
        username
        _id
      }
    }
  }
  `;

  // Not needed since writequery after subscription returns data doesnt work

  // try {
  //   let data = client.readQuery({
  //     query: getProjectQueryString
  //   });
  //   setProjectData(data.getProject);
  //   console.log("hat getried");
  //   console.log(data);
  // } catch (error) {
  //   console.log(error);
  // }

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

  const todoListDeletedSubscriptionString = gql`
    subscription todoListDeleted($projectId: ID) {
      todoListDeleted(projectId: $projectId) {
        _id
      }
    }
  `;

  const memberRemovedSubscriptionString = gql`
    subscription memberRemoved($projectId: ID) {
      memberRemoved(projectId: $projectId)
    }
  `;
  //-----------

  // Get Data about the project and then set it to the state
  // also render todoList components for every id in todoLists array of the project
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
  const [
    createTodoList,
    {
      data: createTodoListData,
      loading: createTodoListLoading,
      error: createTodoListError
    }
  ] = useMutation(createTodoListMutationString);

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
      //Not working for some reason
      // client.cache.writeQuery({
      //   query: getProjectQueryString,
      //   data: {
      //     ...projectData,
      //     todoLists: [...projectData.todoLists, data.todoListCreated._id]
      //     }
      // });
      setProjectData({
        ...projectData,
        todoLists: [...projectData.todoLists, data.todoListCreated._id]
      });
    }
  });

  const {
    data: todoListDeletedData,
    error: todoListDeletedError,
    loading: todoListDeletedLoading
  } = useSubscription(todoListDeletedSubscriptionString, {
    variables: {
      projectId: projectid
    },
    onSubscriptionData({
      subscriptionData: {
        data: { todoListDeleted }
      }
    }) {
      //set state and filter out the todolist that got deleted
      setProjectData({
        ...projectData,
        todoLists: projectData.todoLists.filter(
          todoListId => todoListId != todoListDeleted._id
        )
      });
    }
  });

  //If a member gets removed from project, also remove him from members in state
  const memberRemovedData = useSubscription(memberRemovedSubscriptionString, {
    variables: {
      projectId: projectData._id
    },
    onSubscriptionData({ subscriptionData: { data } }) {
      console.log("SUBSCRIPTION: MEMBER WAS REMOVED");
      console.log(data.memberRemoved);
      let removedMemberId = data.memberRemoved;
      removeMemberHandler(removedMemberId);
    }
  });

  const createTodoListHandler = event => {
    let name = newListInput.current.value;
    event.preventDefault();
    createTodoList({
      variables: {
        name: name,
        projectId: projectid
      }
    }).catch(err => console.log(err));
    newListInput.current.value = "";
  };

  const toggleProjectList = () => {
    setProjectListEnabled(!projectListEnabled);
  };

  const toggleProjectSettings = () => {
    setProjectSettingsEnabled(!projectSettingsEnabled);
  };

  //++++++++++++ Make the members globally available +++++++++++

  //======== Functions to mutate the globally available State =======
  //Function to remove Member from State
  const removeMemberHandler = userId => {
    const newMembers = projectData.members.filter(
      member => member._id != userId
    );
    const newOwners = projectData.owners.filter(owner => owner != userId);
    setProjectData({
      ...projectData,
      members: newMembers,
      owners: newOwners
    });
  };

  return (
    <ProjectMembersContext.Provider
      value={{
        projectId: projectData._id,
        members: projectData.members,
        owners: projectData.owners,
        removeMember: removeMemberHandler
      }}
    >
      <Fragment>
        {projectListEnabled && (
          <ProjectList
            close={() => {
              toggleProjectList();
            }}
          />
        )}
        {projectSettingsEnabled && (
          <ProjectSettings
            closeSettings={() => toggleProjectSettings()}
            projectData={projectData}
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
            <i
              onClick={() => toggleProjectSettings()}
              className="fas fa-cogs"
            ></i>
          </div>
          <div className="todolists">
            {/*Hier würden normalerweise die todolists von der datenbank hinkommen in einem array.map => todolist*/}
            {/* {todoListsComponents} */}
            {todoLists}
            <form onSubmit={event => createTodoListHandler(event)} action="">
              <div className="newListControl">
                <input
                  required
                  ref={newListInput}
                  type="text"
                  placeholder="New List"
                />
                <button className="newList">
                  Add <i className="fas fa-clipboard-list"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Fragment>
    </ProjectMembersContext.Provider>
  );
};

// Creating a hook so I can access the
export const useProjectData = () => useContext(ProjectMembersContext);

export default Project;
