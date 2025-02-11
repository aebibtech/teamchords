import { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const setUserProfile = (user) => {
    setProfile(user);
  }

  return <ProfileContext.Provider value={{ profile, setUserProfile }}>{children}</ProfileContext.Provider>;
};

export const UserProfile = () => {
  return useContext(ProfileContext);
};