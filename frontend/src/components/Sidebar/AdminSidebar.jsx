import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    UploadCloud,
    BookOpenCheck,
    ClipboardList,
    Tag,
    Users,
    ShoppingCart,
    BookOpen,
    LogOut,
    User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AdminSidebar = ({ isCollapsed, onToggleCollapse }) => {
    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        // Get user name from JWT token
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                setUserName(decoded.name || "Admin");
            } catch (error) {
                console.error("Error decoding token", error);
                setUserName("Admin");
            }
        }
    }, []);

    // Effect to handle hover state
    useEffect(() => {
        if (isHovered && isCollapsed) {
            onToggleCollapse(false);
        } else if (!isHovered && !isCollapsed) {
            onToggleCollapse(true);
        }
    }, [isHovered, isCollapsed, onToggleCollapse]);

    const menuItems = [
        {
            title: "Dashboard",
            icon: <LayoutDashboard size={20} />,
            path: "/admin/dashboard",
        },
        {
            title: "Upload Books",
            icon: <UploadCloud size={20} />,
            path: "/upload/books",
        },
        {
            title: "Products",
            icon: <BookOpenCheck size={20} />,
            path: "/edit-product",
        },
        {
            title: "Orders",
            icon: <ClipboardList size={20} />,
            path: "/admin/orders",
        },
        {
            title: "Promotions",
            icon: <Tag size={20} />,
            path: "/promotions",
        },
        {
            title: "Users",
            icon: <Users size={20} />,
            path: "/admin/users",
        },
        {
            title: "Manual Sales",
            icon: <ShoppingCart size={20} />,
            path: "/manual-sales",
        },
        {
            title: "Booklists",
            icon: <BookOpen size={20} />,
            path: "/admin/booklist",
        },
    ];

    return (
        <div
            className={`bg-[#5D4037] text-white h-screen fixed left-0 top-16 transition-all duration-300 ${
                isCollapsed ? "w-20" : "w-64"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* User Greeting */}
            <div className="h-20 flex items-center px-6 border-b border-[#8D6E63]">
                {!isCollapsed ? (
                    <div>
                        <h1 className="font-bold text-xl">Welcome,</h1>
                        <p className="text-[#D7CCC8] text-sm mt-1 truncate">{userName}</p>
                    </div>
                ) : (
                    <div className="flex justify-center w-full">
                        <User size={24} className="text-[#D7CCC8]" />
                    </div>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="mt-6 px-3">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-5 py-4 mb-3 transition-colors relative rounded-lg ${
                            location.pathname === item.path
                                ? "bg-[#8D6E63] text-white"
                                : "text-[#D7CCC8] hover:bg-[#8D6E63]"
                        } ${isCollapsed ? "justify-center px-4" : ""}`}
                    >
                        <span className={`${isCollapsed ? "flex justify-center" : ""}`}>{item.icon}</span>
                        {!isCollapsed && (
                            <span className="ml-4 text-sm font-medium">{item.title}</span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-0 w-full p-6">
                <button
                    onClick={() => {
                        localStorage.removeItem("accessToken");
                        window.location.href = "/";
                    }}
                    className={`flex items-center w-full px-4 py-3 text-[#D7CCC8] hover:bg-[#8D6E63] transition-colors rounded-lg ${
                        isCollapsed ? "justify-center" : ""
                    }`}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="ml-4 text-sm font-medium">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;