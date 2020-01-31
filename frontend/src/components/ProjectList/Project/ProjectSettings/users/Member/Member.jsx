import React, { useState } from "react";
import "./Member.css";
import MemberDetails from "./MemberDetails/MemberDetails";
import { useMutation, gql } from "@apollo/client";
import { useProjectData } from "../../../Project";

const Member = props => {
  const { _id, username } = props;
  const [showDetails, setShowDetails] = useState(false);
  const { projectId } = useProjectData();
  const toggleShowDetailsHandler = () => {
    setShowDetails(!showDetails);
  };

  const removeMemberMutationString = gql`
    mutation removeMember($projectId: ID, $userId: ID) {
      removeMember(projectId: $projectId, userId: $userId)
    }
  `;

  const [removeMemberMutation, removeMemberMutationData] = useMutation(
    removeMemberMutationString
  );

  const removeMemberHandler = () => {
    removeMemberMutation({
      variables: {
        projectId: projectId,
        userId: _id
      }
    }).catch(err => console.log(err));
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
          removeMember={removeMemberHandler}
        />
      )}
    </div>
  );
};

export default Member;
