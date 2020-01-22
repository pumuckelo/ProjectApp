import React from "react";
import "./ProjectUsers.css";
import Member from "./Member/Member";

const ProjectUsers = props => {
  const { members, owners } = props;

  let membersComponents = members.map(member => {
    return <Member _id={member._id} username={member.username} />;
  });

  let ownersComponents = owners.map(owner => {
    return <Member _id={owner._id} username={owner.username} />;
  });

  const addUserHandler = e => {
    e.preventDefault();
  };

  return (
    <div className="users">
      <div className="members">
        <h4>Members</h4>

        <form onSubmit={e => addUserHandler(e)} className="add-user" action="">
          <input
            className="form-input"
            type="email"
            placeholder="Add User by Username"
          />
          <button className="btn btn-primary mg-left-05">Add</button>
        </form>
        {membersComponents}
      </div>
      <div className="owners">
        <h4>Owners</h4>
        {ownersComponents}
      </div>
    </div>
  );
};

export default ProjectUsers;
