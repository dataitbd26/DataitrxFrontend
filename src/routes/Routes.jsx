import { createBrowserRouter, Navigate } from "react-router-dom";

// Existing Roots & Pages
import Error404 from "../pages/Error404/Error";
import Login from "../pages/Login/Login";
import Root from "./Root/Root";
import PrivateRoot from "./Root/PrivateRoot";

// Admin Imports
import Aroot from "./Root/Admin/Aroot";
// import HomeA from "../pages/Dashboard/Home";
import Dashboard from "../pages/Admin/Dashboard";
import Prescriptions from "../pages/Admin/Prescriptions";
import Appointments from "../pages/Admin/Appointments";
import PreCheckup from "../pages/Admin/PreCheckup";
import DoctorPatient from "../pages/Admin/DoctorPatient";
import DoctorChamber from "../pages/Admin/DoctorChamber";
import Users from "../pages/Admin/Users";
import Profile from "../pages/Admin/Profile";
import Payment from "../pages/Admin/Payment";
import SendSms from "../pages/Admin/SendSms";
import ManagePermissions from "../pages/Admin/ManagePermissions";
import ManageEmail from "../pages/Admin/ManageEmail";
import ManageSms from "../pages/Admin/ManageSms";
import ManageSystem from "../pages/Admin/ManageSystem";
import Logout from "../pages/Admin/Logout";


import SAroot from "./Root/Superadmin/Sroot";
import SuperAdminHome from "../pages/Superadmin/Home";
import SADashboard from "../pages/Superadmin/Dashboard";
import MedicineList from "../pages/Superadmin/MedicineList";
import MedicineCompanies from "../pages/Superadmin/MedicineCompanies";
import TestList from "../pages/Superadmin/TestList";
import TestDepartments from "../pages/Superadmin/TestDepartments";
import ManageBranches from "../pages/Superadmin/ManageBranches";
import SAManageUsers from "../pages/Superadmin/ManageUsers";
import CreateAccountWizard from "../pages/Superadmin/CreateAccountWizard";
import ImportData from "../pages/Superadmin/ImportData";
import ExportData from "../pages/Superadmin/ExportData";
import LoginHistory from "../pages/Superadmin/LoginHistory";
import UserActivities from "../pages/Superadmin/UserActivities";
import SALogout from "../pages/Superadmin/Logout";

import Home from "../pages/Home";
import About from "../pages/About";
import Blog from "../pages/Blog";
import Contact from "../pages/Contact";
import Expertise from "../pages/Expertise";
import TermsOfUse from "../pages/TermsOfUse";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import CookiePolicy from "../pages/CookiePolicy";
import RefundPolicy from "../pages/RefundPolicy";

import SelectChamber from "../pages/SelectChamber";
import TodaysAppointments from "../pages/TodaysAppointments";
import BookingConfirmation from "../pages/BookingConfirmation";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/blog", element: <Blog /> },
      { path: "/contact", element: <Contact /> },
      { path: "/expertise", element: <Expertise /> },
      { path: "/terms-of-use", element: <TermsOfUse /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/cookie-policy", element: <CookiePolicy /> },
      { path: "/refund-policy", element: <RefundPolicy /> },
      { path: "/booking-confirmation", element: <BookingConfirmation /> },
      { path: "/select-chamber", element: <SelectChamber /> },
      { path: "/todays-appointments", element: <TodaysAppointments /> },
      { path: "/login", element: <Login />, },
    ],
  },

  // 2. Admin Routes Wrapped in Aroot Layout
  {
    element: <Aroot />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/dashboard",
        element: <PrivateRoot><Dashboard /></PrivateRoot>,
      },
      {
        path: "/prescriptions",
        element: <PrivateRoot><Prescriptions /></PrivateRoot>,
      },
      {
        path: "/appointments",
        element: <PrivateRoot><Appointments /></PrivateRoot>,
      },
      {
        path: "/pre-checkup",
        element: <PrivateRoot><PreCheckup /></PrivateRoot>,
      },
      {
        path: "/doctor-patient",
        element: <PrivateRoot><DoctorPatient /></PrivateRoot>,
      },
      {
        path: "/doctor-chamber",
        element: <PrivateRoot><DoctorChamber /></PrivateRoot>,
      },
      {
        path: "/users",
        element: <PrivateRoot><Users /></PrivateRoot>,
      },
      {
        path: "/profile",
        element: <PrivateRoot><Profile /></PrivateRoot>,
      },
      {
        path: "/payment",
        element: <PrivateRoot><Payment /></PrivateRoot>,
      },
      {
        path: "/send-sms",
        element: <PrivateRoot><SendSms /></PrivateRoot>,
      },
      {
        path: "/settings/permissions",
        element: <PrivateRoot><ManagePermissions /></PrivateRoot>,
      },
      {
        path: "/settings/email",
        element: <PrivateRoot><ManageEmail /></PrivateRoot>,
      },
      {
        path: "/settings/sms-config",
        element: <PrivateRoot><ManageSms /></PrivateRoot>,
      },
      {
        path: "/settings/system",
        element: <PrivateRoot><ManageSystem /></PrivateRoot>,
      },
      {
        path: "/logout",
        element: <PrivateRoot><Logout /></PrivateRoot>,
      },
    ],
  },

  // 3. Super Admin Routes Wrapped in SAroot Layout
  {
    element: <SAroot />,
    errorElement: <Error404 />,
    children: [
      // Legacy redirect/home from your previous setup
      {
        path: "/superadmin",
        element: <PrivateRoot><Navigate to="/super-admin/dashboard" replace /></PrivateRoot>,
      },
      {
        path: "/superadmin/home",
        element: <PrivateRoot><SuperAdminHome /></PrivateRoot>,
      },

      // New Super Admin Routes
      {
        path: "/super-admin/dashboard",
        element: <PrivateRoot><SADashboard /></PrivateRoot>,
      },
      {
        path: "/medicines/list",
        element: <PrivateRoot><MedicineList /></PrivateRoot>,
      },
      {
        path: "/medicines/companies",
        element: <PrivateRoot><MedicineCompanies /></PrivateRoot>,
      },
      {
        path: "/labtest/list",
        element: <PrivateRoot><TestList /></PrivateRoot>,
      },
      {
        path: "/labtest/departments",
        element: <PrivateRoot><TestDepartments /></PrivateRoot>,
      },
      {
        path: "/admin/branches",
        element: <PrivateRoot><ManageBranches /></PrivateRoot>,
      },
      {
        path: "/admin/users",
        element: <PrivateRoot><SAManageUsers /></PrivateRoot>,
      },
      {
        path: "/admin/create-account-wizard",
        element: <PrivateRoot><CreateAccountWizard /></PrivateRoot>,
      },
      {
        path: "/backup/import",
        element: <PrivateRoot><ImportData /></PrivateRoot>,
      },
      {
        path: "/backup/export",
        element: <PrivateRoot><ExportData /></PrivateRoot>,
      },
      {
        path: "/logs/login-history",
        element: <PrivateRoot><LoginHistory /></PrivateRoot>,
      },
      {
        path: "/logs/user-activities",
        element: <PrivateRoot><UserActivities /></PrivateRoot>,
      },

      {
        path: "/sa-logout",
        element: <PrivateRoot><SALogout /></PrivateRoot>,
      },
    ],
  },
]);