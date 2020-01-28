import React from "react";
import "./Member.css";

const Member = props => {
  const { _id, username } = props;

  return (
    <div key={_id} className="member">
      <i className="fas fa-user"></i> <p>{username}</p>
    </div>
  );
};

export default Member;
