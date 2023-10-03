import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import SignUp from "./pages/sign-up/sign-up";
import Login from "./pages/login/login";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ForgotPassword from "./pages/forgot-password/forgot-password";
import ResetPassword from "./pages/reset-password/reset-password";
import SearchBar from "./pages/search-bar/search-bar";
import OTP from "./pages/otp/otp";
import Profile from "./pages/profile/profile";
import UserAdmin from "./pages/user-admin/user-admin";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <SearchBar />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/search-bar",
        element: <SearchBar />,
      },
      {
        path: "/otp",
        element: <OTP />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/user-admin",
        element: <UserAdmin />,
      },
    ],
  },
]);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
