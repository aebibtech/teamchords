import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import SidebarLayout from "./SidebarLayout";
const PrivateRoute = ({ children }) => {
  const { session } = UserAuth();

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return <SidebarLayout>{session ? <>{children}</> : <Navigate to="/signin" />}</SidebarLayout>;
};

export default PrivateRoute;
