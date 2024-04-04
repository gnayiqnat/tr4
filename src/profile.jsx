import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import { isMobile } from 'react-device-detect';
import { supabase } from './supabaseClient';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoutRounded } from '@mui/icons-material';

export default function Profile({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();

    function handleLogout() {
        supabase.auth.signOut().then((r) => {
            r.error
                ? console.log(r.error)
                : supabase.auth
                      .getSession()

                      .then((response) => {
                          response.data.session
                              ? enqueueSnackbar(
                                    'Log out failed. Check console for more details.',
                                    { variant: 'error', preventDuplicate: true }
                                )
                              : setIsLoggedIn(false);
                      });
        });
    }

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn]);

    // Get username
    const [userID, setUserID] = useState('');
    const [thisDudesUsername, setThisDudesUsername] = useState('');
    useEffect(() => {
        if (isLoggedIn) {
            if (!userID) {
                supabase.auth.getUser().then((r) => {
                    setUserID(r.data.user.id);
                });
            }
            supabase
                .from('usernames')
                .select('username')
                .eq('user_id', userID)
                .then((r) => {
                    r.data && setThisDudesUsername(r.data[0].username);
                });
        }
    }, [isLoggedIn]);

    return (
        <>
            <Box
                sx={{
                    mt: 13,
                    padding: isMobile ? '0px 20px' : '0px 90px',
                    display: 'flex',
                    justifyContent: 'center',

                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography sx={{ fontFamily: 'Nunito', fontSize: '2rem' }}>
                        Profile
                    </Typography>
                    <Button
                        sx={{
                            color: 'primary.main',
                            textTransform: 'none',
                            borderStyle: 'solid',
                            borderColor: 'primary.main',
                            borderWidth: '1px',
                            padding: '10px 20px',
                        }}
                        onClick={() => {
                            handleLogout;
                            enqueueSnackbar('signout btn pressed');
                        }}
                    >
                        <Typography
                            sx={{
                                mr: 1,
                                fontFamily: 'Nunito',
                                fontWeight: '600',
                                fontSize: '1.1rem',
                            }}
                        >
                            Log out
                        </Typography>
                        <LogoutRounded />
                    </Button>
                </Box>
                <Avatar
                    align='center'
                    sx={{ margin: 'auto', width: '100px', height: '100px' }}
                />
                <Typography sx={{ fontFamily: 'Nunito', fontSize: '1.3rem' }}>
                    Username: {thisDudesUsername}
                </Typography>
            </Box>
        </>
    );
}
