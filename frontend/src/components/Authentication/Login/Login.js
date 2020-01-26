import React, { useRef, Fragment, useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Login.css";
import { Redirect } from "react-router-dom";

import { gql, useMutation } from "@apollo/client";
import AuthContext from "../../../context/auth-context";

const loginMutationString = gql`
  mutation loginUser($username_or_email: String, $password: String) {
    loginUser(username_or_email: $username_or_email, password: $password)
  }
`;

const Login = props => {
  const [loginUser, { loading, error, data }] = useMutation(
    loginMutationString
  );
  const emailUsernameInput = useRef("");
  const passwordInput = useRef("");
  const authData = useContext(AuthContext);

  //   if user is logged in redirect to homepage
  if (authData.userId) {
    return <Redirect to="/" />;
  }
  //   loginUser(username_or_email: String, password: String)
  const loginHandler = event => {
    event.preventDefault();
    let emailOrUsername = emailUsernameInput.current.value;
    let password = passwordInput.current.value;

    //graphql user function and then set auth data to state
    loginUser({
      variables: {
        username_or_email: emailOrUsername,
        password: password
      }
    })
      .then(() => {
        //IMPORT COOKies to authcontext so username and userid is globally availaible
        authData.importCookiesToAuthContext();
        return <Redirect to="/" />;
      })
      .catch(err => {
        console.log(err);
      });
    //Reset form inputs
    emailUsernameInput.current.value = "";
    passwordInput.current.value = "";
  };

  //redirect if gets data
  if (data) {
  }
  if (error) {
    console.log(error);
  }

  return (
    <div className="login-window">
      <h1>Login</h1>
      {error && <p>{error.message}</p>}
      <label htmlFor="email">E-Mail or Username</label>
      <form onSubmit={event => loginHandler(event)} action="">
        <input
          required
          className="form-input"
          type="text"
          placeholder="E-Mail or Username"
          ref={emailUsernameInput}
        />
        <label htmlFor="password">Password</label>
        <input
          required
          ref={passwordInput}
          className="form-input"
          type="password"
          placeholder="Password"
        />
        <div className="buttons">
          {loading ? (
            "..Loggin in"
          ) : (
            <Fragment>
              <NavLink to="/register">
                <button type="button" className="mg-left-1 btn btn-secondary">
                  Need an Account?
                </button>
              </NavLink>
              <button type="submit" className="btn btn-primary mg-left-1">
                Login
              </button>
            </Fragment>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
