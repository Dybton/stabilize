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
  description: string;
  time: string;
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
  const twoWeeksAgo = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const fetchMealData = async (session: UserData) => {
    const cutOffStart = new Date();
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .gte("time", twoWeeksAgo.toISOString())
      .lte("time", cutOffStart.toISOString())
      .match({ uid: session.id });
    if (error) {
      console.log("Error fetching meal data: ", error);
      return;
    } else {
      setMeals(data);
    }
  };

  const fetchActivityData = async (session: UserDate) => {
    const cutOffStart = new Date();
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .gte("time", twoWeeksAgo.toISOString())
      .lte("time", cutOffStart.toISOString())
      .match({ uid: session.id });
    if (error) {
      console.log("Error fetching activity data: ", error);
      return;
    } else {
      setActivities(data);
    }
  };

  const fetchSleepData = async (session: UserData) => {
    const cutOffStart = new Date();
    cutOffStart.setDate(cutOffStart.getDate() - 1);
    cutOffStart.setHours(18, 0, 0, 0);

    const cutOffEnd = new Date();
    cutOffEnd.setHours(18, 0, 0, 0);

    const { data, error } = await supabase
      .from("sleep")
      .select("*")
      .gte("time", cutOffStart.toISOString())
      .lte("time", cutOffEnd.toISOString())
      .match({ uid: session.id });

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
