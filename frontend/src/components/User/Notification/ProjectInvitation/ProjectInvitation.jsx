import React, { useState, useContext } from "react";
import { useQuery, gql, useMutation, useSubscription } from "@apollo/client";
import "./ProjectInvitation.css";
import AuthContext from "../../../../context/auth-context";

const ProjectInvitation = props => {
  const [myProjectInvitations, setMyProjectInvitations] = useState([]);
  const context = useContext(AuthContext);
  const myProjectInvitationsQueryString = gql`
    {
      myProjectInvitations {
        _id
        project {
          name
        }
      }
    }
  `;

  const acceptProjectInvitationMutationString = gql`
    mutation accepProjectInvitation($projectInvitationId: ID) {
      acceptProjectInvitation(projectInvitationId: $projectInvitationId)
    }
  `;

  const deleteProjectInvitationMutationString = gql`
    mutation deleteProjectInvitation($projectInvitationId: ID) {
      deleteProjectInvitation(projectInvitationId: $projectInvitationId)
    }
  `;

  const userInvitedSubscriptionString = gql`
    subscription userInvited($userId: ID) {
      userInvited(userId: $userId) {
        _id
        project {
          name
        }
      }
    }
  `;

  const {
    data: myProjectInvitationsData,
    error: myProjectInvitationsError,
    loading: myProjectInvitationsLoading
  } = useQuery(myProjectInvitationsQueryString, {
    onCompleted({ myProjectInvitations }) {
      setMyProjectInvitations(myProjectInvitations);
    }
  });

  const [acceptProjectInvitation, acceptData] = useMutation(
    acceptProjectInvitationMutationString
  );

  const [deleteProjectInvitation, deleteData] = useMutation(
    deleteProjectInvitationMutationString
  );

  //Subscribe to Project Invitations for currently logged in User
  const {
    data: userInvitedData,
    error: userInvitedError,
    loading: userInvitedLoading
  } = useSubscription(userInvitedSubscriptionString, {
    variables: {
      userId: context.userId
    },
    onSubscriptionData({
      subscriptionData: {
        data: { userInvited }
      }
    }) {
      setMyProjectInvitations([...myProjectInvitations, userInvited]);
      console.log(userInvited);
    }
  });

  //accept invitation on backend via graphql mutation
  const acceptProjectInvitationHandler = id => {
    acceptProjectInvitation({
      variables: {
        projectInvitationId: id
      }
    })
      .catch(err => console.log(err))
      .then(
        //remove the invitation from state so it doesnt get rendered anymore
        setMyProjectInvitations(
          myProjectInvitations.filter(invitation => invitation._id != id)
        )
      );
  };

  const deleteProjectInvitationHandler = id => {
    // decline invitation on graphql backend
    deleteProjectInvitation({
      variables: {
        projectInvitationId: id
      }
    })
      .catch(err => console.log(err))
      .then(() =>
        // remove declined invitation from ui / state
        setMyProjectInvitations(
          myProjectInvitations.filter(invitation => invitation._id != id)
        )
      );
  };

  let invitationComponents = myProjectInvitations.map(invitation => {
    return (
      <div key={invitation._id} className="project-invitation">
        <div className="flex">
          <i className="fas fa-users mg-right-05"></i>
          <p>{invitation.project.name}</p>
        </div>
        <div className="project-invitation-buttons">
          <i
            onClick={() => {
              acceptProjectInvitationHandler(invitation._id);
            }}
            className="fas fa-check-square primary mg-right-1"
          ></i>
          <i
            onClick={() => deleteProjectInvitationHandler(invitation._id)}
            className="fas fa-times danger"
          ></i>
        </div>
      </div>
    );
  });
  // need query and need subscription
  return <div>{invitationComponents}</div>;
};

export default ProjectInvitation;
