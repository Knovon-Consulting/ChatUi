import React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from '../../assests/1x/HiA-logo@2x.png';
import user from '../../assests/1x/user-profile.png';
function TopHader(){
 const UserName = 'Rahul Saini'   
return <>
<div className="hd_Otr">
<Row>
<Col md={2}>
<img src={logo} className="h_logo" />
</Col>
<Col md={2} className="ms-auto">
<div className="u_Dtls ms-auto">
<p>{UserName}</p>
<img src={user} />
</div>
</Col>
</Row>
</div>

</>

}


export default TopHader;