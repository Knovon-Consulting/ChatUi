"use client"; // Ensure this file is a client component

import React, { useState, useEffect } from "react";
import sendicon from '@/public/assests/1x/send-icon.png';
import usericon from '@/public/assests/1x/user-profile.png';
import Hiaicon from '@/public/assests/1x/coach-profile-icon.png';
import micicon from '@/public/assests/1x/mic-icon-bg.png';
import Image from "next/image";

function ChatMiddle() {
    const [messages, setMessages] = useState<Array<{ message: string, position: string, time: string }>>([]);
    const [input, setInput] = useState<string>("");
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAudioToText, setIsAudioToText] = useState<boolean>(false);

    let chunks: Blob[] = [];

    useEffect(() => {
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
        if (typeof window !== 'undefined') {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const newMediaRecorder = new MediaRecorder(stream);
                    newMediaRecorder.onstart = () => {
                        chunks = [];
                    };
                    newMediaRecorder.ondataavailable = e => {
                        chunks.push(e.data);
                    };
                    newMediaRecorder.onstop = async () => {
                        setIsAudioToText(true);
                        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                        const formData = new FormData();
                        formData.append('file', audioBlob, 'recording.webm');

                        try {
                            const response = await fetch("/api/speechToText", {
                                method: "POST",
                                body: formData,
                            });
                            const data = await response.json();
                            if (response.status !== 200) {
                                throw data.error || new Error(`Request failed with status ${response.status}`);
                            }
                            setIsAudioToText(false);
                            // Send the message to handleSend
                            sendSpeechMessage(data.message.text);
                        } catch (error) {
                            console.error(error);
                            alert(error.message);
                        } finally {
                            setIsRecording(false);
                        }
                    };
                    setMediaRecorder(newMediaRecorder);
                })
                .catch(err => console.error('Error accessing microphone:', err));
        }
    }, []);

    const sendSpeechMessage = (text: string) => {
        setInput(text);
        handleSend(text); // Call handleSend with the speech-to-text result
    };

    const handleSend = async (messageText?: string) => {
        const textToSend = messageText || input.trim();
        if (textToSend) {
            const currentTime = new Date().toLocaleTimeString();
            setMessages(PrevMessages => [
                ...PrevMessages, { message: textToSend, position: "right", time: currentTime }]
            );
            setInput("");
            setLoading(true);

            const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
            const chatId = localStorage.getItem('chatId');

            if (!chatId) {
                console.error("Chat ID not found in localStorage");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: userDetails.id,
                        text: textToSend,
                        chat_id: chatId
                    })
                });

                const data = await response.json();
                const botMessage = data.message;
                const botTime = new Date().toLocaleTimeString();
                setMessages(prevMessages => [
                    ...prevMessages,
                    { message: botMessage, position: "left", time: botTime }
                ]);
            } catch (error) {
                console.error("Error sending message to API:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const startRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.start();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const scrollToBottom = () => {
        const chatWindowRef = document.querySelector('.chat-window');
        if (chatWindowRef) {
            chatWindowRef.scrollTo({
                top: chatWindowRef.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="c_mid_O">
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.position === "right" ? "user-message" : "bot-message"}`}>
                        <div className="sender_Info">
                            {msg.position === "right" ? (
                                <>
                                    <Image src={usericon} alt="User Icon" width={40} height={40} />
                                    <p className="text-black">{userName || 'User'}</p>
                                </>
                            ) : (
                                <>
                                    <Image src={Hiaicon} alt="HiA Icon" className="hia_icon" width={100} height={100} />
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
                {isAudioToText && (
                    <div className="user-message loading-message">
                        <Image src={usericon} alt="User Icon" className="user_icon" layout="intrinsic" width={40} height={40} />
                        <p>Transcribing your words… please wait.</p>
                    </div>
                )}
            </div>
            <div className="chat-input">
                <textarea
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <button onClick={() => handleSend()} className="sendBtn">
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