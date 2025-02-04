import { UserAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import SidebarLayout from "./SidebarLayout";
import { getProfile } from "../utils/common";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const { session, profile, setUserProfile } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (session && !profile) {
        const data = await getProfile(session.user.id);
        if (data) {
          setUserProfile(data);
        }
        else {
          navigate("/onboard");
        }
      }
    };
    fetchProfile();
  }, []);

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return <SidebarLayout>{session ? <>{children}</> : <Navigate to="/signin" />}</SidebarLayout>;
};

export default PrivateRoute;
