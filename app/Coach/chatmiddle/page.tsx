import React, { useState, useEffect } from "react";
import sendicon from '../../../public/assests/1x/send-icon.png';
import usericon from '../../../public/assests/1x/user-profile.png';
import Hiaicon from '../../../public/assests/1x/coach-profile-icon.png';
import micicon from '../../../public/assests/1x/mic-icon-bg.png';
import Image from "next/image"; // Import Next.js Image component

function ChatMiddle() {
    const [messages, setMessages] = useState<Array<{ message: string, position: string, time: string }>>([]);
    const [input, setInput] = useState<string>(""); 
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>(''); 
    const [isClient, setIsClient] = useState<boolean>(false); // Flag to check if we are on the client-side

    useEffect(() => {
        setIsClient(true);

        const userDetails = localStorage.getItem('userDetails');
        if (userDetails) {
            const parsedUserDetails = JSON.parse(userDetails);
            setUserName(parsedUserDetails?.userName || 'User');
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
    }, [isClient, isRecording]); // Ensure stable dependencies

    const handleSend = () => {
        if (input.trim()) {
            const currentTime = new Date().toLocaleTimeString();
            const newMessages = [
                ...messages,
                { message: input, position: "right", time: currentTime }
            ];
            setMessages(newMessages);
            setInput("");

            setTimeout(() => {
                const botTime = new Date().toLocaleTimeString();
                setMessages(prevMessages => [
                    ...prevMessages,
                    { message: "This is a bot response.", position: "left", time: botTime }
                ]);
            }, 1000);
        }
    };

    const handleMicClick = () => {
        setIsRecording(prevRecording => !prevRecording);
    };

    return (
        <div className="c_mid_O">
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.position === "right" ? "user-message" : "bot-message"}`}
                    >
                        <div className="sender_Info">
                            {msg.position === "right" ? (
                                <>
                                    <Image
                                        src={usericon}
                                        alt="User Icon"
                                        layout="intrinsic"
                                        width={40}
                                        height={40}
                                    />
                                    <p className="text-black">{userName || 'User'}</p>
                                </>
                            ) : (
                                <>
                                    <Image
                                        src={Hiaicon}
                                        alt="HiA Icon"
                                        className="hia_icon"
                                        layout="intrinsic"
                                        width={100}
                                        height={100}
                                    />
                                    <p>HiA Coach</p>
                                </>
                            )}
                            <span>{msg.time}</span>
                        </div>
                        <p>{msg.message}</p>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <textarea
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend} className="sendBtn">
                    <Image
                        src={sendicon}
                        alt="Send Icon"
                        layout="intrinsic"
                        width={20}
                        height={20}
                    />
                    Send
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