import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = ()=>{
    const emailInput = useRef(null);
    const navigate = useNavigate();
    const resetPasswordHandler = async (e)=>{
        const email = emailInput.current.value;
        e.preventDefault();
        const response = await fetch("http://localhost:3000/user/password/forgotPassword",{
            method: "POST",
            body: JSON.stringify({email: email}),
            headers:{
                "content-type":"Application/json",
            }
        })
            if(response.status === 404){
                window.alert("user not found please enter the registerd email");
            }
            if(response.status === 500){
                window.alert("can't send email something went wrong");
            }
            if(response.status === 200){
                window.alert("password reset link sent to the registerd email");
            }
            navigate("/")
    }
    return <form onSubmit={resetPasswordHandler}> 
        <label>please enter your registerd email id</label><br></br>
        <input ref={emailInput}></input><br></br>
        <button>submit</button>
    </form>
}



export default ResetPassword;