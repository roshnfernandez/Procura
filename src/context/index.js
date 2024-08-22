
import { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";

//Context
const MEMPS = createContext();
MEMPS.displayName = "MEMPSContext";

//Reducer Function
function reducer(state, action) {
  switch (action.type) {
    case "ROLE": {
      return { ...state, role: action.value };
    }
    case "USER": {
      return { ...state, user: action.value };
    }
    case "EQUIPMENT": {
      return { ...state, equipment: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// Context provider component
function MEMPSContextProvider({ children }) {
  const initialState = {
    role: sessionStorage.getItem("role") || "LOGIN",
    user: {userId: sessionStorage.getItem("userId")||"",username: sessionStorage.getItem("username") || "" },
    equipment: sessionStorage.getItem("equipment") || ""
  };
  //controller is the state
  //dispatch is the function that sends the action to the reducer
  //action is just a js object
  const [controller, dispatch] = useReducer(reducer, initialState);
  //Provider passes the value across all children component
  return <MEMPS.Provider value={[controller, dispatch]}>{children}</MEMPS.Provider>;
}

//Custom hook for using context
function useMEMPSContext() {

  //Context will have [controller,dispatch]
  const context = useContext(MEMPS);

  if (!context) {
    throw new Error(
      "useMEMPSContext should be used inside the MEMPSContextProvider."
    );
  }

  return context;
}

// Typechecking props for the MEMPS Context Provider
MEMPSContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Function that changes the role in context controller(state)
const setRole = (dispatch, value) => {sessionStorage.setItem("role",value); dispatch({ type: "ROLE", value: value })};
const setUser = (dispatch, value) => {sessionStorage.setItem("userId",value.userId); sessionStorage.setItem("username",value.username); dispatch({type: "USER", value: value})};
const setEquipment = (dispatch, value) => {sessionStorage.setItem("equipment",value);dispatch({type: "EQUIPMENT", value: value})};

export {
  MEMPSContextProvider,
  useMEMPSContext,
  setRole,
  setUser,
  setEquipment
};
