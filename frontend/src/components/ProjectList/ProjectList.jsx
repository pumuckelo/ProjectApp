
import React, {Fragment} from "react";
import './ProjectList.css'
import Project from "./Project/Project";
const ProjectList = () =>{



    return (
        <div className='projectlist'>
            <Project title='TodoApp'/>
            <Project title='ZeitErfassungsApp'/>
        </div>
    )
};


export default  ProjectList