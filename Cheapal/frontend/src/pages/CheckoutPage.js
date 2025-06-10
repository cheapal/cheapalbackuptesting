// "use client";

// import React, { useState, useEffect, useMemo } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { orderService } from '../services/apiService';
// import { paymentService } from '../services/paymentService';
// import { useAuth } from '../context/authContext';
// import { useCart } from '../context/CartContext';
// import NewCustomToast from '../components/NewCustomToast';
// import { toast } from 'react-toastify';

// // Stripe Imports
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// // IMPORTANT: Replace with your actual Stripe publishable key
// const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RMtfARvwFXX12Gsj6evMrj8dE1pvYCtWwhf7Lohy9OHnbvJAqEUDalBRpgzURSyW8P0XnsY3KDSidYGLOadubL900dre0RKqO';
// const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// // --- Animated Background Component ---
// const AnimatedGradientBackground = () => {
//     useEffect(() => {
//         const particlesContainer = document.getElementById('particles-container-checkout');
//         if (!particlesContainer) return;
//         const particleCount = 30;
//         const existingParticles = particlesContainer.querySelectorAll('.particle-checkout');
//         existingParticles.forEach(p => p.remove());

//         const createParticle = () => {
//             const particle = document.createElement('div');
//             particle.className = 'particle-checkout';
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
//         const spheres = document.querySelectorAll('.gradient-sphere-checkout');
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
//                 <div className="gradient-sphere sphere-1 gradient-sphere-checkout"></div>
//                 <div className="gradient-sphere sphere-2 gradient-sphere-checkout"></div>
//                 <div className="glow"></div>
//                 <div className="grid-overlay"></div>
//                 <div className="noise-overlay"></div>
//                 <div className="particles-container" id="particles-container-checkout"></div>
//             </div>
//         </>
//     );
// };

// // --- UI Components ---
// const LoadingSpinnerSmall = () => (
//     <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//     </svg>
// );

// const PaymentOption = ({ id, value, name, label, icon, checked, onChange, disabled }) => (
//     <label
//         htmlFor={id}
//         className={`flex items-center p-3 border rounded-lg cursor-pointer bg-gray-800/30 transition-all
//                     ${checked ? 'border-neon-orange-accent ring-1 ring-neon-orange-accent' : 'border-gray-600 hover:border-neon-orange-accent/70'}
//                     ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//     >
//         <input
//             type="radio"
//             id={id}
//             name={name}
//             value={value}
//             className="form-radio h-4 w-4 text-neon-orange-accent bg-gray-700 border-gray-500 focus:ring-neon-orange-accent focus:ring-offset-0"
//             checked={checked}
//             onChange={onChange}
//             disabled={disabled}
//         />
//         {icon && <img src={icon} alt={label} className="w-6 h-auto mx-3 object-contain" />}
//         {!icon && <span className="w-6 mx-3"></span>}
//         <span className={`text-sm ${checked ? 'text-neon-orange-accent font-semibold' : 'text-white'}`}>{label}</span>
//     </label>
// );

// // Stripe Card Element Styling
// const CARD_ELEMENT_OPTIONS = {
//     style: {
//         base: {
//             color: "#CECECE",
//             fontFamily: 'Inter, Roboto, "Helvetica Neue", sans-serif',
//             fontSmoothing: "antialiased",
//             fontSize: "16px",
//             "::placeholder": { color: "#6F6F6F" },
//             iconColor: "#8B5CF6"
//         },
//         invalid: { color: "#F87171", iconColor: "#F87171" },
//     },
//     hidePostalCode: true,
// };

// // --- Stripe Checkout Form Component ---
// const StripeCheckoutForm = ({ clientSecret, orderId, finalTotal, onPaymentSuccess, onPaymentError, isProcessingStripePayment, setIsProcessingStripePayment }) => {
//     const stripe = useStripe();
//     const elements = useElements();

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         setIsProcessingStripePayment(true);

//         if (!stripe || !elements) {
//             onPaymentError("Stripe.js has not loaded yet. Please wait and try again.");
//             setIsProcessingStripePayment(false);
//             return;
//         }

//         const cardElement = elements.getElement(CardElement);
//         if (!cardElement) {
//             onPaymentError("Card details are not available. Please ensure the card form is visible.");
//             setIsProcessingStripePayment(false);
//             return;
//         }

//         try {
//             const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//                 payment_method: {
//                     card: cardElement,
//                 },
//             });

//             if (error) {
//                 console.error("[StripeCheckoutForm] Stripe payment error:", error);
//                 onPaymentError(error.message || "An unexpected error occurred during payment.");
//             } else {
//                 switch (paymentIntent.status) {
//                     case 'succeeded':
//                         toast.success(`Payment of $${finalTotal} successful!`);
//                         onPaymentSuccess(paymentIntent);
//                         break;
//                     case 'processing':
//                         toast.info("Payment is processing. We'll update you shortly.");
//                         break;
//                     case 'requires_payment_method':
//                         onPaymentError("Payment failed. Please try another payment method.");
//                         cardElement.clear();
//                         break;
//                     case 'requires_action':
//                         toast.info("Further action is required to complete your payment.");
//                         break;
//                     default:
//                         onPaymentError(`Payment failed with status: ${paymentIntent.status}`);
//                         break;
//                 }
//             }
//         } catch (e) {
//             console.error("[StripeCheckoutForm] Exception during Stripe payment confirmation:", e);
//             onPaymentError("A critical error occurred. Please try again later.");
//         } finally {
//             setIsProcessingStripePayment(false);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="p-4 border border-gray-600 rounded-lg bg-gray-800/20">
//                 <CardElement options={CARD_ELEMENT_OPTIONS} />
//             </div>
//             <button
//                 type="submit"
//                 disabled={!stripe || !elements || isProcessingStripePayment}
//                 className="w-full btn btn__primary flex items-center justify-center"
//             >
//                 {isProcessingStripePayment ? <LoadingSpinnerSmall /> : `Pay $${finalTotal} with Card`}
//             </button>
//         </form>
//     );
// };

// // --- Main CheckoutPage Component ---
// const CheckoutPage = () => {
//     const { user } = useAuth();
//     const navigate = useNavigate();
//     const { cartItems, cartTotal, clearCart } = useCart();

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [isProcessingOrder, setIsProcessingOrder] = useState(false);
//     const [isProcessingStripePayment, setIsProcessingStripePayment] = useState(false);
//     const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
//     const [paymentInstructions, setPaymentInstructions] = useState('');
//     const [orderIdForDisplay, setOrderIdForDisplay] = useState('');
//     const [createdOrderId, setCreatedOrderId] = useState(null);
//     const [couponCode, setCouponCode] = useState('');
//     const [discount, setDiscount] = useState(0);
//     const [tax, setTax] = useState(0);
//     const [stripeClientSecret, setStripeClientSecret] = useState(null);

//     const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace('/api', '');

//     useEffect(() => {
//         if (!loading && cartItems.length === 0 && !isProcessingOrder && !orderIdForDisplay && !stripeClientSecret) {
//             toast(({ closeToast }) => (
//                 <NewCustomToast
//                     type="info"
//                     headline="Empty Cart"
//                     text="Your cart is empty. Add items to proceed."
//                     closeToast={closeToast}
//                 />
//             ));
//             navigate('/subscriptions');
//         }
//     }, [cartItems, loading, navigate, isProcessingOrder, orderIdForDisplay, stripeClientSecret]);

//     const subtotal = parseFloat(cartTotal);
//     useEffect(() => {
//         const calculatedTax = subtotal * 0.10;
//         setTax(calculatedTax);
//     }, [subtotal]);

//     const finalTotal = useMemo(() => {
//         return (subtotal + tax - discount).toFixed(2);
//     }, [subtotal, tax, discount]);

//     const handlePaymentMethodChange = (event) => {
//         setSelectedPaymentMethod(event.target.value);
//         setPaymentInstructions('');
//         setError(null);
//         setStripeClientSecret(null);
//         setOrderIdForDisplay('');
//         setCreatedOrderId(null);
//     };

//     const handleApplyCoupon = () => {
//         if (couponCode.toUpperCase() === 'CHEEPAL20dhjdfnsdmnfdmnmsdf') {
//             const calculatedDiscount = subtotal * 0.20;
//             setDiscount(calculatedDiscount);
//             toast.success("Coupon applied! 20% off.");
//         } else {
//             setDiscount(0);
//             toast.error("Invalid coupon code.");
//         }
//     };

//     const handlePaymentSuccess = (paymentIntent) => {
//         console.log("[CheckoutPage] Stripe Payment Success, navigating to confirmation:", paymentIntent);
//         clearCart();
//         if (createdOrderId) {
//             navigate(`/order-confirmation/${createdOrderId}`);
//         } else {
//             console.warn("[CheckoutPage] createdOrderId not available on payment success, attempting fallback from paymentIntent metadata.");
//             navigate(`/order-confirmation/${paymentIntent?.metadata?.orderId || 'unknown'}`);
//         }
//     };

//     const handlePaymentError = (errorMessage) => {
//         setError(errorMessage);
//         toast.error(errorMessage || "Payment failed. Please try again.");
//     };

//     const handleProceedToPayment = async () => {
//         if (!cartItems || cartItems.length === 0) {
//             toast(({ closeToast }) => (
//                 <NewCustomToast
//                     type="warning"
//                     headline="Empty Cart"
//                     text="Your cart is empty. Add items to proceed."
//                     closeToast={closeToast}
//                 />
//             ));
//             return;
//         }

//         // Validate cartItems
//         for (const item of cartItems) {
//             if (!item.listing || !/^[0-9a-fA-F]{24}$/.test(item.listing)) {
//                 toast(({ closeToast }) => (
//                     <NewCustomToast
//                         type="error"
//                         headline="Invalid Cart Item"
//                         text={`Invalid listing ID for item ${item.title || 'unknown'}.`}
//                         closeToast={closeToast}
//                     />
//                 ));
//                 return;
//             }
//             if (!item.quantity || !Number.isInteger(item.quantity) || item.quantity < 1) {
//                 toast(({ closeToast }) => (
//                     <NewCustomToast
//                         type="error"
//                         headline="Invalid Cart Item"
//                         text={`Invalid quantity for item ${item.title || 'unknown'}. Must be a positive integer.`}
//                         closeToast={closeToast}
//                     />
//                 ));
//                 return;
//             }
//         }

//         setIsProcessingOrder(true);
//         setError(null);
//         setPaymentInstructions('');
//         setOrderIdForDisplay('');
//         setStripeClientSecret(null);
//         setCreatedOrderId(null);

//   const orderPayload = {
//     orderItems: cartItems.map(item => ({
//         listing: item.listing,
//         quantity: item.quantity
//     })),
//     paymentMethod: selectedPaymentMethod
// };
//         console.log("[CheckoutPage] Order Payload:", JSON.stringify(orderPayload, null, 2));

//         try {
//             const createdOrderResponse = await orderService.create(orderPayload);
//             console.log("[CheckoutPage] Order Creation Response:", createdOrderResponse);
//             if (!createdOrderResponse || !createdOrderResponse.success || !createdOrderResponse.data?._id) {
//                 throw new Error(createdOrderResponse?.message || "Failed to create order record.");
//             }

//             const order = createdOrderResponse.data;
//             const currentOrderId = order._id;
//             const shortOrderId = currentOrderId.slice(-6).toUpperCase();

//             setCreatedOrderId(currentOrderId);
//             setOrderIdForDisplay(shortOrderId);

//             if (selectedPaymentMethod === 'card') {
//                 const intentResponse = await paymentService.createPaymentIntent({
//                     orderId: currentOrderId,
//                     amount: parseFloat(finalTotal) * 100, // Convert to cents
//                     currency: 'usd',
//                 });

//                 console.log("[CheckoutPage] Payment Intent Response:", intentResponse);
//                 if (intentResponse.success && intentResponse.clientSecret) {
//                     setStripeClientSecret(intentResponse.clientSecret);
//                     setPaymentInstructions(`Order #${shortOrderId} created. Please complete your card payment below.`);
//                 } else {
//                     throw new Error(intentResponse.message || "Failed to initialize card payment.");
//                 }
//             } else if (selectedPaymentMethod === 'paypal') {
//                 setPaymentInstructions(`Order #${shortOrderId} created. Redirecting to PayPal... (PayPal integration not yet implemented)`);
//                 await new Promise(resolve => setTimeout(resolve, 2000));
//                 toast.info("PayPal flow would start here.");
//             } else {
//                 setPaymentInstructions(`Order #${shortOrderId} created. Follow instructions for ${selectedPaymentMethod}. (This method is a placeholder)`);
//             }
//         } catch (err) {
//             console.error("[CheckoutPage] Order creation or payment initiation failed:", err, "Response:", err.responsePayload);
//             const errMsg = err.responsePayload?.message || err.message || "Failed to process order. Please try again.";
//             setError(errMsg);
//             toast(({ closeToast }) => (
//                 <NewCustomToast
//                     type="error"
//                     headline="Order Processing Error"
//                     text={errMsg}
//                     closeToast={closeToast}
//                 />
//             ));
//         } finally {
//             setIsProcessingOrder(false);
//         }
//     };

//     if (loading && cartItems.length === 0) {
//         return (
//             <div className="min-h-screen bg-darker-bg text-white flex flex-col relative">
//                 <AnimatedGradientBackground />
//                 <div className="relative z-10 flex-grow flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neon-purple"></div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 font-inter relative checkout-page-wrapper">
//             <AnimatedGradientBackground />

//             <div className="checkout-container-custom relative z-10">
//                 <div className="form">
//                     <header className="checkout__header">
//                         <button className="btn btn__round btn__secondary" onClick={() => navigate(-1)} aria-label="Go back">
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
//                         </button>
//                         <span className="text-grey" id="checkout__title">Secure Checkout</span>
//                         <button className="btn btn__round btn__secondary" onClick={() => navigate('/cart')} aria-label="Close checkout">
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
//                         </button>
//                     </header>

//                     <section className="checkout__info">
//                         <div className="checkout__items">
//                             {cartItems.map(item => (
//                                 <div className="checkout__item" key={item.listing}>
//                                     <div className={`item__icon ${item.isPremium ? 'premium_item' : ''}`}>
//                                         {item.image ? <img src={`${IMAGE_BASE_URL}/Uploads/${item.image}`} alt={item.title?.substring(0,1)} className="w-full h-full object-cover rounded-full"/> : <span>{item.title ? item.title.charAt(0).toUpperCase() : 'P'}</span>}
//                                     </div>
//                                     <div className="item__text">
//                                         <span>{item.title} (x{item.quantity})</span>
//                                         <span className="text-grey">{item.category || 'Subscription'} - {item.duration}</span>
//                                     </div>
//                                     <div className="item__price">${(item.price * item.quantity).toFixed(2)}</div>
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="py-4 space-y-3 border-t border-b checkout-border-color">
//                             <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Payment Method</h3>
//                             <PaymentOption id="pay-card" value="card" name="paymentMethod" label="Credit/Debit Card" checked={selectedPaymentMethod === 'card'} onChange={handlePaymentMethodChange} disabled={isProcessingOrder || isProcessingStripePayment} />
//                             <PaymentOption id="pay-paypal" value="paypal" name="paymentMethod" label="PayPal" checked={selectedPaymentMethod === 'paypal'} onChange={handlePaymentMethodChange} disabled={isProcessingOrder || isProcessingStripePayment} />
//                         </div>

//                         {paymentInstructions && !stripeClientSecret && (
//                             <div className="my-4 p-3 bg-blue-900/40 border border-blue-600/50 rounded-lg text-sm text-blue-200">
//                                 {orderIdForDisplay && <p className="font-semibold mb-1">Order #{orderIdForDisplay}</p>}
//                                 {paymentInstructions}
//                             </div>
//                         )}

//                         {selectedPaymentMethod === 'card' && stripeClientSecret && createdOrderId && (
//                             <div className="my-4">
//                                 <p className="text-sm text-gray-300 mb-2">Order #{orderIdForDisplay} created. Enter card details:</p>
//                                 <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
//                                     <StripeCheckoutForm
//                                         clientSecret={stripeClientSecret}
//                                         orderId={createdOrderId}
//                                         finalTotal={finalTotal}
//                                         onPaymentSuccess={handlePaymentSuccess}
//                                         onPaymentError={handlePaymentError}
//                                         isProcessingStripePayment={isProcessingStripePayment}
//                                         setIsProcessingStripePayment={setIsProcessingStripePayment}
//                                     />
//                                 </Elements>
//                             </div>
//                         )}
//                         {error && !stripeClientSecret && (
//                             <div className="my-4 p-3 bg-red-900/40 border border-red-700/50 rounded-lg text-sm text-red-200">
//                                 Error: {error}
//                             </div>
//                         )}

//                         <div className="checkout__coupon">
//                             <input
//                                 type="text"
//                                 placeholder="Coupon code"
//                                 value={couponCode}
//                                 onChange={(e) => setCouponCode(e.target.value)}
//                                 disabled={isProcessingOrder || isProcessingStripePayment}
//                             />
//                             <button
//                                 className="btn btn__secondary"
//                                 onClick={handleApplyCoupon}
//                                 disabled={isProcessingOrder || isProcessingStripePayment || !couponCode}
//                             >
//                                 Apply
//                             </button>
//                         </div>
//                     </section>

//                     <section className="checkout__summary">
//                         <div className="summary_container">
//                             <span className="text-grey">Subtotal</span>
//                             <span>${subtotal.toFixed(2)}</span>
//                         </div>
//                         <div className="summary_container">
//                             <span className="text-grey">Tax (10%)</span>
//                             <span>${tax.toFixed(2)}</span>
//                         </div>
//                         {discount > 0 && (
//                             <div className="summary_container">
//                                 <span className="text-grey">Discount</span>
//                                 <span className="text-green-400">-${discount.toFixed(2)}</span>
//                             </div>
//                         )}
//                     </section>

//                     <section className="checkout__total">
//                         <div className="total__container">
//                             <span>TOTAL</span>
//                             <span>${finalTotal}</span>
//                         </div>
//                         <span className="text-grey">
//                             If the price changes, we'll notify you beforehand. You can check your renewal date or cancel anytime via your <Link to={user ? "/profile" : "/login"}>Account page</Link>.
//                         </span>
//                     </section>
//                 </div>
//                 <footer className="checkout__buttons">
//                     <button className="btn btn__secondary" onClick={() => navigate('/cart')} disabled={isProcessingOrder || isProcessingStripePayment}>Cancel</button>
//                     <button
//                         className="btn btn__primary"
//                         onClick={handleProceedToPayment}
//                         disabled={isProcessingOrder || (selectedPaymentMethod === 'card' && stripeClientSecret) || cartItems.length === 0 || !selectedPaymentMethod}
//                     >
//                         {isProcessingOrder ? <LoadingSpinnerSmall /> : `Proceed to Payment`}
//                     </button>
//                 </footer>
//             </div>

//             <style jsx global>{`
//                 body { font-family: 'Inter', 'Helvetica Neue', sans-serif; background-color: #050505; }
//                 .checkout-page-wrapper { }
//                 .gradient-background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden; }
//                 .gradient-sphere { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; }
//                 .gradient-sphere.sphere-1.gradient-sphere-checkout { width: 45vw; height: 45vw; min-width: 300px; min-height: 300px; background: linear-gradient(40deg, rgba(123, 22, 255, 0.4), rgba(255, 102, 0, 0.2)); top: -15%; left: -15%; animation: float-1-checkout 20s ease-in-out infinite alternate; }
//                 .gradient-sphere.sphere-2.gradient-sphere-checkout { width: 50vw; height: 50vw; min-width: 350px; min-height: 350px; background: linear-gradient(240deg, rgba(72, 0, 255, 0.4), rgba(0, 183, 255, 0.25)); bottom: -25%; right: -15%; animation: float-2-checkout 22s ease-in-out infinite alternate; }
//                 .noise-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.03; z-index: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");}
//                 .grid-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: 50px 50px; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px); z-index: 0;}
//                 .glow { position: absolute; width: 50vw; height: 50vh; background: radial-gradient(circle, rgba(138, 43, 226, 0.1), transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; animation: pulse-checkout 10s infinite alternate; filter: blur(50px);}
//                 @keyframes float-1-checkout {0% { transform: translate(0, 0) scale(1); opacity: 0.5; } 100% { transform: translate(15vw, 10vh) scale(1.15); opacity: 0.7; }}
//                 @keyframes float-2-checkout {0% { transform: translate(0, 0) scale(1); opacity: 0.6; } 100% { transform: translate(-10vw, -15vh) scale(1.2); opacity: 0.4; }}
//                 @keyframes pulse-checkout {0% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.9); } 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }}
//                 .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
//                 :root { --checkout-text-color: #cecece; --checkout-text-grey: #6f6f6f; --checkout-primary-accent: #e73f22; --checkout-secondary-accent: #9a2a16; --checkout-btn-secondary-bg: #242424; --checkout-btn-secondary-text: #686868; --checkout-item-icon-bg: #3b3b3b; --checkout-item-icon-border: #333; --checkout-item-icon-text: #333; --checkout-container-bg: #1a1a1a; --checkout-container-border: rgb(15 15 15 / 50%); --checkout-input-bg: #101010; --checkout-input-placeholder: rgb(64, 64, 64); --checkout-section-shadow: rgba(255, 255, 255, 0.1); --checkout-footer-shadow-top: rgba(255, 255, 255, 0.1); --checkout-footer-shadow-bottom: rgba(20, 20, 20, 1); --neon-purple-accent: #8B5CF6; --neon-orange-accent: #F97316; }
//                 .checkout-container-custom { font-family: Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif; font-weight: normal; color: var(--checkout-text-color); border: 3px solid var(--checkout-container-border); box-shadow: 0 6px 12px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23), inset 1px 1px 1px 0 rgba(255, 255, 255, 0.05), inset -1px -1px 1px 0 rgba(255, 255, 255, 0.05); border-radius: 20px; display: flex; flex-direction: column; margin: 2rem auto; max-width: 500px; background-image: url("https://assets-global.website-files.com/62e3ee10882dc50bcae8d07a/631a5d4631d4c55a475f3e34_noise-50.png"); background-size: 20px 20px; background-color: var(--checkout-container-bg); }
//                 .checkout-container-custom a { text-decoration: none; color: var(--neon-purple-accent); }
//                 .checkout-container-custom a:hover { text-decoration: underline; }
//                 .checkout-container-custom button svg { stroke-width: 2.5px; width: 18px; height: 18px; }
//                 .btn { display: inline-block; outline: 0; border: none; border: 1.5px solid rgba(1, 1, 1, 0.4); box-shadow: 0 1px 1px rgba(0, 0, 0, 0.19), 0 1px 1px rgba(0, 0, 0, 0.23), inset 1px 1px 1px 0 rgba(255, 255, 255, 0.05); cursor: pointer; font-weight: 600; padding: 10px 18px; border-radius: 8px; transition: all 0.2s ease-out; display: flex; justify-content: center; align-items: center; gap: 0.5rem; }
//                 .btn:hover { box-shadow: 0 8px 22px 0 rgba(139, 92, 246, 0.15), 0 4px 6px 0 rgba(139, 92, 246, 0.2); filter: brightness(1.1); }
//                 .btn:disabled { opacity: 0.6; cursor: not-allowed; filter: grayscale(50%); }
//                 .btn__round { padding: 8px; border-radius: 100%; border: none; flex: 0 1 0%; background-color: var(--checkout-btn-secondary-bg) !important; color: var(--checkout-btn-secondary-text) !important; }
//                 .btn__round:hover { background-color: #333 !important; color: #fff !important; }
//                 .btn__secondary { background-color: var(--checkout-btn-secondary-bg); color: var(--checkout-btn-secondary-text); border-color: #444; }
//                 .btn__secondary:hover { background-color: #333; color: #fff; }
//                 .btn__primary { background-color: var(--neon-purple-accent); color: #fff; border-color: var(--neon-purple-accent); }
//                 .btn__primary:hover { background-color: #7c3aed; border-color: #7c3aed; }
//                 .item__icon { width: 48px; height: 48px; flex-shrink: 0; border-radius: 12px; background-color: var(--checkout-item-icon-bg); border: 2px solid var(--checkout-item-icon-border); color: var(--checkout-item-icon-text); font-size: 1.8rem; display: flex; justify-content: center; align-items: center; overflow: hidden; }
//                 .item__icon img { width: 100%; height: 100%; object-fit: cover; }
//                 .item__icon.premium_item { background-color: var(--neon-orange-accent); border: 2px solid #c2410c; color: #fff; }
//                 .item__icon.premium_item span { color: #fff; }
//                 .form { padding: 1rem 1rem 0rem 1rem; }
//                 .checkout__header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.75rem; }
//                 #checkout__title { font-size: 1rem; font-weight: 500; color: #e5e7eb; }
//                 .checkout-border-color { border-color: rgba(255, 255, 255, 0.1); }
//                 .checkout__info, .checkout__summary { box-shadow: 0 1px 0 0 var(--checkout-section-shadow); }
//                 .checkout__info, .checkout__items, .checkout__summary { display: flex; flex-direction: column; }
//                 .checkout__info { padding: 0.5rem 0rem; }
//                 .checkout__item { display: flex; padding: 12px 4px; gap: 16px; align-items: center; }
//                 .item__text { display: flex; flex-direction: column; gap: 4px; font-size: 0.9rem; }
//                 .item__text span:first-child { font-weight: 500; color: #f3f4f6; }
//                 .item__price { margin-left: auto; font-weight: 500; color: #f3f4f6; }
//                 .checkout__coupon { padding: 1rem 0rem; display: flex; gap: 8px; justify-content: space-between; }
//                 .checkout__coupon input { flex-grow: 1; overflow: hidden; box-shadow: inset 2.5px 2.5px 2px 1px rgba(0, 0, 0, 0.04), inset -2.5px 0px 2px 1px rgba(1, 1, 1, 0.04); padding: 10px 14px; background: var(--checkout-input-bg); border: 1px solid #333; border-radius: 8px; white-space: nowrap; font-size: 0.9rem; color: #fff; appearance: none; transition: border 0.15s ease 0s; }
//                 .checkout__coupon input:focus { outline: none; border: 1px solid; box-shadow: 0 0 0 2px var(--neon-purple-accent); border-color: var(--neon-purple-accent); }
//                 .checkout__coupon input::placeholder { color: var(--checkout-input-placeholder); }
//                 .checkout__summary { padding: 12px 0; }
//                 .summary_container { display: flex; padding: 8px 4px; font-size: 0.9rem; }
//                 .summary_container span:first-child { color: var(--checkout-text-grey); }
//                 .summary_container span:nth-child(2) { margin-left: auto; font-weight: 500; color: #e5e7eb; }
//                 .checkout__buttons { box-shadow: 0 -1px 0 0 var(--checkout-footer-shadow-top), 0 -2px 0 0 var(--checkout-footer-shadow-bottom); padding: 1rem; display: flex; gap: 12px; background-color: #161616; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; }
//                 .checkout__buttons button { flex: 1 1 0%; }
//                 .checkout__total { padding: 20px 4px; }
//                 .total__container { display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 1.1rem; font-weight: 600; color: #f3f4f6; }
//                 .total__container span:first-child { text-transform: uppercase; }
//                 .text-grey { color: var(--checkout-text-grey); font-size: 0.8rem; }
//                 :root { --neon-orange-accent: #F97316; }
//             `}</style>
//         </div>
//     );
// };

// export default CheckoutPage;


// from grok


"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderService, paymentService } from "../services/apiService";
import { useAuth } from "../context/authContext";
import { useCart } from "../context/CartContext";
import NewCustomToast from "../components/NewCustomToast";
import { toast } from "react-toastify";

// Stripe Imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Stripe Publishable Key
const STRIPE_PUBLISHABLE_KEY = "pk_test_51RMtfARvwFXX12Gsj6evMrj8dE1pvYCtWwhf7Lohy9OHnbvJAqEUDalBRpgzURSyW8P0XnsY3KDSidYGLOadubL900dre0RKqO";
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// --- Animated Background Component ---
const AnimatedGradientBackground = () => {
  useEffect(() => {
    const particlesContainer = document.getElementById("particles-container-checkout");
    if (!particlesContainer) return;
    const particleCount = 30;
    const existingParticles = particlesContainer.querySelectorAll(".particle-checkout");
    existingParticles.forEach((p) => p.remove());

    const createParticle = () => {
      const particle = document.createElement("div");
      particle.className = "particle-checkout";
      const size = Math.random() * 2.5 + 0.5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.position = "absolute";
      particle.style.background = "white";
      particle.style.borderRadius = "50%";
      particle.style.opacity = "0";
      particle.style.pointerEvents = "none";
      resetParticle(particle);
      particlesContainer.appendChild(particle);
      animateParticle(particle);
    };

    const resetParticle = (particle) => {
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.opacity = "0";
      particle.style.transform = "scale(0.5)";
    };

    const animateParticle = (particle) => {
      const duration = Math.random() * 18 + 12;
      const delay = Math.random() * 12;
      setTimeout(() => {
        if (!particlesContainer || !particlesContainer.contains(particle)) return;
        particle.style.transition = `all ${duration}s linear`;
        particle.style.opacity = (Math.random() * 0.2 + 0.03).toString();
        particle.style.transform = "scale(1)";
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
    const spheres = document.querySelectorAll(".gradient-sphere-checkout");
    let animationFrameId;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const moveX = (e.clientX / window.innerWidth - 0.5) * 15;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 15;
        spheres.forEach((sphere) => {
          sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
      });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (particlesContainer) particlesContainer.innerHTML = "";
    };
  }, []);

  return (
    <>
      <div className="gradient-background">
        <div className="gradient-sphere sphere-1 gradient-sphere-checkout"></div>
        <div className="gradient-sphere sphere-2 gradient-sphere-checkout"></div>
        <div className="glow"></div>
        <div className="grid-overlay"></div>
        <div className="noise-overlay"></div>
        <div className="particles-container" id="particles-container-checkout"></div>
      </div>
    </>
  );
};

// --- UI Components ---
const LoadingSpinnerSmall = () => (
  <svg
    className="animate-spin h-5 w-5 text-black"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const PaymentOption = ({ id, value, name, label, icon, checked, onChange, disabled }) => (
  <label
    htmlFor={id}
    className={`flex items-center p-3 border rounded-lg cursor-pointer bg-gray-800/30 transition-all
                ${checked ? "border-neon-orange-accent ring-1 ring-neon-orange-accent" : "border-gray-600 hover:border-neon-orange-accent/70"}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      className="form-radio h-4 w-4 text-neon-orange-accent bg-gray-700 border-gray-500 focus:ring-neon-orange-accent focus:ring-offset-0"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    {icon && <img src={icon} alt={label} className="w-6 h-auto mx-3 object-contain" />}
    {!icon && <span className="w-6 mx-3"></span>}
    <span className={`text-sm ${checked ? "text-neon-orange-accent font-semibold" : "text-white"}`}>{label}</span>
  </label>
);

// Stripe Card Element Styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#CECECE",
      fontFamily: 'Inter, Roboto, "Helvetica Neue", sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": { color: "#6F6F6F" },
      iconColor: "#8B5CF6",
    },
    invalid: { color: "#F87171", iconColor: "#F87171" },
  },
  hidePostalCode: true,
};

// --- Stripe Checkout Form Component ---
const StripeCheckoutForm = ({
  clientSecret,
  orderId,
  finalTotal,
  onPaymentSuccess,
  onPaymentError,
  isProcessingStripePayment,
  setIsProcessingStripePayment,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessingStripePayment(true);

    if (!stripe || !elements) {
      onPaymentError("Stripe.js has not loaded yet. Please wait and try again.");
      setIsProcessingStripePayment(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onPaymentError("Card details are not available. Please ensure the card form is visible.");
      setIsProcessingStripePayment(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: "Customer Name" }, // Replace with user input if available
        },
      });

      if (error) {
        console.error("[StripeCheckoutForm] Stripe payment error:", error);
        onPaymentError(error.message || "An unexpected error occurred during payment.");
      } else {
        switch (paymentIntent.status) {
          case "succeeded":
            toast(({ closeToast }) => (
              <NewCustomToast
                type="success"
                headline="Payment Successful"
                text={`Payment of $${finalTotal} successful!`}
                closeToast={closeToast}
              />
            ));
            onPaymentSuccess(paymentIntent);
            break;
          case "processing":
            toast(({ closeToast }) => (
              <NewCustomToast
                type="info"
                headline="Payment Processing"
                text="Payment is processing. We'll update you shortly."
                closeToast={closeToast}
              />
            ));
            break;
          case "requires_payment_method":
            onPaymentError("Payment failed. Please try another payment method.");
            cardElement.clear();
            break;
          case "requires_action":
            toast(({ closeToast }) => (
              <NewCustomToast
                type="info"
                headline="Action Required"
                text="Further action is required to complete your payment."
                closeToast={closeToast}
              />
            ));
            break;
          default:
            onPaymentError(`Payment failed with status: ${paymentIntent.status}`);
            break;
        }
      }
    } catch (e) {
      console.error("[StripeCheckoutForm] Exception during Stripe payment confirmation:", e);
      onPaymentError("A critical error occurred. Please try again later.");
    } finally {
      setIsProcessingStripePayment(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-600 rounded-lg bg-gray-800/20">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      <button
        type="submit"
        disabled={!stripe || !elements || isProcessingStripePayment}
        className="w-full btn btn__primary flex items-center justify-center"
      >
        {isProcessingStripePayment ? <LoadingSpinnerSmall /> : `Pay $${finalTotal} with Card`}
      </button>
    </form>
  );
};

// --- Main CheckoutPage Component ---
const CheckoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [isProcessingStripePayment, setIsProcessingStripePayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [orderIdForDisplay, setOrderIdForDisplay] = useState("");
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);

  const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace("/api", "");

  useEffect(() => {
    if (!loading && cartItems.length === 0 && !isProcessingOrder && !orderIdForDisplay && !stripeClientSecret) {
      toast(({ closeToast }) => (
        <NewCustomToast
          type="info"
          headline="Empty Cart"
          text="Your cart is empty. Add items to proceed."
          closeToast={closeToast}
        />
      ));
      navigate("/subscriptions");
    }
  }, [cartItems, loading, navigate, isProcessingOrder, orderIdForDisplay, stripeClientSecret]);

  const subtotal = parseFloat(cartTotal);
  useEffect(() => {
    const calculatedTax = subtotal * 0.1;
    setTax(calculatedTax);
  }, [subtotal]);

  const finalTotal = useMemo(() => {
    return (subtotal + tax - discount).toFixed(2);
  }, [subtotal, tax, discount]);

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
    setPaymentInstructions("");
    setError(null);
    setStripeClientSecret(null);
    setOrderIdForDisplay("");
    setCreatedOrderId(null);
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "CHEEPAL20DHJDFNSDMNFDMNMSDF") {
      const calculatedDiscount = subtotal * 0.2;
      setDiscount(calculatedDiscount);
      toast(({ closeToast }) => (
        <NewCustomToast type="success" headline="Coupon Applied" text="20% off applied!" closeToast={closeToast} />
      ));
    } else {
      setDiscount(0);
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="Invalid Coupon" text="Invalid coupon code." closeToast={closeToast} />
      ));
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log("[CheckoutPage] Stripe Payment Success:", paymentIntent);
    clearCart();
    if (createdOrderId) {
      navigate(`/order-confirmation/${createdOrderId}`);
    } else {
      console.warn("[CheckoutPage] createdOrderId not available, using paymentIntent metadata.");
      navigate(`/order-confirmation/${paymentIntent?.metadata?.orderId || "unknown"}`);
    }
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
    toast(({ closeToast }) => (
      <NewCustomToast type="error" headline="Payment Error" text={errorMessage} closeToast={closeToast} />
    ));
  };

  const handleProceedToPayment = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast(({ closeToast }) => (
        <NewCustomToast
          type="warning"
          headline="Empty Cart"
          text="Your cart is empty. Add items to proceed."
          closeToast={closeToast}
        />
      ));
      return;
    }

    // Validate cartItems
    for (const item of cartItems) {
      if (!item.listing || !/^[0-9a-fA-F]{24}$/.test(item.listing)) {
        toast(({ closeToast }) => (
          <NewCustomToast
            type="error"
            headline="Invalid Cart Item"
            text={`Invalid listing ID for item ${item.title || "unknown"}.`}
            closeToast={closeToast}
          />
        ));
        return;
      }
      if (!item.quantity || !Number.isInteger(item.quantity) || item.quantity < 1) {
        toast(({ closeToast }) => (
          <NewCustomToast
            type="error"
            headline="Invalid Cart Item"
            text={`Invalid quantity for item ${item.title || "unknown"}. Must be a positive integer.`}
            closeToast={closeToast}
          />
        ));
        return;
      }
    }

    setIsProcessingOrder(true);
    setError(null);
    setPaymentInstructions("");
    setOrderIdForDisplay("");
    setStripeClientSecret(null);
    setCreatedOrderId(null);

    const orderPayload = {
      orderItems: cartItems.map((item) => ({
        listing: item.listing,
        quantity: item.quantity,
      })),
      paymentMethod: selectedPaymentMethod,
    };
    console.log("[CheckoutPage] Order Payload:", JSON.stringify(orderPayload, null, 2));

    try {
      const createdOrderResponse = await orderService.create(orderPayload);
      console.log("[CheckoutPage] Order Creation Response:", createdOrderResponse);
      if (!createdOrderResponse?.success || !createdOrderResponse.data?._id) {
        throw new Error(createdOrderResponse?.message || "Failed to create order record.");
      }

      const order = createdOrderResponse.data;
      const currentOrderId = order._id;
      const shortOrderId = currentOrderId.slice(-6).toUpperCase();

      setCreatedOrderId(currentOrderId);
      setOrderIdForDisplay(shortOrderId);

      if (selectedPaymentMethod === "card") {
        const intentResponse = await paymentService.createPaymentIntent({
          orderId: currentOrderId,
          amount: parseFloat(finalTotal) * 100, // Convert to cents
          currency: "usd",
          metadata: { source: "cheapal_checkout" },
        });

        console.log("[CheckoutPage] Payment Intent Response:", intentResponse);
        if (intentResponse.success && intentResponse.clientSecret) {
          setStripeClientSecret(intentResponse.clientSecret);
          setPaymentInstructions(`Order #${shortOrderId} created. Please complete your card payment below.`);
        } else {
          throw new Error(intentResponse.message || "Failed to initialize card payment.");
        }
      } else if (selectedPaymentMethod === "paypal") {
        setPaymentInstructions(
          `Order #${shortOrderId} created. Redirecting to PayPal... (PayPal integration not yet implemented)`,
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast(({ closeToast }) => (
          <NewCustomToast
            type="info"
            headline="PayPal Placeholder"
            text="PayPal flow would start here."
            closeToast={closeToast}
          />
        ));
      } else {
        setPaymentInstructions(
          `Order #${shortOrderId} created. Follow instructions for ${selectedPaymentMethod}. (This method is a placeholder)`,
        );
      }
    } catch (err) {
      console.error("[CheckoutPage] Order creation or payment initiation failed:", err, "Response:", err.responsePayload);
      const errMsg = err.responsePayload?.message || err.message || "Failed to process order. Please try again.";
      setError(errMsg);
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="Order Processing Error" text={errMsg} closeToast={closeToast} />
      ));
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-darker-bg text-white flex flex-col relative">
        <AnimatedGradientBackground />
        <div className="relative z-10 flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neon-purple"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 font-inter relative checkout-page-wrapper">
      <AnimatedGradientBackground />

      <div className="checkout-container-custom relative z-10">
        <div className="form">
          <header className="checkout__header">
            <button
              className="btn btn__round btn__secondary"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="text-grey" id="checkout__title">
              Secure Checkout
            </span>
            <button
              className="btn btn__round btn__secondary"
              onClick={() => navigate("/cart")}
              aria-label="Close checkout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <section className="checkout__info">
            <div className="checkout__items">
              {cartItems.map((item) => (
                <div className="checkout__item" key={item.listing}>
                  <div className={`item__icon ${item.isPremium ? "premium_item" : ""}`}>
                    {item.image ? (
                      <img
                        src={`${IMAGE_BASE_URL}/Uploads/${item.image}`}
                        alt={item.title?.substring(0, 1)}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span>{item.title ? item.title.charAt(0).toUpperCase() : "P"}</span>
                    )}
                  </div>
                  <div className="item__text">
                    <span>{item.title} (x{item.quantity})</span>
                    <span className="text-grey">
                      {item.category || "Subscription"} - {item.duration}
                    </span>
                  </div>
                  <div className="item__price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="py-4 space-y-3 border-t border-b checkout-border-color">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Payment Method
              </h3>
              <PaymentOption
                id="pay-card"
                value="card"
                name="paymentMethod"
                label="Credit/Debit Card"
                checked={selectedPaymentMethod === "card"}
                onChange={handlePaymentMethodChange}
                disabled={isProcessingOrder || isProcessingStripePayment}
              />
              <PaymentOption
                id="pay-paypal"
                value="paypal"
                name="paymentMethod"
                label="PayPal"
                checked={selectedPaymentMethod === "paypal"}
                onChange={handlePaymentMethodChange}
                disabled={isProcessingOrder || isProcessingStripePayment}
              />
            </div>

            {paymentInstructions && !stripeClientSecret && (
              <div className="my-4 p-3 bg-blue-900/40 border border-blue-600/50 rounded-lg text-sm text-blue-200">
                {orderIdForDisplay && <p className="font-semibold mb-1">Order #{orderIdForDisplay}</p>}
                {paymentInstructions}
              </div>
            )}

            {selectedPaymentMethod === "card" && stripeClientSecret && createdOrderId && (
              <div className="my-4">
                <p className="text-sm text-gray-300 mb-2">Order #{orderIdForDisplay} created. Enter card details:</p>
                <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
                  <StripeCheckoutForm
                    clientSecret={stripeClientSecret}
                    orderId={createdOrderId}
                    finalTotal={finalTotal}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    isProcessingStripePayment={isProcessingStripePayment}
                    setIsProcessingStripePayment={setIsProcessingStripePayment}
                  />
                </Elements>
              </div>
            )}
            {error && !stripeClientSecret && (
              <div className="my-4 p-3 bg-red-900/40 border border-red-700/50 rounded-lg text-sm text-red-200">
                Error: {error}
              </div>
            )}

            <div className="checkout__coupon">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={isProcessingOrder || isProcessingStripePayment}
              />
              <button
                className="btn btn__secondary"
                onClick={handleApplyCoupon}
                disabled={isProcessingOrder || isProcessingStripePayment || !couponCode}
              >
                Apply
              </button>
            </div>
          </section>

          <section className="checkout__summary">
            <div className="summary_container">
              <span className="text-grey">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary_container">
              <span className="text-grey">Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="summary_container">
                <span className="text-grey">Discount</span>
                <span className="text-green-400">-${discount.toFixed(2)}</span>
              </div>
            )}
          </section>

          <section className="checkout__total">
            <div className="total__container">
              <span>TOTAL</span>
              <span>${finalTotal}</span>
            </div>
            <span className="text-grey">
              If the price changes, we'll notify you beforehand. You can check your renewal date or cancel
              anytime via your{" "}
              <Link to={user ? "/profile" : "/login"}>Account page</Link>.
            </span>
          </section>
        </div>
        <footer className="checkout__buttons">
          <button
            className="btn btn__secondary"
            onClick={() => navigate("/cart")}
            disabled={isProcessingOrder || isProcessingStripePayment}
          >
            Cancel
          </button>
          <button
            className="btn btn__primary"
            onClick={handleProceedToPayment}
            disabled={
              isProcessingOrder ||
              (selectedPaymentMethod === "card" && stripeClientSecret) ||
              cartItems.length === 0 ||
              !selectedPaymentMethod
            }
          >
            {isProcessingOrder ? <LoadingSpinnerSmall /> : "Proceed to Payment"}
          </button>
        </footer>
      </div>

      <style jsx global>{`
        body {
          font-family: "Inter", "Helvetica Neue", sans-serif;
          background-color: #050505;
        }
        .checkout-page-wrapper {
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
        .gradient-sphere.sphere-1.gradient-sphere-checkout {
          width: 45vw;
          height: 45vw;
          min-width: 300px;
          min-height: 300px;
          background: linear-gradient(40deg, rgba(123, 22, 255, 0.4), rgba(255, 102, 0, 0.2));
          top: -15%;
          left: -15%;
          animation: float-1-checkout 20s ease-in-out infinite alternate;
        }
        .gradient-sphere.sphere-2.gradient-sphere-checkout {
          width: 50vw;
          height: 50vw;
          min-width: 350px;
          min-height: 350px;
          background: linear-gradient(240deg, rgba(72, 0, 255, 0.4), rgba(0, 183, 255, 0.25));
          bottom: -25%;
          right: -15%;
          animation: float-2-checkout 22s ease-in-out infinite alternate;
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
          background: radial-gradient(circle, rgba(138, 43, 226, 0.1), transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          animation: pulse-checkout 10s infinite alternate;
          filter: blur(50px);
        }
        @keyframes float-1-checkout {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          100% {
            transform: translate(15vw, 10vh) scale(1.15);
            opacity: 0.7;
          }
        }
        @keyframes float-2-checkout {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translate(-10vw, -15vh) scale(1.2);
            opacity: 0.4;
          }
        }
        @keyframes pulse-checkout {
          0% {
            opacity: 0.2;
            transform: translate(-50%, -50%) scale(0.9);
          }
          100% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1.1);
          }
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
        :root {
          --checkout-text-color: #cecece;
          --checkout-text-grey: #6f6f6f;
          --checkout-primary-accent: #e73f22;
          --checkout-secondary-accent: #9a2a16;
          --checkout-btn-secondary-bg: #242424;
          --checkout-btn-secondary-text: #686868;
          --checkout-item-icon-bg: #3b3b3b;
          --checkout-item-icon-border: #333;
          --checkout-item-icon-text: #333;
          --checkout-container-bg: #1a1a1a;
          --checkout-container-border: rgb(15 15 15 / 50%);
          --checkout-input-bg: #101010;
          --checkout-input-placeholder: rgb(64, 64, 64);
          --checkout-section-shadow: rgba(255, 255, 255, 0.1);
          --checkout-footer-shadow-top: rgba(255, 255, 255, 0.1);
          --checkout-footer-shadow-bottom: rgba(20, 20, 20, 1);
          --neon-purple-accent: #8b5cf6;
          --neon-orange-accent: #f97316;
        }
        .checkout-container-custom {
          font-family: Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;
          font-weight: normal;
          color: var(--checkout-text-color);
          border: 3px solid var(--checkout-container-border);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23),
            inset 1px 1px 1px 0 rgba(255, 255, 255, 0.05), inset -1px -1px 1px 0 rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          margin: 2rem auto;
          max-width: 500px;
          background-image: url("https://assets-global.website-files.com/62e3ee10882dc50bcae8d07a/631a5d4631d4c55a475f3e34_noise-50.png");
          background-size: 20px 20px;
          background-color: var(--checkout-container-bg);
        }
        .checkout-container-custom a {
          text-decoration: none;
          color: var(--neon-purple-accent);
        }
        .checkout-container-custom a:hover {
          text-decoration: underline;
        }
        .checkout-container-custom button svg {
          stroke-width: 2.5px;
          width: 18px;
          height: 18px;
        }
        .btn {
          display: inline-block;
          outline: 0;
          border: none;
          border: 1.5px solid rgba(1, 1, 1, 0.4);
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.19), 0 1px 1px rgba(0, 0, 0, 0.23),
            inset 1px 1px 1px 0 rgba(255, 255, 255, 0.05);
          cursor: pointer;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: 8px;
          transition: all 0.2s ease-out;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }
        .btn:hover {
          box-shadow: 0 8px 22px 0 rgba(139, 92, 246, 0.15), 0 4px 6px 0 rgba(139, 92, 246, 0.2);
          filter: brightness(1.1);
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          filter: grayscale(50%);
        }
        .btn__round {
          padding: 8px;
          border-radius: 100%;
          border: none;
          flex: 0 1 0%;
          background-color: var(--checkout-btn-secondary-bg) !important;
          color: var(--checkout-btn-secondary-text) !important;
        }
        .btn__round:hover {
          background-color: #333 !important;
          color: #fff !important;
        }
        .btn__secondary {
          background-color: var(--checkout-btn-secondary-bg);
          color: var(--checkout-btn-secondary-text);
          border-color: #444;
        }
        .btn__secondary:hover {
          background-color: #333;
          color: #fff;
        }
        .btn__primary {
          background-color: var(--neon-purple-accent);
          color: #fff;
          border-color: var(--neon-purple-accent);
        }
        .btn__primary:hover {
          background-color: #7c3aed;
          border-color: #7c3aed;
        }
        .item__icon {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 12px;
          background-color: var(--checkout-item-icon-bg);
          border: 2px solid var(--checkout-item-icon-border);
          color: var(--checkout-item-icon-text);
          font-size: 1.8rem;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        .item__icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item__icon.premium_item {
          background-color: var(--neon-orange-accent);
          border: 2px solid #c2410c;
          color: #fff;
        }
        .item__icon.premium_item span {
          color: #fff;
        }
        .form {
          padding: 1rem 1rem 0rem 1rem;
        }
        .checkout__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.75rem;
        }
        #checkout__title {
          font-size: 1rem;
          font-weight: 500;
          color: #e5e7eb;
        }
        .checkout-border-color {
          border-color: rgba(255, 255, 255, 0.1);
        }
        .checkout__info,
        .checkout__items,
        .checkout__summary {
          display: flex;
          flex-direction: column;
        }
        .checkout__info {
          padding: 0.5rem 0rem;
        }
        .checkout__item {
          display: flex;
          padding: 12px 4px;
          gap: 16px;
          align-items: center;
        }
        .item__text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.9rem;
        }
        .item__text span:first-child {
          font-weight: 500;
          color: #f3f4f6;
        }
        .item__price {
          margin-left: auto;
          font-weight: 500;
          color: #f3f4f6;
        }
        .checkout__coupon {
          padding: 1rem 0rem;
          display: flex;
          gap: 8px;
          justify-content: space-between;
        }
        .checkout__coupon input {
          flex-grow: 1;
          overflow: hidden;
          box-shadow: inset 2.5px 2.5px 2px 1px rgba(0, 0, 0, 0.04),
            inset -2.5px 0px 2px 1px rgba(1, 1, 1, 0.04);
          padding: 10px 14px;
          background: var(--checkout-input-bg);
          border: 1px solid #333;
          border-radius: 8px;
          white-space: nowrap;
          font-size: 0.9rem;
          color: #fff;
          appearance: none;
          transition: border 0.15s ease 0s;
        }
        .checkout__coupon input:focus {
          outline: none;
          border: 1px solid;
          box-shadow: 0 0 0 2px var(--neon-purple-accent);
          border-color: var(--neon-purple-accent);
        }
        .checkout__coupon input::placeholder {
          color: var(--checkout-input-placeholder);
        }
        .checkout__summary {
          padding: 12px 0;
        }
        .summary_container {
          display: flex;
          padding: 8px 4px;
          font-size: 0.9rem;
        }
        .summary_container span:first-child {
          color: var(--checkout-text-grey);
        }
        .summary_container span:nth-child(2) {
          margin-left: auto;
          font-weight: 500;
          color: #e5e7eb;
        }
        .checkout__buttons {
          box-shadow: 0 -1px 0 0 var(--checkout-footer-shadow-top),
            0 -2px 0 0 var(--checkout-footer-shadow-bottom);
          padding: 1rem;
          display: flex;
          gap: 12px;
          background-color: #161616;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
        }
        .checkout__buttons button {
          flex: 1 1 0%;
        }
        .checkout__total {
          padding: 20px 4px;
        }
        .total__container {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: #f3f4f6;
        }
        .total__container span:first-child {
          text-transform: uppercase;
        }
        .text-grey {
          color: var(--checkout-text-grey);
          font-size: 0.8rem;
        }
        :root {
          --neon-orange-accent: #f97316;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;