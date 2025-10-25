import React from "react"

export default function IntroSlide() {
    const themeColor = "#0096ff";

    return (
        <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
            {/* Animated gradient background */}
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
                    animation: 'gradientShift 15s ease infinite',
                }}
            />

            {/* Animated circles in background */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                opacity: 0.1
            }}>
                <div style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)`,
                    top: '-10%',
                    right: '-5%',
                    animation: 'float 20s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)`,
                    bottom: '-10%',
                    left: '-5%',
                    animation: 'float 25s ease-in-out infinite reverse',
                }} />
            </div>

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                padding: '0 2rem',
                textAlign: 'center'
            }}>
                {/* Main heading with glow effect */}
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    color: '#fff',
                    marginBottom: '1rem',
                    fontWeight: '800',
                    letterSpacing: '-0.02em',
                    animation: 'fadeInUp 0.8s ease-out',
                    textShadow: `0 0 40px ${themeColor}40, 0 0 80px ${themeColor}20`
                }}>
                    <span style={{
                        background: `linear-gradient(135deg, ${themeColor} 0%, #00d4ff 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Daily Movie Picks
                    </span>
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                    color: '#b8b8b8',
                    marginBottom: '3rem',
                    maxWidth: '700px',
                    lineHeight: '1.6',
                    animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
                    fontWeight: '300'
                }}>
                    Curated using advanced algorithms that learn your taste. Sit back and enjoy personalized picks, every day.
                </p>

                {/* Feature cards */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    maxWidth: '900px',
                    animation: 'fadeInUp 0.8s ease-out 0.4s backwards'
                }}>
                    {[
                        { icon: "psychology", text: "AI-Powered", delay: '0.5s' },
                        { icon: "update", text: "Updated Daily", delay: '0.6s' },
                        { icon: "favorite", text: "Tailored to You", delay: '0.7s' },
                    ].map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '2rem 2.5rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                transition: 'all 0.3s ease',
                                cursor: 'default',
                                minWidth: '180px',
                                animation: `fadeInUp 0.8s ease-out ${item.delay} backwards`,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = `${themeColor}40`;
                                e.currentTarget.style.boxShadow = `0 12px 40px rgba(0, 150, 255, 0.2)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                            }}
                        >
                            <div style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${themeColor}20 0%, ${themeColor}05 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: `2px solid ${themeColor}30`
                            }}>
                                <span
                                    className="material-icons"
                                    style={{
                                        fontSize: '2.2rem',
                                        color: themeColor,
                                        filter: `drop-shadow(0 0 10px ${themeColor}80)`
                                    }}
                                >
                                    {item.icon}
                                </span>
                            </div>
                            <span style={{
                                fontWeight: '600',
                                fontSize: '1.1rem',
                                color: '#fff',
                                letterSpacing: '0.02em'
                            }}>
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Scroll indicator */}
                <div style={{
                    position: 'absolute',
                    bottom: '3rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    animation: 'bounce 2s ease-in-out infinite'
                }}>
                    <div style={{
                        width: '30px',
                        height: '50px',
                        border: `2px solid ${themeColor}60`,
                        borderRadius: '15px',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: '6px',
                            height: '10px',
                            background: themeColor,
                            borderRadius: '3px',
                            position: 'absolute',
                            top: '8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            animation: 'scrollDown 2s ease-in-out infinite'
                        }} />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes gradientShift {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -30px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }

                @keyframes bounce {
                    0%, 100% {
                        transform: translateX(-50%) translateY(0);
                    }
                    50% {
                        transform: translateX(-50%) translateY(-10px);
                    }
                }

                @keyframes scrollDown {
                    0% {
                        opacity: 0;
                        top: 8px;
                    }
                    50% {
                        opacity: 1;
                        top: 18px;
                    }
                    100% {
                        opacity: 0;
                        top: 28px;
                    }
                }
            `}</style>
        </div>
    );
}