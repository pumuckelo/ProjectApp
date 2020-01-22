import React from "react";
import "./ProjectSettings.css";
import ProjectUsers from "./users/ProjectUsers";

const ProjectSettings = props => {
  const { projectData } = props;

  return (
    <div className="project-settings">
      <i onClick={props.closeSettings} className="fas fa-window-close"></i>
      <div className="heading">{projectData.name}</div>
      <ProjectUsers members={projectData.members} owners={projectData.owners} />
    </div>
  );
};

export default ProjectSettings;
