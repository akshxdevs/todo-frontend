import { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../Styles/Auth.css';

export const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { 
            setShowError(true);
            return;
        }
        setShowError(false); 
        try {
            const res = await axios.post("http://13.236.193.198:3000/login", {
                email: email,
                password: password 
            });
            const data = res.data;
            if (res.status === 200) { 
                toast.success('Login Successful');
                const userId = data.user._id;
                localStorage.setItem("userId", userId);
                localStorage.setItem("username", data.user.name);
                localStorage.setItem("token", data.token);
                navigate('/usertodos');
            } else {
                toast.error("Login failed: " + data.error); 
            }
        } catch (error) {
            toast.error("An error occurred while logging in: " + error.toString());
        }
    }

    return (
        <div className="main-container">
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <h1 className="title">Todo App</h1>
                    <input type="email" placeholder="Email" className="email" onChange={(e) => { setEmail(e.target.value) }} /> 
                    <input type="password" placeholder="Password" className="password" onChange={(e) => { setPassword(e.target.value) }} />
                    <button type="submit" className="login-btn">Login</button>
                    <p className="signup-link">Don't have an account? 
                        <Link style={{ color: "black" }} to="/signup"> Signup</Link>
                    </p>
                </form>
            </div>
            {showError && (
                <span className="error-message">Please fill all fields!!</span> 
            )}
            <ToastContainer />
        </div>
    );
}
