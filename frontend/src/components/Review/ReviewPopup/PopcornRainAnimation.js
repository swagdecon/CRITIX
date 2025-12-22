import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function PopcornRainAnimation() {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 0.5s ease-out',
            zIndex: 9999,
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%)',
        }}><style>
                {`
          @keyframes fall {
            0% {
              top: -15%;
              opacity: 1;
              transform: rotate(0deg) scale(1);
            }
            50% {
              opacity: 1;
              transform: rotate(180deg) scale(0.95);
            }
            100% {
              top: 115%;
              opacity: 0.7;
              transform: rotate(360deg) scale(0.9);
            }
          }

          .popcorn-item {
            position: absolute;
            width: 64px;
            height: 64px;
            animation: fall linear infinite;
            opacity: 0;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
          }

          .popcorn-item:nth-child(1) { left: 5%; animation-duration: 1.8s; animation-delay: 0s; }
          .popcorn-item:nth-child(2) { left: 15%; animation-duration: 2.1s; animation-delay: 0.3s; }
          .popcorn-item:nth-child(3) { left: 25%; animation-duration: 1.9s; animation-delay: 0.6s; }
          .popcorn-item:nth-child(4) { left: 35%; animation-duration: 2.2s; animation-delay: 0.9s; }
          .popcorn-item:nth-child(5) { left: 45%; animation-duration: 1.7s; animation-delay: 1.2s; }
          .popcorn-item:nth-child(6) { left: 55%; animation-duration: 2.0s; animation-delay: 0.2s; }
          .popcorn-item:nth-child(7) { left: 65%; animation-duration: 1.9s; animation-delay: 0.7s; }
          .popcorn-item:nth-child(8) { left: 75%; animation-duration: 2.1s; animation-delay: 0.4s; }
          .popcorn-item:nth-child(9) { left: 85%; animation-duration: 1.8s; animation-delay: 1.0s; }
          .popcorn-item:nth-child(10) { left: 95%; animation-duration: 2.2s; animation-delay: 0.1s; }
          .popcorn-item:nth-child(11) { left: 10%; animation-duration: 2.0s; animation-delay: 1.3s; }
          .popcorn-item:nth-child(12) { left: 20%; animation-duration: 2.3s; animation-delay: 1.5s; }
          .popcorn-item:nth-child(13) { left: 30%; animation-duration: 1.8s; animation-delay: 1.2s; }
          .popcorn-item:nth-child(14) { left: 40%; animation-duration: 2.3s; animation-delay: 0.8s; }
          .popcorn-item:nth-child(15) { left: 50%; animation-duration: 1.7s; animation-delay: 1.7s; }
          .popcorn-item:nth-child(16) { left: 60%; animation-duration: 2.0s; animation-delay: 0.5s; }
          .popcorn-item:nth-child(17) { left: 70%; animation-duration: 1.9s; animation-delay: 1.4s; }
          .popcorn-item:nth-child(18) { left: 80%; animation-duration: 2.2s; animation-delay: 0.6s; }
          .popcorn-item:nth-child(19) { left: 90%; animation-duration: 1.8s; animation-delay: 1.6s; }
          .popcorn-item:nth-child(20) { left: 12%; animation-duration: 2.1s; animation-delay: 0.9s; }

          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }

          .title-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
            font-family: 'Arial Black', sans-serif;
            font-size: 4.5rem;
            font-weight: 900;
            text-shadow: 
              0 0 20px rgba(255,193,7,0.8),
              0 0 40px rgba(255,193,7,0.5),
              4px 4px 8px rgba(0,0,0,0.5);
            z-index: 10;
            text-align: center;
            letter-spacing: 3px;
            animation: fadeInScale 0.6s ease-out;
          }

          @media (max-width: 768px) {
            .title-text {
              font-size: 2.5rem;
            }
            .popcorn-item {
              width: 48px;
              height: 48px;
            }
          }
        `}
            </style>

            <div className="title-text">
                REVIEW SUBMITTED
            </div>

            {[...Array(20)].map((_, i) => (
                <PopcornBucket key={i} index={i + 1} />
            ))}
        </div>
    );
}

function PopcornBucket({ index }) {
    return (
        <svg className="popcorn-item" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id={`bucketGradient${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF7B7B" />
                    <stop offset="100%" stopColor="#FF5555" />
                </linearGradient>
                <linearGradient id={`rimGradient${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFE66D" />
                    <stop offset="100%" stopColor="#FFDB4D" />
                </linearGradient>
            </defs>
            <ellipse cx="32" cy="53" rx="14" ry="2" fill="rgba(0,0,0,0.2)" />
            <path d="M18 30 L22 52 L42 52 L46 30 Z" fill={`url(#bucketGradient${index})`} stroke="#CC4444" strokeWidth="2" />
            <path d="M20 30 L23 52 L26 52 L23 30 Z" fill="#FFFFFF" opacity="0.3" />
            <path d="M28 30 L30 52 L33 52 L31 30 Z" fill="#FFFFFF" opacity="0.3" />
            <path d="M36 30 L38 52 L41 52 L39 30 Z" fill="#FFFFFF" opacity="0.3" />
            <ellipse cx="32" cy="30" rx="14" ry="4" fill={`url(#rimGradient${index})`} stroke="#CCBA57" strokeWidth="1.5" />
            <path d="M18 30 C18 28 24 27 32 27 C40 27 46 28 46 30" fill="#FFE66D" />
            <path d="M22 52 C22 53 26 54 32 54 C38 54 42 53 42 52" fill="none" stroke="#CC4444" strokeWidth="1.5" />
            <circle cx="32" cy="18" r="5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
            <circle cx="38" cy="20" r="4" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
            <circle cx="26" cy="20" r="4" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
            <circle cx="34" cy="22" r="3.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
            <circle cx="29" cy="23" r="3" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
            <circle cx="40" cy="24" r="3" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="3" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
            <circle cx="36" cy="26" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
            <circle cx="31" cy="26" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
            <circle cx="27" cy="27" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
            <circle cx="42" cy="27" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
            <circle cx="22" cy="27" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
        </svg>
    );
}

PopcornBucket.propTypes = {
    index: PropTypes.number.isRequired
};