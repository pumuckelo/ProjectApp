import React from 'react'
import './TodoItem.css'

const TodoItem = (props) => {


    return (
        <div className={props.completed ? "todoitem completed" : "todoitem"}>
            <p onClick={props.toggleCompleted}>{props.title}</p>

            <i onClick={props.deleteTodo} className="fas fa-trash-alt"></i>
        </div>

    )

}

export default TodoItem