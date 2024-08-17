import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';  
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");  
    const [showError, setShowError] = useState(false);  
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !name) {  
            setShowError(true);
            return; 
        }
        try {
            const res = await axios.post("http://13.236.193.198:3000/signup", {
                name: name,
                email: email,
                password: password  
            });
            const data = res.data;
            if (res.status === 200) {  
                const userId = data.user._id;
                toast.success(`Welcome ${data.name}`);
                localStorage.setItem("userId", userId);
                localStorage.setItem("username", data.name);
                localStorage.setItem("token", data.token);
                navigate('/usertodos');
            } else {
                toast.error("Signup failed: " + data.error);  
            }
        } catch (error) {
            toast.error("An error occurred during signup: " + error.toString()); 
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />  {/* Changed to email type */}
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />  {/* Changed to password type */}
                <button type="submit">Signup</button>
            </form>
            {showError && (
                <span>Please fill all required fields!!</span>
            )}
            <ToastContainer />
        </div>
    );
};
