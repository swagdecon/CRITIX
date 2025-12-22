import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SignUpStyles from "../Login/login.module.css";
import Divider from '@mui/material/Divider';
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
import { togglePasswordVisibility, resendAuthEmail, Message, ProfanityLogic } from '../Shared/Shared.js';

const SIGNUP_ENDPOINT = process.env.REACT_APP_SIGNUP_ENDPOINT;
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
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        background: 'linear-gradient(270deg, transparent, #0096ff)',
        backgroundRepeat: 'no-repeat',
    },
}));

export default function SignupMobile() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [emailErr, setEmailErr] = useState(false);
    const [profanityError, setProfanityError] = useState('');
    const [endpointResponse, setEndpointResponse] = useState(null);
    const filter = useMemo(() => new Filter(), []);

    const resendEmail = () => {
        resendAuthEmail(email, setMessage, setEmailErr);
    };

    const handleTogglePasswordVisibility = () => {
        togglePasswordVisibility(passwordVisible, setPasswordVisible);
    };

    const resetInputFields = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Simple frontend validation
        if (!email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (!firstName || !lastName) {
            setError('Please fill out all fields.');
            return;
        }

        const userData = { firstName, lastName, email, password };
        const hasProfanity =
            filter.isProfane(firstName) ||
            filter.isProfane(lastName) ||
            filter.isProfane(email) ||
            filter.isProfane(password);

        if (!ProfanityLogic(hasProfanity, setProfanityError)) {
            const response = await fetch(`${API_URL}${SIGNUP_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            setEndpointResponse(response);

            if (response.ok) {
                const data = await response.json();
                CookieManager.encryptCookie('accessToken', data.access_token, { expires: 0.5 });
                CookieManager.encryptCookie('refreshToken', data.refresh_token, { expires: 7 });
                setMessage(data.message);
                resetInputFields();
                // navigate('/login');
            } else {
                const messageText = await response.text();
                if (messageText === 'There was an error sending your account activation email.') {
                    setEmailErr(true);
                }
                setMessage(messageText);
            }
        }
    };


    return (
        <AppTheme>
            <LoginContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Logo placement="login" />
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
                        Sign Up
                    </Typography>
                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                        <Message response={endpointResponse} message={message} style={SignUpStyles} profanityError={profanityError} />
                    </div>
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
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                error={!!error}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="firstName">First Name</FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="firstName"
                                name="firstName"
                                placeholder="First Name"
                                autoComplete="given-name"
                                variant="outlined"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="lastName">Last Name</FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                name="lastName"
                                placeholder="Last Name"
                                autoComplete="family-name"
                                variant="outlined"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
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
                                placeholder="••••••••"
                                autoComplete="new-password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <span
                                            style={{ cursor: 'pointer', marginLeft: '8px' }}
                                            onClick={handleTogglePasswordVisibility}
                                        >
                                            <i className={`bi bi-eye${passwordVisible ? '-slash' : ''}`} />
                                        </span>
                                    ),
                                }}
                            />
                        </FormControl>

                        <Button type="submit" fullWidth variant="contained">
                            Sign Up
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
                        {/* <Button
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
                        </Button> */}
                        <Typography sx={{ textAlign: 'center' }}>
                            Already have an account?{' '}
                            <Link href="/login" variant="body2">
                                Log in
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </LoginContainer>
        </AppTheme>
    );
}