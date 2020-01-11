import React, { useState } from "react";

import "./Home.css";

const Home = props => {
  return (
    <div className="gridbox">
      <div className="left">
        <div className="projects">
          <h1>Projects</h1>
          <p>Project App</p>
          <p>Schiff bauen</p>
        </div>
      </div>

      <div className="right">
        <h1>Create a project</h1>
      </div>
    </div>
  );
};

export default Home;
