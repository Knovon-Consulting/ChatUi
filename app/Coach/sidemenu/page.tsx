"use client";

import React, { useState, useEffect } from "react";
import chatintrac1 from "../../../public/assests/1x/chat-interaction-icon-with-bg1.png";
import Image from "next/image";
import newchat from "../../../public/assests/1x/new-chat-icon.png";
import axios from "axios";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import left from "../../../public/assests/1x/left.png"
import right from "../../../public/assests/1x/right.png"
function SideMenu() {
  const [chatsData, setChatsData] = useState([]);
  const [chatId, setChatId] = useState("");
  const [menuOpen, setMenuOpen] = useState(true); // Track menu state
  const router = useRouter(); // Initialize Next.js router

  // Load chat ID from localStorage
  useEffect(() => {
    const storedChatId = localStorage.getItem("chatId") || "";
    setChatId(storedChatId);
  }, []);

  // Fetch chat history
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
        const userId = userDetails.id; // Extracting user ID from localStorage
        const response = await axios.get(`/api/chat-history?userId=${userId}`);
        const data = response.data.map((chat: any) => ({
          ...chat,
          date: new Date(chat.created_at).toISOString().slice(0, 10),
        }));
        setChatsData(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChats();
  }, []);

  const handleChatClick = async (chatId: string) => {
    try {
      const response = await axios.get(`/api/fetch-chat?chat_id=${chatId}`);
      const chatData = response.data;
      const chatConversation: any[] = [];
      chatData.messages.forEach((msg: any) => {
        if (msg.user) {
          chatConversation.push({
            message: msg.user,
            position: "right",
          });
        }
        if (msg.coach) {
          chatConversation.push({
            message: [msg.coach],
            position: "left",
            user: { avatar: "/_next/static/media/chat-gpt.6414a60a.png" },
          });
        }
      });

      localStorage.setItem("conversation", JSON.stringify(chatConversation));
      setChatId(chatId.toString());
      localStorage.setItem("chatId", chatId.toString());
      router.replace(`/Coach/conversation/${chatId}`);
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };

  const handleNewChat = () => {
    const storedChats = localStorage.getItem("conversation") || "";
    if (storedChats && JSON.parse(storedChats).length > 0) {
      localStorage.removeItem("conversation");
    }
    const newChatId = uuidv4();
    router.replace(`/Coach/conversation/${newChatId}`);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen); // Toggle menu visibility

  return (
    <>
      <div className={`s_M_outer ${menuOpen ? "" : "hidden"}`}>
      <Image
        src={left}
        alt="left"
        width={50}
        height={50}
        className="menu_btn"
        onClick={toggleMenu}
      />
        <label>Your Previous</label>
        <h1>Coaching Interactions</h1>
        <Image
          src={newchat}
          alt="New chat icon"
          width={50}
          height={50}
          layout="intrinsic"
          title="New chat"
          onClick={handleNewChat}
        />
        <p>Recent Chats</p>
        <div className="l_outer">
          <ul>
            {chatsData.map((chat, index) => (
              <li key={index} onClick={() => handleChatClick(chat.chat_id)}>
                <div
                  className={`in_O ${
                    chatId === chat.chat_id.toString() ? "active" : ""
                  }`}
                >
                  <Image
                    src={chatintrac1}
                    alt={chat.chat_label}
                    width={40}
                    height={40}
                    layout="intrinsic"
                  />
                  <h1>{chat.chat_label}</h1>
                </div>
                <p>Date: {chat.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default SideMenu;
