import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import {
    Box,
    Button,
    Grid,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { motion, useAnimate } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

export default function SetPassword() {
    const [scope, animate] = useAnimate();
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });

    const [userEmail, setUserEmail] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // Password
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (!userEmail) {
            supabase.auth.getSession().then((response) => {
                if (response.data.session) {
                    supabase.auth.getUser().then((response) => {
                        response.data.user.email &&
                            setUserEmail(response.data.user.email);
                    });
                } else {
                    enqueueSnackbar('Please log in', {variant: 'error', preventDuplicate: true})
                    navigate('/')
                }
            });
        }
    }, []);

    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasDigit = /[0-9]/.test(newPassword);
    const hasSymbol = /[^a-zA-Z0-9]/.test(newPassword);
    const hasMinLength = newPassword.length >= 8;

    const [passwordValidation, setPasswordValidation] = useState(false);

    useEffect(() => {
        if (
            hasLowerCase &&
            hasUpperCase &&
            hasDigit &&
            hasSymbol &&
            hasMinLength
        ) {
            setPasswordValidation(true);
        }
    }, [newPassword]);

    function handleSubmit() {
        if (newPassword && passwordValidation) {
            supabase.auth
                .updateUser({ password: newPassword })
                .then((response) => {
                    response.data.user
                        ? (enqueueSnackbar('Password change success', {
                              variant: 'success',
                          }),
                          enqueueSnackbar('Redirecting you', {
                              variant: 'info',
                          }),
                          animate(
                              scope.current,
                              { opacity: 0 },
                              { duration: 0.5 },
                              setTimeout(() => {
                                  navigate('/dashboard');
                              }, 750)
                          ))
                        : (enqueueSnackbar(response.error.message, {
                              variant: 'error',
                          }),
                          setNewPassword(''));
                });
        } else if (passwordValidation === false) {
            enqueueSnackbar('Password does not fit requirements', {
                variant: 'error',
            });
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                {isLoggedIn && (
                    <Box
                        ref={scope}
                        sx={{ display: 'flex', padding: '0px 40px' }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',

                                width: '90vw',
                                maxWidth: '450px',
                                height: '96dvh',
                                margin: '0 auto',
                            }}
                        >
                            {' '}
                            <Typography
                                align='center'
                                sx={{
                                    fontSize: isMobile ? '1.6rem' : '1.8rem',
                                    fontFamily: 'Nunito',
                                    fontWeight: '500',
                                    mb: 1,
                                }}
                            >
                                Create a password
                            </Typography>
                            <Typography
                                align='center'
                                sx={{
                                    fontSize: '1.1rem',
                                    fontFamily: 'Nunito',
                                    fontWeight: '500',
                                    opacity: 0.5,
                                }}
                            >
                                {userEmail}
                            </Typography>
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                variant='standard'
                                name='password'
                                type='password'
                                placeholder='Password'
                                color='primary'
                                value={newPassword}
                                inputProps={{
                                    style: { fontSize: '18px' },
                                }}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                            position='start'
                                            sx={{ mr: '14px' }}
                                        >
                                            <LockOpenIcon
                                                sx={{
                                                    color: '#000000',
                                                }}
                                            />
                                        </InputAdornment>
                                    ),

                                    sx: {
                                        padding: '10px 10px',
                                    },
                                }}
                            />
                            <Typography sx={{ mt: 5, fontSize: '1.1rem' }}>
                                <Grid
                                    container
                                    sx={{ gap: isMobile ? 0 : 7, mt: -3 }}
                                >
                                    <Grid item>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: hasLowerCase
                                                    ? '#007E05'
                                                    : '#c10000',
                                                opacity: hasLowerCase && 0.8,
                                                fontFamily: 'Nunito',
                                                fontWeight: '600',
                                            }}
                                        >
                                            {' '}
                                            <span
                                                style={{
                                                    fontWeight: '700',
                                                    marginRight:
                                                        !hasLowerCase && '4px',
                                                }}
                                            >
                                                {hasLowerCase ? '✔' : 'x'}
                                            </span>{' '}
                                            Lower-case characters
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: hasMinLength
                                                    ? '#007E05'
                                                    : '#c10000',
                                                opacity: hasMinLength && 0.8,
                                                fontFamily: 'Nunito',
                                                fontWeight: '600',
                                            }}
                                        >
                                            {' '}
                                            <span
                                                style={{
                                                    fontWeight: '700',
                                                    marginRight:
                                                        !hasMinLength && '4px',
                                                }}
                                            >
                                                {hasMinLength ? '✔' : 'x'}
                                            </span>{' '}
                                            Minimum 8 characters
                                        </Typography>
                                        <Typography
                                            sx={{
                                                opacity: hasMinLength && 0.8,
                                                fontFamily: 'Nunito',
                                                fontWeight: '600',

                                                color: hasUpperCase
                                                    ? '#007E05'
                                                    : '#c10000',
                                            }}
                                        >
                                            {' '}
                                            <span
                                                style={{
                                                    fontWeight: '700',
                                                    marginRight:
                                                        !hasUpperCase && '4px',
                                                }}
                                            >
                                                {hasUpperCase ? '✔' : 'x'}
                                            </span>{' '}
                                            Upper-case characters
                                        </Typography>{' '}
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            sx={{
                                                color: hasDigit
                                                    ? '#007E05'
                                                    : '#c10000',
                                                opacity: hasDigit && 0.8,
                                                fontFamily: 'Nunito',
                                                fontWeight: '600',
                                            }}
                                        >
                                            {' '}
                                            <span
                                                style={{
                                                    fontWeight: '700',
                                                    marginRight:
                                                        !hasDigit && '4px',
                                                }}
                                            >
                                                {hasDigit ? '✔' : 'x'}
                                            </span>{' '}
                                            Numbers
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: hasSymbol
                                                    ? '#007E05'
                                                    : '#c10000',
                                                opacity: hasSymbol && 0.8,
                                                fontFamily: 'Nunito',
                                                fontWeight: '600',
                                            }}
                                        >
                                            {' '}
                                            <span
                                                style={{
                                                    fontWeight: '700',
                                                    marginRight:
                                                        !hasDigit && '4px',
                                                }}
                                            >
                                                {hasSymbol ? '✔' : 'x'}
                                            </span>{' '}
                                            Symbols
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Typography>
                            <SubmitButton handleSubmit={handleSubmit} />
                        </Box>
                    </Box>
                )}
            </motion.div>
        </>
    );
}

function SubmitButton({ handleSubmit }) {
    return (
        <>
            <Box
                sx={{
                    mt: 5,
                    display: 'flex',
                    justifyContent: 'center',
                    width: '110%',
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
        </>
    );
}
