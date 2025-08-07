import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./components/Sidebar/AdminSidebar.jsx";
import CustomerSidebar from "./components/Sidebar/CustomerSidebar.jsx";
import Header from "./components/Header/Header.jsx";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

const MainLayout = () => {
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const hideHeaderRoutes = ["/", "/register", "/forget-password", "/verify"];

    const accessToken = localStorage.getItem("accessToken");
    let role = null;

    if (accessToken) {
        try {
            const decoded = jwtDecode(accessToken);
            role = decoded.role;
        } catch (err) {
            console.error("Error decoding token", err);
        }
    }

    const isAdminRoute = location.pathname.startsWith("/admin") || 
                        location.pathname === "/upload/books" ||
                        location.pathname === "/edit-product" ||
                        location.pathname === "/promotions" ||
                        location.pathname === "/manual-sales" ||
                        location.pathname === "/admin/profile";

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {!hideHeaderRoutes.includes(location.pathname) && (
                <>
                    <Header 
                        isSidebarCollapsed={isSidebarCollapsed}
                        onToggleSidebar={toggleSidebar}
                    />
                    {role === "[ADMIN]" && isAdminRoute ? (
                        <div className="flex pt-16">
                            <AdminSidebar 
                                isCollapsed={isSidebarCollapsed} 
                                onToggleCollapse={setIsSidebarCollapsed}
                            />
                            <div className={`flex-1 transition-all duration-300 ${
                                isSidebarCollapsed ? "ml-20" : "ml-64"
                            }`}>
                                <Outlet />
                            </div>
                        </div>
                    ) : (
                        <div className="flex pt-16">
                            <CustomerSidebar 
                                isCollapsed={isSidebarCollapsed} 
                                onToggleCollapse={setIsSidebarCollapsed}
                            />
                            <div className={`flex-1 transition-all duration-300 ${
                                isSidebarCollapsed ? "ml-20" : "ml-64"
                            }`}>
                                <Outlet />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MainLayout;
