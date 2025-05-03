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
import BranchList from "../branch/BranchList";
import CategoryList from "../category/CategoryList";
import CustomerList from "../customer/CustomerList";
import SupplierList from "../supplier/SupplierList";
import BrandList from "../brand/BrandList";
import DeviceList from "../device/DeviceList";
import DeviceBrandList from "../device/DeviceBrandList";
import ModelList from "../model/ModelList";
import VariantList from "../variant/VariantList";
import SparePartsList from "../spare-parts/SparePartsList";
import SparePartsDetails from "../spare-parts/SparePartsDetails";
import Repair from "../repair/Repair";
import AddRepair from "../repair/AddRepair";
import PurchaseList from "../purchase/PurchaseList";
import PurchaseDetails from "../purchase/PurchaseDetails";
import StockAlertList from "../stock-alert/StockAlertList";
import AllBranchStockList from "../stock-alert/AllBranchStockList";
import AddStockLimit from "../stock-alert/AddStockLimit";
import AddPurchaseReturn from "../purchase-return/AddPurchaseReturn";
import PurchaseReturnList from "../purchase-return/PurchaseReturnList";
import AddStockTransfer from "../stock-transfer/AddStockTransfer";
import StockTransferList from "../stock-transfer/StockTransferList";
import UpdateStockTransfer from "../stock-transfer/UpdateStockTransfer";
import DetailsStockTransfer from "../stock-transfer/DetailsStockTransfer";
import AddSpareParts from "../spare-parts/AddSpareParts";
import AddPurchase from "../purchase/AddPurchase";
import ServiceList from "../service/ServiceList";
import AddService from "../service/AddService";
import ServiceDetails from "../service/ServiceDetails";
import UpdateService from "../service/UpdateService";
import BranchStockList from "../stock-alert/BranchStockList";
import StockAdjustment from "../stock-adjustment/StockAdjustment";
import RepairDetails from "../repair/RepairDetails";
import Invoice from "../repair/Invoice";
import BlogList from "../blog/BlogList";
import AddBlog from "../blog/AddBlog";
import UpdateBlog from "../blog/UpdateBlog";
import Sale from "../sales/Sale";
import AddSales from "../sales/AddSales";

// import NoMatch from "../NoMatch";
// import Dialog from "@mui/material/Dialog";
// import DialogContent from "@mui/material/DialogContent";
// import PulseLoader from "react-spinners/PulseLoader";
// import Country from "../country/Country";

function PrivateRoute({ children }) {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
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
          path="branch-list"
          element={
            <PrivateRoute>
              <BranchList />
            </PrivateRoute>
          }
        />
        <Route
          path="brand-list"
          element={
            <PrivateRoute>
              <BrandList />
            </PrivateRoute>
          }
        />
        <Route
          path="category-list"
          element={
            <PrivateRoute>
              <CategoryList />
            </PrivateRoute>
          }
        />
        <Route
          path="device-brand-list"
          element={
            <PrivateRoute>
              <DeviceBrandList />
            </PrivateRoute>
          }
        />
        <Route
          path="device-list"
          element={
            <PrivateRoute>
              <DeviceList />
            </PrivateRoute>
          }
        />

        <Route
          path="model-list"
          element={
            <PrivateRoute>
              <ModelList />
            </PrivateRoute>
          }
        />
        <Route
          path="variant-list"
          element={
            <PrivateRoute>
              <VariantList />
            </PrivateRoute>
          }
        />
        <Route
          path="spare-parts-list"
          element={
            <PrivateRoute>
              <SparePartsList />
            </PrivateRoute>
          }
        />

        <Route
          path="add-spare-parts"
          element={
            <PrivateRoute>
              <AddSpareParts />
            </PrivateRoute>
          }
        />

        <Route
          path="blog-list"
          element={
            <PrivateRoute>
              <BlogList />
            </PrivateRoute>
          }
        />
        <Route
          path="add-blog"
          element={
            <PrivateRoute>
              <AddBlog />
            </PrivateRoute>
          }
        />
        <Route
          path="blog/update/:id"
          element={
            <PrivateRoute>
              <UpdateBlog />
            </PrivateRoute>
          }
        />
        <Route
          path="service-list"
          element={
            <PrivateRoute>
              <ServiceList />
            </PrivateRoute>
          }
        />
        <Route
          path="service/update/:id"
          element={
            <PrivateRoute>
              <UpdateService />
            </PrivateRoute>
          }
        />
        <Route
          path="service/details/:id"
          element={
            <PrivateRoute>
              <ServiceDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="add-service"
          element={
            <PrivateRoute>
              <AddService />
            </PrivateRoute>
          }
        />
        <Route
          path="stock-alert"
          element={
            <PrivateRoute>
              <StockAlertList />
            </PrivateRoute>
          }
        />
        <Route
          path="branch-stock"
          element={
            <PrivateRoute>
              <BranchStockList />
            </PrivateRoute>
          }
        />
        <Route
          path="all-branch-stock"
          element={
            <PrivateRoute>
              <AllBranchStockList />
            </PrivateRoute>
          }
        />
        <Route
          path="add-stock-alert"
          element={
            <PrivateRoute>
              <AddStockLimit />
            </PrivateRoute>
          }
        />
        <Route
          path="purchase-return-list"
          element={
            <PrivateRoute>
              <PurchaseReturnList />
            </PrivateRoute>
          }
        />
        <Route
          path="purchase-return"
          element={
            <PrivateRoute>
              <AddPurchaseReturn />
            </PrivateRoute>
          }
        />
        <Route
          path="stock-adjustment"
          element={
            <PrivateRoute>
              <StockAdjustment />
            </PrivateRoute>
          }
        />
        <Route
          path="add-stock-transfer"
          element={
            <PrivateRoute>
              <AddStockTransfer />
            </PrivateRoute>
          }
        />
        <Route
          path="stock-transfer/:id"
          element={
            <PrivateRoute>
              <UpdateStockTransfer />
            </PrivateRoute>
          }
        />
        <Route
          path="stock-transfer/details/:id"
          element={
            <PrivateRoute>
              <DetailsStockTransfer />
            </PrivateRoute>
          }
        />
        <Route
          path="stock-transfer-list"
          element={
            <PrivateRoute>
              <StockTransferList />
            </PrivateRoute>
          }
        />
        <Route
          path="spare-parts/:id"
          element={
            <PrivateRoute>
              <SparePartsDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="purchase/:id"
          element={
            <PrivateRoute>
              <PurchaseDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="customer"
          element={
            <PrivateRoute>
              <CustomerList />
            </PrivateRoute>
          }
        />
        <Route
          path="purchase-list"
          element={
            <PrivateRoute>
              <PurchaseList />
            </PrivateRoute>
          }
        />
        <Route
          path="add-purchase"
          element={
            <PrivateRoute>
              <AddPurchase />
            </PrivateRoute>
          }
        />
        <Route
          path="repair"
          element={
            <PrivateRoute>
              <Repair />
            </PrivateRoute>
          }
        />
        <Route
          path="add-repair"
          element={
            <PrivateRoute>
              <AddRepair />
            </PrivateRoute>
          }
        />
        <Route
          path="update-repair/:rid"
          element={
            <PrivateRoute>
              <AddRepair />
            </PrivateRoute>
          }
        />
        <Route
          path="repair/details/:rid"
          element={
            <PrivateRoute>
              <RepairDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="repair/invoice/:rid"
          element={
            <PrivateRoute>
              <Invoice />
            </PrivateRoute>
          }
        />
        <Route
          path="sales-list"
          element={
            <PrivateRoute>
              <Sale />
            </PrivateRoute>
          }
        />
        <Route
          path="add-sales"
          element={
            <PrivateRoute>
              <AddSales />
            </PrivateRoute>
          }
        />
        <Route
          path="update-sales/:rid"
          element={
            <PrivateRoute>
              <AddSales />
            </PrivateRoute>
          }
        />
        <Route
          path="sales/details/:rid"
          element={
            <PrivateRoute>
              <RepairDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="sales/invoice/:rid"
          element={
            <PrivateRoute>
              <Invoice />
            </PrivateRoute>
          }
        />
        <Route
          path="suppliers"
          element={
            <PrivateRoute>
              <SupplierList />
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
