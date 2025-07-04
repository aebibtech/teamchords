import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import PrivateRoute from "./components/PrivateRoute";
import ChordLibrary from "./pages/ChordLibrary";
import SetLists from "./pages/SetLists";
import ChordProSheet from "./pages/ChordProSheet";
import SetListForm from "./pages/SetListForm";
import SetListView from "./pages/SetListView";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import NoSidebar from "./components/NoSidebar";
import InviteUser from "./components/InviteUser";
import UpdatePassword from "./pages/UpdatePassword";
import SetListLyricsView from "./pages/SetListLyricsView";
import AuthCallback from "./pages/AuthCallback";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
  {
    path: "/library",
    element: (
      <PrivateRoute>
        <ChordLibrary />
      </PrivateRoute>
    ),
  },
  {
    path: "/library/:id",
    element: (
      <PrivateRoute>
        <ChordProSheet />
      </PrivateRoute>
    ),
  },
  {
    path: "/setlists",
    element: (
      <PrivateRoute>
        <SetLists />
      </PrivateRoute>
    ),
  },
  {
    path: "/setlists/:id",
    element: (
      <PrivateRoute>
        <SetListForm />
      </PrivateRoute>
    ),
  },
  {
    path: "/setlists/share/:id",
    element: <SetListView />,
  },
  {
    path: "/setlists/lyrics/:id",
    element: <SetListLyricsView />,
  },
  {
    path: "/onboard",
    element: <NoSidebar><Onboarding /></NoSidebar>,
  },
  {
    path: "/profile",
    element: <PrivateRoute><Profile /></PrivateRoute>,
  },
  {
    path: "/invite",
    element: (
      <PrivateRoute>
        <InviteUser />
      </PrivateRoute>
    ),
  },
  {
    path: "/update-password",
    element: (
      <PrivateRoute>
        <UpdatePassword />
      </PrivateRoute>
    ),
  },
  {
    path: "/callback",
    element: <AuthCallback />
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />
  }
]);
