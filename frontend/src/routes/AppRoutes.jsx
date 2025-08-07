import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ForgetPasswordFlow from "../pages/ForgetPassowrd/ForgetPasswordFlow.jsx";
import RegisterScreen from "../pages/Registration/RegisterScreen.jsx";
import ProductCatalog from "../pages/CatalogList/ProductCatalog.jsx";
import VerifyScreen from "../pages/Registration/VerifyScreen.jsx"; // ✅ Import VerifyScreen
import Login from "../pages/Login/Login.jsx";
import Test from "../components/Test.jsx";
import Cart from "../pages/Cart/Cart.jsx";
import MainLayout from "../MainLayout.jsx";
import AdminPromotionsPanel from "../pages/AdminPanel/AdminPromotionsPanel.jsx"; // ✅ Import Admin Panel
import ProductDetail from "../pages/ProductDetails/ProductDetails.jsx";
import Wishlist from "../pages/Wishlist/Wishlist.jsx";
import PayHerePaymentForm from "../components/PayHere/PayHerePaymentForm.jsx";
import PaymentReturn from "../components/PayHere/PaymentReturn.jsx";
import PaymentCancel from "../components/PayHere/PaymentCancel.jsx";
import PaymentStatusPage from "../components/PayHere/PaymentStatusPage.jsx";
import AdminBookUpload from "../pages/AdminPanel/AdminBookUpload.jsx";
import UserProfile from "../pages/UserProfile/UserProfile.jsx";
import AdminProductPage from "../pages/AdminPanel/AdminProductPage.jsx";
import AdminDashboard from "../pages/AdminPanel/AdminDashboard.jsx";
import OrderManagementDashboard from "../pages/AdminPanel/OrderManagementDashboard.jsx";
import OrderHistory from "../pages/Customer/OrderHistory.jsx";

import CustomerBooklistPanel from "../pages/Booklist/CustomerBooklistPanel.jsx";
import AdminBooklistPanel from "../pages/Booklist/AdminBooklistPanel.jsx";
import ManualSalesPage from "../pages/ManualSales/ManualSalesPage.jsx";
import AdminUserManagement from "../pages/AdminPanel/AdminUserManagement.jsx";
import PreOrdersPage from "../pages/PreOrders/PreOrdersPage.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Error403 from "../pages/Error/Error403.jsx";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/forget-password" element={<ForgetPasswordFlow />} />
                <Route path="/verify" element={<VerifyScreen />} />
                <Route path="/403" element={<Error403 />} />

                {/* Layout Routes */}
                <Route element={<MainLayout />}>
                    {/* Customer routes (open access) */}
                    <Route path="/products" element={<ProductCatalog />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<PayHerePaymentForm />} />
                    <Route path="/status" element={<PaymentStatusPage />} />
                    <Route path="/cancel" element={<PaymentCancel />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/booklist" element={<CustomerBooklistPanel />} />
                    <Route path="/preorders" element={<PreOrdersPage />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/test" element={<Test />} />

                    {/* Protected Admin routes */}
                    <Route element={<ProtectedRoute requiredRole="[ADMIN]" />}>
                        <Route path="/upload/books" element={<AdminBookUpload />} />
                        <Route path="/edit-product" element={<AdminProductPage />} />
                        <Route path="/promotions" element={<AdminPromotionsPanel />} />
                        <Route path="/manual-sales" element={<ManualSalesPage />} />
                        <Route path="/admin/profile" element={<UserProfile />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/booklist" element={<AdminBooklistPanel />} />
                        <Route path="/admin/users" element={<AdminUserManagement />} />
                        <Route path="/admin/orders" element={<OrderManagementDashboard />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;

