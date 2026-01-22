import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
    Menu, X, ChevronDown, User, LogOut, Bell, 
    BarChart2, UserCheck, Mail, Home, Info, MessageSquare 
} from 'lucide-react';
// import logo from '../assets/Logo.png';
// import logo from '../assets/1.jpg';
// import logo from '../assets/5.jpg';
// import logo from '../assets/8.jpg';
// import logo from '../assets/9.jpg';
// import logo from '../assets/14.jpg';
// import logo from '../assets/15.jpg';
import logo from '../assets/logofinal.png';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const profileDropdownRef = useRef(null);
    const notificationsDropdownRef = useRef(null);

    // Detect scroll to apply glassmorphism effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/dashboard', icon: Home },
        { name: 'About Us', path: '/about-us', icon: Info },
        { name: 'Dashboard', path: '/placements/data', icon: BarChart2 },
        { name: 'Interview Experience', path: '/company-insights', icon: UserCheck },
        { name: 'Contact Us', path: '/contact', icon: Mail },
        { name: 'Feedback', path: '/submit-feedback', icon: MessageSquare },
    ];

    const profileActions = [
        { name: 'Profile', icon: User, action: () => navigate('/profile') },
        { name: 'Logout', icon: LogOut, action: () => { console.log('Logging out...'); navigate('/login'); } },
    ];

    const notifications = [
        { id: 1, message: 'Welcome to CampSync.ai!', time: 'Get ready for your dream career' },
    ];

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) setIsProfileDropdownOpen(false);
            if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target)) setIsNotificationsDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            scrolled 
            ? 'bg-white/80 backdrop-blur-lg shadow-lg py-2' 
            : 'bg-white py-4'
        }`}>
            <nav className="container mx-auto px-5 md:px-8 flex items-center justify-between">
                
                {/* Logo Section */}
                <div 
                    className="flex shrink-0 items-center space-x-3 cursor-pointer group" 
                    onClick={() => navigate('/dashboard')}
                >
                    <img src={logo} alt="Logo" className="h-12 w-auto group-hover:scale-110 transition-transform duration-300" />
                    <div className="hidden sm:block">
                            <p className="text-sm font-black text-slate-900 leading-none">CampSync.AI</p>
                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Intelligent Campus Management</p>
                    </div>
                </div>

                {/* Desktop Navigation (Hidden on small/medium screens) */}
                <div className="hidden lg:flex items-center space-x-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                                    isActive 
                                    ? 'text-indigo-600 bg-indigo-50 shadow-sm' 
                                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                                }`}
                            >
                                <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                                <span>{link.name}</span>
                            </NavLink>
                        );
                    })}
                </div>

                {/* Action Icons Section */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    
                    {/* Notifications Button */}
                    <div className="relative" ref={notificationsDropdownRef}>
                        <button
                            onClick={() => setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen)}
                            className="p-2.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-all duration-300 cursor-pointer relative group"
                        >
                            <Bell size={22} className="group-hover:rotate-12 transition-transform" />
                            {notifications.length > 0 && (
                                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-200 animate-pulse"></span>
                            )}
                        </button>

                        {isNotificationsDropdownOpen && (
                            <div className="absolute right-0 mt-4 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                <div className="px-5 py-2 mb-2 flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase">New</span>
                                </div>
                                {notifications.map((notif) => (
                                    <div key={notif.id} className="px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-transparent hover:border-indigo-500">
                                        <p className="text-sm text-slate-800 font-medium leading-tight">{notif.message}</p>
                                        <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileDropdownRef}>
                        <button
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="flex items-center space-x-1 p-1.5 rounded-full border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 cursor-pointer"
                        >
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                <User size={18} />
                            </div>
                            <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isProfileDropdownOpen && (
                            <div className="absolute right-0 mt-4 w-52 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                {profileActions.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => { item.action(); setIsProfileDropdownOpen(false); }}
                                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                                    >
                                        <item.icon size={18} className="mr-3 opacity-60" />
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Hamburger Menu (Mobile/Tablet Only) */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden p-2.5 text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            <div 
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${
                    isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`} 
                onClick={() => setIsMobileMenuOpen(false)} 
            />

            {/* Mobile Sidebar Content */}
            <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[60] lg:hidden transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="flex flex-col h-full p-6">
                    {/* Drawer Header */}
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center space-x-2">
                            <img src={logo} alt="Logo" className="h-8 w-auto" />
                            <span className="font-bold text-lg text-indigo-900">Menu</span>
                        </div>
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)} 
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Drawer Links */}
                    <div className="flex-grow space-y-2 overflow-y-auto">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;
                            return (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                                        isActive 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                                    }`}
                                >
                                    <Icon size={22} />
                                    <span className="text-base font-bold">{link.name}</span>
                                </NavLink>
                            );
                        })}
                    </div>

                    {/* Drawer Footer Actions - Added relative z-index to avoid chatbot overlap */}
                    <div className="mt-8 pt-6 border-t border-slate-100 space-y-3 relative z-[70]">
                        <button 
                            onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                            className="flex items-center space-x-4 w-full p-4 text-slate-700 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer font-semibold"
                        >
                            <User size={22} className="text-slate-400" />
                            <span>My Profile</span>
                        </button>
                        <button 
                            onClick={() => { 
                                console.log('Logging out...'); 
                                setIsMobileMenuOpen(false); 
                                navigate('/login'); 
                            }}
                            className="flex items-center space-x-4 w-full p-4 text-red-600 hover:bg-red-50 rounded-2xl transition-all cursor-pointer font-bold"
                        >
                            <LogOut size={22} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;