import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';

const items = [
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: 'Revolutionary Reviews',
    description:
      'Go beyond the stars. Share authentic, insightful reviews that capture what truly makes a movie unforgettable — and discover opinions you actually care about.',
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: 'Built for Movie Lovers',
    description:
      'Crafted with passion for cinema, every feature is designed to make discovering, reviewing, and celebrating movies effortless and fun.',
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: 'Seamless Watchlists',
    description:
      'Found a film that sparks your curiosity? Instantly add it to your Watchlist and keep your next favorite movie just a tap away.',
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: 'Smart Movie Insights',
    description:
      'Get powerful insights into your viewing habits — from hidden genre preferences to trends in your reviews — and discover yourself as a moviegoer.',
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: 'Curated Suggestions',
    description:
      'Say goodbye to endless scrolling. Our smart recommendations connect you with hidden gems, cult classics, and the next big thing based on your unique taste.',
  },
  {
    icon: <QueryStatsRoundedIcon />,
    title: 'Explore Cast & Crew',
    description:
      'Dive deeper into the movies you love. Find your favorite actors, directors, and writers — and follow their journeys across genres and generations.',
  },
];


export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
            Highlights
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Explore why our product stands out: adaptability, durability,
            user-friendly design, and innovation. Enjoy reliable customer support and
            precision in every detail.
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Stack
                component={Card}
                spacing={2}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                }}
              >
                <Box sx={{ opacity: 0.5 }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
