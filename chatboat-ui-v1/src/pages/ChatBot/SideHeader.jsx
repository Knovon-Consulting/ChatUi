import React from "react";
import logout from '../../assests/1x/logout-con.png'
import chaticon from '../../assests/1x/chat-icon.png'
import { useNavigate } from "react-router-dom";
function SideHeader(){
    const navigate = useNavigate(); 

    const handleLogout = () => {    
        navigate("/login"); // Navigate to the login page
    };
    return <>
 <div className="s_hdr">
 <img src={chaticon} alt="chaticon" />
<img src={logout} alt="logout" onClick={handleLogout}  />

 </div>
    </>
}

export default SideHeader;
