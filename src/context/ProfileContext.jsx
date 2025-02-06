import { createContext, useContext, useState, useEffect, Suspense } from "react";
import { getProfile } from "../utils/common";
import { supabase } from "../supabaseClient";

const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const [profile, setProfile] = useState(undefined);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const data = await getProfile(user.id);
      setProfile(data);
    };
    fetchProfile();
  }, []);

  return <ProfileContext.Provider value={{ profile }}><Suspense fallback={<div>Loading...</div>}>{children}</Suspense></ProfileContext.Provider>;
};

export const useProfile = () => {
  return useContext(ProfileContext);
};