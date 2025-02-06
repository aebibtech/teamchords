import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { router } from "./router.jsx";
import { RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { ProfileContextProvider } from "./context/ProfileContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <AuthContextProvider>
        <ProfileContextProvider>
          <RouterProvider router={router} />
        </ProfileContextProvider>
      </AuthContextProvider>
    </>
  </StrictMode>
);
