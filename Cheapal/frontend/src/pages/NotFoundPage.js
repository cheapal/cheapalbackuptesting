import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPageSquare = () => {
  // Ref to access the square container DOM element
  const squareContainerRef = useRef(null);

  // Effect for mouse move parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (squareContainerRef.current) {
        // Calculate movement based on cursor position relative to viewport center
        const x = -(e.clientX - window.innerWidth / 2) / 90;
        const y = -(e.clientY - window.innerHeight / 2) / 90;

        // Apply transform for smoother movement
        squareContainerRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup function to remove listener on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Effect for device orientation (gyroscope)
  useEffect(() => {
    const handleDeviceOrientation = (e) => {
      if (squareContainerRef.current && e.gamma !== null && e.beta !== null) {
        // Use gamma (left-to-right tilt) and beta (front-to-back tilt)
        const x = e.gamma / 3;
        const y = e.beta / 3;

        // Apply transform
        squareContainerRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    // Check if DeviceOrientationEvent is supported
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleDeviceOrientation);
    } else {
        console.log("DeviceOrientationEvent not supported on this device/browser.");
    }


    // Cleanup function
    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleDeviceOrientation);
      }
    };
  }, []); // Empty dependency array

  return (
    <>
      <div className="body_404_square"> {/* Wrapper div with body styles */}
        {/* Square */}
        <div className="Square404" ref={squareContainerRef}> {/* Assign ref here */}
          <div className="Square">
            {/* 404 inside the square */}
            <h1>404</h1>
          </div>
        </div>
        {/* Texts */}
        <div className="texts">
          <h4>Oops! page not found</h4>
          <p>The page you are looking for does not exist. Go back to the main page or search.</p>
          {/* Use Link component for navigation */}
          <Link to="/" className="btn">Back to Home</Link>
          {/* Search input (no functionality implemented here) */}
          <div> {/* Wrapper for label and input for better layout control */}
            <label htmlFor="search_box" className="sr-only">Search</label> {/* Added screen-reader only label */}
            <input type="search" name="search" id="search_box" placeholder="Search" />
          </div>
        </div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        /* Define CSS Variables */
        :root {
          /* Colors for the square and its shadow */
          --P_color1: #C2146D;
          --P_color2: #760D50;
          --P_color3: #4D0E45;
          --P_color4: #320C3B;
          --P_color5: #280C3D;
          /* Define the dark background color */
          --dark-bg: #111827; /* Dark Gray/Blue */
          /* Define light text color for contrast */
          --light-text: rgba(255, 255, 255, 0.85);
          --light-text-muted: rgba(255, 255, 255, 0.6);
          --btn-border-color: #f8f9fa;
          --btn-hover-bg: #f8f9fa;
          --btn-hover-text: #212529;
        }

        /* Apply base styles to a wrapper div instead of body */
        .body_404_square {
          min-height: 100vh;
          display: flex;
          /* Default to row layout for desktop */
          flex-direction: row;
          /* Center the two main items (square container and text container) horizontally */
          justify-content: center;
           /* Center vertically */
          align-items: center;
          font-size: 16px;
          font-family: "vazir", sans-serif; /* Ensure Vazir font is loaded or use fallback */
          background: var(--dark-bg);
          color: var(--light-text);
          overflow: hidden !important;
          padding: 2rem; /* Add padding around content */
          gap: 3rem; /* Add gap between square and text columns */
          flex-wrap: wrap; /* Allow wrapping on smaller screens before media query */
        }

        .body_404_square * { /* Apply box-sizing to children */
           box-sizing: border-box;
           margin: 0;
           padding: 0;
        }

        .body_404_square a {
          text-decoration: none;
          color: inherit;
        }

        .texts {
          z-index: 5;
          padding: 0.8rem; /* Keep padding */
          width: 100%; /* Take full width within its flex space */
          max-width: 450px; /* Slightly reduced max width */
          /* Text alignment for desktop */
          text-align: left;
          flex-shrink: 1; /* Allow text block to shrink if needed */
        }

        .texts h4 {
          font-size: 1.75rem; /* Slightly larger */
          margin-bottom: 0.75rem;
        }
         .texts p {
           margin-bottom: 1.5rem;
           line-height: 1.6;
           color: var(--light-text-muted);
        }

        .Square404 {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: auto; /* Allow square to dictate size */
          min-width: 300px; /* Ensure minimum space for square + shadow */
          min-height: 300px;
          flex-shrink: 0; /* Prevent square container from shrinking */
          transition: transform 0.1s linear;
          /* margin-bottom: 0; /* Remove bottom margin for row layout */
        }

        .Square {
          width: 20vw;
          height: 20vw;
          min-width: 150px;
          min-height: 150px;
          max-width: 300px;
          max-height: 300px;
          position: relative; /* Position within Square404 */
          border-radius: 1.2rem;
          background: var(--P_color1);
          box-shadow: var(--P_color2) 0 0 5px 20px,
                      var(--P_color3) 0 0 10px 40px,
                      var(--P_color4) 0 0 15px 60px,
                      var(--P_color5) 0 0 20px 80px,
                      var(--dark-bg) 0 0 25px 100px;
          transform: rotateZ(-21deg);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }

        .Square h1 {
          font-size: clamp(70px, 10vw, 150px);
          color: var(--dark-bg);
          text-shadow: 0 0 2px rgba(0, 0, 0, .6);
          user-select: none;
        }

        .btn {
          cursor: pointer;
          display: inline-block;
          font-weight: 400;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          border: var(--btn-border-color) 1px solid;
          padding: .375rem .75rem;
          margin: 1rem 0.375rem 0 0; /* Adjust margin */
          font-size: 1rem;
          border-radius: .25rem;
          color: var(--btn-border-color);
          background-color: transparent;
          transition: all .5s ease-in-out;
          user-select: none;
        }
        .btn:hover {
          color: var(--btn-hover-text);
          background-color: var(--btn-hover-bg);
          border-color: var(--btn-hover-bg);
        }


        #search_box {
          width: 100%;
          max-width: 300px;
          border-radius: 10px;
          box-shadow: none;
          padding: .7rem .8rem;
          margin: 20px 0 0 0; /* Adjust margin */
          background-color: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: var(--light-text);
          display: block; /* Keep as block */
          /* Remove auto margins if text-align: left is desired */
          /* margin-left: auto; */
          /* margin-right: auto; */
        }
         #search_box::placeholder {
           color: var(--light-text-muted);
         }
         /* Simple class for screen-reader only elements */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }


        /* Media Query for Responsiveness */
        @media (max-width: 768px) {
          .body_404_square {
            flex-direction: column; /* Stack vertically */
            justify-content: center; /* Keep centered */
            gap: 1.5rem;
          }
          .Square404{
            width: auto;
            order: 1; /* Square first */
            min-height: auto;
            margin-bottom: 0;
          }
          .Square{
            width: 150px;
            height: 150px;
            position: relative;
             box-shadow: var(--P_color2) 0 0 5px 15px,
                      var(--P_color3) 0 0 10px 30px,
                      var(--P_color4) 0 0 15px 45px,
                      var(--P_color5) 0 0 20px 60px,
                      var(--dark-bg) 0 0 25px 75px;
          }
          .Square h1{
            font-size: 70px;
          }
          .texts {
            width: 90%;
            order: 2; /* Text second */
            text-align: center; /* Center text on mobile */
          }
          #search_box {
             width: 90%;
             max-width: 280px;
             margin-left: auto; /* Center search box on mobile */
             margin-right: auto;
          }
        }
      `}</style>
    </>
  );
};

export default NotFoundPageSquare;
