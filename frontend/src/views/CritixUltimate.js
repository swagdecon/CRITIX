import React from "react";
import Footer from "../components/Footer/Footer.js";
// import { jwtDecode } from "jwt-decode";
// import CookieManager from "../security/CookieManager.js";
import UltimateStyles from "../components/CritixUltimate/CritixUltimate.module.css";

export default function PricingPage() {
    //   const token = useMemo(() => CookieManager.decryptCookie("accessToken"), []);
    //   const decodedToken = useMemo(() => jwtDecode(token), [token]);
    //   const userId = decodedToken.userId;

    return (
        <>
            <section className={UltimateStyles.ultimateSection}>
                <div className={UltimateStyles.movieBackdrop}></div>
                <div className={UltimateStyles.overlay}></div>

                <div className={UltimateStyles.content}>
                    <h1 className={UltimateStyles.title}>Upgrade to CRITIX ULTIMATE</h1>
                    <p className={UltimateStyles.subtitle}>
                        Unlock deeper insights and cinematic intelligence.
                    </p>

                    <div className={UltimateStyles.pricingContainer}>
                        <div className={UltimateStyles.pricingInner}>
                            <h2 className={UltimateStyles.planTitle}>CRITIX ULTIMATE</h2>
                            <p className={UltimateStyles.planPrice}>
                                £5<span>/month</span>
                            </p>

                            <ul className={UltimateStyles.featureList}>
                                <li>🎯 Priority Review Placement – Your reviews rank higher</li>
                                <li>🎬 Advanced Search Filters – Filter movies by tone, genre, director, era</li>
                                <li>📈 Review Performance Insights – Track likes, views, engagement</li>
                                <li>🤖 Smart Review Assistance – AI-powered suggestions while writing</li>
                                <li>💬 Threaded Comments – Full access to discussion threads</li>
                                <li>🚫 Ad-Free Experience – Browse without interruptions</li>
                                <li>🌟 Unlock All Daily Recommendations</li>
                            </ul>

                            <a
                                href="https://buy.stripe.com/test_4gMeVfdaI09ia6M5Zg7AI01"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={UltimateStyles.ctaButton}
                            >
                                Upgrade Now
                            </a>

                            <p className={UltimateStyles.smallNote}>
                                Cancel anytime. Instant access after upgrade.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
