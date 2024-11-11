import React, { useState } from "react";
import chatintrac1 from '../../assests/1x/chat-interaction-icon-with-bg1.png'
import chatintrac2 from '../../assests/1x/chat-interaction-icon-with-bg2.png'
import chatintrac3 from '../../assests/1x/chat-interaction-icon-with-bg3.png'
import newchat from '../../assests/1x/new-chat-icon.png'

function SideMenu() {
    const [activeIndex, setActiveIndex] = useState(null);
    const ChatsData = [
        { imgSrc: chatintrac1, title: 'Improving Presentation Skills', date: '06-11-2024' },
        { imgSrc: chatintrac2, title: 'Assessing Coaching Goals.', date: '06-11-2024' },
        { imgSrc: chatintrac3, title: 'Improving Questioning Skills', date: '06-11-2024' },
    ];
  return (
    <>
      <div className="s_M_outer">
        <label>Your Previous</label>
        <h1>Coaching Interactions</h1>
        <img src={newchat} />
        <p>Recent Chats</p>
        <div className="l_outer">
          <ul>
          {ChatsData.map((chat, index) => (
                        <li key={index} onClick={() => setActiveIndex(index)}>
                            <div className={`in_O ${activeIndex === index ? 'active' : ''}`}>
                                <img src={chat.imgSrc} alt={chat.title} />
                                <h1>{chat.title}</h1>
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
