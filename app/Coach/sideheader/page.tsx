"use client";

import React from "react";
import { useRouter } from 'next/navigation'
import Image from "next/image";
function SideHeader(){
    const router = useRouter();

    const handleLogout = () => {    
        router.push("/"); // Navigate to the login page
    };
    return <>
 <div className="s_hdr d-none d-sm-flex">
 <Image src="/assests/1x/chat-icon.png" alt="chaticon"  width={100} height={20}     layout="intrinsic"/>
<Image src="/assests/1x/logout-con.png" alt="logout" onClick={handleLogout} width={100} height={25}  title="logout"   layout="intrinsic" />

 </div>
    </>
}

export default SideHeader;
