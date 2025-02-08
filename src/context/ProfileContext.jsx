import { createContext, useContext, useState, useEffect, Suspense } from "react";
import { getProfile } from "../utils/common";
import { supabase } from "../supabaseClient";

const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const setUserProfile = (user) => {
    setProfile(user);
  }

  return <ProfileContext.Provider value={{ profile, setUserProfile }}><Suspense fallback={<div>Loading...</div>}>{children}</Suspense></ProfileContext.Provider>;
};

export const UserProfile = () => {
  return useContext(ProfileContext);
};