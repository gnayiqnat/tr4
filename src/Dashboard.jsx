import { Box, Card, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useContext, useEffect } from 'react';

function Dashboard() {
    return (
        <>
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5, delay: 0.5}}><Box sx={{ padding: '20px 50px' }}>
                <Sec1 />
            </Box></motion.div>
        </>
    );
}

function Sec1() {
    return (
        <Card
            sx={{
                mt: 11,
                ml: 3,
                padding: '30px 0px 55px 35px',
                maxWidth: '300px',
                backgroundColor: 'primary.main',
                borderRadius: '10px',
            }}
        >
            {' '}
            <Grid container sx={{ flexDirection: 'column' }}>
                <Grid item>
                    <Typography
                        sx={{
                            fontSize: '1.1em',
                            textAlign: 'left',
                            opacity: 0.5,
                            fontFamily: 'Inter',
                            color: 'secondary.main',
                        }}
                    >
                        Classroom Budget
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        sx={{
                            fontSize: '3em',
                            lineHeight: 1.1,
                            fontWeight: '700',
                            color: 'secondary.main',

                            marginLeft: '10px',
                            marginTop: '3px',
                        }}
                    >
                        RM 193
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    );
}

function Sec2() {
    return (
        <>
            <Grid container>
                <Grid item>
                    <Card
                        sx={{
                            width: '80vw',
                            height: '400px',
                            borderRadius: '10px',
                        }}
                    ></Card>
                </Grid>
            </Grid>
        </>
    );
}

export default Dashboard;
