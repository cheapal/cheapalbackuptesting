import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listingService, userService } from '../services/apiService';
import ProfileBadges from './ProfileBadge';

// --- Animated Background Component ---
const AnimatedGradientBackground = () => {
    useEffect(() => {
        const particlesContainerId = `particles-container-category-${Math.random().toString(36).substring(7)}`;
        const particlesContainer = document.getElementById(particlesContainerId);
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
            particle.style.position = 'absolute';
            particle.style.background = 'white';
            particle.style.borderRadius = '50%';
            particle.style.opacity = '0';
            particle.style.pointerEvents = 'none';
            particle.style.willChange = 'transform, opacity, left, top';
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
                        if (parseFloat(particle.style.top) < -10 || parseFloat(particle.style.top) > 110 || parseFloat(particle.style.left) < -10 || parseFloat(particle.style.left) > 110) {
                            resetParticle(particle);
                        }
                        animateParticle(particle);
                    }
                }, duration * 1000);
                particle.dataset.reanimateTimeoutId = reanimateTimeout;
            }, delay * 1000);
            particle.dataset.animationTimeoutId = animationTimeout;
        };

        for (let i = 0; i < particleCount; i++) createParticle();

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

    // Generate a stable ID for the container
    const [particlesContainerId] = useState(() => `particles-container-category-${Math.random().toString(36).substring(7)}`);

    return (
        <>
            <div className="gradient-background">
                <div className="gradient-sphere sphere-1"></div>
                <div className="gradient-sphere sphere-2"></div>
                <div className="gradient-sphere sphere-3"></div>
                <div className="glow"></div>
                <div className="grid-overlay"></div>
                <div className="noise-overlay"></div>
                <div className="particles-container" id={particlesContainerId}></div>
            </div>
        </>
    );
};

// --- Reusable UI Components ---
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
    </div>
);

const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-700/20 border border-red-600/40 text-red-300 p-6 rounded-xl text-center my-8 shadow-lg max-w-lg mx-auto">
        <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-lg mb-1">Something went wrong</p>
            <span className="text-sm">{message || 'Could not load listings.'}</span>
            {onRetry && (
                <button onClick={onRetry} className="mt-4 px-4 py-2 bg-red-500/30 text-red-200 rounded-lg hover:bg-red-500/40 transition-colors text-sm font-medium">
                    Try Again
                </button>
            )}
        </div>
    </div>
);

// --- Golden Price Button Component ---
const GoldenPriceButton = ({ price, duration }) => {
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

    const formattedDuration = formatDuration(duration);
    const displayPrice = typeof price === 'number' ? price.toFixed(2) : price;

    return (
        <div className="my-4">
            <button
                className="golden-btn w-full px-4 py-3 text-center"
                style={{ fontSize: '1em' }}
            >
                {formattedDuration && formattedDuration !== 'Per Item' ? (
                    <span className="inline-flex items-center justify-center gap-1">
                        <span className="font-medium">{formattedDuration}</span>
                        <span className="text-xs font-light mx-0.5 text-neon-green lowercase">for</span>
                        <span className="font-bold">${displayPrice}</span>
                    </span>
                ) : (
                    <span className="font-bold">${displayPrice}</span>
                )}
            </button>
        </div>
    );
};

// --- Listing Card Component ---
const ListingCard = ({ listing, seller }) => {
    const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
    const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace('/api', '');
    const glowColor = 'rgba(168, 85, 247, 0.4)';

    return (
        <Link to={`/subscriptions/${listing._id}`} className="block group h-full">
            <div
                className="bg-gray-800/50 border border-gray-700/70 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_-5px_var(--glow-color)] transition-all duration-300 h-full flex flex-col transform hover:scale-[1.03]"
                style={{ '--glow-color': glowColor }}
            >
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-50 mb-2 truncate group-hover:text-neon-green transition-colors" title={listing.title}>{listing.title}</h3>
                    <p className="text-gray-400 text-sm mb-2 h-12 overflow-hidden text-ellipsis leading-relaxed" title={listing.description}>{listing.description || "No description available."}</p>
                    <div className="h-52 bg-gray-700/50 relative overflow-hidden rounded-lg mb-0">
                        <img
                            src={listing.image ? `${IMAGE_BASE_URL}/Uploads/${listing.image}` : `https://placehold.co/600x400/2D3748/A0AEC0?text=${encodeURIComponent(listing.title || 'Listing')}`}
                            alt={listing.title || 'Listing Image'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/2D3748/A0AEC0?text=Error'; }}
                        />
                    </div>
                    <GoldenPriceButton price={listing.price} duration={listing.duration} />
                    <div className="mt-auto pt-4 border-t border-gray-700/60 flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden text-sm font-bold text-white flex-shrink-0 ring-1 ring-gray-500">
                            {seller?.avatar ? (
                                <img
                                    src={`${IMAGE_BASE_URL}/Uploads/${seller.avatar}`}
                                    alt={seller.name || 'Seller Avatar'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.outerHTML = `<span class="text-xs" title="${seller.name || ''}">${getInitials(seller.name)}</span>`; }}
                                />
                            ) : (
                                <span className="text-xs" title={seller?.name || 'Seller'}>{getInitials(seller?.name)}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {seller?.name || 'Unknown Seller'}
                            {seller?.verificationStatus === 'verified' && (
                                <svg className="h-6 w-6 text-neon-green" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                            <ProfileBadges badges={seller?.badges || []} size="sm" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// --- Category Page Component ---
const CategoryPage = () => {
    const { categoryId } = useParams();
    const [listings, setListings] = useState([]);
    const [sellers, setSellers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categoryDisplayData = {
        streaming: { name: 'Streaming', color: 'neon-pink' },
        software: { name: 'Software', color: 'neon-blue' },
        ai: { name: 'AI Tools', color: 'neon-green' },
        music: { name: 'Music', color: 'neon-yellow' },
        gaming: { name: 'Gaming', color: 'neon-orange' },
        vpn: { name: 'VPN', color: 'neon-purple' },
        education: { name: 'Education', color: 'neon-blue' },
        news: { name: 'News/Magazines', color: 'neon-red' },
        other: { name: 'Other', color: 'neon-gray' }
    };

    const fetchListingsByCategory = useCallback(async () => {
        if (!categoryId) {
            setError("Category not specified in URL.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const listingsArray = await listingService.getByCategory(categoryId);

            if (Array.isArray(listingsArray)) {
                setListings(listingsArray);

                // Fetch seller data for each unique sellerId
                const sellerIds = [...new Set(listingsArray.map(l => l.sellerId?._id).filter(id => id))];
                const sellerPromises = sellerIds.map(async (sellerId) => {
                    try {
                        const response = await userService.getPublicProfileById(sellerId);
                        if (response.success && response.data) {
                            return { [sellerId]: response.data };
                        }
                        return { [sellerId]: null };
                    } catch (err) {
                        return { [sellerId]: null };
                    }
                });

                const sellerResults = await Promise.all(sellerPromises);
                const sellersData = sellerResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                setSellers(sellersData);
            } else {
                setListings([]);
                setError(`Could not fetch listings for ${categoryId}. Unexpected data format received.`);
            }
        } catch (err) {
            setError(err.message || `Failed to fetch listings for ${categoryId}. Please try again.`);
            setListings([]);
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        fetchListingsByCategory();
    }, [fetchListingsByCategory]);

    const currentCategoryDisplayName = categoryDisplayData[categoryId?.toLowerCase()]?.name ?? (categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'Category');

    return (
        <div className="min-h-screen text-white flex flex-col relative font-sans">
            <AnimatedGradientBackground />
            <div className="relative z-10 flex-grow flex flex-col">
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                    <div className="mb-10 pt-8 text-center">
                        <nav aria-label="breadcrumb" className="text-sm text-gray-400 mb-4 justify-center flex">
                            <Link to="/" className="hover:text-neon-purple">Home</Link>
                            <span className="mx-2">{'>'}</span>
                            <Link to="/subscriptions" className="hover:text-neon-purple">Subscriptions</Link>
                            <span className="mx-2">{'>'}</span>
                            <span className="text-white capitalize">{currentCategoryDisplayName}</span>
                        </nav>
                        <h1
                            className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-400"
                            style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.15), 0 0 35px rgba(200, 200, 255, 0.1)' }}
                        >
                            {currentCategoryDisplayName} Subscriptions
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                            Discover approved listings in the {currentCategoryDisplayName.toLowerCase()} category.
                        </p>
                    </div>
                    <div className="bg-black/40 backdrop-blur-lg border border-gray-700/30 rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8">
                        {loading ? (
                            <LoadingSpinner />
                        ) : error ? (
                            <ErrorMessage message={error} onRetry={fetchListingsByCategory} />
                        ) : listings.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                                {listings.map(listing => (
                                    <ListingCard
                                        key={listing._id}
                                        listing={listing}
                                        seller={sellers[listing.sellerId?._id] || listing.sellerId || {}}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400 bg-gray-800/50 rounded-lg border border-gray-700/50">
                                <svg className="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                                <p className="text-xl font-semibold text-gray-300">No Subscriptions Found</p>
                                <p className="text-sm text-gray-500 mt-1">No approved subscriptions found in the '{currentCategoryDisplayName}' category yet.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <style>{`
                body {
                    font-family: 'Inter', 'Helvetica Neue', sans-serif;
                    overflow-x: hidden;
                    background-color: #050505;
                    color: white;
                    min-height: 100vh;
                }
                .golden-btn {
                    display: inline-block;
                    outline: none;
                    font-family: inherit;
                    font-size: 1em;
                    font-weight: 600;
                    box-sizing: border-box;
                    border: none;
                    border-radius: .3em;
                    height: 2.75em;
                    line-height: 2.5em;
                    text-transform: uppercase;
                    padding: 0 1em;
                    color: #f0e085;
                    box-shadow: inset 0 0 0 1px #A2790D,
                                inset 0 -0.125em #A2790D,
                                inset 0 0.125em #FFD700,
                                0 0.25em 0.25em rgba(0,0,0,0.15);
                    border-radius: 15px;
                    backdrop-filter: blur(30px);
                    font-size: 14px;
                    letter-spacing: 2px;
                    cursor: default;
                    text-shadow: 0 1px 1px rgba(250, 227, 133, 0.65);
                    transition: none;
                    background-size: 100% 100%;
                    background-position: center;
                    text-align: center;
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
                    will-change: transform, opacity;
                }
                .sphere-1 {
                    width: 45vw;
                    height: 45vw;
                    min-width: 300px;
                    min-height: 300px;
                    background: linear-gradient(40deg, rgba(255, 0, 128, 0.6), rgba(255, 102, 0, 0.3));
                    top: -15%;
                    left: -15%;
                    animation: float-1 20s ease-in-out infinite alternate;
                }
                .sphere-2 {
                    width: 50vw;
                    height: 50vw;
                    min-width: 350px;
                    min-height: 350px;
                    background: linear-gradient(240deg, rgba(72, 0, 255, 0.6), rgba(0, 183, 255, 0.3));
                    bottom: -25%;
                    right: -15%;
                    animation: float-2 22s ease-in-out infinite alternate;
                }
                .sphere-3 {
                    width: 35vw;
                    height: 35vw;
                    min-width: 250px;
                    min-height: 250px;
                    background: linear-gradient(120deg, rgba(133, 89, 255, 0.4), rgba(98, 216, 249, 0.25));
                    top: 50%;
                    left: 25%;
                    transform: translate(-50%, -50%);
                    animation: float-3 25s ease-in-out infinite alternate;
                }
                .noise-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.03;
                    z-index: 1;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                }
                .grid-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-size: 50px 50px;
                    background-image:
                        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
                    z-index: 0;
                }
                .glow {
                    position: absolute;
                    width: 50vw;
                    height: 50vh;
                    background: radial-gradient(circle, rgba(138, 43, 226, 0.1), transparent 70%);
                    top: 50%;
                    left: 50%;
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
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    pointer-events: none;
                }
                .particle {}
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(31, 41, 55, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(107, 114, 128, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(107, 114, 128, 0.7);
                }
                :root {
                    --neon-green: #39FF14;
                    --neon-pink: #FF00FF;
                    --neon-blue: #00FFFF;
                    --neon-yellow: #FFFF00;
                    --neon-orange: #FF4500;
                    --neon-purple: #8A2BE2;
                    --neon-red: #FF0000;
                    --neon-gray: #808080;
                }
                .text-neon-green { color: var(--neon-green); }
                .text-neon-pink { color: var(--neon-pink); }
                .text-neon-blue { color: var(--neon-blue); }
                .text-neon-yellow { color: var(--neon-yellow); }
                .text-neon-orange { color: var(--neon-orange); }
                .text-neon-purple { color: var(--neon-purple); }
                .text-neon-red { color: var(--neon-red); }
                .text-neon-gray { color: var(--neon-gray); }
            `}</style>
        </div>
    );
};

export default CategoryPage;
