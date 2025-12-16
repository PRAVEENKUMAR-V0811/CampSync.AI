import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Bell, BarChart2, UserCheck, Mail } from 'lucide-react'; // Added icons for nav links
import logo from '../assets/Logo.png';
const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false); // New state for notifications
    const navigate = useNavigate();
    const location = useLocation();
    const profileDropdownRef = useRef(null);
    const notificationsDropdownRef = useRef(null); // Ref for notifications

    const navLinks = [
        { name: 'Home', path: '/dashboard', icon: 'Home' }, // Assuming Home icon
        { name: 'About Us', path: '/about-us' },
        { name: 'Dashboard', path: '/placements/data', icon: BarChart2 },
        { name: 'Interview Experience', path: '/company-insights', icon: UserCheck },
        { name: 'Contact Us', path: '/contact', icon: Mail },
        { name: 'Feedback', path: '/submit-feedback', icon: UserCheck },
    ];

    const profileActions = [
        { name: 'Profile', icon: User, action: () => navigate('/profile') },
        { name: 'Logout', icon: LogOut, action: () => { console.log('Logging out...'); navigate('/login'); } },
    ];

    const notifications = [
        { id: 1, message: 'Welcome to CampSync.ai!', time: 'Be Ready to boost your career' },
    ];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
            if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target)) {
                setIsNotificationsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNavLinkClick = () => {
        setIsMobileMenuOpen(false); // Close mobile menu on link click
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
            <nav className="container mx-auto px-4 py-3 flex items-center justify-between h-16">
                {/* Left Section: Logo/Site Name */}
                <div className="flex-shrink-0 flex items-center space-x-2">
                    {/* Placeholder for your actual logo */}
                    <img src={logo} alt="CampSync.ai Logo" className="h-10 w-9" />
                    <NavLink to="/" className="text-2xl font-bold text-indigo-900 hover:text-indigo-800 transition-colors duration-200">
                        Camp<span className='text-sky-400'>Sync.ai</span>
                    </NavLink>
                </div>

                {/* Center Section: Navigation Links (Desktop) */}
                <div className="hidden md:flex flex-grow justify-center space-x-8">
                    {navLinks.map((link) => {
                        const Icon = link.icon; // Get icon component
                        return (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={`relative text-gray-700 hover:text-indigo-700 font-medium transition-colors duration-200 flex items-center space-x-1
                                            ${location.pathname === link.path ? 'text-indigo-700' : ''}`}
                                onClick={handleNavLinkClick}
                            >
                                {Icon && typeof Icon !== 'string' && <Icon size={18} className="inline-block" />}
                                <span>{link.name}</span>
                                {location.pathname === link.path && (
                                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-700 rounded-full"></span>
                                )}
                            </NavLink>
                        );
                    })}
                </div>

                {/* Right Section: Notifications & Profile */}
                <div className="flex items-center space-x-4">
                    {/* Notifications Icon and Dropdown */}
                    <div className="relative" ref={notificationsDropdownRef}>
                        <button
                            onClick={() => setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen)}
                            className="text-gray-600 hover:text-indigo-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 relative"
                        >
                            <Bell size={20} />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 bg-red-500 text-white text-xs font-bold rounded-full">
                                    {notifications.length}
                                </span>
                            )}
                        </button>
                        {isNotificationsDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-20 animate-fade-in-down">
                                <div className="px-4 py-2 text-sm font-semibold text-gray-800 border-b border-gray-100">Notifications</div>
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div key={notif.id} className="px-4 py-2 hover:bg-indigo-50 transition-colors duration-200 cursor-pointer border-b border-gray-100 last:border-b-0">
                                            <p className="text-sm text-gray-800">{notif.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-sm text-gray-500">No new notifications.</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileDropdownRef}>
                        <button
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="flex items-center space-x-1 text-gray-700 hover:text-indigo-700 focus:outline-none transition-colors duration-200 p-2 rounded-md hover:bg-gray-100"
                        >
                            <User size={20} />
                            <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isProfileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20 animate-fade-in-down">
                                {profileActions.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => { item.action(); setIsProfileDropdownOpen(false); }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                                    >
                                        <item.icon size={16} className="mr-2" />
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Hamburger Menu Icon (Mobile) */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-700 hover:text-indigo-700 focus:outline-none p-2 rounded-md hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu (Slide-out Sidebar) */}
            <div className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:hidden
                            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 pt-6 flex flex-col space-y-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="self-end text-gray-700 hover:text-indigo-700 focus:outline-none p-2 rounded-md hover:bg-gray-100"
                    >
                        <X size={24} />
                    </button>
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={`flex items-center px-4 py-2 text-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors duration-200
                                            ${location.pathname === link.path ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''}`}
                                onClick={handleNavLinkClick}
                            >
                                {Icon && typeof Icon !== 'string' && <Icon size={20} className="mr-2" />}
                                <span>{link.name}</span>
                            </NavLink>
                        );
                    })}
                    <div className="border-t border-gray-200 my-4"></div>
                    {/* Mobile: Notifications */}
                    <button
                        onClick={() => { setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen); setIsMobileMenuOpen(false); }} // Close mobile menu but open notifs dropdown
                        className="flex items-center px-4 py-2 text-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors duration-200 relative"
                    >
                        <Bell size={20} className="mr-2" /> Notifications
                        {notifications.length > 0 && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-6 w-6 bg-red-500 text-white text-xs font-bold rounded-full">
                                {notifications.length}
                            </span>
                        )}
                    </button>
                    {/* Mobile: Profile Actions */}
                    {profileActions.map((item) => (
                        <button
                            key={`mobile-${item.name}`}
                            onClick={() => { item.action(); setIsMobileMenuOpen(false); }}
                            className="flex items-center px-4 py-2 text-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors duration-200"
                        >
                            <item.icon size={20} className="mr-2" />
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
        </header>
    );
};

export default Header;