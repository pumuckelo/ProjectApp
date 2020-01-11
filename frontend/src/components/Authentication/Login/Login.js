import React, { useRef, Fragment, useContext } from "react";
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
  if (authData.userId != null) {
    return <Redirect to="/" />;
  }
  //   loginUser(username_or_email: String, password: String)
  const loginHandler = event => {
    event.preventDefault();
    let emailOrUsername = emailUsernameInput.current.value;
    let password = passwordInput.current.value;
    console.log(emailOrUsername);
    console.log(password);
    //graphql user function and then set auth data to state
    loginUser({
      variables: {
        username_or_email: emailOrUsername,
        password: password
      }
    }).then(() => {
      console.log("now trying to importcookies");
      authData.importCookiesToAuthContext();
      return <Redirect to="/" />;
    });
    //Reset form inputs
    emailUsernameInput.current.value = "";
    passwordInput.current.value = "";
  };

  //redirect if gets data
  if (data) {
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
              <button type="button" className="mg-left-1 btn btn-secondary">
                Register
              </button>
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
