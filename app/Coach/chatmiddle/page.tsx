"use client"; // Ensure this file is a client component

import React, { useState, useEffect, useRef } from "react";
import sendicon from '../../../public/assests/1x/send-icon.png';
import usericon from '../../../public/assests/1x/user-profile.png';
import Hiaicon from '../../../public/assests/1x/coach-profile-icon.png';
import micicon from '../../../public/assests/1x/mic-icon-bg.png';
import Image from "next/image";
import axios from 'axios';

function ChatMiddle() {
    const [messages, setMessages] = useState<Array<{ message: string, position: string, time: string }>>([]);
    const [input, setInput] = useState<string>("");
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [isClient, setIsClient] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const chatWindowRef = useRef<HTMLDivElement>(null);  

    useEffect(() => {
        setIsClient(true);
        const userDetails = localStorage.getItem('userDetails');
        if (userDetails) {
            const parsedUserDetails = JSON.parse(userDetails);
            setUserName(parsedUserDetails?.userName || parsedUserDetails?.first_name || 'User');
        }
        const storedMessages = localStorage.getItem('conversation');
        if (storedMessages) {
            const parsedMessages = JSON.parse(storedMessages);
            setMessages(parsedMessages);
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('conversation', JSON.stringify(messages));
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        if (isClient) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Speech Recognition is not supported in this browser.");
                return;
            }
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(prevInput => prevInput + " " + transcript);
                setIsRecording(false);
            };
            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsRecording(false);
            };
            if (isRecording) {
                recognition.start();
            } else {
                recognition.stop();
            }
        }
    }, [isClient, isRecording]);

    const handleSend = async () => {
        if (input.trim()) {
            const currentTime = new Date().toLocaleTimeString();
            const newMessages = [
                ...messages,
                { message: input, position: "right", time: currentTime }
            ];
            setMessages(newMessages);
            setInput("");
            setLoading(true);

            const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
            const chatId = localStorage.getItem('chatId');  // Retrieve chatId from localStorage

            if (!chatId) {
                console.error("Chat ID not found in localStorage");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post('/api/chat', {
                    user_id: userDetails.id,
                    text: input,
                    chat_id: chatId
                });

                const botMessage = response.data.message;
                const botTime = new Date().toLocaleTimeString();
                setMessages(prevMessages => [
                    ...prevMessages,
                    { message: botMessage, position: "left", time: botTime }
                ]);
            } catch (error) {
                console.error("Error sending message to API:", error);
            }
            finally {
                setLoading(false);  // Stop loading once the bot response is received
            }
        }
    };

    const handleMicClick = () => {
        setIsRecording(prevRecording => !prevRecording);
    };

    const scrollToBottom = () => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTo({
                top: chatWindowRef.current.scrollHeight,
                behavior: "smooth"  // Smooth scrolling behavior
            });
        }
    };
    return (
        <div className="c_mid_O">
            <div className="chat-window" ref={chatWindowRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.position === "right" ? "user-message" : "bot-message"}`}>
                        <div className="sender_Info">
                            {msg.position === "right" ? (
                                <>
                                    <Image src={usericon} alt="User Icon"  width={40} height={40} />
                                    <p className="text-black">{userName || 'User'}</p>
                                </>
                            ) : (
                                <>
                                    <Image src={Hiaicon} alt="HiA Icon" className="hia_icon"  width={100} height={100} />
                                    <p>HiA Coach</p>
                                </>
                            )}
                            <span>{msg.time}</span>
                        </div>
                        <p>{msg.message}</p>
                    </div>
                ))}
                          {loading && (
                    <div className="bot-message loading-message">
                        <Image src={Hiaicon} alt="HiA Icon" className="hia_icon" layout="intrinsic" width={40} height={40} />
                        <p>HiA Coach is typing...</p>
                    </div>
                )}
            </div>
            <div className="chat-input">
                <textarea
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {  // Send on Enter without Shift
                            e.preventDefault(); // Prevents newline
                            handleSend();
                        }
                    }}
                />
                <button onClick={handleSend} className="sendBtn">
                    <Image src={sendicon} alt="Send Icon" layout="intrinsic" width={20} height={20} /> Send
                </button>
                <Image
                    src={micicon}
                    alt="Mic Icon"
                    className={`mic_Icon ${isRecording ? "recording" : ""}`}
                    width={40}
                    height={40}
                    layout="intrinsic"
                    onClick={handleMicClick}
                />
            </div>
        </div>
    );
}

export default ChatMiddle;