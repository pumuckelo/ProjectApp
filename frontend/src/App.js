import React, { useState, useEffect } from "react";
import "./App.css";
import ProjectList from "./components/ProjectList/ProjectList";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Project from "./components/ProjectList/Project/Project";
import Home from "./components/Home/Home";
import AuthContext from "./context/auth-context";
import Cookies from "js-cookie";

import {
  InMemoryCache,
  HttpLink,
  ApolloClient,
  ApolloProvider
} from "@apollo/client";
import Login from "./components/Authentication/Login/Login";
import Navbar from "./components/Navbar/Navbar";

const gqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:12000/graphql",
    credentials: "include"
  })
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
