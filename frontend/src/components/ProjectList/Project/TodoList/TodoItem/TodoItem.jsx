import React from 'react'
import './TodoItem.css'

const TodoItem = (props)=>{


    return (
        <div className='todoitem'>
            <p>{props.title}</p>
        </div>

    )

}

export default TodoItem