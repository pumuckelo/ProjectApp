import React, { useRef, Fragment } from "react";
import "./Login.css";

import { gql, useMutation } from "@apollo/client";

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
  //   loginUser(username_or_email: String, password: String)
  const loginHandler = event => {
    event.preventDefault();
    let emailOrUsername = emailUsernameInput.current.value;
    let password = passwordInput.current.value;
    console.log(emailOrUsername);
    console.log(password);
    loginUser({
      variables: {
        username_or_email: emailOrUsername,
        password: password
      }
    });

    emailUsernameInput.current.value = "";
    passwordInput.current.value = "";
  };

  return (
    <div className="login-window">
      <h1>Login</h1>
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
