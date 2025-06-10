// "use client";

// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { orderService } from '../services/apiService'; 
// import { useAuth } from '../context/authContext'; 

// // --- Reusable Animated Background ---
// const AnimatedGradientBackground = () => {
//     useEffect(() => {
//         const particlesContainer = document.getElementById('particles-container-confirmation');
//         if (!particlesContainer) return;
//         const particleCount = 30;
//         const existingParticles = particlesContainer.querySelectorAll('.particle-confirmation');
//         existingParticles.forEach(p => p.remove());

//         const createParticle = () => {
//             const particle = document.createElement('div');
//             particle.className = 'particle-confirmation'; 
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
//             setTimeout(() => {
//                 if (!particlesContainer || !particlesContainer.contains(particle)) return;
//                 particle.style.transition = `all ${duration}s linear`;
//                 particle.style.opacity = (Math.random() * 0.2 + 0.03).toString();
//                 particle.style.transform = 'scale(1)';
//                 const moveX = parseFloat(particle.style.left) + (Math.random() * 40 - 20);
//                 const moveY = parseFloat(particle.style.top) - (Math.random() * 50 + 15);
//                 particle.style.left = `${moveX}%`;
//                 particle.style.top = `${moveY}%`;
//                 setTimeout(() => {
//                     if (particlesContainer && particlesContainer.contains(particle)) {
//                         if (parseFloat(particle.style.top) < -10 || parseFloat(particle.style.top) > 110 || parseFloat(particle.style.left) < -10 || parseFloat(particle.style.left) > 110) {
//                             resetParticle(particle);
//                         }
//                         animateParticle(particle);
//                     }
//                 }, duration * 1000);
//             }, delay * 1000);
//         };
//         for (let i = 0; i < particleCount; i++) createParticle();

//         const spheres = document.querySelectorAll('.gradient-sphere-confirmation');
//         let animationFrameId;
//         const handleMouseMove = (e) => {
//             cancelAnimationFrame(animationFrameId);
//             animationFrameId = requestAnimationFrame(() => {
//                 const moveX = (e.clientX / window.innerWidth - 0.5) * 15;
//                 const moveY = (e.clientY / window.innerHeight - 0.5) * 15;
//                 spheres.forEach(sphere => {
//                     sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
//                 });
//             });
//         };
//         document.addEventListener('mousemove', handleMouseMove);
//         return () => {
//             document.removeEventListener('mousemove', handleMouseMove);
//             cancelAnimationFrame(animationFrameId);
//             if (particlesContainer) particlesContainer.innerHTML = '';
//         };
//     }, []);

//     return (
//         <>
//             <div className="gradient-background">
//                 <div className="gradient-sphere sphere-1 gradient-sphere-confirmation"></div>
//                 <div className="gradient-sphere sphere-2 gradient-sphere-confirmation"></div>
//                 <div className="glow"></div>
//                 <div className="grid-overlay"></div>
//                 <div className="noise-overlay"></div>
//                 <div className="particles-container" id="particles-container-confirmation"></div>
//             </div>
//         </>
//     );
// };

// // --- Reusable UI Components ---
// const LoadingSpinner = () => (
//     <div className="flex justify-center items-center py-16 h-full">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-neon-purple"></div>
//     </div>
// );

// const ErrorMessageDisplay = ({ message, onRetry }) => (
//     <div className="bg-red-800/30 border border-red-700/50 text-red-200 p-6 rounded-xl text-center my-8 shadow-lg max-w-md mx-auto">
//         <div className="flex flex-col items-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <p className="font-semibold text-lg mb-1">An Error Occurred</p>
//             <span className="text-sm">{message || 'Could not load order details.'}</span>
//             {onRetry && (
//                 <button onClick={onRetry} className="mt-4 px-5 py-2.5 bg-red-600/70 text-white rounded-lg hover:bg-red-600/90 transition-colors text-sm font-semibold shadow-md">
//                     Try Again
//                 </button>
//             )}
//         </div>
//     </div>
// );

// const OrderConfirmationPage = () => {
//     const { orderId } = useParams();
//     const navigate = useNavigate();
//     const { user } = useAuth(); 

//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace('/api', '');

//     const fetchOrderDetails = useCallback(async () => {
//         if (!orderId) {
//             setError("Order ID is missing from URL.");
//             setLoading(false);
//             return;
//         }
//         setLoading(true);
//         setError(null);
//         try {
//             const responseData = await orderService.getOrderById(orderId);
            
//             if (responseData && responseData.success && responseData.data) {
//                 setOrder(responseData.data);
//             } else if (responseData && !responseData.success) { 
//                 setError(responseData.message || "Failed to retrieve order details.");
//                 setOrder(null);
//             } else {
//                 console.warn("OrderConfirmationPage: Received unexpected data structure from orderService.getOrderById:", responseData);
//                 setError("Order not found or could not be retrieved due to unexpected data format.");
//                 setOrder(null);
//             }
//         } catch (err) {
//             console.error("OrderConfirmationPage: Error fetching order details:", err);
//             setError(err.message || "Failed to fetch order details. Please try again.");
//             setOrder(null);
//         } finally {
//             setLoading(false);
//         }
//     }, [orderId]);

//     useEffect(() => {
//         fetchOrderDetails();
//     }, [fetchOrderDetails]);

//     const getStatusColor = (status) => {
//         switch (status?.toLowerCase()) {
//             case 'completed':
//             case 'processing': 
//                 return 'text-green-400 bg-green-700/20 border-green-600/30';
//             case 'pending_payment':
//             case 'requires_action':
//                 return 'text-yellow-400 bg-yellow-700/20 border-yellow-600/30';
//             case 'failed':
//             case 'cancelled':
//                 return 'text-red-400 bg-red-700/20 border-red-600/30';
//             default:
//                 return 'text-gray-400 bg-gray-700/20 border-gray-600/30';
//         }
//     };
    
//     if (loading) {
//         return (
//             <div className="min-h-screen text-white flex flex-col items-center justify-center relative p-4">
//                 <AnimatedGradientBackground />
//                 <div className="relative z-10"><LoadingSpinner /></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen text-white flex flex-col items-center justify-center relative p-4">
//                 <AnimatedGradientBackground />
//                 <div className="relative z-10 w-full max-w-lg">
//                     <ErrorMessageDisplay message={error} onRetry={fetchOrderDetails} />
//                      <div className="mt-6 text-center">
//                         <button 
//                             onClick={() => navigate('/subscriptions')} 
//                             className="px-6 py-2.5 bg-neon-purple text-black rounded-lg hover:brightness-125 transition duration-200 font-semibold shadow-lg"
//                         >
//                             Browse Subscriptions
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (!order) {
//         return (
//              <div className="min-h-screen text-white flex flex-col items-center justify-center relative p-4">
//                 <AnimatedGradientBackground />
//                 <div className="relative z-10 w-full max-w-lg">
//                     <ErrorMessageDisplay message="Order details could not be found or are invalid." />
//                      <div className="mt-6 text-center">
//                         <button 
//                             onClick={() => navigate('/subscriptions')} 
//                             className="px-6 py-2.5 bg-neon-purple text-black rounded-lg hover:brightness-125 transition duration-200 font-semibold shadow-lg"
//                         >
//                             Browse Subscriptions
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen text-white flex flex-col items-center relative py-8 px-4 font-inter">
//             <AnimatedGradientBackground />
//             <div className="relative z-10 w-full max-w-3xl mx-auto">
//                 <div className="bg-black/50 backdrop-blur-xl border border-gray-700/40 rounded-xl shadow-2xl p-6 sm:p-8">
//                     <div className="text-center mb-8">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neon-green mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         <h1 className="text-3xl sm:text-4xl font-bold text-neon-green mb-2">Payment Successful!</h1>
//                         <p className="text-gray-300 text-lg">Thank you for your order.</p>
//                         <p className="text-sm text-gray-400 mt-1">Order ID: <span className="font-mono text-gray-200">{order._id}</span></p>
//                     </div>

//                     <div className="space-y-6">
//                         <div>
//                             <h2 className="text-xl font-semibold text-neon-purple mb-3 border-b border-gray-700 pb-2">Order Summary</h2>
//                             <div className="space-y-3">
//                                 {order.orderItems?.map((item, index) => (
//                                     <div key={item._id || index} className="flex justify-between items-start bg-gray-800/40 p-3 rounded-lg border border-gray-700/50">
//                                         <div className="flex items-center space-x-3">
//                                             {item.image && (
//                                                 <img 
//                                                     src={`${IMAGE_BASE_URL}/uploads/${item.image}`} 
//                                                     alt={item.title} 
//                                                     className="w-12 h-12 object-cover rounded-md flex-shrink-0"
//                                                     onError={(e) => e.target.style.display='none'} 
//                                                 />
//                                             )}
//                                             <div>
//                                                 <p className="text-md font-medium text-gray-100">{item.title}</p>
//                                                 <p className="text-xs text-gray-400">Qty: {item.quantity} &bull; Duration: {item.duration}</p>
//                                             </div>
//                                         </div>
//                                         <p className="text-md font-semibold text-gray-200">${(item.price * item.quantity).toFixed(2)}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="border-t border-gray-700 pt-4 space-y-2">
//                             <div className="flex justify-between text-md">
//                                 <span className="text-gray-300">Subtotal:</span>
//                                 <span className="text-gray-100">${(order.totalPrice - (order.taxPrice || 0) + (order.discountValue || 0)).toFixed(2)}</span> 
//                             </div>
//                              {order.taxPrice > 0 && (
//                                 <div className="flex justify-between text-md">
//                                     <span className="text-gray-300">Tax:</span>
//                                     <span className="text-gray-100">${(order.taxPrice || 0).toFixed(2)}</span>
//                                 </div>
//                             )}
//                             {order.discountValue > 0 && (
//                                 <div className="flex justify-between text-md">
//                                     <span className="text-gray-300">Discount:</span>
//                                     <span className="text-green-400">-${(order.discountValue || 0).toFixed(2)}</span>
//                                 </div>
//                             )}
//                             <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-700/50 mt-2">
//                                 <span className="text-neon-purple">Total Paid:</span>
//                                 <span className="text-neon-purple">${order.totalPrice.toFixed(2)}</span>
//                             </div>
//                         </div>

//                         <div>
//                             <h3 className="text-lg font-semibold text-gray-300 mb-2">Order Details</h3>
//                             <div className="bg-gray-800/40 p-4 rounded-lg border border-gray-700/50 space-y-1.5 text-sm">
//                                 <p><span className="text-gray-400">Date:</span> <span className="text-gray-200">{new Date(order.createdAt).toLocaleString()}</span></p>
//                                 <p><span className="text-gray-400">Payment Method:</span> <span className="text-gray-200 capitalize">{order.paymentMethod?.replace('_', ' ') || 'N/A'}</span></p>
//                                 <p><span className="text-gray-400">Status:</span> 
//                                     <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                                     {order.status?.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Unknown'}
//                                     </span>
//                                 </p>
//                                 {order.paymentIntentId && <p><span className="text-gray-400">Payment ID:</span> <span className="text-gray-200 font-mono text-xs">{order.paymentIntentId}</span></p>}
//                             </div>
//                         </div>
                        
//                         <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
//                             <button 
//                                 onClick={() => navigate('/subscriptions')} 
//                                 className="w-full sm:w-auto px-8 py-3 bg-neon-purple text-black rounded-lg hover:brightness-125 transition duration-200 font-semibold shadow-lg text-md"
//                             >
//                                 Continue Shopping
//                             </button>
//                             {user && (
//                                  <Link 
//                                     to="/buyer-dashboard" 
//                                     className="w-full sm:w-auto text-center px-8 py-3 bg-gray-700/50 text-gray-200 rounded-lg hover:bg-gray-600/70 transition duration-200 font-semibold shadow-lg text-md"
//                                 >
//                                     View My Orders
//                                 </Link>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//              {/* Corrected styled-jsx: removed ={true} from global */}
//             <style jsx global>{`
//                 body { 
//                     font-family: 'Inter', 'Helvetica Neue', sans-serif;
//                     overflow-x: hidden; 
//                     background-color: #050505; 
//                     color: white;
//                 }
//                 .gradient-background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden; }
//                 .gradient-sphere { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; will-change: transform, opacity; }
//                 .sphere-1.gradient-sphere-confirmation { width: 45vw; height: 45vw; min-width: 300px; min-height: 300px; background: linear-gradient(40deg, rgba(50, 205, 50, 0.4), rgba(60, 179, 113, 0.25)); top: -15%; left: -15%; animation: float-1-confirm 20s ease-in-out infinite alternate; }
//                 .sphere-2.gradient-sphere-confirmation { width: 50vw; height: 50vw; min-width: 350px; min-height: 350px; background: linear-gradient(240deg, rgba(34, 139, 34, 0.4), rgba(46, 139, 87, 0.25)); bottom: -25%; right: -15%; animation: float-2-confirm 22s ease-in-out infinite alternate; }
//                 .noise-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.03; z-index: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");}
//                 .grid-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: 50px 50px; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px); z-index: 0;}
//                 .glow { position: absolute; width: 50vw; height: 50vh; background: radial-gradient(circle, rgba(60, 179, 113, 0.1), transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; animation: pulse-confirm 10s infinite alternate; filter: blur(50px);}
                
//                 @keyframes float-1-confirm {0% { transform: translate(0, 0) scale(1); opacity: 0.4; } 100% { transform: translate(15vw, 10vh) scale(1.15); opacity: 0.6; }}
//                 @keyframes float-2-confirm {0% { transform: translate(0, 0) scale(1); opacity: 0.5; } 100% { transform: translate(-10vw, -15vh) scale(1.2); opacity: 0.3; }}
//                 @keyframes pulse-confirm {0% { opacity: 0.15; transform: translate(-50%, -50%) scale(0.9); } 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.1); }}
                
//                 .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
//                 .particle-confirmation { /* Defined in JS */ }
//                 :root { --neon-green: #39FF14; --neon-purple: #8B5CF6;} /* Define CSS variables */
//                 .text-neon-green { color: var(--neon-green); }
//                 .text-neon-purple { color: var(--neon-purple); }
//                 .bg-neon-purple { background-color: var(--neon-purple); }
//             `}</style>
//         </div>
//     );
// };

// export default OrderConfirmationPage;


//from grok

"use client";

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/apiService';
import { useAuth } from '../context/authContext';

// --- Reusable Animated Background ---
const AnimatedGradientBackground = () => {
  useEffect(() => {
    const particlesContainer = document.getElementById('particles-container-confirmation');
    if (!particlesContainer) return;
    const particleCount = 30;
    const existingParticles = particlesContainer.querySelectorAll('.particle-confirmation');
    existingParticles.forEach(p => p.remove());

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle-confirmation';
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
            if (
              parseFloat(particle.style.top) < -10 ||
              parseFloat(particle.style.top) > 110 ||
              parseFloat(particle.style.left) < -10 ||
              parseFloat(particle.style.left) > 110
            ) {
              resetParticle(particle);
            }
            animateParticle(particle);
          }
        }, duration * 1000);
      }, delay * 1000);
    };
    for (let i = 0; i < particleCount; i++) createParticle();

    const spheres = document.querySelectorAll('.gradient-sphere-confirmation');
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
      if (particlesContainer) particlesContainer.innerHTML = '';
    };
  }, []);

  return (
    <>
      <div className="gradient-background">
        <div className="gradient-sphere sphere-1 gradient-sphere-confirmation"></div>
        <div className="gradient-sphere sphere-2 gradient-sphere-confirmation"></div>
        <div className="glow"></div>
        <div className="grid-overlay"></div>
        <div className="noise-overlay"></div>
        <div className="particles-container" id="particles-container-confirmation"></div>
      </div>
    </>
  );
};

// --- Reusable UI Components ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-16 h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-neon-purple"></div>
  </div>
);

const ErrorMessageDisplay = ({ message, onRetry }) => (
  <div className="bg-red-800/30 border border-red-700/50 text-red-200 p-6 rounded-xl text-center my-8 shadow-lg max-w-md mx-auto">
    <div className="flex flex-col items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-red-400 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="font-semibold text-lg mb-1">An Error Occurred</p>
      <span className="text-sm">{message || 'Could not load order details.'}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-5 py-2.5 bg-red-600/70 text-white rounded-lg hover:bg-red-600/90 transition-colors text-sm font-semibold shadow-md"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace('/api', '');

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) {
      setError("Order ID is missing from URL.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const responseData = await orderService.getOrderById(orderId);
      console.log("[OrderConfirmationPage] Fetched order details:", responseData);

      if (responseData && responseData.success && responseData.data) {
        setOrder(responseData.data);
        console.log("[OrderConfirmationPage] Order data set:", responseData.data);
        console.log("[OrderConfirmationPage] Order Seller Message:", responseData.data.sellerMessage);
      } else if (responseData && !responseData.success) {
        setError(responseData.message || "Failed to retrieve order details.");
        setOrder(null);
      } else {
        console.warn(
          "OrderConfirmationPage: Received unexpected data structure from orderService.getOrderById:",
          responseData,
        );
        setError("Order not found or could not be retrieved due to unexpected data format.");
        setOrder(null);
      }
    } catch (err) {
      console.error("OrderConfirmationPage: Error fetching order details:", err);
      setError(err.message || "Failed to fetch order details. Please try again.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'processing':
        return 'text-green-400 bg-green-700/20 border-green-600/30';
      case 'pending_payment':
      case 'requires_action':
        return 'text-yellow-400 bg-yellow-700/20 border-yellow-600/30';
      case 'failed':
      case 'cancelled':
        return 'text-red-400 bg-red-700/20 border-red-600/30';
      default:
        return 'text-gray-400 bg-gray-700/20 border-gray-600/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center relative p-4">
        <AnimatedGradientBackground />
        <div className="relative z-10">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center relative p-4">
        <AnimatedGradientBackground />
        <div className="relative z-10 w-full max-w-lg">
          <ErrorMessageDisplay message={error} onRetry={fetchOrderDetails} />
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/subscriptions')}
              className="px-6 py-2.5 bg-neon-purple text-black rounded-lg hover:brightness-125 transition duration-200 font-semibold shadow-lg"
            >
              Browse Subscriptions
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center relative p-4">
        <AnimatedGradientBackground />
        <div className="relative z-10 w-full max-w-lg">
          <ErrorMessageDisplay message="Order details could not be found or are invalid." />
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/subscriptions')}
              className="px-6 py-2.5 bg-neon-purple text-black rounded-lg hover:brightness-125 transition duration-200 font-semibold shadow-lg"
            >
              Browse Subscriptions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center relative py-8 px-4 font-inter">
      <AnimatedGradientBackground />
      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <div className="bg-black/50 backdrop-blur-xl border border-gray-700/40 rounded-xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-neon-green mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-3xl sm:text-4xl font-bold text-neon-green mb-2">Payment Successful!</h1>
            <p className="text-gray-300 text-lg">Thank you for your order.</p>
            <p className="text-sm text-gray-400 mt-1">
              Order ID: <span className="font-mono text-gray-200">{order._id}</span>
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-neon-purple mb-3 border-b border-gray-700 pb-2">
                Order Summary
              </h2>
              <div className="space-y-3">
                {order.orderItems?.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex justify-between items-start bg-gray-800/40 p-3 rounded-lg border border-gray-700/50"
                  >
                    <div className="flex items-center space-x-3">
                      {item.image && (
                        <img
                          src={`${IMAGE_BASE_URL}/Uploads/${item.image}`}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/60x60/2D3748/A0AEC0?text=Img';
                            e.target.alt = 'Image load error';
                          }}
                        />
                      )}
                      <div>
                        <p className="text-md font-medium text-gray-100">{item.title}</p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity} • Duration: {item.duration}
                        </p>
                        {item.listing?.sellerId?.sellerProfile?.autoReplyMessage && (
                          <p className="text-xs text-gray-300 mt-1">
                            <span className="font-semibold">Seller ({item.listing.sellerId.name}):</span>{' '}
                            {item.listing.sellerId.sellerProfile.autoReplyMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-md font-semibold text-gray-200">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-Reply Credentials (Seller's Message) */}
            {order.sellerMessage && (
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Your Product Access Details</h3>
                <div className="bg-gray-800/40 p-4 rounded-lg border border-neon-purple/50 space-y-2 text-sm">
                  <p className="text-gray-200">{order.sellerMessage.message}</p>
                  {(order.sellerMessage.loginDetails?.username || order.sellerMessage.loginDetails?.password || order.sellerMessage.loginDetails?.accessLink) && (
                    <div className="bg-black/60 p-3 rounded-md">
                      {order.sellerMessage.loginDetails.username && (
                        <p>
                          <span className="text-gray-400">Username:</span>{" "}
                          <span className="text-neon-purple font-mono">{order.sellerMessage.loginDetails.username}</span>
                        </p>
                      )}
                      {order.sellerMessage.loginDetails.password && (
                        <p>
                          <span className="text-gray-400">Password:</span>{" "}
                          <span className="text-neon-purple font-mono">{order.sellerMessage.loginDetails.password}</span>
                        </p>
                      )}
                      {order.sellerMessage.loginDetails.accessLink && (
                        <p>
                          <span className="text-gray-400">Access Link:</span>{" "}
                          <a
                            href={order.sellerMessage.loginDetails.accessLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neon-purple underline hover:text-neon-green"
                          >
                            {order.sellerMessage.loginDetails.accessLink}
                          </a>
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-gray-400 text-xs mt-2">
                    Please save these details. For issues, contact the seller or{" "}
                    <a href="mailto:support@cheapal.com" className="text-neon-purple hover:underline">
                      support@cheapal.com
                    </a>.
                  </p>
                </div>
              </div>
            )}

            <div className="border-t border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-md">
                <span className="text-gray-300">Subtotal:</span>
                <span className="text-gray-100">
                  ${(order.totalPrice - (order.taxPrice || 0) + (order.discountValue || 0)).toFixed(2)}
                </span>
              </div>
              {order.taxPrice > 0 && (
                <div className="flex justify-between text-md">
                  <span className="text-gray-300">Tax:</span>
                  <span className="text-gray-100">${(order.taxPrice || 0).toFixed(2)}</span>
                </div>
              )}
              {order.discountValue > 0 && (
                <div className="flex justify-between text-md">
                  <span className="text-gray-300">Discount:</span>
                  <span className="text-green-400">-${(order.discountValue || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-700/50 mt-2">
                <span className="text-neon-purple">Total Paid:</span>
                <span className="text-neon-purple">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Order Details</h3>
              <div className="bg-gray-800/40 p-4 rounded-lg border border-gray-700/50 space-y-1.5 text-sm">
                <p>
                  <span className="text-gray-400">Date:</span>{" "}
                  <span className="text-gray-200">{new Date(order.createdAt).toLocaleString()}</span>
                </p>
                <p>
                  <span className="text-gray-400">Payment Method:</span>{" "}
                  <span className="text-gray-200 capitalize">
                    {order.paymentMethod?.replace('_', ' ') || 'N/A'}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">Status:</span>
                  <span
                    className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {order.status?.replace('_', ' ').split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Unknown'}
                  </span>
                </p>
                {order.paymentIntentId && (
                  <p>
                    <span className="text-gray-400">Payment ID:</span>{" "}
                    <span className="text-gray-200 font-mono text-xs">{order.paymentIntentId}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={() => navigate('/subscriptions')}
                className="w-full sm:w-auto px-8 py-3 bg-neon-purple text-black rounded-lg hover:brightness-125 transition duration-200 font-semibold shadow-lg text-md"
              >
                Continue Shopping
              </button>
              {user && (
                <Link
                  to="/buyer-dashboard"
                  className="w-full sm:w-auto text-center px-8 py-3 bg-gray-700/50 text-gray-200 rounded-lg hover:bg-gray-600/70 transition duration-200 font-semibold shadow-lg text-md"
                >
                  View My Orders
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        body {
          font-family: 'Inter', 'Helvetica Neue', sans-serif;
          overflow-x: hidden;
          background-color: #050505;
          color: white;
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
        .sphere-1.gradient-sphere-confirmation {
          width: 45vw;
          height: 45vw;
          min-width: 300px;
          min-height: 300px;
          background: linear-gradient(40deg, rgba(50, 205, 50, 0.4), rgba(60, 179, 113, 0.25));
          top: -15%;
          left: -15%;
          animation: float-1-confirm 20s ease-in-out infinite alternate;
        }
        .sphere-2.gradient-sphere-confirmation {
          width: 50vw;
          height: 50vw;
          min-width: 350px;
          min-height: 350px;
          background: linear-gradient(240deg, rgba(34, 139, 34, 0.4), rgba(46, 139, 87, 0.25));
          bottom: -25%;
          right: -15%;
          animation: float-2-confirm 22s ease-in-out infinite alternate;
        }
        .noise-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.03;
          z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: 50px 50px;
          background-image: linear-gradient(
              to right,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          z-index: 0;
        }
        .glow {
          position: absolute;
          width: 50vw;
          height: 50vh;
          background: radial-gradient(circle, rgba(60, 179, 113, 0.1), transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          animation: pulse-confirm 10s infinite alternate;
          filter: blur(50px);
        }
        @keyframes float-1-confirm {
          0% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          100% { transform: translate(15vw, 10vh) scale(1.15); opacity: 0.6; }
        }
        @keyframes float-2-confirm {
          0% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          100% { transform: translate(-10vw, -15vh) scale(1.2); opacity: 0.3; }
        }
        @keyframes pulse-confirm {
          0% { opacity: 0.15; transform: translate(-50%, -50%) scale(0.9); }
          100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.1); }
        }
        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }
        .particle-confirmation { /* Defined in JS */ }
        :root {
          --neon-green: #39FF14;
          --neon-purple: #8B5CF6;
        }
        .text-neon-green { color: var(--neon-green); }
        .text-neon-purple { color: var(--neon-purple); }
        .bg-neon-purple { background-color: var(--neon-purple); }
      `}</style>
    </div>
  );
};

export default OrderConfirmationPage;