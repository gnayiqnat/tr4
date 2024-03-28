import {
    AccountBalanceWalletRounded,
    ChatRounded,
    Person,
} from '@mui/icons-material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
    AppBar,
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    Toolbar,
    styled,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
    BrowserRouter,
    NavLink,
    Route,
    Routes,
    useNavigate,
} from 'react-router-dom';
import Auth from './Auth.jsx';
import Dashboard from './Dashboard.jsx';

import { MaterialDesignContent, SnackbarProvider } from 'notistack';
import { isMobile } from 'react-device-detect';
import { useMediaQuery } from 'react-responsive';
import FourOFourPage from './404.jsx';
import Chat from './chat.jsx';
import PrivacyPolicy from './privacyPolicy.jsx';
import Profile from './profile.jsx';
import SetPassword from './setPassword.jsx';

export default function App() {
    const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
        '&.notistack-MuiContent-success': {
            backgroundColor: 'rgba(56, 142, 60, 0.28)',
            padding: '8px 18px 8px 18px',
            borderRadius: '10px',
            borderStyle: 'solid',
            borderColor: 'rgba(56, 142, 60, 0.1)',
            boxShadow: '0px 0px 25px rgba(56, 142, 60, 0.25)',

            fontFamily: 'Nunito',
            fontSize: '16.8px',
            fontWeight: '600',
            color: '#1b5e20',
        },
        '&.notistack-MuiContent-info': {
            backgroundColor: 'rgba(2, 136, 209, 0.25)',
            padding: '8px 18px 8px 18px',
            borderRadius: '10px',
            borderStyle: 'solid',
            borderColor: 'rgba(2, 136, 209, 0.1)',
            boxShadow: '0px 0px 25px rgba(2, 136, 209, 0.25)',

            fontFamily: 'Nunito',
            fontSize: '16.8px',
            fontWeight: '600',
            color: '#01579b',
        },
        '&.notistack-MuiContent-error': {
            backgroundColor: 'rgb(211, 47, 47, 0.25)',
            padding: '8px 18px 8px 18px',
            borderRadius: '10px',
            borderStyle: 'solid',
            borderColor: 'rgb(211, 47, 47, 0.1)',
            boxShadow: '0px 0px 25px rgb(211, 47, 47, 0.25)',

            fontFamily: 'Nunito',
            fontSize: '16.8px',
            fontWeight: '600',
            color: 'rgb(211, 47, 47)',
        },
    }));

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <SnackbarProvider
                    transitionDuration={{ enter: 200, exit: 200 }}
                    disableWindowBlurListener={true}
                    autoHideDuration={3000}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: isMobile ? 'center' : 'right',
                    }}
                    maxSnack={3}
                    Components={{
                        success: StyledMaterialDesignContent,
                        info: StyledMaterialDesignContent,
                        error: StyledMaterialDesignContent,
                    }}
                    iconVariant={{
                        success: (
                            <CheckCircleOutlineRoundedIcon
                                sx={{ mr: '10px', color: '#388e3c' }}
                            />
                        ),
                        info: (
                            <InfoOutlinedIcon
                                sx={{ mr: '10px', color: '#0288d1' }}
                            />
                        ),
                        error: (
                            <ErrorOutlineOutlinedIcon
                                sx={{ mr: '10px', color: 'rgba(211, 47, 47)' }}
                            />
                        ),
                    }}
                >
                    <BrowserRouter>
                        {' '}
                        <NavBar />
                        <Routes>
                            <Route path='/' element={<Auth />} />
                            <Route
                                path='/dashboard'
                                element={<Dashboard />}
                            />{' '}
                            <Route
                                path='/privacypolicy'
                                element={<PrivacyPolicy />}
                            />
                            <Route
                                path='/set-password'
                                element={<SetPassword />}
                            />{' '}
                            <Route path='/chat' element={<Chat />} />
                            <Route path='/profile' element={<Profile />} />
                            <Route path='*' element={<FourOFourPage />} />
                        </Routes>
                    </BrowserRouter>
                </SnackbarProvider>
            </motion.div>{' '}
        </>
    );
}

function NavBar() {
    const urlList = ['/', '/chat', '/finance', '/profile'];
    useEffect(() => {
        const currentPathname = window.location.pathname;
        const index = urlList.findIndex((path) => path === currentPathname);

        if (index !== -1) {
            setValue(index);
        }
    }, []);
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    return (
        <>
            {isMobile ? (
                <>
                    <Paper
                        sx={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            marginBottom: 0.5,
                        }}
                        elevation={0}
                    >
                        <BottomNavigation
                            showLabels={false}
                            sx={{
                                padding: '5px 0px',
                                color: '#C2CAD6',
                                '& .Mui-selected': {
                                    color: 'primary.main',
                                    opacity: 0.9,
                                },

                                '& .MuiSvgIcon-root': {
                                    color: 'primary.main',
                                    opacity: 0.9,
                                },
                            }}
                            value={value}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                            }}
                        >
                            <BottomNavigationAction
                                disableRipple
                                sx={{ color: 'primary.main', opacity: 0.3 }}
                                label='Home'
                                component={NavLink}
                                to='/dashboard'
                                icon={
                                    <HomeRoundedIcon
                                        sx={{ opacity: 0.3, mb: 0.5 }}
                                    />
                                }
                            />
                            <BottomNavigationAction
                                disableRipple
                                sx={{ color: 'primary.main', opacity: 0.3 }}
                                label='Chat'
                                component={NavLink}
                                to='/chat'
                                icon={
                                    <ChatRounded
                                        sx={{ opacity: 0.3, mb: 0.5 }}
                                    />
                                }
                            />
                            <BottomNavigationAction
                                disableRipple
                                sx={{ color: 'primary.main', opacity: 0.3 }}
                                label='Finance'
                                component={NavLink}
                                to='/finance'
                                icon={
                                    <AccountBalanceWalletRounded
                                        sx={{ opacity: 0.3, mb: 0.5 }}
                                    />
                                }
                            />
                            <BottomNavigationAction
                                disableRipple
                                sx={{ color: 'primary.main', opacity: 0.3 }}
                                label='Profile'
                                component={NavLink}
                                to='/profile'
                                icon={<Person sx={{ opacity: 0.3, mb: 0.5 }} />}
                            />
                        </BottomNavigation>
                    </Paper>
                </>
            ) : (
                <>
                    <AppBar
                        elevation={0}
                        sx={{
                            backgroundColor: 'white',
                            paddingTop: 1.75,
                            position: 'absolute',
                        }}
                    >
                        <Toolbar
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Avatar
                                sx={{
                                    borderRadius: 0,
                                    width: '50px',
                                    height: '50px',
                                }}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    navigate('/');
                                }}
                                src='/logo/logo.png'
                            />

                            {/* <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            window.open('/profile');
                        }}
                    >
                        <Avatar
                            sx={{ mr: 2, backgroundColor: 'primary.main' }}
                        />
                    </motion.div> */}
                        </Toolbar>
                    </AppBar>{' '}
                </>
            )}
        </>
    );
}
