import React from "react";
import TopHader from "./Topheader";
import SideHeader from "./SideHeader";
import { Col } from "react-bootstrap";
import SideMenu from "./SideMenu";
import ChatMiddle from "./ChatMiddle";
function Chat(){
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

export default Chat;