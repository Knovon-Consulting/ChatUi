"use client";
import React from "react";
import TopHeader from "../../topheader/page";
import SideHeader from "../../sideheader/page";
import SideMenu from "../../sidemenu/page";
import ChatMiddle from "../../chatmiddle/page";
import { useParams } from "next/navigation";

function conversation() {
  const params = useParams(); // Use useParams to retrieve dynamic path params
  const chatId = params?.conversationId as string; // Access the conversationId from the URL
  localStorage.setItem("chatId", chatId);

  return (
    <>
      <div className="cb_O">
        <TopHeader></TopHeader>
        <div className="d-flex">
          <SideHeader></SideHeader>
          <SideMenu></SideMenu>
          <ChatMiddle></ChatMiddle>
        </div>
      </div>
    </>
  );
}

export default conversation;
