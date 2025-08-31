import { React, useMemo } from 'react';
import Footer from "../components/Footer/Footer.js";
import { jwtDecode } from "jwt-decode";
import CookieManager from '../security/CookieManager.js';

export default function PricingPage() {
    const token = useMemo(() => CookieManager.decryptCookie("accessToken"), []);

    const decodedToken = useMemo(() => jwtDecode(token), [token]);
    const userId = decodedToken.userId

    return (
        <>
            <section style={{
                backgroundColor: "white", width: "100vw", marginTop: "5vh"
            }}>
                <stripe-pricing-table pricing-table-id="prctbl_1S28zoPI5XTUoVPkolFGYx7i"
                    publishable-key="pk_test_51RAYf5PI5XTUoVPk6TSvWcNum4rEUXxsRG7urmtENrOgnshJebm2fMH7ST1775TzHLG2xV5NyJcHp2vHeyNU7Pei00RZOTJeT1" client-reference-id={userId}>
                </stripe-pricing-table>
            </section>
            <Footer />
        </>
    )
}
