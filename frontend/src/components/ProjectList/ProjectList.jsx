import React, {Fragment, useState} from "react";
import './ProjectList.css'
import Project from "./Project/Project";
import {NavLink} from 'react-router-dom'

const ProjectList = (props) => {

    const [projectList, setProjectList] = useState(['TodoApp', 'Zeiterfassungsapp'])

    const projectsLinks = projectList.map(project => {
        return <NavLink to='#'>{project}</NavLink>
    })
    return (
        <div className='projectlist'>
            <i onClick={props.close} className="fas fa-long-arrow-alt-left fa-lg"></i>
            <h2>My Projects</h2>

           
            {projectsLinks}
        </div>
    )
};


export default ProjectList