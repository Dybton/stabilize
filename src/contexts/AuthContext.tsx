import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../api/supabaseClient";

export type UserData = {
  email: string;
  id: string;
};

type AuthContextType = {
  userSession: UserData;
};

const defaultState: AuthContextType = {
  userSession: null,
};

export const AuthContext = createContext(defaultState);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userSession, setUserSession] = useState<UserData | null>(null);

  const formatSession = (session: any) => {
    return {
      email: session.user.email,
      id: session.user.id,
    };
  };

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const formattedSession = formatSession(session);
        setUserSession(formattedSession);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const formattedSession = formatSession(session);

        setUserSession(formattedSession);
      } else {
        setUserSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ userSession }}>
      {children}
    </AuthContext.Provider>
  );
};
