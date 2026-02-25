import { createBrowserRouter, Navigate } from "react-router-dom";

import Error404 from "../pages/Error404/Error";
import Login from "../pages/Login/Login";
import Root from "./Root/Root";
import PrivateRoot from "./Root/PrivateRoot";
import Aroot from "./Root/Admin/Aroot";


import Home from "../pages/Dashboard/Home";
import SAroot from "./Root/Superadmin/Sroot"; 
import SuperAdminHome from "../pages/Superadmin/Home"; 

export const router = createBrowserRouter([
  // 1. Public / Login Route
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
    ],
  },

  // 2. Admin Dashboard Route
  {
    path: "dashboard",
    element: <Aroot />,
    errorElement: <Error404 />,
    children: [
      {
        path: "",
        element: (
          <PrivateRoot>
            <Navigate to="home" replace />
          </PrivateRoot>
        ),
      },
      {
        path: "home",
        element: <PrivateRoot><Home /></PrivateRoot>,
      },
    ],
  },

  // 3. NEW: Super Admin Route
  {
    path: "superadmin",
    element: <SAroot />, 
    errorElement: <Error404 />,
    children: [
      {
        path: "",
        element: (
          <PrivateRoot>
            <Navigate to="home" replace />
          </PrivateRoot>
        ),
      },
      {
        path: "home",
        element: (
          <PrivateRoot>
            <SuperAdminHome />
          </PrivateRoot>
        ),
      },
     
    ],
  },
]);