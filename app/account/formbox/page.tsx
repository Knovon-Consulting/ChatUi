"use client"; // Ensure this file is a client component

import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

function Formbox() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "", firstName: "", lastName: "" });
    const [isSignup, setIsSignup] = useState(false);
    const router = useRouter(); // Initialize Next.js router

    const validateForm = () => {
        let valid = true;
        const newErrors = { email: "", password: "", firstName: "", lastName: "" };

        if (isSignup && !firstName) {
            newErrors.firstName = "First name is required";
            valid = false;
        }

        if (isSignup && !lastName) {
            newErrors.lastName = "Last name is required";
            valid = false;
        }

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const apiPath = isSignup ? '/api/login' : '/api/verify-user';
                const requestData = isSignup ? { firstName, lastName, email, password } : { email, password };

                const response = await axios.post(apiPath, requestData, {
                    headers: { 'Content-Type': 'application/json' },
                });

                const userDetails = response.data;
                userDetails['userName'] = `${userDetails.first_name} ${userDetails.last_name}`
                localStorage.setItem("userDetails", JSON.stringify(userDetails));
                localStorage.removeItem("conversation");
                router.push(`/Coach/conversation/${uuidv4()}`);
            } catch (error) {
                console.error("Request failed:", error);
                setErrors({firstName: "", lastName: "", email: "Request failed. Please check your details.", password: "" });
            }
        }
    };

    return (
        <Col xs={12} sm={6} className="position-relative">
        <div className="m_set">
        <Image src='/assests/1x/HiA-logo2x.png' layout="intrinsic" alt="hiALogo" width={220} height={10}  className="d-sm-none d-block"/>
            <div className="bg_form">
            <Image src='/assests/1x/HiA-logo2x.png' layout="intrinsic" alt="hiALogo" width={220} height={10}  className="d-none d-sm-block"/>
            
            <div className={isSignup ? "s_outer" : "f_outer"}>
                    <h1>{isSignup ? "Sign Up" : "Login"}</h1>
                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <>
                                <div className="E_box">
                                    <label>First Name</label>
                                    <span>
                                        <input
                                            type="text"
                                            className="cstm_Inputs"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </span>
                                    {errors.firstName && <p className="error">{errors.firstName}</p>}
                                </div>
                                <div className="E_box">
                                    <label>Last Name</label>
                                    <span>
                                        <input
                                            type="text"
                                            className="cstm_Inputs"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </span>
                                    {errors.lastName && <p className="error">{errors.lastName}</p>}
                                </div>
                            </>
                        )}
                        <div className={`E_box ${!isSignup ? "mt-5" : ""}`}>
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
                        <button type="submit" className="lg_btn">{isSignup ? "Sign Up" : "Login"}</button>
                    </form>
                    <span onClick={() => setIsSignup(!isSignup)} className="signIn d-none">
                        {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                    </span>


                </div>
               
            </div>
            </div>
            
        </Col>
    );
}

export default Formbox;