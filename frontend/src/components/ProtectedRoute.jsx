import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ requiredRole }) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        return <Navigate to="/403" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role;

        if (userRole !== requiredRole) {
            return <Navigate to="/403" replace />;
        }

        return <Outlet />;
    } catch (err) {
        console.error("Invalid token", err);
        return <Navigate to="/403" replace />;
    }
};

export default ProtectedRoute;
