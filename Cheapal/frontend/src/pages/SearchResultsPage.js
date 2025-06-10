import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchService, userService } from '../services/apiService';
import { Filter, CalendarDays, Users, Package, SearchX } from 'lucide-react';
import ProfileBadges from './ProfileBadge';

const AnimatedGradientBackground = () => {
    useEffect(() => {
        const particlesContainer = document.getElementById('particles-container-search');
        if (!particlesContainer) return;

        const particleCount = 40;
        const existingParticles = particlesContainer.querySelectorAll('.particle');
        existingParticles.forEach(p => p.remove());

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

        const spheres = document.querySelectorAll('.gradient-sphere-search');
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
                <div className="gradient-sphere gradient-sphere-search sphere-1"></div>
                <div className="gradient-sphere gradient-sphere-search sphere-2"></div>
                <div className="gradient-sphere gradient-sphere-search sphere-3"></div>
                <div className="glow"></div>
                <div className="grid-overlay"></div>
                <div className="noise-overlay"></div>
                <div className="particles-container" id="particles-container-search"></div>
            </div>
        </>
    );
};

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
            <span className="text-sm">{message || 'Could not perform search.'}</span>
            {onRetry && (
                <button onClick={onRetry} className="mt-4 px-4 py-2 bg-red-500/30 text-red-200 rounded-lg hover:bg-red-500/40 transition-colors text-sm font-medium">
                    Try Again
                </button>
            )}
        </div>
    </div>
);

const GoldenPriceButton = ({ price, duration }) => {
    const formatDuration = (durationStr) => {
        if (!durationStr) return '';
        const lowerDuration = durationStr.toLowerCase();
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
        if (lowerDuration.includes('lifetime')) return 'Lifetime';
        return durationStr.charAt(0).toUpperCase() + durationStr.slice(1);
    };
    const formattedDuration = formatDuration(duration);
    return (
        <div className="my-4">
            <button
                className="golden-btn w-full px-4 py-3 text-center"
                style={{ fontSize: '1em' }}
            >
                {formattedDuration ? (
                    <span className="inline-flex items-center justify-center gap-1">
                        <span className="font-medium">{formattedDuration}</span>
                        <span className="text-xs font-light mx-0.5 text-neon-green lowercase">for</span>
                        <span className="font-bold">${price?.toFixed(2)}</span>
                    </span>
                ) : (
                    <span className="font-bold">${price?.toFixed(2)}</span>
                )}
            </button>
        </div>
    );
};

const SearchResultListingCard = ({ listing, seller }) => {
    const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
    const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || '').replace('/api', '');
    const glowColor = 'rgba(168, 85, 247, 0.4)';

    console.log("[SearchResultListingCard] Listing ID:", listing._id);
    console.log("[SearchResultListingCard] Seller ID:", seller?._id);
    console.log("[SearchResultListingCard] Seller data:", seller);
    console.log("[SearchResultListingCard] Seller badges:", seller?.badges || "No badges");

    return (
        <Link to={`/subscriptions/${listing._id}`} className="block group h-full">
            <div
                className="bg-gray-800/50 border border-gray-700/70 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_-5px_var(--glow-color)] transition-all duration-300 h-full flex flex-col transform hover:scale-[1.03]"
                style={{ '--glow-color': glowColor }}
            >
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-50 mb-2 truncate group-hover:text-neon-green transition-colors" title={listing.name}>{listing.name}</h3>
                    <p className="text-gray-400 text-sm mb-2 h-12 overflow-hidden text-ellipsis leading-relaxed" title={listing.description}>{listing.description || "No description available."}</p>
                    <div className="h-52 bg-gray-700/50 relative overflow-hidden rounded-lg">
                        <img
                            src={listing.imageUrl ? `${IMAGE_BASE_URL}${listing.imageUrl.startsWith('/') ? '' : '/Uploads/'}${listing.imageUrl}` : `https://placehold.co/600x400/1A202C/A0AEC0?text=${encodeURIComponent(listing.name || 'Listing')}`}
                            alt={listing.name || 'Listing Image'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/1A202C/E2E8F0?text=Error`; }}
                        />
                    </div>
                    <GoldenPriceButton price={listing.price} duration={listing.renewalType} />
                    {seller && (
                        <div className="mt-auto pt-4 border-t border-gray-700/60 flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden text-sm font-bold text-white flex-shrink-0 ring-1 ring-gray-500">
                                {seller.avatar ? (
                                    <img
                                        src={`${IMAGE_BASE_URL}${seller.avatar.startsWith('/') ? '' : '/Uploads/'}${seller.avatar}`}
                                        alt={seller.name || 'Seller Avatar'}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.outerHTML = `<span class="text-xs" title="${seller.name || ''}">${getInitials(seller.name)}</span>`; }}
                                    />
                                ) : (
                                    <span className="text-xs" title={seller.name || 'Seller'}>{getInitials(seller.name)}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {seller.name || 'Unknown Seller'}
                                {seller.verificationStatus === 'verified' && (
                                    <svg className="h-6 w-6 text-neon-green" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                                <ProfileBadges badges={seller.badges || []} size="sm" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

const SellerCard = ({ seller }) => {
    const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || '').replace('/api', '');
    const glowColor = 'rgba(57, 255, 20, 0.3)';

    return (
        <div
            className="bg-gray-800/60 border border-gray-700/80 rounded-xl shadow-xl p-5 hover:shadow-[0_0_25px_-5px_var(--glow-color)] transition-all duration-300"
            style={{ '--glow-color': glowColor }}
        >
            <Link to={`/profile/${seller._id}`} className="block mb-4 text-center group">
                <img
                    src={seller.avatar ? `${IMAGE_BASE_URL}${seller.avatar.startsWith('/') ? '' : '/Uploads/'}${seller.avatar}` : `https://placehold.co/120x120/0F172A/7DD3FC?text=${seller.name ? seller.name.charAt(0).toUpperCase() : 'S'}`}
                    alt={seller.name || 'Seller'}
                    className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-2 border-neon-green group-hover:scale-105 group-hover:shadow-md transition-all duration-300"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/120x120/7F1D1D/FFFFFF?text=Err`; }}
                />
                <h3 className="text-xl font-semibold text-neon-green group-hover:underline mb-1 truncate" title={seller.name}>{seller.name || 'Unnamed Seller'}</h3>
            </Link>
            {seller.listings && seller.listings.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-2">Listings by this seller:</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
                        {seller.listings.map(listing => (
                            <Link key={listing._id} to={`/subscriptions/${listing._id}`} className="block group">
                                <div className="bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700/80 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={listing.imageUrl ? `${IMAGE_BASE_URL}${listing.imageUrl.startsWith('/') ? '' : '/Uploads/'}${listing.imageUrl}` : `https://placehold.co/80x80/1A202C/A0AEC0?text=${encodeURIComponent(listing.name || 'L')}`}
                                            alt={listing.name}
                                            className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/7F1D1D/FFFFFF?text=Err`; }}
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-100 group-hover:text-neon-green truncate" title={listing.name}>{listing.name}</p>
                                            <p className="text-xs text-gray-400">${listing.price?.toFixed(2)} / {listing.renewalType}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const SearchResultsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState({ subscriptions: [], sellers: [] });
    const [sellersData, setSellersData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState(searchParams.get('type') || 'all');
    const [filterPeriod, setFilterPeriod] = useState(searchParams.get('period') || 'all');

    useEffect(() => {
        if (query) {
            const fetchResults = async () => {
                setLoading(true);
                setError(null);
                try {
                    const currentParams = new URLSearchParams(searchParams.toString());
                    currentParams.set('q', query);
                    currentParams.set('type', filterType);
                    currentParams.set('period', filterPeriod);
                    setSearchParams(currentParams, { replace: true });

                    const data = await searchService.searchGlobal(query, filterType, filterPeriod);
                    setResults({
                        subscriptions: data.subscriptions || [],
                        sellers: data.sellers || []
                    });

                    const sellerIds = [...new Set(data.subscriptions.map(l => l.seller?._id).filter(id => id))];
                    const sellerPromises = sellerIds.map(async (sellerId) => {
                        try {
                            const response = await userService.getPublicProfileById(sellerId);
                            if (response.success && response.data) {
                                return { [sellerId]: response.data };
                            }
                            console.warn(`SearchResultsPage: No seller data for ID: ${sellerId}`);
                            return { [sellerId]: null };
                        } catch (err) {
                            console.error(`SearchResultsPage: Error fetching seller ${sellerId}:`, err);
                            return { [sellerId]: null };
                        }
                    });

                    const sellerResults = await Promise.all(sellerPromises);
                    const sellersData = sellerResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                    setSellersData(sellersData);
                } catch (err) {
                    setError(err.message || 'Failed to fetch search results.');
                    setResults({ subscriptions: [], sellers: [] });
                } finally {
                    setLoading(false);
                }
            };
            fetchResults();
        } else {
            setResults({ subscriptions: [], sellers: [] });
        }
    }, [query, filterType, filterPeriod, setSearchParams]);

    const handleFilterTypeChange = (e) => setFilterType(e.target.value);
    const handleFilterPeriodChange = (e) => setFilterPeriod(e.target.value);

    const noResultsFound = !loading && !error && results.subscriptions.length === 0 && results.sellers.length === 0 && query;

    const displayedSubscriptions = useMemo(() => {
        if (filterType === 'all' || filterType === 'subscriptions') {
            return results.subscriptions;
        }
        return [];
    }, [results.subscriptions, filterType]);

    const displayedSellers = useMemo(() => {
        if (filterType === 'all' || filterType === 'sellers') {
            return results.sellers;
        }
        return [];
    }, [results.sellers, filterType]);

    const handleRetrySearch = () => {
        if (query) {
            const currentParams = new URLSearchParams(searchParams.toString());
            setSearchParams(currentParams, { replace: true });
        }
    };

    return (
        <div className="min-h-screen text-white flex flex-col relative">
            <AnimatedGradientBackground />
            <div className="relative z-10 flex-grow flex flex-col">
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                    <div className="mb-10 pt-8 text-center">
                        <h1
                            className="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-gray-400 to-gray-500"
                            style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.1)' }}
                        >
                            Search Results
                        </h1>
                        {query && <p className="text-xl text-gray-300">For: "<span className="text-neon-green font-semibold">{query}</span>"</p>}
                    </div>
                    <div className="mb-8 p-4 bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg flex flex-col sm:flex-row gap-4 items-center sticky top-4 z-20 border border-gray-700/50">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Filter size={20} className="text-neon-green" />
                            <label htmlFor="filterType" className="font-medium text-gray-300">Type:</label>
                            <select
                                id="filterType"
                                value={filterType}
                                onChange={handleFilterTypeChange}
                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-neon-green focus:border-neon-green p-2.5 w-full sm:w-auto"
                            >
                                <option value="all">All</option>
                                <option value="subscriptions">Listings</option>
                                <option value="sellers">Sellers</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <CalendarDays size={20} className="text-neon-green" />
                            <label htmlFor="filterPeriod" className="font-medium text-gray-300">Period:</label>
                            <select
                                id="filterPeriod"
                                value={filterPeriod}
                                onChange={handleFilterPeriodChange}
                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-neon-green focus:border-neon-green p-2.5 w-full sm:w-auto"
                            >
                                <option value="all">All Time</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                                <option value="1y">Last Year</option>
                            </select>
                        </div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-lg border border-gray-700/30 rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8">
                        {loading && <LoadingSpinner />}
                        {error && <ErrorMessage message={error} onRetry={handleRetrySearch} />}
                        {noResultsFound && (
                            <div className="text-center py-12 text-gray-400 bg-gray-800/50 rounded-lg border border-gray-700/50">
                                <SearchX className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                                <p className="text-2xl text-gray-300">No results found for "{query}".</p>
                                <p className="text-gray-500 mt-1">Try a different search term or adjust your filters.</p>
                            </div>
                        )}
                        {!loading && !error && !noResultsFound && (
                            <>
                                {(filterType === 'all' || filterType === 'subscriptions') && displayedSubscriptions.length > 0 && (
                                    <section className="mb-12">
                                        <div className="flex items-center mb-6">
                                            <Package size={32} className="text-neon-green mr-3" />
                                            <h2 className="text-3xl font-semibold text-white">Listings ({displayedSubscriptions.length})</h2>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                                            {displayedSubscriptions.map(listing => (
                                                <SearchResultListingCard
                                                    key={listing._id}
                                                    listing={listing}
                                                    seller={sellersData[listing.seller?._id] || listing.seller || {}}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {(filterType === 'all' || filterType === 'sellers') && displayedSellers.length > 0 && (
                                    <section>
                                        <div className="flex items-center mb-6">
                                            <Users size={32} className="text-neon-green mr-3" />
                                            <h2 className="text-3xl font-semibold text-white">Sellers ({displayedSellers.length})</h2>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
                                            {displayedSellers.map(seller => (
                                                <SellerCard key={seller._id} seller={seller} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
            <style jsx global>{`
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
                .particle {
                    position: absolute;
                    background: white;
                    border-radius: 50%;
                    opacity: 0;
                    pointer-events: none;
                    will-change: transform, opacity, left, top;
                }
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
                }
                .text-neon-green {
                    color: var(--neon-green);
                }
            `}</style>
        </div>
    );
};

export default SearchResultsPage;