import React, { useState, useEffect } from "react";
import "./App.css";
import ProjectList from "./components/ProjectList/ProjectList";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Project from "./components/ProjectList/Project/Project";
import Home from "./components/Home/Home";
import AuthContext from "./context/auth-context";
import Cookies from "js-cookie";

import { InMemoryCache, ApolloClient, ApolloProvider } from "@apollo/client";

import { WebSocketLink } from "apollo-link-ws";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { getMainDefinition } from "apollo-utilities";

import Login from "./components/Authentication/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Register from "./components/Authentication/Register/Register";
import Landing from "./components/Landing/Landing";

const httpLink = new HttpLink({
  uri: "http://localhost:12000/graphql",
  credentials: "include"
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:12000/graphql",
  options: {
    reconnect: true
  }
});

//split link so it sends subscriptions to subscription link and http operations
// to the http link

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const gqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
});

function App() {
  useEffect(() => {
    importCookiesToAuthContext();
  }, []);

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
    console.log(authData.userId);
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
          <Navbar />
          <Switch>
            {/* {!authData.userId && (
              <Route exact path="/login" component={Login} />
            )} */}
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            {!authData.userId && <Route exact path="/" component={Landing} />}
            {authData.userId && <Route exact path="/" component={Home} />}
            {authData.userId && (
              <Route exact path="/projects" component={ProjectList} />
            )}
            {authData.userId && (
              <Route exact path="/projects/:projectid" component={Project} />
            )}
          </Switch>
        </Router>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;
