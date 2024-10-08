import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import ForgotPassword from "../user-forms/ForgotPassword";
import Login from "../user-forms/Login";
import ResetPassword from "../user-forms/ResetPassword";
import Verify from "../user-forms/Verify";
import { AuthContext } from "../../context/AuthContext";
import Dashboard from "../dashboard/Dashboard";
import { Box } from "@mui/material";
import LoginOTPVarify from "../user-forms/LoginOTPVarify";
import ForgotPassword from "../user-forms/ForgotPassword";
import UserList from "../users/UserList";
import UserManagement from "../users/UserManagement";

// import NoMatch from "../NoMatch";
// import Dialog from "@mui/material/Dialog";
// import DialogContent from "@mui/material/DialogContent";
// import PulseLoader from "react-spinners/PulseLoader";
// import Country from "../country/Country";

function PrivateRoute({ children }) {
  const { ifixit_admin_panel } = useContext(AuthContext);
  // console.log("ifixit_admin_panel?.data?.token", ifixit_admin_panel);
  return ifixit_admin_panel?.token ? children : <Navigate to="/" />;
}
function RedirectToHome({ children }) {
  const { ifixit_admin_panel } = useContext(AuthContext);

  return !ifixit_admin_panel?.token ? children : <Navigate to="/dashboard" />;
}
const Navigation = ({ notificationCartName }) => {
  const { ifixit_admin_panel } = useContext(AuthContext);

  return (
    <Box>
      <Routes>
        {/* <Route path="/" element={<Projects />} />
        <Route path="project-details/:id" element={<ProjectDetails />} /> */}
        <Route
          path="/"
          element={
            <RedirectToHome>
              <Login />
            </RedirectToHome>
          }
        />
        <Route
          path="otp"
          element={
            // <PrivateRoute>
            <LoginOTPVarify />
            // </PrivateRoute>
          }
        />

        {/* <Route
          path="verify"
          element={
            <RedirectToHome>
              <Verify />
            </RedirectToHome>
          }
        /> */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="user-list"
          element={
            <PrivateRoute>
              <UserList />
            </PrivateRoute>
          }
        />
        <Route
          path="user-management"
          element={
            <PrivateRoute>
              <UserManagement />
            </PrivateRoute>
          }
        />

        <Route path="forgot-password" element={<ForgotPassword />} />

        <Route
          path="reset-password"
          element={
            // <PrivateRoute>
            <ResetPassword />
            // </PrivateRoute>
          }
        />

        {/* <Route
          path="*"
          element={!ifixit_admin_panel.token ? <Navigate to="/" /> : <NoMatch />}
        /> */}
      </Routes>
    </Box>
  );
};

export default Navigation;
