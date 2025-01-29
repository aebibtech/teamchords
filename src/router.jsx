import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import PrivateRoute from "./components/PrivateRoute";
import ChordLibrary from "./pages/ChordLibrary";
import SetList from "./pages/SetList";

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
    path: "/setlist",
    element: (
      <PrivateRoute>
        <SetList />
      </PrivateRoute>
    ),
  },
]);
