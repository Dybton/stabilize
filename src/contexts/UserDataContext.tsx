import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { AuthContext, UserData } from "./AuthContext";
import { supabase } from "../api/supabaseClient";

type Meal = {
  id: number;
  time: string;
  description: string;
  uid: string;
};

type Activity = {
  id: number;
  date: string;
  type: string;
  duration: number;
  uid: string;
};

type Sleep = {
  id: number;
  date: string;
  duration: number;
  quality: string;
  uid: string;
};

type UserDataContextType = {
  meals: Meal[];
  activities: Activity[];
  sleep: Sleep[];
  refreshMeals: (session: UserData) => Promise<void>;
  refreshActivities: (session: UserData) => Promise<void>;
  refreshSleepData: (session: UserData) => Promise<void>;
};

export const UserDataContext = createContext<UserDataContextType>({
  meals: [],
  activities: [],
  sleep: [],
  refreshMeals: async () => {},
  refreshActivities: async () => {},
  refreshSleepData: async () => {},
});

type UserDataProviderProps = {
  children: React.ReactNode;
};

export const UserDataProvider = ({ children }: UserDataProviderProps) => {
  const { userSession } = useContext(AuthContext);

  const [meals, setMeals] = useState<Meal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sleep, setSleep] = useState<Sleep[]>([]);

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const fetchMealData = async (session: UserData) => {
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .gte("time", startOfDay)
      .lte("time", new Date())
      .match({ uid: session.id });

    console.log("Meal data: ", data);
    if (error) {
      console.log("Error fetching meal data: ", error);
      return;
    } else {
      setMeals(data);
    }
  };

  const fetchActivityData = async (session: UserData) => {
    console.log("userSession here is ", session);
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .gte("time", startOfDay)
      .lte("time", new Date())
      .match({ uid: session.id });
    console.log("Activity data: ", data);
    if (error) {
      console.log("Error fetching activity data: ", error);
      return;
    } else {
      setActivities(data);
    }
  };

  const fetchSleepData = async (session: UserData) => {
    console.log("userSession here is ", session);
    const cufoffStart = new Date();
    cufoffStart.setDate(cufoffStart.getDate() - 1);
    cufoffStart.setHours(18, 0, 0, 0);

    const cutOffEnd = new Date();
    cutOffEnd.setHours(18, 0, 0, 0);

    const { data, error } = await supabase
      .from("sleep")
      .select("*")
      .gte("time", cufoffStart)
      .lte("time", cutOffEnd)
      .match({ uid: session.id });

    console.log("Sleep data: ", data);

    if (error) {
      return error;
    } else {
      setSleep(data);
    }
  };

  useEffect(() => {
    if (!userSession) {
      return;
    }
    fetchSleepData(userSession);
    fetchMealData(userSession);
    fetchActivityData(userSession);
  }, [userSession]);

  const refreshMeals = useCallback(async (session: UserData) => {
    await fetchMealData(session);
  }, []);
  const refreshActivities = useCallback(async (session: UserData) => {
    await fetchActivityData(session);
  }, []);
  const refreshSleepData = useCallback(async (session: UserData) => {
    await fetchSleepData(session);
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        meals,
        activities,
        sleep,
        refreshMeals,
        refreshActivities,
        refreshSleepData,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
