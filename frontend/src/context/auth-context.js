import React from "react";

//TODO all of this should be moved into userData so, the functions should also be defined in userData so App.js gets cleaned up
const AuthContext = React.createContext({
  username: null,
  userId: null,
  importCookiesToAuthContext: () => {},
  logout: () => {}
});

export default AuthContext;
