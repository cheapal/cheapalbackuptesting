import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { orderService, chatService, notificationService } from '../services/apiService';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import NewCustomToast from '../components/NewCustomToast';

// --- Animated Background Component ---
const AnimatedGradientBackground = () => {
    useEffect(() => {
        const particlesContainer = document.getElementById('particles-container-buyer-dashboard');
        if (!particlesContainer) return;

        const particleCount = 30;
        const existingParticles = particlesContainer.querySelectorAll('.particle-buyer-dashboard');
        existingParticles.forEach(p => p.remove());

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle-buyer-dashboard';
            const size = Math.random() * 2.5 + 0.5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.position = 'absolute';
            particle.style.background = 'white';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            resetParticle(particle);
            particlesContainer.appendChild(particle);
            animateParticle(particle);
        };

        const resetParticle = (particle) => {
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0.5)';
        };

        const animateParticle = (particle) => {
            const duration = Math.random() * 18 + 12;
            const delay = Math.random() * 12;

            setTimeout(() => {
                if (!particlesContainer || !particlesContainer.contains(particle)) return;
                particle.style.transition = `all ${duration}s linear`;
                particle.style.opacity = (Math.random() * 0.2 + 0.03).toString();
                particle.style.transform = 'scale(1)';

                const moveX = parseFloat(particle.style.left) + (Math.random() * 40 - 20);
                const moveY = parseFloat(particle.style.top) - (Math.random() * 50 + 15);

                particle.style.left = `${moveX}%`;
                particle.style.top = `${moveY}%`;

                setTimeout(() => {
                    if (particlesContainer && particlesContainer.contains(particle)) {
                        if (parseFloat(particle.style.top) < -10 || parseFloat(particle.style.top) > 110 || parseFloat(particle.style.left) < -10 || parseFloat(particle.style.left) > 110) {
                            resetParticle(particle);
                        }
                        animateParticle(particle);
                    }
                }, duration * 1000);
            }, delay * 1000);
        };

        for (let i = 0; i < particleCount; i++) {
            createParticle();
        }

        const spheres = document.querySelectorAll('.gradient-sphere-buyer-dashboard');
        let animationFrameId;
        const handleMouseMove = (e) => {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                const moveX = (e.clientX / window.innerWidth - 0.5) * 15;
                const moveY = (e.clientY / window.innerHeight - 0.5) * 15;
                spheres.forEach(sphere => {
                    sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });
            });
        };
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            if (particlesContainer) {
                particlesContainer.innerHTML = '';
            }
        };
    }, []);

    return (
        <>
            <div className="gradient-background">
                <div className="gradient-sphere sphere-1 gradient-sphere-buyer-dashboard"></div>
                <div className="gradient-sphere sphere-2 gradient-sphere-buyer-dashboard"></div>
                <div className="gradient-sphere sphere-3 gradient-sphere-buyer-dashboard"></div>
                <div className="glow"></div>
                <div className="grid-overlay"></div>
                <div className="noise-overlay"></div>
                <div className="particles-container" id="particles-container-buyer-dashboard"></div>
            </div>
        </>
    );
};

// --- UI Icons ---
const SubscriptionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:text-neon-purple transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.623 5.9A2.003 2.003 0 0012 15H8a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-4.586 2.586l-3.414-3.414" />
    </svg>
);

const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:text-neon-purple transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const OptionsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-gray-400 group-hover:text-white transition-colors">
        <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
    </svg>
);

const LoadingSpinner = ({ size = 'h-10 w-10', color = 'border-neon-purple' }) => (
    <div className="flex justify-center items-center py-16 h-full">
        <div className={`animate-spin rounded-full ${size} border-t-2 border-b-2 ${color}`}></div>
    </div>
);

const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-700/10 border border-red-700/30 text-red-300 p-4 rounded-lg text-center my-6 mx-auto max-w-md shadow-lg">
        <p className="font-medium">Oops! Something went wrong.</p>
        <p className="text-sm">{message || 'Could not load the requested data.'}</p>
        {onRetry && (
            <button onClick={onRetry} className="mt-3 px-4 py-1.5 bg-red-600/50 hover:bg-red-600/70 text-white text-xs font-semibold rounded-md transition-colors">
                Retry
            </button>
        )}
    </div>
);

const BuyerDashboard = () => {
    const [activeTab, setActiveTab] = useState('subscriptions');
    const [myOrders, setMyOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [errorOrders, setErrorOrders] = useState(null);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationDropdownRef = useRef(null);

    const { user: currentUser, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace('/api', '');

    useEffect(() => {
        console.log("[BuyerDashboard] Auth Context Values:", {
            currentUser: currentUser ? { id: currentUser._id, name: currentUser.name, role: currentUser.role } : null,
            logoutFunctionType: typeof logout,
            authLoading
        });
    }, [currentUser, logout, authLoading]);

    const getInitials = (name = "") => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";

const fetchMyOrders = useCallback(async () => {
  if (!currentUser?._id) {
    console.log("[BuyerDashboard] fetchMyOrders: No user ID, skipping fetch.");
    setLoadingOrders(false);
    return;
  }
  setLoadingOrders(true);
  setErrorOrders(null);
  try {
    const response = await orderService.getMyOrders();
    console.log("[BuyerDashboard] fetchMyOrders: Raw response from orderService.getMyOrders:", response);
    if (response?.success && Array.isArray(response.data)) {
      setMyOrders(response.data);
    } else {
      console.warn("[BuyerDashboard] fetchMyOrders: Unexpected response structure. Response:", response);
      setErrorOrders(response?.message || "No orders found or unexpected data format.");
      setMyOrders([]);
    }
  } catch (err) {
    console.error(
      "[BuyerDashboard] fetchMyOrders: Error:",
      err.message,
      "Response Payload:",
      err.responsePayload,
    );
    setErrorOrders(err.response?.data?.message || "Failed to fetch your orders. Please try again.");
    setMyOrders([]);
  } finally {
    setLoadingOrders(false);
  }
}, [currentUser]);


    const fetchNotifications = useCallback(async () => {
        if (!currentUser?._id) return;
        setLoadingNotifications(true);
        try {
            const response = await notificationService.getNotifications();
            console.log("[BuyerDashboard] fetchNotifications: Response:", response);
            if (response?.success && Array.isArray(response.notifications)) {
                setNotifications(response.notifications);
                setUnreadCount(response.unreadCount || response.notifications.filter(n => !n.isRead).length);
            } else {
                console.warn("[BuyerDashboard] fetchNotifications: Unexpected response structure. Response:", response);
                setNotifications([]);
                setUnreadCount(0);
                toast(({ closeToast }) => (
                    <NewCustomToast
                        type="warning"
                        headline="Notifications Issue"
                        text="Could not load notifications due to unexpected data format."
                        closeToast={closeToast}
                    />
                ));
            }
        } catch (err) {
            console.error("[BuyerDashboard] Error in fetchNotifications:", err);
            setNotifications([]);
            setUnreadCount(0);
            toast(({ closeToast }) => (
                <NewCustomToast
                    type="error"
                    headline="Failed to Load Notifications"
                    text={err.message || "Could not fetch notifications."}
                    closeToast={closeToast}
                />
            ));
        } finally {
            setLoadingNotifications(false);
        }
    }, [currentUser?._id]);

    useEffect(() => {
        console.log("[BuyerDashboard] Main useEffect triggered. Auth Loading:", authLoading, "User ID:", currentUser?._id);
        if (!authLoading) {
            if (currentUser && currentUser._id) {
                console.log("[BuyerDashboard] User identified, calling fetchMyOrders and fetchNotifications.");
                fetchMyOrders();
                fetchNotifications();
            } else {
                console.log("[BuyerDashboard] No user after auth loading, clearing data and setting error.");
                setLoadingOrders(false);
                setMyOrders([]);
                setNotifications([]);
                setErrorOrders("Please log in to view your orders.");
            }
        } else {
            console.log("[BuyerDashboard] Auth is loading, waiting to fetch data...");
            setLoadingOrders(true);
        }
    }, [currentUser, authLoading, fetchMyOrders, fetchNotifications]);

    useEffect(() => {
        if (!currentUser?._id) return;
        const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
            query: { userId: currentUser._id, userType: 'buyer' }
        });
        socket.on('connect', () => console.log(`[BuyerDashboard] Socket connected: ${socket.id}`));

        socket.on('orderUpdatedForBuyer', (updatedOrder) => {
            console.log('[BuyerDashboard] Received orderUpdatedForBuyer via socket:', updatedOrder);
            setMyOrders(prevOrders => {
                const orderExists = prevOrders.some(order => order._id === updatedOrder._id);
                if (orderExists) {
                    return prevOrders.map(order =>
                        order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
                    );
                } else {
                    return [updatedOrder, ...prevOrders];
                }
            });
            toast(({ closeToast }) => (
                <NewCustomToast
                    type="info"
                    headline="Order Updated"
                    text={`Your order for "${updatedOrder.orderItems?.[0]?.title || 'Item'}" (Status: ${getDisplayStatusText(updatedOrder.status, updatedOrder)}) has been updated.`}
                    closeToast={closeToast}
                />
            ));
        });

        socket.on('newNotification', (notification) => {
            console.log('[BuyerDashboard] Received newNotification via socket:', notification);
            setNotifications(prev => [notification, ...prev.slice(0, 19)]);
            setUnreadCount(prev => prev + (notification.isRead ? 0 : 1));
            toast(({ closeToast }) => (
                <NewCustomToast
                    type="info"
                    headline={notification.title || "New Notification"}
                    text={notification.message}
                    closeToast={closeToast}
                />
            ));
        });

        socket.on('connect_error', (err) => {
            console.error('[BuyerDashboard] Socket connection error:', err);
            toast(({ closeToast }) => (
                <NewCustomToast
                    type="error"
                    headline="Connection Issue"
                    text="Real-time updates may be unavailable. Please refresh the page."
                    closeToast={closeToast}
                />
            ));
        });

        return () => socket.disconnect();
    }, [currentUser?._id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target) && !event.target.closest('#notification-button')) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        if (typeof logout === 'function') {
            logout();
            navigate('/login');
        } else {
            console.error("[BuyerDashboard] Logout function is not available from authContext. Type:", typeof logout);
            toast(({ closeToast }) => (
                <NewCustomToast
                    type="error"
                    headline="Logout Failed"
                    text="Unable to log out. Please try again later."
                    closeToast={closeToast}
                />
            ));
        }
    };

    const handleContactSeller = async (sellerId, orderId) => {
  if (!sellerId || (currentUser && currentUser._id === sellerId)) {
    toast(({ closeToast }) => (
      <NewCustomToast
        type="warning"
        headline="Cannot Contact Seller"
        text={currentUser._id === sellerId ? "You cannot initiate a chat with yourself." : "Seller information is missing."}
        closeToast={closeToast}
      />
    ));
    return;
  }
  try {
    const response = await chatService.accessChat(sellerId, { orderId });
    if (response?.success && response.data?._id) {
      navigate(`/chat/${response.data._id}`);
    } else {
      throw new Error(response?.message || "Could not initiate chat.");
    }
  } catch (err) {
    console.error("[BuyerDashboard] Error in handleContactSeller:", err);
    toast(({ closeToast }) => (
      <NewCustomToast
        type="error"
        headline="Chat Error"
        text={err.message || "Could not start chat with the seller."}
        closeToast={closeToast}
      />
    ));
  }
};

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            try {
                await notificationService.markAsRead(notification._id);
                setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (err) {
                console.error("[BuyerDashboard] Failed to mark notification as read:", err);
                toast(({ closeToast }) => (
                    <NewCustomToast
                        type="error"
                        headline="Notification Error"
                        text="Could not update notification status."
                        closeToast={closeToast}
                    />
                ));
            }
        }
        setShowNotifications(false);
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const cardThemes = [
        { name: 'purple', bgColor: '#231F2D', accentColor: '#8c4cd0', borderColor: '#8c4cd0', glowColor: 'rgba(140, 76, 208, 0.5)' },
        { name: 'blue', bgColor: '#1C2A3E', accentColor: '#1890ff', borderColor: '#1890ff', glowColor: 'rgba(24, 144, 255, 0.5)' },
        { name: 'green', bgColor: '#1A3031', accentColor: '#01c3a8', borderColor: '#01c3a8', glowColor: 'rgba(1, 195, 168, 0.5)' },
        { name: 'orange', bgColor: '#362F2A', accentColor: '#ffb741', borderColor: '#ffb741', glowColor: 'rgba(255, 183, 65, 0.5)' },
    ];

    const getStatusProgress = (status) => {
        const lowerStatus = typeof status === 'string' ? status.toLowerCase() : '';
        switch (lowerStatus) {
            case 'completed': return 100;
            case 'processing': return 75;
            case 'active': return 60;
            case 'pending_payment': return 25;
            case 'requires_action': return 35;
            case 'failed':
            case 'cancelled':
            case 'expired': return 10;
            default: return 50;
        }
    };

    const getDisplayStatusText = (status, order) => {
        const lowerStatus = typeof status === 'string' ? status.toLowerCase() : '';
        switch (lowerStatus) {
            case 'completed':
                return order?.expiresAt ? `Active until ${new Date(order.expiresAt).toLocaleDateString()}` : 'Completed';
            case 'processing':
                return 'Processing Payment';
            case 'pending_payment':
                return 'Payment Pending';
            case 'requires_action':
                return 'Action Required';
            case 'failed':
                return 'Payment Failed';
            case 'cancelled':
                return 'Cancelled';
            case 'active':
                return order?.expiresAt ? `Active until ${new Date(order.expiresAt).toLocaleDateString()}` : 'Active';
            default:
                return status ? status.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Unknown';
        }
    };

    return (
        <div className="min-h-screen text-gray-100 font-sans flex flex-col relative">
            <AnimatedGradientBackground />

            <header className="bg-black/30 backdrop-blur-md shadow-lg sticky top-0 z-30 border-b border-gray-700/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                    <Link to="/" className="text-3xl font-bold tracking-tight transition-transform hover:scale-105">
                        <span className="text-white">Cheap</span><span className="text-neon-purple">al</span>
                    </Link>
                    <div className="flex items-center space-x-3 sm:space-x-5">
                        <div className="relative" ref={notificationDropdownRef}>
                            <button
                                id="notification-button"
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 text-gray-300 hover:text-neon-purple transition-colors rounded-full hover:bg-purple-500/20 focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
                                aria-label="Notifications"
                            >
                                <BellIcon />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[0.6rem] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-gray-900">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                    <div className="p-4 border-b border-gray-700 text-lg font-semibold text-neon-purple">Notifications</div>
                                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                        {loadingNotifications ? <div className="p-4 text-center"><LoadingSpinner size="h-6 w-6" /></div> :
                                            notifications.length > 0 ? (
                                                notifications.map((note) => (
                                                    <div
                                                        key={note._id}
                                                        onClick={() => handleNotificationClick(note)}
                                                        className={`block p-4 border-b border-gray-700/50 hover:bg-purple-600/20 transition-colors cursor-pointer ${!note.isRead ? 'bg-purple-700/10' : ''}`}
                                                    >
                                                        <p className="text-sm text-gray-100 leading-tight">{note.message}</p>
                                                        <p className="text-xs text-gray-400 mt-1.5">{new Date(note.createdAt || note.timestamp).toLocaleString()}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-6 text-center text-gray-400">No new notifications.</div>
                                            )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="group relative">
                            <button className="flex items-center space-x-2 p-1.5 pr-3 rounded-lg hover:bg-purple-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-neon-purple/50">
                                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold ring-2 ring-purple-500/50 overflow-hidden">
                                    {currentUser?.avatar ? <img src={`${IMAGE_BASE_URL}/Uploads/${currentUser.avatar}`} alt={currentUser.name} className="w-full h-full object-cover" /> : getInitials(currentUser?.name)}
                                </div>
                                <span className="hidden md:inline text-sm font-medium group-hover:text-neon-purple">{currentUser?.name || 'User'}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-neon-purple transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100 origin-top-right pointer-events-none group-hover:pointer-events-auto">
                                <Link to="/profile" className="block px-4 py-3 text-sm text-gray-300 hover:bg-purple-600/30 hover:text-neon-purple transition-colors">My Profile</Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:px-8 flex-grow relative z-10">
                <div className="mb-8 mt-6">
                    <div className="sm:hidden">
                        <select
                            id="tabs" name="tabs"
                            className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-700/50 bg-gray-800/70 text-white focus:outline-none focus:ring-neon-purple focus:border-neon-purple sm:text-sm rounded-lg shadow-md backdrop-blur-sm"
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value)}
                        >
                            <option value="subscriptions">My Subscriptions</option>
                            <option value="messages">Messages</option>
                        </select>
                    </div>
                    <div className="hidden sm:block">
                        <div className="border-b border-gray-700/50">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('subscriptions')}
                                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-150 ease-in-out focus:outline-none
                                        ${activeTab === 'subscriptions' ? 'border-neon-purple text-neon-purple' : 'border-transparent text-gray-400 hover:text-gray-100 hover:border-gray-500'}`}
                                >
                                    <SubscriptionIcon /> My Subscriptions
                                </button>
                                <button
                                    onClick={() => setActiveTab('messages')}
                                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-150 ease-in-out focus:outline-none
                                        ${activeTab === 'messages' ? 'border-neon-purple text-neon-purple' : 'border-transparent text-gray-400 hover:text-gray-100 hover:border-gray-500'}`}
                                >
                                    <MessageIcon /> Messages
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="bg-black/50 backdrop-blur-xl border border-gray-700/40 rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 min-h-[50vh]">
                    {activeTab === 'subscriptions' && (
                        <div>
                            <h1 className="text-4xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.1), 0 0 30px rgba(200, 200, 255, 0.05)' }}>
                                Your Active & Recent Orders
                            </h1>
                            {loadingOrders && <div className="mt-10"><LoadingSpinner /></div>}
                            {!loadingOrders && errorOrders && <ErrorMessage message={errorOrders} onRetry={fetchMyOrders} />}
                            {!loadingOrders && !errorOrders && myOrders.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-3 text-xl font-semibold text-gray-300">No Orders Yet</h3>
                                    <p className="mt-1.5 text-sm text-gray-500">
                                        {currentUser?._id ? "It looks like you haven't placed any orders." : "Please log in to see your orders."}
                                    </p>
                                    <div className="mt-8">
                                        <Link
                                            to="/subscriptions"
                                            className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-sm font-semibold rounded-lg text-black bg-neon-purple hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-neon-purple transition-transform hover:scale-105"
                                        >
                                            Explore Subscriptions
                                        </Link>
                                    </div>
                                </div>
                            )}
                            {!loadingOrders && !errorOrders && myOrders.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {myOrders.map((order, index) => {
                                        console.log("[BuyerDashboard] Rendering order:", JSON.stringify(order, null, 2));

                                        const theme = cardThemes[index % cardThemes.length];
                                        const progressPercent = getStatusProgress(order.status);

                                        const firstOrderItem = order.orderItems && order.orderItems.length > 0 ? order.orderItems[0] : {};
                                        const listingDetails = firstOrderItem.listing || {};
                                        const seller = listingDetails.sellerId || {};

                                        const itemTitle = firstOrderItem.title || listingDetails.title || 'Subscription Title';
                                        const itemImage = firstOrderItem.image || listingDetails.image;
                                        const itemCategory = listingDetails.category || 'Category';
                                        const itemDuration = firstOrderItem.duration || listingDetails.duration || 'N/A';

                                        return (
                                            <div
                                                key={order._id}
                                                className="card-container group relative text-white rounded-[2.25rem] shadow-xl flex flex-col min-h-[24rem] w-full transition-all duration-300 ease-in-out"
                                                style={{
                                                    background: theme.bgColor,
                                                    '--card-accent-color': theme.accentColor,
                                                    '--card-border-color': theme.borderColor,
                                                    '--card-glow-color': theme.glowColor
                                                }}
                                            >
                                                <div className="card-border-glow group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out" />
                                                <div className="relative z-10 flex flex-col flex-grow">
                                                    <div className="flex items-center justify-between p-5 pt-4 pb-2">
                                                        <div className="text-xs text-gray-300">
                                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </div>
                                                        <button className="text-gray-500 hover:text-white focus:outline-none p-1 rounded-full hover:bg-white/10">
                                                            <OptionsIcon />
                                                        </button>
                                                    </div>
                                                    <div className="flex-grow flex flex-col justify-center items-center text-center p-5 pt-0">
                                                        {itemImage ? (
                                                            <div className="w-full h-32 sm:h-36 mb-4 rounded-xl overflow-hidden shadow-md bg-gray-700/50">
                                                                <img
                                                                    src={`${IMAGE_BASE_URL}/Uploads/${itemImage}`}
                                                                    alt={itemTitle}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.src = 'https://placehold.co/800x450/1F2937/4B5563?text=No+Image';
                                                                    }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-32 sm:h-36 mb-4 rounded-xl overflow-hidden shadow-md bg-gray-700/50 flex items-center justify-center text-gray-400">
                                                                No Image
                                                            </div>
                                                        )}
                                                        <h3 className="text-xl font-semibold mb-1 capitalize truncate w-full text-gray-50" title={itemTitle}>
                                                            {itemTitle}
                                                        </h3>
                                                        <p className="text-sm text-gray-400 mb-1">
                                                            {itemCategory}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mb-4">
                                                            Duration: {itemDuration}
                                                        </p>
                                                        <div className="w-full px-3">
                                                            <div className="flex justify-between text-xs text-gray-300 mb-1">
                                                                <span>Status</span>
                                                                <span>{progressPercent}%</span>
                                                            </div>
                                                            <div className="w-full bg-black/30 rounded-full h-1.5">
                                                                <div
                                                                    className="h-full rounded-full transition-all duration-500 ease-out"
                                                                    style={{ width: `${progressPercent}%`, backgroundColor: 'var(--card-accent-color)' }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-[#151419]/80 p-4 rounded-b-[2.15rem] border-t border-black/40 mt-auto">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <div className="flex items-center -space-x-2">
                                                                {seller.avatar ? (
                                                                    <img src={`${IMAGE_BASE_URL}/Uploads/${seller.avatar}`} alt={seller.name || 'Seller'} className="w-7 h-7 rounded-full object-cover border-2 border-gray-600" />
                                                                ) : (
                                                                    <div className="w-7 h-7 rounded-full bg-gray-500 flex items-center justify-center text-xs font-semibold border-2 border-gray-600">
                                                                        {getInitials(seller.name)}
                                                                    </div>
                                                                )}
                                                                <span className="pl-3 text-xs text-gray-400 truncate">{seller.name || 'Unknown Seller'}</span>
                                                            </div>
                                                            <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'var(--card-accent-color)' }}>
                                                                {getDisplayStatusText(order.status, order)}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleContactSeller(seller._id)}
                                                                disabled={!seller._id || currentUser?._id === seller._id}
                                                                className="flex-1 py-2 px-3 text-xs font-medium text-center rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                                style={{ borderColor: 'var(--card-accent-color)', color: 'var(--card-accent-color)' }}
                                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--card-accent-color)'; e.currentTarget.style.color = '#151419'; }}
                                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--card-accent-color)'; }}
                                                            >
                                                                Contact Seller
                                                            </button>
                                                            <Link
                                                                to={`/order-confirmation/${order._id}`}
                                                                className="flex-1 block text-center py-2 px-3 text-xs font-medium rounded-lg border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white transition-colors"
                                                            >
                                                                View Details
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'messages' && (
                        <div>
                            <h1 className="text-4xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500" style={{ textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>
                                Your Conversations
                            </h1>
                            <div className="bg-gray-800/50 p-8 rounded-xl text-center border border-purple-500/30 shadow-xl">
                                <MessageIcon />
                                <p className="text-gray-300 mt-3 text-lg">
                                    All your messages are in one place.
                                </p>
                                <div className="mt-8">
                                    <Link to="/chats" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-semibold rounded-lg shadow-lg text-black bg-neon-purple hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-neon-purple transition-transform hover:scale-105">
                                        Go to All Chats
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <style jsx global>{`
                body {
                    font-family: 'Inter', 'Helvetica Neue', sans-serif;
                    overflow-x: hidden;
                    background-color: #050505;
                    color: white;
                    min-height: 100vh;
                }
                .gradient-background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden; }
                .gradient-sphere { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; }
                .gradient-sphere.sphere-1.gradient-sphere-buyer-dashboard { width: 45vw; height: 45vw; min-width: 300px; min-height: 300px; background: linear-gradient(40deg, rgba(255, 0, 128, 0.6), rgba(255, 102, 0, 0.3)); top: -15%; left: -15%; animation: float-1 20s ease-in-out infinite alternate; }
                .gradient-sphere.sphere-2.gradient-sphere-buyer-dashboard { width: 50vw; height: 50vw; min-width: 350px; min-height: 350px; background: linear-gradient(240deg, rgba(72, 0, 255, 0.6), rgba(0, 183, 255, 0.3)); bottom: -25%; right: -15%; animation: float-2 22s ease-in-out infinite alternate; }
                .gradient-sphere.sphere-3.gradient-sphere-buyer-dashboard { width: 35vw; height: 35vw; min-width: 250px; min-height: 250px; background: linear-gradient(120deg, rgba(133, 89, 255, 0.4), rgba(98, 216, 249, 0.25)); top: 50%; left: 25%; transform: translate(-50%, -50%); animation: float-3 25s ease-in-out infinite alternate; }
                .noise-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.03; z-index: 1; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
                .grid-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: 50px 50px; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px); z-index: 0; }
                .glow { position: absolute; width: 50vw; height: 50vh; background: radial-gradient(circle, rgba(138, 43, 226, 0.1), transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; animation: pulse 10s infinite alternate; filter: blur(50px); }
                @keyframes float-1 { 0% { transform: translate(0, 0) scale(1); opacity: 0.5; } 100% { transform: translate(15vw, 10vh) scale(1.15); opacity: 0.7; } }
                @keyframes float-2 { 0% { transform: translate(0, 0) scale(1); opacity: 0.6; } 100% { transform: translate(-10vw, -15vh) scale(1.2); opacity: 0.4; } }
                @keyframes float-3 { 0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; } 100% { transform: translate(calc(-50% + 5vw), calc(-50% - 10vh)) scale(1.1); opacity: 0.5; } }
                @keyframes pulse { 0% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.9); } 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); } }
                .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; }
                .particle-buyer-dashboard { position: absolute; background: white; border-radius: 50%; opacity: 0; pointer-events: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(31, 41, 55, 0.3); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(107, 114, 128, 0.5); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(107, 114, 128, 0.7); }
                .card-container::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 2.25rem; z-index: 0; border: 2px solid transparent; background: linear-gradient(45deg, #232228, #232228, #232228, #232228, var(--card-border-color)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask-composite: exclude; opacity: 0.7; }
                .card-border-glow { content: ""; position: absolute; top: -2px; left: -2px; width: calc(100% + 4px); height: calc(100% + 4px); border-radius: 2.35rem; z-index: -1; box-shadow: 0 0 20px -2px var(--card-glow-color); pointer-events: none; }
                :root { --neon-purple: #8B5CF6; }
                .text-neon-purple { color: var(--neon-purple); }
                .bg-neon-purple { background-color: var(--neon-purple); }
                .border-neon-purple { border-color: var(--neon-purple); }
            `}</style>
        </div>
    );
};

export default BuyerDashboard;