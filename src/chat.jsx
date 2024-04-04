import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import {
    Avatar,
    Box,
    Button,
    Card,
    FormControl,
    Grid,
    IconButton,
    OutlinedInput,
    Typography,
} from '@mui/material';
import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function Root({ chatViewActive, setchatViewActive }) {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });

    const [thisDudesUsername, setThisDudesUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scope, animate] = useAnimate();
    const [messagesList, setMessagesList] = useState(['']);

    useEffect(() => {
        if (messagesList == '') {
            supabase
                .from('chat_messages')
                .select('*')
                .order('created_at', { ascending: false }) // Descending order
                .limit(25)
                .then((response) => {
                    !response.error && setMessagesList(response.data.reverse());
                });
        }

        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                },
                (payload) => {
                    payload.errors === null &&
                        setMessagesList((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    useEffect(() => {
        document.getElementById('scrollToBottom') &&
            document
                .getElementById('scrollToBottom')
                .scrollIntoView({ behavior: 'smooth' });
    }, [messagesList]);

    const [userID, setUserID] = useState('');
    useEffect(() => {
        if (isLoggedIn) {
            console.log('step 1');
            const cookiesData = document.cookie;
            if (cookiesData != '') {
                console.log('step 2 cookie: ', cookiesData);
            } else {
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
                        r.data[0].username != ''
                            ? (document.cookie = `username=${r.data[0].username};`)
                            : console.error('Username not found for this user');
                    });
            }
        }
    }, [isLoggedIn]);

    useEffect(() => {
        supabase.auth
            .getSession()

            .then((response) => {
                response
                    ? response.data.session === null
                        ? (enqueueSnackbar('Please log in', {
                              variant: 'error',
                              preventDuplicate: true,
                          }),
                          navigate('/'))
                        : (animate(
                              scope.current,
                              { opacity: 1 },
                              { duration: 0.5 }
                          ),
                          setIsLoggedIn(true))
                    : enqueueSnackbar('Server error, please try again later.', {
                          variant: 'error',
                      });
            });
    }, []);

    

    return (
        <AnimatePresence>
            <Box sx={{ opacity: 0 }} ref={scope}>
                <Box sx={{ overflow: 'hidden' }}>
                    {chatViewActive ? (
                        <>
                            <Box
                                sx={{
                                    width: '100vw',
                                    position: 'fixed',
                                    backgroundColor: '#ffffff',
                                    padding: '5px 0px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    gap: '0px 5px',
                                }}
                            >
                                <IconButton
                                    sx={{
                                        backgroundColor: '#ffffff',
                                        zIndex: 999,
                                    }}
                                    onClick={() => {
                                        setchatViewActive(false);
                                    }}
                                >
                                    <ArrowBackIosNewRoundedIcon />
                                </IconButton>
                                <Avatar>
                                    <GroupRoundedIcon />
                                </Avatar>
                                <Typography
                                    sx={{
                                        fontFamily: 'Nunito',
                                        fontWeight: '500',
                                        fontSize: '1.25rem',
                                        ml: 1,
                                    }}
                                >
                                    Lorem Ipsum
                                </Typography>
                            </Box>

                            <Grid
                                container
                                sx={{
                                    height: '96%',
                                    overflow: 'hidden',
                                    display: 'grid',
                                    justifyContent: 'end',
                                    gridTemplateRows: '1fr 75px',
                                    height: '97dvh',
                                    maxWidth: '100vw',
                                    overflow: 'hidden',
                                }}
                            >
                                <Grid
                                    item
                                    sx={{
                                        overflowY: 'scroll',
                                        width: '100vw',
                                        padding: '0px 20px',
                                        overflowX: 'hidden',
                                    }}
                                >
                                    <Box sx={{ paddingTop: '60px' }} />
                                    {messagesList.length >= 1 &&
                                        messagesList.map((e, i) => {
                                            const isConsecutiveMessage =
                                                i > 0 &&
                                                messagesList[i - 1].userID ===
                                                    e.userID;

                                            if (e.userID == userID) {
                                                return (
                                                    <Sender
                                                        text={e.text}
                                                        key={i}
                                                        isConsecutive={
                                                            isConsecutiveMessage
                                                        }
                                                    />
                                                );
                                            } else
                                                return (
                                                    <Receiver
                                                        text={e.text}
                                                        username={e.username}
                                                        key={i}
                                                        isConsecutive={
                                                            isConsecutiveMessage
                                                        }
                                                    />
                                                );
                                        })}
                                    <Box id='scrollToBottom' />
                                </Grid>
                                <Grid item>
                                    <Grid
                                        container
                                        sx={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <ChatBox
                                            userID={userID}
                                            isMobile={isMobile}
                                            thisDudesUsername={
                                                thisDudesUsername
                                            }
                                            setThisDudesUsername={
                                                setThisDudesUsername
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <>
                            <motion.div initial={{ x: 10 }} animate={{ x: 0 }}>
                                <Box
                                    sx={{
                                        paddingTop: '110px',
                                        width: '100vw',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                    }}
                                >
                                    {' '}
                                    <Typography
                                        align='left'
                                        sx={{
                                            fontFamily: 'Nunito',
                                            fontSize: '1.3rem',
                                            color: 'primary.main',
                                            mb: 3,
                                        }}
                                    >
                                        Chat
                                    </Typography>
                                    <motion.div
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setchatViewActive(true);
                                        }}
                                        initial={{ scale: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Card
                                            variant='outlined'
                                            sx={{
                                                height: '70px',
                                                width: '90vw',
                                                maxWidth: '350px',
                                                borderRadius: '10px',

                                                padding: '0px 20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0px 10px',
                                            }}
                                        >
                                            {' '}
                                            <Avatar
                                                sx={{
                                                    backgroundColor:
                                                        'primary.main',
                                                }}
                                            >
                                                <GroupRoundedIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'Nunito',
                                                        fontSize: '1.1rem',
                                                        fontWeight: '600',
                                                        mt: 0.5,
                                                        mb: -0.76,
                                                    }}
                                                >
                                                    Lorem Ipsum
                                                </Typography>
                                                <Typography
                                                    sx={{ opacity: 0.6 }}
                                                >
                                                    {messagesList.length >= 1 &&
                                                    messagesList[
                                                        messagesList.length - 1
                                                    ].username ===
                                                        thisDudesUsername
                                                        ? 'You'
                                                        : messagesList[
                                                              messagesList.length -
                                                                  1
                                                          ].username}
                                                    :{' '}
                                                    {messagesList.length >= 1 &&
                                                        messagesList[
                                                            messagesList.length -
                                                                1
                                                        ].text}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </motion.div>
                                </Box>
                            </motion.div>
                        </>
                    )}
                </Box>
            </Box>
        </AnimatePresence>
    );
}

function Receiver({ text, username, isConsecutive }) {
    return (
        <>
            <motion.div initial={{ x: -100 }} animate={{ x: 0 }}>
                <Grid
                    container
                    sx={{
                        flexDirection: 'row',
                        justifyContent: 'start',
                        gap: '10px',
                        mt: isConsecutive ? 0.5 : 2,
                        ml: isConsecutive && 6,
                    }}
                >
                    {!isConsecutive && (
                        <Grid item>
                            <Avatar
                                sx={{
                                    border: '1px solid primary.main',
                                    zIndex: -1,
                                }}
                            />
                        </Grid>
                    )}
                    <Grid item>
                        {!isConsecutive && (
                            <Typography
                                sx={{
                                    marginLeft: '0.25rem',
                                    color: 'contrastColor',
                                }}
                            >
                                {username}
                            </Typography>
                        )}
                        <TextBlock type='receiver' text={text} />
                    </Grid>
                </Grid>
            </motion.div>
        </>
    );
}

function Sender({ text, isConsecutive }) {
    return (
        <>
            <motion.div
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.2, type: 'spring' }}
            >
                <Grid
                    container
                    sx={{
                        display: 'flex',
                        justifyContent: 'end',
                        padding: isConsecutive ? '2px 20px' : '5px 20px',
                        paddingRight: '0px',
                        flexWrap: 'nowrap',
                        marginTop: isConsecutive ? '-2px' : '10px',
                        paddingBottom: '3px',
                    }}
                >
                    <TextBlock type='sender' text={text} />
                </Grid>
            </motion.div>
        </>
    );
}

function TextBlock({ text, type }) {
    return (
        <>
            <Grid item>
                <Grid
                    container
                    sx={{
                        maxWidth: '60vw',
                        justifyContent: type === 'sender' ? 'end' : 'start',
                    }}
                >
                    <Card
                        variant='outlined'
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '8px',

                            lineBreak: 'anywhere',
                            borderColor: 'secondary.main',
                            borderWidth: '3px',
                        }}
                    >
                        <Typography>{text}</Typography>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

function ChatBox({
    isMobile,
    userID,
    thisDudesUsername,
    setThisDudesUsername,
}) {
    const [chatboxInputValue, setChatboxInputValue] = useState('');

    async function pushValue() {
        if (chatboxInputValue !== '') {
            supabase
                .from('chat_messages')
                .insert({
                    username: thisDudesUsername,
                    text: chatboxInputValue,
                })
                .select()
                .then(() => {
                    setChatboxInputValue('');
                });
        } else {
            enqueueSnackbar('Please enter something', {
                variant: 'error',
                preventDuplicate: true,
            });
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: 'white',
                padding: '0px 20px',
            }}
        >
            <Grid
                container
                sx={{
                    padding: '0px 20px',
                    paddingBottom: '30px',
                    margin: '0 auto',
                    backgroundColor: '#ffffff',
                    paddingTop: '10px',
                    width: '100%',
                    margin: '0px 30px',
                    display: 'grid',
                    position: 'fixed',
                    bottom: -1,
                    justifyContent: 'center',
                    mb: isMobile && 0,
                    gridTemplateColumns: '1fr 60px',
                    gap: '10px',
                }}
            >
                <FormControl sx={{ flexDirection: 'row', width: '100%' }}>
                    <OutlinedInput
                        onChange={(e) => {
                            setChatboxInputValue(e.target.value);
                        }}
                        value={chatboxInputValue}
                        placeholder='Type a message'
                        multiline
                        fullWidth
                        onKeyDownCapture={(e) => {
                            e.key === 'Enter' &&
                                (e.preventDefault(), pushValue());
                        }}
                        sx={{ padding: '10px 15px', borderRadius: '10px' }}
                    ></OutlinedInput>
                </FormControl>
                <Button
                    onClick={() => {
                        pushValue();
                    }}
                    sx={{
                        maxHeight: '50px',
                        padding: '5px 0px',
                        backgroundColor: 'primary.main',
                        borderRadius: '10px',
                    }}
                >
                    <IoIosSend size={'30px'} color='white' />
                </Button>
            </Grid>
        </Box>
    );
}
