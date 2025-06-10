// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Link } from 'react-router-dom';
// import { listingService } from '../services/apiService'; // Import the listing service
// import { Clock, DollarSign } from 'lucide-react'; // Import Clock and DollarSign icons

// // --- Reusable UI Components ---
// const LoadingSpinner = () => (
//     <div className="flex justify-center items-center py-16">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-400"></div>
//     </div>
// );

// const ErrorMessage = ({ message }) => (
//     <div className="text-center py-10 text-red-400">
//         <p>Could not load featured subscriptions.</p>
//         {message && <p className="text-sm mt-1">{message}</p>}
//     </div>
// );

// // --- FeaturedSubscriptions Component ---
// const FeaturedSubscriptions = () => {
//     const [allApprovedListings, setAllApprovedListings] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Predefined structure for featured slots
//     const featuredSlots = [
//         {
//             key: 'nordvpn',
//             name: 'NordVPN',
        
//             defaultDescription: 'VPN service for secure browsing',
//             defaultPrice: '$?.??',
//             defaultDuration: 'Monthly',
//             gradient: 'from-blue-600 via-purple-700 to-purple-800',
//             border: 'border-purple-500/30',
//             buttonGradient: 'from-red-400/40 via-pink-500/40 to-red-400/40'
//         },
//         {
//             key: 'spotify',
//             name: 'Spotify',
//             defaultDescription: 'Ad-free music streaming with premium audio',
//             defaultPrice: '$?.??',
//             defaultDuration: 'Monthly',
//             gradient: 'from-green-600 via-emerald-700 to-teal-800',
//             border: 'border-green-500/30',
//             buttonGradient: 'from-green-400/40 via-teal-500/40 to-green-400/40'
//         },
//         {
//             key: 'appletv',
//             name: 'Apple TV+',
//             defaultDescription: 'Original shows and movies from Apple',
//             defaultPrice: '$?.??',
//             defaultDuration: 'Monthly',
//             gradient: 'from-gray-600 via-slate-700 to-zinc-800',
//             border: 'border-gray-500/30',
//             buttonGradient: 'from-gray-400/40 via-slate-500/40 to-gray-400/40'
//         },
//         {
//             key: 'amazonprime',
//             name: 'Amazon Prime',
//             defaultDescription: 'Fast shipping and premium streaming',
//             defaultPrice: '$?.??',
//             defaultDuration: 'Monthly / Annually',
//             gradient: 'from-blue-600 via-indigo-700 to-violet-800',
//             border: 'border-blue-500/30',
//             buttonGradient: 'from-blue-400/40 via-indigo-500/40 to-blue-400/40'
//         },
//         {
//             key: 'playstationplus',
//             name: 'PlayStation Plus',
//             defaultDescription: 'Online multiplayer and monthly games',
//             defaultPrice: '$?.??',
//             defaultDuration: 'Monthly / Annually',
//             gradient: 'from-blue-700 via-sky-800 to-cyan-900',
//             border: 'border-blue-600/30',
//             buttonGradient: 'from-blue-500/40 via-cyan-500/40 to-blue-500/40'
//         },
//         {
//             key: 'xboxgamepass',
//             name: 'Xbox Game Pass',
//             defaultDescription: 'Access to hundreds of high-quality games',
//             defaultPrice: '$?.??',
//             defaultDuration: 'Monthly',
//             gradient: 'from-green-700 via-lime-800 to-emerald-900',
//             border: 'border-green-600/30',
//             buttonGradient: 'from-green-500/40 via-emerald-500/40 to-green-500/40'
//         },
//         {
//             key: 'applemusic',
//             name: 'Apple Music',
//             defaultDescription: '70+ million songs ad-free',
//             defaultPrice: '$?.??',
//             defaultDuration: 'Monthly',
//             gradient: 'from-pink-600 via-rose-700 to-fuchsia-800',
//             border: 'border-pink-500/30',
//             buttonGradient: 'from-pink-400/40 via-rose-500/40 to-pink-400/40'
//         },
//         {
//             key: 'amazonmusic',
//             name: 'Amazon Music',
//             defaultDescription: 'Stream millions of songs ad-free',
//             defaultPrice: '$?.??',
//             defaultDuration: 'Monthly',
//             gradient: 'from-blue-500 via-cyan-600 to-sky-700',
//             border: 'border-blue-400/30',
//             buttonGradient: 'from-blue-300/40 via-cyan-400/40 to-blue-300/40'
//         }
//     ];

//     const fetchListings = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const responseData = await listingService.getApproved();
//             let listingsArray = [];
//             if (responseData && Array.isArray(responseData.data)) {
//                 listingsArray = responseData.data;
//             } else if (responseData && Array.isArray(responseData.listings)) {
//                 listingsArray = responseData.listings;
//             } else if (responseData && Array.isArray(responseData.subscriptions)) {
//                  listingsArray = responseData.subscriptions;
//             } else if (Array.isArray(responseData)) {
//                 listingsArray = responseData;
//             } else {
//                 console.warn("[FeaturedSubscriptions] Received unexpected data type or structure. Response:", responseData);
//             }
//             setAllApprovedListings(listingsArray);
//         } catch (err) {
//             console.error("[FeaturedSubscriptions] Error fetching approved listings:", err);
//             setError(err.message || 'Failed to fetch listings.');
//             setAllApprovedListings([]);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchListings();
//     }, [fetchListings]);

//     const listingsMap = useMemo(() => {
//         const newMap = allApprovedListings.reduce((map, listing) => {
//             if (listing && listing.title) {
//                 const normalizedKey = listing.title.toLowerCase().replace(/[^a-z0-9]/g, '');
//                 if (!map[normalizedKey] || (listing.price && map[normalizedKey].price && parseFloat(listing.price) < parseFloat(map[normalizedKey].price))) {
//                     map[normalizedKey] = listing;
//                 }
//             }
//             return map;
//         }, {});
//         return newMap;
//     }, [allApprovedListings]);

//     return (
//         <section className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
//             <div className="max-w-7xl mx-auto">
//                       <div className="px-4 mb-12">
//         <h2 className="text-4xl font-bold text-white tracking-tight">
//           featured subscriptions
//           <span className="block text-5xl font-light mt-2">best deals</span>
//         </h2>
//       </div>

//                 {loading ? (
//                     <LoadingSpinner />
//                 ) : error ? (
//                     <ErrorMessage message={error} />
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                         {featuredSlots.map((slot) => {
//                             const matchedListing = listingsMap[slot.key];
//                             const currentPrice = matchedListing?.price ? parseFloat(matchedListing.price) : (slot.defaultPrice.includes('?.??') ? null : parseFloat(slot.defaultPrice.replace(/[^0-9.]/g, '')));
//                             const displayDuration = matchedListing?.duration || slot.defaultDuration;

//                             return (
//                                 matchedListing ? (
//                                     <Link
//                                         key={slot.key}
//                                         to={`/subscriptions/${matchedListing._id}`}
//                                         className={`relative h-[23rem] w-full border-2 ${slot.border} rounded-2xl bg-gradient-to-br ${slot.gradient} text-white p-5 flex flex-col backdrop-blur-md hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-500 group/card hover:-translate-y-1`}
//                                     >
//                                         <div className={`absolute inset-0 bg-gradient-to-br from-purple-600/30 via-fuchsia-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
//                                         <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,190,0.1),transparent_60%)] group-hover/card:animate-pulse`}></div>
//                                         <div className="absolute top-4 right-4 flex gap-2"> <div className="w-2 h-2 rounded-full bg-white/50"></div> <div className="w-2 h-2 rounded-full bg-white/30"></div> <div className="w-2 h-2 rounded-full bg-white/10"></div> </div>

//                                         {/* Main content area (title, description) */}
//                                         <div className="relative z-10 transition-transform duration-300 group-hover/card:translate-y-[-2px] text-center flex-grow flex flex-col justify-start space-y-1.5">
//                                             <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent truncate" title={matchedListing.title}>
//                                                 {matchedListing.title}
//                                             </h1>
//                                             <p className="text-white/80 leading-relaxed font-light text-sm h-10 overflow-hidden text-ellipsis">
//                                                 {matchedListing.description}
//                                             </p>
//                                         </div>
                                        
//                                         {/* Wrapper for Price, Duration, and Button - pushed to bottom */}
//                                         <div className="relative z-10 mt-auto flex flex-col items-center w-full">
//                                             {/* Price display */}
//                                             <div className="flex items-center justify-center text-xl font-semibold text-white pt-2 pb-1">
//                                                 <DollarSign size={20} className="mr-1 opacity-90" />
//                                                 <span>
//                                                     {currentPrice !== null ? currentPrice.toFixed(2) : slot.defaultPrice.includes('?.??') ? '?.??' : slot.defaultPrice}
//                                                 </span>
//                                             </div>

//                                             {/* Duration display */}
//                                             <div className="flex items-center justify-center text-xs text-white/70 pb-3">
//                                                 <Clock size={14} className="mr-1.5 opacity-80" />
//                                                 <span>{displayDuration}</span>
//                                             </div>

//                                             {/* Button */}
//                                             <button className="relative w-full px-4 py-3 border border-white/30 rounded-full flex justify-center items-center overflow-hidden group/btn hover:border-white/50 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all duration-300 backdrop-blur-md bg-white/10">
//                                                 <div className={`absolute inset-0 bg-gradient-to-r ${slot.buttonGradient} translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700`}></div>
//                                                 <span className="relative z-10 font-medium text-sm">
//                                                     Subscribe
//                                                 </span>
//                                             </button>
//                                         </div>

//                                         <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-sm group-hover/card:animate-pulse"></div>
//                                     </Link>
//                                 ) : (
//                                     // Fallback for when no listing matches the slot
//                                     <div
//                                         key={slot.key}
//                                         className={`relative h-[23rem] w-full border-2 ${slot.border} rounded-2xl bg-gradient-to-br ${slot.gradient} text-white p-5 flex flex-col backdrop-blur-md opacity-60 cursor-not-allowed`}
//                                     >
//                                         <div className={`absolute inset-0 bg-gradient-to-br from-purple-600/30 via-fuchsia-500/20 to-transparent opacity-0 rounded-2xl`}></div>
//                                         <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,190,0.1),transparent_60%)]`}></div>
//                                         <div className="absolute top-4 right-4 flex gap-2"> <div className="w-2 h-2 rounded-full bg-white/50"></div> <div className="w-2 h-2 rounded-full bg-white/30"></div> <div className="w-2 h-2 rounded-full bg-white/10"></div> </div>
                                        
//                                         {/* Main content area (title, description) */}
//                                         <div className="relative z-10 text-center flex-grow flex flex-col justify-start space-y-1.5">
//                                             <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent truncate" title={slot.name}>
//                                                 {slot.name}
//                                             </h1>
//                                             <p className="text-white/80 leading-relaxed font-light text-sm h-10 overflow-hidden text-ellipsis">
//                                                 {slot.defaultDescription}
//                                             </p>
//                                         </div>

//                                         {/* Wrapper for Price, Duration, and Button - pushed to bottom */}
//                                         <div className="relative z-10 mt-auto flex flex-col items-center w-full">
//                                             {/* Price display for "Coming Soon" cards */}
//                                             <div className="flex items-center justify-center text-xl font-semibold text-white/70 pt-2 pb-1">
//                                                 <DollarSign size={20} className="mr-1 opacity-70" />
//                                                 <span>{slot.defaultPrice}</span>
//                                             </div>

//                                             {/* Duration display for "Coming Soon" cards */}
//                                             <div className="flex items-center justify-center text-xs text-white/70 pb-3">
//                                                 <Clock size={14} className="mr-1.5 opacity-80" />
//                                                 <span>{slot.defaultDuration}</span>
//                                             </div>

//                                             {/* "Coming Soon" Button */}
//                                             <div className="relative w-full px-4 py-3 border border-white/30 rounded-full flex justify-center items-center backdrop-blur-md bg-white/10 text-gray-400">
//                                                 Coming Soon
//                                             </div>
//                                         </div>

//                                         <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-sm"></div>
//                                     </div>
//                                 )
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default FeaturedSubscriptions;

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { listingService } from '../services/apiService';
import { Clock, DollarSign } from 'lucide-react';

// Predefined gradient configurations
const GRADIENT_CONFIGS = [
  {
    key: 'nordvpn',
    name: 'NordVPN',
    gradient: 'from-blue-600 via-purple-700 to-purple-800',
    border: 'border-purple-500/30',
    buttonGradient: 'from-red-400/40 via-pink-500/40 to-red-400/40'
  },
  {
    key: 'spotify',
    name: 'Spotify',
    gradient: 'from-green-600 via-emerald-700 to-teal-800',
    border: 'border-green-500/30',
    buttonGradient: 'from-green-400/40 via-teal-500/40 to-green-400/40'
  },
  {
    key: 'appletv',
    name: 'Apple TV+',
    gradient: 'from-gray-600 via-slate-700 to-zinc-800',
    border: 'border-gray-500/30',
    buttonGradient: 'from-gray-400/40 via-slate-500/40 to-gray-400/40'
  },
  {
    key: 'amazonprime',
    name: 'Amazon Prime',
    gradient: 'from-blue-600 via-indigo-700 to-violet-800',
    border: 'border-blue-500/30',
    buttonGradient: 'from-blue-400/40 via-indigo-500/40 to-blue-400/40'
  },
  {
    key: 'playstationplus',
    name: 'PlayStation Plus',
    gradient: 'from-blue-700 via-sky-800 to-cyan-900',
    border: 'border-blue-600/30',
    buttonGradient: 'from-blue-500/40 via-cyan-500/40 to-blue-500/40'
  },
  {
    key: 'xboxgamepass',
    name: 'Xbox Game Pass',
    gradient: 'from-green-700 via-lime-800 to-emerald-900',
    border: 'border-green-600/30',
    buttonGradient: 'from-green-500/40 via-emerald-500/40 to-green-500/40'
  },
  {
    key: 'applemusic',
    name: 'Apple Music',
    gradient: 'from-pink-600 via-rose-700 to-fuchsia-800',
    border: 'border-pink-500/30',
    buttonGradient: 'from-pink-400/40 via-rose-500/40 to-pink-400/40'
  },
  {
    key: 'amazonmusic',
    name: 'Amazon Music',
    gradient: 'from-blue-500 via-cyan-600 to-sky-700',
    border: 'border-blue-400/30',
    buttonGradient: 'from-blue-300/40 via-cyan-400/40 to-blue-300/40'
  }
];

// Reusable UI Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-16">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-400"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="text-center py-10 text-red-400">
    <p>Could not load featured subscriptions.</p>
    {message && <p className="text-sm mt-1">{message}</p>}
  </div>
);

// Main Component
const FeaturedSubscriptions = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listingService.getHomepageFeatured();
      console.log('[FeaturedSubscriptions] Homepage featured listings:', response);
      const listings = Array.isArray(response) ? response : [];
      setFeaturedListings(listings.sort((a, b) => (a.homepageFeaturedConfig?.rank || Infinity) - (b.homepageFeaturedConfig?.rank || Infinity)));
    } catch (err) {
      console.error('[FeaturedSubscriptions] Error fetching homepage featured listings:', err);
      setError(err.message || 'Failed to fetch featured listings.');
      setFeaturedListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Map listings to gradient configs
  const getGradientConfig = (listing) => {
    if (!listing?.title) return null;
    const normalizedTitle = listing.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    return GRADIENT_CONFIGS.find(config => normalizedTitle.includes(config.key)) || {
      gradient: listing.homepageFeaturedConfig?.gradient || 'from-blue-600 via-purple-700 to-purple-800',
      border: listing.homepageFeaturedConfig?.border || 'border-purple-500/30',
      buttonGradient: 'from-red-400/40 via-pink-500/40 to-red-400/40'
    };
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 mb-12">
          <h2 className="text-4xl font-bold text-white tracking-tight">
            featured subscriptions
            <span className="block text-5xl font-light mt-2">best deals</span>
          </h2>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : featuredListings.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>No featured subscriptions available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredListings.map((listing) => {
              const config = getGradientConfig(listing);
              const price = listing.price ? parseFloat(listing.price).toFixed(2) : '?.??';
              const duration = listing.duration || 'Monthly';

              return (
                <Link
                  key={listing._id}
                  to={`/subscriptions/${listing._id}`}
                  className={`relative h-[23rem] w-full border-2 ${config.border} rounded-2xl bg-gradient-to-br ${config.gradient} text-white p-5 flex flex-col backdrop-blur-md hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-500 group/card hover:-translate-y-1`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-fuchsia-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,190,0.1),transparent_60%)] group-hover/card:animate-pulse"></div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                    <div className="w-2 h-2 rounded-full bg-white/30"></div>
                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                  </div>

                  <div className="relative z-10 transition-transform duration-300 group-hover/card:translate-y-[-2px] text-center flex-grow flex flex-col justify-start space-y-1.5">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent truncate" title={listing.title}>
                      {listing.title}
                    </h1>
                    <p className="text-white/80 leading-relaxed font-light text-sm h-10 overflow-hidden text-ellipsis">
                      {listing.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-auto flex flex-col items-center w-full">
                    <div className="flex items-center justify-center text-xl font-semibold text-white pt-2 pb-1">
                      <DollarSign size={20} className="mr-1 opacity-90" />
                      <span>{price}</span>
                    </div>
                    <div className="flex items-center justify-center text-xs text-white/70 pb-3">
                      <Clock size={14} className="mr-1.5 opacity-80" />
                      <span>{duration}</span>
                    </div>
                    <button className="relative w-full px-4 py-3 border border-white/30 rounded-full flex justify-center items-center overflow-hidden group/btn hover:border-white/50 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all duration-300 backdrop-blur-md bg-white/10">
                      <div className={`absolute inset-0 bg-gradient-to-r ${config.buttonGradient} translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700`}></div>
                      <span className="relative z-10 font-medium text-sm">Subscribe</span>
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-sm group-hover/card:animate-pulse"></div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSubscriptions;