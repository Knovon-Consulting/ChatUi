import React from "react";
import loginbg from '../../assests/1x/login-bg.png';
import HiAcoach from '../../assests/1x/heading.png';
import Col from 'react-bootstrap/Col';
function Sidepannel(){
    return(
    <>
       <Col xs={6}>
       <div className="bg_login">
       <img src={loginbg} className="s_pannle" alt="HiA_Coach" />     
       <img src={HiAcoach} className="l_head" />   
       </div>
       </Col>
    </>
    )
}

export default Sidepannel;