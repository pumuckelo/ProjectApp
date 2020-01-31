import React, { createContext, useContext, useReducer } from "react";

const StoreContext = createContext();

const initialState = {
  members: [],
  owners: []
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "ADD_USER":
      return {
        ...state,
        members: [...state.members, payload]
      };

    case "ADD_OWNER":
      return {
        ...state,
        owners: [...state.owners, payload]
      };

    case "REMOVE_USER":
      return {
        ...state,
        members: state.members.filter(member => member != payload)
      };

    case "REMOVE_OWNER":
      return {
        ...state,
        owners: state.owners.filter(owner => owner != payload)
      };

    default:
      throw new Error(`Action Type: ${type} needs to be defined in store.js`);
  }
};

export const StoreProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {props.children}
    </StoreContext.Provider>
  );
};

// use it like this in reciever
// const [state, dispatch] = useStore()
export const useStore = () => {
  return useContext(StoreContext);
};
