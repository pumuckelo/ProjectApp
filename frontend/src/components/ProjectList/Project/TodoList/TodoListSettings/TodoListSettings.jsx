import React from "react";
import "./TodoListSettings.css";

const TodoListSettings = props => {
  return (
    <div className="todolistsettings_background">
      <div className="todolistsettings_modal">
        <form action="">
          <input
            type="text"
            value={props.listname}
            placeholder={props.listname}
          />
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default TodoListSettings;
