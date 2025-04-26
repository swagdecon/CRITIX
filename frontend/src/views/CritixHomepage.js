import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../misc/shared-theme/AppTheme'
import AppAppBar from '../components/MUIHomepage/AppAppBar';
import Hero from '../components/MUIHomepage/Hero';
import LogoCollection from '../components/MUIHomepage/LogoCollection';
import Highlights from '../components/MUIHomepage/Highlights';
import Pricing from '../components/MUIHomepage/Pricing';
import Features from '../components/MUIHomepage/Features';
import Testimonials from '../components/MUIHomepage/Testimonials';
import FAQ from '../components/MUIHomepage/FAQ';
import Footer from '../components/MUIHomepage/Footer';
export default function CritixHomepage(props) {
    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Hero />
            <div>
                <LogoCollection />
                <Features />
                <Divider />
                <Testimonials />
                <Divider />
                <Highlights />
                <Divider />
                <Pricing />
                <Divider />
                <FAQ />
                <Divider />
                <Footer />
            </div>
        </AppTheme>
    );
}