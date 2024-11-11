import React from "react";
import Col from 'react-bootstrap/Col';
import Image from 'next/image';
function Sidepannel(){
    return(
    <>
       <Col xs={6}>
       <div className="bg_login">
       <Image src='/assests/1x/login-bg.png' className="s_pannle" alt="HiA_Coach"  width={1000} height={200}/>
       <Image src='/assests/1x/heading.png' layout="intrinsic" className="l_head" width={300} height={20} alt="HiAlogo" /> 
       </div>
       </Col>
       </>
    )
}

export default Sidepannel;