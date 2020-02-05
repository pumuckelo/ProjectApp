import React, { useRef, useState, useEffect } from "react";
import "./ProjectUsers.css";
import Member from "./Member/Member";
import { useMutation, gql, useQuery, useSubscription } from "@apollo/client";
import { getDirectiveValues } from "graphql";
import PendingInvitation from "./PendingInvitation/PendingInvitation";
import { useProjectData } from "../../Project";

const ProjectUsers = props => {
  //TODO Need to update cache if a new projectinvitation gets created because otherwise after closing projects settings and reloading it,
  // apollo reads the cache that was created as the project invitations got loaded the first time and thats without the new project invitation
  // maybe the cache of the project invitations could also just be cleared -- easier and less possible bugs

  //this should solve whats described above
  useEffect(() => {
    refetchProjectInvitations();
  }, []);

  let { owners, projectId } = props;
  const [projectInvitations, setProjectInvitations] = useState([]);
  const { members, removeMember } = useProjectData();
  const addUserInput = useRef("");
  const createProjectInvitationMutationString = gql`
    mutation createProjectInvitation($projectId: ID, $username: String) {
      createProjectInvitation(projectId: $projectId, username: $username) {
        project
        invitedUser
        _id
      }
    }
  `;
  const deleteProjectInvitationMutationString = gql`
    mutation deleteProjectInvitation($projectInvitationId: ID) {
      deleteProjectInvitation(projectInvitationId: $projectInvitationId)
    }
  `;

  const getProjectInvitationsQueryString = gql`
    {
      getProjectInvitations(projectId: "${projectId}"){
        _id
        invitedUser {
          username
        }
      }
    }
  `;

  const {
    data: getProjectInvitationsData,
    error: getProjectInvitationsError,
    loading: getProjectInvitationsLoading,
    refetch: refetchProjectInvitations
  } = useQuery(getProjectInvitationsQueryString, {
    onCompleted({ getProjectInvitations }) {
      setProjectInvitations(getProjectInvitations);
    }
  });

  const [deleteProjectInvitation, deleteProjectInvitationData] = useMutation(
    deleteProjectInvitationMutationString
  );

  const projectInvitationCreatedSubscriptionString = gql`
    subscription projectInvitationCreated($projectId: ID) {
      projectInvitationCreated(projectId: $projectId) {
        _id
        invitedUser {
          username
        }
      }
    }
  `;

  const projectInvitationCreatedData = useSubscription(
    projectInvitationCreatedSubscriptionString,
    {
      variables: {
        projectId: projectId
      },
      onSubscriptionData({
        subscriptionData: {
          data: { projectInvitationCreated }
        }
      }) {
        setProjectInvitations([
          ...projectInvitations,
          projectInvitationCreated
        ]);
        console.log(projectInvitationCreated);
      }
    }
  );

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

  const addUserHandler = e => {
    e.preventDefault();
    if (addUserInput.current.value != "") {
      createProjectInvitation({
        variables: {
          projectId: projectId,
          username: addUserInput.current.value
        }
      })
        .then(() => {
          addUserInput.current.value = "";
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  };

  const deleteProjectInvitationHandler = projectInvitationId => {
    deleteProjectInvitation({
      variables: {
        projectInvitationId: projectInvitationId
      }
    })
      .then(() => {
        setProjectInvitations(
          projectInvitations.filter(
            invitation => invitation._id != projectInvitationId
          )
        );
      })
      .catch(err => console.log(err));
  };

  let membersComponents = members.map(member => {
    return (
      <Member
        key={member._id}
        _id={member._id}
        username={member.username}
        isOwner={false}
        removeMember={() => removeMember(member._id)}
      />
    );
  });

  let ownersComponents = owners.map(owner => {
    return (
      <Member
        key={owner._id}
        _id={owner._id}
        username={owner.username}
        isOwner={true}
      />
    );
  });

  let pendingInvites = projectInvitations.map(invitation => {
    return (
      <PendingInvitation
        deleteProjectInvitation={() =>
          deleteProjectInvitationHandler(invitation._id)
        }
        key={invitation._id}
        invitation={invitation}
      />
    );
  });

  return (
    <div className="users">
      <div className="members">
        <h4>Members</h4>

        <form onSubmit={e => addUserHandler(e)} className="add-user" action="">
          <input
            ref={addUserInput}
            className="form-input"
            type="text"
            placeholder="Username"
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
        {pendingInvites}
      </div>
    </div>
  );
};

export default ProjectUsers;
