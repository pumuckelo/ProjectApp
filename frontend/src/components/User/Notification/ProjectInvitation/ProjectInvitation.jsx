import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";

const ProjectInvitation = props => {
  const [myProjectInvitations, setMyyProjectInvitations] = useState([]);
  const myProjectInvitationsQueryString = gql`
    {
      myProjectInvitations {
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
      console.log("myprojectinvitations");

      console.log(myProjectInvitations);
    }
  });
  // need query and need subscription
  return <div></div>;
};

export default ProjectInvitation;
