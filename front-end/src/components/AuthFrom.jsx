import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./AuthFrom.css";
import {FaEye, FaEyeSlash } from "react-icons/fa"

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // Initialize navigation
  const forgotPasswordHandler = () => {
    navigate("/forgotPassword");
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp
      ? "http://localhost:3000/user/signUp"
      : "http://localhost:3000/user/login";
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
      const token = data.token;
      if (isSignUp) {
        setIsSignUp(false);
      } else {
        console.log(data);
        localStorage.setItem("token", token);
        navigate("/main");
      }
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error(isSignUp ? "Signup error:" : "Login error:", error.message);
    }
  };
  return (
    <>
    <div className="header-container">
      <h1 className="header">YOUR EXPENSE TRACKER</h1>
    </div>
      
      <div className="login-form-outer-container">
        <div className="login-form-inner-container">
        <h2>
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        {!forgotPassword && (
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="username-input-container">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="username-input"
                  required
                />
              </div>
            )}
            <div className="email-input-container">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="email-input"
                required
              />
            </div>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="password-input"
                required
              />
              <span
                type="button"
                className="show-password-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* {showPassword ? <FaEyeSlash/> : <FaEye/>} */}
              </span>
            </div>
            <div className="submit-button-container">
              <button
              type="submit"
              className="submit-button"
            >
              {isSignUp ? "Sign Up" : "Login"}
            </button>
            </div>
            
          </form>
        )}
        <p className="already-user">
          {isSignUp ? "Already a user?" : "New here?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setFormData({ name: "", email: "", password: "" });
            }}
            className="toggle-button"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
        <a href="" onClick={forgotPasswordHandler}>
          forgot password?
        </a>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
