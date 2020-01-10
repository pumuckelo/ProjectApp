import React from "react";
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

  return (
    <div className="login-window">
      <h1>Login</h1>
      <label htmlFor="email">E-Mail or Username</label>
      <input
        className="form-input"
        type="text"
        placeholder="E-Mail or Username"
      />
      <label htmlFor="password">Password</label>
      <input className="form-input" type="password" placeholder="Password" />
      <div className="buttons">
        <button className="mg-left-1 btn btn-secondary">Register</button>
        <button className="btn btn-primary mg-left-1">Login</button>
      </div>
    </div>
  );
};

export default Login;
