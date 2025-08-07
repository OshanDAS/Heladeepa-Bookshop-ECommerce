import { Link, useLocation } from "react-router-dom";
import {
    Home,
    ShoppingCart,
    Heart,
    BookOpen,
    User,
    LogOut,
    ShoppingBag,
    CalendarClock,
    ClipboardList,
} from "lucide-react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const CustomerSidebar = ({ isCollapsed, onToggleCollapse }) => {
    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false);
    const [userName, setUserName] = useState("");
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Get user name from JWT token
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                setUserName(decoded.name || "User");
            } catch (error) {
                console.error("Error decoding token", error);
                setUserName("User");
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
            title: "Home",
            icon: <Home size={20} />,
            path: "/products",
        },
        {
            title: "Shop",
            icon: <ShoppingBag size={20} />,
            path: "/shop",
        },
        {
            title: "Cart",
            icon: <ShoppingCart size={20} />,
            path: "/cart",
            badge: cartCount > 0 ? cartCount : null,
        },
        {
            title: "My Orders",
            icon: <ClipboardList size={20} />,
            path: "/orders",
        },
        {
            title: "Wishlist",
            icon: <Heart size={20} />,
            path: "/wishlist",
        },
        {
            title: "Booklist",
            icon: <BookOpen size={20} />,
            path: "/booklist",
        },
        {
            title: "Pre-Orders",
            icon: <CalendarClock size={20} />,
            path: "/preorders",
        },
    ];

    return (
        <div
            className={`bg-[#8D6E63] text-white h-screen fixed left-0 top-16 transition-all duration-300 ${
                isCollapsed ? "w-20" : "w-64"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* User Greeting */}
            <div className="h-20 flex items-center px-6 border-b border-[#A1887F]">
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
                                ? "bg-[#A1887F] text-white"
                                : "text-[#D7CCC8] hover:bg-[#9E8D85]"
                        } ${isCollapsed ? "justify-center px-4" : ""}`}
                    >
                        <span className={`${isCollapsed ? "flex justify-center" : ""}`}>{item.icon}</span>
                        {!isCollapsed && (
                            <span className="ml-4 text-sm font-medium">{item.title}</span>
                        )}
                        {item.badge && (
                            <span className="absolute right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {item.badge}
                            </span>
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
                    className={`flex items-center w-full px-4 py-3 text-[#D7CCC8] hover:bg-[#9E8D85] transition-colors rounded-lg ${
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

export default CustomerSidebar;