import React from 'react'
import './Project.css'
import TodoList from "./TodoList/TodoList";
const Project = (props) =>{

//graphql query to get infos about project with the id you get from props.projectid
    // then create array of todolists

    return (
        <div className='project'>
            <h1>{props.title}</h1>
            <div className='todolists'>
            {/*Hier würden normalerweise die todolists von der datenbank hinkommen in einem array.map => todolist*/}
            <TodoList title='Erste Phase'/>
            <TodoList title='Zweite Phase'/>

            <button className='newList'>Neue Liste</button>
            </div>
        </div>
    )
}


export default  Project