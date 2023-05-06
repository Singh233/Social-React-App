import React, { useEffect, useRef, useState } from 'react'

import env from '../utils/env';

import styles from '../styles/css/directmessage.module.scss';
import dummyImg from '../styles/img/dummy.jpeg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import { createMessage, fetchMessages } from '../api';
import toast from 'react-hot-toast';

export default function DirectMessage(props) {
    const { setIsDirectMessageOpen, user, chatRoom } = props;
    const auth = useAuth();
    const socket = auth.socket;
    const lastMessageRef = useRef(null);
    
    //state for last message
    const [lastMessage, setLastMessage] = useState(null);

    // state for messages
    const [messages, setMessages] = useState([]);

    // state for input message
    const [message, setMessage] = useState('');
    
    // find the user from the auth users friends list
    let friend = auth.user.friends.find(friend => friend.to_user._id == user.to_user._id);
    // update the user with the friend object
    friend = friend.to_user;

    useEffect(() => {
        // scroll to bottom
        // fetch chat messages
        const getMessages = async () => {
            const response = await fetchMessages('private', auth.user._id, friend._id, chatRoom); // fetch messages from_user, to_user
            if (response.success) {
                // console.log(response.data.chatRoom.messages);
                setMessages(response.data.chatRoom.messages);
                setTimeout(() => {
                    lastMessageRef.current?.scrollIntoView({ });
                }, 0);
            }
        }

        getMessages();
        // console.log(messages);

        return () => {
            // socket cleanup
            socket.off('receive_private_message');
            socket.off('private_user_joined');
            socket.off('typingResponsePrivate');
        }

    }, [])

    const handleSendMessageClick = async () => {
        
        if (message.trim().length === 0) {
            toast.error('Message cannot be empty');
            return;
        }

        let from_user = auth.user._id;
        let to_user = friend._id;


        socket.emit('send_private_message', {
            message,
            user_email: auth.user.email,
            user_name: auth.user.name,
            user_profile: auth.user.avatar,
            time: new Date().toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric"}),
            from_user,
            to_user,
            chatroom: chatRoom
        });
        setMessage('');
        const response = await createMessage('private', message, from_user, to_user, chatRoom);
        if (response.success) {
            // console.log('added to db', response.data);
        }

    }

    socket.on('private_user_joined', async function(data) {
        // scroll to bottom
        

    })

    socket.on('receive_private_message', function(data){

        // check if the chatroom is the same as the current chatroom
        if (data.chatroom === chatRoom) {
            // console.log('Chatroom is the same');
            // if from_user is the same as the auth user
            if (data.from_user === auth.user._id) {

                // add the message to the messages list
                setMessages([...messages, {
                    message: data.message,
                    sender: {
                        _id: auth.user._id,
                        email: auth.user.email,
                        name: auth.user.name,
                        avatar: auth.user.avatar
                    },
                    receiver: {
                        email: data.user_email,
                        name: data.user_name,
                        avatar: data.user_profile
                    },
                    chatRoomId: data.chatroom,
                    createdAt: new Date(),
                }]);
            } else {
                // console.log('From user is not the same as auth user');
                // add the message to the messages list
                setMessages([...messages, {
                    message: data.message,
                    sender: {
                        _id: data.from_user,
                        email: data.user_email,
                        name: data.user_name,
                        avatar: data.user_profile
                    },
                    receiver: {
                        email: auth.user.email,
                        name: auth.user.name,
                        avatar: auth.user.avatar
                    },
                    chatRoomId: data.chatroom,
                    createdAt: new Date(),
                }]);
            }

        } else {
            // console.log('Chatroom is not the same');
        }
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

    });

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (message.trim().length > 0) {
                handleSendMessageClick();
                return;
            }
            toast.error('Message cannot be empty');

        } else {
            let from_user = auth.user._id;
            let to_user = friend._id;

            // fire typingPrivate event
            socket.emit('typingPrivate', {
                user_email: auth.user.email,
                user_name: auth.user.name,
                user_profile: auth.user.avatar,
                from_user,
                to_user,
                chatroom: chatRoom
            });

        }
    }

    let typing = false;
    let timeout = undefined;
    let animationTimeout = undefined;
    const [typingStatus, setTypingStatus] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [userAvatar, setUserAvatar] = useState(null);

    function timeoutFunction(){
        typing = false;
        setFadeOut(true);
        animationTimeout = setTimeout(function(){
            setTypingStatus(false);
        }, 700);
    }


    // listen to typing event and show the typing status
    socket.on('typingResponsePrivate', function(data){
        // console.log(data)
        // console.log('typing')
        const to_user = friend._id;
        const from_user = auth.user._id;


        if (data.chatroom === chatRoom){

            if (data.from_user !== from_user){

                if (typing === false) {
                    clearTimeout(animationTimeout);
                    // $('#typing-status-private').removeClass('animate__fadeOut');
                    setFadeOut(false);

                    typing = true;
                    setTypingStatus(true);
                    setUserAvatar(data.user_profile);
                    // console.log('typed')
                    timeout = setTimeout(timeoutFunction, 1000);
                } else {
                    clearTimeout(timeout);
                    timeout = setTimeout(timeoutFunction, 1000);
                }
                
            }
        }
    });


    return (
        <div className={styles.container}>
            <div className={styles.topContainer}>
                <div className={styles.header}>
                    <FontAwesomeIcon className={styles.backIcon} onClick={() => setIsDirectMessageOpen(false)} icon={faChevronLeft} />

                    <p className={styles.info}>
                        <img src={friend.avatar ? env.file_url + friend.avatar : dummyImg} alt="" />
                        <span className={styles.status}>
                            <span className={styles.userName} > {friend.name} </span>
                            <FontAwesomeIcon icon={faCircle} className={ user.status === 'Active now' ? styles.circleGreen : styles.circleGray} />
                            <span className={styles.time}>{user.status === 'Active now' ? 'Active now' : user.moment ? 'Active ' + user.moment : 'Offline' }</span>
                        </span>
                    </p>
                    <p></p>
                </div>

                <div className={styles.content}>


                    <div  className={styles.messagesList}>

                        <div className={styles.userProfile}>
                            <img className={styles.userImage} src={friend.avatar ? env.file_url + friend.avatar : dummyImg} alt="" />
                            <p className={styles.userName}> {friend.name} </p>
                            <div className={styles.stats}>
                                {friend.posts.length} posts <span className={styles.dot}></span> {friend.followers.length} followers <span className={styles.dot}></span> {friend.following.length} following
                            </div>
                            <p className={styles.joinInfo}>
                                Joined 2 years ago
                            </p>

                            <Link to={`/users/profile/${friend._id}`} className={styles.viewProfile}>
                                View Profile
                            </Link>
                        </div>

                        {
                            messages.map((message, index) => {
                                return message.sender._id === auth.user._id ? (
                                        <div key={index} 
                                            className={`animate__animated animate__fadeIn ${styles.selfMessage}`}
                                            style={
                                                messages[index + 1]?.sender._id === message.sender._id ? { padding: 2 }
                                                : messages[index - 1]?.sender._id === message.sender._id ? { padding: 2, marginBottom: 5 }
                                                : { padding: 5 }
                                            }
                                            >
                                            
                                            <div className={styles.messageContent}>
                                                {
                                                    // if previous message is same as current message
                                                    messages[index + 1]?.sender._id === message.sender._id ? (
                                                        <>
                                                            <span className={styles.withoutChatBubble}>
                                                                {message.message} <sup>{ new Date(message.createdAt).toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric"}) }</sup> 
                                                            </span>
                                                            {/* <img style={{visibility: 'hidden'}} src='' /> */}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className={styles.chatBubble}>
                                                                {message.message} <sup>{ new Date(message.createdAt).toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric"}) }</sup> 
                                                            </span>
                                                            {/* <img src={ message.sender.avatar ? env.file_url + message.sender.avatar : dummyImg } /> */}
                                                        </>
                                                    )
                                                }
                                                
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={index} 
                                            className={`animate__animated animate__fadeIn ${styles.otherMessage}`}
                                            style={
                                                messages[index + 1]?.sender._id === message.sender._id ? { padding: 2 }
                                                : messages[index - 1]?.sender._id === message.sender._id ? { padding: 2, marginBottom: 5 }
                                                : { padding: 5 }
                                            }
                                            >
                                            <div className={styles.messageContent}>
                                            {
                                                    // if previous message is same as current message
                                                    messages[index + 1]?.sender._id === message.sender._id ? (
                                                        <>
                                                            {/* <img style={{visibility: 'hidden'}} src='' /> */}
                                                            <span className={styles.withoutChatBubble}>
                                                                {message.message} <sup>{ new Date(message.createdAt).toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric"}) }</sup> 
                                                            </span>
                                                            
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* <img src={ message.sender.avatar ? env.file_url + message.sender.avatar : dummyImg } /> */}
                                                            <span className={styles.chatBubble}>
                                                                {message.message} <sup>{ new Date(message.createdAt).toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric"}) }</sup> 
                                                            </span>
                                                        </>
                                                    )
                                                }
                                                
                                            </div>
                                        </div>
                                    )
                            })
                                
                        }

                        <div ref={lastMessageRef}></div>

                        {/* <div className={`animate__animated animate__fadeIn ${styles.otherMessage}`}>
                            <div className={styles.messageContent}>
                                <img src={dummyImg} />
                                <span>
                                    Other Message <sup>2:04 AM</sup> 
                                </span>
                                
                            </div>
                        </div>

                        <div className={`animate__animated animate__fadeIn ${styles.selfMessage}`}>
                            <div className={styles.messageContent}>
                                
                                <span>
                                    Self Message <sup>2:04 AM</sup> 
                                </span>
                                <img src={dummyImg} />
                            </div>
                        </div> */}

                    </div>

                </div>

                {
                    typingStatus && (
                        <div className={`${styles.typingStatus} animate__animated ${fadeOut ? 'animate__fadeOut' : ''}`}>
                            <img className='animate__animated animate__fadeIn' src={userAvatar ? env.file_url + userAvatar : dummyImg} />
                            <div className={`${styles.animation} animate__animated animate__fadeIn`}>
                                <div className={styles.animation__dot1}></div>
                                <div className={styles.animation__dot2}></div>
                                <div className={styles.animation__dot3}></div>
                            </div>
                        </div>
                    )
                }
                
                

            </div>

            <div className={styles.bottomContainer}>
                <input type="text" 
                    placeholder="Type a message" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    />


                <button onClick={handleSendMessageClick} className={styles.sendButton}>
                    <FontAwesomeIcon icon={faPaperPlane} />

                </button>
            </div>
        </div>
    )
}
