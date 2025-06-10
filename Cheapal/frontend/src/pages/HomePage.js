import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import CategoriesSection from '../components/CategoriesSection';
import FeaturedSubscriptions from '../components/FeaturedSubscriptions';

const HomePage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const isAdmin = !loading && isAuthenticated && user?.role === 'admin';
  const adminLinkTarget = isAdmin ? '/admin/dashboard' : '/login';

  useEffect(() => {
    // Create particle effect
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = 80;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      createParticle();
    }
    
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size (small)
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Initial position
      resetParticle(particle);
      
      particlesContainer.appendChild(particle);
      
      // Animate
      animateParticle(particle);
    }
    
    function resetParticle(particle) {
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.opacity = '0';
      
      return {
        x: posX,
        y: posY
      };
    }
    
    function animateParticle(particle) {
      // Initial position
      const pos = resetParticle(particle);
      
      // Random animation properties
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;
      
      // Animate with GSAP-like timing
      setTimeout(() => {
        particle.style.transition = `all ${duration}s linear`;
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        
        // Move in a slight direction
        const moveX = pos.x + (Math.random() * 20 - 10);
        const moveY = pos.y - Math.random() * 30; // Move upwards
        
        particle.style.left = `${moveX}%`;
        particle.style.top = `${moveY}%`;
        
        // Reset after animation completes
        setTimeout(() => {
          animateParticle(particle);
        }, duration * 1000);
      }, delay * 1000);
    }

    // Mouse interaction
    const handleMouseMove = (e) => {
      // Create particles at mouse position
      const mouseX = (e.clientX / window.innerWidth) * 100;
      const mouseY = (e.clientY / window.innerHeight) * 100;
      
      // Create temporary particle
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Small size
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Position at mouse
      particle.style.left = `${mouseX}%`;
      particle.style.top = `${mouseY}%`;
      particle.style.opacity = '0.6';
      
      particlesContainer.appendChild(particle);
      
      // Animate outward
      setTimeout(() => {
        particle.style.transition = 'all 2s ease-out';
        particle.style.left = `${mouseX + (Math.random() * 10 - 5)}%`;
        particle.style.top = `${mouseY + (Math.random() * 10 - 5)}%`;
        particle.style.opacity = '0';
        
        // Remove after animation
        setTimeout(() => {
          particle.remove();
        }, 2000);
      }, 10);
      
      // Subtle movement of gradient spheres
      const spheres = document.querySelectorAll('.gradient-sphere');
      const moveX = (e.clientX / window.innerWidth - 0.5) * 5;
      const moveY = (e.clientY / window.innerHeight - 0.5) * 5;
      
      spheres.forEach(sphere => {
        const currentTransform = getComputedStyle(sphere).transform;
        sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
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

      <div className="content-container relative z-10 w-full flex justify-center">
        <div className="content-wrapper p-4 md:p-6 max-w-[1280px] w-full min-w-[90vw]">
          {/* Hero Section using the Blue Card design */}
          <div className="blue-hero-wrapper mb-8 flex justify-center items-center">
            <div className="card blue hero-card-blue">
              <div className="hero-content-inside-blue p-6 md:p-10 flex flex-col items-center justify-center text-center h-full w-full">
                <h1 className="cheapal-logo text-3xl md:text-3xl font-bold mb-3 text-white">
                  The Cheapest <span className="cheapal-logo text-3xl md:text-3xl font-bold mb-3 text-neon-green">Premium Subscriptions </span>
                  <span className="cheapal-logo text-3xl md:text-3xl font-bold mb-3 text-white">on the Planet</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 text-gray-200">
                  Join thousands of users saving money by buying Instant Subscriptions from us starting at $0.50/month.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-4 md:gap-5">
                  <Link to="/register" className="custom-button button-secondary">
                    Get Started
                  </Link>
                  <Link to="/seller-dashboard" className="custom-button button-secondary">
                    Sell Subscriptions
                  </Link>
                  <Link to="/buyer-dashboard" className="custom-button button-tertiary">
                    My Subscriptions
                  </Link>
                  <Link to={adminLinkTarget} className="custom-button button-admin">
                    {isAdmin ? 'Admin Dashboard' : 'Admin Login'}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Other sections */}
          <CategoriesSection />
          <FeaturedSubscriptions />
        </div>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap");

        :root {
          /* Variables for the BLUE CARD design */
          --clr-blue: #1890ff;
          --hero-card-bg: #151419;
          --hero-card-shadow-color: rgba(24, 144, 255, 0.25);
          --hero-min-height: 420px;
          --hero-border-radius: 2.25rem;
          --hero-backdrop-blur: 10px;
        }

        .gradient-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          overflow: hidden;
        }

        .gradient-sphere {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
        }

        .sphere-1 {
          width: clamp(30vw, 40vw, 500px);
          height: clamp(30vw, 40vw, 500px);
          background: linear-gradient(40deg, rgba(255, 0, 128, 0.8), rgba(255, 102, 0, 0.4));
          top: -10%;
          left: -10%;
          opacity: 0.6;
          animation: float-1 15s ease-in-out infinite alternate;
        }

        .sphere-2 {
          width: clamp(35vw, 45vw, 600px);
          height: clamp(35vw, 45vw, 600px);
          background: linear-gradient(240deg, rgba(72, 0, 255, 0.8), rgba(0, 183, 255, 0.4));
          bottom: -20%;
          right: -10%;
          opacity: 0.6;
          animation: float-2 18s ease-in-out infinite alternate;
        }

        .sphere-3 {
          width: clamp(25vw, 30vw, 400px);
          height: clamp(25vw, 30vw, 400px);
          background: linear-gradient(120deg, rgba(133, 89, 255, 0.5), rgba(98, 216, 249, 0.3));
          top: 60%;
          left: 20%;
          animation: float-3 20s ease-in-out infinite alternate;
        }

        .noise-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.05;
          z-index: 5;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        @keyframes float-1 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(10%, 10%) scale(1.1);
          }
        }

        @keyframes float-2 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(-10%, -5%) scale(1.15);
          }
        }

        @keyframes float-3 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          100% {
            transform: translate(-5%, 10%) scale(1.05);
            opacity: 0.6;
          }
        }

        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          z-index: 2;
        }

        .glow {
          position: absolute;
          width: clamp(30vw, 40vw, 500px);
          height: clamp(30vh, 40vh, 400px);
          background: radial-gradient(circle, rgba(72, 0, 255, 0.15), transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          animation: pulse 8s infinite alternate;
          filter: blur(30px);
        }

        @keyframes pulse {
          0% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(0.9);
          }
          100% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          background: white;
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
        }

        .content-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
        }

        .content-wrapper {
          width: 100%;
          max-width: 1280px;
          min-width: 90vw;
          box-sizing: border-box;
        }

        .blue-hero-wrapper {
          width: 100%;
          padding: 1rem 0;
        }

        .card.hero-card-blue {
          position: relative;
          z-index: 10;
          width: 95%;
          max-width: 1280px;
          min-height: var(--hero-min-height);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0.063em 0.75em 1.563em var(--hero-card-shadow-color);
          border-radius: var(--hero-border-radius);
          padding: 0;
          overflow: hidden;
          background: radial-gradient(
            ellipse at right top,
            rgba(0, 69, 143, 0.6) 0%,
            rgba(21, 20, 25, 0.7) 45%,
            rgba(21, 20, 25, 0.7) 100%
          );
          backdrop-filter: blur(var(--hero-backdrop-blur));
          -webkit-backdrop-filter: blur(var(--hero-backdrop-blur));
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card.hero-card-blue:hover {
          transform: scale(1.02);
          box-shadow: 0.1em 1em 2.5em var(--hero-card-shadow-color);
        }

        .hero-content-inside-blue {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 1;
          color: #fff;
        }

        .cheapal-logo {
          font-size: clamp(2rem, 2vw, 2rem);
          line-height: 1.2;
        }

        .cheapal-logo .text-neon-green {
          font-size: clamp( 3rem, 2vw, 2rem);
        }

        .text-lg {
          font-size: clamp(1.125rem, 2.5vw, 1.25rem);
        }

        .custom-button {
          min-height: 50px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          border: 2px solid;
          color: #ffffff;
          font-size: clamp(0.875rem, 2vw, 0.875rem);
          font-weight: 600;
          flex-shrink: 0;
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
          background-blend-mode: overlay;
          border-radius: 8px;
          text-align: center;
          min-width: 160px;
          z-index: 4;
        }

        .custom-button:before {
          content: "";
          width: 4px;
          height: 24px;
          border: 2px solid;
          transform: rotate(-45deg);
          position: absolute;
          border-top: 0;
          border-left: 0;
          border-bottom: 0;
          bottom: -6px;
          left: 4px;
          border-bottom-left-radius: 8px;
          border-top-left-radius: 8px;
          transition: background 0.3s ease;
        }

        .custom-button:after {
          content: "";
          position: absolute;
          left: -2px;
          bottom: -2px;
          border-top: 12px solid transparent;
          border-left: 12px solid #ffffff;
          border-bottom-left-radius: 8px;
        }

        .button-secondary {
          background: linear-gradient(
            90deg,
            rgba(150, 200, 255, 0.8) -12.74%,
            rgba(150, 200, 255, 0.4) 56.76%
          ),
          radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.3), transparent 70%);
          border-color: #b0deff;
          box-shadow: 0 0 10px rgba(150, 200, 255, 0.5);
        }

        .button-secondary:before {
          background: #1a2e4d;
          border-color: #b0deff;
        }

        .button-secondary:hover {
          transform: scale(1.03) rotate(1deg);
          box-shadow: 0 0 20px rgba(150, 200, 255, 0.8);
        }

        .button-tertiary {
          background: linear-gradient(
            90deg,
            rgba(200, 150, 255, 0.8) -12.74%,
            rgba(200, 150, 255, 0.4) 56.76%
          ),
          radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.3), transparent 70%);
          border-color: #deb0ff;
          box-shadow: 0 0 10px rgba(200, 150, 255, 0.5);
        }

        .button-tertiary:before {
          background: #3b1a4d;
          border-color: #deb0ff;
        }

        .button-tertiary:hover {
          transform: scale(1.03) rotate(-1deg);
          box-shadow: 0 0 20px rgba(200, 150, 255, 0.8);
        }

        .button-admin {
          background: linear-gradient(
            90deg,
            rgba(255, 150, 150, 0.8) -12.74%,
            rgba(255, 150, 150, 0.4) 56.76%
          ),
          radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.3), transparent 70%);
          border-color: #ffb0b0;
          box-shadow: 0 0 10px rgba(255, 150, 150, 0.5);
        }

        .button-admin:before {
          background: #4d1a1a;
          border-color: #ffb0b0;
        }

        .button-admin:hover {
          transform: scale(1.03);
          box-shadow: 0 0 20px rgba(255, 150, 150, 0.8);
        }

        @media (max-width: 768px) {
          .content-wrapper {
            padding: 1rem;
          }

          .hero-content-inside-blue {
            padding: 1.5rem;
          }

          .cheapal-logo {
            font-size: clamp(1.75rem, 3.5vw, 2rem);
          }

          .cheapal-logo .text-neon-green {
            font-size: clamp(2rem, 4vw, 2.5rem);
          }

          .text-lg {
            font-size: clamp(1rem, 2vw, 1.125rem);
          }

          .custom-button {
            min-width: 140px;
            padding: 0 15px;
            font-size: clamp(0.75rem, 1.8vw, 0.875rem);
          }

          .blue-hero-wrapper {
            padding: 0.5rem 0;
          }
        }

        @media (max-width: 480px) {
          .content-wrapper {
            padding: 0.75rem;
          }

          .hero-content-inside-blue {
            padding: 1rem;
          }

          .custom-button {
            min-width: 120px;
            padding: 0 12px;
            font-size: clamp(0.7rem, 1.6vw, 0.75rem);
          }

          .flex-wrap {
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default HomePage;