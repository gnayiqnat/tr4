import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useRef } from 'react';

function Dashboard() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState('');

    useEffect(() => {
        supabase.auth
            .getUser()
     
            .then((response) => {
                response
                    ? response.data.user === null &&
                      (enqueueSnackbar('Please log in', {
                          variant: 'error',
                          preventDuplicate: true,
                      }),
                      navigate('/'))
                    : (enqueueSnackbar(
                          'Server error, please try again later.',
                          { variant: 'error' }
                      ),
                      console.log(response));
            });
    }, []);
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{
                    maxWidth: '1100px',
                    margin: '0 auto',
                }}
            >
                <Box
                    sx={{
                        mt: 13,
                        padding: isMobile ? '0px 20px' : '0px 60px',
                    }}
                >
                    <ClassroomBudgetCard />
                </Box>
            </motion.div>
        </>
    );
}

function ClassroomBudgetCard() {
    const [dataFetched, setDataFetched] = useState(false);
    const totalAmountOfMoney = useRef(0);
    const id = useRef([]);

    useEffect(() => {
        if (dataFetched == false) {
            supabase
                .from('transactionHistory')
                .select('id, money')
                .then((response) => {
                    response.data.map(
                        (i) =>
                            id.current.includes(i.id) == false &&
                            ((totalAmountOfMoney.current += Number(i.money)),
                            id.current.push(i.id))
                    );
                });
            setDataFetched(true);
        }
    }, [dataFetched]);

    return (
        <Grid container sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
                sx={{
                    fontFamily: 'Nunito',
                    fontWeight: '500',
                    fontSize: '23px',
                    ml: 2,
                }}
            >
                Overview
            </Typography>
            <Grid
                container
                sx={{
                    mt: 2,
                    display: 'flex',
                    flexDirection: 'row',

                    gap: '0px 70px',
                }}
            >
                <Grid item>
                    <Card
                        sx={{
                            padding: '30px 20px 20px 35px',
                            width: 'fit-content',
                            backgroundColor: 'primary.main',
                            borderRadius: '22px',
                        }}
                    >
                        {' '}
                        <Grid container sx={{ flexDirection: 'column' }}>
                            <Grid item>
                                <Typography
                                    sx={{
                                        fontSize: '1.2em',
                                        textAlign: 'left',
                                        opacity: 0.7,
                                        fontWeight: '400',
                                        fontFamily: 'Nunito',
                                        color: '#A5B0C0',
                                        mb: 0.3,
                                    }}
                                >
                                    Classroom Budget
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography
                                    sx={{
                                        fontFamily: 'Montserrat',
                                        fontSize: '2.8em',
                                        lineHeight: 1.1,
                                        fontWeight: '600',
                                        color: 'secondary.main',

                                        marginLeft: '5px',
                                        marginTop: '3px',
                                    }}
                                >
                                    RM {totalAmountOfMoney.current}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button
                                    sx={{
                                        backgroundColor:
                                            'rgba(133, 149, 173, 0.9)',
                                        color: '#333D4D',
                                        padding: '9px 20px',
                                        borderRadius: '50px',
                                        mt: 7,
                                        ml: 27,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: 'Inter',
                                            fontWeight: '600',
                                            textTransform: 'none',
                                        }}
                                    >
                                        Contribute
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>{' '}
                </Grid>
                <Grid item>
                    <Typography
                        align='center'
                        sx={{
                            fontFamily: 'Nunito',
                            fontWeight: '600',
                            color: '#3F4A5A',
                            fontSize: '1.3rem',
                            mb: 2.3,
                        }}
                    >
                        Transaction History
                    </Typography>

                    <Card
                        variant='outlined'
                        sx={{
                            width: '375px',
                            padding: '15px 25px',
                            borderRadius: '15px',
                        }}
                    >
                        <Grid
                            container
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}
                        >
                            <Grid item>
                                <Typography
                                    sx={{
                                        fontFamily: 'Nunito',
                                        opacity: 0.9,
                                        fontWeight: '500',
                                        fontSize: '19px',
                                    }}
                                >
                                    Hole puncher
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: 'Nunito',
                                        opacity: 0.6,
                                        fontSize: '14px',
                                        mt: -0.5,
                                    }}
                                >
                                    16 Mar, 04:12
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: 'Nunito',
                                        opacity: 0.6,
                                        fontWeight: '600',
                                        fontSize: '19px',
                                        mt: -0.5,
                                        color: '#C10000',
                                    }}
                                >
                                    - RM 5
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Dashboard;
