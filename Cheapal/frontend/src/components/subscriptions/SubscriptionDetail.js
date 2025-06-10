import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { listingService, userService, chatService } from '../../services/apiService';
import { useAuth } from '../../context/authContext';
import { useCart } from '../../context/CartContext';
import NewCustomToast from '../NewCustomToast';
import { toast } from 'react-toastify';
import ProfileBadges from '../../pages/ProfileBadge';


// --- Animated Background Component ---
const AnimatedGradientBackground = () => {
    useEffect(() => {
        const particlesContainer = document.getElementById('particles-container');
        if (!particlesContainer) return;

        const particleCount = 40;
        while (particlesContainer.firstChild) {
            particlesContainer.removeChild(particlesContainer.firstChild);
        }

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 2.5 + 0.5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
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
            return { x: posX, y: posY };
        };

        const animateParticle = (particle) => {
            const duration = Math.random() * 18 + 12;
            const delay = Math.random() * 12;

            const animationTimeout = setTimeout(() => {
                if (!particlesContainer || !particlesContainer.contains(particle)) return;
                particle.style.transition = `all ${duration}s linear`;
                particle.style.opacity = (Math.random() * 0.2 + 0.03).toString();
                particle.style.transform = 'scale(1)';

                const moveX = parseFloat(particle.style.left) + (Math.random() * 40 - 20);
                const moveY = parseFloat(particle.style.top) - (Math.random() * 50 + 15);

                particle.style.left = `${moveX}%`;
                particle.style.top = `${moveY}%`;

                const reanimateTimeout = setTimeout(() => {
                    if (particlesContainer && particlesContainer.contains(particle)) {
                        resetParticle(particle);
                        animateParticle(particle);
                    }
                }, duration * 1000);
                particle.dataset.reanimateTimeoutId = reanimateTimeout;

            }, delay * 1000);
            particle.dataset.animationTimeoutId = animationTimeout;
        };

        for (let i = 0; i < particleCount; i++) {
            createParticle();
        }

        const spheres = document.querySelectorAll('.gradient-sphere');
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
                const currentParticles = particlesContainer.querySelectorAll('.particle');
                currentParticles.forEach(p => {
                    if (p.dataset.animationTimeoutId) clearTimeout(p.dataset.animationTimeoutId);
                    if (p.dataset.reanimateTimeoutId) clearTimeout(p.dataset.reanimateTimeoutId);
                });
                particlesContainer.innerHTML = '';
            }
        };
    }, []);

    return (
        <>
            <div className="gradient-background">
                <div className="gradient-sphere sphere-1"></div>
                <div className="gradient-sphere sphere-2"></div>
                <div className="gradient-sphere sphere-3"></div>
                <div className="glow"></div>
                <div className="grid-overlay"></div>
                <div className="noise-overlay"></div>
                <div className="particles-container" id="particles-container"></div>
            </div>
        </>
    );
};

// --- Reusable UI Components ---
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div>
        <p className="ml-4 text-lg text-gray-300">Loading Details...</p>
    </div>
);

const ErrorMessage = ({ message }) => (
    <div className="bg-red-800/30 border border-red-700/50 text-red-200 p-6 rounded-xl text-center my-10 shadow-xl max-w-md mx-auto">
        <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-semibold text-xl mb-2">Oops! An Error Occurred</p>
            <span className="text-md">{message || 'Could not load subscription details.'}</span>
        </div>
    </div>
);

// --- Main Subscription Detail Component ---
const SubscriptionDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [listing, setListing] = useState(null);
    const [seller, setSeller] = useState(null);
    const [sellerListings, setSellerListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || '').replace('/api', '');

    const totalPrice = useMemo(() => {
        if (!listing?.price) return 'N/A';
        return (listing.price * quantity).toFixed(2);
    }, [listing, quantity]);

    const fetchData = useCallback(async () => {
        if (!id) { setError("Invalid Subscription ID provided."); setLoading(false); return; }
        setLoading(true); setError(null);
        try {
            const mainListingData = await listingService.getById(id);
            if (!mainListingData) { throw new Error('Subscription not found or no longer available.'); }

            if (mainListingData.status !== 'approved' && user?.role !== 'admin' && mainListingData.sellerId?._id !== user?._id) {
                console.warn(`[SubscriptionDetail] Viewing non-approved or non-owned listing: ${id}, Status: ${mainListingData.status}`);
            }
            console.log("[SubscriptionDetail] Listing ID:", id);
            console.log("[SubscriptionDetail] Listing data:", JSON.stringify(mainListingData, null, 2));
            setListing(mainListingData);

            // Fetch seller data
            if (mainListingData.sellerId?._id) {
                console.log(`[SubscriptionDetail] Fetching seller data for ID: ${mainListingData.sellerId._id}`);
                const sellerResponse = await userService.getPublicProfileById(mainListingData.sellerId._id);
                if (sellerResponse.success && sellerResponse.data) {
                    setSeller(sellerResponse.data);
                    console.log("[SubscriptionDetail] Seller data:", JSON.stringify(sellerResponse.data, null, 2));
                    console.log("[SubscriptionDetail] Seller badges:", sellerResponse.data.badges || "No badges");

                    // Fetch other listings
                    const otherListingsResponse = await listingService.getBySeller(mainListingData.sellerId._id);
                    console.log("[SubscriptionDetail] Other listings for seller:", JSON.stringify(otherListingsResponse, null, 2));
                    setSellerListings((otherListingsResponse || []).filter(l => l._id !== id && l.status === 'approved').slice(0, 4));
                } else {
                    console.warn("[SubscriptionDetail] No seller data found for ID:", mainListingData.sellerId._id);
                    setSeller(null);
                }
            } else {
                console.warn("[SubscriptionDetail] No sellerId found in listing data.");
                setSeller(null);
            }
        } catch (err) {
            console.error("[SubscriptionDetail] Error fetching subscription details:", err);
            setError(err.message || 'Failed to load subscription details.');
            setListing(null);
            setSeller(null);
        } finally {
            setLoading(false);
        }
    }, [id, user?.role, user?._id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleQuantityChange = (amount) => { setQuantity(prev => Math.max(1, prev + amount)); };

    const handleAddToCart = () => {
        if (!listing || listing.status !== 'approved') {
            toast(({ closeToast }) => <NewCustomToast type="warning" headline="Not Available" text="This listing cannot be added to the cart." closeToast={closeToast} />);
            return;
        }
        if (user && listing.sellerId?._id === user._id) {
            toast(({ closeToast }) => <NewCustomToast type="info" headline="Own Listing" text="You cannot add your own listing to the cart." closeToast={closeToast} />);
            return;
        }
        const itemToAdd = {
            listing: listing._id, sellerId: listing.sellerId?._id, title: listing.title, price: listing.price, quantity: quantity,
            duration: listing.duration, image: listing.image
        };
        addToCart(itemToAdd);
        toast(({ closeToast }) => <NewCustomToast type="success" headline="Added to Cart" text={`${quantity} x ${listing.title} added.`} closeToast={closeToast} />);
    };

    const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

    const handleChatWithSeller = async (sellerIdParam) => {
        if (!sellerIdParam) {
            toast(({ closeToast }) => <NewCustomToast type="error" headline="Error" text="Seller ID is missing." closeToast={closeToast} />); return;
        }
        if (!user) {
            toast(({ closeToast }) => <NewCustomToast type="info" headline="Login Required" text="Please log in to contact the seller." closeToast={closeToast} />);
            navigate('/login', { state: { from: `/subscriptions/${id}` } });
            return;
        }
        if (user._id === sellerIdParam) {
            toast(({ closeToast }) => <NewCustomToast type="info" headline="Action Not Allowed" text="You cannot start a chat with yourself." closeToast={closeToast} />);
            return;
        }
        try {
            const response = await chatService.accessChat(sellerIdParam);
            if (response.success && response.data?._id) {
                navigate(`/chat/${response.data._id}`);
            } else {
                throw new Error(response.message || "Could not initiate chat with seller.");
            }
        } catch (err) {
            console.error("[SubscriptionDetail] Error initiating chat with seller:", err);
            toast(({ closeToast }) => <NewCustomToast type="error" headline="Chat Error" text={err.message || "Could not start chat."} closeToast={closeToast} />);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen text-white flex flex-col relative">
                <AnimatedGradientBackground />
                <div className="relative z-10 flex-grow flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen text-white flex flex-col relative">
                <AnimatedGradientBackground />
                <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-4">
                    <ErrorMessage message={error} />
                    <Link to="/subscriptions" className="mt-6 px-6 py-2 bg-neon-purple text-black font-semibold rounded-lg hover:brightness-110 transition-all">
                        Back to Subscriptions
                    </Link>
                </div>
            </div>
        );
    }
    if (!listing) {
        return (
            <div className="min-h-screen text-white flex flex-col relative">
                <AnimatedGradientBackground />
                <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 text-center">
                    <ErrorMessage message="Subscription details could not be loaded or found." />
                    <Link to="/subscriptions" className="mt-6 px-6 py-2 bg-neon-purple text-black font-semibold rounded-lg hover:brightness-110 transition-all">
                        Go back
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white flex flex-col relative font-sans">
            <AnimatedGradientBackground />
            <main className="relative z-10 container mx-auto max-w-6xl p-4 md:p-8 flex-grow">
                <div className="bg-black/40 backdrop-blur-xl border border-gray-700/30 rounded-xl shadow-2xl">
                    <nav aria-label="breadcrumb" className="text-sm text-gray-400 p-4 md:p-6 border-b border-gray-700/30">
                        <Link to="/" className="hover:text-neon-purple">Home</Link>
                        <span className="mx-2">{'>'}</span>
                        <Link to="/subscriptions" className="hover:text-neon-purple">Subscriptions</Link>
                        <span className="mx-2">{'>'}</span>
                        <Link to={`/category/${listing?.category || 'other'}`} className="hover:text-neon-purple capitalize">{listing?.category || 'Unknown'}</Link>
                        <span className="mx-2">{'>'}</span>
                        <span className="text-gray-200">{listing?.title || 'Loading...'}</span>
                    </nav>

                    <div className="p-4 md:p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
                            <div className="lg:col-span-2 space-y-8">
                                <h1
                                    className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-400"
                                    style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.15), 0 0 35px rgba(200, 200, 255, 0.1)' }}
                                >
                                    {listing?.title}
                                </h1>
                                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 flex flex-wrap gap-x-6 gap-y-4 text-sm shadow-md">
                                    <div className="flex items-center gap-2"> <i className="fas fa-shipping-fast text-gray-400 w-4 text-center"></i> <div> <div className="text-gray-400">Delivery speed</div> <div className="text-white font-medium">Instant</div> </div> </div>
                                    <div className="flex items-center gap-2"> <i className="fas fa-truck text-gray-400 w-4 text-center"></i> <div> <div className="text-gray-400">Delivery method</div> <div className="text-white font-medium">Auto delivery</div> </div> </div>
                                    <div className="flex items-center gap-2"> <i className="fas fa-map-marker-alt text-gray-400 w-4 text-center"></i> <div> <div className="text-gray-400">Region</div> <div className="text-white font-medium">Global</div> </div> </div>
                                </div>
                                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden aspect-video shadow-lg">
                                    <img
                                        src={listing?.image ? `${IMAGE_BASE_URL}/Uploads/${listing.image}` : `https://placehold.co/800x450/1A202C/A0AEC0?text=${encodeURIComponent(listing?.title || 'Listing Image')}`}
                                        alt={listing?.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/800x450/1A202C/A0AEC0?text=Image+Error`; }}
                                    />
                                </div>
                                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 md:p-8 shadow-md">
                                    <h2 className="text-2xl font-semibold mb-4 text-gray-100">Description</h2>
                                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed prose prose-invert max-w-none">{listing?.description || "No description provided."}</p>
                                </div>
                                {sellerListings.length > 0 && (
                                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 md:p-8 shadow-md">
                                        <h3 className="text-xl font-semibold mb-4 text-gray-100">More from this seller</h3>
                                        <div className="space-y-4">
                                            {sellerListings.map((sub) => (
                                                <Link key={sub._id} to={`/subscriptions/${sub._id}`} className="block p-4 hover:bg-gray-700/60 rounded-lg transition-colors border border-gray-700 hover:border-gray-600">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium text-white text-md truncate pr-4">{sub.title}</span>
                                                        <span className="text-md text-neon-purple font-semibold whitespace-nowrap">${sub.price}/month</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-8 lg:sticky lg:top-24">
                                <div className="bg-gray-800/60 border border-purple-500/40 rounded-xl p-6 shadow-xl backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-5">
                                        <span className="text-gray-300 text-lg">Quantity:</span>
                                        <div className="flex items-center border border-gray-600 rounded-md">
                                            <button onClick={() => handleQuantityChange(-1)} className="px-4 py-2 text-xl text-gray-400 hover:text-white hover:bg-purple-600/30 rounded-l-md disabled:opacity-50 transition-colors" disabled={quantity <= 1}>-</button>
                                            <span className="px-5 py-2 text-white font-semibold text-lg bg-black/20">{quantity}</span>
                                            <button onClick={() => handleQuantityChange(1)} className="px-4 py-2 text-xl text-gray-400 hover:text-white hover:bg-purple-600/30 rounded-r-md transition-colors">+</button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-gray-300 text-lg">Total amount</span>
                                        <span className="text-3xl font-bold text-neon-purple">{totalPrice} CAD</span>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={listing?.status !== 'approved' || (user && listing.sellerId?._id === user._id)}
                                        className="w-full py-3.5 px-4 bg-neon-purple text-black font-bold rounded-lg hover:brightness-125 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-md hover:shadow-neon-purple/40"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.922.778H14.5a1 1 0 00.994-.89l.853-6.039a1 1 0 00-.994-1.111H4.218a1 1 0 00-.948.684L3 1z" />
                                            <path fillRule="evenodd" d="M10 18a2 2 0 100-4 2 2 0 000 4zm-4 0a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4zM7 13a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {listing?.status === 'approved' ? (user && listing.sellerId?._id === user._id ? 'Your Listing' : 'Add to Cart') : 'Currently Unavailable'}
                                    </button>
                                </div>
                                {seller && seller._id && (
                                    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6 shadow-md backdrop-blur-sm">
                                        <h3 className="text-xl font-semibold mb-4 text-gray-100">Seller Information</h3>
                                        <Link to={`/profile/${seller._id}`} className="block hover:bg-gray-700/40 p-3 rounded-lg transition-colors group">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-14 h-14 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-gray-500 group-hover:border-neon-purple/70 transition-colors">
                                                    {seller.avatar ? (
                                                        <img src={`${IMAGE_BASE_URL}/Uploads/${seller.avatar}`} alt={seller.name || 'Seller'} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.outerHTML = `<span className="text-xl font-bold text-white" title="${seller.name || ''}">${getInitials(seller.name)}</span>`; }} />
                                                    ) : (
                                                        <span className="text-xl font-bold text-white" title={seller.name || 'Seller'}>{getInitials(seller.name)}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        {seller.name || 'Unknown Seller'}
                                                        {seller.verificationStatus === 'verified' && (
                                                            <svg className="h-10 w-10 text-neon-green" fill="currentColor" viewBox="0 0 20 20">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        )}
                                                        <ProfileBadges badges={seller.badges || []} size='md'/>
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-400 mt-1">
                                                        <i className="fas fa-thumbs-up mr-1.5 text-green-500"></i> {seller.averageRating?.toFixed(1) || 'N/A'} ({seller.totalReviews || 0})
                                                        <span className="mx-2.5 text-gray-600">|</span>
                                                        <i className="fas fa-shopping-cart mr-1.5 text-gray-500"></i> {seller.totalSalesCount || 0} sold
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        {user && user._id !== seller._id && (
                                            <button
                                                onClick={() => handleChatWithSeller(seller._id)}
                                                className="w-full mt-4 py-2.5 px-4 border border-gray-600 text-gray-300 rounded-lg hover:bg-purple-600/30 hover:text-neon-purple hover:border-neon-purple/50 transition text-sm flex items-center justify-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                </svg>
                                                Contact Seller
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
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
                .gradient-background {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                    overflow: hidden;
                }
                .gradient-sphere {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.6;
                }
                .sphere-1 {
                    width: 45vw; height: 45vw;
                    min-width: 300px; min-height: 300px;
                    background: linear-gradient(40deg, rgba(255, 0, 128, 0.6), rgba(255, 102, 0, 0.3));
                    top: -15%; left: -15%;
                    animation: float-1 20s ease-in-out infinite alternate;
                }
                .sphere-2 {
                    width: 50vw; height: 50vw;
                    min-width: 350px; min-height: 350px;
                    background: linear-gradient(240deg, rgba(72, 0, 255, 0.6), rgba(0, 183, 255, 0.3));
                    bottom: -25%; right: -15%;
                    animation: float-2 22s ease-in-out infinite alternate;
                }
                .sphere-3 {
                    width: 35vw; height: 35vw;
                    min-width: 250px; min-height: 250px;
                    background: linear-gradient(120deg, rgba(133, 89, 255, 0.4), rgba(98, 216, 249, 0.25));
                    top: 50%; left: 25%;
                    transform: translate(-50%, -50%);
                    animation: float-3 25s ease-in-out infinite alternate;
                }
                .noise-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    opacity: 0.03; z-index: 1;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                }
                .grid-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-size: 50px 50px;
                    background-image:
                        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
                    z-index: 0;
                }
                .glow {
                    position: absolute; width: 50vw; height: 50vh;
                    background: radial-gradient(circle, rgba(138, 43, 226, 0.1), transparent 70%);
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 0;
                    animation: pulse 10s infinite alternate;
                    filter: blur(50px);
                }
                @keyframes float-1 {
                    0% { transform: translate(0, 0) scale(1); opacity: 0.5; }
                    100% { transform: translate(15vw, 10vh) scale(1.15); opacity: 0.7; }
                }
                @keyframes float-2 {
                    0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
                    100% { transform: translate(-10vw, -15vh) scale(1.2); opacity: 0.4; }
                }
                @keyframes float-3 {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                    100% { transform: translate(calc(-50% + 5vw), calc(-50% - 10vh)) scale(1.1); opacity: 0.5; }
                }
                @keyframes pulse {
                    0% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.9); }
                    100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }
                }
                .particles-container {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    z-index: 1; pointer-events: none;
                }
                .particle {
                    position: absolute; background: white; border-radius: 50%;
                    opacity: 0; pointer-events: none;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px; height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(31, 41, 55, 0.3); border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(107, 114, 128, 0.5); border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(107, 114, 128, 0.7);
                }
            `}</style>
        </div>
    );
};

export default SubscriptionDetail;