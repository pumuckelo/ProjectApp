import React from 'react'
import './Project.css'
const Project = (props) =>{

//graphql query to get infos about project with the id you get from props.projectid
    // then create array of todolists

    return (
        <div className='project'>
            <h1>{props.title}</h1>

        </div>
    )
}


export default  Project