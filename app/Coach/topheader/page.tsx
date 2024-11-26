"use client"
import React, { useEffect, useState } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from "next/image";

function TopHeader() {
  const [userName, setUserName] = useState(''); // State to store the username

  useEffect(() => {
    // Retrieve user details from localStorage when the component mounts
    const userDetails = localStorage.getItem('userDetails');
    
    if (userDetails) {
      const parsedUserDetails = JSON.parse(userDetails);
      if (parsedUserDetails && (typeof parsedUserDetails.userName === 'string' || typeof parsedUserDetails.first_name === 'string')) {
        setUserName(parsedUserDetails.userName || `${parsedUserDetails.first_name} ${parsedUserDetails.last_name}`); // Set the userName from localStorage
      }
    }
  }, []);


  return (
    <>
      <div className="hd_Otr">
        <Row>
          <Col xs={6} md={2}>
            <Image src='/assests/1x/HiA-logo2x.png' width={200} height={20} className="h_logo" alt="Logo" layout="intrinsic" />
          </Col>
          <Col xs={6} md={2} className="ms-auto">
            <div className="u_Dtls ms-auto">
              <p>{userName || 'User'}</p> 
              <Image src='/assests/1x/user-profile.png' alt="User Profile" width={25} height={25} layout="intrinsic"/>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default TopHeader;
