import {
    AccountBalanceWalletRounded,
    ChatRounded,
    PersonOutlineRounded,
} from '@mui/icons-material';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import {
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Card,
    Paper,
    Typography,
} from '@mui/material';
import { motion, useAnimate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function DashboardMobile() {

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1}}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        mt: 14,
                    }}
                >
                    <Avatar
                        sx={{
                            borderRadius: 0,
                            width: '50px',
                            height: '50px',
                            opacity: 0.9,
                        }}
                        style={{ cursor: 'pointer' }}
                        src='/logo/logo.png'
                    />
                    <Typography
                        sx={{
                            fontFamily: 'Nunito',
                            fontWeight: '600',
                            fontSize: '1.3rem',
                            color: 'primary.main',
                            mt: 2,
                            mb: -0.5,
                        }}
                    >
                        Announcements
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: 'Nunito',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#52627A',
                        }}
                    >
                        Updated on 21 Dec 2024, 19:26
                    </Typography>
                    <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Card
                            sx={{
                                mt: 4,
                                backgroundColor: '#9BAAC2',
                                height: '75px',
                                width: '80vw',
                                borderRadius: '10px',
                            }}
                        ></Card>
                    </motion.div>
                    <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Card
                            sx={{
                                mt: 2.5,
                                backgroundColor: '#9BAAC2',
                                height: '75px',
                                width: '80vw',
                                borderRadius: '10px',
                            }}
                        ></Card>
                    </motion.div>
                    {/* <Card
                    sx={{
                        mt: 6,
                        backgroundColor: '#9BAAC2',
                        height: '375px',
                        width: '80vw',
                        borderRadius: '10px',
                    }}
                ></Card> */}
                </Box>{' '}
            </motion.div>
        </>
    );
}
