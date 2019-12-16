import React from 'react';
import Fragment from 'react'
import './App.css';
import ProjectList from "./components/ProjectList/ProjectList";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Project from "./components/ProjectList/Project/Project";


function App() {
  return (
      <Router>
          <Switch>
              <Route path={'/projects' } component={ProjectList} />
              <Route path='/projects/:projectid' component={Project} />
          </Switch>
      </Router>

  );
}

export default App;
