import React, { useContext, useState } from "react";
import { useMutation, gql, useApolloClient } from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import { Redirect } from "react-router-dom";

const Logout = props => {
  const context = useContext(AuthContext);
  const client = useApolloClient();

  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const logoutUserMutationString = gql`
    mutation logoutUser {
      logoutUser
    }
  `;

  const [logoutUser, { data, error, loading }] = useMutation(
    logoutUserMutationString
  );

  const logoutUserHandler = () => {
    setIsLoggedOut(true);
    logoutUser()
      .then(() => {
        context.importCookiesToAuthContext();
        client.cache.reset();
      })
      .catch(err => console.log(err));
  };

  if (isLoggedOut) {
    return <Redirect to="/" />;
  }

  return (
    <button onClick={() => logoutUserHandler()} className="btn btn-secondary">
      Logout
    </button>
  );
};

export default Logout;
