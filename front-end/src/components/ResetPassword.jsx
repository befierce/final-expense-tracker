import { useRef } from "react";


const ResetPassword = ()=>{
    const emailInput = useRef(null);

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
    }
    return <form onSubmit={resetPasswordHandler}> 
        <label>please enter your registerd email id</label><br></br>
        <input ref={emailInput}></input><br></br>
        <button>submit</button>
    </form>
}



export default ResetPassword;