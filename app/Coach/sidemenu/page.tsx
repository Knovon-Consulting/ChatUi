"use client";

import React, { useState, useEffect } from "react";
import chatintrac1 from '../../../public/assests/1x/chat-interaction-icon-with-bg1.png';
import Image from "next/image";
import newchat from '../../../public/assests/1x/new-chat-icon.png';
import axios from 'axios';

function SideMenu() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [chatsData, setChatsData] = useState([]);
    const [chatId, setChatId] = useState("");
    useEffect(() => {
        setChatId(localStorage.getItem("chatId") || "")
    },[chatId])
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const userDetails = JSON.parse(localStorage.getItem("userDetails") || '{}');
                const userId = userDetails.id; // Extracting user ID from localStorage
                const response = await axios.get(`/api/chat-history?userId=${userId}`);
                const data = response.data.map(chat => ({
                    ...chat,
                    date: new Date(chat.created_at).toISOString().slice(0, 10) // Extract date from chat_label
                }));
                console.log(data)
                setChatsData(data);
            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        };

        fetchChats();
    }, []);

    const handleChatClick = async (chatId: string, index: number) => {
        try {
            const response = await axios.get(`/api/fetch-chat?chat_id=${chatId}`);
            const chatData = response.data;
            const chatConversation = []
            chatData.messages.map((msg) => {
                if (msg.user) {
                    chatConversation.push({
                        message: msg.user,
                        position: "right"
                    });
                }
                if (msg.coach) {
                    chatConversation.push({
                        message: [msg.coach],
                        position: "left",
                        user: {avatar: "/_next/static/media/chat-gpt.6414a60a.png"}
                    });
                }
            });

            localStorage.setItem("conversation", JSON.stringify(chatConversation));
            setChatId(chatId.toString())
            localStorage.setItem("chatId", chatId.toString());
            setActiveIndex(index);
        } catch (error) {
            console.error("Error fetching chat details:", error);
        }
    };

    return (
        <div className="s_M_outer">
            <label>Your Previous</label>
            <h1>Coaching Interactions</h1>
            <Image src={newchat} alt="New chat icon" width={50} height={50} layout="intrinsic" />
            <p>Recent Chats</p>
            <div className="l_outer">
                <ul>
                    {chatsData.map((chat, index) => (
                        <li key={chat.chat_id} onClick={() => handleChatClick(chat.chat_id, index)}>
                            <div className={`in_O ${chatId === chat.chat_id.toString() ? 'active' : ''}`}>
                                <Image src={chatintrac1} alt={chat.chat_label} width={40} height={40} layout="intrinsic" />
                                <h1>{chat.chat_label}</h1>
                            </div>
                            <p>Date: {chat.date}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SideMenu;