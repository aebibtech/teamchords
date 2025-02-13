import { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const [profile, setProfile] = useState(JSON.parse(localStorage.getItem("profile")));

  const setUserProfile = (user) => {
    localStorage.setItem("profile", JSON.stringify(user));
    setProfile(user);
  }

  return <ProfileContext.Provider value={{ profile, setUserProfile }}>{children}</ProfileContext.Provider>;
};

export const UserProfile = () => {
  return useContext(ProfileContext);
};