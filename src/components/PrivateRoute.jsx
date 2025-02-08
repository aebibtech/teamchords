import { UserAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import SidebarLayout from "./SidebarLayout";
import { UserProfile } from "../context/ProfileContext";
import { useEffect } from "react";
import { getProfile } from "../utils/common";
import { supabase } from "../supabaseClient";

const PrivateRoute = ({ children }) => {
  const { session } = UserAuth();
  const { profile, setUserProfile } = UserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const data = await getProfile(user.id);
        if (data) {
          setUserProfile(data);
        }
        else {
          navigate("/onboard");
        }
      }
    };

    if (session) {
      fetchProfile();
    }
  }, [session]);

  if (!session) {
    return <Navigate to="/signin" />;
  }

  return <SidebarLayout>{children}</SidebarLayout>;
};

export default PrivateRoute;
