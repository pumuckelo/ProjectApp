import React, { createRef, Fragment } from "react";
import { NavLink, Redirect } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import "./Register.css";
const Register = props => {
  const usernameInput = createRef("");
  const emailInput = createRef("");
  const passwordInput = createRef("");
  const registerUserMutationString = gql`
    mutation registerUser(
      $username: String
      $email: String
      $password: String
    ) {
      registerUser(username: $username, email: $email, password: $password)
    }
  `;

  const [
    registerUser,
    {
      data: registerUserData,
      loading: registerUserLoading,
      error: registerUserError
    }
  ] = useMutation(registerUserMutationString);
  const registerUserHandler = event => {
    event.preventDefault();
    return registerUser({
      variables: {
        username: usernameInput.current.value,
        email: emailInput.current.value,
        password: passwordInput.current.value
      }
    })
      .then(() => {
        console.log("Created User");
        //redirect to login page
        return <Redirect to="/login" />;
      })
      .catch(err => console.log(err));
  };

  if (registerUserData) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="register-window">
      <h1>Register Account</h1>
      {registerUserError && <p>{registerUserError.message}</p>}
      <form onSubmit={event => registerUserHandler(event)} action="">
        <label htmlFor="Username">Username</label>
        <input
          name="username"
          required
          className="form-input"
          type="text"
          placeholder="Usermame"
          ref={usernameInput}
        />
        <label htmlFor="email">E-Mail</label>
        <input
          name="email"
          required
          className="form-input"
          type="text"
          placeholder="E-Mail"
          ref={emailInput}
        />
        <label htmlFor="password">Password</label>
        <input
          name="password"
          required
          ref={passwordInput}
          className="form-input"
          type="password"
          placeholder="Password"
        />
        <div className="buttons">
          {registerUserLoading ? (
            "...Creating Account"
          ) : (
            <Fragment>
              <NavLink to="/login">
                <button type="button" className="mg-left-1 btn btn-secondary">
                  Already have an Account?
                </button>{" "}
              </NavLink>

              <button type="submit" className="btn btn-primary mg-left-1">
                Register
              </button>
            </Fragment>
          )}
        </div>
      </form>
    </div>
  );
};

export default Register;
