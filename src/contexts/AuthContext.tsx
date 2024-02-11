import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../api/supabaseClient";

type userData = {
  email: string;
  id: string;
};

type AuthContextType = {
  isLoggedin: boolean;
  user: any; // we should probably
};

const defaultState: AuthContextType = {
  isLoggedin: false,
  user: null,
};

export const AuthContext = createContext(defaultState);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [user, setUser] = useState<userData | null>(null);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  useEffect(() => {
    console.log("Checking if user is logged in");
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("User: ", user);
      if (!user.id) {
        console.log("No user found");
        return;
      }
      const formattedUser = {
        email: user.email,
        id: user.id,
      };
      setIsLoggedin(true);
      setUser(formattedUser);
    };
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedin, user }}>
      {children}
    </AuthContext.Provider>
  );
};
