import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure this is present
import logo from '../../assests/1x/HiA-logo@2x.png';
import Col from 'react-bootstrap/Col';

function Formbox() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const navigate = useNavigate(); // Initialize navigate

    const validateForm = () => {
        let valid = true;
        const newErrors = { email: '', password: '' };

        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', { email, password });
            setEmail('');
            setPassword('');
            setErrors({ email: '', password: '' });
            navigate('/chat'); // Navigate to the desired route
        }
    };

    return (
        <Col xs={6}>
            <div className="bg_form">
                <img src={logo} alt="hiALogo" />
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
    );
}

export default Formbox;
