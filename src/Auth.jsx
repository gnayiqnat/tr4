import { Turnstile } from '@marsidev/react-turnstile';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { Button, InputAdornment, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { motion, useAnimate } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function Auth() {
    const numberOfKeysPressed = React.useRef(0);

    const navigate = useNavigate();
    const preOrgEmail = import.meta.env.VITE_APP_PREORG_EMAIL;
    const orgEmail = import.meta.env.VITE_APP_ORG_EMAIL;
    const orgPassword = import.meta.env.VITE_APP_ORG_PASSWORD;

    /* import.meta.env.VITE_APP_PASSWORD; */
    const [scope, animate] = useAnimate();

    const [CEV, setCEV] = useState('');
    const [CPV, setCPV] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [captchaToken, setCaptchaToken] = useState();
    const [step2, setStep2] = useState(false);

    async function signInRequest() {
        supabase.auth
            .signInWithPassword({
                email: `${preOrgEmail + CEV}@gmail.com`,
                password: CPV,
                options: { captchaToken },
            })
            .then((response) => {
                response.error
                    ? enqueueSnackbar(response.error.message, {
                          variant: 'error',
                          preventDuplicate: true,
                      })
                    : (response.data.aud && setIsAuthenticated(true),
                      enqueueSnackbar("You're now logged in.", {
                          variant: 'success',
                      }),
                      setTimeout(() => {
                          enqueueSnackbar('Redirecting, please wait.', {
                              variant: 'info',
                              preventDuplicate: true,
                          });
                      }, 1000),
                      setTimeout(() => {
                          navigate('/dashboard');
                      }, 2500));
            });
    }

    function handleSubmit() {
        if (orgEmail === CEV && orgPassword === CPV) {
            signInRequest()
        }
    }
    useEffect(() => {
        if (captchaToken) {
            setStep2(true)
        }
    }, [captchaToken]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <Box ref={scope}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',

                        width: '96vw',
                        height: '96dvh',
                    }}
                >
                    {!step2 ? (
                        <>
                            <TurnstileStep setCaptchaToken={setCaptchaToken} />
                        </>
                    ) : (
                        <>
                            <Typography
                                align='center'
                                sx={{
                                    fontSize: '1.8rem',
                                    fontFamily: 'Nunito',
                                    fontWeight: '500',
                                    mb: 3,
                                    mt: -2,
                                }}
                            >
                                Log in
                            </Typography>
                            <Box
                                noValidate
                                sx={{
                                    width: 'clamp(70vw, 80vw, 400px)',
                                    maxWidth: '400px',
                                }}
                            >
                                <TextField
                                    onKeyDown={(e) => {
                                        e.key === 'Enter' &&
                                            !isAuthenticated &&
                                            enqueueSnackbar(
                                                'Password is incorrect',
                                                {
                                                    variant: 'error',
                                                    preventDuplicate: true,
                                                }
                                            );
                                        e.key !== 'Backspace' &&
                                            numberOfKeysPressed.current++;
                                    }}
                                    margin='normal'
                                    required
                                    fullWidth
                                    variant='standard'
                                    name='email'
                                    type='email'
                                    placeholder='Organization ID'
                                    color='primary'
                                    value={CEV}
                                    inputProps={{
                                        style: { fontSize: '18px' },
                                    }}
                                    onChange={(e) => {
                                        !isAuthenticated
                                            ? setCEV(e.target.value)
                                            : setCEV('');
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment
                                                position='start'
                                                sx={{ mr: '14px' }}
                                            >
                                                <PersonOutlineRoundedIcon
                                                    sx={{ color: '#000000' }}
                                                />
                                            </InputAdornment>
                                        ),

                                        sx: {
                                            padding: '10px 10px',
                                        },
                                    }}
                                />
                                <TextField
                                    onKeyDown={(e) => {
                                        e.key === 'Enter' &&
                                            !isAuthenticated &&
                                            enqueueSnackbar(
                                                'Password is incorrect',
                                                {
                                                    variant: 'error',
                                                    preventDuplicate: true,
                                                }
                                            );
                                        e.key !== 'Backspace' &&
                                            numberOfKeysPressed.current++;
                                    }}
                                    margin='normal'
                                    required
                                    fullWidth
                                    variant='standard'
                                    name='email'
                                    type='password'
                                    placeholder='Password'
                                    color='primary'
                                    value={CPV}
                                    inputProps={{
                                        style: { fontSize: '18px' },
                                    }}
                                    onChange={(e) => {
                                        !isAuthenticated
                                            ? setCPV(e.target.value)
                                            : setCPV('');
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment
                                                position='start'
                                                sx={{ mr: '14px' }}
                                            >
                                                <LockOpenIcon
                                                    sx={{ color: '#000000' }}
                                                />
                                            </InputAdornment>
                                        ),

                                        sx: {
                                            padding: '10px 10px',
                                        },
                                    }}
                                />

                                <Box
                                    sx={{
                                        mt: 5,
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Button
                                        sx={{
                                            backgroundColor: 'primary.main',
                                            padding: '15px',
                                            width: '100%',
                                            borderRadius: '80px',
                                            '&:hover': {
                                                backgroundColor: 'primary.main',
                                            },
                                        }}
                                        onClick={() => {
                                            handleSubmit();
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                opacity: 0.7,
                                                fontFamily: 'Nunito',
                                                textTransform: 'none',
                                                color: 'hsl(216, 18%, 85%)',
                                                fontWeight: '600',
                                                fontSize: '18px',
                                            }}
                                        >
                                            Submit
                                        </Typography>
                                    </Button>{' '}
                                </Box>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </motion.div>
    );
}

function TurnstileStep({ setCaptchaToken }) {
    const turnstileKey = import.meta.env.VITE_APP_TURNSTILE_KEY;

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 3,
                }}
            >
                <Turnstile
                    options={{ theme: 'light' }}
                    siteKey={turnstileKey}
                    onSuccess={(token) => {
                        setCaptchaToken(token);
                    }}
                />
            </Box>
        </>
    );
}
