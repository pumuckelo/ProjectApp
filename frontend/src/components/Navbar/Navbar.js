import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = props => {
  return (
    <nav>
      <div className="brand">Project App</div>
      <div className="auth">
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
