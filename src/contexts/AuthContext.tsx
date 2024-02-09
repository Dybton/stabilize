import React, { createContext, useState, useContext } from "react";

type AuthContextType = {
  isLogged: boolean;
  logIn: () => void;
  logOut: () => void;
};

const defaultState: AuthContextType = {
  isLogged: false,
  logIn: () => {},
  logOut: () => {},
};

export const AuthContext = createContext(defaultState);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLogged, setIsLogged] = useState(false);

  const logIn = () => {
    console.log("logging in");
    setIsLogged(true);
  };

  const logOut = () => {
    // needs to call supabase
    setIsLogged(false);
  };

  return (
    <AuthContext.Provider value={{ isLogged, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
