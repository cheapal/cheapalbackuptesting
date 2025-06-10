"use client";

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/authContext';
import NewCustomToast from '../components/NewCustomToast'; // Assuming path is correct
import { toast } from 'react-toastify';

// --- Animated Background Component (Reused) ---
const AnimatedGradientBackground = () => {
    useEffect(() => {
        const particlesContainer = document.getElementById('particles-container-cart');
        if (!particlesContainer) return;
        const particleCount = 30;
        const existingParticles = particlesContainer.querySelectorAll('.particle-cart');
        existingParticles.forEach(p => p.remove());

        // Moved animateParticle to the correct scope
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
                         const newPosX = Math.random() * 100;
                         const newPosY = Math.random() * 100;
                         // Reset particle for next animation cycle
                         particle.style.transition = `all 0s linear`; 
                         particle.style.left = `${newPosX}%`;
                         particle.style.top = `${newPosY}%`;
                         particle.style.opacity = '0';
                         particle.style.transform = 'scale(0.5)';
                         animateParticle(particle); // Re-trigger animation
                    }
                }, duration * 1000 + delay * 1000); 
            }, delay * 1000);
        };

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle-cart'; 
            const size = Math.random() * 2.5 + 0.5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.position = 'absolute';
            particle.style.background = 'white';
            particle.style.borderRadius = '50%';
            particle.style.opacity = '0';
            particle.style.pointerEvents = 'none';
            
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0.5)';
            
            particlesContainer.appendChild(particle);
            animateParticle(particle); // Call the correctly scoped animateParticle
        };
        
        for (let i = 0; i < particleCount; i++) {
            createParticle();
        }
    }, []);

    return (
        <>
            <div className="gradient-background"> 
                <div className="gradient-sphere sphere-1"></div>
                <div className="gradient-sphere sphere-2"></div>
                <div className="glow"></div>
                <div className="grid-overlay"></div>
                <div className="noise-overlay"></div>
                <div className="particles-container" id="particles-container-cart"></div>
            </div>
        </>
    );
};

// --- SVG Icons for Buttons ---
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const XMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);


const CartPage = () => { // Renamed from ShoppingCartPage to CartPage as per your comment
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            toast.info("Please log in to proceed to checkout.");
            navigate('/login', { state: { from: '/cart' } }); 
        } else if (cartItems.length === 0) {
            toast.warn("Your cart is empty. Please add items before checking out.");
        } else {
            navigate('/checkout'); 
        }
    };

    const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace('/api', '');

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 font-inter relative shopping-cart-page-wrapper">
            <AnimatedGradientBackground />
            
            <div className="cart-container-custom relative z-10">
                <div className="form"> 
                    <header className="checkout__header">
                        <button className="btn btn__round btn__secondary" onClick={() => navigate('/subscriptions')} aria-label="Continue Shopping">
                           <ChevronLeftIcon />
                        </button>
                        <span className="checkout__title-text">Your Shopping Cart</span> 
                        <button className="btn btn__round btn__secondary" onClick={() => navigate('/')} aria-label="Close Cart & Go Home">
                            <XMarkIcon />
                        </button>
                    </header>

                    {cartItems.length === 0 ? (
                        <section className="checkout__info text-center py-10">
                            <p className="text-gray-400 text-lg mb-4">Your cart is currently empty.</p>
                            <Link to="/subscriptions" className="btn btn__primary" style={{backgroundColor: 'var(--neon-black-accent, #1e1e24)'}}>
                                Browse Subscriptions
                            </Link>
                        </section>
                    ) : (
                        <>
                            <section className="checkout__info">
                                <div className="checkout__items">
                                    {cartItems.map((item) => (
                                        <div className="checkout__item" key={item.listing}>
                                            <div className={`item__icon ${item.isPremium ? 'premium_item' : ''}`}>
                                                {item.image ? 
                                                    <img src={`${IMAGE_BASE_URL}/uploads/${item.image}`} alt={item.title.substring(0,1)} className="w-full h-full object-cover"/> 
                                                    : <span>{item.title ? item.title.charAt(0).toUpperCase() : 'S'}</span>
                                                }
                                            </div>
                                            <div className="item__text">
                                                <Link to={`/subscriptions/${item.listing}`} className="item__title-link">{item.title}</Link>
                                                <span className="text-grey">{item.category || 'Subscription'} - {item.duration}</span>
                                                <div className="item__quantity-controls">
                                                    <button onClick={() => updateQuantity(item.listing, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.listing, item.quantity + 1)}>+</button>
                                                </div>
                                            </div>
                                            <div className="item__price-actions">
                                                <span className="item__price">${(item.price * item.quantity).toFixed(2)}</span>
                                                <button onClick={() => removeFromCart(item.listing)} className="item__remove-btn" title="Remove Item">
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="checkout__summary cart__summary"> 
                                <div className="summary_container">
                                    <span className="text-grey">Subtotal</span>
                                    <span>${cartTotal}</span>
                                </div>
                                <div className="summary_container">
                                    <span className="text-grey">Items in Cart</span>
                                    <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                                </div>
                            </section>
                            
                            <div className="cart__actions-footer">
                                <button
                                    onClick={clearCart}
                                    className="btn btn__secondary clear-cart-btn"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </>
                    )}
                </div>
                {cartItems.length > 0 && (
                    <footer className="checkout__buttons">
                        <button className="btn btn__secondary" onClick={() => navigate('/subscriptions')}>Continue Shopping</button>
                        <button 
                            className="btn btn__primary"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout (${cartTotal})
                        </button>
                    </footer>
                )}
            </div>

            <style jsx global>{`
                /* ... (global styles including animated background and cart-specific CSS from previous response) ... */
                body { 
                    font-family: 'Inter', 'Helvetica Neue', sans-serif;
                    background-color: #050505; 
                    color: #cecece; 
                }
                .shopping-cart-page-wrapper { 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh; 
                }

                .gradient-background { 
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    z-index: -1; overflow: hidden;
                }
                .gradient-sphere { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; }
                .gradient-sphere.sphere-1 { width: 45vw; height: 45vw; min-width: 300px; min-height: 300px; background: linear-gradient(40deg, rgba(123, 22, 255, 0.4), rgba(255, 102, 0, 0.2)); top: -15%; left: -15%; animation: float-1-cartpage 20s ease-in-out infinite alternate; }
                .gradient-sphere.sphere-2 { width: 50vw; height: 50vw; min-width: 350px; min-height: 350px; background: linear-gradient(240deg, rgba(72, 0, 255, 0.4), rgba(0, 183, 255, 0.25)); bottom: -25%; right: -15%; animation: float-2-cartpage 22s ease-in-out infinite alternate; }
                .noise-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.03; z-index: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");}
                .grid-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: 50px 50px; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px); z-index: 0;}
                .glow { position: absolute; width: 50vw; height: 50vh; background: radial-gradient(circle, rgba(138, 43, 226, 0.1), transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; animation: pulse-cartpage 10s infinite alternate; filter: blur(50px);}
                
                @keyframes float-1-cartpage {0% { transform: translate(0, 0) scale(1); opacity: 0.5; } 100% { transform: translate(15vw, 10vh) scale(1.15); opacity: 0.7; }}
                @keyframes float-2-cartpage {0% { transform: translate(0, 0) scale(1); opacity: 0.6; } 100% { transform: translate(-10vw, -15vh) scale(1.2); opacity: 0.4; }}
                @keyframes pulse-cartpage {0% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.9); } 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }}
                
                .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
                /* particle-cart is styled in JS */

                :root {
                    --cart-text-color: #cecece;
                    --cart-text-grey: #888888; 
                    --cart-primary-accent: #8B5CF6; 
                    --cart-secondary-accent: #7c3aed; 
                    --cart-btn-secondary-bg: #2c2c33; 
                    --cart-btn-secondary-text: #a0a0a0;
                    --cart-item-icon-bg: #303036;
                    --cart-item-icon-border: #404046;
                    --cart-item-icon-text: #666;
                    --cart-container-bg: #1e1e24; 
                    --cart-container-border: rgb(30 30 30 / 70%);
                    --cart-input-bg: #16161a;
                    --cart-input-placeholder: rgb(80, 80, 80);
                    --cart-section-shadow: rgba(255, 255, 255, 0.08); 
                    --cart-footer-shadow-top: rgba(255, 255, 255, 0.08);
                    --cart-footer-shadow-bottom: rgba(15, 15, 15, 1);
                    --neon-purple-accent: #8B5CF6; /* Ensure this is defined if used directly */
                }

                .cart-container-custom {
                    font-family: 'Inter', sans-serif;
                    color: var(--cart-text-color);
                    border: 2px solid var(--cart-container-border); 
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22),
                        inset 1px 1px 1px 0 rgba(255, 255, 255, 0.03),
                        inset -1px -1px 1px 0 rgba(255, 255, 255, 0.03);
                    border-radius: 16px; 
                    display: flex;
                    flex-direction: column;
                    margin: 1rem auto; 
                    width: 100%;
                    max-width: 600px; 
                    background-image: url("https://assets-global.website-files.com/62e3ee10882dc50bcae8d07a/631a5d4631d4c55a475f3e34_noise-50.png");
                    background-size: 30px 30px; 
                    background-color: var(--cart-container-bg);
                }

                .cart-container-custom a { text-decoration: none; color: var(--cart-primary-accent); }
                .cart-container-custom a:hover { text-decoration: underline; }
                .cart-container-custom .item__title-link { color: #e5e7eb; font-weight: 500; }
                .cart-container-custom .item__title-link:hover { color: var(--cart-primary-accent); text-decoration: none; }
                .cart-container-custom button svg { stroke-width: 2.5px; width: 16px; height: 16px; }

                .btn { display: inline-flex; outline: 0; border: none; border: 1.5px solid rgba(255, 255, 255, 0.1); box-shadow: 0 1px 2px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05); cursor: pointer; font-weight: 600; padding: 10px 18px; border-radius: 8px; transition: all 0.2s ease-out; justify-content: center; align-items: center; gap: 0.5rem; }
                .btn:hover { box-shadow: 0 6px 12px 0 rgba(139, 92, 246, 0.15), 0 3px 5px 0 rgba(139, 92, 246, 0.2); filter: brightness(1.1); }
                .btn:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(60%); }
                .btn__round { padding: 8px; border-radius: 100%; flex: 0 0 auto; background-color: var(--cart-btn-secondary-bg) !important; color: var(--cart-btn-secondary-text) !important; border: 1.5px solid rgba(255,255,255,0.05); }
                .btn__round:hover { background-color: #383840 !important; color: #fff !important; }
                .btn__secondary { background-color: var(--cart-btn-secondary-bg); color: var(--cart-btn-secondary-text); border-color: #4a4a52; }
                .btn__secondary:hover { background-color: #383840; color: #fff; }
                .btn__primary { background-color: var(--cart-primary-accent); color: #fff; border-color: var(--cart-primary-accent); }
                .btn__primary:hover { background-color: var(--cart-secondary-accent); border-color: var(--cart-secondary-accent); }

                .item__icon { width: 64px; height: 64px; flex-shrink: 0; border-radius: 12px; background-color: var(--cart-item-icon-bg); border: 1px solid var(--cart-item-icon-border); color: var(--cart-item-icon-text); font-size: 1.8rem; display: flex; justify-content: center; align-items: center; overflow: hidden; }
                .item__icon img { width: 100%; height: 100%; object-fit: cover; }
                .item__icon.premium_item { background-color: var(--neon-orange-accent, #F97316); border: 2px solid #d97706; color: #fff; }
                .item__icon.premium_item span { color: #fff; }

                .form { padding: 1rem 1rem 0rem 1rem; }
                .checkout__header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.75rem; margin-bottom: 0.75rem; border-bottom: 1px solid var(--cart-section-shadow); }
                .checkout__title-text { font-size: 1.125rem; font-weight: 600; color: #e5e7eb; }
                .checkout__info, .checkout__items, .checkout__summary { display: flex; flex-direction: column; }
                .checkout__info { padding: 0.5rem 0rem; }
                .checkout__item { display: flex; padding: 12px 4px; gap: 16px; align-items: center; border-bottom: 1px solid var(--cart-section-shadow); }
                .checkout__item:last-child { border-bottom: none; }
                .item__text { display: flex; flex-direction: column; gap: 4px; font-size: 0.9rem; flex-grow: 1; }
                .item__text .text-grey { color: var(--cart-text-grey); font-size: 0.75rem; }

                .item__quantity-controls { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem; }
                .item__quantity-controls button { background-color: var(--cart-btn-secondary-bg); color: var(--cart-text-grey); border: 1px solid #4a4a52; width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 1rem; line-height: 1; transition: background-color 0.2s; }
                .item__quantity-controls button:hover:not(:disabled) { background-color: #383840; color: #fff; }
                .item__quantity-controls button:disabled { opacity: 0.5; cursor: not-allowed; }
                .item__quantity-controls span { font-weight: 500; min-width: 20px; text-align: center; color: #e5e7eb; }

                .item__price-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; margin-left: auto; flex-shrink: 0; }
                .item__price { font-weight: 600; font-size: 0.95rem; color: #f3f4f6; }
                .item__remove-btn { background: none; border: none; color: var(--cart-text-grey); padding: 0.25rem; cursor: pointer; line-height: 1; }
                .item__remove-btn:hover { color: var(--cart-primary-accent); }
                .item__remove-btn svg { width: 20px; height: 20px; }

                .checkout__summary.cart__summary { padding: 12px 4px; margin-top: 1rem; border-top: 1px solid var(--cart-section-shadow); }
                .summary_container { display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem; }
                .summary_container span:first-child { color: var(--cart-text-grey); }
                .summary_container span:nth-child(2) { font-weight: 600; color: #e5e7eb; }
                .cart__actions-footer { padding: 0.5rem 0.25rem; display: flex; justify-content: flex-end; }
                .clear-cart-btn { padding: 6px 12px; font-size: 0.8rem; color: var(--cart-text-grey); background-color: transparent; border: 1px solid transparent; }
                .clear-cart-btn:hover { color: var(--cart-primary-accent); border-color: transparent; text-decoration: underline; background-color: transparent; filter: none; box-shadow: none; }

                .checkout__buttons { box-shadow: 0 -1px 0 0 var(--cart-footer-shadow-top), 0 -2px 0 0 var(--cart-footer-shadow-bottom); padding: 1rem; display: flex; gap: 12px; background-color: #161616; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; }
                .checkout__buttons button { flex: 1 1 0%; padding: 12px 18px; font-size: 0.95rem; }
                .text-grey { color: var(--cart-text-grey); font-size: 0.8rem; }
            `}</style>
        </div>
    );
};

export default CartPage;

