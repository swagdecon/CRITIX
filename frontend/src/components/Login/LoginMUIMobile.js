import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../MUIHomepage/shared-theme/AppTheme';
import Logo from '../Logo/Logo';
import Filter from 'bad-words';
import CookieManager from '../../security/CookieManager';
import { resendAuthEmail, togglePasswordVisibility, ProfanityLogic } from '../Shared/Shared.js';

const LOGIN_ENDPOINT = process.env.REACT_APP_LOGIN_ENDPOINT;
const API_URL = process.env.REACT_APP_BACKEND_API_URL;

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        '#0096ff 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            '#0096ff 0px 0px 45px 0px',
    }),
}));

const LoginContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));


export default function LoginMobile() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const filter = useMemo(() => new Filter(), []);
    const [emailErr, setEmailErr] = useState(false);
    const navigate = useNavigate();

    const resendEmail = () => {
        resendAuthEmail(email, setMessage, setEmailErr);
    };

    const handleTogglePasswordVisibility = () => {
        togglePasswordVisibility(passwordVisible, setPasswordVisible);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userData = { email, password };
        const hasProfanity = filter.isProfane(userData.email) || filter.isProfane(userData.password);

        if (!ProfanityLogic(hasProfanity, setError)) {
            const response = await fetch(`${API_URL}${LOGIN_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });


            if (response.ok) {
                const data = await response.json();
                CookieManager.encryptCookie('accessToken', data.access_token, { expires: 1 });
                CookieManager.encryptCookie('refreshToken', data.refresh_token, { expires: 7 });
                setMessage(data.message);
                navigate('/home');
            } else {
                const messageText = await response.text();
                if (messageText === 'Please check your email to verify your account') {
                    setEmailErr(true);
                    setMessage(messageText);
                } else {
                    setError('Something went wrong, please try again.');
                }
            }
        }
    };

    return (
        <AppTheme>
            <LoginContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Logo placement='login' />
                    </div>
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            width: '100%',
                            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                            textAlign: 'center',
                        }}
                    >
                        LOGIN
                    </Typography>
                    {(message || error) && (
                        <Typography color={error ? "error" : "primary"} sx={{ textAlign: 'center', mb: 2 }}>
                            {message || error}
                        </Typography>
                    )}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!error}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="password"
                                name="password"
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="••••••"
                                autoComplete="current-password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!error}
                                InputProps={{
                                    endAdornment: (
                                        <span
                                            style={{ cursor: 'pointer', marginLeft: '8px' }}
                                            onClick={handleTogglePasswordVisibility}
                                        >
                                            <i
                                                className={`bi bi-eye${passwordVisible ? '-slash' : ''}`}
                                            />
                                        </span>
                                    ),
                                }}
                            />
                        </FormControl>

                        <FormControlLabel
                            control={<Checkbox value="allowExtraEmails" color="primary" />}
                            label="I want to receive updates via email."
                        />

                        <Button type="submit" fullWidth variant="contained">
                            Sign In
                        </Button>
                    </Box>

                    {emailErr && (
                        <Button
                            variant="text"
                            fullWidth
                            onClick={resendEmail}
                            sx={{ mt: 2 }}
                        >
                            Resend Authentication Email
                        </Button>
                    )}

                    <Divider sx={{ my: 2 }}>
                        <Typography sx={{ color: 'text.secondary' }}>or</Typography>
                    </Divider>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Google')}
                        >
                            Sign up with Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Facebook')}
                        >
                            Sign up with Facebook
                        </Button>
                        <Typography sx={{ textAlign: 'center' }}>
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" variant="body2">
                                Sign up
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </LoginContainer>
        </AppTheme>
    );
}
