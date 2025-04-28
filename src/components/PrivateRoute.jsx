import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import SidebarLayout from "./SidebarLayout";
import { UserProfile } from "../context/ProfileContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getProfile } from "../utils/common";

const PrivateRoute = ({ children }) => {
  const { session } = UserAuth();
  const { profile, setUserProfile } = UserProfile();
  const navigate = useNavigate();

  const fetchProfile = async (data) => {
    const d = await getProfile(data?.user?.id);
    if (d) {
      setUserProfile(d);
      navigate("/library");
    }
    else {
      navigate("/onboard");
    }
  };

  useEffect(() => {
    if (session) {
      if (!profile) {
        fetchProfile(session);
      }
    }

    // Register service worker in production
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful');
          })
          .catch(err => {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }
  }, []);

  if (!session) {
    return <Navigate to="/signin" />;
  }

  return <SidebarLayout>{children}</SidebarLayout>;
};

export default PrivateRoute;
