import React from "react";
import Fragment from "react";
import "./App.css";
import ProjectList from "./components/ProjectList/ProjectList";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Project from "./components/ProjectList/Project/Project";

import {
  InMemoryCache,
  HttpLink,
  ApolloClient,
  ApolloProvider
} from "@apollo/client";
import Login from "./components/Authentication/Login/Login";

const gqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:12000/graphql",
    credentials: "include"
  })
});

function App() {
  return (
    <ApolloProvider client={gqlClient}>
      <Router>
        {/*<ProjectList/>*/}
        <Switch>
          <Route exact path="/login" component={Login} />
          <Project title="SuperApp" />
          <Route exact path="/projects" component={ProjectList} />
          <Route exact path="/projects/:projectid" component={Project} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
