import React, { useState } from "react";
import sendicon from '../../assests/1x/send-icon.png';
import usericon from '../../assests/1x/user-profile.png';
import Hiaicon from '../../assests/1x/coach-profile-icon.png';
import micicon from '../../assests/1x/mic-icon-bg.png';

function ChatMiddle() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const UserName = 'Rahul Saini';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (recognition) {
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(prevInput => prevInput + " " + transcript); // Append transcript to input field
            setIsRecording(false);
        };

        recognition.onerror = () => {
            setIsRecording(false);
        };
    }

    const handleSend = () => {
        if (input.trim()) {
            const currentTime = new Date().toLocaleTimeString();
            const newMessages = [...messages, { text: input, sender: "user", time: currentTime }];
            setMessages(newMessages);
            setInput("");

            setTimeout(() => {
                const botTime = new Date().toLocaleTimeString();
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: "This is a bot response.", sender: "bot", time: botTime }
                ]);
            }, 1000);
        }
    };

    const handleMicClick = () => {
        if (recognition) {
            if (isRecording) {
                recognition.stop();
                setIsRecording(false);
            } else {
                recognition.start();
                setIsRecording(true);
            }
        } else {
            alert("Speech Recognition is not supported in this browser.");
        }
    };

    return (
        <>
            <div className="c_mid_O">
                <div className="chat-window">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
                        >
                            <div className="sender_Info">
                                {msg.sender === "user" ? (
                                    <>
                                        <img src={usericon} alt="User Icon" />
                                        <p className="text-black">{UserName}</p>
                                    </>
                                ) : (
                                    <>
                                        <img src={Hiaicon} alt="HiA Icon" className="hia_icon" />
                                        <p>HiA Coach</p>
                                    </>
                                )}
                                <span>{msg.time}</span>
                            </div>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <textarea
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button onClick={handleSend} className="sendBtn">
                        <img src={sendicon} alt="Send Icon" />Send
                    </button>
                    <img 
                        src={micicon} 
                        alt="Mic Icon" 
                        className={`mic_Icon ${isRecording ? "recording" : ""}`} 
                        onClick={handleMicClick} 
                    />
                </div>
            </div>
        </>
    );
}

export default ChatMiddle;
