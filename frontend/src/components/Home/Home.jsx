import React, { useState, useRef } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";

import "./Home.css";
import Project from "../ProjectList/Project/Project";
import CustomMessage from "../Utils/ErrorMessage/CustomMessage";

const createProjectMutation = gql`
  mutation createProject($name: String) {
    createProject(name: $name)
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

const Home = props => {
  //graphql function to create project
  const [
    createProject,
    {
      error: createProjectError,
      loading: createProjectLoading,
      data: createProjectData
    }
  ] = useMutation(createProjectMutation);

  const projectNameInput = useRef();
  const {
    error: myProjectsError,
    loading: myProjectsLoading,
    data: myProjectsData
  } = useQuery(myProjectsQuery);

  //STATES

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  let myProjects;
  if (myProjectsData) {
    myProjects = myProjectsData.myProjects.map(project => {
      return (
        <div key={project._id} className="projectCard">
          <p>{project.name}</p>
        </div>
      );
    });
  }

  const createProjectHandler = event => {
    event.preventDefault();
    let projectName = projectNameInput.current.value;
    createProject({ variables: { name: projectName } }).then(() => {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    });
    projectNameInput.current.value = "";
  };

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
            onSubmit={event => {
              createProjectHandler(event);
            }}
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
