import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthForm from "./components/AuthFrom";
import ResetPassword from "./components/ResetPassword";
// import MainPage from "./MainPage";
import ExpenseTracker from "./components/ExpenseTracker";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<AuthContainer />} /> */}
                <Route path="/" element={<AuthForm />} />
               <Route path="/main" element = { <ExpenseTracker/>}/>
               <Route path = "/forgotPassword" element ={<ResetPassword/>}/>
                {/* <Route path="/main" element={<MainPage />} /> */}
            </Routes>
        </Router>
    );
};

// const AuthContainer = () => {
//     const navigate = useNavigate();
//     const [isSignUp, setIsSignUp] = useState(true);

//     return <AuthForm isSignUp={isSignUp} setIsSignUp={setIsSignUp} navigate={navigate} />;
// };

export default App;
