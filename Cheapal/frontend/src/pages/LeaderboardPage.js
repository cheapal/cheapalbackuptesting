"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sellerService } from '../services/apiService';
import NewCustomToast from '../components/NewCustomToast';

// Reusable UI Components
const LoadingSpinner = ({ size = 'h-10 w-10', color = 'border-neon-purple' }) => (
  <div className="flex justify-center items-center py-16 h-full">
    <div className={`animate-spin rounded-full ${size} border-t-2 border-b-2 ${color}`}></div>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-700/10 border border-red-700/30 text-red-300 p-4 rounded-lg text-center my-6 mx-auto max-w-md shadow-lg">
    <p className="font-medium">Oops! Something went wrong.</p>
    <p className="text-sm">{message || "An error occurred."}</p>
    {onRetry && (
      <button onClick={onRetry} className="mt-3 px-4 py-1.5 bg-red-600/50 hover:bg-red-600/70 text-white text-xs font-semibold rounded-md transition-colors">
        Retry
      </button>
    )}
  </div>
);

// Mock Data for Development
const mockSellers = [
  { _id: '1', name: 'John Doe', avatar: 'john.jpg', handle: 'johndoe', salesCount: 50, ordersFulfilled: 45 },
  { _id: '2', name: 'Jane Smith', avatar: 'jane.jpg', handle: 'janesmith', salesCount: 40, ordersFulfilled: 38 },
  { _id: '3', name: 'Alex Johnson', avatar: 'alex.jpg', salesCount: 35, ordersFulfilled: 30 },
  { _id: '4', name: 'Emily Brown', avatar: 'emily.jpg', handle: 'emilyb', salesCount: 30, ordersFulfilled: 28 },
  { _id: '5', name: 'Michael Lee', avatar: 'michael.jpg', salesCount: 25, ordersFulfilled: 22 },
  { _id: '6', name: 'Sarah Davis', avatar: 'sarah.jpg', handle: 'sarahd', salesCount: 20, ordersFulfilled: 18 },
  { _id: '7', name: 'David Wilson', avatar: 'david.jpg', salesCount: 15, ordersFulfilled: 12 },
  { _id: '8', name: 'Laura Martinez', avatar: 'laura.jpg', handle: 'lauram', salesCount: 10, ordersFulfilled: 8 },
  { _id: '9', name: 'Chris Taylor', avatar: 'chris.jpg', salesCount: 8, ordersFulfilled: 6 },
  { _id: '10', name: 'Anna Clark', avatar: 'anna.jpg', handle: 'annac', salesCount: 5, ordersFulfilled: 4 },
];

// Animated Background
const AnimatedGradientBackground = () => {
  useEffect(() => {
    const particlesContainer = document.getElementById('particles-container-leaderboard');
    if (!particlesContainer) return;
    const particleCount = 40; // Increased for richer effect
    const existingParticles = particlesContainer.querySelectorAll('.particle-leaderboard');
    existingParticles.forEach(p => p.remove());

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle-leaderboard';
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.position = 'absolute';
      particle.style.background = `radial-gradient(circle, #A020F0, #ffffff)`;
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
      const duration = Math.random() * 15 + 10; // Smoother range
      const delay = Math.random() * 10;
      setTimeout(() => {
        if (!particlesContainer || !particlesContainer.contains(particle)) return;
        particle.style.transition = `all ${duration}s ease-in-out`;
        particle.style.opacity = (Math.random() * 0.3 + 0.1).toString();
        particle.style.transform = 'scale(1)';
        const moveX = parseFloat(particle.style.left) + (Math.random() * 30 - 15);
        const moveY = parseFloat(particle.style.top) - (Math.random() * 40 + 10);
        particle.style.left = `${moveX}%`;
        particle.style.top = `${moveY}%`;
        setTimeout(() => {
          if (particlesContainer && particlesContainer.contains(particle)) {
            animateParticle(particle);
          }
        }, duration * 1000);
      }, delay * 1000);
    };
    for (let i = 0; i < particleCount; i++) createParticle();

    const spheres = document.querySelectorAll('.gradient-sphere-leaderboard');
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
        <div className="gradient-sphere sphere-1 gradient-sphere-leaderboard"></div>
        <div className="gradient-sphere sphere-2 gradient-sphere-leaderboard"></div>
        <div className="glow"></div>
        <div className="grid-overlay"></div>
        <div className="noise-overlay"></div>
        <div className="particles-container" id="particles-container-leaderboard"></div>
      </div>
    </>
  );
};

const LeaderboardPage = () => {
  const leaderboardRef = useRef(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState('30days');
  const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace("/api", "");

  // Fetch top sellers
  const fetchTopSellers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = timePeriod !== 'all' ? { period: timePeriod } : {};
      const response = await sellerService.getTopSellers(params);
      console.log('[LeaderboardPage] fetchTopSellers: Response:', JSON.stringify(response, null, 2));
      if (response?.success && Array.isArray(response.data)) {
        const sortedSellers = response.data
          .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
          .slice(0, 10)
          .map((seller, index) => ({
            rank: index + 1,
            name: seller.name || 'Unknown Seller',
            img: seller.avatar ? `${IMAGE_BASE_URL}/Uploads/${seller.avatar}` : 'https://placehold.co/100x100/1F2937/4B5563?text=No+Image',
            sales: seller.salesCount || 0,
            fulfilled: seller.ordersFulfilled || 0,
            _id: seller._id,
          }));
        setSellers(sortedSellers);
      } else {
        console.warn('[LeaderboardPage] fetchTopSellers: Using mock data due to invalid response');
        setSellers(mockSellers.map((seller, index) => ({
          rank: index + 1,
          name: seller.name,
          img: seller.avatar ? `${IMAGE_BASE_URL}/Uploads/${seller.avatar}` : 'https://placehold.co/100x100/1F2937/4B5563?text=No+Image',
          sales: seller.salesCount || 0,
          fulfilled: seller.ordersFulfilled || 0,
          _id: seller._id,
        })));
        toast(({ closeToast }) => (
          <NewCustomToast
            type="warning"
            headline="Using Mock Data"
            text="No top sellers data available from server. Displaying mock data."
            closeToast={closeToast}
          />
        ));
      }
    } catch (err) {
      console.error('[LeaderboardPage] Failed to fetch top sellers:', err);
      setError(err.message || 'Failed to load leaderboard data.');
      setSellers(mockSellers.map((seller, index) => ({
        rank: index + 1,
        name: seller.name,
        img: seller.avatar ? `${IMAGE_BASE_URL}/Uploads/${seller.avatar}` : 'https://placehold.co/100x100/1F2937/4B5563?text=No+Image',
        sales: seller.salesCount || 0,
        fulfilled: seller.ordersFulfilled || 0,
        _id: seller._id,
      })));
      toast(({ closeToast }) => (
        <NewCustomToast
          type="error"
          headline="Failed to Load Leaderboard"
          text={err.message || "Could not fetch top sellers data. Using mock data."}
          closeToast={closeToast}
        />
      ));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopSellers();
  }, [timePeriod]);

  // Render leaderboard dynamically
  useEffect(() => {
    const listElement = leaderboardRef.current?.querySelector('#leaderboard-list');
    const winnerCardElement = leaderboardRef.current?.querySelector('#leaderboard-winner');

    if (!listElement || !winnerCardElement) {
      console.warn('[LeaderboardPage] Leaderboard DOM elements not found.');
      return;
    }

    listElement.innerHTML = `
      <li class="c-list__item">
        <div class="c-list__grid">
          <div class="u-text--left u-text--small u-text--medium">Rank</div>
          <div class="u-text--left u-text--small u-text--medium">Seller</div>
          <div class="u-text--right u-text--small u-text--medium">Sales</div>
        </div>
      </li>
    `;
    winnerCardElement.innerHTML = '';

    if (!sellers.length) return;

    const randomEmoji = () => {
      const emojis = ['🗿', '♛', '⚔️', '⚡', '💲', '💵', '🏟', 'ᯓ★', '🚀', '🏆', '🔥', '⭐', '💰', '🎉'];
      return emojis[Math.floor(Math.random() * emojis.length)];
    };

    sellers.forEach((seller, index) => {
      const newRow = document.createElement('li');
      newRow.className = 'c-list__item';
      newRow.style.animationDelay = `${index * 0.1}s`; // Staggered fade-in
      newRow.innerHTML = `
        <div class="c-list__grid">
          <div class="c-flag c-place u-bg--transparent">${seller.rank}</div>
          <div class="c-media">
            <img class="c-avatar c-media__img" src="${seller.img}" alt="${seller.name}" />
            <div class="c-media__content">
              <div class="c-media__title">${seller.name}</div>
              <a class="c-button c-button--primary--light c-button--small" href="/profile/${seller._id}" rel="noopener noreferrer">View Profile</a>
            </div>
          </div>
          <div class="u-text--right c-kudos">
            <div class="u-mt--8">
              <strong>${seller.sales}</strong> ${randomEmoji()}
            </div>
          </div>
        </div>
      `;
      const placeElement = newRow.querySelector('.c-place');
      const kudosElement = newRow.querySelector('.c-kudos');
      if (seller.rank === 1) {
        placeElement.classList.add('u-text--dark', 'u-bg--yellow');
        kudosElement.classList.add('u-text--yellow');
      } else if (seller.rank === 2) {
        placeElement.classList.add('u-text--dark', 'u-bg--teal');
        kudosElement.classList.add('u-text--teal');
      } else if (seller.rank === 3) {
        placeElement.classList.add('u-text--dark', 'u-bg--orange');
        kudosElement.classList.add('u-text--orange');
      }
      listElement.appendChild(newRow);
    });

    const topFulfiller = sellers.sort((a, b) => (b.fulfilled || 0) - (a.fulfilled || 0))[0];
    if (topFulfiller) {
      winnerCardElement.innerHTML = `
        <div class="u-text-small u-text--medium u-mb--16">Top Order Fulfiller</div>
        <img class="c-avatar c-avatar--lg" src="${topFulfiller.img}" alt="${topFulfiller.name}"/>
        <h3 class="u-mt--16">${topFulfiller.name}</h3>
        <a class="c-button c-button--primary--light c-button--small u-mt--8" href="/profile/${topFulfiller._id}" rel="noopener noreferrer">View Profile</a>
        <div class="u-text--small u-text--teal u-mt--8">${topFulfiller.fulfilled} Orders Fulfilled</div>
      `;
    }
  }, [sellers]);

  return (
    <div className="min-h-screen text-gray-100 font-sans flex flex-col relative leaderboard-page-container">
      <AnimatedGradientBackground />

      {/* Public Navbar */}
      <nav className="bg-black/30 backdrop-blur-md shadow-lg sticky top-0 z-30 border-b border-gray-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <Link to="/" className="text-3xl font-bold tracking-tight transition-transform hover:scale-105">
            <span className="text-white">Cheap</span><span className="text-neon-purple">al</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-neon-purple transition-colors font-medium">Home</Link>
            <Link to="/leaderboard" className="text-neon-purple hover:brightness-125 transition-colors font-semibold">Leaderboard</Link>
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Leaderboard Content */}
      <main ref={leaderboardRef} className="leaderboard-content-wrapper container mx-auto relative z-10 flex-grow py-12">
        <div className="l-wrapper">
          <div className="c-header">
            <h1 className="text-5xl text-neon-purple hover:brightness-125 ">Sellers Leaderboard</h1>
            
            <Link to="/subscriptions" className="c-button c-button--secondary c-button--small u-mt--8">Browse Listings</Link>
          </div>
          <div className="l-grid">
            <div className="l-grid__item l-grid__item--sticky">
              <div className="c-card">
                <div className="c-card__body">
                  <div className="u-text--center" id="leaderboard-winner">
                    {loading ? <LoadingSpinner size="h-6 w-6" /> : error ? null : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="l-grid__item">
              <div className="c-card">
                <div className="c-card__header">
                  <h3>Top Sellers by Sales</h3>
                  <select
                    className="c-select"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
                <div className="c-card__body">
                  {loading ? (
                    <LoadingSpinner />
                  ) : error ? (
                    <ErrorMessage message={error} onRetry={fetchTopSellers} />
                  ) : sellers.length === 0 ? (
                    <div className="text-center py-6">
                      <h3 className="text-lg font-semibold text-gray-300">No Data Available</h3>
                      <p className="text-sm text-gray-500">No top sellers found for the selected period.</p>
                    </div>
                  ) : (
                    <ul className="c-list" id="leaderboard-list">
                      <li className="c-list__item">
                        <div className="c-list__grid">
                          <div className="u-text--left u-text--small u-text--medium">Rank</div>
                          <div className="u-text--left u-text--small u-text--medium">Seller</div>
                          <div className="u-text--right u-text--small u-text--medium">Sales</div>
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Inter:wght@400;500;600&display=swap');

        :root {
          --leaderboard-black: #000000;
          --leaderboard-white: #ffffff;
          --leaderboard-darkest: #050505;
          --leaderboard-darker: #1A1A2E;
          --leaderboard-dark: #A3AFBF;
          --leaderboard-medium: #D1D5DB;
          --leaderboard-light: #9CA3AF;
          --leaderboard-lighter: #E5E7EB;
          --leaderboard-lightest: #F3F4F6;
          --leaderboard-primary: #000000;
          --leaderboard-primary-light: #C084FC;
          --leaderboard-primary-trans: rgba(160, 32, 240, 0.4);
          --leaderboard-yellow: #FBBF24;
          --leaderboard-orange: #F97316;
          --leaderboard-teal: #10B981;
          --leaderboard-bg: #050505;
          --leaderboard-color: #D1D5DB;
          --leaderboard-surface: rgba(26, 26, 46, 0.9);
          --leaderboard-spacing-unit: 0.8rem;
        }

        body {
          font-family: 'Inter', 'Helvetica Neue', sans-serif;
          overflow-x: hidden;
          background-color: var(--leaderboard-bg);
          color: ffffff;
          min-height: 100vh;
        }

        .leaderboard-page-container {
          background-color: var(--leaderboard-bg);
        }

        .gradient-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
          overflow: hidden;
        }

        .gradient-sphere {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.6;
        }

        .gradient-sphere.sphere-1 {
          width: 40vw;
          height: 40vw;
          min-width: 300px;
          min-height: 300px;
          background: linear-gradient(45deg, rgba(160, 32, 240, 0.5), rgba(236, 72, 153, 0.3));
          top: -15%;
          left: -10%;
          animation: float-1 20s ease-in-out infinite alternate;
        }

        .gradient-sphere.sphere-2 {
          width: 45vw;
          height: 45vw;
          min-width: 350px;
          min-height: 350px;
          background: linear-gradient(225deg, rgba(168, 85, 247, 0.5), rgba(59, 130, 246, 0.3));
          bottom: -20%;
          right: -15%;
          animation: float-2 22s ease-in-out infinite alternate;
        }

        .noise-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.04;
          z-index: -1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .grid-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: 50px 50px;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          z-index: -1;
        }

        .glow {
          position: fixed;
          width: 70vw;
          height: 70vh;
          background: radial-gradient(circle, rgba(160, 32, 240, 0.12), transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
          animation: pulse 15s infinite alternate;
          filter: blur(80px);
        }

        @keyframes float-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          100% { transform: translate(8vw, 10vh) scale(1.1); opacity: 0.7; }
        }

        @keyframes float-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          100% { transform: translate(-10vw, -12vh) scale(1.15); opacity: 0.6; }
        }

        @keyframes pulse {
          0% { opacity: 0.12; transform: translate(-50%, -50%) scale(0.95); }
          100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1.05); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .particle-leaderboard {
          position: absolute;
          background: radial-gradient(circle, #A020F0, #ffffff);
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.2);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.4);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.6);
        }

        .leaderboard-content-wrapper {
          font-size: 1.6rem;
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--leaderboard-color);
          padding-top: 3rem;
          padding-bottom: 5rem;
          position: relative;
          z-index: 5;
        }

        .leaderboard-content-wrapper h1,
        .leaderboard-content-wrapper h2,
        .leaderboard-content-wrapper h3,
        .leaderboard-content-wrapper h4,
        .leaderboard-content-wrapper h5,
        .leaderboard-content-wrapper h6 {
          font-family: 'Oswald', system-ui, sans-serif;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: var(--leaderboard-spacing-unit);
          margin-bottom: var(--leaderboard-spacing-unit);
          color: var(--leaderboard-lightest);
        }

        .leaderboard-content-wrapper a {
          color: var(--leaderboard-primary);
          text-decoration: none;
          transition: all 150ms ease-out;
          display: inline-block;
          border-radius: calc(var(--leaderboard-spacing-unit) / 2);
        }

        .leaderboard-content-wrapper a:hover {
          background: var(--leaderboard-primary-trans);
          color: var(--leaderboard-primary-light);
          box-shadow: 0 0 8px var(--leaderboard-primary-trans);
        }

        .leaderboard-content-wrapper button,
        .leaderboard-content-wrapper select {
          font-family: 'Inter', system-ui, sans-serif;
          color: inherit;
          cursor: pointer;
        }

        .leaderboard-content-wrapper button:active,
        .leaderboard-content-wrapper button:focus,
        .leaderboard-content-wrapper select:active,
        .leaderboard-content-wrapper select:focus {
          outline: none;
        }

        .l-wrapper {
          width: 100%;
          max-width: 1200px;
          margin: auto;
          padding: calc(var(--leaderboard-spacing-unit) * 2) calc(var(--leaderboard-spacing-unit) * 3);
        }

        .l-grid {
          display: grid;
          grid-template-columns: 1fr 3fr;
          grid-column-gap: calc(var(--leaderboard-spacing-unit) * 3);
          grid-row-gap: calc(var(--leaderboard-spacing-unit) * 3);
          position: relative;
        }

        @media screen and (max-width: 900px) {
          .l-grid {
            grid-template-columns: 1fr;
          }
        }

        .l-grid__item--sticky {
          position: sticky;
          top: 100px;
        }

        @media screen and (max-width: 900px) {
          .l-grid__item--sticky {
            position: static;
          }
        }

        .c-header {
          padding: calc(var(--leaderboard-spacing-unit) * 3) 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: calc(var(--leaderboard-spacing-unit) * 2);
          margin-bottom: calc(var(--leaderboard-spacing-unit) * 4);
          position: relative;
          border-bottom: calc(var(--leaderboard-spacing-unit) / 3) solid var(--leaderboard-primary-trans);
        }

        @media screen and (max-width: 600px) {
          .c-header {
            flex-direction: column;
            text-align: center;
          }
        }

        .c-card {
          border-radius: calc(var(--leaderboard-spacing-unit) * 1.5);
          background: var(--leaderboard-surface);
          width: 100%;
          margin-bottom: calc(var(--leaderboard-spacing-unit) * 3);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .c-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.15);
        }

        .c-card__body,
        .c-card__header {
          padding: calc(var(--leaderboard-spacing-unit) * 3);
        }

        @media screen and (max-width: 600px) {
          .c-card__body,
          .c-card__header {
            padding: calc(var(--leaderboard-spacing-unit) * 2);
          }
        }

        .c-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: calc(var(--leaderboard-spacing-unit) * 2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }

        @media screen and (max-width: 600px) {
          .c-card__header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--leaderboard-spacing-unit);
          }
          .c-card__header h3 {
            margin-bottom: var(--leaderboard-spacing-unit);
          }
          .c-card__header .c-select {
            width: 100%;
          }
        }

        .c-logo {
          display: inline-block;
          width: 100%;
          max-width: calc(var(--leaderboard-spacing-unit) * 20);
          user-select: none;
          filter: brightness(0) invert(1);
          transition: transform 0.3s ease;
        }

        .c-logo:hover {
          transform: scale(1.05);
        }

        @media screen and (max-width: 600px) {
          .c-logo {
            max-width: calc(var(--leaderboard-spacing-unit) * 15);
          }
        }

        .c-list {
          margin: 0;
          padding: 0;
          list-style-type: none;
        }

        .c-list__item {
          padding: calc(var(--leaderboard-spacing-unit) * 2) 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.3s ease, background 0.3s ease;
          animation: fadeIn 0.5s ease-out forwards;
        }

        .c-list__item:hover {
          transform: translateY(-2px);
          background: rgba(160, 32, 240, 0.05);
        }

        .c-list__item:last-child {
          border-bottom: none;
        }

        .c-list__item .c-flag {
          margin-top: var(--leaderboard-spacing-unit);
        }

        @media screen and (max-width: 600px) {
          .c-list__item .c-flag {
            margin-top: calc(var(--leaderboard-spacing-unit) / 2);
          }
        }

        .c-list__grid {
          display: grid;
          grid-template-columns: calc(var(--leaderboard-spacing-unit) * 7) 4fr 1fr;
          grid-column-gap: calc(var(--leaderboard-spacing-unit) * 3);
          align-items: center;
        }

        @media screen and (max-width: 600px) {
          .c-list__grid {
            grid-template-columns: calc(var(--leaderboard-spacing-unit) * 5) 3fr 1fr;
            grid-column-gap: calc(var(--leaderboard-spacing-unit) * 2);
          }
        }

        .c-media {
          display: inline-flex;
          align-items: center;
        }

        .c-media__content {
          padding-left: calc(var(--leaderboard-spacing-unit) * 2);
        }

        @media screen and (max-width: 600px) {
          .c-media__content {
            padding-left: calc(var(--leaderboard-spacing-unit) * 1.5);
          }
        }

        .c-media__title {
          margin-bottom: calc(var(--leaderboard-spacing-unit) / 2);
          color: var(--leaderboard-lightest);
          font-family: 'Oswald', system-ui, sans-serif;
          font-size: 1.6rem;
          font-weight: 500;
        }

        @media screen and (max-width: 600px) {
          .c-media__title {
            font-size: 1.4rem;
          }
        }

        .c-button {
          display: inline-block;
          background: var(--leaderboard-dark);
          border: 0;
          border-radius: calc(var(--leaderboard-spacing-unit) / 2);
          padding: var(--leaderboard-spacing-unit) calc(var(--leaderboard-spacing-unit) * 2.5);
          transition: all 200ms ease-out;
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 600;
          font-size: 1.4rem;
          color: var(--leaderboard-lightest);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .c-button--primary {
          background: var(--leaderboard-primary);
          color: var(--leaderboard-white);
          box-shadow: 0 0 10px var(--leaderboard-primary-trans);
        }

        .c-button--small {
          padding: calc(var(--leaderboard-spacing-unit) / 1.5) calc(var(--leaderboard-spacing-unit) * 2);
          font-size: 1.2rem;
        }

        .c-button:hover,
        .c-button:focus {
          transform: scale(1.05);
          box-shadow: 0 0 15px var(--leaderboard-primary-trans);
          filter: brightness(1.2);
        }

        .c-button:active {
          transform: scale(0.95);
          box-shadow: 0 0 10px var(--leaderboard-primary-trans), inset 0 0 8px rgba(0, 0, 0, 0.3);
          filter: brightness(0.9);
        }

        .c-button--primary:hover {
          animation: pulseGlow 1.5s infinite;
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 10px var(--leaderboard-primary-trans); }
          50% { box-shadow: 0 0 20px var(--leaderboard-primary-trans); }
          100% { box-shadow: 0 0 10px var(--leaderboard-primary-trans); }
        }

        .c-select {
          background: var(--leaderboard-surface);
          padding: calc(var(--leaderboard-spacing-unit) * 1.2);
          appearance: none;
          font-size: 1.4rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: calc(var(--leaderboard-spacing-unit) / 2);
          color: var(--leaderboard-light);
          transition: all 200ms ease-out;
          backdrop-filter: blur(5px);
        }

        .c-select:hover {
          background: rgba(26, 26, 46, 0.95);
          border-color: var(--leaderboard-primary-trans);
        }

        .c-flag {
          --flag-size: calc(var(--leaderboard-spacing-unit) * 4);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--flag-size);
          height: var(--flag-size);
          background: var(--leaderboard-lightest);
          color: var(--leaderboard-dark);
          border-radius: calc(var(--leaderboard-spacing-unit) / 2);
          font-weight: 700;
          font-size: 1.4rem;
        }

        @media screen and (max-width: 600px) {
          .c-flag {
            --flag-size: calc(var(--leaderboard-spacing-unit) * 3.5);
          }
        }

        .c-avatar {
          --avatar-size: calc(var(--leaderboard-spacing-unit) * 6);
          width: var(--avatar-size);
          height: var(--avatar-size);
          border-radius: 50%;
          background: var(--leaderboard-surface);
          color: var(--leaderboard-dark);
          border: 2px solid var(--leaderboard-primary-trans);
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .c-avatar:hover {
          transform: scale(1.1);
        }

        @media screen and (max-width: 600px) {
          .c-avatar {
            --avatar-size: calc(var(--leaderboard-spacing-unit) * 5);
          }
        }

        .c-avatar--lg {
          --avatar-size-lg: calc(var(--leaderboard-spacing-unit) * 12);
          width: var(--avatar-size-lg);
          height: var(--avatar-size-lg);
        }

        .u-text--left { text-align: left; }
        .u-text--center { text-align: center; }
        .u-text--right { text-align: right; }

        .u-text--dark { color: var(--leaderboard-darkest) !important; }
        .u-text--light { color: var(--leaderboard-light) !important; }
        .u-text--yellow { color: var(--leaderboard-yellow) !important; }
        .u-text--orange { color: var(--leaderboard-orange) !important; }
        .u-text--teal { color: var(--leaderboard-teal) !important; }
        .u-text--primary { color: var(--leaderboard-primary) !important; }

        .u-bg--yellow { background-color: var(--leaderboard-yellow) !important; }
        .u-bg--orange { background-color: var(--leaderboard-orange) !important; }
        .u-bg--teal { background-color: var(--leaderboard-teal) !important; }
        .u-bg--transparent { background-color: transparent !important; }

        .u-display--flex { display: flex; }
        .u-justify--space-between { justify-content: space-between; }

        .u-text--small { font-size: 1.3rem; color: var(--leaderboard-medium); }
        .u-text--medium { font-weight: 500; color: var(--leaderboard-medium); }

        .u-mt--8 { margin-top: var(--leaderboard-spacing-unit); }
        .u-mb--16 { margin-bottom: calc(var(--leaderboard-spacing-unit) * 2); }
        .u-mt--16 { margin-top: calc(var(--leaderboard-spacing-unit) * 2); }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;