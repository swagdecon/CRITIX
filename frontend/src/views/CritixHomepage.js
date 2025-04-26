import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../components/MUIHomepage/shared-theme/AppTheme';
import HomepageNav from '../components/MUIHomepage/components/HomepageNav';
import Hero from '../components/MUIHomepage/components/Hero';
import LogoCollection from '../components/MUIHomepage/components/LogoCollection';
import Highlights from '../components/MUIHomepage/components/Highlights';
import Pricing from '../components/MUIHomepage/components/Pricing';
import Features from '../components/MUIHomepage/components/Features';
import Testimonials from '../components/MUIHomepage/components/Testimonials';
import FAQ from '../components/MUIHomepage/components/FAQ';
import Footer from '../components/MUIHomepage/components/Footer';

export default function CritixHomepage(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <HomepageNav />
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
