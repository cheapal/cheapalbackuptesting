// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { listingService, userService, chatService } from '../services/apiService';
// import { useAuth } from '../context/authContext';
// import { toast } from 'react-toastify';
// import ProfileBadges from './ProfileBadge';

// // --- Icons (Heroicons or similar SVGs) ---
// const MailIcon = (props) => (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
//         <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
//         <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
//     </svg>
// );
// const UserPlusIcon = (props) => (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
//         <path d="M10.5 6a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z" />
//         <path fillRule="evenodd" d="M15.75 8.25a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM14.25 3.75a.75.75 0 0 0-1.5 0v2.25h-2.25a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25h2.25a.75.75 0 0 0 0-1.5h-2.25V3.75Z" clipRule="evenodd" />
//         <path fillRule="evenodd" d="M3 18.75a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0-.75.75ZM3 12.75a.75.75 0 0 0 .75.75h7.5a.75.75 0 0 0 0-1.5h-7.5a.75.75 0 0 0-.75.75ZM3 6.75a.75.75 0 0 0 .75.75h9.75a.75.75 0 0 0 0-1.5h-9.75a.75.75 0 0 0-.75.75Z" clipRule="evenodd" />
//     </svg>
// );
// const InformationCircleIconSM = (props) => (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
//         <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
//     </svg>
// );
// const StarIconSolid = (props) => (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
//         <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
//     </svg>
// );
// const StarIconOutline = (props) => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.82.61l-4.725-2.885a.562.562 0 0 0-.652 0l-4.725 2.885a.562.562 0 0 1-.82-.61l1.285-5.385a.562.563 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
//     </svg>
// );

// // --- Animated Background Component ---
// const AnimatedGradientBackground = () => {
//     useEffect(() => {
//         const particlesContainer = document.getElementById('particles-container-public-profile');
//         if (!particlesContainer) return;
//         const particleCount = 30;
//         while (particlesContainer.firstChild) {
//             particlesContainer.removeChild(particlesContainer.firstChild);
//         }

//         const createParticle = () => {
//             const particle = document.createElement('div');
//             particle.className = 'particle-public-profile';
//             const size = Math.random() * 2.5 + 0.5;
//             particle.style.width = `${size}px`;
//             particle.style.height = `${size}px`;
//             particle.style.position = 'absolute';
//             particle.style.background = 'white';
//             particle.style.borderRadius = '50%';
//             particle.style.opacity = '0';
//             particle.style.pointerEvents = 'none';
//             resetParticle(particle);
//             particlesContainer.appendChild(particle);
//             animateParticle(particle);
//         };

//         const resetParticle = (particle) => {
//             const posX = Math.random() * 100;
//             const posY = Math.random() * 100;
//             particle.style.left = `${posX}%`;
//             particle.style.top = `${posY}%`;
//             particle.style.opacity = '0';
//             particle.style.transform = 'scale(0.5)';
//         };

//         const animateParticle = (particle) => {
//             const duration = Math.random() * 18 + 12;
//             const delay = Math.random() * 12;
//             const timeoutId = setTimeout(() => {
//                 if (!particlesContainer || !particlesContainer.contains(particle)) return;
//                 particle.style.transition = `all ${duration}s linear`;
//                 particle.style.opacity = (Math.random() * 0.2 + 0.03).toString();
//                 particle.style.transform = 'scale(1)';
//                 const moveX = parseFloat(particle.style.left) + (Math.random() * 40 - 20);
//                 const moveY = parseFloat(particle.style.top) - (Math.random() * 50 + 15);
//                 particle.style.left = `${moveX}%`;
//                 particle.style.top = `${moveY}%`;
//                 const reanimateTimeoutId = setTimeout(() => {
//                     if (particlesContainer && particlesContainer.contains(particle)) {
//                         resetParticle(particle);
//                         animateParticle(particle);
//                     }
//                 }, duration * 1000);
//                 particle.dataset.reanimateTimeoutId = reanimateTimeoutId;
//             }, delay * 1000);
//             particle.dataset.animateTimeoutId = timeoutId;
//         };

//         for (let i = 0; i < particleCount; i++) createParticle();

//         return () => {
//             const particles = particlesContainer.querySelectorAll('.particle-public-profile');
//             particles.forEach(p => {
//                 if (p.dataset.animateTimeoutId) clearTimeout(p.dataset.animateTimeoutId);
//                 if (p.dataset.reanimateTimeoutId) clearTimeout(p.dataset.reanimateTimeoutId);
//             });
//         };
//     }, []);

//     return (
//         <div className="gradient-background">
//             <div className="gradient-sphere sphere-1"></div>
//             <div className="gradient-sphere sphere-2"></div>
//             <div className="glow"></div>
//             <div className="grid-overlay"></div>
//             <div className="noise-overlay"></div>
//             <div className="particles-container" id="particles-container-public-profile"></div>
//         </div>
//     );
// };

// // --- Reusable UI Components ---
// const LoadingSpinner = ({ size = 'h-12 w-12', color = 'border-neon-purple' }) => (
//     <div className="flex flex-col justify-center items-center py-20">
//         <div className={`animate-spin rounded-full ${size} border-t-4 border-b-4 ${color}`}></div>
//         <p className="mt-4 text-lg text-gray-300">Loading Profile...</p>
//     </div>
// );

// const ErrorMessage = ({ message, details }) => (
//     <div className="bg-red-800/30 border border-red-700/50 text-red-200 p-6 rounded-xl text-center my-10 shadow-xl max-w-md mx-auto">
//         <div className="flex flex-col items-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//             </svg>
//             <p className="font-semibold text-xl mb-2">Oops! An Error Occurred</p>
//             <span className="text-md">{message || 'Could not load profile details.'}</span>
//             {details && <span className="text-sm mt-2 text-red-300">{details}</span>}
//         </div>
//     </div>
// );

// const StarRatingDisplay = ({ rating, totalReviews, iconSize = "h-5 w-5" }) => {
//     const fullStars = Math.floor(rating);
//     const halfStar = rating % 1 >= 0.5;
//     const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//     return (
//         <div className="flex items-center">
//             {[...Array(fullStars)].map((_, i) => <StarIconSolid key={`full-${i}`} className={`${iconSize} text-yellow-400`} />)}
//             {halfStar && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${iconSize} text-yellow-400`}><path d="M12 17.27l-5.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-6.46 4.73 1.64 7.03L12 17.27zM12 14.8V4.53l-1.65 3.9L6.3 8.78l3.85 2.81-.97 4.15L12 14.8z"></path></svg>}
//             {[...Array(emptyStars)].map((_, i) => <StarIconOutline key={`empty-${i}`} className={`${iconSize} text-yellow-400`} />)}
//             {totalReviews !== undefined && <span className="ml-2 text-sm text-gray-400">({totalReviews} reviews)</span>}
//         </div>
//     );
// };

// // Helper function to format duration string
// const formatDuration = (durationStr) => {
//     if (!durationStr || typeof durationStr !== 'string') return 'Per Item';
//     const lowerDuration = durationStr.toLowerCase().trim();
//     const monthMatch = lowerDuration.match(/(\d+)\s*month/);
//     if (monthMatch) {
//         const months = parseInt(monthMatch[1], 10);
//         return `${months} Month${months > 1 ? 's' : ''}`;
//     }
//     const yearMatch = lowerDuration.match(/(\d+)\s*year/);
//     if (yearMatch) {
//         const years = parseInt(yearMatch[1], 10);
//         return `${years} Year${years > 1 ? 's' : ''}`;
//     }
//     if (lowerDuration.includes('lifetime')) {
//         return 'Lifetime';
//     }
//     return durationStr.charAt(0).toUpperCase() + durationStr.slice(1);
// };

// const SellerProfilePage = () => {
//     const { sellerId } = useParams();
//     const { user: currentUser } = useAuth();
//     const navigate = useNavigate();

//     const [seller, setSeller] = useState(null);
//     const [listings, setListings] = useState([]);
//     const [reviews, setReviews] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [errorDetails, setErrorDetails] = useState('');
//     const [activeTab, setActiveTab] = useState('listings');

//     const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace('/api', '');
//     const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

//     useEffect(() => {
//         console.log("[SellerProfilePage] Param sellerId from URL:", sellerId);
//         if (!sellerId) {
//             console.error("[SellerProfilePage] sellerId is missing from URL params.");
//             setError("Cannot load profile.");
//             setErrorDetails("Seller ID is missing from the URL.");
//             setLoading(false);
//         }
//     }, [sellerId]);

//     const fetchProfileData = useCallback(async () => {
//         if (!sellerId) {
//             setError("Seller ID is missing.");
//             setErrorDetails("The seller identifier was not found in the page address.");
//             setLoading(false);
//             return;
//         }

//         console.log(`[SellerProfilePage] Starting fetchProfileData for sellerId: ${sellerId}`);
//         setLoading(true);
//         setError(null);
//         setErrorDetails('');
//         setSeller(null);
//         setListings([]);
//         setReviews([]);

//         try {
//             console.log(`[SellerProfilePage] Fetching profile for sellerId: ${sellerId}`);
//             let apiResponse;
//             if (currentUser && currentUser._id === sellerId) {
//                 apiResponse = await userService.getUser(sellerId);
//             } else {
//                 apiResponse = await userService.getPublicProfileById(sellerId);
//             }

//             console.log("[SellerProfilePage] Full API response received:", apiResponse);
//             const sellerData = apiResponse?.data;

//             if (!apiResponse || !apiResponse.success || !sellerData) {
//                 console.error("[SellerProfilePage] API call failed or returned no data. Response:", apiResponse);
//                 throw new Error(apiResponse?.message || "Seller profile data not found.");
//             }

//             console.log("[SellerProfilePage] Extracted sellerData:", sellerData);

//             if (!sellerData.role || sellerData.role !== 'seller') {
//                 console.error(`[SellerProfilePage] User found (ID: ${sellerId}), but role is invalid: ${sellerData.role || 'undefined'}`);
//                 throw new Error(`This user is not a seller.`);
//             }
//             console.log("[SellerProfilePage] Seller data validated successfully (role is 'seller').");
//             setSeller(sellerData);

//             console.log(`[SellerProfilePage] Fetching listings for sellerId: ${sellerId}`);
//             const listingsApiResponse = await listingService.getBySeller(sellerId);
//             let sellerListingsData = [];
//             if (listingsApiResponse?.success && Array.isArray(listingsApiResponse.data)) {
//                 sellerListingsData = listingsApiResponse.data;
//             } else if (Array.isArray(listingsApiResponse)) {
//                 sellerListingsData = listingsApiResponse;
//             }
//             console.log("[SellerProfilePage] Raw listings data received:", sellerListingsData);
//             setListings((sellerListingsData || []).filter(l => l.status === 'approved'));

//             const mockReviews = Array.from({ length: Math.floor(Math.random() * 10) + 2 }, (_, i) => ({
//                 _id: `review${i}${Date.now()}${sellerId}`,
//                 reviewer: { name: `Buyer ${String.fromCharCode(65 + i)}`, avatar: null },
//                 rating: Math.floor(Math.random() * 3) + 3,
//                 comment: "Great seller, fast delivery and excellent communication. Highly recommended! ".repeat(Math.ceil(Math.random() * 3)),
//                 createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
//             }));
//             setReviews(mockReviews);

//             setSeller(currentSellerData => ({
//                 ...currentSellerData,
//                 averageRating: currentSellerData?.averageRating || mockReviews.reduce((acc, r) => acc + r.rating, 0) / (mockReviews.length || 1),
//                 totalReviews: currentSellerData?.totalReviews || mockReviews.length
//             }));
//         } catch (err) {
//             console.error("[SellerProfilePage] Error in fetchProfileData:", err);
//             setError("Failed to load seller profile.");
//             setErrorDetails(err.message === "User not found." ? "The requested seller profile does not exist." : err.message || "An unexpected issue occurred. Please try again later.");
//             setSeller(null);
//             setListings([]);
//             setReviews([]);
//         } finally {
//             setLoading(false);
//             console.log("[SellerProfilePage] fetchProfileData finished.");
//         }
//     }, [sellerId, currentUser]);

//     useEffect(() => {
//         if (sellerId) {
//             fetchProfileData();
//         }
//     }, [fetchProfileData, sellerId]);

//     const handleContactSeller = async () => {
//         if (!seller || !currentUser) {
//             toast.info("Please log in to contact sellers.");
//             navigate('/login', { state: { from: `/profile/${sellerId}` } });
//             return;
//         }
//         if (currentUser._id === seller._id) {
//             toast.warn("You cannot start a chat with yourself.");
//             return;
//         }
//         try {
//             const response = await chatService.accessChat(seller._id);
//             if (response.success && response.data?._id) {
//                 navigate(`/chat/${response.data._id}`);
//             } else {
//                 throw new Error(response.message || "Could not initiate chat.");
//             }
//         } catch (err) {
//             toast.error(err.message || "Could not start chat.");
//         }
//     };

//     const handleFollowSeller = () => {
//         toast.info(`Following ${seller?.name || 'this seller'}... (Feature coming soon!)`);
//     };

//     const cardThemes = [
//         { name: 'purple', accentColor: '#8c4cd0', borderColor: '#8c4cd0', glowColor: 'rgba(140, 76, 208, 0.4)' },
//         { name: 'blue', accentColor: '#1890ff', borderColor: '#1890ff', glowColor: 'rgba(24, 144, 255, 0.4)' },
//         { name: 'green', accentColor: '#01c3a8', borderColor: '#01c3a8', glowColor: 'rgba(1, 195, 168, 0.4)' },
//     ];

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-black text-white flex flex-col relative">
//                 <AnimatedGradientBackground />
//                 <div className="relative z-10 flex-grow flex items-center justify-center">
//                     <LoadingSpinner />
//                 </div>
//             </div>
//         );
//     }
//     if (error) {
//         return (
//             <div className="min-h-screen bg-black text-white flex flex-col relative">
//                 <AnimatedGradientBackground />
//                 <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-4">
//                     <ErrorMessage message={error} details={errorDetails} />
//                     <Link to="/" className="mt-6 px-6 py-2 bg-neon-purple text-black font-semibold rounded-lg hover:brightness-110 transition-all">
//                         Back to Home
//                     </Link>
//                 </div>
//             </div>
//         );
//     }
//     if (!seller && !loading) {
//         return (
//             <div className="min-h-screen bg-black text-white flex flex-col relative">
//                 <AnimatedGradientBackground />
//                 <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 text-center">
//                     <ErrorMessage message="Seller profile could not be loaded." details="The seller data is unavailable or the ID is invalid." />
//                     <Link to="/" className="mt-6 px-6 py-2 bg-neon-purple text-black font-semibold rounded-lg hover:brightness-110 transition-all">
//                         Go back
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     if (!seller) return null;

//     const averageRating = seller?.averageRating || 0;
//     const totalReviewsCount = seller?.totalReviews || reviews.length;

//     return (
//         <div className="min-h-screen text-gray-100 font-sans flex flex-col relative">
//             <AnimatedGradientBackground />
//             <nav className="bg-black/30 backdrop-blur-md shadow-lg sticky top-0 z-30 border-b border-gray-700/50">
//                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
//                     <Link to="/" className="text-3xl font-bold tracking-tight transition-transform hover:scale-105">
//                         <span className="text-white">Cheap</span><span className="text-neon-purple">al</span>
//                     </Link>
//                     <div className="flex items-center space-x-4">
//                         <Link to="/listings" className="text-sm text-gray-300 hover:text-neon-purple">Browse Listings</Link>
//                         <Link to="/leaderboard" className="text-sm text-gray-300 hover:text-neon-purple">Leaderboard</Link>
//                         {!currentUser && <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">Login</Link>}
//                         {currentUser && <Link to="/profile" className="text-sm text-gray-300 hover:text-neon-purple">My Profile</Link>}
//                     </div>
//                 </div>
//             </nav>

//             <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-grow relative z-10">
//                 <div className="profile-card-public bg-black/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl shadow-2xl overflow-hidden">
//                     <div className="profile-header-public h-40 md:h-56 bg-cover bg-center relative" style={{ backgroundImage: `url(${seller.bannerUrl || `https://placehold.co/1200x300/1A1A2E/333344?text=${encodeURIComponent(seller.name || 'Seller Banner')}`})` }}>
//                         <div className="main-profile-public absolute left-6 md:left-10 -bottom-12 md:-bottom-16 flex items-end space-x-4">
//                             <div className="profile-image-public w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black/50 bg-gray-700 flex items-center justify-center text-4xl text-white font-bold overflow-hidden shadow-lg">
//                                 {seller.avatar ? (
//                                     <img
//                                         src={`${IMAGE_BASE_URL}/Uploads/${seller.avatar}`}
//                                         alt={seller.name}
//                                         className="w-full h-full object-cover"
//                                         onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span className="text-4xl font-bold">${getInitials(seller.name)}</span>`; }}
//                                     />
//                                 ) : (
//                                     <span>{getInitials(seller.name)}</span>
//                                 )}
//                             </div>
//                             <div className="profile-names-public pb-1 md:pb-2">
//                                 <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
//                                     {seller.name}
//                                     {seller.verificationStatus === 'verified' && (
//                                         <svg className="h-9 w-9 text-neon-green" fill="currentColor" viewBox="0 0 20 20">
//                                             <path
//                                                 fillRule="evenodd"
//                                                 d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                                                 clipRule="evenodd"
//                                             />
//                                         </svg>
//                                     )}
//                                     <ProfileBadges badges={seller.badges} size="sm" />
//                                 </h1>
//                                 <p className="text-xs md:text-sm text-gray-400">@{seller.username || (seller.email ? seller.email.split('@')[0] : 'username')}</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="profile-body-public pt-16 md:pt-20 px-6 md:px-10 pb-8 md:pb-10">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
//                             <div className="md:col-span-1 space-y-6">
//                                 <div className="profile-actions-public space-y-3">
//                                     {currentUser && seller && currentUser._id !== seller._id && (
//                                         <button
//                                             onClick={handleContactSeller}
//                                             className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-neon-purple text-black font-semibold rounded-lg hover:brightness-110 transition-colors"
//                                         >
//                                             <MailIcon className="w-5 h-5" /> Message Seller
//                                         </button>
//                                     )}
//                                     <button
//                                         onClick={handleFollowSeller}
//                                         className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-700/70 text-gray-200 hover:bg-gray-600/70 border border-gray-600 rounded-lg font-semibold transition-colors"
//                                     >
//                                         <UserPlusIcon className="w-5 h-5" /> Follow Seller
//                                     </button>
//                                 </div>

//                                 <section className="bio-public bg-gray-800/40 p-4 rounded-lg border border-gray-700/50">
//                                     <div className="bio-header-public flex items-center text-gray-300 mb-2">
//                                         <InformationCircleIconSM className="w-5 h-5 mr-1.5 text-neon-purple" />
//                                         <h3 className="font-semibold text-sm uppercase tracking-wider">About Seller</h3>
//                                     </div>
//                                     <p className="bio-text-public text-sm text-gray-400 leading-relaxed">
//                                         {seller.bio || "This seller hasn't added a bio yet."}
//                                     </p>
//                                 </section>

//                                 <div className="seller-stats-public space-y-3">
//                                     <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
//                                         <StarIconSolid className="w-4 h-4 text-neon-purple" />Seller Stats
//                                     </h3>
//                                     <div className="data-item-public flex justify-between items-center text-sm p-2.5 bg-gray-800/30 rounded-md border border-gray-700/30">
//                                         <span className="text-gray-400">Avg. Rating:</span>
//                                         <StarRatingDisplay rating={averageRating} totalReviews={totalReviewsCount} iconSize="h-4 w-4" />
//                                     </div>
//                                     <div className="data-item-public flex justify-between items-center text-sm p-2.5 bg-gray-800/30 rounded-md border border-gray-700/30">
//                                         <span className="text-gray-400">Total Sales:</span>
//                                         <span className="font-semibold text-white">{seller.totalSalesCount || 0}</span>
//                                     </div>
//                                     <div className="data-item-public flex justify-between items-center text-sm p-2.5 bg-gray-800/30 rounded-md border border-gray-700/30">
//                                         <span className="text-gray-400">Listings:</span>
//                                         <span className="font-semibold text-white">{listings.length}</span>
//                                     </div>
//                                     <div className="data-item-public flex justify-between items-center text-sm p-2.5 bg-gray-800/30 rounded-md border border-gray-700/30">
//                                         <span className="text-gray-400">Joined:</span>
//                                         <span className="font-semibold text-white">{new Date(seller.createdAt || Date.now()).toLocaleDateString()}</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="md:col-span-2">
//                                 <div className="mb-6 border-b border-gray-700/50">
//                                     <nav className="-mb-px flex space-x-6" aria-label="Tabs">
//                                         <button
//                                             onClick={() => setActiveTab('listings')}
//                                             className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'listings' ? 'border-neon-purple text-neon-purple' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
//                                         >
//                                             Listings ({listings.length})
//                                         </button>
//                                         <button
//                                             onClick={() => setActiveTab('reviews')}
//                                             className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'reviews' ? 'border-neon-purple text-neon-purple' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
//                                         >
//                                             Reviews ({totalReviewsCount})
//                                         </button>
//                                     </nav>
//                                 </div>

//                                 {activeTab === 'listings' && (
//                                     listings.length > 0 ? (
//                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                                             {listings.map((listing, index) => {
//                                                 const theme = cardThemes[index % cardThemes.length];
//                                                 return (
//                                                     <Link
//                                                         key={listing._id}
//                                                         to={`/subscriptions/${listing._id}`}
//                                                         className="block group rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_-7px_var(--card-glow-color)]"
//                                                         style={{ '--card-glow-color': theme.glowColor }}
//                                                     >
//                                                         <div className="bg-gray-800/60 border border-gray-700/50 h-full flex flex-col" style={{ borderColor: theme.borderColor }}>
//                                                             <div className="aspect-[16/9] bg-gray-700/40 overflow-hidden">
//                                                                 <img
//                                                                     src={listing.image ? `${IMAGE_BASE_URL}/Uploads/${listing.image}` : `https://placehold.co/300x170/1F2937/4B5563?text=${encodeURIComponent(listing.title || 'Listing')}`}
//                                                                     alt={listing.title}
//                                                                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                                                                     onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x170/1F2937/4B5563?text=No+Image`; }}
//                                                                 />
//                                                             </div>
//                                                             <div className="p-4 flex flex-col flex-grow">
//                                                                 <h3
//                                                                     className="text-base font-semibold text-white truncate group-hover:text-[var(--card-accent-color)] transition-colors"
//                                                                     style={{ '--card-accent-color': theme.accentColor }}
//                                                                     title={listing.title}
//                                                                 >
//                                                                     {listing.title}
//                                                                 </h3>
//                                                                 <p className="text-xs text-gray-400 capitalize mb-2">{listing.category}</p>
//                                                                 <div className="mt-auto">
//                                                                     <p className="text-md font-bold" style={{ color: theme.accentColor }}>
//                                                                         ${typeof listing.price === 'number' ? listing.price.toFixed(2) : listing.price}
//                                                                         <span className="text-xs text-gray-400"> / {formatDuration(listing.duration)}</span>
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </Link>
//                                                 );
//                                             })}
//                                         </div>
//                                     ) : (
//                                         <p className="text-center text-gray-400 py-10">This seller currently has no active listings.</p>
//                                     )
//                                 )}

//                                 {activeTab === 'reviews' && (
//                                     reviews.length > 0 ? (
//                                         <div className="space-y-5">
//                                             {reviews.map(review => (
//                                                 <div key={review._id} className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-4 shadow-sm">
//                                                     <div className="flex items-start space-x-3">
//                                                         <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-500">
//                                                             {review.reviewer?.avatar ? (
//                                                                 <img
//                                                                     src={`${IMAGE_BASE_URL}/Uploads/${review.reviewer.avatar}`}
//                                                                     alt={review.reviewer.name}
//                                                                     className="w-full h-full object-cover"
//                                                                 />
//                                                             ) : (
//                                                                 <span className="font-medium text-white text-sm">{getInitials(review.reviewer?.name || 'U')}</span>
//                                                             )}
//                                                         </div>
//                                                         <div className="flex-grow">
//                                                             <div className="flex justify-between items-center mb-0.5">
//                                                                 <h4 className="font-semibold text-sm text-gray-200">{review.reviewer?.name || 'Anonymous'}</h4>
//                                                                 <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
//                                                             </div>
//                                                             <StarRatingDisplay rating={review.rating} iconSize="h-4 w-4" />
//                                                             <p className="text-sm text-gray-300 mt-2 whitespace-pre-wrap leading-normal">{review.comment}</p>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <p className="text-center text-gray-400 py-10">This seller has no reviews yet.</p>
//                                     )
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>

//             <style jsx global>{`
//                 body { font-family: 'Inter', 'Helvetica Neue', sans-serif; overflow-x: hidden; background-color: #050505; color: white; min-height: 100vh; }
//                 .gradient-background, .noise-overlay, .grid-overlay, .glow { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden; }
//                 .gradient-sphere { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; }
//                 .gradient-sphere.sphere-1 { width: 45vw; height: 45vw; min-width: 300px; min-height: 300px; background: linear-gradient(40deg, rgba(123, 22, 255, 0.4), rgba(255, 102, 0, 0.2)); top: -15%; left: -15%; animation: float-1-profile-public 20s ease-in-out infinite alternate; }
//                 .gradient-sphere.sphere-2 { width: 50vw; height: 50vw; min-width: 350px; min-height: 350px; background: linear-gradient(240deg, rgba(72, 0, 255, 0.4), rgba(0, 183, 255, 0.25)); bottom: -25%; right: -15%; animation: float-2-profile-public 22s ease-in-out infinite alternate; }
//                 .noise-overlay { opacity: 0.02; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
//                 .grid-overlay { background-size: 50px 50px; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px); }
//                 .glow { width: 60vw; height: 60vh; background: radial-gradient(circle, rgba(138, 43, 226, 0.08), transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); animation: pulse-profile-public 12s infinite alternate; filter: blur(60px); }
//                 @keyframes float-1-profile-public {0% { transform: translate(0, 0) scale(1); opacity: 0.4; } 100% { transform: translate(10vw, 8vh) scale(1.1); opacity: 0.6; }}
//                 @keyframes float-2-profile-public {0% { transform: translate(0, 0) scale(1); opacity: 0.5; } 100% { transform: translate(-8vw, -12vh) scale(1.15); opacity: 0.3; }}
//                 @keyframes pulse-profile-public {0% { opacity: 0.1; transform: translate(-50%, -50%) scale(0.95); } 100% { opacity: 0.25; transform: translate(-50%, -50%) scale(1.05); }}
//                 .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
//             `}</style>
//         </div>
//     );
// };

// export default SellerProfilePage;


//from grok


import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { listingService, userService, chatService, reviewService } from '../services/apiService';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import ProfileBadges from './ProfileBadge';

// --- Icons (Heroicons or similar SVGs) ---
const MailIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
    </svg>
);
const UserPlusIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M10.5 6a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z" />
        <path fillRule="evenodd" d="M15.75 8.25a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM14.25 3.75a.75.75 0 0 0-1.5 0v2.25h-2.25a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25h2.25a.75.75 0 0 0 0-1.5h-2.25V3.75Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M3 18.75a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0-.75.75ZM3 12.75a.75.75 0 0 0 .75.75h7.5a.75.75 0 0 0 0-1.5h-7.5a.75.75 0 0 0-.75.75ZM3 6.75a.75.75 0 0 0 .75.75h9.75a.75.75 0 0 0 0-1.5h-9.75a.75.75 0 0 0-.75.75Z" clipRule="evenodd" />
    </svg>
);
const InformationCircleIconSM = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
    </svg>
);
const StarIconSolid = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
    </svg>
);
const StarIconOutline = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.82.61l-4.725-2.885a.562.562 0 0 0-.652 0l-4.725 2.885a.562.562 0 0 1-.82-.61l1.285-5.385a.563.563 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
);

// --- Animated Background Component ---
const AnimatedGradientBackground = () => {
    useEffect(() => {
        const particlesContainer = document.getElementById('particles-container-public-profile');
        if (!particlesContainer) return;
        const particleCount = 30;
        while (particlesContainer.firstChild) {
            particlesContainer.removeChild(particlesContainer.firstChild);
        }

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle-public-profile';
            const size = Math.random() * 2.5 + 0.5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.position = 'absolute';
            particle.style.background = 'white';
            particle.style.borderRadius = '50%';
            particle.style.opacity = '0';
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
            const timeoutId = setTimeout(() => {
                if (!particlesContainer || !particlesContainer.contains(particle)) return;
                particle.style.transition = `all ${duration}s linear`;
                particle.style.opacity = (Math.random() * 0.2 + 0.03).toString();
                particle.style.transform = 'scale(1)';
                const moveX = parseFloat(particle.style.left) + (Math.random() * 40 - 20);
                const moveY = parseFloat(particle.style.top) - (Math.random() * 50 + 15);
                particle.style.left = `${moveX}%`;
                particle.style.top = `${moveY}%`;
                const reanimateTimeoutId = setTimeout(() => {
                    if (particlesContainer && particlesContainer.contains(particle)) {
                        resetParticle(particle);
                        animateParticle(particle);
                    }
                }, duration * 1000);
                particle.dataset.reanimateTimeoutId = reanimateTimeoutId;
            }, delay * 1000);
            particle.dataset.animateTimeoutId = timeoutId;
        };

        for (let i = 0; i < particleCount; i++) createParticle();

        return () => {
            const particles = particlesContainer.querySelectorAll('.particle-public-profile');
            particles.forEach(p => {
                if (p.dataset.animateTimeoutId) clearTimeout(p.dataset.animateTimeoutId);
                if (p.dataset.reanimateTimeoutId) clearTimeout(p.dataset.reanimateTimeoutId);
            });
        };
    }, []);

    return (
        <div className="gradient-background">
            <div className="gradient-sphere sphere-1"></div>
            <div className="gradient-sphere sphere-2"></div>
            <div className="glow"></div>
            <div className="grid-overlay"></div>
            <div className="noise-overlay"></div>
            <div className="particles-container" id="particles-container-public-profile"></div>
        </div>
    );
};

// --- Reusable UI Components ---
const LoadingSpinner = ({ size = 'h-12 w-12', color = 'border-neon-purple' }) => (
    <div className="flex flex-col justify-center items-center py-20">
        <div className={`animate-spin rounded-full ${size} border-t-4 border-b-4 ${color}`}></div>
        <p className="mt-4 text-lg text-gray-300">Loading Profile...</p>
    </div>
);

const ErrorMessage = ({ message, details }) => (
    <div className="bg-red-800/30 border border-red-700/50 text-red-200 p-6 rounded-xl text-center my-10 shadow-xl max-w-md mx-auto">
        <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-semibold text-xl mb-2">Oops! An Error Occurred</p>
            <span className="text-md">{message || 'Could not load profile details.'}</span>
            {details && <span className="text-sm mt-2 text-red-300">{details}</span>}
        </div>
    </div>
);

const StarRatingDisplay = ({ rating, totalReviews, iconSize = "h-5 w-5" }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => <StarIconSolid key={`full-${i}`} className={`${iconSize} text-yellow-400`} />)}
            {halfStar && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${iconSize} text-yellow-400`}><path d="M12 17.27l-5.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-6.46 4.73 1.64 7.03L12 17.27zM12 14.8V4.53l-1.65 3.9L6.3 8.78l3.85 2.81-.97 4.15L12 14.8z"></path></svg>}
            {[...Array(emptyStars)].map((_, i) => <StarIconOutline key={`empty-${i}`} className={`${iconSize} text-yellow-400`} />)}
            {totalReviews !== undefined && <span className="ml-2 text-sm text-gray-400">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>}
        </div>
    );
};

// Helper function to format duration string
const formatDuration = (durationStr) => {
    if (!durationStr || typeof durationStr !== 'string') return 'Per Item';
    const lowerDuration = durationStr.toLowerCase().trim();
    const monthMatch = lowerDuration.match(/(\d+)\s*month/);
    if (monthMatch) {
        const months = parseInt(monthMatch[1], 10);
        return `${months} Month${months > 1 ? 's' : ''}`;
    }
    const yearMatch = lowerDuration.match(/(\d+)\s*year/);
    if (yearMatch) {
        const years = parseInt(yearMatch[1], 10);
        return `${years} Year${years > 1 ? 's' : ''}`;
    }
    if (lowerDuration.includes('lifetime')) {
        return 'Lifetime';
    }
    return durationStr.charAt(0).toUpperCase() + durationStr.slice(1);
};

const SellerProfilePage = () => {
    const { sellerId } = useParams();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const [seller, setSeller] = useState(null);
    const [listings, setListings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorDetails, setErrorDetails] = useState('');
    const [activeTab, setActiveTab] = useState('listings');

    const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace('/api', '');
    const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

    useEffect(() => {
        console.log("[SellerProfilePage] Param sellerId from URL:", sellerId);
        if (!sellerId) {
            console.error("[SellerProfilePage] sellerId is missing from URL params.");
            setError("Cannot load profile.");
            setErrorDetails("Seller ID is missing from the URL.");
            setLoading(false);
        }
    }, [sellerId]);

    const fetchProfileData = useCallback(async () => {
        if (!sellerId) {
            setError("Seller ID is missing.");
            setErrorDetails("The seller identifier was not found in the page address.");
            setLoading(false);
            return;
        }

        console.log(`[SellerProfilePage] Starting fetchProfileData for sellerId: ${sellerId}`);
        setLoading(true);
        setError(null);
        setErrorDetails('');
        setSeller(null);
        setListings([]);
        setReviews([]);

        try {
            console.log(`[SellerProfilePage] Fetching profile for sellerId: ${sellerId}`);
            let apiResponse;
            if (currentUser && currentUser._id === sellerId) {
                apiResponse = await userService.getUser(sellerId);
            } else {
                apiResponse = await userService.getPublicProfileById(sellerId);
            }

            console.log("[SellerProfilePage] Full API response received:", apiResponse);
            const sellerData = apiResponse?.data;

            if (!apiResponse || !apiResponse.success || !sellerData) {
                console.error("[SellerProfilePage] API call failed or returned no data. Response:", apiResponse);
                throw new Error(apiResponse?.message || "Seller profile data not found.");
            }

            console.log("[SellerProfilePage] Extracted sellerData:", sellerData);

            if (!sellerData.role || sellerData.role !== 'seller') {
                console.error(`[SellerProfilePage] User found (ID: ${sellerId}), but role is invalid: ${sellerData.role || 'undefined'}`);
                throw new Error(`This user is not a seller.`);
            }
            console.log("[SellerProfilePage] Seller data validated successfully (role is 'seller').");
            setSeller(sellerData);

            console.log(`[SellerProfilePage] Fetching listings for sellerId: ${sellerId}`);
            const listingsApiResponse = await listingService.getBySeller(sellerId);
            let sellerListingsData = [];
            if (listingsApiResponse?.success && Array.isArray(listingsApiResponse.data)) {
                sellerListingsData = listingsApiResponse.data;
            } else if (Array.isArray(listingsApiResponse)) {
                sellerListingsData = listingsApiResponse;
            }
            console.log("[SellerProfilePage] Raw listings data received:", sellerListingsData);
            setListings((sellerListingsData || []).filter(l => l.status === 'approved'));

            console.log(`[SellerProfilePage] Fetching reviews for sellerId: ${sellerId}`);
            const reviewsApiResponse = await reviewService.getReviewsForSeller(sellerId);
            let sellerReviewsData = [];
            if (reviewsApiResponse?.success && Array.isArray(reviewsApiResponse.data)) {
                sellerReviewsData = reviewsApiResponse.data;
            } else if (Array.isArray(reviewsApiResponse)) {
                sellerReviewsData = reviewsApiResponse;
            }
            console.log("[SellerProfilePage] Raw reviews data received:", sellerReviewsData);
            setReviews(sellerReviewsData || []);

            setSeller(currentSellerData => ({
                ...currentSellerData,
                averageRating: sellerData.averageRating || (sellerReviewsData.length
                    ? sellerReviewsData.reduce((acc, r) => acc + r.rating, 0) / sellerReviewsData.length
                    : 0),
                totalReviews: sellerData.totalReviews || sellerReviewsData.length
            }));
        } catch (err) {
            console.error("[SellerProfilePage] Error in fetchProfileData:", err);
            setError("Failed to load seller profile.");
            setErrorDetails(err.message === "User not found." ? "The requested seller profile does not exist." : err.message || "An unexpected issue occurred. Please try again later.");
            setSeller(null);
            setListings([]);
            setReviews([]);
        } finally {
            setLoading(false);
            console.log("[SellerProfilePage] fetchProfileData finished.");
        }
    }, [sellerId, currentUser]);

    useEffect(() => {
        if (sellerId) {
            fetchProfileData();
        }
    }, [fetchProfileData, sellerId]);

    const handleContactSeller = async () => {
        if (!seller || !currentUser) {
            toast.info("Please log in to contact sellers.");
            navigate('/login', { state: { from: `/profile/${sellerId}` } });
            return;
        }
        if (currentUser._id === seller._id) {
            toast.warn("You cannot start a chat with yourself.");
            return;
        }
        try {
            const response = await chatService.accessChat(seller._id);
            if (response.success && response.data?._id) {
                navigate(`/chat/${response.data._id}`);
            } else {
                throw new Error(response.message || "Could not initiate chat.");
            }
        } catch (err) {
            toast.error(err.message || "Could not start chat.");
        }
    };

    const handleFollowSeller = () => {
        toast.info(`Following ${seller?.name || 'this seller'}... (Feature coming soon!)`);
    };

    const cardThemes = [
        { name: 'purple', accentColor: '#8c4cd0', borderColor: '#8c4cd0', glowColor: 'rgba(140, 76, 208, 0.4)' },
        { name: 'blue', accentColor: '#1890ff', borderColor: '#1890ff', glowColor: 'rgba(24, 144, 255, 0.4)' },
        { name: 'green', accentColor: '#01c3a8', borderColor: '#01c3a8', glowColor: 'rgba(1, 195, 168, 0.4)' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col relative">
                <AnimatedGradientBackground />
                <div className="relative z-10 flex-grow flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col relative">
                <AnimatedGradientBackground />
                <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-4">
                    <ErrorMessage message={error} details={errorDetails} />
                    <Link to="/" className="mt-6 px-6 py-2 bg-neon-purple text-black font-semibold rounded-lg hover:brightness-110 transition-all">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }
    if (!seller && !loading) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col relative">
                <AnimatedGradientBackground />
                <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 text-center">
                    <ErrorMessage message="Seller profile could not be loaded." details="The seller data is unavailable or the ID is invalid." />
                    <Link to="/" className="mt-6 px-6 py-2 bg-neon-purple text-black font-semibold rounded-lg hover:brightness-110 transition-all">
                        Go back
                    </Link>
                </div>
            </div>
        );
    }

    if (!seller) return null;

    const averageRating = seller?.averageRating || 0;
    const totalReviewsCount = seller?.totalReviews || reviews.length;

    return (
        <div className="min-h-screen text-gray-100 font-sans flex flex-col relative">
            <AnimatedGradientBackground />
            <nav className="bg-black/30 backdrop-blur-md shadow-lg sticky top-0 z-30 border-b border-gray-700/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                    <Link to="/" className="text-3xl font-bold tracking-tight transition-transform hover:scale-105">
                        <span className="text-white">Cheap</span><span className="text-neon-purple">al</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link to="/listings" className="text-sm text-gray-300 hover:text-neon-purple">Browse Listings</Link>
                        <Link to="/leaderboard" className="text-sm text-gray-300 hover:text-neon-purple">Leaderboard</Link>
                        {!currentUser && <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">Login</Link>}
                        {currentUser && <Link to="/profile" className="text-sm text-gray-300 hover:text-neon-purple">My Profile</Link>}
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-grow relative z-10">
                <div className="profile-card-public bg-black/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="profile-header-public h-40 md:h-56 bg-cover bg-center relative" style={{ backgroundImage: `url(${seller.bannerUrl || `https://placehold.co/1200x300/1A1A2E/333344?text=${encodeURIComponent(seller.name || 'Seller Banner')}`})` }}>
                        <div className="main-profile-public absolute left-6 md:left-10 -bottom-12 md:-bottom-16 flex items-end space-x-4">
                            <div className="profile-image-public w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black/50 bg-gray-700 flex items-center justify-center text-4xl text-white font-bold overflow-hidden shadow-lg">
                                {seller.avatar ? (
                                    <img
                                        src={`${IMAGE_BASE_URL}/Uploads/${seller.avatar}`}
                                        alt={seller.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span className="text-4xl font-bold">${getInitials(seller.name)}</span>`; }}
                                    />
                                ) : (
                                    <span>{getInitials(seller.name)}</span>
                                )}
                            </div>
                            <div className="profile-names-public pb-1 md:pb-2">
                                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                                    {seller.name}
                                    {seller.verificationStatus === 'verified' && (
                                        <svg className="h-9 w-9 text-neon-green" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                    <ProfileBadges badges={seller.badges} size="sm" />
                                </h1>
                                <p className="text-xs md:text-sm text-gray-400">@{seller.username || (seller.email ? seller.email.split('@')[0] : 'username')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="profile-body-public pt-16 md:pt-20 px-6 md:px-10 pb-8 md:pb-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            <div className="md:col-span-1 space-y-6">
                                <div className="profile-actions-public space-y-3">
                                    {currentUser && seller && currentUser._id !== seller._id && (
                                        <button
                                            onClick={handleContactSeller}
                                            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-neon-purple text-black font-semibold rounded-lg hover:brightness-110 transition-colors"
                                        >
                                            <MailIcon className="w-5 h-5" /> Message Seller
                                        </button>
                                    )}
                                    <button
                                        onClick={handleFollowSeller}
                                        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-700/70 text-gray-200 hover:bg-gray-600/70 border border-gray-600 rounded-lg font-semibold transition-colors"
                                    >
                                        <UserPlusIcon className="w-5 h-5" /> Follow Seller
                                    </button>
                                </div>

                                <section className="bio-public bg-gray-800/40 p-4 rounded-lg border border-gray-700/50">
                                    <div className="bio-header-public flex items-center text-gray-300 mb-2">
                                        <InformationCircleIconSM className="w-5 h-5 mr-1.5 text-neon-purple" />
                                        <h3 className="font-semibold text-sm uppercase tracking-wider">About Seller</h3>
                                    </div>
                                    <p className="bio-text-public text-sm text-gray-400 leading-relaxed">
                                        {seller.bio || "This seller hasn't added a bio yet."}
                                    </p>
                                </section>

                                <div className="seller-stats-public space-y-3">
                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                                        <StarIconSolid className="w-4 h-4 text-neon-purple" />Seller Stats
                                    </h3>
                                    <div className="data-item-public flex justify-between items-center text-sm p-2.5 bg-gray-800/30 rounded-md border border-gray-700/30">
                                        <span className="text-gray-400">Avg. Rating:</span>
                                        <StarRatingDisplay rating={averageRating} totalReviews={totalReviewsCount} iconSize="h-4 w-4" />
                                    </div>
                                    <div className="data-item-public flex justify-between items-center text-sm p-2.5 bg-gray-800/30 rounded-md border border-gray-700/30">
                                        <span className="text-gray-400">Total Sales:</span>
                                        <span className="font-semibold text-white">{seller.totalSalesCount || 0}</span>
                                    </div>
                                    <div className="data-item-public flex justify-between items-center text-sm p-2.5 bg-gray-800/30 rounded-md border border-gray-700/30">
                                        <span className="text-gray-400">Listings:</span>
                                        <span className="font-semibold text-white">{listings.length}</span>
                                    </div>
                                    <div className="data-item-public flex justify-between items-center text-sm p-2.5 bg-gray-800/30 rounded-md border border-gray-700/30">
                                        <span className="text-gray-400">Joined:</span>
                                        <span className="font-semibold text-white">{new Date(seller.createdAt || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <div className="mb-6 border-b border-gray-700/50">
                                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                        <button
                                            onClick={() => setActiveTab('listings')}
                                            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'listings' ? 'border-neon-purple text-neon-purple' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                                        >
                                            Listings ({listings.length})
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('reviews')}
                                            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'reviews' ? 'border-neon-purple text-neon-purple' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                                        >
                                            Reviews ({totalReviewsCount})
                                        </button>
                                    </nav>
                                </div>

                                {activeTab === 'listings' && (
                                    listings.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {listings.map((listing, index) => {
                                                const theme = cardThemes[index % cardThemes.length];
                                                return (
                                                    <Link
                                                        key={listing._id}
                                                        to={`/subscriptions/${listing._id}`}
                                                        className="block group rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_-7px_var(--card-glow-color)]"
                                                        style={{ '--card-glow-color': theme.glowColor }}
                                                    >
                                                        <div className="bg-gray-800/60 border border-gray-700/50 h-full flex flex-col" style={{ borderColor: theme.borderColor }}>
                                                            <div className="aspect-[16/9] bg-gray-700/40 overflow-hidden">
                                                                <img
                                                                    src={listing.image ? `${IMAGE_BASE_URL}/Uploads/${listing.image}` : `https://placehold.co/300x170/1F2937/4B5563?text=${encodeURIComponent(listing.title || 'Listing')}`}
                                                                    alt={listing.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x170/1F2937/4B5563?text=No+Image`; }}
                                                                />
                                                            </div>
                                                            <div className="p-4 flex flex-col flex-grow">
                                                                <h3
                                                                    className="text-base font-semibold text-white truncate group-hover:text-[var(--card-accent-color)] transition-colors"
                                                                    style={{ '--card-accent-color': theme.accentColor }}
                                                                    title={listing.title}
                                                                >
                                                                    {listing.title}
                                                                </h3>
                                                                <p className="text-xs text-gray-400 capitalize mb-2">{listing.category}</p>
                                                                <div className="mt-auto">
                                                                    <p className="text-md font-bold" style={{ color: theme.accentColor }}>
                                                                        ${typeof listing.price === 'number' ? listing.price.toFixed(2) : listing.price}
                                                                        <span className="text-xs text-gray-400"> / {formatDuration(listing.duration)}</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-400 py-10">This seller currently has no active listings.</p>
                                    )
                                )}

                                {activeTab === 'reviews' && (
                                    reviews.length > 0 ? (
                                        <div className="space-y-5">
                                            {reviews.map(review => (
                                                <div key={review._id} className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-start space-x-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-500">
                                                            {review.buyer?.avatar ? (
                                                                <img
                                                                    src={`${IMAGE_BASE_URL}/Uploads/${review.buyer.avatar}`}
                                                                    alt={review.buyer.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="font-medium text-white text-sm">{getInitials(review.buyer?.name || 'U')}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex justify-between items-center mb-0.5">
                                                                <h4 className="font-semibold text-sm text-gray-200">{review.buyer?.name || 'Anonymous'}</h4>
                                                                <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <StarRatingDisplay rating={review.rating} iconSize="h-4 w-4" />
                                                            <p className="text-sm text-gray-300 mt-2 whitespace-pre-wrap leading-normal">{review.comment}</p>
                                                            {review.sellerResponse && (
                                                                <div className="mt-2 pl-4 border-l-2 border-purple-500">
                                                                    <p className="text-sm text-gray-400">Seller Response:</p>
                                                                    <p className="text-sm text-gray-300">{review.sellerResponse}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-400 py-10">This seller has no reviews yet.</p>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                body { font-family: 'Inter', 'Helvetica Neue', sans-serif; overflow-x: hidden; background-color: #050505; color: white; min-height: 100vh; }
                .gradient-background, .noise-overlay, .grid-overlay, .glow { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden; }
                .gradient-sphere { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; }
                .gradient-sphere.sphere-1 { width: 45vw; height: 45vw; min-width: 300px; min-height: 300px; background: linear-gradient(40deg, rgba(123, 22, 255, 0.4), rgba(255, 102, 0, 0.2)); top: -15%; left: -15%; animation: float-1-profile-public 20s ease-in-out infinite alternate; }
                .gradient-sphere.sphere-2 { width: 50vw; height: 50vw; min-width: 350px; min-height: 350px; background: linear-gradient(240deg, rgba(72, 0, 255, 0.4), rgba(0, 183, 255, 0.25)); bottom: -25%; right: -15%; animation: float-2-profile-public 22s ease-in-out infinite alternate; }
                .noise-overlay { opacity: 0.02; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
                .grid-overlay { background-size: 50px 50px; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px); }
                .glow { width: 60vw; height: 60vh; background: radial-gradient(circle, rgba(138, 43, 226, 0.08), transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); animation: pulse-profile-public 12s infinite alternate; filter: blur(60px); }
                @keyframes float-1-profile-public {0% { transform: translate(0, 0) scale(1); opacity: 0.4; } 100% { transform: translate(10vw, 8vh) scale(1.1); opacity: 0.6; }}
                @keyframes float-2-profile-public {0% { transform: translate(0, 0) scale(1); opacity: 0.5; } 100% { transform: translate(-8vw, -12vh) scale(1.15); opacity: 0.3; }}
                @keyframes pulse-profile-public {0% { opacity: 0.1; transform: translate(-50%, -50%) scale(0.95); } 100% { opacity: 0.25; transform: translate(-50%, -50%) scale(1.05); }}
                .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
            `}</style>
        </div>
    );
};

export default SellerProfilePage;