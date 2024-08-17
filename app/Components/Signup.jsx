import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Signup = () => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [passoword,setPassword] = useState("");
    const [showError,setshowError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !passoword ||!name)  {
            setshowError(true);
        }
        try {
            const res = await axios.post("http://13.236.193.198:3000/signup",{
                name:name,
                email:email,
                passoword:passoword
            });
            const data = res.data;
            if (response.status === 200) { 
                const userId = data.user._id;
                toast.success(`Welcome ${data.name}`);
                localStorage.setItem("userId", userId);
                localStorage.setItem("username", data.name);
                localStorage.setItem("token", data.token);
                navigate('/usertodos');
            } else {
                toast.error("Login failed: " + data.error); 
            }
        } catch (error) {
            toast.error("An error occurred while logging in: " + error.toString());
        }
    }
    return(
        <div>
            <form action="" onSubmit={(e)=>{handleSubmit(e)}}>
            <input type="text" placeholder="name" onChange={(e)=>{setName(e.target.value)}}/>
            <input type="text" placeholder="email" onChange={(e)=>{setEmail(e.target.value)}}/>
            <input type="text" placeholder="password" onChange={(e)=>{setPassword(e.target.value)}}/>
            <button type="submit">signup</button>
            </form>
            {showError && (
                <span>Please fill all required fields!!</span>
            )}
            <ToastContainer />
        </div>
    );
}