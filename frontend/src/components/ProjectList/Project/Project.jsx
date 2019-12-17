import React, {useState, useRef} from 'react'
import './Project.css'
import TodoList from "./TodoList/TodoList";

const Project = (props) => {

    const newListInput = useRef('')

    const [todoLists, setTodoLists] = useState(['Erste Phase', 'Zweite Phase'])

    const addNewTodoListHandler = (event) => {
        event.preventDefault()
        let updatedTodoLists = [...todoLists]
        updatedTodoLists.push(newListInput.current.value)
        setTodoLists(updatedTodoLists)
        newListInput.current.value = ''

    }

    const todoListsComponents = todoLists.map((todoList, index) => {
        return <TodoList title={todoList} key={index}/>
    })
//graphql query to get infos about project with the id you get from props.projectid
    // then create array of todolists

    return (
        <div className='project'>
            <div className='heading'>
            <h1>{props.title}</h1>

            </div>
            <div className='todolists'>
                {/*Hier würden normalerweise die todolists von der datenbank hinkommen in einem array.map => todolist*/}
                {todoListsComponents}

                <form onSubmit={(event) => {
                    addNewTodoListHandler(event)
                }} action="">
                    <div className='newListControl'>
                        <input ref={newListInput} type='text' placeholder="List Name"/>
                        <button className='newList'>New <i className="fas fa-clipboard-list"></i></button>
                    </div>
                </form>

            </div>
        </div>
    )
}


export default Project