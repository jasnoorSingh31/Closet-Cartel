import { ShoppingCart, User, LogOut } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Products", path: "/product" },
        { name: "Contact", path: "/contact" },
        { name: "About", path: "/about" },
    ];

    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleNavClick = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    };

    return (
        <div>
            <nav
                className={`fixed top-0 left-0 bg-nav w-full flex items-center justify-between font-medium px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
                    isScrolled
                        ? "bg-white/80 shadow-md text-gray-700 font-medium backdrop-blur-lg py-3 md:py-4"
                        : "py-4 md:py-6"
                }`}
            >
                {/* Logo */}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2"
                >
                    <img
                        src="/logo.png"
                        alt="logo"
                        className={`h-17 w-20 ${
                            isScrolled && "invert opacity-80"
                        }`}
                    />
                </button>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4 lg:gap-8 cursor-pointer">
                    {navLinks.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(link.path)}
                            className={`group flex flex-col gap-0.5 ${
                                isScrolled
                                    ? "text-gray-700"
                                    : "text-white"
                            }`}
                        >
                            {link.name}
                            <div
                                className={`${
                                    isScrolled
                                        ? "bg-gray-700"
                                        : "bg-white"
                                } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
                            />
                        </button>
                    ))}
                    <button
                        onClick={() => navigate("/cart")}
                        className={`${
                            isScrolled ? "text-black" : "text-white"
                        } transition-all`}
                    >
                        <ShoppingCart className="w-6 h-6 hover:text-icon cursor-grab transition-all duration-300" />
                    </button>
                </div>

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-4 relative">
                    <svg
                        className={`h-6 w-6 text-white hover:text-icon transition-all cursor-pointer duration-300 ${
                            isScrolled ? "invert" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line
                            x1="21"
                            y1="21"
                            x2="16.65"
                            y2="16.65"
                        />
                    </svg>

                    {isAuthenticated ? (
                        <div className="relative">
                            {/* User Menu Button */}
                            <button
                                onClick={() =>
                                    setIsDropdownOpen(!isDropdownOpen)
                                }
                                className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-500 bg-gray-100 hover:bg-gray-200"
                            >
                                <User className="w-5 h-5 text-gray-700" />
                                <span className="text-gray-700">
                                    {user?.name}
                                </span>
                            </button>

                            {/* Dropdown */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                                    <ul className="py-2 text-gray-700">
                                        <li>
                                            <button
                                                onClick={() =>
                                                    navigate("/profile")
                                                }
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                Profile
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() =>
                                                    navigate("/settings")
                                                }
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                Settings
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                                            >
                                                <LogOut className="w-4 h-4" />
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className={`px-8 py-2.5 rounded-full cursor-pointer ml-4 transition-all duration-500 ${
                                isScrolled
                                    ? "text-white bg-black"
                                    : "bg-white text-black"
                            }`}
                        >
                            Login
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="text-white flex items-center gap-3 md:hidden">
                    <svg
                        onClick={() =>
                            setIsMenuOpen(!isMenuOpen)
                        }
                        className={`h-6 w-6 cursor-pointer ${
                            isScrolled ? "text-black" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
                        isMenuOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }`}
                >
                    <button
                        className="absolute top-4 right-4"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="#0D0D0D"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <line
                                x1="18"
                                y1="6"
                                x2="6"
                                y2="18"
                            />
                            <line
                                x1="6"
                                y1="6"
                                x2="18"
                                y2="18"
                            />
                        </svg>
                    </button>

                    {navLinks.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => handleNavClick(link.path)}
                            className="text-gray-800 hover:text-gray-600 transition-colors"
                        >
                            {link.name}
                        </button>
                    ))}

                    <button
                        onClick={() => handleNavClick("/cart")}
                        className="text-sm font-light rounded-full cursor-pointer transition-all"
                    >
                        <ShoppingCart className="w-6 h-6 text-nav hover:text-icon cursor-pointer transition-all duration-300" />
                    </button>

                    {isAuthenticated ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-gray-800" />
                                <span className="text-gray-800">
                                    {user?.name}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-nav text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer hover:bg-red-700"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() =>
                                handleNavClick("/login")
                            }
                            className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer"
                        >
                            Login
                        </button>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
