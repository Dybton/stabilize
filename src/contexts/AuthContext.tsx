import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../api/supabaseClient";

export type UserData = {
  email: string;
  id: string;
};

type AuthContextType = {
  userSession: UserData;
  loadingSession: boolean;
};

const defaultState: AuthContextType = {
  userSession: null,
  loadingSession: true,
};

export const AuthContext = createContext(defaultState);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userSession, setUserSession] = useState<UserData | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

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
      setLoadingSession(false);
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
    <AuthContext.Provider value={{ userSession, loadingSession }}>
      {children}
    </AuthContext.Provider>
  );
};
