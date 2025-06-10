import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/CartContext';
import { Menu, X, ShoppingCart, MessageCircle, UserCircle, LogIn, UserPlus, Search } from 'lucide-react';

// Optional: Import CSS file if moving styles out of styled-jsx
// import '../styles/Navbar.css';

const Navbar = ({ darkMode, setDarkMode }) => {
  const { user, logout, loading: authLoading } = useAuth();
  const { cartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chatDropdownOpen, setChatDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const chatDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (chatDropdownRef.current && !chatDropdownRef.current.contains(event.target)) {
        setChatDropdownOpen(false);
      }
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('[data-dropdown-toggle]')) {
        if (!event.target.closest('.hamburger-button')) {
          // setMobileMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const getAvatarColor = (name = '') => {
    const colors = [
      'bg-red-50', 'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-800', 'bg-red-900', 'bg-red-950', 'bg-orange-50', 'bg-orange-100', 'bg-orange-200', 'bg-orange-300', 'bg-orange-400', 'bg-orange-500', 'bg-orange-600', 'bg-orange-700', 'bg-orange-800', 'bg-orange-900', 'bg-orange-950', 'bg-amber-50', 'bg-amber-100', 'bg-amber-200', 'bg-amber-300', 'bg-amber-400', 'bg-amber-500', 'bg-amber-600', 'bg-amber-700', 'bg-amber-800', 'bg-amber-900', 'bg-amber-950', 'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700', 'bg-yellow-800', 'bg-yellow-900', 'bg-yellow-950', 'bg-lime-50', 'bg-lime-100', 'bg-lime-200', 'bg-lime-300', 'bg-lime-400', 'bg-lime-500', 'bg-lime-600', 'bg-lime-700', 'bg-lime-800', 'bg-lime-900', 'bg-lime-950', 'bg-green-50', 'bg-green-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800', 'bg-green-900', 'bg-green-950', 'bg-emerald-50', 'bg-emerald-100', 'bg-emerald-200', 'bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700', 'bg-emerald-800', 'bg-emerald-900', 'bg-emerald-950', 'bg-teal-50', 'bg-teal-100', 'bg-teal-200', 'bg-teal-300', 'bg-teal-400', 'bg-teal-500', 'bg-teal-600', 'bg-teal-700', 'bg-teal-800', 'bg-teal-900', 'bg-teal-950', 'bg-cyan-50', 'bg-cyan-100', 'bg-cyan-200', 'bg-cyan-300', 'bg-cyan-400', 'bg-cyan-500', 'bg-cyan-600', 'bg-cyan-700', 'bg-cyan-800', 'bg-cyan-900', 'bg-cyan-950', 'bg-sky-50', 'bg-sky-100', 'bg-sky-200', 'bg-sky-300', 'bg-sky-400', 'bg-sky-500', 'bg-sky-600', 'bg-sky-700', 'bg-sky-800', 'bg-sky-900', 'bg-sky-950', 'bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900', 'bg-blue-950', 'bg-indigo-50', 'bg-indigo-100', 'bg-indigo-200', 'bg-indigo-300', 'bg-indigo-400', 'bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700', 'bg-indigo-800', 'bg-indigo-900', 'bg-indigo-950', 'bg-violet-50', 'bg-violet-100', 'bg-violet-200', 'bg-violet-300', 'bg-violet-400', 'bg-violet-500', 'bg-violet-600', 'bg-violet-700', 'bg-violet-800', 'bg-violet-900', 'bg-violet-950', 'bg-purple-50', 'bg-purple-100', 'bg-purple-200', 'bg-purple-300', 'bg-purple-400', 'bg-purple-500', 'bg-purple-600', 'bg-purple-700', 'bg-purple-800', 'bg-purple-900', 'bg-purple-950', 'bg-fuchsia-50', 'bg-fuchsia-100', 'bg-fuchsia-200', 'bg-fuchsia-300', 'bg-fuchsia-400', 'bg-fuchsia-500', 'bg-fuchsia-600', 'bg-fuchsia-700', 'bg-fuchsia-800', 'bg-fuchsia-900', 'bg-fuchsia-950', 'bg-pink-50', 'bg-pink-100', 'bg-pink-200', 'bg-pink-300', 'bg-pink-400', 'bg-pink-500', 'bg-pink-600', 'bg-pink-700', 'bg-pink-800', 'bg-pink-900', 'bg-pink-950', 'bg-rose-50', 'bg-rose-100', 'bg-rose-200', 'bg-rose-300', 'bg-rose-400', 'bg-rose-500', 'bg-rose-600', 'bg-rose-700', 'bg-rose-800', 'bg-rose-900', 'bg-rose-950'
    ];
    if (!name) return colors[0];
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  const activeClassName = "text-neon-green border-b-2 border-neon-green";
  const inactiveClassName = "text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-500 transition-colors";
  const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || '').replace('/api', '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const mobileNavLinkClass = "block py-3 px-4 text-lg text-gray-200 hover:bg-neon-green/10 hover:text-neon-green transition-colors rounded-md";
  const mobileActiveClassName = "bg-neon-green/20 text-neon-green";

  return (
    <>
      <nav className="bg-glass-dark backdrop-blur-lg p-4 relative z-40 border-b border-gray-700/50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="cheapal-logo text-3xl font-bold text-neon-green flex-shrink-0 mr-2 sm:mr-6" onClick={closeMobileMenu}>
            Cheapal
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex flex-grow justify-center items-center space-x-6 px-4">
            <NavLink to="/" end className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName} px-1 py-2 text-sm font-medium`}>Home</NavLink>
            <NavLink to="/subscriptions" className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName} px-1 py-2 text-sm font-medium`}>Subscriptions</NavLink>
            
          <NavLink to="/leaderboard" className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName} px-1 py-2 text-sm font-medium`}>Sellers Leaderboard</NavLink>
          <NavLink to="/blogs" className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName} px-1 py-2 text-sm font-medium`}>Blog</NavLink>

          </div>
                   

          {/* Desktop Search Bar */}
          <div className="hidden xl:block flex-shrink-0 mx-4" id="search-container-wrapper-desktop">
            <form onSubmit={handleSearchSubmit} className="relative" id="search-container-desktop">
              <div className="nebula"></div><div className="starfield"></div><div className="cosmic-dust"></div><div className="cosmic-dust"></div><div className="cosmic-dust"></div><div className="stardust"></div><div className="cosmic-ring"></div>
              <div id="main-desktop" className="relative">
                <input className="input" name="text" type="text" placeholder="Explore..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search" />
                <div id="input-mask"></div><div id="cosmic-glow"></div><div className="wormhole-border"></div>
                <button type="submit" id="wormhole-icon" aria-label="Submit search" className="cursor-pointer">
                  <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#a9c7ff" fill="none" height="24" width="24" viewBox="0 0 24 24"><circle r="10" cy="12" cx="12"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>
                </button>
                <div id="search-icon" className="pointer-events-none">
                  <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="url(#cosmic-search-desktop)" fill="none" height="24" width="24" viewBox="0 0 24 24"><circle r="8" cy="11" cx="11"></circle><line y2="16.65" x2="16.65" y1="21" x1="21"></line><defs><linearGradient gradientTransform="rotate(45)" id="cosmic-search-desktop"><stop stopColor="#a9c7ff" offset="0%"></stop><stop stopColor="#6e8cff" offset="100%"></stop></linearGradient></defs></svg>
                </div>
              </div>
            </form>
          </div>

          {/* Right side icons for Desktop */}
          <div className="hidden lg:flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            <Link to="/cart" className="p-2 text-gray-400 hover:text-neon-green rounded-full relative transition-colors focus:outline-none">
              <ShoppingCart size={24} />
              {cartCount > 0 && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">{cartCount}</span>)}
            </Link>
            {user && (
              <div className="relative" ref={chatDropdownRef} data-dropdown-toggle>
                <button onClick={() => setChatDropdownOpen(!chatDropdownOpen)} className="p-2 text-gray-400 hover:text-neon-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-neon-green rounded-full transition-colors relative">
                  <MessageCircle size={24} />
                </button>
                {chatDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-glass-dark border border-neon-green/20 rounded-md shadow-lg backdrop-blur-lg z-50 p-2">
                    <div className="p-2 text-white text-center border-b border-neon-green/20"><h3 className="font-medium">Your Conversations</h3></div>
                    <div className="max-h-60 overflow-y-auto">
                      {user.role === 'buyer' && ( <Link to="/chat/admin" className="block px-3 py-2 text-white hover:bg-neon-green/20 transition-colors text-sm" onClick={() => setChatDropdownOpen(false)}>Support Chat</Link> )}
                      {user.role === 'seller' && ( <> <Link to="/chat/admin" className="block px-3 py-2 text-white hover:bg-neon-green/20 transition-colors text-sm" onClick={() => setChatDropdownOpen(false)}>Admin Support</Link> <div className="px-3 py-2 text-gray-400 text-sm">Recent Orders</div> </> )}
                      <div className="px-3 py-2 text-center text-sm text-neon-green"><Link to="/chats" onClick={() => setChatDropdownOpen(false)}>View All Chats</Link></div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {user ? (
              <div className="relative" ref={dropdownRef} data-dropdown-toggle>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 focus:outline-none">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm ${user.avatar ? 'bg-cover bg-center' : getAvatarColor(user.name)}`} style={user.avatar ? { backgroundImage: `url(${user.avatar.startsWith('http') || user.avatar.startsWith('blob:') ? user.avatar : `${IMAGE_BASE_URL}/Uploads/${user.avatar}`})` } : {}}>
                    {!user.avatar && (user.name ? user.name.charAt(0).toUpperCase() : '?')}
                  </div>
                </button>
                <div className={`absolute right-0 mt-2 w-48 bg-glass-dark border border-neon-green/20 rounded-md shadow-lg backdrop-blur-lg z-50 ${dropdownOpen ? 'block' : 'hidden'}`}>
                  <NavLink to="/profile" className={({isActive}) => `block px-4 py-2 text-sm ${isActive ? 'text-neon-green' : 'text-white'} hover:bg-neon-green/10 transition-colors`} onClick={() => setDropdownOpen(false)}>My Profile</NavLink>
                  {user.role === 'seller' && ( <NavLink to="/seller-dashboard" className={({isActive}) => `block px-4 py-2 text-sm ${isActive ? 'text-neon-green' : 'text-white'} hover:bg-neon-green/10 transition-colors`} onClick={() => setDropdownOpen(false)}>Seller Dashboard</NavLink> )}
                  {user.role === 'admin' && ( <NavLink to="/admin/dashboard" className={({isActive}) => `block px-4 py-2 text-sm ${isActive ? 'text-neon-green' : 'text-white'} hover:bg-neon-green/10 transition-colors`} onClick={() => setDropdownOpen(false)}>Admin Dashboard</NavLink> )}
                  {(user.role === 'buyer' || user.role === 'user') && (<NavLink to="/buyer-dashboard" className={({isActive}) => `block px-4 py-2 text-sm ${isActive ? 'text-neon-green' : 'text-white'} hover:bg-neon-green/10 transition-colors`} onClick={() => setDropdownOpen(false)}>My Dashboard</NavLink>)}
                  <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-red-500/20 transition-colors">Logout</button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1.5 text-neon-green hover:bg-neon-green/10 rounded-lg transition-colors text-sm">Login</Link>
                <Link to="/register" className="px-3 py-1.5 bg-neon-green text-black rounded-lg hover:bg-neon-green/90 transition-colors text-sm font-medium">Register</Link>
              </>
            )}
          </div>

          {/* Hamburger Menu Button - visible on screens smaller than lg */}
          <div className="lg:hidden">
            <button onClick={toggleMobileMenu} className="hamburger-button text-gray-300 hover:text-neon-green focus:outline-none p-2" aria-label="Open menu">
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'} absolute top-full left-0 right-0 z-30 bg-glass-dark/95 backdrop-blur-xl shadow-2xl border-t border-gray-700/50 pb-8`}
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative" id="search-container-mobile">
              <div className="relative flex items-center">
                <input
                  className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-neon-green focus:border-neon-green p-3 pr-12"
                  name="mobile-search"
                  type="text"
                  placeholder="Explore Cheapal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search"
                />
                <button type="submit" aria-label="Submit search" className="absolute right-0 top-0 bottom-0 px-4 text-gray-400 hover:text-neon-green">
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-2">
              <NavLink to="/" end className={({ isActive }) => `${mobileNavLinkClass} ${isActive ? mobileActiveClassName : ''}`} onClick={closeMobileMenu}>Home</NavLink>
              <NavLink to="/subscriptions" className={({ isActive }) => `${mobileNavLinkClass} ${isActive ? mobileActiveClassName : ''}`} onClick={closeMobileMenu}>Subscriptions</NavLink>
              <NavLink to="/leaderboard" className={({ isActive }) => `${mobileNavLinkClass} ${isActive ? mobileActiveClassName : ''}`} onClick={closeMobileMenu}>Sellers Leaderboard</NavLink>
            </nav>

            <hr className="border-gray-700/50 my-4" />

            {/* Mobile User Actions */}
            <div className="space-y-3">
                <Link to="/cart" className={`${mobileNavLinkClass} flex items-center gap-3`} onClick={closeMobileMenu}>
                    <ShoppingCart size={22} /> Cart {cartCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>}
                </Link>
                {user && (
                     <Link to="/chats" className={`${mobileNavLinkClass} flex items-center gap-3`} onClick={closeMobileMenu}>
                        <MessageCircle size={22} /> My Chats
                    </Link>
                )}
                {user ? (
                    <>
                        <NavLink to="/profile" className={`${mobileNavLinkClass} flex items-center gap-3 ${location.pathname === '/profile' ? mobileActiveClassName : ''}`} onClick={closeMobileMenu}>
                            <UserCircle size={22} /> My Profile
                        </NavLink>
                        {user.role === 'seller' && ( <NavLink to="/seller-dashboard" className={`${mobileNavLinkClass} flex items-center gap-3 ${location.pathname === '/seller-dashboard' ? mobileActiveClassName : ''}`} onClick={closeMobileMenu}>Seller Dashboard</NavLink> )}
                        {user.role === 'admin' && ( <NavLink to="/admin/dashboard" className={`${mobileNavLinkClass} flex items-center gap-3 ${location.pathname === '/admin/dashboard' ? mobileActiveClassName : ''}`} onClick={closeMobileMenu}>Admin Dashboard</NavLink> )}
                        {(user.role === 'buyer' || user.role === 'user') && (<NavLink to="/buyer-dashboard" className={`${mobileNavLinkClass} flex items-center gap-3 ${location.pathname === '/buyer-dashboard' ? mobileActiveClassName : ''}`} onClick={closeMobileMenu}>My Dashboard</NavLink>)}
                        <button onClick={() => { logout(); closeMobileMenu(); }} className={`${mobileNavLinkClass} w-full text-left flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300`}>
                            <LogIn size={22} className="transform rotate-180" /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className={`${mobileNavLinkClass} flex items-center gap-3`} onClick={closeMobileMenu}>
                            <LogIn size={22} /> Login
                        </Link>
                        <Link to="/register" className={`${mobileNavLinkClass} flex items-center gap-3`} onClick={closeMobileMenu}>
                           <UserPlus size={22} /> Register
                        </Link>
                    </>
                )}
            </div>
          </div>
        </div>
      </nav>

      {/* styled-jsx styles for navbar - using correct syntax */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        /* Font-face for Rushblade Demo should be in global CSS (e.g., src/index.css) */
        .cheapal-logo {
          font-family: 'Rushblade Demo', 'Orbitron', sans-serif;
          font-weight: 700;
        }

        /* Desktop Search Bar Styles */
        #search-container-wrapper-desktop { min-width: 310px; }
        #search-container-desktop .input {
          background-color: #05071b;
          border: none;
          width: 301px;
          height: 56px;
          border-radius: 10px;
          color: #a9c7ff;
          padding-inline: 59px 45px;
          font-size: 18px;
          ;
        }
        #search-container-desktop {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        #search-container-desktop .input::placeholder { color: #6e8cff; }
        #search-container-desktop .stardust,
        #search-container-desktop .cosmic-ring,
        #search-container-desktop .starfield,
        #search-container-desktop .nebula {
          max-height: 70px;
          max-width: 314px;
          height: 100%;
          width: 100%;
          position: absolute;
          overflow: hidden;
          z-index: -1;
          border-radius: 12px;
          filter: blur(3px);
        }
        #search-container-desktop .stardust {
          max-height: 63px;
          max-width: 307px;
          border-radius: 10px;
          filter: blur(2px);
        }
        #search-container-desktop .stardust::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(83deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          filter: brightness(1.4);
          background-image: conic-gradient(
            rgba(0, 0, 0, 0) 0%,
            #4d6dff,
            rgba(0, 0, 0, 0) 8%,
            rgba(0, 0, 0, 0) 50%,
            #6e8cff,
            rgba(0, 0, 0, 0) 58%
          );
          transition: all 2s;
        }
        #search-container-desktop .cosmic-ring {
          max-height: 59px;
          max-width: 303px;
          border-radius: 11px;
          filter: blur(0.5px);
        }
        #search-container-desktop .cosmic-ring::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(70deg);
          position: absolute;
          width: 600px;
          height: 600px;
          filter: brightness(1.3);
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            #05071b,
            #4d6dff 5%,
            #05071b 14%,
            #05071b 50%,
            #6e8cff 60%,
            #05071b 64%
          );
          transition: all 2s;
        }
        #search-container-desktop .starfield {
          max-height: 65px;
          max-width: 312px;
        }
        #search-container-desktop .starfield::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(82deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            rgba(0, 0, 0, 0),
            #1c2452,
            rgba(0, 0, 0, 0) 10%,
            rgba(0, 0, 0, 0) 50%,
            #2a3875,
            rgba(0, 0, 0, 0) 60%
          );
          transition: all 2s;
        }
        #search-container-desktop:hover > .starfield::before {
          transform: translate(-50%, -50%) rotate(-98deg);
        }
        #search-container-desktop:hover > .nebula::before {
          transform: translate(-50%, -50%) rotate(-120deg);
        }
        #search-container-desktop:hover > .stardust::before {
          transform: translate(-50%, -50%) rotate(-97deg);
        }
        #search-container-desktop:hover > .cosmic-ring::before {
          transform: translate(-50%, -50%) rotate(-110deg);
        }
        #search-container-desktop:focus-within > .starfield::before {
          transform: translate(-50%, -50%) rotate(442deg);
          transition: all 4s;
        }
        #search-container-desktop:focus-within > .nebula::before {
          transform: translate(-50%, -50%) rotate(420deg);
          transition: all 4s;
        }
        #search-container-desktop:focus-within > .stardust::before {
          transform: translate(-50%, -50%) rotate(443deg);
          transition: all 4s;
        }
        #search-container-desktop:focus-within > .cosmic-ring::before {
          transform: translate(-50%, -50%) rotate(430deg);
          transition: all 4s;
        }
        #search-container-desktop .nebula {
          overflow: hidden;
          filter: blur(30px);
          opacity: 0.4;
          max-height: 130px;
          max-width: 354px;
        }
        #search-container-desktop .nebula:before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(60deg);
          position: absolute;
          width: 999px;
          height: 999px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            #000,
            #4d6dff 5%,
            #000 38%,
            #000 50%,
            #6e8cff 60%,
            #000 87%
          );
          transition: all 2s;
        }
        #search-container-desktop .cosmic-dust { display: none; }
        #search-container-desktop #wormhole-icon {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          max-height: 40px;
          max-width: 38px;
          height: 100%;
          width: 100%;
          isolation: isolate;
          overflow: hidden;
          border-radius: 10px;
          background: linear-gradient(180deg, #1c2452, #05071b, #2a3875);
          border: 1px solid transparent;
          padding: 0;
        }
        #search-container-desktop .wormhole-border {
          height: 42px;
          width: 40px;
          position: absolute;
          overflow: hidden;
          top: 7px;
          right: 7px;
          border-radius: 10px;
        }
        #search-container-desktop .wormhole-border::before {
          content: "";
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(90deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          filter: brightness(1.35);
          background-image: conic-gradient(
            rgba(0, 0, 0, 0),
            #4d6dff,
            rgba(0, 0, 0, 0) 50%,
            rgba(0, 0, 0, 0) 50%,
            #6e8cff,
            rgba(0, 0, 0, 0) 100%
          );
          animation: rotate 4s linear infinite;
        }
        #search-container-desktop #main-desktop { position: relative; }
        #search-container-desktop #search-icon { position: absolute; left: 20px; top: 15px; }

        @media (max-width: 1279px) { #search-container-wrapper-desktop { display: none; } }

        @keyframes rotate { 100% { transform: translate(-50%, -50%) rotate(450deg); } }
      `}</style>
    </>
  );
};

export default Navbar;