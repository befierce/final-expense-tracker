import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthForm from "./components/AuthFrom";
import ResetPassword from "./components/ResetPassword";
import ExpenseTracker from "./components/ExpenseTracker";
import ResetPasswordForm from "./components/ResetPasswordForm";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<AuthContainer />} /> */}
                <Route path="/" element={<AuthForm />} />
               <Route path="/main" element = { <ExpenseTracker/>}/>
               <Route path = "/forgotPassword" element ={<ResetPassword/>}/>
               <Route path="/resetPassword/:uuid" element ={<ResetPasswordForm/>}/>
                {/* <Route path="/main" element={<MainPage />} /> */}
            </Routes>
        </Router>
    );
};

export default App;
