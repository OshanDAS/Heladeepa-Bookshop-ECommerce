import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, User, LogOut, UserCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { BookOpenCheck, Shield } from "lucide-react";
import SearchBar from "../SearchBar/SearchBar";

const Header = ({ isSidebarCollapsed, onToggleSidebar }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();
    const location = useLocation();
    let role = null;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                setUsername(decoded.name);
                setEmail(decoded.sub);
                role = decoded.role;
            } catch (error) {
                console.error("Error decoding token", error);
            }
        }
    }, []);

    const isAdminRoute = location.pathname.startsWith("/admin") || 
                        location.pathname === "/upload/books" ||
                        location.pathname === "/edit-product" ||
                        location.pathname === "/promotions" ||
                        location.pathname === "/manual-sales" ||
                        location.pathname === "/admin/profile";

    const isAdmin = role === "[ADMIN]" && isAdminRoute;

    return (
        <header className={`fixed top-0 right-0 left-0 h-16 z-40 ${
            isAdmin ? "bg-[#5D4037]" : "bg-[#8D6E63]"
        } text-white border-b ${
            isAdmin ? "border-[#8D6E63]" : "border-[#A1887F]"
        }`}>
            <div className="h-full px-4 flex items-center justify-between">
                <div className="flex items-center">
                    {isMobile && (
                        <button
                            onClick={onToggleSidebar}
                            className="p-2 rounded-md hover:bg-opacity-20 hover:bg-white mr-4"
                        >
                            <Menu size={24} className="text-[#F5E6CA]" />
                        </button>
                    )}
                    <div className="flex items-center">
                        <div className="relative">
                            <BookOpenCheck size={32} className="text-[#F5E6CA]" />
                            {isAdmin && <Shield size={16} className="absolute -top-1 -right-1 text-[#8D6E63]" />}
                        </div>
                        <div className="ml-3">
                            <h1 className="font-bold text-xl text-[#F5E6CA]">Heladeepa</h1>
                            <div className="flex items-center space-x-1">
                                <p className="text-[#D7CCC8] text-sm">Stationaries</p>
                                {isAdmin && <span className="text-[#F5E6CA] text-xs font-bold">ADMIN</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar - Only visible for customer routes */}
                {!isAdminRoute && (
                    <div className="flex-1 max-w-2xl mx-8">
                        <SearchBar />
                    </div>
                )}

                {/* Right side icons */}
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-2 rounded-md hover:bg-opacity-20 hover:bg-white"
                        >
                            <User size={24} className="text-[#F5E6CA]" />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white text-[#5D4037] shadow-lg rounded-lg overflow-hidden transform transition duration-200 z-50 border border-gray-200">
                                <div className="px-6 py-4 bg-[#BCAAA4] text-[#5D4037] font-semibold text-lg flex items-center space-x-3">
                                    <UserCircle size={30} />
                                    <span>Hello, {username}</span>
                                </div>
                                <hr className="border-gray-300" />
                                <Link
                                    to={isAdmin ? "/admin/profile" : "/profile"}
                                    className="flex items-center px-6 py-4 hover:bg-[#D7CCC8] transition space-x-4 text-lg"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <UserCircle size={24} />
                                    <span>Profile</span>
                                </Link>
                                <hr className="border-gray-300" />
                                <button
                                    className="flex items-center w-full text-left px-6 py-4 bg-[#D7CCC8] hover:bg-[#BCAAA4] transition space-x-4 text-lg"
                                    onClick={() => {
                                        localStorage.removeItem("accessToken");
                                        setIsDropdownOpen(false);
                                        navigate("/");
                                    }}
                                >
                                    <LogOut size={24} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
