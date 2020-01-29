import React from "react";
import "./PendingInvitation.css";

const PendingInvitation = props => {
  const { invitation } = props;
  return (
    <div className="pending-invitation">
      <div className="user">
        <i className="fas fa-user-clock"></i>
        {invitation.invitedUser.username}
      </div>
      <i
        onClick={props.deleteProjectInvitation}
        className="fas fa-times danger"
      ></i>
    </div>
  );
};

export default PendingInvitation;
