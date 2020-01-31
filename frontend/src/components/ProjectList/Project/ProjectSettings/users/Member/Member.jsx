import React, { useState } from "react";
import "./Member.css";
import MemberDetails from "./MemberDetails/MemberDetails";

const Member = props => {
  const { _id, username } = props;
  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetailsHandler = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div
      onClick={() => toggleShowDetailsHandler()}
      key={_id}
      className="member"
    >
      <i className="fas fa-user"></i> <p>{username}</p>
      {showDetails && (
        <MemberDetails
          isOwner={props.isOwner}
          toggleMemberDetails={() => toggleShowDetailsHandler()}
          removeUser={props.removeUser}
        />
      )}
    </div>
  );
};

export default Member;
