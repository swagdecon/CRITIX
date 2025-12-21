import React, { useState } from 'react';
import PropTypes from "prop-types";

export default function InputSlider({ onSliderChange }) {
    const [value, setValue] = useState(50);

    const handleChange = (newValue) => {
        setValue(newValue);
        if (onSliderChange) {
            onSliderChange(newValue);
        }
    };

    // Calculate color based on value (0-100)
    const getColor = (val) => {
        if (val < 25) {
            // Red gradient (0-25)
            const ratio = val / 25;
            return {
                start: '#ff4444',
                end: '#cc0000',
                color: `rgb(${255 - Math.round(51 * ratio)}, ${68 - Math.round(68 * ratio)}, ${68 - Math.round(68 * ratio)})`
            };
        } else if (val < 50) {
            // Yellow gradient (25-50)
            const ratio = (val - 25) / 25;
            return {
                start: '#ffbb33',
                end: '#ff8800',
                color: `rgb(255, ${187 - Math.round(51 * ratio)}, ${51 - Math.round(51 * ratio)})`
            };
        } else if (val < 75) {
            // Green gradient (50-75)
            const ratio = (val - 50) / 25;
            return {
                start: '#00c851',
                end: '#007e33',
                color: `rgb(0, ${200 - Math.round(74 * ratio)}, ${81 - Math.round(30 * ratio)})`
            };
        } else {
            // Blue gradient (75-100)
            return {
                start: '#0096ff',
                end: '#0066cc',
                color: '#0096ff'
            };
        }
    };

    const colorData = getColor(value);

    return (
        <div style={{ width: '100%', paddingTop: '3rem', paddingBottom: '3rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
            <div style={{ position: 'relative', paddingTop: '3rem', paddingBottom: '3rem' }}>
                {/* Slider track */}
                <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '0.75rem',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '9999px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                }}>
                    <div
                        style={{
                            height: '100%',
                            borderRadius: '9999px',
                            width: `${value}%`,
                            background: `linear-gradient(135deg, ${colorData.start}, ${colorData.end})`
                        }}
                    />
                </div>

                {/* Popcorn bucket slider thumb */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => handleChange(parseInt(e.target.value))}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        width: '100%',
                        height: '4rem',
                        opacity: 0,
                        cursor: 'pointer',
                        zIndex: 10,
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }}
                />

                {/* Popcorn bucket icon */}
                <div
                    style={{
                        position: 'absolute',
                        pointerEvents: 'none',
                        zIndex: 0,
                        left: `calc(${value}% - 32px)`,
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }}
                >
                    {/* Kernels label above popcorn */}
                    <div
                        style={{
                            position: 'absolute',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            paddingLeft: '0.75rem',
                            paddingRight: '0.75rem',
                            paddingTop: '0.25rem',
                            paddingBottom: '0.25rem',
                            borderRadius: '9999px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                            whiteSpace: 'nowrap',
                            left: '50%',
                            top: '-35px',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'white',
                            color: colorData.color,
                            border: `2px solid ${colorData.color}`
                        }}
                    >
                        {value} kernels
                    </div>

                    <div style={{
                        transform: `rotate(${value < 30 ? -90 : value < 50 ? -45 : 0}deg)`,
                        transition: 'transform 0.3s ease-out',
                        filter: value >= 80 ? `drop-shadow(0 0 10px ${colorData.color}) drop-shadow(0 0 20px ${colorData.color})` : 'none'
                    }}>
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Popcorn bucket - improved design */}
                            {/* Main bucket body with trapezoid shape */}
                            <defs>
                                <linearGradient id="bucketGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#FF7B7B" />
                                    <stop offset="100%" stopColor="#FF5555" />
                                </linearGradient>
                                <linearGradient id="rimGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#FFE66D" />
                                    <stop offset="100%" stopColor="#FFDB4D" />
                                </linearGradient>
                            </defs>

                            {/* Shadow */}
                            <ellipse cx="32" cy="53" rx="14" ry="2" fill="rgba(0,0,0,0.2)" />

                            {/* Bucket body */}
                            <path d="M18 30 L22 52 L42 52 L46 30 Z" fill="url(#bucketGradient)" stroke="#CC4444" strokeWidth="2" />

                            {/* Red and white vertical stripes */}
                            <path d="M20 30 L23 52 L26 52 L23 30 Z" fill="#FFFFFF" opacity="0.3" />
                            <path d="M28 30 L30 52 L33 52 L31 30 Z" fill="#FFFFFF" opacity="0.3" />
                            <path d="M36 30 L38 52 L41 52 L39 30 Z" fill="#FFFFFF" opacity="0.3" />

                            {/* Top rim - wider opening */}
                            <ellipse cx="32" cy="30" rx="14" ry="4" fill="url(#rimGradient)" stroke="#CCBA57" strokeWidth="1.5" />
                            <path d="M18 30 C18 28 24 27 32 27 C40 27 46 28 46 30" fill="#FFE66D" />

                            {/* Bottom rim detail */}
                            <path d="M22 52 C22 53 26 54 32 54 C38 54 42 53 42 52" fill="none" stroke="#CC4444" strokeWidth="1.5" />

                            {/* Popcorn pieces on top - more visible when upright */}
                            {value >= 50 && (
                                <>
                                    {/* Top layer - most visible */}
                                    <circle cx="32" cy="18" r="5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="38" cy="20" r="4" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="26" cy="20" r="4" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />

                                    {/* Second layer - slightly below */}
                                    <circle cx="34" cy="22" r="3.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="29" cy="23" r="3" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="40" cy="24" r="3" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="24" cy="24" r="3" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />

                                    {/* Third layer - near rim */}
                                    <circle cx="36" cy="26" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="31" cy="26" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="27" cy="27" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="42" cy="27" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="22" cy="27" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                </>
                            )}

                            {/* Tilted state - some popcorn in bucket, some starting to spill */}
                            {value >= 30 && value < 50 && (
                                <>
                                    {/* Popcorn still in tilted bucket */}
                                    <circle cx="28" cy="22" r="4" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="33" cy="24" r="3.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="25" cy="26" r="3" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="30" cy="27" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />

                                    {/* Popcorn starting to fall out - just a few pieces */}
                                    <circle cx="20" cy="24" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="18" cy="28" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="15" cy="26" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="22" cy="30" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="16" cy="32" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="13" cy="30" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                </>
                            )}

                            {/* Spilled popcorn when low rating - spread out much more */}
                            {value < 30 && (
                                <>
                                    {/* Far left spread - most distant from bucket */}
                                    <circle cx="-8" cy="20" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="-6" cy="28" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="-10" cy="35" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="-4" cy="42" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />

                                    {/* Left side - scattered */}
                                    <circle cx="0" cy="18" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="2" cy="25" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="-2" cy="32" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="1" cy="39" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="-1" cy="46" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />

                                    {/* Middle left - more spread */}
                                    <circle cx="6" cy="16" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="8" cy="23" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="5" cy="30" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="9" cy="37" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="4" cy="44" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />

                                    {/* Center left area */}
                                    <circle cx="12" cy="19" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="14" cy="26" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="11" cy="33" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="15" cy="40" r="2.5" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />

                                    {/* Near bucket opening */}
                                    <circle cx="18" cy="22" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                    <circle cx="17" cy="29" r="2" fill="#FFFACD" stroke="#F0E68C" strokeWidth="1.5" />
                                </>
                            )}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
InputSlider.propTypes = {
    onSliderChange: PropTypes.func,
};
