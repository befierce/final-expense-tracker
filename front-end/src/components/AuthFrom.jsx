// import { useState } from "react";

// const SignUp = () => {
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: ""
//     });

//     const handleChange = (e) => {
//         // console.log("event value",e.target.value);
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//         console.log("form data",formData)
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch("http://localhost:3000/user/signUp", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(formData)
//             });
//             const data = await response.json();
//             console.log("Signup successful:", data);
//         } catch (error) {
//             console.error("Signup error:", error);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//                 <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label className="block mb-1">Username:</label>
//                         <input 
//                             type="text" 
//                             name="name" 
//                             value={formData.username} 
//                             onChange={handleChange} 
//                             className="w-full p-2 border rounded" 
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block mb-1">Email:</label>
//                         <input 
//                             type="email" 
//                             name="email" 
//                             value={formData.email} 
//                             onChange={handleChange} 
//                             className="w-full p-2 border rounded" 
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block mb-1">Password:</label>
//                         <input 
//                             type="password" 
//                             name="password" 
//                             value={formData.password} 
//                             onChange={handleChange} 
//                             className="w-full p-2 border rounded" 
//                             required
//                         />
//                     </div>
//                     <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
//                         Sign Up
//                     </button>
//                 </form>
//                 <p className="mt-4 text-center">
//                     Already a user? <a href="../login" className="text-blue-500">Login</a>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default SignUp;


import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AuthForm = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate(); // Initialize navigation

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isSignUp ? "http://localhost:3000/user/signUp" : "http://localhost:3000/user/login";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(isSignUp ? "Signup failed!" : "Login failed!");
            }

            const data = await response.json();
            console.log(isSignUp ? "Signup successful:" : "Login successful:", data);

            if (isSignUp) {
                // After signup, switch to login
                setIsSignUp(false);
            } else {
                // Save authentication details in localStorage (optional)
                localStorage.setItem("user", JSON.stringify(data));

                // Redirect to Main Page after successful login
                navigate("/main");
            }

            // Reset form fields
            setFormData({ name: "", email: "", password: "" });
        } catch (error) {
            console.error(isSignUp ? "Signup error:" : "Login error:", error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {isSignUp ? "Sign Up" : "Login"}
                </h2>
                <form onSubmit={handleSubmit}>
                    {isSignUp && (
                        <div className="mb-4">
                            <label className="block mb-1">Username:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block mb-1">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block mb-1">Password:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full p-2 border rounded"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-sm text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    >
                        {isSignUp ? "Sign Up" : "Login"}
                    </button>
                </form>
                <p className="mt-4 text-center">
                    {isSignUp ? "Already a user?" : "New here?"}{" "}
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setFormData({ name: "", email: "", password: "" });
                        }}
                        className="text-blue-500 underline"
                    >
                        {isSignUp ? "Login" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
