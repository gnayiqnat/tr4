import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useContext, useEffect } from 'react';
import { isMobile } from 'react-device-detect';

function Dashboard() {
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
                    <Sec1 />
                </Box>
            </motion.div>
        </>
    );
}

function Sec1() {
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
                    mt: 1.5,
                    display: 'grid',
                    gap: '0px 40px',
                }}
            >
                <Grid item>
                    <Card
                        sx={{
                            padding: '30px 100px 55px 35px',
                            width: 'fit-content',
                            backgroundColor: 'primary.main',
                            borderRadius: '23px',
                        }}
                    >
                        {' '}
                        <Grid container sx={{ flexDirection: 'column' }}>
                            <Grid item>
                                <Typography
                                    sx={{
                                        fontSize: '1.2em',
                                        textAlign: 'left',
                                        opacity: 0.4,
                                        fontWeight: '400',
                                        fontFamily: 'Nunito',
                                        color: 'secondary.main',
                                    }}
                                >
                                    Classroom Budget
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography
                                    sx={{
                                        fontFamily: 'Nunito',
                                        fontSize: '2.8em',
                                        lineHeight: 1.1,
                                        fontWeight: '200',
                                        color: 'secondary.main',

                                        marginLeft: '5px',
                                        marginTop: '3px',
                                    }}
                                >
                                    RM 93
                                </Typography>
                            </Grid>
                            {/* <Grid item>
                        <Button
                            sx={{
                                backgroundColor: 'rgba(133, 149, 173, 0.9)',
                                color: '#333D4D',
                                padding: '9px 20px',
                                borderRadius: '50px',
                                mt: 6,
                                ml: 17,
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
                    </Grid> */}
                        </Grid>
                    </Card>{' '}
                </Grid>
               
            </Grid>
        </Grid>
    );
}

export default Dashboard;
