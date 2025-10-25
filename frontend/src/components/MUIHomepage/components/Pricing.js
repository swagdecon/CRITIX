import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Link } from 'react-router-dom';

const tiers = [
  {
    title: 'Free',
    price: '0',
    description: [
      '10 users included',
      '2 GB of storage',
      'Help center access',
      'Email support',
    ],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
  },
  {
    title: 'CRITIX ULTIMATE',
    subheader: 'Recommended',
    price: '10',
    description: [
      'Priority Review Placement',
      'Advanced Search Filters',
      'Review Performance Insights',
      'Smart Review Assistance',
      'Threaded Comments',
      'Ad-Free Experience',
      'Editorial Picks Access',
    ],
    buttonText: 'Start now',
    buttonVariant: 'contained',
    buttonColor: 'secondary',
  },
];

export default function Pricing() {
  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box sx={{ width: { sm: '100%', md: '60%' }, textAlign: 'center' }}>
        <Typography component="h2" variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
          Pricing
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Our subscription model allows you to unlock the full potential of CRITIX with exclusive features.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ justifyContent: 'center', width: '100%' }}>
        {tiers.map((tier) => (
          <Grid key={tier.title} item xs={12} sm={tier.title === 'CRITIX ULTIMATE' ? 12 : 6} md={4}>
            <Card
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                ...(tier.title === 'CRITIX ULTIMATE' && {
                  border: '1px solid',
                  borderColor: 'primary.light',
                  background:
                    'linear-gradient(145deg, rgba(25,10,60,0.95), rgba(60,0,160,0.85))',
                  boxShadow: '0 0 50px rgba(100, 160, 255, 0.35)',
                }),
              }}
            >
              <CardContent>
                <Typography component="h3" variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                  {tier.title}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
                  <Typography component="h3" variant="h2" sx={{ mr: 1 }}>
                    £{tier.price}
                  </Typography>
                  <Typography component="h3" variant="h6">
                    &nbsp; per year
                  </Typography>
                </Box>

                <Divider sx={{ my: 2, opacity: 0.8, borderColor: 'divider' }} />

                {tier.description.map((line) => (
                  <Box key={line} sx={{ py: 1, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <CheckCircleRoundedIcon sx={{ width: 20, color: 'primary.main' }} />
                    <Typography variant="subtitle2" component={'span'}>
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>

              <CardActions>
                <Button
                  fullWidth
                  component={Link}
                  to="/signup"
                  variant={tier.buttonVariant}
                  color={tier.buttonColor}
                >
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
