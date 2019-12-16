import React, {useRef, useState} from 'react'
import './TodoList.css'

import TodoItem from "./TodoItem/TodoItem";
const TodoList = (props)=>{

    const [todos, setTodos] = useState(['Struktur aufbauen und ganz viel anderes nur ein text hier diese saache nhhh', 'Design machen', 'backend struktur', 'datenbank struktur', 'Design machen', 'backend struktur', 'datenbank struktur'])
    const newTodoInput = useRef('')


   const newTodoSubmitHandler = (event) =>
       event.preventDefault()
        let newTodos = [...todos]
    console.log(newTodoInput.current.value)
       console.log('XDD')

    const todoItems = todos.map((todoitem, index)=>{
       return <TodoItem key={index} title={todoitem}/>
    })
    return (
        <div className='todolist'>
            <h2>{props.title}</h2>
            {todoItems}
            <form onSubmit={() => {newTodoSubmitHandler()}} action="">
                <input ref={newTodoInput} type="text" placeholder='New todo'/>
                <button type='submit'>+</button>
            </form>
        </div>
    )
}

export default TodoList