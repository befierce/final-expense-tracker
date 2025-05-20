import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        {!forgotPassword && (
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
        )}
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
        <a href="" onClick={forgotPasswordHandler}>
          forgot password?
        </a>
      </div>
    </div>
  );
};

export default AuthForm;
