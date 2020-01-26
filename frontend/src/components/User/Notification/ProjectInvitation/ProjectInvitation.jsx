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

  const declineProjectInvitationMutationString = gql`
    mutation declineProjectInvitation($projectInvitationId: ID) {
      declineProjectInvitation(projectInvitationId: $projectInvitationId)
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

  const [declineProjectInvitation, declineData] = useMutation(
    declineProjectInvitationMutationString
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

  const declineProjectInvitationHandler = id => {
    // decline invitation on graphql backend
    declineProjectInvitation({
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
        <p>{invitation.project.name}</p>
        <div className="project-invitation-buttons">
          <i
            onClick={() => {
              acceptProjectInvitationHandler(invitation._id);
            }}
            class="fas fa-check-square primary mg-right-1"
          ></i>
          <i
            onClick={() => declineProjectInvitationHandler(invitation._id)}
            class="fas fa-times danger"
          ></i>
        </div>
      </div>
    );
  });
  // need query and need subscription
  return (
    <div>
      <h5>Project Invitations</h5>
      {invitationComponents}
    </div>
  );
};

export default ProjectInvitation;
