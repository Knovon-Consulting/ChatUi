"use client"; // Ensure this file is a client component

import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Image from 'next/image';
import { useRouter } from 'next/navigation'
function Formbox() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "" });
    const router = useRouter(); // Initialize Next.js router

    const validateForm = () => {
        let valid = true;
        const newErrors = { email: "", password: "" };

        if (!email) {
            newErrors.email = "Email is required";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
            valid = false;
        }

        if (!password) {
            newErrors.password = "Password is required";
            valid = false;
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        if (validateForm()) {
            // Generate userName by extracting part before "@" from email
            const userName = email.split("@")[0];

            // Store user details in localStorage
            const userDetails = {
                userId: 2, // Replace with actual user ID logic if needed
                userName: userName, // Generated userName from email
                email: email // Store the email from the form
            };
            localStorage.setItem("userDetails", JSON.stringify(userDetails));

            console.log("Form submitted:", { email, password, userName });
            setEmail("");
            setPassword("");
            setErrors({ email: "", password: "" });
            
    router.push('/Coach/conversation')
        }
    };
    return (
        <>
        <Col xs={6}>
            <div className="bg_form">
                <Image src="/assests/1x/HiA-logo@2x.png" layout="intrinsic" alt="hiALogo" width={220} height={10}  />
                <div className="f_outer">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="E_box mt-5">
                            <label>Email</label>
                            <span>
                                <input
                                    type="email"
                                    className="cstm_Inputs"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </span>
                            {errors.email && <p className="error">{errors.email}</p>}
                        </div>
                        <div className="E_box">
                            <label>Password</label>
                            <span>
                                <input
                                    type="password"
                                    className="cstm_Inputs"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </span>
                            {errors.password && <p className="error">{errors.password}</p>}
                        </div>
                        <button type="submit" className="lg_btn">Login</button>
                    </form>
                </div>
            </div>
        </Col>
        </>
    );
}

export default Formbox;
