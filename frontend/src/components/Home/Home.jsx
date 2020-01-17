import React, { useState, useRef } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import { NavLink } from "react-router-dom";

import "./Home.css";
import Project from "../ProjectList/Project/Project";
import CustomMessage from "../Utils/ErrorMessage/CustomMessage";

const createProjectMutation = gql`
  mutation createProject($name: String) {
    createProject(name: $name) {
      name
      _id
    }
  }
`;

const myProjectsQuery = gql`
  {
    myProjects {
      name
      _id
    }
  }
`;

const myProjectSubscription = "";

const Home = props => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [myProjectsState, setMyProjectsState] = useState([]);

  //graphql function to create project
  const [
    createProject,
    {
      error: createProjectError,
      loading: createProjectLoading,
      data: createProjectData
    }
  ] = useMutation(createProjectMutation, {
    // update(cache, { data: { createProject } }) {
    //   const { myProjects } = cache.readQuery({ query: myProjectsQuery });
    //   console.log("updatecache fired");
    //   // console.log(data);
    //   console.log(myProjects);
    //   console.log(createProject);
    //   cache.writeQuery({
    //     query: myProjectsQuery,
    //     data: { myProjects: [...myProjects, createProject] }
    //   });
    // }
    refetchQueries: () => [
      {
        query: myProjectsQuery
      }
    ]
  });

  const projectNameInput = useRef();
  const {
    error: myProjectsError,
    loading: myProjectsLoading,
    data: myProjectsData
  } = useQuery(myProjectsQuery, {
    onCompleted() {
      setMyProjectsState(myProjectsData.myProjects);
    }
  });

  const createProjectHandler = async event => {
    event.preventDefault();
    let projectName = projectNameInput.current.value;
    await createProject({ variables: { name: projectName } })
      .then(() => {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 2000);
      })
      .catch(err => console.log(err));

    projectNameInput.current.value = "";
  };

  // const myProjects = myProjectsState.map(project => {
  //   return (
  //     <NavLink key={project._id} to={`/projects/${project._id}`}>
  //       <div className="projectCard">
  //         <p>{project.name}</p>
  //       </div>
  //     </NavLink>
  //   );
  // });

  let myProjects;
  if (myProjectsData) {
    myProjects = myProjectsState.map(project => {
      return (
        <NavLink key={project._id} to={`/projects/${project._id}`}>
          <div className="projectCard">
            <p>{project.name}</p>
          </div>
        </NavLink>
      );
    });
  }

  if (myProjectsData) {
  }

  //ERROR HANDLING
  if (myProjectsError) {
    console.log(myProjectsError.message);
  }

  return (
    <div className="gridbox">
      <div className="left">
        <div className="projects">
          <h1>My Projects</h1>
          {myProjectsLoading && <p>Loading projects...</p>}
          {myProjectsData && myProjects}
        </div>
      </div>

      <div className="right">
        {/* if error, show error message // if project created, show message */}
        {showSuccessMessage && (
          <CustomMessage message="Project successfully created" color="green" />
        )}
        <div className="createproject">
          <h1>Create a project</h1>
          <form
            action=""
            // onSubmit={event => {
            //   createProjectHandler(event);
            // }}
            onSubmit={e => createProjectHandler(e)}
          >
            <input
              ref={projectNameInput}
              className="form-input"
              type="text"
              placeholder="Type project name here..."
            />
            <button className="mg-left-05 btn btn-primary" type="submit">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
