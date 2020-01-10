import React from "react";

const AuthContext = React.createContext({
  username: null,
  userId: null,
  importCookiesToAuthContext: () => {},
  logout: () => {}
});

export default AuthContext;
