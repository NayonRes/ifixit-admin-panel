import React, { createContext, useReducer, useEffect } from "react";

import authReducer from "./authReducer";

export const AuthContext = createContext();

export default function AuthContextProvider(props) {
  const [ifixit_admin_panel, dispatch] = useReducer(authReducer, {}, () => {
    const localData = localStorage.getItem("ifixit_admin_panel");
    return localData ? JSON.parse(localData) : {};
  });

  const login = async (data) => {
    dispatch({
      type: "LOGIN",
      payload: data,
    });
  };

  const logout = () => {
    console.log("logout--------------------------");
    dispatch({
      type: "LOGOUT",
      payload: {},
    });
  };

  useEffect(() => {
    localStorage.setItem(
      "ifixit_admin_panel",
      JSON.stringify(ifixit_admin_panel)
    );
  }, [login]);

  return (
    <AuthContext.Provider value={{ login, ifixit_admin_panel, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}
