"use client"
import React from "react";
import TopHader from "../topheader/page";
import SideHeader from "../sideheader/page";
import SideMenu from "../sidemenu/page";
import ChatMiddle from "../chatmiddle/page";

function conversation(){
    return <>
<div className="cb_O">
<TopHader></TopHader>
<div className="d-flex">
    <SideHeader></SideHeader>
    <SideMenu></SideMenu>
    <ChatMiddle></ChatMiddle>
</div>
</div>
    </>
}

export default conversation;