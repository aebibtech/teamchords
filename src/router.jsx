import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import PrivateRoute from "./components/PrivateRoute";
import ChordLibrary from "./pages/ChordLibrary";
import SetLists from "./pages/SetLists";
import ChordProSheet from "./components/chordlibrary/ChordProSheet";
import SetListForm from "./components/setlist/SetListForm";
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
]);
