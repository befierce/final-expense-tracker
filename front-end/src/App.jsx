import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthForm from "./components/AuthFrom";
// import MainPage from "./MainPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthContainer />} />
                {/* <Route path="/main" element={<MainPage />} /> */}
            </Routes>
        </Router>
    );
};

const AuthContainer = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(true);

    return <AuthForm isSignUp={isSignUp} setIsSignUp={setIsSignUp} navigate={navigate} />;
};

export default App;
