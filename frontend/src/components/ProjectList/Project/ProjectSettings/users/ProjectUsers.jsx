import React, { useRef, useState } from "react";
import "./ProjectUsers.css";
import Member from "./Member/Member";
import { useMutation, gql, useQuery } from "@apollo/client";

const ProjectUsers = props => {
  const { members, owners, projectId } = props;
  const [projectInvitations, setProjectInvitations] = useState([]);
  const addUserInput = useRef("");
  const createProjectInvitationMutationString = gql`
    mutation createProjectInvitation($projectId: String, $username: String) {
      createProjectInvitation(projectId: $projectId, username: $username) {
        project
        invitedUser
        _id
      }
    }
  `;

  const getProjectInvitationsQueryString = gql`
    {
      getProjectInvitations(projectId: "${projectId}"){
        _id
        invitedUser {
          name
        }
      }
    }
  `;

  const {
    data: getProjectInvitationsData,
    error: getProjectInvitationsError,
    loading: getProjectInvitationsLoading
  } = useQuery(getProjectInvitationsQueryString, {
    onCompleted(data) {
      console.log("getProjectInvitations");
      console.log(data);
    }
  });

  const [
    createProjectInvitation,
    {
      data: createProjectInvitationData,
      error: createProjectInvitationError,
      loading: createProjectInvitationLoading
    }
  ] = useMutation(createProjectInvitationMutationString);

  if (createProjectInvitationError) {
    return createProjectInvitationError.message;
  }

  let membersComponents = members.map(member => {
    return <Member _id={member._id} username={member.username} />;
  });

  let ownersComponents = owners.map(owner => {
    return <Member _id={owner._id} username={owner.username} />;
  });

  const addUserHandler = e => {
    e.preventDefault();

    console.log(
      `PROJECTINVITATION: ${projectId}, ${addUserInput.current.value}`
    );
    if (addUserInput.current.value != "") {
      createProjectInvitation({
        variables: {
          projectId: projectId,
          username: addUserInput.current.value
        }
      })
        .then(() => {
          console.log("User invited .then");
          addUserInput.current.value = "";
        })
        .catch(err => console.log(err.message));
    }
  };

  return (
    <div className="users">
      <div className="members">
        <h4>Members</h4>

        <form onSubmit={e => addUserHandler(e)} className="add-user" action="">
          <input
            ref={addUserInput}
            className="form-input"
            type="text"
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
      <div className="pending-invites">
        <h4>Pending invites</h4>
      </div>
    </div>
  );
};

export default ProjectUsers;
