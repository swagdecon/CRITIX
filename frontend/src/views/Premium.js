import * as React from 'react';
import Footer from "../components/Footer/Footer.js";
export default function PricingPage() {
    return (
        <>
            <section style={{
                backgroundColor: "white", width: "100vw", marginTop: "5vh"
            }}>
                <stripe-pricing-table pricing-table-id="prctbl_1RAZoIPI5XTUoVPkWx37yO4o"
                    publishable-key="pk_test_51RAYf5PI5XTUoVPk6TSvWcNum4rEUXxsRG7urmtENrOgnshJebm2fMH7ST1775TzHLG2xV5NyJcHp2vHeyNU7Pei00RZOTJeT1">
                </stripe-pricing-table>
            </section>
            <Footer />
        </>
    )
}
