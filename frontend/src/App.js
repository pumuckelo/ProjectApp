import React, { useState } from "react";
import Fragment from "react";
import "./App.css";
import ProjectList from "./components/ProjectList/ProjectList";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Project from "./components/ProjectList/Project/Project";
import AuthContext from "./context/auth-context";
import Cookies from "js-cookie";

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
  const [authData, setAuthData] = useState({
    username: null,
    userId: null
  });

  const importCookiesToAuthContext = () => {
    setAuthData({
      userId: Cookies.get("userId"),
      username: Cookies.get("username")
    });
    console.log("clicked importcookies");
  };

  const logout = () => {};

  return (
    <ApolloProvider client={gqlClient}>
      <AuthContext.Provider
        value={{
          username: authData.username,
          userId: authData.userId,
          importCookiesToAuthContext: importCookiesToAuthContext,
          logout: logout
        }}
      >
        <Router>
          {/*<ProjectList/>*/}
          <Switch>
            {!authData.userId && (
              <Route exact path="/login" component={Login} />
            )}
            <Project title="SuperApp" />
            <Route exact path="/projects" component={ProjectList} />
            <Route exact path="/projects/:projectid" component={Project} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;
