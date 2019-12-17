import React, {useRef, useState} from 'react'
import './TodoList.css'

import TodoItem from "./TodoItem/TodoItem";

const TodoList = (props) => {

    const [todos, setTodos] = useState([])
    const newTodoInput = useRef('')

    /*{title: "App designen", completed: true}, {
            title: "App strukturieren",
            completed: false
        }, {title: "Datenbank planen", completed: false}, {title: "Backend planen", completed: false},*/
    const newTodoSubmitHandler = (event) => {
        event.preventDefault()
        let newTodos = [...todos]
        newTodos.push({title: newTodoInput.current.value, completed: false})
        setTodos(newTodos)
        newTodoInput.current.value = ''
    }

    const deleteTodoHandler = (index) => {
        let newTodos = [...todos]
        newTodos.splice(index, 1)
        console.log(index)
        console.log(newTodos)
        console.log("tried to delet")
        setTodos(newTodos)
    }

    const toggleTodoCompletedHandler = (index) => {
        let newTodos = [...todos]
        newTodos[index].completed = !newTodos[index].completed
        setTodos(newTodos)
    }


    const todoItems = todos.map((todoitem, index) => {
        return <TodoItem deleteTodo={() => {
            deleteTodoHandler(index)
        }} toggleCompleted={() => {
            toggleTodoCompletedHandler(index)
        }} key={index} title={todoitem.title} completed={todoitem.completed}/>
    })
    return (
        <div className='todolist'>
            <h2>{props.title}</h2>
            {todoItems}
            <form className='newTodoForm' onSubmit={(event) => {
                newTodoSubmitHandler(event)
            }} action="">
                <div className='newTodoForm-control'>
                    <input ref={newTodoInput} type="text" placeholder='New todo'/>
                    <button type='submit'>+</button>
                </div>
            </form>
        </div>
    )
}

export default TodoList