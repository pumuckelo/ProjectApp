import React, { Fragment, useState } from "react";
import "./ProjectList.css";
import Project from "./Project/Project";
import { NavLink } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

const ProjectList = props => {
  const myProjectsQuery = gql`
    {
      myProjects {
        _id
        name
      }
    }
  `;

  const {
    data: myProjectsData,
    loading: myProjectsLoading,
    error: myProjectsError
  } = useQuery(myProjectsQuery, {
    onCompleted(data) {
      setProjectList(data.myProjects);
    }
  });

  const [projectList, setProjectList] = useState([]);

  const projectsLinks = projectList.map(project => {
    return <NavLink to={`/projects/${project._id}`}>{project.name}</NavLink>;
  });
  return (
    <div className="projectlist">
      <i onClick={props.close} className="fas fa-long-arrow-alt-left fa-lg"></i>
      <h2>My Projects</h2>

      {myProjectsError && "Error on loading Projects"}
      {projectsLinks}
    </div>
  );
};

export default ProjectList;
