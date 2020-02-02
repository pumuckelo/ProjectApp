import React, { useContext, createContext, useState } from "react";

const initialState = {
  projectInvitations: [],
  notifications: [],
  userId: "",
  username: ""
};

const UserDataContext = createContext();

export const UserDataProvider = props => {
  const [state, setState] = useState(initialState);

  const acceptProjectInvitation = id => {
    let newState = {
      ...state,
      projectInvitations: state.projectInvitations.filter(
        invitation => invitation._id != id
      )
    };
    setState(newState);
  };

  return (
    <UserDataContext.Provider
      value={{ state, fn: { acceptProjectInvitation } }}
    >
      {props.children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
