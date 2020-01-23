import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import AuthContext from "../../context/auth-context";
import Logout from "../Authentication/Logout/Logout";
import Notification from "../User/Notification/Notification";

const Navbar = props => {
  const context = useContext(AuthContext);

  return (
    <nav>
      <div className="brand">Project App</div>
      <p>{context.username}</p>
      {context.userId && <Notification />}
      <div className="auth">
        {!context.userId && <NavLink to="/login">Login</NavLink>}
        {!context.userId && <NavLink to="/register">Register</NavLink>}

        {context.userId && <Logout />}
      </div>
    </nav>
  );
};

export default Navbar;
