import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
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
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { useMediaQuery } from 'react-responsive';
import { supabase } from './supabaseClient';
import { enqueueSnackbar } from 'notistack';

export default function Root({ chatViewActive, setchatViewActive }) {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
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
        if (!userID) {
            supabase.auth.getUser().then((r) => {
                setUserID(r.data.user.id);
            });
        }
    }, []);

    return (
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
                            gap: '0px 10px',
                        }}
                    >
                        <IconButton
                            sx={{ backgroundColor: '#ffffff', zIndex: 999 }}
                            onClick={() => {
                                setchatViewActive(false);
                            }}
                        >
                            <ArrowBackIosNewRoundedIcon />
                        </IconButton>
                        <Avatar />
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
                            height: '94dvh',
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
                            }}
                        >
                            <Box sx={{ paddingTop: '60px' }} />
                            {messagesList.map((e, i) => {
                                if (e.userID == userID) {
                                    return <Sender text={e.text} key={i} />;
                                } else
                                    return (
                                        <Receiver
                                            text={e.text}
                                            username={e.username}
                                            key={i}
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
                                <ChatBox userID={userID} isMobile={isMobile} />
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <>
                    <Box
                        sx={{
                            paddingTop: '110px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <motion.div
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
                                    maxWidth: '400px',
                                    backgroundColor: 'primary.main',
                                    borderRadius: '10px',
                                }}
                            ></Card>
                        </motion.div>
                    </Box>
                </>
            )}
        </Box>
    );
}

function Receiver({ text, username }) {
    return (
        <>
            <Grid
                container
                sx={{
                    flexDirection: 'row',
                    justifyContent: 'start',
                    gap: '10px',
                    mt: 2,
                }}
            >
                <Grid item>
                    <Avatar
                        sx={{ border: '1px solid primary.main', zIndex: -1 }}
                    />
                </Grid>
                <Grid item>
                    <Typography
                        sx={{ marginLeft: '0.25rem', color: 'contrastColor' }}
                    >
                        {username}
                    </Typography>
                    <TextBlock type='receiver' text={text} />
                </Grid>
            </Grid>
        </>
    );
}

function Sender({ text }) {
    return (
        <>
            <Grid
                container
                sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    padding: '5px 20px',
                    paddingRight: '0px',
                    flexWrap: 'nowrap',
                }}
            >
                <TextBlock type='sender' text={text} />
            </Grid>
        </>
    );
}

function TextBlock(props) {
    return (
        <>
            <Grid item>
                <Grid
                    container
                    sx={{
                        maxWidth: '60vw',
                        justifyContent:
                            props.type === 'sender' ? 'end' : 'start',
                    }}
                >
                    <Card
                        variant='outlined'
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '13px',
                            borderTopRightRadius:
                                props.type === 'sender' && '0px',
                            borderTopLeftRadius:
                                props.type === 'receiver' && '0px',
                            lineBreak: 'anywhere',
                            borderColor: 'secondary.main',
                            borderWidth: '3px',
                        }}
                    >
                        <Typography>{props.text}</Typography>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

function ChatBox({ isMobile, userID }) {
    const [chatboxInputValue, setChatboxInputValue] = useState('');
    const [thisDudesUsername, setThisDudesUsername] = useState('');

    useEffect(() => {
        supabase
            .from('usernames')
            .select('username')
            .eq('user_id', userID)
            .then((r) => {
                setThisDudesUsername(r.data[0].username);
            });
    }, []);

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
