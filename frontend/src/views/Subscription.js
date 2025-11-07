import React, { useState, useEffect } from "react";
import Footer from "../components/Footer/Footer.js";
import NavBar from "../components/NavBar/NavBar";
import SubscriptionStyles from "../components/CritixUltimate/UserSubscription.module.css";
import CookieManager from "../security/CookieManager.js";
import { jwtDecode } from "jwt-decode";
import { sendData, fetchData } from "../security/Data.js";
const cancelSubscriptionEndpoint = process.env.REACT_APP_CANCEL_SUBSCRIPTION_ENDPOINT
const nextBillingDateEndpoint = process.env.REACT_APP_GET_DAYS_UNTIL_SUBSCRIPTION_DUE
const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL

export default function SubscriptionPage() {
    const token = CookieManager.decryptCookie('accessToken');
    const decodedToken = jwtDecode(token);
    const isUltimateUser = decodedToken.isUltimateUser;
    const userId = decodedToken.userId
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [daysUntilSubscriptionDue, setDaysUntilSubscriptionDue] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCancelSubscription = () => {
        setShowCancelModal(true);
    };
    useEffect(() => {
        if (isUltimateUser) {
            const fetchBillingDate = async () => {
                try {
                    const response = await fetchData(`${REACT_APP_BACKEND_API_URL}${nextBillingDateEndpoint}`);
                    console.log(response)

                    const date = new Date(response);
                    const formattedDate = date.toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    setDaysUntilSubscriptionDue(formattedDate);
                } catch (error) {
                    console.error('Error fetching billing date:', error);
                }
            };

            fetchBillingDate();
        }
    }, [isUltimateUser]);
    async function confirmCancel() {
        setIsProcessing(true);

        try {
            const response = await sendData(`${REACT_APP_BACKEND_API_URL}${cancelSubscriptionEndpoint}`);

            if (response && response.ok) {
                setShowCancelModal(false);
                setShowSuccessModal(true);

                // Redirect after 10 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 10000);
            } else {
                alert('Failed to cancel subscription. Please try again.');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            alert('An error occurred. Please try again.');
            setIsProcessing(false);
        }
    }

    return (
        <>
            <NavBar />
            <section className={SubscriptionStyles.subscriptionSection}>
                <div className={SubscriptionStyles.heroBackground}>
                    <div className={SubscriptionStyles.gradientOrb}></div>
                    <div className={SubscriptionStyles.gradientOrb2}></div>
                </div>

                <div className={SubscriptionStyles.container}>
                    {/* Header Section */}
                    <div className={SubscriptionStyles.header}>
                        <div className={SubscriptionStyles.statusPill}>
                            <span className={isUltimateUser ? SubscriptionStyles.premiumBadge : SubscriptionStyles.freeBadge}>
                                {isUltimateUser ? "⭐ PREMIUM MEMBER" : "FREE PLAN"}
                            </span>
                        </div>
                        <h1 className={SubscriptionStyles.mainTitle}>
                            {isUltimateUser ? "Your Premium Membership" : "Unlock Your Full Potential"}
                        </h1>
                        <p className={SubscriptionStyles.mainSubtitle}>
                            {isUltimateUser
                                ? "Thank you for being a valued CRITIX ULTIMATE member"
                                : "Join thousands of film enthusiasts enjoying the complete CRITIX experience"}
                        </p>
                    </div>

                    {/* Main Content Grid */}
                    <div className={SubscriptionStyles.contentGrid}>
                        {/* Left: Benefits Showcase */}
                        <div className={SubscriptionStyles.benefitsCard}>
                            <h2 className={SubscriptionStyles.cardTitle}>
                                {isUltimateUser ? "Your Active Benefits" : "What You&apos;ll Get"}
                            </h2>

                            <div className={SubscriptionStyles.benefitsList}>
                                <div className={SubscriptionStyles.benefitItem}>
                                    <div className={SubscriptionStyles.benefitIconWrapper}>
                                        <span className={SubscriptionStyles.benefitIcon}>🎯</span>
                                    </div>
                                    <div className={SubscriptionStyles.benefitContent}>
                                        <h3>Priority Review Placement</h3>
                                        <p>Your reviews appear first in feeds, getting 3x more visibility and engagement</p>
                                    </div>
                                </div>

                                <div className={SubscriptionStyles.benefitItem}>
                                    <div className={SubscriptionStyles.benefitIconWrapper}>
                                        <span className={SubscriptionStyles.benefitIcon}>🎬</span>
                                    </div>
                                    <div className={SubscriptionStyles.benefitContent}>
                                        <h3>Advanced Search Filters</h3>
                                        <p>Discover films by tone, mood, era, and cinematography style</p>
                                    </div>
                                </div>

                                <div className={SubscriptionStyles.benefitItem}>
                                    <div className={SubscriptionStyles.benefitIconWrapper}>
                                        <span className={SubscriptionStyles.benefitIcon}>📈</span>
                                    </div>
                                    <div className={SubscriptionStyles.benefitContent}>
                                        <h3>Detailed Analytics</h3>
                                        <p>Track review performance, audience reach, and engagement trends over time</p>
                                    </div>
                                </div>

                                <div className={SubscriptionStyles.benefitItem}>
                                    <div className={SubscriptionStyles.benefitIconWrapper}>
                                        <span className={SubscriptionStyles.benefitIcon}>🤖</span>
                                    </div>
                                    <div className={SubscriptionStyles.benefitContent}>
                                        <h3>AI Writing Assistant</h3>
                                        <p>Get intelligent suggestions and improve your review quality in real-time</p>
                                    </div>
                                </div>

                                <div className={SubscriptionStyles.benefitItem}>
                                    <div className={SubscriptionStyles.benefitIconWrapper}>
                                        <span className={SubscriptionStyles.benefitIcon}>🌟</span>
                                    </div>
                                    <div className={SubscriptionStyles.benefitContent}>
                                        <h3>Unlimited Daily Recommendations</h3>
                                        <p>Access all personalized picks tailored to your unique taste, not just 5</p>
                                    </div>
                                </div>

                                <div className={SubscriptionStyles.benefitItem}>
                                    <div className={SubscriptionStyles.benefitIconWrapper}>
                                        <span className={SubscriptionStyles.benefitIcon}>💬</span>
                                    </div>
                                    <div className={SubscriptionStyles.benefitContent}>
                                        <h3>Threaded Discussions</h3>
                                        <p>Join deep conversations with detailed comment threads and replies</p>
                                    </div>
                                </div>

                                <div className={SubscriptionStyles.benefitItem}>
                                    <div className={SubscriptionStyles.benefitIconWrapper}>
                                        <span className={SubscriptionStyles.benefitIcon}>🚫</span>
                                    </div>
                                    <div className={SubscriptionStyles.benefitContent}>
                                        <h3>Ad-Free Browsing</h3>
                                        <p>Pure, uninterrupted film discovery and review experience</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Subscription Card */}
                        <div className={SubscriptionStyles.subscriptionCard}>
                            <div className={SubscriptionStyles.pricingSection}>
                                <div className={SubscriptionStyles.planBadge}>CRITIX ULTIMATE</div>
                                <div className={SubscriptionStyles.priceDisplay}>
                                    <span className={SubscriptionStyles.currency}>£</span>
                                    <span className={SubscriptionStyles.amount}>5</span>
                                    <span className={SubscriptionStyles.period}>/month</span>
                                </div>
                                <p className={SubscriptionStyles.priceNote}>Billed monthly • Cancel anytime</p>
                            </div>

                            {isUltimateUser ? (
                                <div className={SubscriptionStyles.activeSubscription}>
                                    <div className={SubscriptionStyles.activeStatus}>
                                        <div className={SubscriptionStyles.pulseIndicator}></div>
                                        <span>Active Subscription</span>
                                    </div>

                                    <div className={SubscriptionStyles.subscriptionInfo}>
                                        <div className={SubscriptionStyles.infoRow}>
                                            <span className={SubscriptionStyles.infoLabel}>Status</span>
                                            <span className={SubscriptionStyles.infoValue}>Active & Renewing</span>
                                        </div>
                                        <div className={SubscriptionStyles.infoRow}>
                                            <span className={SubscriptionStyles.infoLabel}>Next Billing</span>
                                            <span className={SubscriptionStyles.infoValue}>{daysUntilSubscriptionDue}</span>
                                        </div>
                                    </div>

                                    <div className={SubscriptionStyles.valueStatement}>
                                        <p>💡 You&apos;re saving time and discovering better films with AI-powered recommendations worth far more than £5/month</p>
                                    </div>

                                    <button
                                        onClick={handleCancelSubscription}
                                        className={SubscriptionStyles.cancelButton}
                                        disabled={isProcessing}
                                    >
                                        Cancel Subscription
                                    </button>
                                    <p className={SubscriptionStyles.cancelNote}>
                                        Access continues until end of billing period
                                    </p>
                                </div>
                            ) : (
                                <div className={SubscriptionStyles.upgradeSection}>
                                    <a
                                        href={`https://buy.stripe.com/test_4gMeVfdaI09ia6M5Zg7AI01?client_reference_id=${userId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={SubscriptionStyles.upgradeButton}
                                    >
                                        Upgrade to Ultimate
                                        <span className={SubscriptionStyles.buttonIcon}>→</span>
                                    </a>

                                    <div className={SubscriptionStyles.trustSignals}>
                                        <div className={SubscriptionStyles.trustItem}>
                                            <span>✓</span> Instant access
                                        </div>
                                        <div className={SubscriptionStyles.trustItem}>
                                            <span>✓</span> Cancel anytime
                                        </div>
                                        <div className={SubscriptionStyles.trustItem}>
                                            <span>✓</span> Secure payment
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Current Access Section - Only for Free Users */}
                    {!isUltimateUser && (
                        <div className={SubscriptionStyles.currentAccessSection}>
                            <h2 className={SubscriptionStyles.currentAccessTitle}>Your Current Access</h2>
                            <p className={SubscriptionStyles.currentAccessSubtitle}>
                                What you have access to:
                            </p>

                            <div className={SubscriptionStyles.currentAccessGrid}>
                                <div className={SubscriptionStyles.accessItem}>
                                    <div className={SubscriptionStyles.accessIconWrapper}>
                                        <span className={SubscriptionStyles.accessIcon}>🎬</span>
                                    </div>
                                    <div className={SubscriptionStyles.accessContent}>
                                        <h3>Basic Search</h3>
                                        <p>Search films by title, genre, director, and year</p>
                                    </div>
                                </div>

                                <div className={SubscriptionStyles.accessItem}>
                                    <div className={SubscriptionStyles.accessIconWrapper}>
                                        <span className={SubscriptionStyles.accessIcon}>⭐</span>
                                    </div>
                                    <div className={SubscriptionStyles.accessContent}>
                                        <h3>5 Daily Recommendations</h3>
                                        <p>Personalized picks refreshed every day</p>
                                    </div>
                                </div>

                                <div className={SubscriptionStyles.accessItem}>
                                    <div className={SubscriptionStyles.accessIconWrapper}>
                                        <span className={SubscriptionStyles.accessIcon}>✍️</span>
                                    </div>
                                    <div className={SubscriptionStyles.accessContent}>
                                        <h3>Write Reviews</h3>
                                        <p>Share your thoughts on films with the community</p>
                                    </div>
                                </div>

                                <div className={SubscriptionStyles.accessItem}>
                                    <div className={SubscriptionStyles.accessIconWrapper}>
                                        <span className={SubscriptionStyles.accessIcon}>💬</span>
                                    </div>
                                    <div className={SubscriptionStyles.accessContent}>
                                        <h3>Join Discussions</h3>
                                        <p>Comment and engage with other film lovers</p>
                                    </div>
                                </div>

                                <div className={SubscriptionStyles.accessItem}>
                                    <div className={SubscriptionStyles.accessIconWrapper}>
                                        <span className={SubscriptionStyles.accessIcon}>📚</span>
                                    </div>
                                    <div className={SubscriptionStyles.accessContent}>
                                        <h3>Create Lists</h3>
                                        <p>Organize your watchlist and favorite films</p>
                                    </div>
                                </div>

                                <div className={SubscriptionStyles.accessItem}>
                                    <div className={SubscriptionStyles.accessIconWrapper}>
                                        <span className={SubscriptionStyles.accessIcon}>👥</span>
                                    </div>
                                    <div className={SubscriptionStyles.accessContent}>
                                        <h3>Follow Users</h3>
                                        <p>Connect with critics who share your taste</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className={SubscriptionStyles.modalOverlay} onClick={() => !isProcessing && setShowCancelModal(false)}>
                    <div className={SubscriptionStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={SubscriptionStyles.modalIcon}>😢</div>
                        <h2>We&apos;re Sorry to See You Go</h2>
                        <p>
                            Are you sure you want to cancel? You&apos;ll lose access to personalized recommendations,
                            advanced search, and all premium features at the end of your billing period.
                        </p>
                        <div className={SubscriptionStyles.modalButtons}>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className={SubscriptionStyles.modalKeepButton}
                                disabled={isProcessing}
                            >
                                Keep My Benefits
                            </button>
                            <button
                                onClick={confirmCancel}
                                className={SubscriptionStyles.modalCancelButton}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Continue Cancellation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className={SubscriptionStyles.modalOverlay}>
                    <div className={SubscriptionStyles.modalContent}>
                        <div className={SubscriptionStyles.modalIcon}>✅</div>
                        <h2>Subscription Cancelled</h2>
                        <p>
                            Your subscription has been successfully cancelled. You&apos;ll continue to have access
                            to all premium features until the end of your current billing period.
                        </p>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                            We hope to see you again soon!
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className={SubscriptionStyles.modalKeepButton}
                            style={{ marginTop: '1.5rem', width: '100%' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}